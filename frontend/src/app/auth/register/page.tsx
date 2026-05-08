"use client";

import Link from "next/link";
import { useState } from "react";
import { useRegister } from "@/hooks/api/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-text mb-1">
        Create Account
      </h1>
      <p className="font-body text-sm text-text-muted mb-8">
        Join Kickcraft — shop the best sneakers in Kigali
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Full Name"
          type="text"
          placeholder="Mugisha Eric"
          value={form.name}
          onChange={set("name")}
          required
          autoComplete="name"
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={set("email")}
          required
          autoComplete="email"
        />

        <Input
          label="Phone (MTN MoMo)"
          type="tel"
          placeholder="+250 788 000 000"
          value={form.phone}
          onChange={set("phone")}
          required
          autoComplete="tel"
          helper="Used for MoMo payments and order updates"
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={set("password")}
          required
          autoComplete="new-password"
        />

        {register.error && (
          <p className="font-body text-sm text-error">
            {register.error.message}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={register.isPending}
          className="w-full mt-2"
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-center font-body text-sm text-text-muted">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary hover:underline underline-offset-4 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
