"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useNotifications, useUnreadCount, useMarkRead, useMarkAllRead } from "@/hooks/api/use-notifications";
import type { Notification, NotificationType } from "@/types/api/notifications";

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function typeIcon(type: NotificationType): string {
  switch (type) {
    case "new_order": return "receipt_long";
    case "low_stock": return "inventory_2";
    case "new_review": return "reviews";
    case "new_customer": return "person_add";
    case "failed_payment": return "payment";
    case "return_request": return "assignment_return";
  }
}

function typeRoute(type: NotificationType): string | null {
  switch (type) {
    case "new_order": return "/admin/orders";
    case "low_stock": return "/admin/inventory";
    case "new_review": return "/admin/reviews";
    case "new_customer": return "/admin/users";
    default: return null;
  }
}

function NotifItem({
  notif,
  onRead,
}: {
  notif: Notification;
  onRead: (id: string, route: string | null) => void;
}) {
  const route = typeRoute(notif.type);
  return (
    <button
      onClick={() => onRead(notif.id, route)}
      className={cn(
        "w-full text-left px-4 py-3 flex gap-3 hover:bg-surface-elevated transition-colors",
        !notif.isRead && "bg-primary/5",
      )}
    >
      <span className="material-symbols-outlined icon-outline text-[18px] text-primary shrink-0 mt-0.5">
        {typeIcon(notif.type)}
      </span>
      <div className="flex-1 min-w-0">
        <p className={cn("font-body text-[13px] leading-snug truncate", notif.isRead ? "text-text-muted" : "text-text font-semibold")}>
          {notif.message}
        </p>
        <p className="font-body text-[11px] text-text-muted mt-0.5">
          {formatRelativeTime(notif.createdAt)}
        </p>
      </div>
      {!notif.isRead && (
        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
      )}
    </button>
  );
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: notifications = [] } = useNotifications();
  const { data: unread } = useUnreadCount();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const count = unread?.count ?? 0;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleRead(id: string, route: string | null) {
    markRead.mutate(id);
    setOpen(false);
    if (route) router.push(route);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-text-muted hover:text-text transition-colors"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined icon-outline text-[22px]">notifications</span>
        {count > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-primary font-body text-[9px] font-bold text-white px-1">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border shadow-lg z-50 flex flex-col max-h-[480px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="font-body text-sm font-semibold text-text">Notifications</span>
            {count > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="font-body text-[11px] text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-border">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center font-body text-[13px] text-text-muted">
                No notifications yet
              </p>
            ) : (
              notifications.map((n) => (
                <NotifItem key={n.id} notif={n} onRead={handleRead} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
