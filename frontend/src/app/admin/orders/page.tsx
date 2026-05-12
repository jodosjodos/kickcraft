"use client";

import { useState } from "react";
import Link from "next/link";
import { useAllOrders, useUpdateOrderStatus } from "@/hooks/api/use-orders";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { SlideOver } from "@/components/admin/slide-over";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/api/orders";

const STATUS_TABS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "out_for_delivery", "delivered"];
const STATUS_ACTIONS: Partial<Record<OrderStatus, { next: OrderStatus; label: string }>> = {
  pending: { next: "confirmed", label: "Confirm Order" },
  confirmed: { next: "out_for_delivery", label: "Out for Delivery" },
  out_for_delivery: { next: "delivered", label: "Mark Delivered" },
};
const STEP_ICONS: Record<OrderStatus, string> = {
  pending: "hourglass_empty",
  confirmed: "check_circle",
  out_for_delivery: "local_shipping",
  delivered: "where_to_vote",
  cancelled: "cancel",
};

const DELIVERY_ICONS: Record<string, string> = { delivery: "local_shipping", pickup: "store" };

function OrderPanel({ order, onClose }: { order: Order; onClose: () => void }) {
  const updateStatus = useUpdateOrderStatus();
  const currentFlowIndex = STATUS_FLOW.indexOf(order.status);
  const nextAction = STATUS_ACTIONS[order.status];
  const isCancelled = order.status === "cancelled";

  function handleAdvance() {
    if (!nextAction) return;
    updateStatus.mutate(
      { id: order.id, status: nextAction.next },
      { onSuccess: onClose }
    );
  }

  function handleCancel() {
    updateStatus.mutate(
      { id: order.id, status: "cancelled" },
      { onSuccess: onClose }
    );
  }

  return (
    <SlideOver
      open
      onClose={onClose}
      title={`#${order.orderToken}`}
      subtitle={`Placed ${formatDate(order.createdAt)}`}
      width="lg"
      footer={
        <div className="flex items-center gap-2">
          {nextAction && (
            <button onClick={handleAdvance} disabled={updateStatus.isPending}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors disabled:opacity-60 flex-1 justify-center">
              {updateStatus.isPending ? <Spinner size="sm" className="text-white" /> : null}
              {nextAction.label}
            </button>
          )}
          {!isCancelled && order.status !== "delivered" && (
            <button onClick={handleCancel} disabled={updateStatus.isPending}
              className="flex items-center gap-2 border border-error/40 text-error px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider hover:bg-error/10 transition-colors disabled:opacity-60">
              Cancel
            </button>
          )}
          <a href={`https://wa.me/${order.phone}?text=${encodeURIComponent(`Hi! Kickcraft here. Order #${order.orderToken} update:`)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-secondary/40 px-3 py-2 font-body text-xs font-semibold uppercase tracking-wider text-secondary hover:bg-secondary/10 transition-colors ml-auto">
            <span className="material-symbols-outlined icon-outline text-[14px]">chat</span>
            WhatsApp
          </a>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Status + badge */}
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <Link href={`/admin/orders/${order.id}`} className="font-body text-[10px] text-primary hover:underline underline-offset-4 flex items-center gap-1 ml-auto">
            Full detail page
            <span className="material-symbols-outlined icon-outline text-[12px]">open_in_new</span>
          </Link>
        </div>

        {/* Timeline */}
        {!isCancelled && (
          <div className="border border-border bg-surface-elevated p-4">
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3">Progress</p>
            <div className="flex items-start gap-0">
              {STATUS_FLOW.map((s, i) => {
                const done = currentFlowIndex >= i;
                const isLast = i === STATUS_FLOW.length - 1;
                return (
                  <div key={s} className="flex items-start flex-1 min-w-0">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={cn("w-7 h-7 flex items-center justify-center border-2 transition-colors",
                        done ? "bg-primary border-primary" : "bg-surface border-border")}>
                        <span className={cn("material-symbols-outlined text-[14px]", done ? "icon-filled text-white" : "icon-outline text-text-muted")}>
                          {STEP_ICONS[s]}
                        </span>
                      </div>
                      <p className={cn("font-body text-[9px] font-semibold uppercase tracking-wider mt-1 text-center leading-tight",
                        currentFlowIndex === i ? "text-primary" : done ? "text-text" : "text-text-muted")}>
                        {s === "out_for_delivery" ? "Shipped" : s.charAt(0).toUpperCase() + s.slice(1)}
                      </p>
                    </div>
                    {!isLast && <div className={cn("flex-1 h-0.5 mt-3.5 mx-1", i < currentFlowIndex ? "bg-primary" : "bg-border")} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Customer */}
        <div className="border border-border bg-surface">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-heading text-xs font-extrabold uppercase tracking-tight text-text">Customer</h3>
          </div>
          <div className="px-4 py-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined icon-outline text-[14px] text-text-muted">phone</span>
              <p className="font-body text-sm text-text">+{order.phone}</p>
            </div>
            {order.email && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined icon-outline text-[14px] text-text-muted">email</span>
                <p className="font-body text-xs text-text-muted">{order.email}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined icon-outline text-[14px] text-text-muted">
                {order.deliveryMethod === "pickup" ? "store" : "local_shipping"}
              </span>
              <p className="font-body text-xs text-text-muted capitalize">{order.deliveryMethod}</p>
            </div>
            {order.deliveryAddress && (
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined icon-outline text-[14px] text-text-muted mt-0.5">location_on</span>
                <p className="font-body text-xs text-text-muted">{order.deliveryAddress}</p>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="border border-border bg-surface">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-heading text-xs font-extrabold uppercase tracking-tight text-text">Items</h3>
            <span className="font-body text-[10px] text-text-muted">{order.items.reduce((s, i) => s + i.quantity, 0)} {order.items.reduce((s, i) => s + i.quantity, 0) === 1 ? "item" : "items"}</span>
          </div>
          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 bg-[#F5F5F5] shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined icon-outline text-[18px] text-gray-400">inventory_2</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs font-bold uppercase tracking-wider text-text-muted">{item.productBrand}</p>
                  <p className="font-body text-sm font-semibold text-text truncate">{item.productName}</p>
                  <p className="font-body text-[10px] text-text-muted">Size {item.size} · Qty {item.quantity}</p>
                </div>
                <p className="font-heading text-sm font-extrabold text-text shrink-0">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          {/* Totals */}
          <div className="px-4 py-3 border-t border-border bg-surface-elevated space-y-1.5">
            <div className="flex justify-between font-body text-xs text-text-muted">
              <span>Upfront paid (50%)</span><span className="text-secondary">{formatPrice(Math.ceil(order.subtotal / 2))}</span>
            </div>
            <div className="flex justify-between font-body text-xs text-text-muted">
              <span>On delivery (50%)</span>
              <span className={order.paymentPhase === "fully_paid" ? "text-secondary" : "text-primary"}>
                {order.paymentPhase === "fully_paid" ? "Paid" : formatPrice(Math.floor(order.subtotal / 2))}
              </span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between font-body text-xs text-text-muted">
                <span>Delivery fee</span><span>{formatPrice(order.deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between font-heading text-sm font-extrabold text-text pt-1.5 border-t border-border">
              <span>Total</span><span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </SlideOver>
  );
}

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { data: ordersData, isLoading, isError } = useAllOrders();

  const orderList = ordersData?.data ?? [];

  const counts: Record<string, number> = {
    all: orderList.length,
    pending: orderList.filter((o) => o.status === "pending").length,
    confirmed: orderList.filter((o) => o.status === "confirmed").length,
    out_for_delivery: orderList.filter((o) => o.status === "out_for_delivery").length,
    delivered: orderList.filter((o) => o.status === "delivered").length,
    cancelled: orderList.filter((o) => o.status === "cancelled").length,
  };

  const filtered = activeTab === "all" ? orderList : orderList.filter((o) => o.status === activeTab);
  const revenue = orderList.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">Commerce</p>
          <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mt-0.5">Orders</h1>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="text-right">
            <p className="font-heading text-lg font-extrabold text-text">{orderList.length}</p>
            <p className="font-body text-[10px] uppercase tracking-wider text-text-muted">Total</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-right">
            <p className="font-heading text-lg font-extrabold text-secondary">{formatPrice(revenue)}</p>
            <p className="font-body text-[10px] uppercase tracking-wider text-text-muted">Revenue</p>
          </div>
          <button className="flex items-center gap-1.5 border border-border bg-surface px-3.5 py-2 font-body text-xs font-semibold text-text-muted hover:text-text hover:border-outline transition-all">
            <span className="material-symbols-outlined icon-outline text-[15px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map(({ value, label }) => {
          const count = counts[value] ?? 0;
          return (
            <button key={value} onClick={() => setActiveTab(value)}
              className={cn("flex items-center gap-2 px-3.5 py-1.5 font-body text-xs font-semibold uppercase tracking-wider transition-all duration-150 border",
                activeTab === value ? "bg-primary text-white border-primary" : "bg-surface text-text-muted border-border hover:text-text hover:border-outline"
              )}>
              {label}
              {count > 0 && (
                <span className={cn("min-w-[18px] h-[18px] flex items-center justify-center font-body text-[10px] font-bold px-1",
                  activeTab === value ? "bg-white/20 text-white" : value === "pending" ? "bg-primary text-white" : "bg-surface-elevated text-text-muted"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Spinner size="lg" className="text-primary" /></div>
      ) : isError ? (
        <div className="border border-error/30 bg-error/5 px-5 py-4">
          <p className="font-body text-sm text-error">Failed to load orders</p>
        </div>
      ) : (
        <div className="border border-border bg-surface overflow-x-auto">
          <div className="hidden md:grid grid-cols-[1fr_130px_60px_90px_120px_130px_100px_36px] gap-3 px-5 py-2.5 border-b border-border bg-surface-elevated">
            {["Order", "Customer", "Items", "Method", "Total", "Status", "Date", ""].map((h) => (
              <p key={h} className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">{h}</p>
            ))}
          </div>

          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <span className="material-symbols-outlined icon-outline text-[40px] text-text-muted/20 block mb-3">receipt_long</span>
                <p className="font-body text-sm text-text-muted">No orders in this status</p>
              </div>
            ) : (
              filtered.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="w-full flex md:grid md:grid-cols-[1fr_130px_60px_90px_120px_130px_100px_36px] gap-3 items-center px-5 py-3.5 hover:bg-surface-elevated transition-colors group text-left cursor-pointer"
                >
                  <div>
                    <p className="font-body text-sm font-semibold text-text group-hover:text-primary transition-colors">#{order.orderToken}</p>
                    <p className="font-body text-[10px] text-text-muted mt-0.5 md:hidden">{formatDate(order.createdAt)} · +{order.phone}</p>
                  </div>
                  <p className="hidden md:block font-body text-xs text-text-muted truncate">+{order.phone}</p>
                  <p className="hidden md:block font-body text-sm text-text">{order.items.reduce((s, i) => s + i.quantity, 0)}</p>
                  <div className="hidden md:flex items-center gap-1.5">
                    <span className="material-symbols-outlined icon-outline text-[14px] text-text-muted">
                      {DELIVERY_ICONS[order.deliveryMethod] ?? "local_shipping"}
                    </span>
                    <span className="font-body text-xs text-text-muted capitalize">{order.deliveryMethod}</span>
                  </div>
                  <p className="hidden md:block font-heading text-sm font-extrabold text-text whitespace-nowrap">{formatPrice(order.total)}</p>
                  <div className="hidden md:block"><OrderStatusBadge status={order.status} /></div>
                  <p className="hidden md:block font-body text-xs text-text-muted whitespace-nowrap">{formatDate(order.createdAt)}</p>
                  <div className="flex md:hidden items-center gap-2 ml-auto">
                    <OrderStatusBadge status={order.status} />
                    <p className="font-heading text-sm font-extrabold text-text">{formatPrice(order.total)}</p>
                  </div>
                  <div className="hidden md:flex items-center justify-end">
                    <span className="material-symbols-outlined icon-outline text-[16px] text-text-muted group-hover:text-primary transition-colors">chevron_right</span>
                  </div>
                </button>
              ))
            )}
          </div>

          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-border bg-surface-elevated">
              <p className="font-body text-[10px] text-text-muted">
                {filtered.length} {filtered.length === 1 ? "order" : "orders"}{activeTab !== "all" && ` · ${activeTab.replace(/_/g, " ")}`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Order side panel */}
      {selectedOrder && <OrderPanel order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
}
