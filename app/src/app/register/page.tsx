'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingBag, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, CheckCircle, X as XIcon } from 'lucide-react';

const PASSWORD_CRITERIA = [
    { key: 'length', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { key: 'upper', label: 'One uppercase letter (A-Z)', test: (p: string) => /[A-Z]/.test(p) },
    { key: 'lower', label: 'One lowercase letter (a-z)', test: (p: string) => /[a-z]/.test(p) },
    { key: 'number', label: 'One number (0-9)', test: (p: string) => /\d/.test(p) },
    { key: 'symbol', label: 'One special character (!@#$...)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_CONFIG = [
    { label: '', color: 'bg-gray-200', textColor: 'text-gray-400' },
    { label: 'Very Weak', color: 'bg-red-500', textColor: 'text-red-500' },
    { label: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-500' },
    { label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-500' },
    { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500' },
    { label: 'Very Strong', color: 'bg-emerald-600', textColor: 'text-emerald-600' },
];

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');

    const { score, passed } = useMemo(() => {
        const results = PASSWORD_CRITERIA.map(c => c.test(password));
        return { score: results.filter(Boolean).length, passed: results };
    }, [password]);

    const strength = STRENGTH_CONFIG[password.length === 0 ? 0 : score];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left - Brand Panel */}
            <div className="hidden lg:flex lg:w-[45%] hero-gradient relative items-center justify-center p-12">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/[0.04] rounded-full" />
                    <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-white/[0.03] rounded-full" />
                </div>
                <div className="relative text-white max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold font-heading mb-3 text-center">
                        Cover<span className="text-emerald-200">matt</span>
                    </h1>
                    <p className="text-white/60 text-sm text-center mb-10">Create your account and start shopping!</p>

                    <div className="space-y-4">
                        {[
                            { icon: <CheckCircle className="w-5 h-5 text-emerald-300" />, text: 'Track orders in real-time' },
                            { icon: <CheckCircle className="w-5 h-5 text-emerald-300" />, text: 'Save items to your wishlist' },
                            { icon: <CheckCircle className="w-5 h-5 text-emerald-300" />, text: 'Get exclusive member discounts' },
                            { icon: <CheckCircle className="w-5 h-5 text-emerald-300" />, text: 'Faster checkout with saved addresses' },
                            { icon: <CheckCircle className="w-5 h-5 text-emerald-300" />, text: 'Early access to flash sales' },
                        ].map(item => (
                            <div key={item.text} className="flex items-center gap-3 bg-white/[0.06] rounded-xl px-4 py-3">
                                {item.icon}
                                <span className="text-sm text-white/80">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right - Register Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-2.5 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-extrabold text-gray-900 font-heading">Cover<span className="text-emerald-500">matt</span></span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">Create Account</h2>
                    <p className="text-sm text-gray-400 mt-1 mb-8">Join 25,000+ happy customers</p>

                    <form onSubmit={e => e.preventDefault()} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="text" placeholder="John" className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                                <input type="text" placeholder="Doe" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="tel" placeholder="+254 7XX XXX XXX" className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="email" placeholder="john@example.com" className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Strength Bars */}
                            <div className="flex gap-1 mt-2.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= score && password.length > 0 ? strength.color : 'bg-gray-200'}`} />
                                ))}
                            </div>

                            {/* Strength Label */}
                            {password.length > 0 && (
                                <div className="flex items-center justify-between mt-1.5">
                                    <span className={`text-[11px] font-bold ${strength.textColor}`}>{strength.label}</span>
                                    <span className="text-[10px] text-gray-400">{score}/5 criteria met</span>
                                </div>
                            )}

                            {/* Criteria Checklist */}
                            {password.length > 0 && (
                                <div className="mt-3 bg-gray-50 rounded-xl p-3 space-y-1.5">
                                    {PASSWORD_CRITERIA.map((c, i) => (
                                        <div key={c.key} className={`flex items-center gap-2 text-[11px] transition-colors ${passed[i] ? 'text-emerald-600' : 'text-gray-400'}`}>
                                            {passed[i]
                                                ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                : <XIcon className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                            }
                                            <span className={passed[i] ? 'line-through' : ''}>{c.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {password.length === 0 && (
                                <p className="text-[10px] text-gray-400 mt-1">Use 8+ characters with a mix of letters, numbers & symbols</p>
                            )}
                        </div>

                        <label className="flex items-start gap-2.5 cursor-pointer">
                            <input type="checkbox" className="accent-emerald-500 w-4 h-4 mt-0.5" />
                            <span className="text-xs text-gray-500 leading-relaxed">
                                I agree to the <Link href="/terms" className="text-emerald-600 font-semibold hover:underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-emerald-600 font-semibold hover:underline">Privacy Policy</Link>
                            </span>
                        </label>

                        <button type="submit" className="btn-emerald w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                            Create Account <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                        <div className="relative flex justify-center"><span className="bg-gray-50 px-4 text-xs text-gray-400 font-medium">or sign up with</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            <span className="text-lg">🇰🇪</span> M-Pesa
                        </button>
                        <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                            Google
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account? <Link href="/login" className="text-emerald-600 font-bold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
