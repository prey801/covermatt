'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2, Package, Filter } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    brand?: string;
    category: string;
    price: number;
    inStock: boolean;
    stockLevel: string;
    image?: string;
    badge?: string;
    flashSale?: boolean;
}

const STOCK_STYLES: Record<string, string> = {
    'in-stock': 'bg-emerald-100 text-emerald-700',
    'low-stock': 'bg-amber-100 text-amber-700',
    'out-of-stock': 'bg-red-100 text-red-700',
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [deleting, setDeleting] = useState<string | null>(null);

    const categories = ['all', ...Array.from(new Set(products.map(p => p.category))).sort()];

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category !== 'all') params.set('category', category);
        const res = await fetch(`/api/products?${params}`);
        setProducts(await res.json());
        setLoading(false);
    }, [search, category]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    async function handleDelete(id: string, name: string) {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        setDeleting(id);
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        setProducts(prev => prev.filter(p => p.id !== id));
        setDeleting(null);
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 text-sm mt-1">{products.length} products total</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-64">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                    >
                        {categories.map(c => (
                            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-7 h-7 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center py-20 text-gray-400">
                        <Package className="w-12 h-12 mb-2 opacity-30" />
                        <p className="font-medium">No products found</p>
                        <p className="text-sm">Try a different search or category</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                <th className="text-left px-6 py-3">Product</th>
                                <th className="text-left px-4 py-3">Category</th>
                                <th className="text-left px-4 py-3">Price</th>
                                <th className="text-left px-4 py-3">Stock</th>
                                <th className="text-right px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{product.image ?? '📦'}</span>
                                            <div>
                                                <p className="font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                                                <p className="text-xs text-gray-400">{product.brand ?? '—'} · ID: {product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">{product.category}</td>
                                    <td className="px-4 py-4 font-semibold text-gray-800">KSh {product.price.toLocaleString()}</td>
                                    <td className="px-4 py-4">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STOCK_STYLES[product.stockLevel] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {product.stockLevel.replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                disabled={deleting === product.id}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
