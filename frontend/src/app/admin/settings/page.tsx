"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type SettingsTab = "general" | "team" | "notifications" | "security";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "manager" | "viewer";
  initials: string;
  color: string;
  lastActive: string;
  status: "active" | "pending";
}

const MOCK_TEAM: TeamMember[] = [
  { id: "1", name: "Jean Admin", email: "admin@kickcraft.com", role: "super_admin", initials: "JA", color: "bg-primary/20 text-primary", lastActive: "Now", status: "active" },
  { id: "2", name: "Marie Manager", email: "marie@kickcraft.com", role: "manager", initials: "MM", color: "bg-secondary/20 text-secondary", lastActive: "2h ago", status: "active" },
  { id: "3", name: "Eric Viewer", email: "eric@kickcraft.com", role: "viewer", initials: "EV", color: "bg-[#ffb5a0]/20 text-[#ffb5a0]", lastActive: "1d ago", status: "active" },
  { id: "4", name: "Pending User", email: "pending@kickcraft.com", role: "viewer", initials: "PU", color: "bg-surface-elevated text-text-muted", lastActive: "—", status: "pending" },
];

const ROLE_LABELS: Record<TeamMember["role"], string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  viewer: "Viewer",
};

const SESSIONS = [
  { device: "Chrome / macOS", location: "Kigali, Rwanda", lastActive: "Now (current)", current: true },
  { device: "Safari / iPhone", location: "Kigali, Rwanda", lastActive: "3h ago", current: false },
  { device: "Firefox / Windows", location: "Nairobi, Kenya", lastActive: "2d ago", current: false },
];

