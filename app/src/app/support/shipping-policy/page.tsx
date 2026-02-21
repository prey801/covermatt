import Link from 'next/link';
import { ChevronLeft, Truck, Clock, MapPin, Package, DollarSign, AlertCircle } from 'lucide-react';

const ZONES = [
    { zone: 'Nairobi CBD & Environs', time: 'Same Day / Next Day', cost: 'Free over KSh 5,000', highlight: true },
    { zone: 'Greater Nairobi (Kiambu, Machakos, Kajiado)', time: '1-2 Business Days', cost: 'KSh 200 - 500' },
    { zone: 'Major Towns (Mombasa, Kisumu, Nakuru, Eldoret)', time: '2-4 Business Days', cost: 'KSh 300 - 800' },
    { zone: 'Other Towns & Rural Areas', time: '3-7 Business Days', cost: 'KSh 500 - 1,500' },
];

const POLICIES = [
    { icon: <Package className="w-5 h-5 text-emerald-500" />, title: 'Order Processing', text: 'Orders placed before 2PM EAT on business days are processed the same day. Orders placed after 2PM or on weekends are processed the next business day.' },
    { icon: <DollarSign className="w-5 h-5 text-emerald-500" />, title: 'Free Shipping', text: 'Enjoy free delivery on all orders above KSh 5,000 within Nairobi. Bulk orders over KSh 20,000 qualify for free nationwide delivery.' },
    { icon: <AlertCircle className="w-5 h-5 text-emerald-500" />, title: 'Large & Heavy Items', text: 'Items such as generators, cement, and steel sheets may incur additional delivery charges. Our team will contact you before dispatch if extra fees apply.' },
    { icon: <MapPin className="w-5 h-5 text-emerald-500" />, title: 'Pickup Option', text: 'You can collect your order for free from our Moi Avenue, Nairobi branch during business hours (Mon-Sat, 8AM-6PM).' },
];

export default function ShippingPolicyPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="hero-gradient py-14 sm:py-16 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Link href="/support" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Support
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold font-heading flex items-center gap-3">
                        <Truck className="w-8 h-8" /> Shipping Policy
                    </h1>
                    <p className="text-white/70 mt-2">Everything you need to know about our delivery options and timelines.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
                {/* Delivery Zones */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 font-heading">Delivery Zones & Timelines</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="px-6 py-3 font-semibold text-gray-600">Zone</th>
                                    <th className="px-6 py-3 font-semibold text-gray-600">Estimated Time</th>
                                    <th className="px-6 py-3 font-semibold text-gray-600">Shipping Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {ZONES.map(z => (
                                    <tr key={z.zone} className={z.highlight ? 'bg-emerald-50/50' : ''}>
                                        <td className="px-6 py-4 font-medium text-gray-900">{z.zone}</td>
                                        <td className="px-6 py-4 text-gray-600 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-gray-400" /> {z.time}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-700">{z.cost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Policies */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {POLICIES.map(p => (
                        <div key={p.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">{p.icon}</div>
                            <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{p.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
