"use client";

import { useState } from "react";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useChangePassword } from "@/hooks/api/use-auth";
import type { ApiError } from "@/types/api/common";

export default function SecurityPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [confirmError, setConfirmError] = useState("");
  const changePassword = useChangePassword();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setConfirmError("Passwords don't match");
      return;
    }
    setConfirmError("");
    changePassword.mutate({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
  }

  const apiError = (changePassword.error as ApiError | null)?.message;

  if (changePassword.isSuccess) {
    return (
      <div>
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mb-8">
          Security
        </h1>
        <div className="border border-border bg-surface p-8 max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
            <Icon name="mark_email_read" size={24} className="text-secondary" />
          </div>
          <h2 className="font-heading text-lg font-extrabold uppercase tracking-tight text-text mb-2">
            Check Your Email
          </h2>
          <p className="font-body text-sm text-text-muted">
            We sent a confirmation link to your email address. Click it to apply
            your new password.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mb-2">
        Security
      </h1>
      <p className="font-body text-sm text-text-muted mb-8">
        Change your password. We&apos;ll email you a confirmation link before
        applying the change.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        {apiError && (
          <div className="flex items-center gap-2 border border-error/30 bg-error/5 px-4 py-2.5">
            <span className="material-symbols-outlined icon-fill text-[14px] text-error">
              error
            </span>
            <p className="font-body text-sm text-error">{apiError}</p>
          </div>
        )}

        <AuthInput
          label="Current Password"
          type="password"
          value={form.currentPassword}
          onChange={(e) =>
            setForm((p) => ({ ...p, currentPassword: e.target.value }))
          }
          required
          autoComplete="current-password"
        />
        <AuthInput
          label="New Password"
          type="password"
          value={form.newPassword}
          onChange={(e) =>
            setForm((p) => ({ ...p, newPassword: e.target.value }))
          }
          required
          autoComplete="new-password"
          helper="Minimum 8 characters"
        />
        <AuthInput
          label="Confirm New Password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => {
            setForm((p) => ({ ...p, confirmPassword: e.target.value }));
            setConfirmError("");
          }}
          required
          autoComplete="new-password"
          error={confirmError}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={changePassword.isPending}
          className="mt-2"
        >
          Change Password
        </Button>
      </form>
    </div>
  );
}
