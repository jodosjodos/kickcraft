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
    <div className="w-full max-w-sm">
      <div className="rounded border border-border bg-surface p-8">
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mb-1">
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

        <p className="mt-6 text-center font-body text-sm text-text-muted">
          No account?{" "}
          <Link
            href="/auth/register"
            className="text-primary hover:underline underline-offset-4"
          >
            Create one
          </Link>
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
