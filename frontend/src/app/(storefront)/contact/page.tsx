"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "250794050537";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    const parts: string[] = [];
    if (name) parts.push(`Name: ${name}`);
    if (subject) parts.push(`Subject: ${subject}`);
    if (message) parts.push(`\n${message}`);
    const text = parts.length > 0 ? parts.join("\n") : "Hi Kickcraft!";
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="max-w-container mx-auto px-5 md:px-4 py-8">
      {/* Header */}
      <div className="mb-10">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">
          Get in touch
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-text">
          Contact Us
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: WhatsApp card + info */}
        <div className="flex flex-col gap-6">
          {/* WhatsApp primary card */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 border border-secondary/40 bg-secondary/5 rounded p-6 hover:border-secondary hover:bg-secondary/10 transition-colors duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center shrink-0 group-hover:bg-secondary/25 transition-colors">
              <span className="material-symbols-outlined icon-outline text-[28px] text-secondary">
                chat
              </span>
            </div>
            <div>
              <p className="font-heading text-base font-extrabold uppercase tracking-tight text-text mb-0.5">
                WhatsApp
              </p>
              <p className="font-body text-sm text-text-muted">
                +250 794 050 537
              </p>
              <p className="font-body text-xs text-secondary mt-1 font-semibold">
                Fastest response — tap to open →
              </p>
            </div>
          </a>

          {/* Hours & info */}
          <div className="border border-border rounded p-6 space-y-4">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined icon-outline text-[22px] text-text-muted shrink-0 mt-0.5">
                schedule
              </span>
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-text-muted mb-0.5">
                  Response Time
                </p>
                <p className="font-body text-sm text-text">
                  Usually within 30 minutes
                </p>
                <p className="font-body text-xs text-text-muted">
                  Mon–Sat, 8am–8pm CAT
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined icon-outline text-[22px] text-text-muted shrink-0 mt-0.5">
                location_on
              </span>
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-text-muted mb-0.5">
                  Based In
                </p>
                <p className="font-body text-sm text-text">Kigali, Rwanda</p>
                <p className="font-body text-xs text-text-muted">
                  Delivering across all sectors
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined icon-outline text-[22px] text-text-muted shrink-0 mt-0.5">
                local_shipping
              </span>
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-text-muted mb-0.5">
                  Delivery
                </p>
                <p className="font-body text-sm text-text">
                  Same-day within Kigali
                </p>
                <p className="font-body text-xs text-text-muted">
                  Free above 20,000 RWF
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Drop a Line form */}
        <div>
          <div className="border border-border rounded p-6 md:p-8">
            <h2 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text mb-1">
              Drop a Line
            </h2>
            <p className="font-body text-xs text-text-muted mb-6">
              Fill in the fields — we&apos;ll open WhatsApp with your message pre-written.
            </p>

            <form onSubmit={handleWhatsApp} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block font-body text-xs font-semibold uppercase tracking-[0.1em] text-text-muted mb-1.5"
                >
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jean"
                  className="w-full bg-surface border border-border rounded px-4 py-3 font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors duration-150"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block font-body text-xs font-semibold uppercase tracking-[0.1em] text-text-muted mb-1.5"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question about my order"
                  className="w-full bg-surface border border-border rounded px-4 py-3 font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors duration-150"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-body text-xs font-semibold uppercase tracking-[0.1em] text-text-muted mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What can we help you with?"
                  className="w-full bg-surface border border-border rounded px-4 py-3 font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors duration-150 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-secondary text-background font-body font-semibold text-sm uppercase tracking-wider py-3.5 rounded hover:opacity-90 active:scale-95 transition-all duration-150 mt-2"
              >
                <span className="material-symbols-outlined icon-outline text-[18px]">
                  chat
                </span>
                Send via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
