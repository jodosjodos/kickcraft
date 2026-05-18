"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SlideOver } from "@/components/admin/slide-over";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import {
  useAdminUsers,
  useAdminUser,
  useUpdateUserStatus,
  useUpdateUserNotes,
} from "@/hooks/api/use-users";
import type { AdminUserListItem, UserStatus } from "@/types/api/users";

type Tier = "Platinum" | "Gold" | "Silver" | "Bronze";

const AVATAR_COLORS = [
  "bg-primary/20 text-primary",
  "bg-secondary/20 text-secondary",
  "bg-[#ffb5a0]/20 text-[#ffb5a0]",
  "bg-blue-500/20 text-blue-400",
  "bg-purple-500/20 text-purple-400",
  "bg-yellow-500/20 text-yellow-400",
  "bg-teal-500/20 text-teal-400",
  "bg-pink-500/20 text-pink-400",
];

function getTier(totalSpent: number): Tier {
  if (totalSpent >= 500000) return "Platinum";
  if (totalSpent >= 200000) return "Gold";
  if (totalSpent >= 80000) return "Silver";
  return "Bronze";
}

const TIER_CONFIG: Record<Tier, { classes: string; icon: string }> = {
  Platinum: { classes: "bg-[#e5e4e2]/15 text-[#e5e4e2] border border-[#e5e4e2]/30", icon: "diamond" },
  Gold: { classes: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30", icon: "workspace_premium" },
  Silver: { classes: "bg-slate-400/15 text-slate-300 border border-slate-400/30", icon: "military_tech" },
  Bronze: { classes: "bg-orange-700/15 text-orange-400 border border-orange-700/30", icon: "emoji_events" },
};

const ORDER_STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  pending: { label: "Pending", classes: "text-[#ffb5a0] bg-[#ffb5a0]/10" },
  confirmed: { label: "Confirmed", classes: "text-blue-400 bg-blue-400/10" },
  out_for_delivery: { label: "Delivering", classes: "text-primary bg-primary/10" },
  delivered: { label: "Delivered", classes: "text-secondary bg-secondary/10" },
  cancelled: { label: "Cancelled", classes: "text-text-muted bg-surface-elevated" },
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatPrice(n: number) {
  return `RWF ${n.toLocaleString("en-RW")}`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-RW", { year: "numeric", month: "short", day: "numeric" });
}

function relativeDate(d: string) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return formatDate(d);
}

function TierBadge({ tier }: { tier: Tier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider", cfg.classes)}>
      <span className="material-symbols-outlined icon-filled text-[11px]">{cfg.icon}</span>
      {tier}
    </span>
  );
}

interface UserPanelProps {
  userId: string;
  avatarColor: string;
  onClose: () => void;
}

