'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Search, ShoppingBag, Heart, User, MapPin,
    Menu, X, ChevronDown, Zap, Plug, Wrench, Hammer, Lightbulb,
    TreePine, Paintbrush, Shield, Flame, Truck, HelpCircle, Phone
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import MiniCart from '@/components/cart/MiniCart';

const NAV_CATEGORIES = [
    { icon: <Zap className="w-4 h-4" />, label: 'Power Tools', href: '/' },
    { icon: <Plug className="w-4 h-4" />, label: 'Electrical', href: '/' },
    { icon: <Wrench className="w-4 h-4" />, label: 'Plumbing', href: '/' },
    { icon: <Hammer className="w-4 h-4" />, label: 'Hardware', href: '/' },
    { icon: <Lightbulb className="w-4 h-4" />, label: 'Lighting', href: '/' },
    { icon: <TreePine className="w-4 h-4" />, label: 'Garden & Outdoor', href: '/' },
    { icon: <Paintbrush className="w-4 h-4" />, label: 'Paint & Supplies', href: '/' },
    { icon: <Shield className="w-4 h-4" />, label: 'Safety Equipment', href: '/' },
];

const SEARCH_SUGGESTIONS = [
    'Power Drill', 'LED Bulbs', 'PVC Pipes', 'Safety Helmet',
    'Paint Brushes', 'Extension Cord', 'Angle Grinder', 'Cement',
];

