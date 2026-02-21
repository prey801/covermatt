import Link from 'next/link';
import { ChevronLeft, FileText, CheckCircle } from 'lucide-react';

const SECTIONS = [
    {
        title: '1. Acceptance of Terms',
        content: 'By accessing and using the Covermatt Hardware & Electricals website ("Site") and services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our Site or services.',
    },
    {
        title: '2. Products & Pricing',
        content: `All products listed on our Site are subject to availability. We reserve the right to discontinue any product at any time without notice.

• Prices are listed in **Kenyan Shillings (KSh)** and include applicable taxes unless stated otherwise.
• We strive for accuracy, but errors in pricing may occur. If an error is identified, we will notify you before processing the order.
• Promotional prices and discounts are valid for the stated period only.`,
    },
    {
        title: '3. Orders & Payment',
        content: `• By placing an order, you are making an offer to purchase. We reserve the right to accept or decline your order.
• Payment must be completed before dispatch. Accepted methods: **M-Pesa**, **Visa**, **Mastercard**, **PayPal**, **Airtel Money**, and **Cash on Delivery** (Nairobi only).
• All transactions are processed through secure, PCI-DSS compliant payment processors.`,
    },
    {
        title: '4. Shipping & Delivery',
        content: `Delivery timelines are estimates and may vary based on your location and product availability. Please refer to our Shipping Policy for detailed information on delivery zones, timelines, and costs.

We are not liable for delays caused by events beyond our control, including but not limited to natural disasters, strikes, or government actions.`,
    },
    {
        title: '5. Returns & Refunds',
        content: `Returns are accepted within **30 days** of delivery, subject to our Return & Refunds Policy. Items must be unused and in original packaging. Custom-cut materials, mixed paints, and opened PPE are non-returnable.

Refunds are processed within **3-5 business days** after receiving and inspecting the returned item.`,
    },
    {
        title: '6. Intellectual Property',
        content: 'All content on this Site — including logos, images, product descriptions, design, and code — is the property of Covermatt Hardware & Electricals and is protected by intellectual property laws. You may not reproduce, distribute, or use any content without written permission.',
    },
    {
        title: '7. Limitation of Liability',
        content: `Covermatt Hardware & Electricals shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.

Our total liability shall not exceed the purchase price of the product(s) in question.`,
    },
    {
        title: '8. Governing Law',
        content: 'These Terms are governed by the laws of the Republic of Kenya. Any disputes shall be resolved through arbitration in Nairobi, Kenya, in accordance with Kenyan arbitration laws.',
    },
    {
        title: '9. Changes to Terms',
        content: 'We reserve the right to update these Terms at any time. Changes take effect immediately upon posting. Continued use of the Site constitutes acceptance of the updated Terms.',
    },
];

export default function TermsPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="hero-gradient py-14 sm:py-16 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold font-heading flex items-center gap-3">
                        <FileText className="w-8 h-8" /> Terms & Conditions
                    </h1>
                    <p className="text-white/70 mt-2">Last updated: February 2026</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
                <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 mb-8 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-800">
                        <strong>Please read carefully.</strong> These terms govern your use of the Covermatt website and your purchase of products from us.
                    </p>
                </div>

                <div className="space-y-6">
                    {SECTIONS.map((section, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h2>
                            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line [&_strong]:text-gray-900">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10 text-sm text-gray-400">
                    Questions about these terms? <Link href="/support/contact" className="text-emerald-600 font-semibold hover:underline">Contact us</Link>.
                </div>
            </div>
        </div>
    );
}