const NOTIFICATION_ITEMS = [
  { key: "new_order", label: "New Order", description: "When a customer places an order" },
  { key: "low_stock", label: "Low Stock Alert", description: "When a product drops below threshold" },
  { key: "new_review", label: "New Review", description: "When a customer submits a review" },
  { key: "new_customer", label: "New Customer", description: "When a new account is registered" },
  { key: "failed_payment", label: "Failed Payment", description: "When a payment attempt fails" },
  { key: "return_request", label: "Return Request", description: "When a customer requests a return" },
];

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("general");
  const [team, setTeam] = useState(MOCK_TEAM);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("viewer");
  const [notifications, setNotifications] = useState<Record<string, { email: boolean; inApp: boolean }>>(
    Object.fromEntries(NOTIFICATION_ITEMS.map((n) => [n.key, { email: true, inApp: true }]))
  );
  const [twoFA, setTwoFA] = useState(false);
  const [generalForm, setGeneralForm] = useState({
    storeName: "KickCraft", email: "hello@kickcraft.com", phone: "+250 788 000 000",
    timezone: "Africa/Kigali", currency: "RWF", language: "en",
  });

  const TABS: { value: SettingsTab; label: string; icon: string }[] = [
    { value: "general", label: "General", icon: "settings" },
    { value: "team", label: "Team", icon: "group" },
    { value: "notifications", label: "Notifications", icon: "notifications" },
    { value: "security", label: "Security", icon: "shield" },
  ];

  function toggleNotif(key: string, type: "email" | "inApp") {
    setNotifications((prev) => ({
      ...prev,
      [key]: { ...prev[key], [type]: !prev[key][type] },
    }));
  }

  function removeTeamMember(id: string) {
    setTeam((prev) => prev.filter((m) => m.id !== id));
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
          {/* General */}
          {tab === "general" && (
            <div className="space-y-6">
              <div className="border border-border bg-surface p-5">
                <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">Store Information</h2>
                <div className="space-y-4">
                  {[
                    { key: "storeName", label: "Store Name", type: "text" },
                    { key: "email", label: "Store Email", type: "email" },
                    { key: "phone", label: "Support Phone", type: "tel" },
                  ].map(({ key, label, type }) => (
                    <div key={key}>
                      <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">{label}</label>
                      <input type={type} value={generalForm[key as keyof typeof generalForm]}
                        onChange={(e) => setGeneralForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="w-full max-w-sm px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors" />
                    </div>
                  ))}
                  <div className="grid grid-cols-3 gap-3 max-w-sm">
                    <div>
                      <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Timezone</label>
                      <select value={generalForm.timezone} onChange={(e) => setGeneralForm((f) => ({ ...f, timezone: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors">
                        <option value="Africa/Kigali">Africa/Kigali</option>
                        <option value="Africa/Nairobi">Africa/Nairobi</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Currency</label>
                      <select value={generalForm.currency} onChange={(e) => setGeneralForm((f) => ({ ...f, currency: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors">
                        <option value="RWF">RWF</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Language</label>
                      <select value={generalForm.language} onChange={(e) => setGeneralForm((f) => ({ ...f, language: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors">
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="rw">Kinyarwanda</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-border flex justify-end">
                  <button className="bg-primary text-white px-4 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Team */}
          {tab === "team" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                  {team.length} member{team.length !== 1 ? "s" : ""}
                </p>
                <button onClick={() => setShowInvite(true)}
                  className="flex items-center gap-1.5 bg-primary text-white px-3.5 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors">
                  <span className="material-symbols-outlined icon-outline text-[15px]">person_add</span>
                  Invite Member
                </button>
              </div>

              {showInvite && (
                <div className="border border-primary/30 bg-primary/5 p-4 space-y-3">
                  <p className="font-body text-xs font-semibold text-text">Invite a new team member</p>
                  <div className="flex gap-2">
                    <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Email address"
                      className="flex-1 px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors" />
                    <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as TeamMember["role"])}
                      className="px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors">
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <button onClick={() => { setShowInvite(false); setInviteEmail(""); }}
                      className="bg-primary text-white px-3.5 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors">
                      Send
                    </button>
                    <button onClick={() => setShowInvite(false)} className="px-3 py-2 border border-border text-text-muted hover:text-text transition-colors">
                      <span className="material-symbols-outlined icon-outline text-[16px]">close</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="border border-border bg-surface">
                <div className="hidden md:grid grid-cols-[1fr_120px_80px_80px_60px] gap-4 px-5 py-2.5 border-b border-border bg-surface-elevated">
                  {["Member", "Role", "Status", "Last Active", ""].map((h) => (
                    <p key={h} className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">{h}</p>
                  ))}
                </div>
                <div className="divide-y divide-border">
                  {team.map((m) => (
                    <div key={m.id} className="flex md:grid md:grid-cols-[1fr_120px_80px_80px_60px] gap-4 items-center px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("w-8 h-8 flex items-center justify-center font-heading text-xs font-extrabold shrink-0", m.color)}>
                          {m.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-body text-sm font-semibold text-text truncate">{m.name}</p>
                          <p className="font-body text-[10px] text-text-muted truncate">{m.email}</p>
                        </div>
                      </div>
                      <p className="hidden md:block font-body text-xs text-text-muted">{ROLE_LABELS[m.role]}</p>
                      <div className="hidden md:block">
                        <span className={cn("px-2 py-0.5 font-body text-[10px] font-bold uppercase",
                          m.status === "active" ? "text-secondary bg-secondary/10" : "text-text-muted bg-surface-elevated"
                        )}>
                          {m.status}
                        </span>
                      </div>
                      <p className="hidden md:block font-body text-[10px] text-text-muted">{m.lastActive}</p>
                      <div className="flex items-center gap-1 ml-auto md:ml-0">
                        {m.role !== "super_admin" && (
                          <button onClick={() => removeTeamMember(m.id)} className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 transition-colors" title="Remove">
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

          {/* Notifications */}
          {tab === "notifications" && (
            <div className="border border-border bg-surface">
              <div className="grid grid-cols-[1fr_60px_60px] gap-4 px-5 py-2.5 border-b border-border bg-surface-elevated">
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Event</p>
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted text-center">Email</p>
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted text-center">In-App</p>
              </div>
              <div className="divide-y divide-border">
                {NOTIFICATION_ITEMS.map((item) => {
                  const state = notifications[item.key];
                  return (
                    <div key={item.key} className="grid grid-cols-[1fr_60px_60px] gap-4 items-center px-5 py-4">
                      <div>
                        <p className="font-body text-sm font-semibold text-text">{item.label}</p>
                        <p className="font-body text-[10px] text-text-muted mt-0.5">{item.description}</p>
                      </div>
                      {(["email", "inApp"] as const).map((type) => (
                        <div key={type} className="flex justify-center">
                          <button
                            onClick={() => toggleNotif(item.key, type)}
                            className={cn("w-9 h-5 relative transition-colors duration-200",
                              state[type] ? "bg-primary" : "bg-surface-elevated"
                            )}
                            role="switch"
                            aria-checked={state[type]}
                          >
                            <span className={cn("absolute top-0.5 w-4 h-4 bg-white transition-all duration-200",
                              state[type] ? "left-[calc(100%-18px)]" : "left-0.5"
                            )} />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Security */}
          {tab === "security" && (
            <div className="space-y-5">
              {/* Change password */}
              <div className="border border-border bg-surface p-5">
                <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">Change Password</h2>
                <div className="space-y-3 max-w-sm">
                  {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                    <div key={label}>
                      <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">{label}</label>
                      <input type="password" placeholder="••••••••"
                        className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors" />
                    </div>
                  ))}
                  <button className="bg-primary text-white px-4 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors mt-1">
                    Update Password
                  </button>
                </div>
              </div>

              {/* 2FA */}
              <div className="border border-border bg-surface p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">Two-Factor Authentication</h2>
                    <p className="font-body text-xs text-text-muted mt-0.5">Add an extra layer of security to your account</p>
                  </div>
                  <button
                    onClick={() => setTwoFA((v) => !v)}
                    className={cn("w-11 h-6 relative transition-colors duration-200", twoFA ? "bg-primary" : "bg-surface-elevated")}
                    role="switch" aria-checked={twoFA}
                  >
                    <span className={cn("absolute top-0.5 w-5 h-5 bg-white transition-all duration-200", twoFA ? "left-[calc(100%-22px)]" : "left-0.5")} />
                  </button>
                </div>
                {twoFA && (
                  <div className="mt-4 p-3 bg-secondary/5 border border-secondary/20">
                    <p className="font-body text-xs text-secondary font-semibold">2FA enabled — scan QR code in your authenticator app to complete setup</p>
                  </div>
                )}
              </div>

              {/* Active sessions */}
              <div className="border border-border bg-surface">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text">Active Sessions</h2>
                </div>
                <div className="divide-y divide-border">
                  {SESSIONS.map((s, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined icon-outline text-[20px] text-text-muted">
                          {s.device.includes("iPhone") ? "smartphone" : "laptop_mac"}
                        </span>
                        <div>
                          <p className="font-body text-sm font-semibold text-text">{s.device}</p>
                          <p className="font-body text-[10px] text-text-muted">{s.location} · {s.lastActive}</p>
                        </div>
                      </div>
                      {s.current ? (
                        <span className="px-2 py-0.5 bg-secondary/10 font-body text-[10px] font-bold uppercase tracking-wider text-secondary">Current</span>
                      ) : (
                        <button className="px-3 py-1.5 border border-error/40 font-body text-[10px] font-semibold uppercase tracking-wider text-error hover:bg-error/10 transition-colors">
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
