'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email address...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link. No token provided.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch(`/api/auth/verify/email?token=${token}`);
                const data = await res.json();
                
                if (res.ok) {
                    setStatus('success');
                    setMessage('Your email has been successfully verified!');
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Failed to verify email. The link may have expired.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('An unexpected error occurred. Please try again.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            {status === 'loading' && (
                <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying Email</h2>
                    <p className="text-gray-500">{message}</p>
                </div>
            )}
            
            {status === 'success' && (
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                    <p className="text-gray-500 mb-8">{message}</p>
                    <Link href="/account" className="btn-emerald w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
                        Go to Account <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                    <p className="text-gray-500 mb-8">{message}</p>
                    <Link href="/login" className="px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                        Return to Login
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-6">
            <Suspense fallback={<div className="text-center p-8 bg-white rounded-2xl shadow-sm"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" /></div>}>
                <VerifyContent />
            </Suspense>
        </div>
    );
}
