"use client";

import { NotificationBell } from "./notification-bell";

export function AdminTopbar() {
  return (
    <div className="hidden md:flex sticky top-0 z-30 h-12 bg-surface border-b border-border items-center justify-end px-6">
      <NotificationBell />
    </div>
  );
}
