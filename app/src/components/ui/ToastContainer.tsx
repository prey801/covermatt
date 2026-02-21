'use client';
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

let toastListeners: ((toast: Toast) => void)[] = [];

export function showToast(message: string, type: Toast['type'] = 'success') {
    const toast: Toast = { id: Date.now().toString(), message, type };
    toastListeners.forEach(l => l(toast));
}

const icons = {
    success: <CheckCircle className="w-5 h-5 text-white" />,
    error: <XCircle className="w-5 h-5 text-white" />,
    warning: <AlertCircle className="w-5 h-5 text-white" />,
    info: <Info className="w-5 h-5 text-white" />,
};

const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
};

export default function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const listener = (toast: Toast) => {
            setToasts(prev => [...prev, toast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toast.id));
            }, 5000);
        };
        toastListeners.push(listener);
        return () => { toastListeners = toastListeners.filter(l => l !== listener); };
    }, []);

    const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`${colors[toast.type]} rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-slideDown text-white`}
                >
                    <div className="mt-0.5 flex-shrink-0">{icons[toast.type]}</div>
                    <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
                    <button onClick={() => dismiss(toast.id)} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
