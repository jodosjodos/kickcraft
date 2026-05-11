"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/api/use-auth";
import { Button } from "@/components/ui/button";
import { AuthInput } from "@/components/auth/auth-input";
import { Spinner } from "@/components/ui/spinner";
import { Icon } from "@/components/ui/icon";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const resetPassword = useResetPassword();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [confirmError, setConfirmError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setConfirmError("Passwords do not match");
      return;
    }
    setConfirmError("");
    resetPassword.mutate({ token, password });
  }

  if (!token) {
    return (
      <div className="rounded border border-border bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
          <Icon name="error" size={24} className="text-error" />
        </div>
        <h2 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text mb-2">
          Invalid Link
        </h2>
        <p className="font-body text-sm text-text-muted mb-6">
          This reset link is missing a token. Request a new one.
        </p>
        <Link
          href="/auth/forgot-password"
          className="font-body text-sm text-primary hover:underline underline-offset-4"
        >
          Request reset link
        </Link>
      </div>
    );
  }

  if (resetPassword.isSuccess) {
    return (
      <div className="rounded border border-border bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
          <Icon name="check_circle" size={24} className="text-secondary" />
        </div>
        <h2 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text mb-2">
          Password Reset
        </h2>
        <p className="font-body text-sm text-text-muted mb-6">
          Your password has been updated. Sign in with your new password.
        </p>
        <Link
          href="/auth/login"
          className="font-body text-sm font-semibold uppercase tracking-wider text-primary hover:underline underline-offset-4"
        >
          Sign In →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
          New password
        </p>
        <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-text">
          Reset Password
        </h1>
        <p className="font-body text-sm text-text-muted mt-1">
          Choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label="New Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          helper="At least 8 characters"
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setConfirmError("");
          }}
          required
          autoComplete="new-password"
        />

        {(confirmError || resetPassword.error) && (
          <div className="flex items-center gap-2 bg-error/10 border border-error/30 px-3 py-2.5">
            <span className="material-symbols-outlined icon-filled text-[14px] text-error shrink-0">
              error
            </span>
            <p className="font-body text-sm text-error">
              {confirmError || resetPassword.error?.message}
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={resetPassword.isPending}
          className="w-full mt-2"
        >
          {resetPassword.isPending ? "Resetting…" : "Reset Password"}
        </Button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-text-muted">
        Remember it?{" "}
        <Link
          href="/auth/login"
          className="text-primary hover:underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-8">
          <Spinner size="lg" className="text-primary" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
