'use client';
import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, ChevronLeft } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero */}
            <div className="hero-gradient py-14 sm:py-16 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Link href="/support" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Support
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">Contact Us</h1>
                    <p className="text-white/70 mt-2 max-w-lg">We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>
                        <form onSubmit={e => e.preventDefault()} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
                                    <input type="text" placeholder="John Doe" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                    <input type="tel" placeholder="+254 7XX XXX XXX" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                                <input type="email" placeholder="john@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all text-gray-500">
                                    <option>General Inquiry</option>
                                    <option>Order Issue</option>
                                    <option>Product Question</option>
                                    <option>Complaint</option>
                                    <option>Partnership</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                                <textarea rows={5} placeholder="Tell us how we can help..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all resize-none" />
                            </div>
                            <button type="submit" className="btn-emerald px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2">
                                <Send className="w-4 h-4" /> Send Message
                            </button>
                        </form>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: <Phone className="w-4 h-4 text-emerald-500" />, label: 'Phone', value: '+254 700 000 000' },
                                    { icon: <Mail className="w-4 h-4 text-emerald-500" />, label: 'Email', value: 'info@covermatt.co.ke' },
                                    { icon: <MapPin className="w-4 h-4 text-emerald-500" />, label: 'Address', value: 'Moi Avenue, Nairobi CBD, Kenya' },
                                    { icon: <Clock className="w-4 h-4 text-emerald-500" />, label: 'Business Hours', value: 'Mon-Sat: 8AM - 6PM\nSunday: 10AM - 4PM' },
                                ].map(item => (
                                    <div key={item.label} className="flex gap-3">
                                        <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">{item.icon}</div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                                            <p className="text-sm font-semibold text-gray-900 whitespace-pre-line">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                            <MessageCircle className="w-8 h-8 text-emerald-500 mb-3" />
                            <h3 className="font-bold text-gray-900 mb-1">Live Chat</h3>
                            <p className="text-sm text-gray-500 mb-4">Chat with our support agents in real-time for quick assistance.</p>
                            <button className="btn-emerald w-full py-3 rounded-xl text-sm font-bold">Start Live Chat</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