export default function Header() {
    const { itemCount, total, setIsCartOpen, isCartOpen } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSearchFocused(false);
                setIsCartOpen(false);
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [setIsCartOpen]);

    const filteredSuggestions = SEARCH_SUGGESTIONS.filter(s =>
        searchQuery ? s.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );

    return (
        <>
            {/* ===== TOP UTILITY BAR ===== */}
            <div className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline text-gray-300">Welcome to Covermatt</span>
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                            <MapPin className="w-3.5 h-3.5" /> Nairobi
                        </span>
                    </div>
                    <div className="flex items-center divide-x divide-gray-700">
                        <Link href="/support/contact" className="px-3 py-1 text-gray-300 hover:text-emerald-400 transition-colors hidden md:block">Store Locator</Link>
                        <Link href="/support/track-order" className="px-3 py-1 text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5" /> Track Order
                        </Link>
                        <Link href="/support/faqs" className="px-3 py-1 text-gray-300 hover:text-emerald-400 transition-colors hidden md:block">Help & FAQs</Link>
                        <Link href="/login" className="px-3 py-1 text-gray-300 hover:text-emerald-400 transition-colors hidden md:block">Login / Register</Link>
                    </div>
                </div>
            </div>

            {/* ===== MAIN HEADER ===== */}
            <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? 'shadow-lg shadow-gray-200/60' : 'shadow-sm'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-[88px] flex items-center gap-3 sm:gap-6">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-lg font-extrabold text-gray-900 leading-tight font-heading">
                                Cover<span className="text-emerald-500">matt</span>
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase -mt-0.5">Hardware & Electricals</p>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 relative" ref={searchRef}>
                        <div className={`flex items-center rounded-xl border-2 transition-all duration-200 ${searchFocused ? 'border-emerald-500 shadow-lg shadow-emerald-500/10 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                            <select className="bg-transparent text-xs font-medium text-gray-500 pl-3 pr-1 py-3 border-r border-gray-200 outline-none cursor-pointer hidden md:block rounded-l-xl">
                                <option>All</option>
                                <option>Power Tools</option>
                                <option>Electrical</option>
                                <option>Plumbing</option>
                            </select>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                                placeholder="Search for products, brands, or categories..."
                                className="flex-1 bg-transparent px-4 py-3 text-sm outline-none text-gray-700 placeholder-gray-400 min-w-0"
                                aria-label="Search products"
                            />
                            <button className="btn-emerald px-4 sm:px-5 py-3 rounded-r-[10px] flex items-center gap-2 text-sm" aria-label="Search">
                                <Search className="w-4 h-4" />
                                <span className="hidden sm:inline">Search</span>
                            </button>
                        </div>

                        {/* Search Suggestions */}
                        {searchFocused && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-gray-300/40 border border-gray-100 z-50 overflow-hidden animate-slideDown">
                                <p className="px-4 py-2.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest border-b border-gray-50">
                                    {searchQuery ? 'Suggestions' : 'Popular Searches'}
                                </p>
                                {filteredSuggestions.slice(0, 6).map(s => (
                                    <button key={s} className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-colors">
                                        <Search className="w-3.5 h-3.5 text-gray-300" /> {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-1 shrink-0">
                        <Link href="/account" className="hidden sm:flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors group" aria-label="Account">
                            <User className="w-5 h-5 text-gray-500 group-hover:text-emerald-500 transition-colors" />
                            <span className="text-[9px] text-gray-400 font-medium mt-0.5">Account</span>
                        </Link>

                        <Link href="/wishlist" className="hidden sm:flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors group relative" aria-label="Wishlist">
                            <div className="relative">
                                <Heart className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">3</span>
                            </div>
                            <span className="text-[9px] text-gray-400 font-medium mt-0.5">Wishlist</span>
                        </Link>

                        <div className="relative">
                            <button
                                onClick={() => setIsCartOpen(!isCartOpen)}
                                className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                                aria-label="Cart"
                            >
                                <div className="relative">
                                    <ShoppingBag className="w-5 h-5 text-gray-500 group-hover:text-emerald-500 transition-colors" />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-emerald-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{itemCount}</span>
                                    )}
                                </div>
                                <span className="text-[9px] text-gray-700 font-bold mt-0.5">KSh {total.toLocaleString()}</span>
                            </button>
                            {isCartOpen && <MiniCart />}
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 rounded-xl hover:bg-gray-50 transition-colors lg:hidden ml-1"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* ===== PRIMARY NAVIGATION ===== */}
                <div className="border-t border-gray-100 hidden lg:block">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-12">
                        {/* All Categories Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-5 h-12 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all">
                                <Menu className="w-4 h-4" /> All Categories <ChevronDown className="w-3.5 h-3.5 ml-1 group-hover:rotate-180 transition-transform" />
                            </button>
                            <div className="absolute top-full left-0 bg-white shadow-2xl shadow-gray-300/30 border border-gray-100 rounded-b-2xl w-[800px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-5">
                                <div className="grid grid-cols-4 gap-2">
                                    {NAV_CATEGORIES.map(cat => (
                                        <Link key={cat.label} href={cat.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors group/item">
                                            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 group-hover/item:bg-emerald-100 transition-colors">
                                                {cat.icon}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 group-hover/item:text-emerald-600 transition-colors">{cat.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Inline nav links */}
                        <nav className="flex items-center h-12 overflow-x-auto hide-scrollbar flex-1">
                            {NAV_CATEGORIES.map(cat => (
                                <Link
                                    key={cat.label}
                                    href={cat.href}
                                    className="flex items-center gap-1.5 px-3 h-12 text-sm font-medium whitespace-nowrap transition-colors text-gray-600 hover:text-emerald-600"
                                >
                                    {cat.icon}
                                    <span className="hidden xl:inline">{cat.label}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* 🔥 Hot Deals - standalone flaming button */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-5 h-9 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-extrabold rounded-full animate-flame whitespace-nowrap ml-2"
                        >
                            <Flame className="w-4 h-4 animate-flicker" />
                            Hot Deals
                        </Link>
                    </div>
                </div>
            </header>

            {/* ===== MOBILE DRAWER ===== */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl flex flex-col animate-slideInLeft">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                                    <ShoppingBag className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold text-lg font-heading text-gray-900">Cover<span className="text-emerald-500">matt</span></span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
                                <Search className="w-4 h-4 text-gray-400" />
                                <input placeholder="Search products..." className="bg-transparent text-sm outline-none flex-1 text-gray-700" />
                            </div>
                        </div>

                        {/* Nav Items */}
                        <nav className="flex-1 overflow-auto py-3 px-3">
                            {NAV_CATEGORIES.map(cat => (
                                <Link
                                    key={cat.label}
                                    href={cat.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-0.5 transition-colors text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                                >
                                    <span className="text-emerald-500">{cat.icon}</span>
                                    <span className="font-medium text-sm">{cat.label}</span>
                                </Link>
                            ))}
                            {/* Mobile Hot Deals */}
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-0.5 bg-gradient-to-r from-red-50 to-orange-50 text-red-600 font-bold animate-flame"
                            >
                                <Flame className="w-4 h-4 animate-flicker" />
                                <span className="font-bold text-sm">🔥 Hot Deals</span>
                            </Link>
                        </nav>

                        {/* Bottom */}
                        <div className="p-4 border-t border-gray-100 space-y-1.5">
                            <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                <User className="w-4 h-4" /> My Account
                            </Link>
                            <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                <Heart className="w-4 h-4" /> Wishlist
                            </Link>
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                <User className="w-4 h-4" /> Login / Register
                            </Link>
                            <Link href="/support/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                <Phone className="w-4 h-4" /> +254 700 000 000
                            </Link>
                            <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="btn-emerald flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm mt-2">
                                <ShoppingBag className="w-4 h-4" /> View Cart ({itemCount})
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
