'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, Package, ShoppingCart, LogOut, Store, ChevronRight, Warehouse
} from 'lucide-react';

const NAV = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/stock', label: 'Stock', icon: Warehouse },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    async function handleLogout() {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
    }

    return (
        <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Brand */}
            <div className="px-6 py-5 border-b border-gray-700/50">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                        <Store className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm leading-none">Covermatt</p>
                        <p className="text-xs text-emerald-400 mt-0.5">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                                active
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <Icon className="w-4.5 h-4.5 shrink-0" />
                            <span className="flex-1">{label}</span>
                            {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom actions */}
            <div className="px-3 pb-4 border-t border-gray-700/50 pt-3 space-y-1">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
                >
                    <Store className="w-4.5 h-4.5" />
                    View Store
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-4.5 h-4.5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
