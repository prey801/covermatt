'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, HelpCircle, ChevronDown, Search } from 'lucide-react';

const FAQ_CATEGORIES = [
    {
        category: 'Orders & Payments',
        faqs: [
            { q: 'What payment methods do you accept?', a: 'We accept M-Pesa, Visa, Mastercard, PayPal, Airtel Money, and Cash on Delivery (COD) for orders within Nairobi.' },
            { q: 'Can I change or cancel my order after placing it?', a: 'Yes, you can modify or cancel your order within 1 hour of placing it. After that, contact our support team and we\'ll do our best to accommodate your request before the order is shipped.' },
            { q: 'Is it safe to pay online?', a: 'Absolutely. We use 256-bit SSL encryption and partner with trusted payment processors. Your financial details are never stored on our servers.' },
            { q: 'Do you offer bulk/wholesale pricing?', a: 'Yes! We offer tiered discounts for bulk purchases. Contact our sales team at sales@covermatt.co.ke or call +254 700 000 000 for a custom quote.' },
        ],
    },
    {
        category: 'Shipping & Delivery',
        faqs: [
            { q: 'How long does delivery take?', a: 'Within Nairobi: same-day or next-day delivery. Major towns: 2-4 business days. Other areas: 3-7 business days. See our Shipping Policy for full details.' },
            { q: 'Do you deliver outside Nairobi?', a: 'Yes, we deliver nationwide across Kenya. Delivery timelines and costs vary by location.' },
            { q: 'Is there free shipping?', a: 'Orders above KSh 5,000 within Nairobi qualify for free delivery. Bulk orders over KSh 20,000 get free nationwide shipping.' },
            { q: 'Can I pick up my order in person?', a: 'Yes! You can collect your order from our Moi Avenue branch in Nairobi CBD, Mon-Sat 8AM-6PM.' },
        ],
    },
    {
        category: 'Returns & Warranty',
        faqs: [
            { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be unused and in original packaging. See our Returns & Refunds page for full eligibility criteria.' },
            { q: 'How do I initiate a return?', a: 'Contact our support team with your order number and reason for return. We\'ll send you a return authorization within 24 hours.' },
            { q: 'Do your products come with a warranty?', a: 'Most power tools and electrical items come with a manufacturer\'s warranty of 1-3 years. Warranty details are listed on each product page.' },
        ],
    },
    {
        category: 'Account & General',
        faqs: [
            { q: 'Do I need an account to place an order?', a: 'No, you can check out as a guest. However, creating an account lets you track orders, save your addresses, and access exclusive deals.' },
            { q: 'How do I reset my password?', a: 'Click "Login" in the header, then select "Forgot Password". Enter your email and we\'ll send you a password reset link.' },
            { q: 'Do you have a physical store?', a: 'Yes! Visit us at Moi Avenue, Nairobi CBD. We\'re open Monday to Saturday, 8AM to 6PM, and Sunday 10AM to 4PM.' },
        ],
    },
];

export default function FAQsPage() {
    const [openIdx, setOpenIdx] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const toggle = (key: string) => setOpenIdx(openIdx === key ? null : key);

    const filteredCategories = FAQ_CATEGORIES.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(
            f => !searchQuery || f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter(cat => cat.faqs.length > 0);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="hero-gradient py-14 sm:py-16 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Link href="/support" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Support
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold font-heading flex items-center gap-3">
                        <HelpCircle className="w-8 h-8" /> Frequently Asked Questions
                    </h1>
                    <p className="text-white/70 mt-2">Find quick answers to common questions about our products and services.</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search FAQs..."
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-50 shadow-sm transition-all"
                    />
                </div>

                {/* FAQ Sections */}
                {filteredCategories.map(cat => (
                    <div key={cat.category} className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 font-heading mb-3">{cat.category}</h2>
                        <div className="space-y-2">
                            {cat.faqs.map((faq, i) => {
                                const key = `${cat.category}-${i}`;
                                const isOpen = openIdx === key;
                                return (
                                    <div key={key} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                        <button onClick={() => toggle(key)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                                            <span className="font-semibold text-sm text-gray-800 pr-4">{faq.q}</span>
                                            <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isOpen && (
                                            <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3 animate-slideDown">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {filteredCategories.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-5xl mb-3">🤔</p>
                        <p className="font-bold text-gray-700 text-lg">No results found</p>
                        <p className="text-sm text-gray-400 mt-1">Try different search terms or <Link href="/support/contact" className="text-emerald-600 font-semibold">contact us</Link> directly.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
