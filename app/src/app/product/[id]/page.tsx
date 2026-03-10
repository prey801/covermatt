import React from 'react';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/products';
import { Star, Truck, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const product = PRODUCTS.find(p => p.id === params.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="bg-white min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Image Area */}
                    <div className="bg-gray-50 rounded-3xl aspect-square flex items-center justify-center text-9xl relative">
                        {product.image}
                        {product.discount && (
                            <span className="absolute top-6 left-6 bg-red-500 text-white text-sm font-extrabold px-3 py-1.5 rounded-xl shadow-sm shadow-red-200">
                                -{product.discount}% OFF
                            </span>
                        )}
                    </div>
                    
                    {/* Details Area */}
                    <div className="flex flex-col justify-center">
                        <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">{product.category}</p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
                        <p className="text-gray-500 mb-4">by <span className="font-semibold text-gray-700">{product.brand}</span></p>
                        
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                                ))}
                            </div>
                            <span className="text-sm font-medium text-gray-400">({product.reviews} reviews)</span>
                        </div>
                        
                        <div className="flex items-end gap-3 mb-8">
                            <span className="text-3xl font-extrabold text-gray-900">KSh {product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-400 line-through mb-1">KSh {product.originalPrice.toLocaleString()}</span>
                            )}
                        </div>
                        
                        {product.features && product.features.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-bold text-gray-900 mb-3">Key Features</h3>
                                <ul className="space-y-2">
                                    {product.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        <div className="flex gap-4 mb-8">
                            <button className="flex-1 btn-emerald py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm">
                                <ShoppingBag className="w-5 h-5" /> Add to Cart
                            </button>
                        </div>
                        
                        {/* Trust strip */}
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 mt-auto">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Truck className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-xs text-gray-900">Fast Delivery</p>
                                    <p className="text-[10px] text-gray-500">1-2 business days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-xs text-gray-900">1 Year Warranty</p>
                                    <p className="text-[10px] text-gray-500">Genuine products</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
