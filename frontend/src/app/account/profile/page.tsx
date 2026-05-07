"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setUser({ ...user!, ...form });
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text">
          Profile
        </h1>
        {!editing && (
          <button
            onClick={() => {
              setForm({
                name: user.name,
                email: user.email,
                phone: user.phone ?? "",
              });
              setEditing(true);
            }}
            className="font-body text-sm text-primary hover:underline underline-offset-4"
          >
            Edit
          </button>
        )}
      </div>

      {saved && (
        <div className="mb-5 flex items-center gap-2 border border-secondary/30 bg-secondary/10 px-4 py-2.5">
          <span className="material-symbols-outlined icon-outline text-[16px] text-secondary">
            check_circle
          </span>
          <p className="font-body text-sm text-secondary font-semibold">
            Profile updated
          </p>
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-md">
          <Input
            label="Full Name"
            type="text"
            value={form.name}
            onChange={set("name")}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={set("email")}
            required
          />
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            helper="MTN MoMo number for payments and order updates"
          />

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={saving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      ) : (
        <div className="border border-border bg-surface p-5 max-w-md">
          <div className="flex flex-col gap-4">
            {[
              { label: "Full Name", value: user.name },
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone ?? "—" },
              {
                label: "Account Type",
                value: user.role === "admin" ? "Admin" : "Customer",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted mb-0.5">
                  {label}
                </p>
                <p className="font-body text-sm text-text">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
