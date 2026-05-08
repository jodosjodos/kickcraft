"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useLogin } from "@/hooks/api/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-text mb-1">
        Welcome Back
      </h1>
      <p className="font-body text-sm text-text-muted mb-8">
        Sign in to your Kickcraft account
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

        <div className="flex flex-col gap-1.5">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="font-body text-xs text-text-muted hover:text-primary transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {login.error && (
          <p className="font-body text-sm text-error">{login.error.message}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={login.isPending}
          className="w-full mt-2"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-center font-body text-sm text-text-muted">
          No account?{" "}
          <Link
            href="/auth/register"
            className="text-primary hover:underline underline-offset-4 font-semibold"
          >
            Create one free
          </Link>
        </p>
      </div>

      {/* Dev hint */}
      <div className="mt-6 p-3 bg-surface-elevated border border-border rounded">
        <p className="font-body text-[11px] text-text-muted leading-relaxed">
          <span className="font-semibold text-text">Dev:</span>{" "}
          user@kickcraft.rw → storefront · admin@kickcraft.rw → admin panel
          · any password
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
