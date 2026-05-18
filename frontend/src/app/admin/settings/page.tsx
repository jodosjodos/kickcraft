"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  useStoreSettings,
  useUpdateStoreSettings,
  useNotificationPrefs,
  useUpdateNotificationPrefs,
  useTeam,
  useCreateAdmin,
  useRemoveAdmin,
  useSessions,
  useRevokeSession,
  useSetup2FA,
  useEnable2FA,
  useDisable2FA,
  useChangePasswordDirect,
} from "@/hooks/api/use-settings";
import type { NotificationPrefsMap } from "@/types/api/settings";
import type { ApiError } from "@/types/api/common";

type SettingsTab = "general" | "team" | "notifications" | "security";

const NOTIF_ITEMS = [
  { key: "new_order", label: "New Order", description: "When a customer places an order" },
  { key: "low_stock", label: "Low Stock Alert", description: "When a product drops below threshold" },
  { key: "new_review", label: "New Review", description: "When a customer submits a review" },
  { key: "new_customer", label: "New Customer", description: "When a new account is registered" },
  { key: "failed_payment", label: "Failed Payment", description: "When a payment attempt fails" },
  { key: "return_request", label: "Return Request", description: "When a customer requests a return" },
];

const TABS: { value: SettingsTab; label: string; icon: string }[] = [
  { value: "general", label: "General", icon: "settings" },
  { value: "team", label: "Team", icon: "group" },
  { value: "notifications", label: "Notifications", icon: "notifications" },
  { value: "security", label: "Security", icon: "shield" },
];

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("general");

  // ── General ──────────────────────────────────────────────────────────────
  const { data: storeSettings } = useStoreSettings();
  const updateStore = useUpdateStoreSettings();
  const [generalForm, setGeneralForm] = useState({
    storeName: "", storeEmail: "", phone: "", timezone: "Africa/Kigali", currency: "RWF", language: "en",
  });
  const [storeSaved, setStoreSaved] = useState(false);

  useEffect(() => {
    if (storeSettings) {
      setGeneralForm({
        storeName: storeSettings.storeName,
        storeEmail: storeSettings.storeEmail,
        phone: storeSettings.phone,
        timezone: storeSettings.timezone,
        currency: storeSettings.currency,
        language: storeSettings.language,
      });
    }
  }, [storeSettings]);

  async function handleSaveStore(e: React.FormEvent) {
    e.preventDefault();
    await updateStore.mutateAsync({
      storeName: generalForm.storeName,
      storeEmail: generalForm.storeEmail,
      phone: generalForm.phone,
      timezone: generalForm.timezone,
      currency: generalForm.currency,
      language: generalForm.language,
    });
    setStoreSaved(true);
    setTimeout(() => setStoreSaved(false), 2000);
  }

  // ── Team ─────────────────────────────────────────────────────────────────
  const { data: team = [] } = useTeam();
  const createAdmin = useCreateAdmin();
  const removeAdmin = useRemoveAdmin();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [inviteError, setInviteError] = useState<string | null>(null);

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setInviteError(null);
    try {
      await createAdmin.mutateAsync(inviteForm);
      setShowInvite(false);
      setInviteForm({ name: "", email: "", phone: "", password: "" });
    } catch (err) {
      setInviteError((err as ApiError)?.message ?? "Failed to create admin");
    }
  }

  async function handleRemoveAdmin(id: string) {
    if (!window.confirm("Remove this admin? They will lose access immediately.")) return;
    await removeAdmin.mutateAsync(id);
  }

  // ── Notifications ─────────────────────────────────────────────────────────
  const { data: notifPrefs } = useNotificationPrefs();
  const updateNotifPrefs = useUpdateNotificationPrefs();
  const [localPrefs, setLocalPrefs] = useState<NotificationPrefsMap>({});

  useEffect(() => {
    if (notifPrefs) setLocalPrefs(notifPrefs.prefs);
  }, [notifPrefs]);

  async function toggleNotif(key: string, type: "email" | "inApp") {
    const updated: NotificationPrefsMap = {
      ...localPrefs,
      [key]: { ...localPrefs[key], [type]: !localPrefs[key]?.[type] },
    };
    setLocalPrefs(updated);
    await updateNotifPrefs.mutateAsync(updated);
  }

  // ── Security ─────────────────────────────────────────────────────────────
  const { data: sessions = [] } = useSessions();
  const revokeSession = useRevokeSession();
  const changePassword = useChangePasswordDirect();
  const setup2FA = useSetup2FA();
  const enable2FA = useEnable2FA();
  const disable2FA = useDisable2FA();

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  const [qrData, setQrData] = useState<{ secret: string; qrDataUrl: string } | null>(null);
  const [totpInput, setTotpInput] = useState("");
  const [totpError, setTotpError] = useState<string | null>(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    if (pwForm.next !== pwForm.confirm) { setPwError("New passwords do not match"); return; }
    if (pwForm.next.length < 8) { setPwError("Password must be at least 8 characters"); return; }
    try {
      await changePassword.mutateAsync({ currentPassword: pwForm.current, newPassword: pwForm.next });
      setPwSuccess(true);
      setPwForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwSuccess(false), 2000);
    } catch (err) {
      setPwError((err as ApiError)?.message ?? "Failed to update password");
    }
  }

  async function handleSetup2FA() {
    const data = await setup2FA.mutateAsync();
    setQrData(data);
    setTotpInput("");
    setTotpError(null);
  }

  async function handleEnable2FA(e: React.FormEvent) {
    e.preventDefault();
    setTotpError(null);
    try {
      await enable2FA.mutateAsync(totpInput);
      setTwoFAEnabled(true);
      setQrData(null);
      setTotpInput("");
    } catch (err) {
      setTotpError((err as ApiError)?.message ?? "Invalid token");
    }
  }

  async function handleDisable2FA(e: React.FormEvent) {
    e.preventDefault();
    setTotpError(null);
    try {
      await disable2FA.mutateAsync(totpInput);
      setTwoFAEnabled(false);
      setTotpInput("");
    } catch (err) {
      setTotpError((err as ApiError)?.message ?? "Invalid token");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">System</p>
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mt-0.5">Settings</h1>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        {/* Side tabs */}
        <div className="md:w-44 shrink-0">
          <div className="space-y-0.5">
            {TABS.map(({ value, label, icon }) => (
              <button key={value} onClick={() => setTab(value)}
                className={cn("flex items-center gap-2.5 w-full px-3 py-2.5 font-body text-sm font-semibold transition-all",
                  tab === value ? "bg-primary/10 text-primary" : "text-text-muted hover:text-text hover:bg-surface-elevated"
                )}>
                <span className={cn("material-symbols-outlined text-[17px]", tab === value ? "icon-filled" : "icon-outline")}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* ── General ── */}
          {tab === "general" && (
            <div className="border border-border bg-surface p-5">
              <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">Store Information</h2>
              <form onSubmit={handleSaveStore} className="space-y-4">
                {[
                  { key: "storeName", label: "Store Name", type: "text" },
                  { key: "storeEmail", label: "Store Email", type: "email" },
                  { key: "phone", label: "Support Phone", type: "tel" },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">{label}</label>
                    <input
                      type={type}
                      value={generalForm[key as keyof typeof generalForm]}
                      onChange={(e) => setGeneralForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full max-w-sm px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-3 max-w-sm">
                  {[
                    { key: "timezone", label: "Timezone", options: ["Africa/Kigali", "Africa/Nairobi", "UTC"] },
                    { key: "currency", label: "Currency", options: ["RWF", "USD", "EUR"] },
                    { key: "language", label: "Language", options: ["en", "fr", "rw"] },
                  ].map(({ key, label, options }) => (
                    <div key={key}>
                      <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">{label}</label>
                      <select
                        value={generalForm[key as keyof typeof generalForm]}
                        onChange={(e) => setGeneralForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors"
                      >
                        {options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={updateStore.isPending}
                    className="bg-primary text-white px-4 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors disabled:opacity-50"
                  >
                    {updateStore.isPending ? "Saving…" : "Save Changes"}
                  </button>
                  {storeSaved && <span className="font-body text-xs text-secondary">Saved</span>}
                </div>
              </form>
            </div>
          )}

          {/* ── Team ── */}
          {tab === "team" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                  {team.length} admin{team.length !== 1 ? "s" : ""}
                </p>
                <button onClick={() => setShowInvite(true)}
                  className="flex items-center gap-1.5 bg-primary text-white px-3.5 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors">
                  <span className="material-symbols-outlined icon-outline text-[15px]">person_add</span>
                  Add Admin
                </button>
              </div>

              {showInvite && (
                <form onSubmit={handleCreateAdmin} className="border border-primary/30 bg-primary/5 p-4 space-y-3">
                  <p className="font-body text-xs font-semibold text-text">Add new admin account</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "name", placeholder: "Full name", type: "text" },
                      { key: "email", placeholder: "Email", type: "email" },
                      { key: "phone", placeholder: "Phone (+250…)", type: "tel" },
                      { key: "password", placeholder: "Temp password (min 8 chars)", type: "password" },
                    ].map(({ key, placeholder, type }) => (
                      <input
                        key={key}
                        type={type}
                        placeholder={placeholder}
                        value={inviteForm[key as keyof typeof inviteForm]}
                        onChange={(e) => setInviteForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
                      />
                    ))}
                  </div>
                  {inviteError && <p className="font-body text-xs text-error">{inviteError}</p>}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={createAdmin.isPending}
                      className="bg-primary text-white px-3.5 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors disabled:opacity-50"
                    >
                      {createAdmin.isPending ? "Creating…" : "Create"}
                    </button>
                    <button type="button" onClick={() => setShowInvite(false)} className="px-3 py-2 border border-border text-text-muted hover:text-text transition-colors">
                      <span className="material-symbols-outlined icon-outline text-[16px]">close</span>
                    </button>
                  </div>
                </form>
              )}

              <div className="border border-border bg-surface">
                <div className="hidden md:grid grid-cols-[1fr_120px_120px_60px] gap-4 px-5 py-2.5 border-b border-border bg-surface-elevated">
                  {["Member", "Role", "Joined", ""].map((h) => (
                    <p key={h} className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">{h}</p>
                  ))}
                </div>
                <div className="divide-y divide-border">
                  {team.map((m) => (
                    <div key={m.id} className="flex md:grid md:grid-cols-[1fr_120px_120px_60px] gap-4 items-center px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 flex items-center justify-center font-heading text-xs font-extrabold shrink-0 bg-primary/20 text-primary">
                          {initials(m.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-body text-sm font-semibold text-text truncate">{m.name}</p>
                          <p className="font-body text-[10px] text-text-muted truncate">{m.email}</p>
                        </div>
                      </div>
                      <p className="hidden md:block font-body text-xs text-text-muted">Admin</p>
                      <p className="hidden md:block font-body text-[10px] text-text-muted">
                        {new Date(m.createdAt).toLocaleDateString("en-RW", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <div className="flex items-center gap-1 ml-auto md:ml-0">
                        {(
                          <button
                            onClick={() => void handleRemoveAdmin(m.id)}
                            disabled={removeAdmin.isPending}
                            className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                            title="Remove admin"
                          >
                            <span className="material-symbols-outlined icon-outline text-[15px]">person_remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {tab === "notifications" && (
            <div className="border border-border bg-surface">
              <div className="grid grid-cols-[1fr_60px_60px] gap-4 px-5 py-2.5 border-b border-border bg-surface-elevated">
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Event</p>
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted text-center">Email</p>
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted text-center">In-App</p>
              </div>
              <div className="divide-y divide-border">
                {NOTIF_ITEMS.map((item) => {
                  const pref = localPrefs[item.key] ?? { email: false, inApp: false };
                  return (
                    <div key={item.key} className="grid grid-cols-[1fr_60px_60px] gap-4 items-center px-5 py-4">
                      <div>
                        <p className="font-body text-sm font-semibold text-text">{item.label}</p>
                        <p className="font-body text-[10px] text-text-muted mt-0.5">{item.description}</p>
                      </div>
                      {(["email", "inApp"] as const).map((type) => (
                        <div key={type} className="flex justify-center">
                          <button
                            onClick={() => void toggleNotif(item.key, type)}
                            className={cn("w-9 h-5 relative transition-colors duration-200", pref[type] ? "bg-primary" : "bg-surface-elevated")}
                            role="switch"
                            aria-checked={pref[type]}
                          >
                            <span className={cn("absolute top-0.5 w-4 h-4 bg-white transition-all duration-200", pref[type] ? "left-[calc(100%-18px)]" : "left-0.5")} />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Security ── */}
          {tab === "security" && (
            <div className="space-y-5">
              {/* Change password */}
              <div className="border border-border bg-surface p-5">
                <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
                  {[
                    { key: "current", label: "Current Password" },
                    { key: "next", label: "New Password" },
                    { key: "confirm", label: "Confirm New Password" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">{label}</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={pwForm[key as keyof typeof pwForm]}
                        onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors"
                      />
                    </div>
                  ))}
                  {pwError && <p className="font-body text-xs text-error">{pwError}</p>}
                  {pwSuccess && <p className="font-body text-xs text-secondary">Password updated</p>}
                  <button
                    type="submit"
                    disabled={changePassword.isPending}
                    className="bg-primary text-white px-4 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors disabled:opacity-50 mt-1"
                  >
                    {changePassword.isPending ? "Updating…" : "Update Password"}
                  </button>
                </form>
              </div>

              {/* 2FA */}
              <div className="border border-border bg-surface p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">Two-Factor Authentication</h2>
                    <p className="font-body text-xs text-text-muted mt-0.5">Add an extra layer of security via authenticator app</p>
                  </div>
                  <button
                    onClick={twoFAEnabled ? undefined : () => void handleSetup2FA()}
                    disabled={setup2FA.isPending}
                    className={cn(
                      "w-11 h-6 relative transition-colors duration-200 disabled:opacity-50",
                      twoFAEnabled ? "bg-primary" : "bg-surface-elevated",
                    )}
                    role="switch"
                    aria-checked={twoFAEnabled}
                  >
                    <span className={cn("absolute top-0.5 w-5 h-5 bg-white transition-all duration-200", twoFAEnabled ? "left-[calc(100%-22px)]" : "left-0.5")} />
                  </button>
                </div>

                {/* QR setup flow */}
                {qrData && !twoFAEnabled && (
                  <div className="mt-4 space-y-3">
                    <p className="font-body text-xs text-text-muted">Scan this QR code in your authenticator app, then enter the 6-digit code to confirm.</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrData.qrDataUrl} alt="2FA QR code" className="w-40 h-40 bg-white p-1" />
                    <p className="font-body text-[10px] font-mono text-text-muted break-all">Manual: {qrData.secret}</p>
                    <form onSubmit={handleEnable2FA} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="6-digit code"
                        maxLength={6}
                        value={totpInput}
                        onChange={(e) => setTotpInput(e.target.value)}
                        className="w-36 px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={enable2FA.isPending}
                        className="bg-primary text-white px-3 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors disabled:opacity-50"
                      >
                        {enable2FA.isPending ? "Verifying…" : "Enable"}
                      </button>
                    </form>
                    {totpError && <p className="font-body text-xs text-error">{totpError}</p>}
                  </div>
                )}

                {/* Disable flow */}
                {twoFAEnabled && (
                  <div className="mt-4 space-y-3">
                    <p className="font-body text-xs text-secondary font-semibold">2FA is active</p>
                    <form onSubmit={handleDisable2FA} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code to disable"
                        maxLength={6}
                        value={totpInput}
                        onChange={(e) => setTotpInput(e.target.value)}
                        className="w-40 px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={disable2FA.isPending}
                        className="px-3 py-2 border border-error/40 font-body text-xs font-semibold text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                      >
                        {disable2FA.isPending ? "Disabling…" : "Disable 2FA"}
                      </button>
                    </form>
                    {totpError && <p className="font-body text-xs text-error">{totpError}</p>}
                  </div>
                )}
              </div>

              {/* Active sessions */}
              <div className="border border-border bg-surface">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">Active Sessions</h2>
                </div>
                <div className="divide-y divide-border">
                  {sessions.length === 0 && (
                    <div className="px-5 py-6 text-center">
                      <p className="font-body text-sm text-text-muted">No active sessions found</p>
                    </div>
                  )}
                  {sessions.map((s) => {
                    const ua = s.userAgent ?? "Unknown device";
                    const isMobile = ua.toLowerCase().includes("iphone") || ua.toLowerCase().includes("android");
                    return (
                      <div key={s.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined icon-outline text-[20px] text-text-muted">
                            {isMobile ? "smartphone" : "laptop_mac"}
                          </span>
                          <div>
                            <p className="font-body text-sm font-semibold text-text">{ua.slice(0, 60)}</p>
                            <p className="font-body text-[10px] text-text-muted">
                              {s.ip ?? "—"} ·{" "}
                              {s.lastSeenAt
                                ? new Date(s.lastSeenAt).toLocaleString("en-RW", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                                : "Never"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => void revokeSession.mutateAsync(s.id)}
                          disabled={revokeSession.isPending}
                          className="px-3 py-1.5 border border-error/40 font-body text-[10px] font-semibold uppercase tracking-wider text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                        >
                          Revoke
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
