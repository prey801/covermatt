'use client';
import React, { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { PRODUCTS } from '@/lib/products';

const DEAL_PRODUCTS = PRODUCTS.filter(p => p.discount && p.discount > 0);

export default function FeaturedDeals() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 'left' | 'right') => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-14 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Flame className="w-4 h-4 text-red-500" />
                            <span className="text-red-500 text-xs font-bold uppercase tracking-widest">Flash Deals</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">Today&apos;s Hot Deals</h2>
                        <p className="text-gray-400 text-sm mt-1">Limited time offers you can&apos;t miss</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-colors text-gray-400">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-colors text-gray-400">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <a href="/" className="hidden sm:flex items-center gap-1.5 text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors group">
                            All deals <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>

                {/* Scrollable row */}
                <div ref={scrollRef} className="flex gap-4 sm:gap-5 overflow-x-auto hide-scrollbar pb-10 -mb-6">
                    {DEAL_PRODUCTS.map(product => (
                        <div key={product.id} className="flex-shrink-0 w-[230px] sm:w-[260px]">
                            <ProductCard product={product} size="deal" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
