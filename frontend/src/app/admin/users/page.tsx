"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SlideOver } from "@/components/admin/slide-over";

type UserStatus = "active" | "banned";
type Tier = "Platinum" | "Gold" | "Silver" | "Bronze";

interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  lastActive: string;
  orderCount: number;
  totalSpent: number;
  status: UserStatus;
}

interface MockUserOrder {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

const MOCK_ORDERS_BY_USER: Record<string, MockUserOrder[]> = {
  "1": [
    { id: "KC-0041", date: "2025-05-01", status: "delivered", total: 78000, items: 1 },
    { id: "KC-0033", date: "2025-04-12", status: "delivered", total: 65000, items: 1 },
    { id: "KC-0021", date: "2025-03-08", status: "delivered", total: 89000, items: 2 },
    { id: "KC-0015", date: "2025-02-20", status: "cancelled", total: 45000, items: 1 },
    { id: "KC-0009", date: "2025-01-14", status: "delivered", total: 43000, items: 1 },
  ],
  "2": [
    { id: "KC-0038", date: "2025-04-28", status: "delivered", total: 55000, items: 1 },
    { id: "KC-0022", date: "2025-03-15", status: "delivered", total: 40000, items: 1 },
  ],
  "3": [
    { id: "KC-0048", date: "2025-05-08", status: "out_for_delivery", total: 92000, items: 2 },
    { id: "KC-0044", date: "2025-05-03", status: "confirmed", total: 78000, items: 1 },
    { id: "KC-0036", date: "2025-04-18", status: "delivered", total: 65000, items: 1 },
    { id: "KC-0030", date: "2025-04-01", status: "delivered", total: 88000, items: 2 },
    { id: "KC-0025", date: "2025-03-20", status: "delivered", total: 72000, items: 1 },
    { id: "KC-0018", date: "2025-03-05", status: "delivered", total: 55000, items: 1 },
    { id: "KC-0012", date: "2025-02-14", status: "delivered", total: 48000, items: 1 },
    { id: "KC-0006", date: "2025-01-30", status: "delivered", total: 42000, items: 1 },
  ],
  "4": [
    { id: "KC-0040", date: "2025-04-30", status: "pending", total: 48000, items: 1 },
  ],
  "5": [
    { id: "KC-0045", date: "2025-05-05", status: "confirmed", total: 68000, items: 1 },
    { id: "KC-0029", date: "2025-04-02", status: "delivered", total: 55000, items: 1 },
    { id: "KC-0014", date: "2025-02-18", status: "delivered", total: 52000, items: 1 },
  ],
  "7": [
    { id: "KC-0043", date: "2025-05-02", status: "out_for_delivery", total: 88000, items: 2 },
    { id: "KC-0035", date: "2025-04-15", status: "delivered", total: 62000, items: 1 },
    { id: "KC-0027", date: "2025-03-28", status: "delivered", total: 65000, items: 1 },
    { id: "KC-0016", date: "2025-02-25", status: "delivered", total: 45000, items: 1 },
  ],
  "8": [],
};

const MOCK_NOTES_BY_USER: Record<string, string> = {
  "6": "VIP customer. Reached out via Instagram DM about Air Max Pulse restock. Notify on drop.",
};

const MOCK_USERS: MockUser[] = [
  { id: "1", name: "Alice Uwimana", email: "alice@gmail.com", phone: "250788000001", joinedAt: "2024-11-03", lastActive: "2025-05-01", orderCount: 5, totalSpent: 320000, status: "active" },
  { id: "2", name: "Bob Nkurunziza", email: "bob@gmail.com", phone: "250788000002", joinedAt: "2024-12-15", lastActive: "2025-04-28", orderCount: 2, totalSpent: 95000, status: "active" },
  { id: "3", name: "Chantal Mukamana", email: "chantal@gmail.com", phone: "250788000003", joinedAt: "2025-01-08", lastActive: "2025-05-08", orderCount: 8, totalSpent: 540000, status: "active" },
  { id: "4", name: "David Habimana", email: "david@gmail.com", phone: "250788000004", joinedAt: "2025-02-20", lastActive: "2025-04-30", orderCount: 1, totalSpent: 48000, status: "active" },
  { id: "5", name: "Esperance Ingabire", email: "esp@gmail.com", phone: "250788000005", joinedAt: "2025-03-01", lastActive: "2025-05-05", orderCount: 3, totalSpent: 175000, status: "active" },
  { id: "6", name: "Frank Mugisha", email: "frank@gmail.com", phone: "250788000006", joinedAt: "2025-03-18", lastActive: "2025-05-02", orderCount: 4, totalSpent: 260000, status: "active" },
  { id: "7", name: "Grace Umutoni", email: "grace@gmail.com", phone: "250788000007", joinedAt: "2025-04-02", lastActive: "2025-04-02", orderCount: 0, totalSpent: 0, status: "active" },
  { id: "8", name: "Heri Kalisa", email: "heri@gmail.com", phone: "250788000008", joinedAt: "2025-04-20", lastActive: "2025-04-20", orderCount: 0, totalSpent: 0, status: "banned" },
];

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
  user: MockUser;
  avatarColor: string;
  onClose: () => void;
  onBan: (id: string) => void;
}

