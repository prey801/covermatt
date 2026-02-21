'use client';
import React from 'react';
import Link from 'next/link';
import {
    Facebook, Instagram, Twitter, Youtube,
    Mail, Phone, MapPin, ArrowRight, ChevronRight, ShoppingBag
} from 'lucide-react';

const QUICK_LINKS = [
    { label: 'Power Tools', href: '/' },
    { label: 'Electrical Supplies', href: '/' },
    { label: 'Plumbing', href: '/' },
    { label: 'Paint & Supplies', href: '/' },
    { label: 'Safety Equipment', href: '/' },
    { label: 'All Categories', href: '/' },
];

const SUPPORT_LINKS = [
    { label: 'Contact Us', href: '/support/contact' },
    { label: 'Track Your Order', href: '/support/track-order' },
    { label: 'Shipping Policy', href: '/support/shipping-policy' },
    { label: 'Returns & Refunds', href: '/support/returns' },
    { label: 'FAQs', href: '/support/faqs' },
    { label: 'Privacy Policy', href: '/support/privacy-policy' },
];

const SOCIALS = [
    { icon: <Facebook className="w-4 h-4" />, href: '/', label: 'Facebook' },
    { icon: <Instagram className="w-4 h-4" />, href: '/', label: 'Instagram' },
    { icon: <Twitter className="w-4 h-4" />, href: '/', label: 'Twitter' },
    { icon: <Youtube className="w-4 h-4" />, href: '/', label: 'YouTube' },
];

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            {/* Contact Info Bar */}
            <div className="border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
                    <div className="flex flex-wrap justify-center sm:justify-between gap-6 text-sm">
                        {[
                            { icon: <Phone className="w-4 h-4 text-emerald-400" />, text: '+254 700 000 000', sub: 'Mon-Sat, 8AM-6PM' },
                            { icon: <Mail className="w-4 h-4 text-emerald-400" />, text: 'info@covermatt.co.ke', sub: 'Email support' },
                            { icon: <MapPin className="w-4 h-4 text-emerald-400" />, text: 'Nairobi, Kenya', sub: 'Main branch' },
                        ].map(item => (
                            <div key={item.text} className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{item.text}</p>
                                    <p className="text-xs text-gray-500">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                    {/* Col 1 – About */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-lg font-extrabold leading-tight font-heading">
                                    Cover<span className="text-emerald-400">matt</span>
                                </p>
                                <p className="text-[9px] text-gray-500 font-medium tracking-wide uppercase">Hardware & Electricals</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Kenya&apos;s trusted hardware and electrical store. Quality products, fast delivery, and expert support for all your construction and home improvement needs.
                        </p>
                        <div className="flex gap-2">
                            {SOCIALS.map(s => (
                                <a key={s.label} href={s.href} className="w-9 h-9 bg-white/5 hover:bg-emerald-500 rounded-xl flex items-center justify-center transition-all duration-200 text-gray-400 hover:text-white" aria-label={s.label}>
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2 – Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5">Shop</h4>
                        <ul className="space-y-2.5">
                            {QUICK_LINKS.map(link => (
                                <li key={link.label}>
                                    <Link href={link.href} className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors group">
                                        <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 – Customer Service */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5">Support</h4>
                        <ul className="space-y-2.5">
                            {SUPPORT_LINKS.map(link => (
                                <li key={link.label}>
                                    <Link href={link.href} className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors group">
                                        <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 – Newsletter */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5">Stay Updated</h4>
                        <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                            Get exclusive deals, new product alerts, and tips delivered to your inbox.
                        </p>
                        <form className="space-y-3" onSubmit={e => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                            />
                            <button type="submit" className="btn-emerald w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold">
                                Subscribe <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                        <p className="text-[10px] text-gray-600 mt-2.5">No spam. Unsubscribe anytime.</p>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500 text-xs font-medium">
                        <span>We accept:</span>
                        {['M-Pesa', 'Visa', 'Mastercard', 'PayPal', 'Airtel Money'].map(m => (
                            <span key={m} className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{m}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-black/30 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                        <p>&copy; {new Date().getFullYear()} Covermatt Hardware & Electricals. All rights reserved.</p>
                        <div className="flex gap-4">
                            <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link>
                            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
                            <Link href="/sitemap-page" className="hover:text-emerald-400 transition-colors">Sitemap</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
