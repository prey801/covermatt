'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    User, ShoppingBag, Heart, MapPin, CreditCard, Bell,
    ChevronRight, LogOut, Package, Star, Settings, Edit3, ArrowLeft,
    CheckCircle, Truck, Clock, Home, AlertTriangle, Send
} from 'lucide-react';

// ─── Skeleton helpers ────────────────────────────────────────────────────────
function Sk({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse bg-white/30 rounded-lg ${className}`} />;
}

function SkLight({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

function AccountSkeleton() {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header skeleton */}
            <div className="hero-gradient py-10 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-5">
                        <Sk className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl" />
                        <div className="space-y-2.5 flex-1">
                            <Sk className="h-7 w-44" />
                            <Sk className="h-4 w-60" />
                            <Sk className="h-5 w-28 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <div className="flex flex-col lg:grid lg:grid-cols-[240px_1fr] gap-6">
                    {/* Sidebar skeleton */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 h-fit">
                        <div className="flex lg:flex-col gap-1">
                            {[...Array(5)].map((_, i) => (
                                <SkLight key={i} className="h-10 rounded-xl flex-1 lg:flex-none lg:w-full" />
                            ))}
                        </div>
                    </div>

                    {/* Content skeleton */}
                    <div className="space-y-5">
                        {/* Stats cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
                                    <SkLight className="h-5 w-5 rounded-md" />
                                    <SkLight className="h-8 w-16" />
                                    <SkLight className="h-3 w-24" />
                                </div>
                            ))}
                        </div>

                        {/* Recent orders card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <SkLight className="h-5 w-32" />
                                <SkLight className="h-4 w-16" />
                            </div>
                            <div className="divide-y divide-gray-50">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 sm:p-5">
                                        <div className="space-y-2">
                                            <SkLight className="h-4 w-48" />
                                            <SkLight className="h-3 w-32" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <SkLight className="h-6 w-16 rounded-full" />
                                            <SkLight className="h-4 w-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Personal info card */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <SkLight className="h-5 w-48" />
                                <SkLight className="h-4 w-10" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <SkLight className="h-3 w-20" />
                                        <SkLight className="h-5 w-40" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


const TRACKING_STEPS = [
    { id: 'pending', label: 'Order Placed', icon: Clock },
    { id: 'processing', label: 'Processing', icon: Package },
    { id: 'shipped', label: 'In Transit', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: Home }
];

const TABS = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'orders', label: 'My Orders', icon: <Package className="w-4 h-4" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export default function AccountPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    
    // User State
    const [user, setUser] = useState<any>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // Orders State
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // 1. Fetch Auth Profile
                const profileRes = await fetch('/api/user/profile');
                if (!profileRes.ok) {
                    if (profileRes.status === 401) {
                        router.push('/login');
                        return;
                    }
                    throw new Error('Failed to fetch profile');
                }
                const profileData = await profileRes.json();
                setUser(profileData.user);

                // 2. Fetch User Orders
                const ordersRes = await fetch('/api/orders');
                const ordersData = await ordersRes.json();
                setOrders(ordersData);
                
            } catch (error) {
                console.error("Failed to fetch account data:", error);
            } finally {
                setIsLoadingUser(false);
                setIsLoadingOrders(false);
            }
        };
        fetchProfileData();
    }, [router]);
    
    // Verification Handlers
    const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [resendMessage, setResendMessage] = useState('');

    const handleResendVerification = async (type: 'email' | 'phone') => {
        setResendStatus('loading');
        setResendMessage('');
        try {
            const endpoint = type === 'email' ? '/api/auth/verify/send-email' : '/api/auth/verify/send-otp';
            const res = await fetch(endpoint, { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setResendStatus('success');
                setResendMessage(type === 'email' ? 'Verification link sent to your email.' : 'OTP sent to your phone.');
            } else {
                setResendStatus('error');
                setResendMessage(data.error || 'Failed to send verification.');
            }
        } catch (e) {
            setResendStatus('error');
            setResendMessage('An unexpected error occurred.');
        }
        setTimeout(() => setResendStatus('idle'), 5000);
    };

    // Address State
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            isDefault: true,
            name: 'John Doe',
            phone: '+254 700 XXX XXX',
            street: 'Moi Avenue, Nairobi CBD',
            city: 'Nairobi',
            zip: '00100'
        }
    ]);
    const [formData, setFormData] = useState({ name: '', phone: '', street: '', city: '', zip: '' });

    const handleAddressSave = (e: React.FormEvent, id?: number) => {
        e.preventDefault();
        
        if (id) {
            // Editing existing
            setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...formData } : a));
            setEditingId(null);
        } else {
            // Adding new
            setAddresses(prev => [...prev, { ...formData, id: Date.now(), isDefault: prev.length === 0 }]);
            setIsAddingNew(false);
        }
    };

    const startEditing = (address: any) => {
        setFormData(address);
        setEditingId(address.id);
        setIsAddingNew(false);
    };

    const startAdding = () => {
        setFormData({ name: '', phone: '', street: '', city: '', zip: '' });
        setIsAddingNew(true);
        setEditingId(null);
    };

    // Show full-page skeleton while fetching — completely replaces the real UI
    if (isLoadingUser) return <AccountSkeleton />;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Profile Header */}
            <div className="hero-gradient py-10 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl sm:text-4xl border border-white/10 uppercase">
                            {user?.name?.[0] || 'U'}
                        </div>
                        <div className="text-white">
                            <h1 className="text-xl sm:text-2xl font-extrabold font-heading">{user?.name || 'Loading...'}</h1>
                            <p className="text-white/60 text-sm mt-0.5">{user?.email} {user?.phone && `• ${user.phone}`}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${user?.role === 'admin' ? 'bg-indigo-400/20 text-indigo-200' : 'bg-emerald-400/20 text-emerald-200'}`}>
                                    <Star className="w-3 h-3" /> {user?.role === 'admin' ? 'Administrator' : 'Premium Member'}
                                </span>
                                {user?.createdAt && <span className="text-white/40 text-xs">Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <div className="flex flex-col lg:grid lg:grid-cols-[240px_1fr] gap-6">
                    {/* Sidebar (horizontal on mobile, vertical on desktop) */}
                    <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 sm:p-2 h-fit lg:sticky lg:top-28">
                        <div className="flex lg:flex-col gap-1 overflow-x-auto hide-scrollbar">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 lg:w-full ${activeTab === tab.id ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className={activeTab === tab.id ? 'text-emerald-500' : 'text-gray-400'}>{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                            {user?.role === 'admin' && (
                                <Link href="/admin" className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 lg:w-full text-indigo-500 hover:bg-indigo-50">
                                    <span className="text-indigo-400"><Settings className="w-4 h-4" /></span>
                                    Admin Dashboard
                                </Link>
                            )}
                            <div className="hidden lg:block">
                                <hr className="my-2 border-gray-100" />
                                <Link href="/login" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </Link>
                            </div>
                        </div>
                    </nav>

                    {/* Content */}
                    <div>
                        {activeTab === 'overview' && (
                            <div className="space-y-5">
                                {/* Verification Banners */}
                                {user && !user.isEmailVerified && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className="font-bold text-amber-900">Verify your email address</h3>
                                                <p className="text-sm text-amber-700 mt-0.5">Please verify your email to secure your account and receive order updates.</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleResendVerification('email')} 
                                            disabled={resendStatus === 'loading'}
                                            className="whitespace-nowrap px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {resendStatus === 'loading' ? 'Sending...' : <><Send className="w-4 h-4" /> Resend Email</>}
                                        </button>
                                    </div>
                                )}

                                {user && !user.isPhoneVerified && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className="font-bold text-orange-900">Verify your phone number</h3>
                                                <p className="text-sm text-orange-700 mt-0.5">Please verify your phone via OTP to enable Delivery SMS tracking.</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => router.push('/register')} 
                                            className="whitespace-nowrap px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
                                        >
                                            Verify Phone
                                        </button>
                                    </div>
                                )}

                                {resendStatus !== 'idle' && resendStatus !== 'loading' && (
                                    <div className={`p-4 rounded-xl text-sm font-medium border ${resendStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                        {resendMessage}
                                    </div>
                                )}

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Total Orders', value: orders.length.toString(), icon: <Package className="w-5 h-5 text-emerald-500" /> },
                                        { label: 'Wishlist Items', value: '8', icon: <Heart className="w-5 h-5 text-red-500" /> },
                                        { label: 'Reward Points', value: '2,450', icon: <Star className="w-5 h-5 text-amber-500" /> },
                                        { label: 'Saved Addresses', value: '3', icon: <MapPin className="w-5 h-5 text-blue-500" /> },
                                    ].map(s => (
                                        <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">{s.icon}</div>
                                            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Orders */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                        <h3 className="font-bold text-gray-900">Recent Orders</h3>
                                        <button onClick={() => setActiveTab('orders')} className="text-sm text-emerald-600 font-semibold hover:underline">View all</button>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {orders.slice(0, 3).map(order => (
                                            <div key={order.id} onClick={() => { setActiveTab('orders'); setSelectedOrder(order); }} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors gap-2 sm:gap-4 cursor-pointer">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 font-mono">{order.id}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items</p>
                                                </div>
                                                <div className="flex items-center gap-3 sm:gap-4">
                                                    {order.status === 'pending' && <span className="text-[11px] font-bold px-3 py-1 rounded-full text-amber-600 bg-amber-50 capitalize">{order.status}</span>}
                                                    {order.status === 'processing' && <span className="text-[11px] font-bold px-3 py-1 rounded-full text-blue-600 bg-blue-50 capitalize">{order.status}</span>}
                                                    {order.status === 'delivered' && <span className="text-[11px] font-bold px-3 py-1 rounded-full text-emerald-600 bg-emerald-50 capitalize">{order.status}</span>}
                                                    {order.status === 'cancelled' && <span className="text-[11px] font-bold px-3 py-1 rounded-full text-red-600 bg-red-50 capitalize">{order.status}</span>}
                                                    
                                                    <span className="text-sm font-bold text-gray-900">KSh {order.total.toLocaleString()}</span>
                                                    <ChevronRight className="w-4 h-4 text-gray-300 hidden sm:block" />
                                                </div>
                                            </div>
                                        ))}
                                        {orders.length === 0 && !isLoadingOrders && (
                                            <div className="p-6 text-center text-gray-500 text-sm">No recent orders found.</div>
                                        )}
                                        {isLoadingOrders && (
                                            <div className="p-6 text-center text-gray-500 text-sm animate-pulse">Loading orders...</div>
                                        )}
                                    </div>
                                </div>

                                {/* Personal Info */}
                                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-gray-900">Personal Information</h3>
                                        <button className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold hover:underline">
                                            <Edit3 className="w-3.5 h-3.5" /> Edit
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        {[
                                            { label: 'Full Name', value: user?.name || 'N/A' },
                                            { label: 'Email', value: user?.email || 'N/A' },
                                            { label: 'Phone', value: user?.phone || 'N/A' },
                                        ].map(f => (
                                            <div key={f.label}>
                                                <p className="text-xs text-gray-400 font-medium mb-0.5">{f.label}</p>
                                                <p className="font-semibold text-gray-800">{f.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                {selectedOrder ? (
                                    <div>
                                        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                                            <button onClick={() => setSelectedOrder(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                                            </button>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                                    Order {selectedOrder.id}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-0.5">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            {/* Visual Progress Timeline */}
                                            <div className="mb-8 mt-2 px-2 sm:px-6 relative">
                                                <div className="relative flex justify-between z-10">
                                                    {/* Connecting Line (BG) */}
                                                    <div className="absolute top-5 left-[12.5%] right-[12.5%] h-1 bg-gray-200 -z-10" />
                                                    
                                                    {/* Dynamic connecting line (Active) */}
                                                    <div 
                                                        className="absolute top-5 left-[12.5%] h-1 bg-emerald-500 -z-10 transition-all duration-1000 ease-in-out"
                                                        style={{ 
                                                            width: `${Math.max(0, TRACKING_STEPS.findIndex(s => s.id === selectedOrder.status)) / (TRACKING_STEPS.length - 1) * 75}%` 
                                                        }}
                                                    />

                                                    {TRACKING_STEPS.map((step, index) => {
                                                        const currentIndex = TRACKING_STEPS.findIndex(s => s.id === selectedOrder.status);
                                                        const isCompleted = currentIndex >= index;
                                                        const isActive = currentIndex === index;
                                                        const isCancelled = selectedOrder.status === 'cancelled';
                                                        
                                                        const Icon = step.icon;

                                                        return (
                                                            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 w-1/4">
                                                                <div className="relative">
                                                                    {isActive && !isCancelled && (
                                                                        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25" />
                                                                    )}
                                                                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-300
                                                                        ${isCancelled ? 'bg-red-100 text-red-500' : 
                                                                        isActive ? 'bg-emerald-500 text-white shadow-emerald-200' : 
                                                                        isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                                                                    >
                                                                        {isCompleted && !isActive && !isCancelled ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                                                    </div>
                                                                </div>
                                                                <span className={`text-[10px] sm:text-xs font-semibold text-center mt-1 
                                                                    ${isCancelled ? 'text-red-500' : 
                                                                    isActive ? 'text-emerald-700' : 
                                                                    isCompleted ? 'text-emerald-600' : 'text-gray-400'}`}
                                                                >
                                                                    {step.label}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-4 mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                                    <p className="text-sm font-bold text-gray-900 capitalize">{selectedOrder.status}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Payment Method</p>
                                                    <p className="text-sm font-bold text-gray-900 capitalize">{selectedOrder.paymentMethod || 'Unknown'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Payment Status</p>
                                                    <p className="text-sm font-bold text-gray-900 capitalize">{selectedOrder.paymentStatus || 'Pending'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Amount</p>
                                                    <p className="text-sm font-bold text-gray-900">KSh {selectedOrder.total.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <h4 className="font-bold text-gray-900 mb-3 border-b pb-2">Items</h4>
                                            <div className="space-y-4 mb-6">
                                                {selectedOrder.items?.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex justify-between items-center text-sm">
                                                        <div className="flex gap-3">
                                                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">📦</div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{item.name}</p>
                                                                <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                                            </div>
                                                        </div>
                                                        <p className="font-bold text-gray-900">KSh {item.price.toLocaleString()}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <h4 className="font-bold text-gray-900 mb-3 border-b pb-2">Shipping Information</h4>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p><span className="font-semibold">Name:</span> {selectedOrder.customer?.name}</p>
                                                <p><span className="font-semibold">Phone:</span> {selectedOrder.customer?.phone}</p>
                                                <p><span className="font-semibold">Email:</span> {selectedOrder.customer?.email}</p>
                                                <p><span className="font-semibold">Address:</span> {selectedOrder.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-5 border-b border-gray-100">
                                            <h3 className="font-bold text-gray-900 text-lg">My Orders</h3>
                                        </div>
                                        <div className="divide-y divide-gray-50">
                                            {orders.map(order => (
                                                <div key={order.id} onClick={() => setSelectedOrder(order)} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors gap-2 sm:gap-4 cursor-pointer">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 font-mono">{order.id}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items</p>
                                                    </div>
                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                        {order.status === 'pending' && <span className="text-[11px] font-bold px-3 py-1 rounded-full text-amber-600 bg-amber-50 capitalize">{order.status}</span>}
                                                        {order.status === 'processing' && <span className="text-[11px] font-bold px-3 py-1 rounded-full text-blue-600 bg-blue-50 capitalize">{order.status}</span>}
                                                        {order.status === 'delivered' && <span className="text-[11px] font-bold px-3 py-1 rounded-full text-emerald-600 bg-emerald-50 capitalize">{order.status}</span>}
                                                        {order.status === 'cancelled' && <span className="text-[11px] font-bold px-3 py-1 rounded-full text-red-600 bg-red-50 capitalize">{order.status}</span>}
                                                        
                                                        <span className="text-sm font-bold text-gray-900">KSh {order.total.toLocaleString()}</span>
                                                        <ChevronRight className="w-4 h-4 text-emerald-500 hidden sm:block" />
                                                    </div>
                                                </div>
                                            ))}
                                            {orders.length === 0 && !isLoadingOrders && (
                                                <div className="p-8 text-center text-gray-500">You haven't placed any orders yet.</div>
                                            )}
                                            {isLoadingOrders && (
                                                <div className="p-8 text-center text-gray-500 animate-pulse">Loading tracking history...</div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                                <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <h3 className="font-bold text-gray-700 text-lg mb-1">Your Wishlist</h3>
                                <p className="text-sm text-gray-400 mb-5">Items you&apos;ve saved will appear here</p>
                                <Link href="/" className="btn-emerald inline-block px-6 py-3 rounded-xl text-sm font-bold">Browse Products</Link>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="space-y-4">
                                {addresses.map(address => (
                                    <div key={address.id} className={`bg-white rounded-2xl p-6 border shadow-sm relative ${address.isDefault ? 'border-emerald-200' : 'border-gray-100'}`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${address.isDefault ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {address.isDefault ? 'Default Home' : 'Saved Address'}
                                            </span>
                                            {editingId !== address.id && (
                                                <button 
                                                    onClick={() => startEditing(address)}
                                                    className="text-sm text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" /> Edit
                                                </button>
                                            )}
                                        </div>

                                        {editingId === address.id ? (
                                            <form onSubmit={(e) => handleAddressSave(e, address.id)} className="space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
                                                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500" required />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone Number</label>
                                                        <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500" required />
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Street Address</label>
                                                        <input type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500" required />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">City</label>
                                                        <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500" required />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Postal/ZIP Code</label>
                                                        <input type="text" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 pt-2">
                                                    <button type="submit" className="btn-emerald px-5 py-2 rounded-xl text-sm font-bold">Save Changes</button>
                                                    <button type="button" onClick={() => setEditingId(null)} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100">Cancel</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div>
                                                <p className="font-bold text-gray-900">{address.name}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {address.street}<br />
                                                    {address.city}, {address.zip}<br />
                                                    {address.phone}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {isAddingNew ? (
                                    <div className="bg-white rounded-2xl p-6 border border-emerald-500 shadow-emerald-50 shadow-sm relative">
                                        <h3 className="font-bold text-gray-900 mb-4">Add New Address</h3>
                                        <form onSubmit={(e) => handleAddressSave(e)} className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
                                                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500" required />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone Number</label>
                                                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500" required />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Street Address</label>
                                                    <input type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500" required />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">City</label>
                                                    <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500" required />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Postal/ZIP Code</label>
                                                    <input type="text" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 pt-2">
                                                <button type="submit" className="btn-emerald px-5 py-2 rounded-xl text-sm font-bold">Save Address</button>
                                                <button type="button" onClick={() => setIsAddingNew(false)} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100">Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <button onClick={startAdding} className="w-full border-2 border-dashed border-gray-300 rounded-2xl py-8 text-sm font-semibold text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors">
                                        + Add New Address
                                    </button>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
                                <h3 className="font-bold text-gray-900 text-lg">Account Settings</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Email Notifications', desc: 'Receive order updates via email' },
                                        { label: 'SMS Notifications', desc: 'Get delivery alerts via SMS' },
                                        { label: 'Promotional Emails', desc: 'Deals, offers, and new arrivals' },
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-50">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                                                <p className="text-xs text-gray-400">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-emerald-100 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <button className="text-red-500 text-sm font-semibold hover:underline">Delete Account</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
