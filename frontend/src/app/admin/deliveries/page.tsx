"use client";

import { useState } from "react";
import Link from "next/link";
import { useAllOrders } from "@/hooks/api/use-orders";
import { useDeliveryAgents, useCreateAgent, useAssignAgent } from "@/hooks/api/use-deliveries";
import { useUpdateOrderStatus } from "@/hooks/api/use-orders";
import { SlideOver } from "@/components/admin/slide-over";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/api/orders";
import type { DeliveryAgent } from "@/types/api/deliveries";

type Tab = "queued" | "active";

function AgentBadge({ agentId, agents }: { agentId?: string | null; agents: DeliveryAgent[] }) {
  const agent = agentId ? agents.find((a) => a.id === agentId) : null;
  if (!agent) return null;
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-5 h-5 bg-secondary/20 flex items-center justify-center">
        <span className="font-heading text-[10px] font-extrabold text-secondary">
          {agent.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </span>
      </div>
      <span className="font-body text-xs text-text-muted">{agent.name.split(" ")[0]}</span>
    </div>
  );
}

function DeliveryCard({
  order,
  agents,
}: {
  order: Order;
  agents: DeliveryAgent[];
}) {
  const [showAssign, setShowAssign] = useState(false);
  const assignAgent = useAssignAgent();
  const updateStatus = useUpdateOrderStatus();

  function handleAssign(agentId: string) {
    assignAgent.mutate(
      { orderId: order.id, agentId },
      { onSuccess: () => setShowAssign(false) },
    );
  }

  function handleStatusUpdate(status: "out_for_delivery" | "delivered") {
    updateStatus.mutate({ id: order.id, status });
  }

  return (
    <div
      className={cn(
        "border bg-surface transition-colors",
        order.status === "out_for_delivery"
          ? "border-l-4 border-l-[#ffb5a0] border-border"
          : "border-border",
      )}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border">
        <div>
          <Link
            href={`/admin/orders/${order.id}`}
            className="font-heading text-sm font-extrabold uppercase tracking-tight text-text hover:text-primary transition-colors"
          >
            #{order.orderToken}
          </Link>
          <p className="font-body text-[10px] text-text-muted mt-0.5">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {order.agentId && (
            <AgentBadge agentId={order.agentId} agents={agents} />
          )}
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-2.5">
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined icon-outline text-[15px] text-text-muted mt-0.5 shrink-0">
            location_on
          </span>
          <p className="font-body text-sm text-text leading-snug">
            {order.deliveryAddress ?? "No address provided"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined icon-outline text-[15px] text-text-muted shrink-0">
            phone
          </span>
          <p className="font-body text-sm text-text">+{order.phone}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined icon-outline text-[15px] text-text-muted shrink-0">
            payments
          </span>
          <p className="font-body text-sm text-text">
            Collect on delivery:{" "}
            <span className="font-semibold text-primary">
              {formatPrice(Math.ceil(order.total / 2))}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined icon-outline text-[15px] text-text-muted shrink-0">
            inventory_2
          </span>
          <p className="font-body text-sm text-text">
            {order.items.reduce((s, i) => s + i.quantity, 0)} items
          </p>
        </div>
      </div>

      {/* Assign agent dropdown */}
      {showAssign && (
        <div className="px-5 pb-4">
          <p className="font-body text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Assign Agent
          </p>
          <div className="space-y-1">
            {agents
              .filter((a) => a.active)
              .map((a) => (
                <button
                  key={a.id}
                  onClick={() => handleAssign(a.id)}
                  disabled={assignAgent.isPending}
                  className="flex items-center justify-between w-full px-3 py-2 border border-border hover:border-outline hover:bg-surface-elevated transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-secondary/20 flex items-center justify-center">
                      <span className="font-heading text-[10px] font-extrabold text-secondary">
                        {a.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <span className="font-body text-sm font-semibold text-text">
                      {a.name}
                    </span>
                  </div>
                  <span className="font-body text-xs text-text-muted">+{a.phone}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-3.5 border-t border-border flex flex-wrap gap-2">
        <a
          href={`https://wa.me/${order.phone}?text=${encodeURIComponent(
            `Hi! Kickcraft here. Your order #${order.orderToken} is on its way!`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 border border-secondary/40 px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wider text-secondary hover:bg-secondary/10 transition-colors"
        >
          <span className="material-symbols-outlined icon-outline text-[14px]">chat</span>
          Notify
        </a>

        {!order.agentId && (
          <button
            onClick={() => setShowAssign((v) => !v)}
            className="flex items-center gap-1.5 border border-border px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text hover:border-outline transition-colors"
          >
            <span className="material-symbols-outlined icon-outline text-[14px]">
              person_add
            </span>
            Assign Agent
          </button>
        )}

        {order.status === "confirmed" && (
          <button
            onClick={() => handleStatusUpdate("out_for_delivery")}
            disabled={updateStatus.isPending}
            className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wider hover:bg-primary-inverse transition-colors ml-auto disabled:opacity-50"
          >
            <span className="material-symbols-outlined icon-filled text-[14px]">
              local_shipping
            </span>
            Out for Delivery
          </button>
        )}
        {order.status === "out_for_delivery" && (
          <button
            onClick={() => handleStatusUpdate("delivered")}
            disabled={updateStatus.isPending}
            className="flex items-center gap-1.5 bg-secondary text-background px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity ml-auto disabled:opacity-50"
          >
            <span className="material-symbols-outlined icon-filled text-[14px]">
              where_to_vote
            </span>
            Mark Delivered
          </button>
        )}
      </div>
    </div>
  );
}

interface AgentFormState { name: string; phone: string; email: string; }
const EMPTY_AGENT_FORM: AgentFormState = { name: "", phone: "", email: "" };

export default function AdminDeliveriesPage() {
  const [tab, setTab] = useState<Tab>("queued");
  const [agentSlideOpen, setAgentSlideOpen] = useState(false);
  const [agentForm, setAgentForm] = useState<AgentFormState>(EMPTY_AGENT_FORM);

  const { data: ordersData, isLoading, isError } = useAllOrders();
  const { data: agents = [] } = useDeliveryAgents();
  const createAgent = useCreateAgent();

  const allOrders: Order[] = ordersData?.data ?? [];
  const deliveryOrders = allOrders.filter((o) => o.deliveryMethod === "delivery");
  const queued = deliveryOrders.filter((o) => o.status === "confirmed");
  const active = deliveryOrders.filter((o) => o.status === "out_for_delivery");
  const displayed = tab === "queued" ? queued : active;

  function handleSaveAgent() {
    if (!agentForm.name.trim() || !agentForm.phone.trim()) return;
    createAgent.mutate(
      {
        name: agentForm.name.trim(),
        phone: agentForm.phone.trim(),
        email: agentForm.email.trim() || undefined,
      },
      {
        onSuccess: () => {
          setAgentSlideOpen(false);
          setAgentForm(EMPTY_AGENT_FORM);
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
            Management
          </p>
          <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mt-0.5">
            Deliveries
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="text-right">
            <p className="font-heading text-lg font-extrabold text-primary">
              {queued.length}
            </p>
            <p className="font-body text-[10px] uppercase tracking-wider text-text-muted">
              Queued
            </p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-right">
            <p className="font-heading text-lg font-extrabold text-[#ffb5a0]">
              {active.length}
            </p>
            <p className="font-body text-[10px] uppercase tracking-wider text-text-muted">
              In Transit
            </p>
          </div>
        </div>
      </div>

      {/* Agents row */}
      <div className="border border-border bg-surface p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
            Delivery Agents
          </p>
          <button
            onClick={() => setAgentSlideOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 border border-border font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted hover:text-text hover:border-outline transition-colors"
          >
            <span className="material-symbols-outlined icon-outline text-[12px]">add</span>
            Add Agent
          </button>
        </div>
        {agents.length === 0 ? (
          <p className="font-body text-xs text-text-muted">No agents yet</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center gap-2.5 border border-border px-3 py-2">
                <div
                  className={cn(
                    "w-7 h-7 flex items-center justify-center font-heading text-xs font-extrabold",
                    agent.active
                      ? "bg-secondary/20 text-secondary"
                      : "bg-surface-elevated text-text-muted",
                  )}
                >
                  {agent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-body text-xs font-semibold text-text">
                    {agent.name.split(" ")[0]}
                  </p>
                  <p className="font-body text-[10px] text-text-muted">+{agent.phone}</p>
                </div>
                <span
                  className={cn(
                    "ml-1 w-1.5 h-1.5 rounded-full",
                    agent.active ? "bg-secondary" : "bg-surface-high",
                  )}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["queued", "active"] as Tab[]).map((t) => {
          const count = t === "queued" ? queued.length : active.length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 font-body text-xs font-semibold uppercase tracking-wider border transition-all duration-150",
                tab === t
                  ? "bg-primary text-white border-primary"
                  : "bg-surface text-text-muted border-border hover:text-text hover:border-outline",
              )}
            >
              {t === "queued" ? "Queued" : "In Transit"}
              {count > 0 && (
                <span
                  className={cn(
                    "min-w-[18px] h-[18px] flex items-center justify-center font-body text-[10px] font-bold px-1",
                    tab === t ? "bg-white/20 text-white" : "bg-primary text-white",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" className="text-primary" />
        </div>
      ) : isError ? (
        <div className="border border-error/30 bg-error/5 px-5 py-4">
          <p className="font-body text-sm text-error">Failed to load deliveries</p>
        </div>
      ) : displayed.length === 0 ? (
        <div className="border border-border bg-surface p-12 text-center">
          <span className="material-symbols-outlined icon-outline text-[48px] text-text-muted/20 block mb-3">
            {tab === "queued" ? "pending_actions" : "local_shipping"}
          </span>
          <p className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-1">
            {tab === "queued" ? "No queued deliveries" : "Nothing in transit"}
          </p>
          <p className="font-body text-xs text-text-muted">
            {tab === "queued"
              ? "Confirmed delivery orders will appear here"
              : "Orders marked out for delivery will appear here"}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayed.map((order) => (
            <DeliveryCard key={order.id} order={order} agents={agents} />
          ))}
        </div>
      )}

      {/* Add Agent SlideOver */}
      <SlideOver
        open={agentSlideOpen}
        onClose={() => setAgentSlideOpen(false)}
        title="Add Delivery Agent"
        subtitle="Register a new delivery agent"
        footer={
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setAgentSlideOpen(false)}
              className="px-4 py-2 border border-border font-body text-xs font-semibold text-text-muted hover:text-text hover:border-outline transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAgent}
              disabled={createAgent.isPending || !agentForm.name || !agentForm.phone}
              className="bg-primary text-white px-4 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors disabled:opacity-50"
            >
              {createAgent.isPending ? "Saving..." : "Add Agent"}
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
              Full Name
            </label>
            <input
              value={agentForm.name}
              onChange={(e) => setAgentForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Eric Nshimiyimana"
              className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
              Phone Number
            </label>
            <input
              value={agentForm.phone}
              onChange={(e) => setAgentForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="e.g. 250788100001"
              className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
              Email{" "}
              <span className="normal-case font-normal text-text-muted/60">(optional — for delivery notifications)</span>
            </label>
            <input
              type="email"
              value={agentForm.email}
              onChange={(e) => setAgentForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="e.g. eric@example.com"
              className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </SlideOver>
    </div>
  );
}
