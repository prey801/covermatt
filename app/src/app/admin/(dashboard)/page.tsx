import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { Package, ShoppingCart, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default async function AdminDashboard() {
    await connectToDatabase();
    
    // Fetch directly from DB instead of JSON
    const rawOrders = await Order.find({}).sort({ createdAt: -1 }).lean();
    const rawProducts = await Product.find({}).lean();

    const orders = rawOrders.map((o: any) => ({ ...o, id: o._id.toString() }));
    const products = rawProducts.map((p: any) => ({ ...p, id: p._id.toString() }));

    const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0);
    const lowStock = products.filter(p => p.stockLevel === 'low-stock' || p.stockLevel === 'out-of-stock');
    const recentOrders = orders.slice(0, 5);

    const stats = [
        { label: 'Total Revenue', value: `KSh ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Products', value: products.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Low / Out of Stock', value: lowStock.length, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back! Here's an overview of your store.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                                <Icon className={`w-5 h-5 ${s.color}`} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-emerald-600 text-sm font-medium hover:underline">View all</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentOrders.map(order => (
                            <div key={order.id} className="flex items-center justify-between px-6 py-3.5">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{order.id}</p>
                                    <p className="text-xs text-gray-400">{order.customer.name} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-900">KSh {order.total.toLocaleString()}</span>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Stock Alerts</h2>
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="divide-y divide-gray-50">
                        {lowStock.length === 0 ? (
                            <p className="px-6 py-8 text-sm text-gray-400 text-center">All products are well stocked 🎉</p>
                        ) : (
                            lowStock.map(p => (
                                <div key={p.id} className="flex items-center justify-between px-6 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{p.image}</span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{p.name}</p>
                                            <p className="text-xs text-gray-400">{p.category}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.stockLevel === 'out-of-stock' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {p.stockLevel === 'out-of-stock' ? 'Out of stock' : 'Low stock'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="px-6 py-3 border-t border-gray-50">
                        <Link href="/admin/products" className="text-emerald-600 text-sm font-medium hover:underline flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Manage products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