function UserPanel({ userId, avatarColor, onClose }: UserPanelProps) {
  const [tab, setTab] = useState<"orders" | "notes">("orders");
  const [noteText, setNoteText] = useState<string | null>(null);
  const [confirmBanOpen, setConfirmBanOpen] = useState(false);
  const { data: user, isLoading } = useAdminUser(userId, true);
  const updateStatus = useUpdateUserStatus();
  const updateNotes = useUpdateUserNotes();

  const tier = user ? getTier(user.totalSpent) : "Bronze";
  const avgOrder =
    user && user.orderCount > 0
      ? Math.round(user.totalSpent / user.orderCount)
      : 0;
  const lastActive =
    user?.orders[0]?.createdAt
      ? relativeDate(user.orders[0].createdAt)
      : user
      ? relativeDate(user.createdAt)
      : "—";

  const currentNote = noteText !== null ? noteText : (user?.adminNotes ?? "");

  function confirmBan() {
    if (!user) return;
    updateStatus.mutate(
      { id: user.id, status: "banned" },
      {
        onSuccess: () => {
          setConfirmBanOpen(false);
          onClose();
        },
      },
    );
  }

  function handleUnban() {
    if (!user) return;
    updateStatus.mutate(
      { id: user.id, status: "active" },
      { onSuccess: onClose },
    );
  }

  function handleSaveNote() {
    if (!user) return;
    updateNotes.mutate({ id: user.id, notes: currentNote });
  }

  return (
    <SlideOver
      open
      onClose={onClose}
      title={user?.name ?? "Customer"}
      subtitle={user ? `Customer since ${formatDate(user.createdAt)}` : ""}
      width="lg"
      footer={
        user ? (
          <div className="flex items-center gap-2">
            {user.status === "active" ? (
              <button
                onClick={() => setConfirmBanOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-error/40 text-error font-body text-xs font-semibold uppercase tracking-wider hover:bg-error/10 transition-colors"
              >
                <span className="material-symbols-outlined icon-outline text-[14px]">block</span>
                Ban Customer
              </button>
            ) : (
              <button
                onClick={handleUnban}
                disabled={updateStatus.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-secondary/40 text-secondary font-body text-xs font-semibold uppercase tracking-wider hover:bg-secondary/10 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined icon-outline text-[14px]">check_circle</span>
                Unban Customer
              </button>
            )}
            <a
              href={`https://wa.me/${user.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-secondary/40 text-secondary font-body text-xs font-semibold uppercase tracking-wider hover:bg-secondary/10 transition-colors ml-auto"
            >
              <span className="material-symbols-outlined icon-filled text-[14px]">chat</span>
              WhatsApp
            </a>
          </div>
        ) : undefined
      }
    >
      {isLoading || !user ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" className="text-primary" />
        </div>
      ) : (
        <>
          {/* Profile header */}
          <div className="flex items-start gap-4 mb-6">
            <div className={cn("w-14 h-14 flex items-center justify-center shrink-0 font-heading text-xl font-extrabold", avatarColor)}>
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-heading text-base font-extrabold uppercase tracking-tight text-text">{user.name}</p>
                <TierBadge tier={tier} />
                {user.status === "banned" && (
                  <span className="px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider bg-error/10 text-error">
                    Banned
                  </span>
                )}
              </div>
              <p className="font-body text-xs text-text-muted">{user.email}</p>
              <p className="font-body text-xs text-text-muted">+{user.phone}</p>
            </div>
          </div>

          {/* 4 micro metric cards */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { label: "Total Orders", value: String(user.orderCount), icon: "shopping_bag", color: "text-primary" },
              { label: "Total Spent", value: formatPrice(user.totalSpent), icon: "payments", color: "text-secondary" },
              { label: "Avg Order", value: avgOrder > 0 ? formatPrice(avgOrder) : "—", icon: "bar_chart", color: "text-[#ffb5a0]" },
              { label: "Last Active", value: lastActive, icon: "schedule", color: "text-text-muted" },
            ].map((m) => (
              <div key={m.label} className="border border-border bg-surface-elevated px-3 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("material-symbols-outlined icon-filled text-[15px]", m.color)}>{m.icon}</span>
                  <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted">{m.label}</p>
                </div>
                <p className="font-heading text-sm font-extrabold text-text leading-tight">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 border-b border-border">
            {(["orders", "notes"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider border-b-2 -mb-px transition-colors",
                  tab === t ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text"
                )}
              >
                {t === "orders" ? `Orders (${user.orders.length})` : "Notes"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "orders" && (
            <div className="space-y-2">
              {user.orders.length === 0 ? (
                <div className="py-10 text-center">
                  <span className="material-symbols-outlined icon-outline text-[36px] text-text-muted/20 block mb-2">shopping_bag</span>
                  <p className="font-body text-xs text-text-muted">No orders yet</p>
                </div>
              ) : (
                user.orders.map((order) => {
                  const statusCfg = ORDER_STATUS_CONFIG[order.status] ?? ORDER_STATUS_CONFIG.pending;
                  return (
                    <div key={order.id} className="flex items-center justify-between gap-3 px-3 py-2.5 border border-border bg-surface-elevated hover:bg-surface-high transition-colors">
                      <div>
                        <p className="font-body text-xs font-bold text-text">{order.orderToken}</p>
                        <p className="font-body text-[10px] text-text-muted">
                          {formatDate(order.createdAt)} · {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider", statusCfg.classes)}>
                          {statusCfg.label}
                        </span>
                        <p className="font-heading text-xs font-extrabold text-text">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === "notes" && (
            <div>
              <textarea
                value={currentNote}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add internal notes about this customer…"
                rows={6}
                className="w-full px-3 py-2.5 bg-surface border border-border font-body text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none transition-colors"
              />
              <button
                onClick={handleSaveNote}
                disabled={updateNotes.isPending}
                className="mt-2 px-4 py-1.5 bg-primary text-white font-body text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {updateNotes.isPending ? "Saving…" : "Save Note"}
              </button>
            </div>
          )}
        </>
      )}
      <Modal
        open={confirmBanOpen}
        onClose={() => setConfirmBanOpen(false)}
        title="Ban Customer"
      >
        <div className="space-y-4">
          <p className="font-body text-sm text-text">
            Ban <span className="font-semibold">{user?.name}</span>? They will no longer be able to log in. Existing orders remain tracked.
          </p>
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => setConfirmBanOpen(false)}
              className="px-4 py-1.5 border border-border font-body text-xs font-semibold text-text-muted hover:text-text hover:border-outline transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmBan}
              disabled={updateStatus.isPending}
              className="px-4 py-1.5 bg-primary text-white font-body text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {updateStatus.isPending ? "Banning…" : "Yes, Ban"}
            </button>
          </div>
        </div>
      </Modal>
    </SlideOver>
  );
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const limit = 20;
  const { data, isLoading } = useAdminUsers({ search, status: statusFilter, page, limit });

  const users = data?.data ?? [];
  const total = data?.total ?? 0;
  const summary = data?.summary;
  const totalPages = Math.ceil(total / limit);

  function handleSearch() {
    setSearch(searchInput);
    setPage(1);
  }

  function handleStatusFilter(s: "all" | UserStatus) {
    setStatusFilter(s);
    setPage(1);
  }

  const selectedUserIndex = selectedUserId
    ? users.findIndex((u) => u.id === selectedUserId)
    : -1;
  const avatarColor =
    selectedUserIndex >= 0
      ? AVATAR_COLORS[selectedUserIndex % AVATAR_COLORS.length]
      : AVATAR_COLORS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">Commerce</p>
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mt-0.5">Customers</h1>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Total Customers",
            value: String(summary?.totalCustomers ?? 0),
            icon: "group",
            color: "text-primary",
            sub: `${summary?.activeCustomers ?? 0} active`,
          },
          {
            label: "New This Month",
            value: String(summary?.newThisMonth ?? 0),
            icon: "person_add",
            color: "text-secondary",
            sub: new Date().toLocaleDateString("en-RW", { month: "long", year: "numeric" }),
          },
          {
            label: "Avg Lifetime Value",
            value: summary ? formatPrice(summary.avgLTV) : "—",
            icon: "trending_up",
            color: "text-[#ffb5a0]",
            sub: "Paying customers only",
          },
        ].map((m) => (
          <div key={m.label} className="border border-border bg-surface px-5 py-4 flex items-center gap-4">
            <span className={cn("material-symbols-outlined icon-filled text-[22px] shrink-0", m.color)}>{m.icon}</span>
            <div>
              <p className="font-heading text-xl font-extrabold text-text leading-none">{m.value}</p>
              <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-0.5">{m.label}</p>
              <p className="font-body text-[10px] text-text-muted/60 mt-0.5">{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm flex">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined icon-outline text-[16px] text-text-muted pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search name, email, phone…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors"
          />
        </div>

        <div className="flex gap-1">
          {(["all", "active", "banned"] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleStatusFilter(s)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 font-body text-xs font-semibold uppercase tracking-wider border transition-all duration-150",
                statusFilter === s
                  ? "bg-primary text-white border-primary"
                  : "bg-surface text-text-muted border-border hover:text-text hover:border-outline"
              )}
            >
              {s === "all" ? "All" : s}
              {s === "all" && summary && (
                <span className={cn("min-w-[18px] h-[18px] flex items-center justify-center font-body text-[10px] font-bold px-1", statusFilter === s ? "bg-white/20 text-white" : "bg-surface-elevated text-text-muted")}>
                  {summary.totalCustomers}
                </span>
              )}
              {s === "active" && summary && (
                <span className={cn("min-w-[18px] h-[18px] flex items-center justify-center font-body text-[10px] font-bold px-1", statusFilter === s ? "bg-white/20 text-white" : "bg-surface-elevated text-text-muted")}>
                  {summary.activeCustomers}
                </span>
              )}
              {s === "banned" && summary && (
                <span className={cn("min-w-[18px] h-[18px] flex items-center justify-center font-body text-[10px] font-bold px-1", statusFilter === s ? "bg-white/20 text-white" : "bg-error/10 text-error")}>
                  {summary.totalCustomers - summary.activeCustomers}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-border bg-surface overflow-x-auto">
        <div className="hidden xl:grid grid-cols-[40px_1fr_180px_130px_80px_80px_120px_110px_80px_40px] gap-3 px-5 py-2.5 border-b border-border bg-surface-elevated">
          {["", "Customer", "Email", "Phone", "Orders", "Spent", "Tier", "Joined", "Status", ""].map((h, i) => (
            <p key={i} className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">{h}</p>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" className="text-primary" />
          </div>
        ) : (
          <div className="divide-y divide-border">
            {users.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <span className="material-symbols-outlined icon-outline text-[40px] text-text-muted/20 block mb-3">group</span>
                <p className="font-body text-sm text-text-muted">No customers found</p>
              </div>
            ) : (
              users.map((user: AdminUserListItem, i: number) => {
                const avatarCol = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const tier = getTier(user.totalSpent);
                const tierCfg = TIER_CONFIG[tier];
                return (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={cn(
                      "w-full text-left flex xl:grid xl:grid-cols-[40px_1fr_180px_130px_80px_80px_120px_110px_80px_40px] gap-3 items-center px-5 py-3.5 hover:bg-surface-elevated transition-colors",
                      user.status === "banned" && "opacity-60"
                    )}
                  >
                    <div className={cn("w-8 h-8 flex items-center justify-center shrink-0 font-heading text-xs font-extrabold", avatarCol)}>
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-body text-sm font-semibold text-text truncate">{user.name}</p>
                      <p className="font-body text-[10px] text-text-muted xl:hidden truncate">{user.email}</p>
                    </div>
                    <p className="hidden xl:block font-body text-xs text-text-muted truncate">{user.email}</p>
                    <p className="hidden xl:block font-body text-xs text-text-muted">+{user.phone}</p>
                    <p className="hidden xl:block font-heading text-sm font-extrabold text-text">{user.orderCount}</p>
                    <p className="hidden xl:block font-body text-xs text-text-muted">
                      {user.totalSpent > 0 ? formatPrice(user.totalSpent) : "—"}
                    </p>
                    <div className="hidden xl:block">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider", tierCfg.classes)}>
                        <span className="material-symbols-outlined icon-filled text-[11px]">{tierCfg.icon}</span>
                        {tier}
                      </span>
                    </div>
                    <p className="hidden xl:block font-body text-xs text-text-muted whitespace-nowrap">{formatDate(user.createdAt)}</p>
                    <div className="hidden xl:block">
                      <span className={cn(
                        "px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider",
                        user.status === "banned"
                          ? "bg-error/10 text-error"
                          : "bg-secondary/10 text-secondary"
                      )}>
                        {user.status}
                      </span>
                    </div>
                    <div className="flex xl:hidden items-center gap-2 ml-auto shrink-0">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider", tierCfg.classes)}>
                        {tier}
                      </span>
                      <span className="material-symbols-outlined icon-outline text-[16px] text-text-muted">chevron_right</span>
                    </div>
                    <div className="hidden xl:flex justify-end">
                      <span className="material-symbols-outlined icon-outline text-[16px] text-text-muted">chevron_right</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}

        {!isLoading && total > 0 && (
          <div className="px-5 py-3 border-t border-border bg-surface-elevated flex items-center justify-between">
            <p className="font-body text-[10px] text-text-muted">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} customers
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 font-body text-xs border border-border text-text-muted hover:text-text hover:border-outline transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <span className="font-body text-xs text-text-muted">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 font-body text-xs border border-border text-text-muted hover:text-text hover:border-outline transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer panel */}
      {selectedUserId && (
        <UserPanel
          userId={selectedUserId}
          avatarColor={avatarColor}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}
