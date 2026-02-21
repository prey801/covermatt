import Link from 'next/link';
import { ChevronLeft, Shield, Eye, Lock, Database, UserCheck, Globe, Bell } from 'lucide-react';

const SECTIONS = [
    {
        icon: <Database className="w-5 h-5 text-emerald-500" />,
        title: 'Information We Collect',
        content: `We collect personal information that you voluntarily provide when placing orders, creating an account, or contacting us. This includes:

• **Personal details**: Name, email address, phone number, delivery address
• **Payment information**: M-Pesa number, card details (processed securely by our payment partners — we do not store card numbers)
• **Order history**: Products purchased, order dates, delivery preferences
• **Device information**: Browser type, IP address, and cookies for website functionality and analytics`,
    },
    {
        icon: <Eye className="w-5 h-5 text-emerald-500" />,
        title: 'How We Use Your Information',
        content: `We use your personal information to:

• Process and fulfill your orders
• Send order confirmations, delivery updates, and receipts
• Provide customer support and respond to your inquiries
• Improve our website, products, and services
• Send promotional offers and newsletters (only with your consent)
• Prevent fraud and ensure the security of transactions`,
    },
    {
        icon: <Lock className="w-5 h-5 text-emerald-500" />,
        title: 'Data Security',
        content: `We take the security of your data seriously:

• All data is transmitted using 256-bit SSL/TLS encryption
• Payment transactions are processed through PCI-DSS compliant payment processors
• Access to personal data is restricted to authorized employees only
• We conduct regular security audits and vulnerability assessments
• Account passwords are hashed and salted — even our staff cannot see them`,
    },
    {
        icon: <UserCheck className="w-5 h-5 text-emerald-500" />,
        title: 'Your Rights',
        content: `You have the right to:

• **Access** your personal data by logging into your account
• **Correct** inaccurate information by updating your profile
• **Delete** your account and associated data by contacting support
• **Opt-out** of marketing emails at any time via the unsubscribe link
• **Request** a copy of your data in a portable format`,
    },
    {
        icon: <Globe className="w-5 h-5 text-emerald-500" />,
        title: 'Cookies & Tracking',
        content: `We use cookies to:

• Remember your login session and cart contents
• Analyze website traffic and usage patterns (via Google Analytics)
• Personalize your shopping experience

You can control cookie preferences through your browser settings. Disabling cookies may affect some website functionality.`,
    },
    {
        icon: <Bell className="w-5 h-5 text-emerald-500" />,
        title: 'Updates to This Policy',
        content: `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.

**Last updated:** February 2026

For questions about this policy, contact our Data Protection Officer at privacy@covermatt.co.ke.`,
    },
];

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="hero-gradient py-14 sm:py-16 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Link href="/support" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Support
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold font-heading flex items-center gap-3">
                        <Shield className="w-8 h-8" /> Privacy Policy
                    </h1>
                    <p className="text-white/70 mt-2">How we collect, use, and protect your personal information.</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
                <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5 mb-8 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-emerald-800">
                        <strong>Your privacy matters.</strong> Covermatt Hardware & Electricals is committed to protecting your personal data. This policy explains what information we collect and how we handle it.
                    </p>
                </div>

                <div className="space-y-6">
                    {SECTIONS.map((section, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">{section.icon}</div>
                                <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                            </div>
                            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line prose prose-sm max-w-none [&_strong]:text-gray-900">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
