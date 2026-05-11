"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import { useUpdateProfile } from "@/hooks/api/use-auth";
import type { ApiError } from "@/types/api/common";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [saved, setSaved] = useState(false);
  const updateProfile = useUpdateProfile();

  if (!user) return null;

  function startEdit() {
    setForm({ name: user!.name, phone: user!.phone ?? "" });
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
    updateProfile.reset();
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateProfile.mutate(
      {
        name: form.name || undefined,
        phone: form.phone || undefined,
      },
      {
        onSuccess: () => {
          setEditing(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      }
    );
  }

  const errorMsg = (updateProfile.error as ApiError | null)?.message;

  return (
    <div>
      {/* Hero card */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 border border-border bg-surface p-6">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="font-heading text-2xl font-extrabold text-white">
            {getInitials(user.name)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text">
              {user.name}
            </h1>
            <span className="font-body text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5">
              {user.role === "admin" ? "Admin" : "Customer"}
            </span>
          </div>
          <p className="font-body text-sm text-text-muted">{user.email}</p>
        </div>
        {!editing && (
          <button
            onClick={startEdit}
            className="font-body text-sm text-primary hover:underline underline-offset-4 shrink-0"
          >
            Edit profile
          </button>
        )}
      </div>

      {saved && (
        <div className="mb-5 flex items-center gap-2 border border-secondary/30 bg-secondary/10 px-4 py-2.5">
          <span className="material-symbols-outlined icon-fill text-[16px] text-secondary">
            check_circle
          </span>
          <p className="font-body text-sm text-secondary font-semibold">
            Profile updated
          </p>
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-md">
          {errorMsg && (
            <p className="font-body text-sm text-error">{errorMsg}</p>
          )}
          <AuthInput
            label="Full Name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <AuthInput
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            helper="+250 format — used for MoMo payments"
          />
          <p className="font-body text-xs text-text-muted -mt-1">
            Email cannot be changed. Contact support if needed.
          </p>
          <div className="flex gap-3 mt-1">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={updateProfile.isPending}
            >
              Save Changes
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
          {[
            { icon: "badge", label: "Full Name", value: user.name },
            { icon: "mail", label: "Email", value: user.email },
            { icon: "phone", label: "Phone", value: user.phone ?? "—" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="border border-border bg-surface p-4">
              <span className="material-symbols-outlined icon-outline text-[18px] text-primary mb-2 block">
                {icon}
              </span>
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted mb-0.5">
                {label}
              </p>
              <p className="font-body text-sm text-text font-medium truncate">
                {value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
