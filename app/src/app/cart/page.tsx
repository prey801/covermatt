'use client';
import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Lock, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, itemCount } = useCart();

    return (
        <div className="bg-[#f1f5f9] min-h-screen py-10">
            <div className="max-w-[1400px] mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium">Shopping Cart</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1f2937] font-[Poppins] mb-6 sm:mb-8">
                    Shopping Cart <span className="text-emerald-500 text-lg sm:text-xl font-semibold">({itemCount} items)</span>
                </h1>

                {items.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 sm:p-20 text-center shadow-sm">
                        <ShoppingBag className="w-14 h-14 sm:w-20 sm:h-20 text-gray-200 mx-auto mb-4 sm:mb-6" />
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3">Your cart is empty</h2>
                        <p className="text-gray-400 mb-8">Looks like you haven&apos;t added anything yet.</p>
                        <Link href="/" className="btn-emerald px-8 py-4 rounded-2xl font-bold inline-block">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                        {/* Cart items */}
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex gap-3 sm:gap-4">
                                    <div className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] bg-[#f9fafb] rounded-xl flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0">
                                        {item.image}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between gap-4">
                                            <div>
                                                <p className="text-xs text-emerald-500 font-medium mb-0.5">{item.category}</p>
                                                <h3 className="font-bold text-[#1f2937] leading-snug">{item.name}</h3>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors text-gray-400 flex-shrink-0 h-fit"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                                    <Minus className="w-3.5 h-3.5 text-gray-600" />
                                                </button>
                                                <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                                    <Plus className="w-3.5 h-3.5 text-gray-600" />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-[#1f2937]">KSh {(item.price * item.quantity).toLocaleString()}</p>
                                                {item.quantity > 1 && <p className="text-xs text-gray-400">KSh {item.price.toLocaleString()} each</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Continue shopping */}
                            <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors mt-2">
                                <ArrowLeft className="w-4 h-4" /> Continue Shopping
                            </Link>
                        </div>

                        {/* Summary panel */}
                        <div className="sticky top-28 h-fit">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="font-bold text-lg text-[#1f2937] mb-5">Order Summary</h2>

                                {/* Coupon */}
                                <div className="flex gap-2 mb-5">
                                    <input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500 transition-colors"
                                    />
                                    <button className="btn-emerald px-4 py-2.5 rounded-xl text-sm font-semibold">Apply</button>
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 mb-5 border-t border-gray-100 pt-5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal ({itemCount} items)</span>
                                        <span className="font-semibold">KSh {total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="font-semibold text-emerald-600">{total >= 5000 ? 'Free' : 'KSh 300'}</span>
                                    </div>
                                    {total < 5000 && (
                                        <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                                            Add KSh {(5000 - total).toLocaleString()} more to get free shipping!
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-6">
                                    <span className="font-bold text-[#1f2937]">Total</span>
                                    <span className="text-2xl font-extrabold text-[#1f2937]">KSh {(total + (total < 5000 ? 300 : 0)).toLocaleString()}</span>
                                </div>

                                <Link href="/checkout" className="btn-emerald w-full block text-center py-4 rounded-2xl font-bold text-base mb-3">
                                    Proceed to Checkout
                                </Link>

                                {/* Trust badges */}
                                <div className="flex justify-center gap-4 mt-4">
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <Lock className="w-3 h-3" /> Secure Checkout
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <Truck className="w-3 h-3" /> Fast Delivery
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <RefreshCw className="w-3 h-3" /> Easy Returns
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
