"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { BarChart3, ListTodo, ShoppingBag, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { OrderDetailModal } from "@/components/admin/OrderDetailModal";
import AdminNav from "@/components/admin/AdminNav";

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

const formatCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

function StatusBadge({ status }: { status: string }) {
  const statusLower = status.toLowerCase();
  if (statusLower === 'paid') return <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">Paid</span>;
  if (statusLower === 'pending') return <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Pending</span>;
  if (statusLower === 'processing') return <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">Processing</span>;
  if (statusLower === 'shipped') return <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20">Shipped</span>;
  if (statusLower === 'delivered') return <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20">Delivered</span>;
  if (statusLower === 'canceled') return <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/10">Canceled</span>;
  if (statusLower === 'failed') return <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/10">Failed</span>;
  if (statusLower === 'refunded') return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-500/20">Refunded</span>;
  return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 capitalize">{status}</span>;
}

function OrderRow({ order, onView }: { order: Order; onView: (order: Order) => void }) {
  return (
    <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50/50">
      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-[#1B3A5C]">
        {order.id.split('-')[0]}...
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
        {format(new Date(order.created_at), "MMM d, yyyy")}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-[#1B3A5C] font-medium">
        {order.customer_name}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
        {formatCents(order.total_cents)}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm">
        <StatusBadge status={order.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-right">
        <button
          onClick={() => onView(order)}
          className="inline-flex items-center gap-1 text-[#0D7377] hover:text-[#0a5f63] font-medium transition-colors"
        >
          <Eye size={16} /> View
        </button>
      </td>
    </tr>
  );
}

export default function AdminOrdersPage() {
  const pathname = usePathname();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?page=${page}&limit=10&status=${statusFilter}`);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
        setTotalPages(json.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    // Optimistically update the local state
    setOrders(prevOrders => 
      prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o)
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B3A5C]">
              Order Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track and process clinical device orders.
            </p>
          </div>

          <AdminNav />
        </div>

        {/* ── Table Container ── */}
        <div className="rounded-3xl border border-slate-100 bg-white shadow-md overflow-hidden">
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm font-medium text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-[#1B3A5C] focus:border-[#0D7377] focus:ring-1 focus:ring-[#0D7377] outline-none"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="canceled">Canceled</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            {loading && <div className="text-sm font-medium text-slate-400">Loading...</div>}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-4">Order ID</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Total</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  orders.map(order => <OrderRow key={order.id} order={order} onView={handleOpenModal} />)
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-100 p-6">
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <OrderDetailModal 
        order={selectedOrder} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUpdate={handleUpdateOrder}
      />
    </div>
  );
}
