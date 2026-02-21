import Link from 'next/link';
import { ChevronLeft, Map, Home, ShoppingBag, Headphones, FileText, Shield } from 'lucide-react';

const SECTIONS = [
    {
        title: 'Shop',
        links: [
            { label: 'Home', href: '/' },
            { label: 'Power Tools', href: '/' },
            { label: 'Electrical Supplies', href: '/' },
            { label: 'Plumbing', href: '/' },
            { label: 'Paint & Supplies', href: '/' },
            { label: 'Safety Equipment', href: '/' },
            { label: 'Garden & Outdoor', href: '/' },
        ],
        icon: <ShoppingBag className="w-5 h-5 text-emerald-500" />,
    },
    {
        title: 'Customer Account',
        links: [
            { label: 'Shopping Cart', href: '/cart' },
            { label: 'Checkout', href: '/checkout' },
        ],
        icon: <Home className="w-5 h-5 text-emerald-500" />,
    },
    {
        title: 'Support',
        links: [
            { label: 'Support Center', href: '/support' },
            { label: 'Contact Us', href: '/support/contact' },
            { label: 'Track Your Order', href: '/support/track-order' },
            { label: 'Shipping Policy', href: '/support/shipping-policy' },
            { label: 'Returns & Refunds', href: '/support/returns' },
            { label: 'FAQs', href: '/support/faqs' },
        ],
        icon: <Headphones className="w-5 h-5 text-emerald-500" />,
    },
    {
        title: 'Legal',
        links: [
            { label: 'Terms & Conditions', href: '/terms' },
            { label: 'Privacy Policy', href: '/privacy' },
        ],
        icon: <Shield className="w-5 h-5 text-emerald-500" />,
    },
];

export default function SitemapPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="hero-gradient py-14 sm:py-16 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold font-heading flex items-center gap-3">
                        <Map className="w-8 h-8" /> Sitemap
                    </h1>
                    <p className="text-white/70 mt-2">A complete overview of all pages on our website.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {SECTIONS.map(section => (
                        <div key={section.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">{section.icon}</div>
                                <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                            </div>
                            <ul className="space-y-2">
                                {section.links.map(link => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm text-gray-500 hover:text-emerald-600 transition-colors flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full shrink-0" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
