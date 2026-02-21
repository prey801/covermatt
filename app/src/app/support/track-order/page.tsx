'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, Package, CheckCircle, ChevronLeft, Search, MapPin, Clock } from 'lucide-react';

const MOCK_STEPS = [
    { label: 'Order Placed', date: 'Feb 19, 2026 • 10:32 AM', done: true },
    { label: 'Payment Confirmed', date: 'Feb 19, 2026 • 10:35 AM', done: true },
    { label: 'Processing', date: 'Feb 19, 2026 • 2:15 PM', done: true },
    { label: 'Shipped', date: 'Feb 20, 2026 • 9:00 AM', done: true },
    { label: 'Out for Delivery', date: 'Feb 21, 2026 • 8:45 AM', done: false },
    { label: 'Delivered', date: '', done: false },
];

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [tracked, setTracked] = useState(false);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="hero-gradient py-14 sm:py-16 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Link href="/support" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Support
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">Track Your Order</h1>
                    <p className="text-white/70 mt-2">Enter your order number to see the latest delivery status.</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
                {/* Search */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8">
                    <h2 className="font-bold text-gray-900 mb-4">Enter Order Number</h2>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={orderId}
                            onChange={e => setOrderId(e.target.value)}
                            placeholder="e.g. ORD-12345"
                            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all"
                        />
                        <button onClick={() => setTracked(true)} className="btn-emerald px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2">
                            <Search className="w-4 h-4" /> Track
                        </button>
                    </div>
                </div>

                {/* Results */}
                {tracked && (
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm animate-fadeInUp">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Order Number</p>
                                <p className="text-xl font-extrabold text-gray-900 font-mono">{orderId || 'ORD-12345'}</p>
                            </div>
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">In Transit</span>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-0">
                            {MOCK_STEPS.map((step, i) => (
                                <div key={step.label} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                            {step.done ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                                        </div>
                                        {i < MOCK_STEPS.length - 1 && (
                                            <div className={`w-0.5 h-10 ${step.done ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                                        )}
                                    </div>
                                    <div className="pt-1 pb-6">
                                        <p className={`text-sm font-bold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                                        {step.date && <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-gray-50 rounded-xl p-4 mt-4 flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Truck className="w-4 h-4 text-emerald-500" />
                                <span>Standard Delivery</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                <span>Nairobi, Westlands</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <Clock className="w-4 h-4 text-emerald-500" />
                                <span>Est. delivery: Today by 5PM</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
