import Link from 'next/link';
import { ChevronLeft, RotateCcw, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const STEPS = [
    { num: '1', title: 'Initiate Return', desc: 'Contact our support team within 7 days of receiving your order. Provide your order number and reason for return.' },
    { num: '2', title: 'Get Approval', desc: 'Our team will review your request and send a return authorization within 24 hours.' },
    { num: '3', title: 'Ship or Drop Off', desc: 'Pack the item in original packaging and ship it back or drop it off at our Nairobi branch.' },
    { num: '4', title: 'Receive Refund', desc: 'Once we receive and inspect the item, your refund will be processed within 3-5 business days.' },
];

const ELIGIBLE = [
    'Unopened items in original packaging',
    'Defective or damaged products',
    'Wrong item received',
    'Items not matching product description',
];

const NOT_ELIGIBLE = [
    'Items opened from sealed packaging (safety gear, PPE)',
    'Custom-cut materials (pipes, cables, timber)',
    'Paint that has been mixed or tinted',
    'Items returned after 30 days',
    'Products without original packaging',
];

export default function ReturnsPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="hero-gradient py-14 sm:py-16 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Link href="/support" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Support
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold font-heading flex items-center gap-3">
                        <RotateCcw className="w-8 h-8" /> Returns & Refunds
                    </h1>
                    <p className="text-white/70 mt-2">Not satisfied? We&apos;ve made returns simple and straightforward.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
                {/* Key Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {[
                        { icon: <Clock className="w-5 h-5 text-emerald-500" />, label: 'Return Window', value: '30 Days' },
                        { icon: <RotateCcw className="w-5 h-5 text-emerald-500" />, label: 'Refund Processing', value: '3-5 Business Days' },
                        { icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, label: 'Restocking Fee', value: 'None' },
                    ].map(item => (
                        <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-2">{item.icon}</div>
                            <p className="text-sm text-gray-400">{item.label}</p>
                            <p className="text-lg font-extrabold text-gray-900 mt-0.5">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Process Steps */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-gray-900 font-heading mb-6">How Returns Work</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {STEPS.map(s => (
                            <div key={s.num} className="text-center">
                                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-extrabold">{s.num}</div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">{s.title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Eligibility */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" /> Eligible for Return
                        </h3>
                        <ul className="space-y-2.5">
                            {ELIGIBLE.map(item => (
                                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-500" /> Not Eligible
                        </h3>
                        <ul className="space-y-2.5">
                            {NOT_ELIGIBLE.map(item => (
                                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                                    <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
