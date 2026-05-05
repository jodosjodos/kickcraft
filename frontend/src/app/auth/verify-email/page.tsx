"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import * as authService from "@/services/auth.service";
import { Spinner } from "@/components/ui/spinner";
import { Icon } from "@/components/ui/icon";

type VerifyState = "verifying" | "success" | "error" | "awaiting";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerifyState>(
    token ? "verifying" : "awaiting"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!token) return;

    authService
      .verifyEmail({ token })
      .then(() => setState("success"))
      .catch((err: unknown) => {
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: string }).message)
            : "Verification failed. The link may have expired.";
        setErrorMsg(message);
        setState("error");
      });
  }, [token]);

  if (state === "verifying") {
    return (
      <div className="rounded border border-border bg-surface p-8 text-center flex flex-col items-center gap-4">
        <Spinner size="lg" className="text-primary" />
        <p className="font-body text-sm text-text-muted">
          Verifying your email…
        </p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="rounded border border-border bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
          <Icon name="verified" size={24} className="text-secondary" />
        </div>
        <h2 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text mb-2">
          Email Verified
        </h2>
        <p className="font-body text-sm text-text-muted mb-6">
          Your account is ready. Start shopping.
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

  if (state === "error") {
    return (
      <div className="rounded border border-border bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
          <Icon name="error" size={24} className="text-error" />
        </div>
        <h2 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text mb-2">
          Verification Failed
        </h2>
        <p className="font-body text-sm text-text-muted mb-6">{errorMsg}</p>
        <Link
          href="/auth/register"
          className="font-body text-sm text-primary hover:underline underline-offset-4"
        >
          Back to register
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded border border-border bg-surface p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Icon name="mark_email_unread" size={24} className="text-primary-muted" />
      </div>
      <h2 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text mb-2">
        Check Your Email
      </h2>
      <p className="font-body text-sm text-text-muted mb-6">
        We sent a verification link to your email address. Click it to activate
        your account.
      </p>
      <Link
        href="/auth/login"
        className="font-body text-sm text-primary hover:underline underline-offset-4"
      >
        Back to login
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-sm">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-8">
            <Spinner size="lg" className="text-primary" />
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