function UserPanel({ user, avatarColor, onClose, onBan }: UserPanelProps) {
  const [tab, setTab] = useState<"orders" | "notes">("orders");
  const tier = getTier(user.totalSpent);
  const orders = MOCK_ORDERS_BY_USER[user.id] ?? [];
  const avgOrder = orders.length > 0 ? Math.round(user.totalSpent / orders.length) : 0;
  const note = MOCK_NOTES_BY_USER[user.id];

  return (
    <SlideOver
      open
      onClose={onClose}
      title={user.name}
      subtitle={`Customer since ${formatDate(user.joinedAt)}`}
      width="lg"
      footer={
        <div className="flex items-center gap-2">
          {user.status === "active" ? (
            <button
              onClick={() => { onBan(user.id); onClose(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-error/40 text-error font-body text-xs font-semibold uppercase tracking-wider hover:bg-error/10 transition-colors"
            >
              <span className="material-symbols-outlined icon-outline text-[14px]">block</span>
              Ban Customer
            </button>
          ) : (
            <button
              onClick={() => { onBan(user.id); onClose(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-secondary/40 text-secondary font-body text-xs font-semibold uppercase tracking-wider hover:bg-secondary/10 transition-colors"
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
      }
    >
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
          { label: "Last Active", value: relativeDate(user.lastActive), icon: "schedule", color: "text-text-muted" },
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
            {t === "orders" ? `Orders (${orders.length})` : "Notes"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "orders" && (
        <div className="space-y-2">
          {orders.length === 0 ? (
            <div className="py-10 text-center">
              <span className="material-symbols-outlined icon-outline text-[36px] text-text-muted/20 block mb-2">shopping_bag</span>
              <p className="font-body text-xs text-text-muted">No orders yet</p>
            </div>
          ) : (
            orders.map((order) => {
              const statusCfg = ORDER_STATUS_CONFIG[order.status] ?? ORDER_STATUS_CONFIG.pending;
              return (
                <div key={order.id} className="flex items-center justify-between gap-3 px-3 py-2.5 border border-border bg-surface-elevated hover:bg-surface-high transition-colors">
                  <div>
                    <p className="font-body text-xs font-bold text-text">{order.id}</p>
                    <p className="font-body text-[10px] text-text-muted">{formatDate(order.date)} · {order.items} item{order.items > 1 ? "s" : ""}</p>
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
            defaultValue={note ?? ""}
            placeholder="Add internal notes about this customer…"
            rows={6}
            className="w-full px-3 py-2.5 bg-surface border border-border font-body text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none transition-colors"
          />
          <button className="mt-2 px-4 py-1.5 bg-primary text-white font-body text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">
            Save Note
          </button>
        </div>
      )}
    </SlideOver>
  );
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [users, setUsers] = useState(MOCK_USERS);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q);
      return matchStatus && matchSearch;
    });
  }, [users, search, statusFilter]);

  const totalCustomers = users.length;
  const newThisMonth = users.filter((u) => {
    const d = new Date(u.joinedAt);
    return d.getMonth() === 4 && d.getFullYear() === 2025;
  }).length;
  const avgLTV = Math.round(
    users.filter((u) => u.totalSpent > 0).reduce((s, u) => s + u.totalSpent, 0) /
    Math.max(1, users.filter((u) => u.totalSpent > 0).length)
  );

  function toggleBan(id: string) {
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, status: u.status === "banned" ? "active" : "banned" } : u)
    );
  }

  const selectedUserIndex = selectedUser ? users.findIndex((u) => u.id === selectedUser.id) : -1;

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
            value: String(totalCustomers),
            icon: "group",
            color: "text-primary",
            sub: `${users.filter((u) => u.status === "active").length} active`,
          },
          {
            label: "New This Month",
            value: String(newThisMonth),
            icon: "person_add",
            color: "text-secondary",
            sub: "May 2025",
          },
          {
            label: "Avg Lifetime Value",
            value: formatPrice(avgLTV),
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
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined icon-outline text-[16px] text-text-muted pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors"
          />
        </div>

        <div className="flex gap-1">
          {(["all", "active", "banned"] as const).map((s) => {
            const count = s === "all" ? users.length : users.filter((u) => u.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 font-body text-xs font-semibold uppercase tracking-wider border transition-all duration-150",
                  statusFilter === s
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-text-muted border-border hover:text-text hover:border-outline"
                )}
              >
                {s === "all" ? "All" : s}
                {count > 0 && (
                  <span className={cn(
                    "min-w-[18px] h-[18px] flex items-center justify-center font-body text-[10px] font-bold px-1",
                    statusFilter === s
                      ? "bg-white/20 text-white"
                      : s === "banned"
                      ? "bg-error/10 text-error"
                      : "bg-surface-elevated text-text-muted"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="border border-border bg-surface overflow-x-auto">
        {/* Header row */}
        <div className="hidden xl:grid grid-cols-[40px_1fr_180px_130px_80px_80px_120px_110px_80px] gap-3 px-5 py-2.5 border-b border-border bg-surface-elevated">
          {["", "Customer", "Email", "Phone", "Orders", "Spent", "Tier", "Joined", "Status"].map((h) => (
            <p key={h} className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">{h}</p>
          ))}
        </div>

        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <span className="material-symbols-outlined icon-outline text-[40px] text-text-muted/20 block mb-3">group</span>
              <p className="font-body text-sm text-text-muted">No customers match your search</p>
            </div>
          ) : (
            filtered.map((user, i) => {
              const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
              const tier = getTier(user.totalSpent);
              const tierCfg = TIER_CONFIG[tier];
              return (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={cn(
                    "w-full text-left flex xl:grid xl:grid-cols-[40px_1fr_180px_130px_80px_80px_120px_110px_80px] gap-3 items-center px-5 py-3.5 hover:bg-surface-elevated transition-colors",
                    user.status === "banned" && "opacity-60"
                  )}
                >
                  {/* Avatar */}
                  <div className={cn("w-8 h-8 flex items-center justify-center shrink-0 font-heading text-xs font-extrabold", avatarColor)}>
                    {getInitials(user.name)}
                  </div>

                  {/* Name */}
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-text truncate">{user.name}</p>
                    <p className="font-body text-[10px] text-text-muted xl:hidden truncate">{user.email}</p>
                  </div>

                  {/* Email */}
                  <p className="hidden xl:block font-body text-xs text-text-muted truncate">{user.email}</p>

                  {/* Phone */}
                  <p className="hidden xl:block font-body text-xs text-text-muted">+{user.phone}</p>

                  {/* Orders */}
                  <p className="hidden xl:block font-heading text-sm font-extrabold text-text">{user.orderCount}</p>

                  {/* Spent */}
                  <p className="hidden xl:block font-body text-xs text-text-muted">
                    {user.totalSpent > 0 ? formatPrice(user.totalSpent) : "—"}
                  </p>

                  {/* Tier */}
                  <div className="hidden xl:block">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider", tierCfg.classes)}>
                      <span className="material-symbols-outlined icon-filled text-[11px]">{tierCfg.icon}</span>
                      {tier}
                    </span>
                  </div>

                  {/* Joined */}
                  <p className="hidden xl:block font-body text-xs text-text-muted whitespace-nowrap">{formatDate(user.joinedAt)}</p>

                  {/* Status */}
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

                  {/* Mobile: tier + chevron */}
                  <div className="flex xl:hidden items-center gap-2 ml-auto shrink-0">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider", tierCfg.classes)}>
                      {tier}
                    </span>
                    <span className="material-symbols-outlined icon-outline text-[16px] text-text-muted">chevron_right</span>
                  </div>

                  {/* Desktop: chevron */}
                  <div className="hidden xl:flex justify-end">
                    <span className="material-symbols-outlined icon-outline text-[16px] text-text-muted">chevron_right</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-border bg-surface-elevated">
            <p className="font-body text-[10px] text-text-muted">
              Showing {filtered.length} of {users.length} customers
            </p>
          </div>
        )}
      </div>

      {/* Customer panel */}
      {selectedUser && (
        <UserPanel
          user={selectedUser}
          avatarColor={AVATAR_COLORS[selectedUserIndex % AVATAR_COLORS.length]}
          onClose={() => setSelectedUser(null)}
          onBan={toggleBan}
        />
      )}
    </div>
  );
}
