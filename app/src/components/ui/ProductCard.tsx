'use client';
import React, { useState } from 'react';
import { ShoppingBag, Heart, Star, Eye, Zap, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviews: number;
    image: string;
    badge?: string;
    badgeColor?: string;
    inStock: boolean;
    stockLevel?: 'in-stock' | 'low-stock' | 'out-of-stock';
    features?: string[];
    isNew?: boolean;
    flashSale?: boolean;
}

interface ProductCardProps {
    product: Product;
    size?: 'default' | 'deal';
}

export default function ProductCard({ product, size = 'default' }: ProductCardProps) {
    const { addItem } = useCart();
    const [wishlisted, setWishlisted] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: product.category,
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const stockInfo = {
        'in-stock': { dot: 'bg-emerald-500', text: 'In Stock', color: 'text-emerald-600' },
        'low-stock': { dot: 'bg-amber-500', text: 'Only 3 left', color: 'text-amber-600' },
        'out-of-stock': { dot: 'bg-gray-400', text: 'Out of Stock', color: 'text-gray-500' },
    }[product.stockLevel || 'in-stock'];

    return (
        <div className={`bg-white rounded-2xl overflow-hidden border border-gray-100 group transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50/80 ${size === 'deal' ? 'min-w-[240px]' : ''}`}>
            {/* Image */}
            <div className="relative bg-gray-50 overflow-hidden" style={{ aspectRatio: '1' }}>
                <div className="w-full h-full flex items-center justify-center text-6xl sm:text-7xl transition-transform duration-400 group-hover:scale-110">
                    {product.image}
                </div>

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                    {product.discount && (
                        <span className="bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm shadow-red-200">
                            -{product.discount}%
                        </span>
                    )}
                    {product.isNew && (
                        <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm shadow-emerald-200">
                            NEW
                        </span>
                    )}
                    {product.flashSale && (
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 animate-pulse-badge shadow-sm">
                            <Zap className="w-3 h-3" /> Flash
                        </span>
                    )}
                </div>

                {/* Wishlist */}
                <button
                    onClick={() => setWishlisted(!wishlisted)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-white"
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <Heart className={`w-3.5 h-3.5 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <button className="bg-white text-gray-700 font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-50 transition-colors shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Eye className="w-3.5 h-3.5" /> Quick View
                    </button>
                </div>

                {/* OOS overlay */}
                {product.stockLevel === 'out-of-stock' && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="bg-gray-500 text-white text-xs font-bold px-4 py-2 rounded-xl">Sold Out</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3.5 sm:p-4">
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-1 group-hover:text-emerald-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-[11px] text-gray-400 mb-2">by {product.brand}</p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className={`w-3 h-3 ${i <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">({product.reviews})</span>
                </div>

                {/* Stock */}
                <div className="flex items-center gap-1.5 mb-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${stockInfo.dot}`} />
                    <span className={`text-[10px] font-semibold ${stockInfo.color}`}>{stockInfo.text}</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-base sm:text-lg font-extrabold text-gray-900">KSh {product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">KSh {product.originalPrice.toLocaleString()}</span>
                    )}
                </div>
                {product.originalPrice && (
                    <p className="text-[11px] text-emerald-600 font-semibold mb-3">
                        Save KSh {(product.originalPrice - product.price).toLocaleString()}
                    </p>
                )}

                {/* Add to cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={product.stockLevel === 'out-of-stock'}
                    className={`w-full flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${addedToCart ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' : 'btn-emerald'} ${product.stockLevel === 'out-of-stock' ? 'opacity-40 cursor-not-allowed !bg-gray-200 !text-gray-500' : ''}`}
                >
                    {addedToCart ? (
                        <><CheckCircle className="w-4 h-4" /> Added!</>
                    ) : (
                        <><ShoppingBag className="w-4 h-4" /> Add to Cart</>
                    )}
                </button>
            </div>
        </div>
    );
}
