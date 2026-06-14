'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/i18n';

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          setValue(Math.floor(current));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{value}{suffix}</span>;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number], delay },
});


export default function Hero() {
  const { lang } = useLang();
  const tr = t.hero;

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-24 pb-16 px-6">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-[80px] bg-gradient-to-br from-blue-200 to-blue-500"
          style={{ top: -200, right: -100 }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-25 blur-[80px] bg-gradient-to-br from-blue-100 to-blue-400"
          style={{ bottom: -100, left: -50 }}
          animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 0.95, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        {/* Grid */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'linear-gradient(#bfdbfe 1px, transparent 1px), linear-gradient(90deg, #bfdbfe 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between gap-12">
        {/* Left content */}
        <div className="flex-1 max-w-[580px]">
          <motion.div {...fadeUp(0)}
            className="inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-6 shadow-sm shadow-blue-100">
            {tr.badge[lang]}
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="font-serif text-5xl lg:text-7xl font-extrabold leading-[1.05] text-gray-900 mb-6">
            <span className="block">{tr.line1[lang]}</span>
            <span className="block bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              {tr.line2[lang]}
            </span>
            <span className="block">{tr.line3[lang]}</span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-lg text-gray-600 leading-relaxed mb-8 max-w-md">
            {tr.sub[lang]}
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex gap-4 flex-wrap mb-12">
            <a href="#booking"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-base px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-200 shadow-lg shadow-blue-200/60">
              {tr.cta1[lang]}
            </a>
            <a href="#services"
              className="bg-white hover:bg-blue-50 text-blue-700 font-semibold text-base px-7 py-4 rounded-xl border-[1.5px] border-blue-200 hover:border-blue-400 transition-all hover:-translate-y-0.5">
              {tr.cta2[lang]}
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.4)} className="flex items-center gap-8 flex-wrap">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-blue-700 leading-none">
                <Counter target={500} suffix="+" />
              </span>
              <span className="text-xs text-gray-500 font-medium mt-1">{tr.stat1[lang]}</span>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex flex-col">
              <span className="text-4xl font-black text-blue-700 leading-none">
                <Counter target={5} suffix="+" />
              </span>
              <span className="text-xs text-gray-500 font-medium mt-1">{tr.stat2[lang]}</span>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex flex-col">
              <span className="text-4xl font-black text-blue-700 leading-none">
                <Counter target={100} suffix="%" />
              </span>
              <span className="text-xs text-gray-500 font-medium mt-1">{tr.stat3[lang]}</span>
            </div>
          </motion.div>
        </div>

        {/* Right floating cards */}
        <div className="hidden lg:flex flex-col gap-4 items-end shrink-0">
          {[
            { icon: '🏠', title: lang === 'fr' ? 'Résidentiel' : 'Residential', sub: lang === 'fr' ? 'Maisons & Condos' : 'Houses & Condos', featured: false, delay: 0 },
            { icon: '🏢', title: lang === 'fr' ? 'Commercial' : 'Commercial', sub: lang === 'fr' ? 'Bureaux & Commerces' : 'Offices & Businesses', featured: true, delay: 0.5 },
            { icon: '🔨', title: lang === 'fr' ? 'Post-construction' : 'Post-Construction', sub: lang === 'fr' ? 'Après travaux' : 'After Renovation', featured: false, delay: 1 },
          ].map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0, y: [0, card.delay === 0 ? -12 : card.delay === 0.5 ? -8 : -16, 0] }}
              transition={{ opacity: { duration: 0.6, delay: 0.3 + card.delay * 0.2 }, x: { duration: 0.6, delay: 0.3 + card.delay * 0.2 }, y: { duration: 4 + card.delay, repeat: Infinity, ease: 'easeInOut', delay: card.delay } }}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg border min-w-[220px] ${card.featured ? 'bg-blue-700 border-blue-700' : 'bg-white border-blue-100'}`}
            >
              <span className="text-3xl">{card.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-bold ${card.featured ? 'text-white' : 'text-gray-800'}`}>{card.title}</p>
                <p className={`text-xs ${card.featured ? 'text-blue-100' : 'text-gray-500'}`}>{card.sub}</p>
              </div>
              <span className={`font-bold ${card.featured ? 'text-white' : 'text-blue-600'}`}>✓</span>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gray-900 text-white rounded-xl px-5 py-3 flex flex-col items-center gap-1 shadow-xl"
          >
            <span className="text-base">⭐⭐⭐⭐⭐</span>
            <span className="text-xs text-gray-300">{lang === 'fr' ? '5.0 sur Google' : '5.0 on Google'}</span>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <motion.div
          className="w-0.5 h-12 rounded-full bg-gradient-to-b from-blue-400 to-transparent"
          animate={{ scaleY: [1, 0.3, 1], opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </section>
  );
}
