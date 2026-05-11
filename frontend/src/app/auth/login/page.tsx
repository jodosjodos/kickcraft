"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useLogin } from "@/hooks/api/use-auth";
import { Button } from "@/components/ui/button";
import { AuthInput } from "@/components/auth/auth-input";
import { Spinner } from "@/components/ui/spinner";

function LoginForm() {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login.mutate({ email, password });
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
          Welcome back
        </p>
        <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-text">
          Sign In
        </h1>
        <p className="font-body text-sm text-text-muted mt-1">
          New here?{" "}
          <Link
            href="/auth/register"
            className="text-primary hover:underline underline-offset-4 font-semibold"
          >
            Create a free account
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <div className="flex flex-col gap-1">
          <AuthInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <div className="flex justify-end mt-1">
            <Link
              href="/auth/forgot-password"
              className="font-body text-xs text-text-muted hover:text-primary transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {login.error && (
          <div className="flex items-center gap-2 bg-error/10 border border-error/30 px-3 py-2.5">
            <span className="material-symbols-outlined icon-filled text-[14px] text-error shrink-0">
              error
            </span>
            <p className="font-body text-sm text-error">{login.error.message}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={login.isPending}
          className="w-full mt-2"
        >
          {login.isPending ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      {/* Dev hint */}
      <div className="mt-6 p-3 bg-surface-elevated border border-border">
        <p className="font-body text-[11px] text-text-muted leading-relaxed">
          <span className="font-semibold text-text">Dev:</span>{" "}
          user@kickcraft.rw → storefront · admin@kickcraft.rw → admin panel ·
          any password
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Spinner size="lg" className="text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
