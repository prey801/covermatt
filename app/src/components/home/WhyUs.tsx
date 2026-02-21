'use client';
import React from 'react';
import { Award, Users, BarChart3, MapPin, ArrowRight } from 'lucide-react';

const STATS = [
    { value: '50,000+', label: 'Products', icon: <BarChart3 className="w-6 h-6" /> },
    { value: '25,000+', label: 'Happy Customers', icon: <Users className="w-6 h-6" /> },
    { value: '15+', label: 'Years Experience', icon: <Award className="w-6 h-6" /> },
    { value: '10+', label: 'Cities Served', icon: <MapPin className="w-6 h-6" /> },
];

const WHY_ITEMS = [
    { emoji: '🚀', title: 'Fast & Reliable Delivery', desc: 'Same-day delivery in Nairobi. Express shipping to major towns across Kenya.' },
    { emoji: '✅', title: 'Quality Guaranteed', desc: 'All products are sourced from certified manufacturers with full warranties.' },
    { emoji: '💰', title: 'Best Prices in Kenya', desc: 'Professional-grade tools and supplies at prices that make sense for your budget.' },
    { emoji: '📞', title: 'Expert Support', desc: 'Our team includes certified specialists who can guide you to the right product.' },
];

export default function WhyUs() {
    return (
        <section className="py-14 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-14 sm:mb-16">
                    {STATS.map(stat => (
                        <div key={stat.label} className="text-center p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100/50">
                            <div className="flex justify-center mb-3 text-emerald-500">{stat.icon}</div>
                            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">{stat.value}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Why Us */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-14">
                    <div>
                        <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Why Choose Us?</span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 font-heading leading-tight mt-2">
                            Kenya&apos;s Most Trusted Hardware & Electrical Store
                        </h2>
                        <p className="text-gray-500 mt-4 leading-relaxed text-sm sm:text-base">
                            From small home repairs to large construction projects, Covermatt has everything you need — delivered fast, at unbeatable prices, with expert support.
                        </p>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        {WHY_ITEMS.map(item => (
                            <div key={item.title} className="flex gap-4 p-4 rounded-2xl hover:bg-emerald-50/60 transition-colors">
                                <span className="text-2xl sm:text-3xl shrink-0">{item.emoji}</span>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">{item.title}</h3>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Banner */}
                <div className="hero-gradient rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/[0.06] rounded-full" />
                        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/[0.04] rounded-full" />
                    </div>
                    <div className="relative">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading mb-3">Ready to Get Started?</h2>
                        <p className="text-white/70 text-base sm:text-lg mb-8 max-w-lg mx-auto">Shop thousands of quality hardware and electrical products today</p>
                        <a
                            href="#categories"
                            className="inline-flex items-center gap-2.5 bg-white text-emerald-700 font-extrabold px-8 sm:px-10 py-4 rounded-2xl hover:bg-emerald-50 transition-all shadow-xl hover:-translate-y-0.5 hover:shadow-2xl text-sm sm:text-base"
                        >
                            Explore Products <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
