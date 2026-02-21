'use client';
import React from 'react';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function MiniCart() {
    const { items, removeItem, updateQuantity, total, itemCount, setIsCartOpen } = useCart();

    return (
        <div className="absolute top-full right-0 mt-2 w-[360px] bg-white rounded-2xl shadow-2xl shadow-gray-300/40 border border-gray-100 z-50 animate-slideDown overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-500" />
                    Your Cart
                    <span className="bg-emerald-100 text-emerald-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">{itemCount}</span>
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {items.length === 0 ? (
                <div className="px-5 py-10 text-center">
                    <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-700 mb-1">Your cart is empty</p>
                    <p className="text-xs text-gray-400 mb-5">Browse our products and find something you love!</p>
                    <Link href="/" onClick={() => setIsCartOpen(false)} className="btn-emerald inline-block px-5 py-2.5 rounded-xl text-sm font-bold">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <>
                    {/* Items */}
                    <div className="max-h-[280px] overflow-auto px-4 py-3 space-y-3">
                        {items.map(item => (
                            <div key={item.id} className="flex gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                                    {item.image}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-900 line-clamp-1 mb-0.5">{item.name}</p>
                                    <p className="text-xs font-bold text-emerald-600">KSh {(item.price * item.quantity).toLocaleString()}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                                <Minus className="w-3 h-3 text-gray-500" />
                                            </button>
                                            <span className="w-7 text-center text-xs font-bold text-gray-700">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                                <Plus className="w-3 h-3 text-gray-500" />
                                            </button>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 px-5 py-4">
                        <div className="flex justify-between mb-4">
                            <span className="text-sm text-gray-500">Subtotal</span>
                            <span className="text-base font-extrabold text-gray-900">KSh {total.toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Link href="/cart" onClick={() => setIsCartOpen(false)} className="block text-center border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                                View Cart
                            </Link>
                            <Link href="/checkout" onClick={() => setIsCartOpen(false)} className="btn-emerald block text-center py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1">
                                Checkout <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
