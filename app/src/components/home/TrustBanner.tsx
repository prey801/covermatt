'use client';
import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

const TRUST_ITEMS = [
    { icon: <Truck className="w-5 h-5" />, title: 'Free Delivery', desc: 'Orders over KSh 5,000' },
    { icon: <ShieldCheck className="w-5 h-5" />, title: 'Secure Payment', desc: 'M-Pesa, Card & PayPal' },
    { icon: <RefreshCw className="w-5 h-5" />, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: <Headphones className="w-5 h-5" />, title: '24/7 Support', desc: 'Always here to help' },
];

export default function TrustBanner() {
    return (
        <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {TRUST_ITEMS.map(item => (
                        <div key={item.title} className="flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors group">
                            <div className="w-11 h-11 bg-emerald-50 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-500 transition-colors shrink-0">
                                {item.icon}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-900">{item.title}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
