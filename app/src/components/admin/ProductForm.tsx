'use client';
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, AlertCircle, UploadCloud, X } from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
    initial?: Partial<ProductFormData>;
    productId?: string;
}

export interface ProductFormData {
    name: string;
    brand: string;
    category: string;
    price: string;
    originalPrice: string;
    discount: string;
    image: string;
    badge: string;
    stockLevel: 'in-stock' | 'low-stock' | 'out-of-stock';
    inStock: boolean;
    features: string;
    isNew: boolean;
    flashSale: boolean;
}

const CATEGORIES = [
    'Deep Fryers', 'Electric Kettles', 'Cooking Appliances', 'Cookware & Kitchen Tools',
    'Home Appliances', 'Beverage & Coffee', 'Power Tools', 'Electrical Supplies',
    'Plumbing', 'Safety Equipment', 'Paint & Supplies', 'Garden & Outdoor',
    'Lighting', 'Hand Tools', 'Hardware', 'Other',
];

const EMPTY: ProductFormData = {
    name: '', brand: '', category: 'Power Tools', price: '', originalPrice: '',
    discount: '', image: '📦', badge: '', stockLevel: 'in-stock', inStock: true,
    features: '', isNew: false, flashSale: false,
};

export default function ProductForm({ initial, productId }: ProductFormProps) {
    const router = useRouter();
    const [form, setForm] = useState<ProductFormData>({ ...EMPTY, ...initial });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEdit = !!productId;

    function set<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
        setForm(prev => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
                discount: form.discount ? Number(form.discount) : undefined,
                features: form.features ? form.features.split('\n').filter(Boolean) : [],
            };

            const url = isEdit ? `/api/products/${productId}` : '/api/products';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error ?? 'Failed to save product.');
                return;
            }

            router.push('/admin/products');
            router.refresh();
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            await uploadImage(files[0]);
        }
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await uploadImage(files[0]);
        }
    };

    const uploadImage = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file format.');
            return;
        }

        setUploadingImage(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to upload image.');
                return;
            }

            const data = await res.json();
            set('image', data.url);
        } catch (err) {
            setError('Network error during upload. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/admin/products" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
                    <p className="text-gray-500 text-sm">{isEdit ? `Editing product #${productId}` : 'Fill in the details below to add a new product.'}</p>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Basic Information</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                            <input
                                required
                                value={form.name}
                                onChange={e => set('name', e.target.value)}
                                placeholder="e.g. Deep Fryer Single Tank 6L"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
                            <input
                                value={form.brand}
                                onChange={e => set('brand', e.target.value)}
                                placeholder="e.g. Ramtons"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                            <select
                                required
                                value={form.category}
                                onChange={e => set('category', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                            >
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Image / Emoji *</label>
                            <div 
                                className={`relative border-2 border-dashed rounded-xl p-6 transition-colors flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px] ${
                                    isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                    className="hidden" 
                                />
                                {uploadingImage ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-sm text-gray-500">Uploading image...</p>
                                    </div>
                                ) : form.image && form.image.startsWith('/') ? (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={form.image} alt="Product preview" className="max-h-40 rounded object-contain" />
                                        <button 
                                            type="button" 
                                            onClick={(e) => { e.stopPropagation(); set('image', '📦'); }}
                                            className="absolute top-0 right-0 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors transform translate-x-2 -translate-y-2"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud className={`w-10 h-10 mb-3 ${isDragging ? 'text-emerald-500' : 'text-gray-400'}`} />
                                        <p className="text-sm font-medium text-gray-700">
                                            Drag & drop an image here, or click to select
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Supports JPG, PNG, WEBP.
                                        </p>
                                        <div className="mt-4 flex items-center gap-2 w-full max-w-xs" onClick={e => e.stopPropagation()}>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">Or use Emoji:</span>
                                            <input
                                                value={form.image}
                                                onChange={e => set('image', e.target.value)}
                                                placeholder="📦"
                                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Badge (optional)</label>
                            <input
                                value={form.badge}
                                onChange={e => set('badge', e.target.value)}
                                placeholder="e.g. Popular, Hot, New"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Features (one per line)</label>
                        <textarea
                            value={form.features}
                            onChange={e => set('features', e.target.value)}
                            placeholder={"6L capacity\nAdjustable thermostat\nCool-touch handle"}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                        />
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Pricing</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sale Price (KSh) *</label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={form.price}
                                onChange={e => set('price', e.target.value)}
                                placeholder="4999"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price (KSh)</label>
                            <input
                                type="number"
                                min="0"
                                value={form.originalPrice}
                                onChange={e => set('originalPrice', e.target.value)}
                                placeholder="6500"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount %</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={form.discount}
                                onChange={e => set('discount', e.target.value)}
                                placeholder="23"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Inventory */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Inventory & Flags</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Status</label>
                            <select
                                value={form.stockLevel}
                                onChange={e => set('stockLevel', e.target.value as ProductFormData['stockLevel'])}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                            >
                                <option value="in-stock">In Stock</option>
                                <option value="low-stock">Low Stock</option>
                                <option value="out-of-stock">Out of Stock</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-3 pt-1">
                            {[
                                { key: 'inStock', label: 'Available for purchase' },
                                { key: 'isNew', label: 'Mark as New Arrival' },
                                { key: 'flashSale', label: 'Include in Flash Sale' },
                            ].map(({ key, label }) => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form[key as keyof ProductFormData] as boolean}
                                        onChange={e => set(key as keyof ProductFormData, e.target.checked as never)}
                                        className="w-4 h-4 text-emerald-500 rounded"
                                    />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3">
                    <Link href="/admin/products" className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                    >
                        {saving ? (
                            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
                        ) : (
                            <><Save className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Create Product'}</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
