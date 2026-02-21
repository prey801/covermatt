'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

const CATEGORIES = [
    { id: 1, name: 'Power Tools', count: '250+', emoji: '🔧', gradient: 'from-emerald-500 to-teal-600', href: '#', description: 'Drills, grinders, saws and more', badge: 'Popular' },
    { id: 2, name: 'Electrical Supplies', count: '180+', emoji: '💡', gradient: 'from-amber-400 to-orange-500', href: '#', description: 'Cables, switches, panels' },
    { id: 3, name: 'Plumbing', count: '120+', emoji: '🔩', gradient: 'from-blue-500 to-blue-600', href: '#', description: 'Pipes, fittings, valves' },
    { id: 4, name: 'Safety Equipment', count: '90+', emoji: '⛑️', gradient: 'from-red-500 to-rose-600', href: '#', description: 'Helmets, gloves, boots', badge: 'Essential' },
    { id: 5, name: 'Paint & Supplies', count: '150+', emoji: '🎨', gradient: 'from-purple-500 to-purple-600', href: '#', description: 'Interior & exterior paints' },
    { id: 6, name: 'Garden & Outdoor', count: '110+', emoji: '🌿', gradient: 'from-lime-500 to-green-600', href: '#', description: 'Hoses, tools, furniture' },
];

export default function CategoryTiles() {
    return (
        <section id="categories" className="bg-gray-50 py-14 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-end justify-between mb-8 sm:mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                            <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest">Categories</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
                            Shop by Category
                        </h2>
                    </div>
                    <Link href="/" className="hidden sm:flex items-center gap-1.5 text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors group">
                        All categories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
                    {CATEGORIES.map(cat => (
                        <Link key={cat.id} href={cat.href} className="bg-white rounded-2xl overflow-hidden border border-gray-100 group card-hover">
                            {/* Gradient top */}
                            <div className={`h-28 sm:h-36 bg-gradient-to-br ${cat.gradient} relative flex items-center justify-center`}>
                                <span className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-300">{cat.emoji}</span>
                                {cat.badge && (
                                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full text-gray-700 flex items-center gap-1">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {cat.badge}
                                    </span>
                                )}
                                {/* Decorative circles */}
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                            </div>

                            {/* Info */}
                            <div className="p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-emerald-600 transition-colors">{cat.name}</h3>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors group-hover:translate-x-0.5" />
                                </div>
                                <p className="text-xs text-gray-400 mb-2">{cat.description}</p>
                                <span className="text-emerald-600 text-xs font-bold">{cat.count} products</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
