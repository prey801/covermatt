'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronRight, Smartphone, CreditCard, Truck, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const STEPS = ['Shipping', 'Payment', 'Confirmation'];

const PAYMENT_METHODS = [
    {
        id: 'mpesa',
        label: 'M-Pesa',
        icon: <Smartphone className="w-5 h-5 text-green-600" />,
        desc: 'Pay via STK push to your mobile',
        bg: 'bg-green-50 border-green-200',
    },
    {
        id: 'card',
        label: 'Card Payment',
        icon: <CreditCard className="w-5 h-5 text-blue-600" />,
        desc: 'Visa, Mastercard accepted',
        bg: 'bg-blue-50 border-blue-200',
    },
    {
        id: 'delivery',
        label: 'Pay on Delivery',
        icon: <Truck className="w-5 h-5 text-amber-600" />,
        desc: 'Cash only, +KSh 100 fee',
        bg: 'bg-amber-50 border-amber-200',
    },
];

export default function CheckoutPage() {
    const [step, setStep] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('mpesa');
    const [agreed, setAgreed] = useState(false);
    const { items, total, itemCount, clearCart } = useCart();
    const [orderNumber] = useState(() => `ORD-${Math.floor(Math.random() * 90000) + 10000}`);

    const handleConfirm = () => {
        setStep(2);
        clearCart();
    };

    if (step === 2) {
        return (
            <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl p-6 sm:p-10 text-center max-w-lg w-full shadow-xl">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#1f2937] font-[Poppins] mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-4">Thank you for your order</p>
                    <div className="bg-emerald-50 rounded-2xl p-4 mb-6">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order Number</p>
                        <p className="text-2xl font-bold text-emerald-600 font-mono">{orderNumber}</p>
                    </div>
                    <div className="text-left space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <Package className="w-4 h-4 text-emerald-500" />
                            <span>Estimated delivery: 1–2 business days</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>Confirmation email sent to your inbox</span>
                        </div>
                    </div>
                    <Link href="/" className="btn-emerald block text-center py-4 rounded-2xl font-bold">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f1f5f9] min-h-screen py-6 sm:py-10">
            <div className="max-w-[1200px] mx-auto px-4">
                {/* Step indicator */}
                <div className="flex items-center justify-center mb-8 sm:mb-10">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s}>
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${i <= step ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                    {i < step ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : i + 1}
                                </div>
                                <span className={`text-[10px] sm:text-xs font-medium mt-1.5 sm:mt-2 ${i === step ? 'text-emerald-600' : 'text-gray-400'}`}>{s}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 sm:mx-4 mb-5 rounded-full transition-all ${i < step ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
                    {/* Form */}
                    <div className="space-y-6">
                        {step === 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-[#1f2937] mb-5">Shipping Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {['Full Name', 'Phone Number', 'Email Address', 'Street Address'].map(field => (
                                        <div key={field} className={field === 'Street Address' ? 'sm:col-span-2' : ''}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{field} *</label>
                                            <input
                                                type={field === 'Email Address' ? 'email' : field === 'Phone Number' ? 'tel' : 'text'}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-50 transition-all"
                                                placeholder={`Enter your ${field.toLowerCase()}`}
                                            />
                                        </div>
                                    ))}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">City/Town *</label>
                                        <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all" placeholder="Nairobi" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">County/Region *</label>
                                        <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all text-gray-500">
                                            <option>Nairobi</option>
                                            <option>Mombasa</option>
                                            <option>Kisumu</option>
                                            <option>Nakuru</option>
                                            <option>Eldoret</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Instructions (optional)</label>
                                        <textarea rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all resize-none" placeholder="e.g. Call before delivery, side gate..." />
                                    </div>
                                </div>

                                {/* Delivery options */}
                                <div className="mt-6">
                                    <h3 className="font-semibold text-[#1f2937] mb-3">Delivery Option</h3>
                                    {[
                                        { id: 'standard', label: 'Standard (3–5 days)', price: total >= 5000 ? 'Free' : 'KSh 300' },
                                        { id: 'express', label: 'Express (1–2 days)', price: 'KSh 500' },
                                        { id: 'pickup', label: 'Store Pickup', price: 'Free' },
                                    ].map(opt => (
                                        <label key={opt.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl mb-2 cursor-pointer hover:border-emerald-300 transition-colors">
                                            <input type="radio" name="delivery" defaultChecked={opt.id === 'standard'} className="accent-emerald-500" />
                                            <span className="flex-1 text-sm text-gray-700">{opt.label}</span>
                                            <span className="text-sm font-semibold text-emerald-600">{opt.price}</span>
                                        </label>
                                    ))}
                                </div>

                                <button onClick={() => setStep(1)} className="btn-emerald w-full py-4 rounded-2xl font-bold mt-6 flex items-center justify-center gap-2">
                                    Continue to Payment <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-[#1f2937] mb-5">Payment Method</h2>
                                <div className="space-y-3 mb-6">
                                    {PAYMENT_METHODS.map(m => (
                                        <label key={m.id} className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === m.id ? `${m.bg} border-current opacity-100` : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={m.id}
                                                checked={paymentMethod === m.id}
                                                onChange={() => setPaymentMethod(m.id)}
                                                className="accent-emerald-500"
                                            />
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">{m.icon}</div>
                                            <div>
                                                <p className="font-semibold text-[#1f2937]">{m.label}</p>
                                                <p className="text-xs text-gray-500">{m.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {paymentMethod === 'mpesa' && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">M-Pesa Phone Number</label>
                                        <input type="tel" placeholder="+254 7XX XXX XXX" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all" />
                                        <p className="text-xs text-gray-400 mt-2">You will receive an STK push notification to complete payment</p>
                                    </div>
                                )}

                                {paymentMethod === 'card' && (
                                    <div className="mb-6 space-y-3">
                                        <input type="text" placeholder="Card number" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" placeholder="MM / YY" className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all" />
                                            <input type="text" placeholder="CVV" className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all" />
                                        </div>
                                    </div>
                                )}

                                <label className="flex items-center gap-3 mb-6 cursor-pointer">
                                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                                    <span className="text-sm text-gray-600">
                                        I agree to the <Link href="/terms" className="text-emerald-500 underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-emerald-500 underline">Privacy Policy</Link>
                                    </span>
                                </label>

                                <button onClick={handleConfirm} disabled={!agreed} className="btn-emerald w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <CheckCircle className="w-5 h-5" /> Complete Order
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="sticky top-28 h-fit">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-[#1f2937] mb-4">Order Summary</h3>
                            <div className="space-y-3 mb-4">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-12 h-12 bg-[#f9fafb] rounded-lg flex items-center justify-center text-2xl flex-shrink-0">{item.image}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-700 line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-gray-400">× {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-[#1f2937]">KSh {(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>KSh {total.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-emerald-600">{total >= 5000 ? 'Free' : 'KSh 300'}</span></div>
                                <div className="flex justify-between font-bold text-base border-t pt-3 border-gray-100">
                                    <span>Total</span>
                                    <span>KSh {(total + (total < 5000 ? 300 : 0)).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
