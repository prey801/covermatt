'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, Package, CheckCircle, ChevronLeft, Search, MapPin, Clock } from 'lucide-react';

const MOCK_STEPS = [
    { id: 'pending', label: 'Order Placed', timeOffset: 0 },
    { id: 'processing', label: 'Processing', timeOffset: 2 },
    { id: 'shipped', label: 'Shipped', timeOffset: 24 },
    { id: 'delivered', label: 'Delivered', timeOffset: 48 },
];

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [tracked, setTracked] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchOrder = async (id: string, showLoader: boolean = false) => {
        if (showLoader) setLoading(true);
        setError('');
        
        try {
            const res = await fetch(`/api/orders/${id}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
                setTracked(true);
            } else {
                setError('Order not found. Please check your order number.');
                setTracked(false);
            }
        } catch (err) {
            setError('Failed to fetch order status. Please try again.');
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    const handleTrack = () => {
        if (!orderId.trim()) return;
        fetchOrder(orderId.trim(), true);
    };

    React.useEffect(() => {
        if (!tracked || !order) return;

        // Poll every 5 seconds for real-time updates
        const interval = setInterval(() => {
            fetchOrder(orderId.trim(), false);
        }, 5000);

        return () => clearInterval(interval);
    }, [tracked, orderId, order]);

    const getTimeline = () => {
        if (!order) return [];
        const statusIndex = MOCK_STEPS.findIndex(s => s.id === order.status);
        const currentIndex = statusIndex === -1 ? 0 : statusIndex; // fallback to pending
        const createdAt = new Date(order.createdAt);

        return MOCK_STEPS.map((step, i) => {
            const isDone = i <= currentIndex;
            
            // Generate mock dates relative to creation time for past steps to make it look realistic
            let dateStr = '';
            if (isDone) {
                 const stepDate = new Date(createdAt.getTime() + step.timeOffset * 60 * 60 * 1000);
                 dateStr = stepDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
            }

            return {
                label: step.label,
                done: isDone,
                date: dateStr
            };
        });
    };

    const timeline = getTimeline();

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
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={orderId}
                                onChange={e => setOrderId(e.target.value)}
                                placeholder="e.g. ORD-12345"
                                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all uppercase"
                            />
                            <button 
                                onClick={handleTrack} 
                                disabled={loading || !orderId.trim()}
                                className="btn-emerald px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
                                Track
                            </button>
                        </div>
                        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                    </div>
                </div>

                {/* Results */}
                {tracked && order && (
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm animate-fadeInUp">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Order Number</p>
                                <p className="text-xl font-extrabold text-gray-900 font-mono">{order.id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3 mr-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest whitespace-nowrap hidden sm:inline-block">Live API Sync</span>
                                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full capitalize">{order.status}</span>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-0">
                            {timeline.map((step, i) => (
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
                                <span>{order.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <Package className="w-4 h-4 text-emerald-500" />
                                <span>{order.items?.length || 0} Items</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
