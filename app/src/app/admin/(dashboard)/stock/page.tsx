'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
    Warehouse, Search, Filter, Package, CheckSquare, Square,
    ArrowUpDown, ChevronDown, Plus, AlertTriangle, CheckCircle2, XCircle
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stockLevel: string;
    image?: string;
}

const STOCK_LEVELS = ['in-stock', 'low-stock', 'out-of-stock'] as const;

const STOCK_CONFIG: Record<string, { label: string; bg: string; text: string; icon: any }> = {
    'in-stock': { label: 'In Stock', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2 },
    'low-stock': { label: 'Low Stock', bg: 'bg-amber-100', text: 'text-amber-700', icon: AlertTriangle },
    'out-of-stock': { label: 'Out of Stock', bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
};

export default function StockManagementPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [stockFilter, setStockFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [bulkLevel, setBulkLevel] = useState('');
    const [bulkUpdating, setBulkUpdating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const categories = ['all', ...Array.from(new Set(products.map(p => p.category))).sort()];

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                setProducts(await res.json());
            }
        } catch { /* silently fail */ }
        setLoading(false);
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    // Filtered products
    const filtered = products.filter(p => {
        if (stockFilter !== 'all' && p.stockLevel !== stockFilter) return false;
        if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
        if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.category.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    // Stats
    const inStockCount = products.filter(p => p.stockLevel === 'in-stock').length;
    const lowStockCount = products.filter(p => p.stockLevel === 'low-stock').length;
    const outOfStockCount = products.filter(p => p.stockLevel === 'out-of-stock').length;

    // Selection
    const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id));

    function toggleAll() {
        if (allSelected) {
            setSelected(new Set());
        } else {
            setSelected(new Set(filtered.map(p => p.id)));
        }
    }

    function toggleOne(id: string) {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    // Inline single update
    async function updateStock(id: string, newLevel: string) {
        setEditingId(null);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stockLevel: newLevel }),
            });
            if (res.ok) {
                setProducts(prev => prev.map(p => p.id === id ? { ...p, stockLevel: newLevel } : p));
                showToast('Stock updated');
            } else {
                showToast('Failed to update', 'error');
            }
        } catch {
            showToast('Network error', 'error');
        }
    }

    // Bulk update
    async function handleBulkUpdate() {
        if (!bulkLevel || selected.size === 0) return;
        setBulkUpdating(true);
        try {
            const res = await fetch('/api/products/stock', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: [...selected], stockLevel: bulkLevel }),
            });
            if (res.ok) {
                const data = await res.json();
                setProducts(prev =>
                    prev.map(p => selected.has(p.id) ? { ...p, stockLevel: bulkLevel } : p)
                );
                showToast(`Updated ${data.modifiedCount} product${data.modifiedCount !== 1 ? 's' : ''}`);
                setSelected(new Set());
                setBulkLevel('');
            } else {
                showToast('Bulk update failed', 'error');
            }
        } catch {
            showToast('Network error', 'error');
        }
        setBulkUpdating(false);
    }

    const statCards = [
        { label: 'Total Products', value: products.length, color: 'text-purple-600', bg: 'bg-purple-50', icon: Package },
        { label: 'In Stock', value: inStockCount, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2, onClick: () => setStockFilter(stockFilter === 'in-stock' ? 'all' : 'in-stock') },
        { label: 'Low Stock', value: lowStockCount, color: 'text-amber-600', bg: 'bg-amber-50', icon: AlertTriangle, onClick: () => setStockFilter(stockFilter === 'low-stock' ? 'all' : 'low-stock') },
        { label: 'Out of Stock', value: outOfStockCount, color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, onClick: () => setStockFilter(stockFilter === 'out-of-stock' ? 'all' : 'out-of-stock') },
    ];

    return (
        <div className="p-8 space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all animate-[slideIn_0.3s_ease] ${
                    toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Warehouse className="w-6 h-6 text-emerald-600" />
                        Stock Manager
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage inventory levels for all products</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(s => {
                    const Icon = s.icon;
                    const isActive = stockFilter !== 'all' && s.label.toLowerCase().replace(/ /g, '-') === stockFilter;
                    return (
                        <button
                            key={s.label}
                            onClick={s.onClick}
                            className={`bg-white rounded-2xl border p-4 shadow-sm text-left transition-all hover:shadow-md ${
                                isActive ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-100'
                            } ${s.onClick ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                                <Icon className={`w-4 h-4 ${s.color}`} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                        </button>
                    );
                })}
            </div>

            {/* Filters + Bulk Actions */}
            <div className="flex flex-wrap items-center gap-3">
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
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                    >
                        {categories.map(c => (
                            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
                        ))}
                    </select>
                </div>
                <div className="relative">
                    <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={stockFilter}
                        onChange={e => setStockFilter(e.target.value)}
                        className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                    >
                        <option value="all">All Stock Levels</option>
                        <option value="in-stock">In Stock</option>
                        <option value="low-stock">Low Stock</option>
                        <option value="out-of-stock">Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* Bulk Action Bar */}
            {selected.size > 0 && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3 animate-[slideIn_0.2s_ease]">
                    <span className="text-sm font-semibold text-emerald-700">
                        {selected.size} product{selected.size !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center gap-2 ml-auto">
                        <select
                            value={bulkLevel}
                            onChange={e => setBulkLevel(e.target.value)}
                            className="px-3 py-2 bg-white border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Change stock to...</option>
                            <option value="in-stock">In Stock</option>
                            <option value="low-stock">Low Stock</option>
                            <option value="out-of-stock">Out of Stock</option>
                        </select>
                        <button
                            onClick={handleBulkUpdate}
                            disabled={!bulkLevel || bulkUpdating}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {bulkUpdating ? 'Updating...' : 'Apply'}
                        </button>
                        <button
                            onClick={() => { setSelected(new Set()); setBulkLevel(''); }}
                            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Product Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-7 h-7 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center py-20 text-gray-400">
                        <Package className="w-12 h-12 mb-2 opacity-30" />
                        <p className="font-medium">No products found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                <th className="text-left px-4 py-3 w-10">
                                    <button onClick={toggleAll} className="text-gray-400 hover:text-emerald-600 transition-colors">
                                        {allSelected ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
                                    </button>
                                </th>
                                <th className="text-left px-4 py-3">Product</th>
                                <th className="text-left px-4 py-3">Category</th>
                                <th className="text-left px-4 py-3">Price</th>
                                <th className="text-left px-4 py-3">Stock Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(product => {
                                const config = STOCK_CONFIG[product.stockLevel] ?? STOCK_CONFIG['in-stock'];
                                const isSelected = selected.has(product.id);
                                const isEditing = editingId === product.id;

                                return (
                                    <tr
                                        key={product.id}
                                        className={`transition-colors ${isSelected ? 'bg-emerald-50/50' : 'hover:bg-gray-50/50'}`}
                                    >
                                        <td className="px-4 py-4">
                                            <button onClick={() => toggleOne(product.id)} className="text-gray-400 hover:text-emerald-600 transition-colors">
                                                {isSelected ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.image && product.image.startsWith('/') ? (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                                ) : (
                                                    <span className="text-2xl">{product.image ?? '📦'}</span>
                                                )}
                                                <p className="font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-600">{product.category}</td>
                                        <td className="px-4 py-4 font-semibold text-gray-800">KSh {product.price?.toLocaleString()}</td>
                                        <td className="px-4 py-4">
                                            {isEditing ? (
                                                <select
                                                    autoFocus
                                                    defaultValue={product.stockLevel}
                                                    onChange={e => updateStock(product.id, e.target.value)}
                                                    onBlur={() => setEditingId(null)}
                                                    className="px-3 py-1.5 border border-emerald-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                                >
                                                    {STOCK_LEVELS.map(l => (
                                                        <option key={l} value={l}>{STOCK_CONFIG[l].label}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <button
                                                    onClick={() => setEditingId(product.id)}
                                                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full transition-all hover:ring-2 hover:ring-offset-1 hover:ring-emerald-300 ${config.bg} ${config.text}`}
                                                >
                                                    <config.icon className="w-3 h-3" />
                                                    {config.label}
                                                    <ChevronDown className="w-3 h-3 opacity-50" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
