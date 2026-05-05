"use client";

import Link from "next/link";
import { useState } from "react";
import { useForgotPassword } from "@/hooks/api/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    forgotPassword.mutate({ email });
  }

  if (forgotPassword.isSuccess) {
    return (
      <div className="w-full max-w-sm">
        <div className="rounded border border-border bg-surface p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
            <Icon name="mark_email_read" size={24} className="text-secondary" />
          </div>
          <h2 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text mb-2">
            Check Your Email
          </h2>
          <p className="font-body text-sm text-text-muted mb-6">
            We sent a reset link to{" "}
            <span className="text-text">{email}</span>. Check your inbox.
          </p>
          <Link
            href="/auth/login"
            className="font-body text-sm text-primary hover:underline underline-offset-4"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded border border-border bg-surface p-8">
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mb-1">
          Reset Password
        </h1>
        <p className="font-body text-sm text-text-muted mb-8">
          Enter your email and we&apos;ll send a reset link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          {forgotPassword.error && (
            <p className="font-body text-sm text-error">
              {forgotPassword.error.message}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={forgotPassword.isPending}
            className="w-full mt-2"
          >
            Send Reset Link
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
    </div>
  );
}
