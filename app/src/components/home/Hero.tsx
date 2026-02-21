'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Truck, Zap, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const BANNERS = [
    {
        headline: 'Quality Hardware & Electrical Supplies',
        subheading: 'Everything you need to build, fix, and improve your home — delivered fast across Kenya.',
        cta: 'Shop Now',
        ctaHref: '#categories',
        secondary: 'Browse Categories',
        badge: null,
        bg: 'from-emerald-500 via-emerald-600 to-teal-700',
        emoji: '🔧',
        timer: false,
    },
    {
        headline: 'Up to 40% OFF Power Tools',
        subheading: 'Professional grade equipment at unbeatable prices. Limited stock — act fast!',
        cta: 'Shop Power Tools',
        ctaHref: '#',
        secondary: null,
        badge: 'LIMITED TIME',
        bg: 'from-gray-800 via-gray-900 to-black',
        emoji: '⚡',
        timer: true,
    },
    {
        headline: 'Latest Products Just Arrived',
        subheading: 'Explore the newest tools, electrical supplies and essentials added to our store.',
        cta: 'View New Arrivals',
        ctaHref: '#',
        secondary: null,
        badge: 'NEW',
        bg: 'from-blue-600 via-blue-700 to-indigo-800',
        emoji: '✨',
        timer: false,
    },
    {
        headline: 'Free Delivery Over KSh 5,000',
        subheading: 'Fast shipping across Nairobi and major cities. Same-day delivery available in select areas!',
        cta: 'Start Shopping',
        ctaHref: '#categories',
        secondary: null,
        badge: null,
        bg: 'from-emerald-400 via-emerald-500 to-teal-600',
        emoji: '🚚',
        timer: false,
    },
];

function CountdownTimer() {
    const [time, setTime] = useState({ h: 4, m: 37, s: 22 });
    useEffect(() => {
        const iv = setInterval(() => {
            setTime(prev => {
                let { h, m, s } = prev;
                s--;
                if (s < 0) { s = 59; m--; }
                if (m < 0) { m = 59; h--; }
                if (h < 0) { h = 23; m = 59; s = 59; }
                return { h, m, s };
            });
        }, 1000);
        return () => clearInterval(iv);
    }, []);
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
        <div className="flex items-center gap-2.5 mt-5">
            <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Ends in</span>
            {[
                { v: time.h, l: 'HRS' },
                { v: time.m, l: 'MIN' },
                { v: time.s, l: 'SEC' },
            ].map((item, i) => (
                <React.Fragment key={i}>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-3.5 py-2.5 text-center min-w-[56px] border border-white/10">
                        <span className="text-2xl font-extrabold text-white tabular-nums tracking-tight">{pad(item.v)}</span>
                        <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest mt-0.5">{item.l}</p>
                    </div>
                    {i < 2 && <span className="text-white/30 text-xl font-bold">:</span>}
                </React.Fragment>
            ))}
        </div>
    );
}

export default function Hero() {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    const next = useCallback(() => setCurrent(c => (c + 1) % BANNERS.length), []);
    const prev = useCallback(() => setCurrent(c => (c - 1 + BANNERS.length) % BANNERS.length), []);

    useEffect(() => {
        if (paused) return;
        const iv = setInterval(next, 5000);
        return () => clearInterval(iv);
    }, [next, paused]);

    const banner = BANNERS[current];

    return (
        <section
            className={`relative bg-gradient-to-br ${banner.bg} overflow-hidden transition-colors duration-700`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Abstract circles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/5 rounded-full" />
                <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-white/[0.03] rounded-full" />
                <div className="absolute bottom-1/3 left-1/3 w-32 h-32 bg-white/[0.04] rounded-full" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 min-h-[440px] sm:min-h-[520px]">
                {/* Text content */}
                <div className="flex-1 max-w-2xl text-center lg:text-left">
                    {banner.badge && (
                        <span className="inline-block bg-red-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-4 shadow-lg shadow-red-500/30">
                            {banner.badge}
                        </span>
                    )}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold text-white leading-[1.1] tracking-tight font-heading">
                        {banner.headline}
                    </h1>
                    <p className="text-base sm:text-lg text-white/70 mt-4 sm:mt-5 leading-relaxed max-w-xl mx-auto lg:mx-0">
                        {banner.subheading}
                    </p>

                    {banner.timer && <CountdownTimer />}

                    <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 mt-7 sm:mt-8 flex-wrap">
                        <Link
                            href={banner.ctaHref}
                            className="inline-flex items-center gap-2.5 bg-white text-emerald-700 font-extrabold px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-sm sm:text-base"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {banner.cta}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        {banner.secondary && (
                            <Link
                                href="#categories"
                                className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-6 py-3.5 sm:py-4 rounded-2xl hover:bg-white/10 hover:border-white/60 transition-all text-sm sm:text-base"
                            >
                                {banner.secondary}
                            </Link>
                        )}
                    </div>

                    {/* Trust strip */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 mt-8 sm:mt-10">
                        {[
                            { icon: <Truck className="w-4 h-4" />, text: 'Free delivery over KSh 5k' },
                            { icon: <ShieldCheck className="w-4 h-4" />, text: 'Genuine products' },
                            { icon: <Zap className="w-4 h-4" />, text: '1-2 day express' },
                        ].map(t => (
                            <div key={t.text} className="flex items-center gap-2 text-white/50 text-xs sm:text-sm">
                                {t.icon} {t.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emoji side */}
                <div className="text-8xl sm:text-9xl lg:text-[160px] leading-none select-none animate-float hidden sm:block">
                    {banner.emoji}
                </div>
            </div>

            {/* Nav arrows */}
            <button
                onClick={prev}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/25 transition-all text-white border border-white/10"
                aria-label="Previous"
            >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
                onClick={next}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/25 transition-all text-white border border-white/10"
                aria-label="Next"
            >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex gap-2">
                {BANNERS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
