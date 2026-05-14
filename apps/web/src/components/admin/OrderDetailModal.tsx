"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit_price_cents: number;
}

interface Order {
  id: string;
  stripe_payment_intent_id: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  shipping_method: string;
  shipping_cents: number;
  subtotal_cents: number;
  total_cents: number;
  line_items: OrderItem[];
  created_at: string;
  tracking_number?: string;
}

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedOrder: Order) => void;
}

const formatCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export function OrderDetailModal({ order, isOpen, onClose, onUpdate }: OrderDetailModalProps) {
  const [status, setStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setTrackingNumber(order.tracking_number || "");
    }
  }, [order]);

  if (!order) return null;

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, tracking_number: trackingNumber }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Order status updated successfully");
        onUpdate(json.data);
        onClose();
      } else {
        toast.error(json.error || "Failed to update order status");
      }
    } catch (err) {
      toast.error("An error occurred while updating the order");
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none rounded-2xl shadow-2xl">
        <DialogHeader className="bg-[#1B3A5C] p-6 text-white">
          <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
          <div className="flex flex-col text-white/80 text-sm mt-1">
            <span>ID: {order.id}</span>
            <span>Placed on: {format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}</span>
          </div>
        </DialogHeader>

        <div className="bg-[#F8FAFC] p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customer Information</h3>
              <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 text-sm shadow-sm">
                <p><span className="font-semibold text-slate-500">Name:</span> <span className="text-[#1B3A5C]">{order.customer_name}</span></p>
                <p><span className="font-semibold text-slate-500">Email:</span> <span className="text-[#1B3A5C]">{order.customer_email}</span></p>
                <p><span className="font-semibold text-slate-500">Phone:</span> <span className="text-[#1B3A5C]">{order.customer_phone}</span></p>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shipping Details</h3>
              <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 text-sm shadow-sm">
                <p className="text-[#1B3A5C] font-medium leading-relaxed">
                  {order.address_line1}<br />
                  {order.address_line2 && <>{order.address_line2}<br /></>}
                  {order.city}, {order.state} {order.zip}<br />
                  {order.country}
                </p>
                <div className="pt-2 border-t border-slate-50 mt-2">
                  <p><span className="font-semibold text-slate-500">Method:</span> <span className="text-[#1B3A5C] uppercase font-bold">{order.shipping_method}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Summary</h3>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-slate-500 text-left">
                    <th className="px-4 py-3 font-semibold">Item</th>
                    <th className="px-4 py-3 font-semibold text-center">Qty</th>
                    <th className="px-4 py-3 font-semibold text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.line_items.map((item, i) => (
                    <tr key={i} className="text-[#1B3A5C]">
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">{formatCents(item.unit_price_cents)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50/50 border-t border-slate-100 font-bold text-[#1B3A5C]">
                  <tr>
                    <td colSpan={2} className="px-4 py-3 text-right text-slate-500">Total Amount</td>
                    <td className="px-4 py-3 text-right text-lg">{formatCents(order.total_cents)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Transaction & Status Update */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction</h3>
              <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1 text-xs shadow-sm">
                <p className="font-semibold text-slate-500">Stripe PaymentIntent ID:</p>
                <p className="font-mono text-[#1B3A5C] break-all">{order.stripe_payment_intent_id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update Status</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-xs text-slate-500">Order Status</Label>
                  <Select value={status} onValueChange={(val) => setStatus(val || "")}>
                    <SelectTrigger id="status" className="bg-white border-slate-200">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {status === "shipped" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="tracking" className="text-xs text-slate-500">Tracking Number</Label>
                    <Input
                      id="tracking"
                      placeholder="Enter tracking #"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="bg-white border-slate-200"
                    />
                  </div>
                )}

                <Button 
                  onClick={handleUpdateStatus} 
                  disabled={isUpdating}
                  className="w-full bg-[#0D7377] hover:bg-[#0a5f63] text-white font-bold py-6 rounded-xl transition-all"
                >
                  {isUpdating ? "Updating..." : "Update Order"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
