'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, Star, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/lib/products';

const WISHLIST_ITEMS = PRODUCTS.slice(0, 6);

export default function WishlistPage() {
    const { addItem } = useCart();
    const [items, setItems] = useState(WISHLIST_ITEMS);

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const handleAddToCart = (item: typeof WISHLIST_ITEMS[0]) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.originalPrice,
            image: item.image,
            category: item.category,
        });
    };

    if (items.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
                    <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h1 className="text-2xl font-extrabold text-gray-900 font-heading mb-2">Your Wishlist is Empty</h1>
                    <p className="text-gray-400 mb-8">Browse our products and save your favorites here!</p>
                    <Link href="/" className="btn-emerald inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm">
                        <ShoppingBag className="w-4 h-4" /> Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading flex items-center gap-3">
                            <Heart className="w-7 h-7 text-red-500 fill-red-500" /> My Wishlist
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">{items.length} items saved</p>
                    </div>
                    <Link href="/" className="text-emerald-600 text-sm font-semibold hover:underline flex items-center gap-1">
                        Continue Shopping <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-emerald-50/80 transition-all">
                            <div className="relative bg-gray-50 aspect-square flex items-center justify-center text-6xl sm:text-7xl">
                                {item.image}
                                {item.discount && (
                                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                                        -{item.discount}%
                                    </span>
                                )}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                    aria-label="Remove from wishlist"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="p-4 sm:p-5">
                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">{item.category}</p>
                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">{item.name}</h3>
                                <p className="text-xs text-gray-400 mb-2">by {item.brand}</p>

                                <div className="flex items-center gap-1.5 mb-3">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} className={`w-3 h-3 ${i <= Math.round(item.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-gray-400">({item.reviews})</span>
                                </div>

                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-lg font-extrabold text-gray-900">KSh {item.price.toLocaleString()}</span>
                                    {item.originalPrice && (
                                        <span className="text-xs text-gray-400 line-through">KSh {item.originalPrice.toLocaleString()}</span>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className="btn-emerald w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
