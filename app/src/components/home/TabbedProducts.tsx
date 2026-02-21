'use client';
import React, { useState } from 'react';
import { Star, Flame, Sparkles, Tag } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { PRODUCTS } from '@/lib/products';

const TABS = [
    { id: 'featured', label: 'Featured', icon: <Star className="w-4 h-4" /> },
    { id: 'bestsellers', label: 'Best Sellers', icon: <Flame className="w-4 h-4" /> },
    { id: 'new', label: 'New Arrivals', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'sale', label: 'On Sale', icon: <Tag className="w-4 h-4" /> },
];

function getProducts(tab: string) {
    switch (tab) {
        case 'featured': return PRODUCTS.slice(0, 8);
        case 'bestsellers': return PRODUCTS.filter(p => p.reviews > 150);
        case 'new': return PRODUCTS.filter(p => p.isNew);
        case 'sale': return PRODUCTS.filter(p => !!p.discount);
        default: return PRODUCTS.slice(0, 8);
    }
}

export default function TabbedProducts() {
    const [activeTab, setActiveTab] = useState('featured');
    const products = getProducts(activeTab);

    return (
        <section className="py-14 sm:py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <div className="mb-8">
                    <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Our Products</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading mt-1">Browse Our Store</h2>
                </div>

                {/* Tab bar */}
                <div className="flex gap-1 mb-8 border-b-2 border-gray-200 overflow-x-auto hide-scrollbar">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 sm:px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-all border-b-[3px] -mb-[2px] ${activeTab === tab.id
                                    ? 'border-emerald-500 text-emerald-600'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <span className={activeTab === tab.id ? 'text-emerald-500' : 'text-gray-300'}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Product grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-300 text-6xl mb-4">📦</p>
                        <p className="text-gray-500 text-lg font-bold">No products here yet</p>
                        <p className="text-gray-400 text-sm mt-1">Check back soon for new items!</p>
                    </div>
                )}

                {/* Load more */}
                <div className="text-center mt-10">
                    <button className="border-2 border-emerald-500 text-emerald-600 font-bold px-8 py-3.5 rounded-2xl hover:bg-emerald-50 transition-colors text-sm">
                        Load More Products
                    </button>
                </div>
            </div>
        </section>
    );
}
