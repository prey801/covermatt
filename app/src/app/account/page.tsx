'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
    User, ShoppingBag, Heart, MapPin, CreditCard, Bell,
    ChevronRight, LogOut, Package, Star, Settings, Edit3
} from 'lucide-react';

const TABS = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'orders', label: 'My Orders', icon: <Package className="w-4 h-4" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

const MOCK_ORDERS = [
    { id: 'ORD-2024-001', date: 'Feb 20, 2026', status: 'Delivered', statusColor: 'text-emerald-600 bg-emerald-50', total: 12500, items: 3 },
    { id: 'ORD-2024-002', date: 'Feb 18, 2026', status: 'In Transit', statusColor: 'text-amber-600 bg-amber-50', total: 8200, items: 2 },
    { id: 'ORD-2024-003', date: 'Feb 15, 2026', status: 'Processing', statusColor: 'text-blue-600 bg-blue-50', total: 35000, items: 5 },
];

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Profile Header */}
            <div className="hero-gradient py-10 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl sm:text-4xl border border-white/10">
                            👤
                        </div>
                        <div className="text-white">
                            <h1 className="text-xl sm:text-2xl font-extrabold font-heading">John Doe</h1>
                            <p className="text-white/60 text-sm mt-0.5">john.doe@example.com • +254 700 XXX XXX</p>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="bg-emerald-400/20 text-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                    <Star className="w-3 h-3" /> Premium Member
                                </span>
                                <span className="text-white/40 text-xs">Joined Feb 2024</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <div className="flex flex-col lg:grid lg:grid-cols-[240px_1fr] gap-6">
                    {/* Sidebar (horizontal on mobile, vertical on desktop) */}
                    <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 sm:p-2 h-fit lg:sticky lg:top-28">
                        <div className="flex lg:flex-col gap-1 overflow-x-auto hide-scrollbar">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 lg:w-full ${activeTab === tab.id ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className={activeTab === tab.id ? 'text-emerald-500' : 'text-gray-400'}>{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                            <div className="hidden lg:block">
                                <hr className="my-2 border-gray-100" />
                                <Link href="/login" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </Link>
                            </div>
                        </div>
                    </nav>

                    {/* Content */}
                    <div>
                        {activeTab === 'overview' && (
                            <div className="space-y-5">
                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Total Orders', value: '12', icon: <Package className="w-5 h-5 text-emerald-500" /> },
                                        { label: 'Wishlist Items', value: '8', icon: <Heart className="w-5 h-5 text-red-500" /> },
                                        { label: 'Reward Points', value: '2,450', icon: <Star className="w-5 h-5 text-amber-500" /> },
                                        { label: 'Saved Addresses', value: '3', icon: <MapPin className="w-5 h-5 text-blue-500" /> },
                                    ].map(s => (
                                        <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">{s.icon}</div>
                                            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Orders */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                        <h3 className="font-bold text-gray-900">Recent Orders</h3>
                                        <button onClick={() => setActiveTab('orders')} className="text-sm text-emerald-600 font-semibold hover:underline">View all</button>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {MOCK_ORDERS.map(order => (
                                            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors gap-2 sm:gap-4">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 font-mono">{order.id}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{order.date} • {order.items} items</p>
                                                </div>
                                                <div className="flex items-center gap-3 sm:gap-4">
                                                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${order.statusColor}`}>{order.status}</span>
                                                    <span className="text-sm font-bold text-gray-900">KSh {order.total.toLocaleString()}</span>
                                                    <ChevronRight className="w-4 h-4 text-gray-300 hidden sm:block" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Personal Info */}
                                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-gray-900">Personal Information</h3>
                                        <button className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold hover:underline">
                                            <Edit3 className="w-3.5 h-3.5" /> Edit
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        {[
                                            { label: 'Full Name', value: 'John Doe' },
                                            { label: 'Email', value: 'john.doe@example.com' },
                                            { label: 'Phone', value: '+254 700 XXX XXX' },
                                            { label: 'Location', value: 'Nairobi, Kenya' },
                                        ].map(f => (
                                            <div key={f.label}>
                                                <p className="text-xs text-gray-400 font-medium mb-0.5">{f.label}</p>
                                                <p className="font-semibold text-gray-800">{f.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-900 text-lg">My Orders</h3>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {MOCK_ORDERS.map(order => (
                                        <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors gap-2 sm:gap-4">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 font-mono">{order.id}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{order.date} • {order.items} items</p>
                                            </div>
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${order.statusColor}`}>{order.status}</span>
                                                <span className="text-sm font-bold text-gray-900">KSh {order.total.toLocaleString()}</span>
                                                <Link href="/support/track-order" className="text-emerald-600 text-xs font-semibold hover:underline">Track</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                                <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <h3 className="font-bold text-gray-700 text-lg mb-1">Your Wishlist</h3>
                                <p className="text-sm text-gray-400 mb-5">Items you&apos;ve saved will appear here</p>
                                <Link href="/" className="btn-emerald inline-block px-6 py-3 rounded-xl text-sm font-bold">Browse Products</Link>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="space-y-4">
                                <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Default</span>
                                            <p className="font-bold text-gray-900 mt-2">Home</p>
                                            <p className="text-sm text-gray-500 mt-1">John Doe<br />Moi Avenue, Nairobi CBD<br />Nairobi, 00100<br />+254 700 XXX XXX</p>
                                        </div>
                                        <button className="text-sm text-emerald-600 font-semibold hover:underline">Edit</button>
                                    </div>
                                </div>
                                <button className="w-full border-2 border-dashed border-gray-300 rounded-2xl py-8 text-sm font-semibold text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors">
                                    + Add New Address
                                </button>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
                                <h3 className="font-bold text-gray-900 text-lg">Account Settings</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Email Notifications', desc: 'Receive order updates via email' },
                                        { label: 'SMS Notifications', desc: 'Get delivery alerts via SMS' },
                                        { label: 'Promotional Emails', desc: 'Deals, offers, and new arrivals' },
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-50">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                                                <p className="text-xs text-gray-400">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-emerald-100 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <button className="text-red-500 text-sm font-semibold hover:underline">Delete Account</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
