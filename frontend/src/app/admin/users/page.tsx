"use client";

export default function AdminUsersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text">
          Users
        </h1>
        <p className="font-body text-sm text-text-muted mt-1">
          Registered customer accounts
        </p>
      </div>

      <div className="border border-border bg-surface p-10 text-center">
        <span className="material-symbols-outlined icon-outline text-[48px] text-text-muted/30 mb-3 block">
          group
        </span>
        <p className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-2">
          Users API Not Connected
        </p>
        <p className="font-body text-sm text-text-muted max-w-sm mx-auto">
          User management will be available once the backend API is connected.
          User accounts will appear here with registration date, order count,
          and account status.
        </p>
      </div>
    </div>
  );
}
