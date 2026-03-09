'use client';
import { useEffect, useState, useCallback } from 'react';
import { ShoppingCart, Filter } from 'lucide-react';

interface OrderItem { productId: string; name: string; qty: number; price: number; }
interface Order {
    id: string;
    customer: { name: string; email: string; phone: string };
    items: OrderItem[];
    total: number;
    status: string;
    createdAt: string;
    address: string;
}

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [updating, setUpdating] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const res = await fetch('/api/orders');
        if (res.ok) setOrders(await res.json());
        setLoading(false);
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const displayed = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    async function handleStatusChange(id: string, status: string) {
        setUpdating(id);
        const res = await fetch(`/api/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (res.ok) {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        }
        setUpdating(null);
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500 text-sm mt-1">{orders.length} orders total</p>
                </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-400" />
                {STATUSES.map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3.5 py-1.5 rounded-xl text-sm font-medium capitalize transition-all ${
                            filter === s
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-7 h-7 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : displayed.length === 0 ? (
                    <div className="flex flex-col items-center py-20 text-gray-400">
                        <ShoppingCart className="w-12 h-12 mb-2 opacity-30" />
                        <p className="font-medium">No orders found</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                <th className="text-left px-6 py-3">Order</th>
                                <th className="text-left px-4 py-3">Customer</th>
                                <th className="text-left px-4 py-3">Date</th>
                                <th className="text-left px-4 py-3">Total</th>
                                <th className="text-left px-4 py-3">Items</th>
                                <th className="text-left px-4 py-3">Location</th>
                                <th className="text-left px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {displayed.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-800">{order.id}</p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="font-medium text-gray-800">{order.customer.name}</p>
                                        <p className="text-xs text-gray-400">{order.customer.phone}</p>
                                    </td>
                                    <td className="px-4 py-4 text-gray-500 text-xs">
                                        {new Date(order.createdAt).toLocaleDateString('en-KE', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-4 py-4 font-semibold text-gray-800">
                                        KSh {order.total.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4 text-gray-500">
                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">
                                        <span className="text-sm">{order.address}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                                {order.status}
                                            </span>
                                            <select
                                                value={order.status}
                                                onChange={e => handleStatusChange(order.id, e.target.value)}
                                                disabled={updating === order.id}
                                                className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white disabled:opacity-50"
                                            >
                                                {STATUSES.filter(s => s !== 'all').map(s => (
                                                    <option key={s} value={s} className="capitalize">{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
