"use client";

import Link from "next/link";
import { useState } from "react";
import { useRegister } from "@/hooks/api/use-auth";
import { Button } from "@/components/ui/button";
import { AuthInput } from "@/components/auth/auth-input";

export default function RegisterPage() {
  const register = useRegister();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    register.mutate(form);
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
          Join Kickcraft
        </p>
        <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-text">
          Create Account
        </h1>
        <p className="font-body text-sm text-text-muted mt-1">
          Already have one?{" "}
          <Link
            href="/auth/login"
            className="text-primary hover:underline underline-offset-4 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label="Full Name"
          type="text"
          placeholder="Mugisha Eric"
          value={form.name}
          onChange={set("name")}
          required
          autoComplete="name"
        />

        <AuthInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={set("email")}
          required
          autoComplete="email"
        />

        <AuthInput
          label="Phone (MTN MoMo)"
          type="tel"
          placeholder="+250 788 000 000"
          value={form.phone}
          onChange={set("phone")}
          required
          autoComplete="tel"
          helper="Used for MoMo payments and order updates"
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={set("password")}
          required
          autoComplete="new-password"
        />

        {register.error && (
          <div className="flex items-center gap-2 bg-error/10 border border-error/30 px-3 py-2.5">
            <span className="material-symbols-outlined icon-filled text-[14px] text-error shrink-0">
              error
            </span>
            <p className="font-body text-sm text-error">
              {register.error.message}
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={register.isPending}
          className="w-full mt-2"
        >
          {register.isPending ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      {/* Trust signal */}
      <div className="mt-6 flex items-start gap-2.5 p-3 bg-surface-elevated border border-border">
        <span className="material-symbols-outlined icon-filled text-[14px] text-secondary mt-0.5 shrink-0">
          lock
        </span>
        <p className="font-body text-[11px] text-text-muted leading-relaxed">
          Your info is safe. We only use your phone for MoMo payments and order
          updates — never shared.
        </p>
      </div>
    </div>
  );
}
