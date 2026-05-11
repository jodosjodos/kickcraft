"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import * as authService from "@/services/auth.service";
import { Spinner } from "@/components/ui/spinner";
import { Icon } from "@/components/ui/icon";

type State = "verifying" | "success" | "error";

function ConfirmPasswordChangeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<State>("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setErrorMsg("No token provided.");
      setState("error");
      return;
    }

    authService
      .confirmPasswordChange({ token })
      .then(() => setState("success"))
      .catch((err: unknown) => {
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: string }).message)
            : "This link is invalid or has expired.";
        setErrorMsg(message);
        setState("error");
      });
  }, [token]);

  if (state === "verifying") {
    return (
      <div className="rounded border border-border bg-surface p-8 text-center flex flex-col items-center gap-4">
        <Spinner size="lg" className="text-primary" />
        <p className="font-body text-sm text-text-muted">
          Confirming your new password…
        </p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="rounded border border-border bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
          <Icon name="lock_reset" size={24} className="text-secondary" />
        </div>
        <h2 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text mb-2">
          Password Updated
        </h2>
        <p className="font-body text-sm text-text-muted mb-6">
          Your password has been changed. Sign in with your new password.
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
    <div className="rounded border border-border bg-surface p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
        <Icon name="error" size={24} className="text-error" />
      </div>
      <h2 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text mb-2">
        Link Expired
      </h2>
      <p className="font-body text-sm text-text-muted mb-6">{errorMsg}</p>
      <Link
        href="/account/security"
        className="font-body text-sm text-primary hover:underline underline-offset-4"
      >
        Try again →
      </Link>
    </div>
  );
}

export default function ConfirmPasswordChangePage() {
  return (
    <div className="w-full max-w-sm">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-8">
            <Spinner size="lg" className="text-primary" />
          </div>
        }
      >
        <ConfirmPasswordChangeContent />
      </Suspense>
    </div>
  );
}
