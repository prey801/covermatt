import React from 'react';
import { PRODUCTS } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';

export default function CategoryPage({ params }: { params: { slug: string } }) {
    const decodedSlug = decodeURIComponent(params.slug).replace(/-/g, ' ');
    const products = PRODUCTS.filter(
        p => p.category.toLowerCase() === decodedSlug.toLowerCase() ||
             p.category.toLowerCase().includes(decodedSlug.toLowerCase().split(' ')[0])
    );

    return (
        <div className="bg-gray-50 min-h-screen py-10 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 capitalize font-heading mb-2">
                        {decodedSlug}
                    </h1>
                    <p className="text-gray-500 font-medium">{products.length} products found</p>
                </div>
                
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-6xl mb-4">🛒</p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
                        <p className="text-gray-500 max-w-md mx-auto">
                            We currently don't have any products in the <span className="font-semibold text-gray-700 capitalize">{decodedSlug}</span> category. Check back later for new arrivals!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
