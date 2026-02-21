import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageCircle, Headphones, FileText, Truck, RotateCcw, HelpCircle, Shield } from 'lucide-react';

const SUPPORT_CARDS = [
    { icon: <Phone className="w-6 h-6" />, title: 'Contact Us', desc: 'Get in touch with our team', href: '/support/contact' },
    { icon: <Truck className="w-6 h-6" />, title: 'Track Your Order', desc: 'Check your order status', href: '/support/track-order' },
    { icon: <FileText className="w-6 h-6" />, title: 'Shipping Policy', desc: 'Delivery info & timelines', href: '/support/shipping-policy' },
    { icon: <RotateCcw className="w-6 h-6" />, title: 'Returns & Refunds', desc: 'Return process & policies', href: '/support/returns' },
    { icon: <HelpCircle className="w-6 h-6" />, title: 'FAQs', desc: 'Common questions answered', href: '/support/faqs' },
    { icon: <Shield className="w-6 h-6" />, title: 'Privacy Policy', desc: 'How we protect your data', href: '/support/privacy-policy' },
];

export default function SupportPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero */}
            <div className="hero-gradient py-16 sm:py-20 text-center text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Headphones className="w-12 h-12 mx-auto mb-4 text-white/80" />
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading mb-3">How Can We Help?</h1>
                    <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto">Find answers, track orders, or get in touch with our support team.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                {/* Quick Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
                    {SUPPORT_CARDS.map(card => (
                        <Link key={card.title} href={card.href} className="bg-white rounded-2xl p-6 border border-gray-100 group card-hover">
                            <div className="w-12 h-12 bg-emerald-50 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-500 transition-colors mb-4">
                                {card.icon}
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-emerald-600 transition-colors">{card.title}</h3>
                            <p className="text-sm text-gray-400">{card.desc}</p>
                        </Link>
                    ))}
                </div>

                {/* Contact Quick Info */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10">
                    <h2 className="text-2xl font-extrabold text-gray-900 font-heading mb-6">Quick Contact</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Phone className="w-5 h-5 text-emerald-500" />, label: 'Call Us', value: '+254 700 000 000' },
                            { icon: <Mail className="w-5 h-5 text-emerald-500" />, label: 'Email', value: 'info@covermatt.co.ke' },
                            { icon: <MapPin className="w-5 h-5 text-emerald-500" />, label: 'Visit Us', value: 'Nairobi, Kenya' },
                            { icon: <Clock className="w-5 h-5 text-emerald-500" />, label: 'Hours', value: 'Mon-Sat 8AM-6PM' },
                        ].map(item => (
                            <div key={item.label} className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">{item.icon}</div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                                    <p className="text-sm font-bold text-gray-900">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
