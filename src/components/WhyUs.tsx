'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/i18n';

export default function WhyUs() {
  const { lang } = useLang();
  const tr = t.whyUs;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="why-us" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center" ref={ref}>

          {/* Left */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
              className="inline-block bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-blue-100 mb-4">
              {tr.tag[lang]}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              {tr.title[lang]}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }}
              className="text-gray-600 text-lg leading-relaxed mb-10">
              {tr.sub[lang]}
            </motion.p>

            <div className="flex flex-col gap-6">
              {tr.features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex gap-4 items-start group"
                >
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:bg-blue-100 transition-colors">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{f.title[lang]}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{f.desc[lang]}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — visual block */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}
            className="relative h-[480px] hidden lg:block"
          >
            {/* Main card */}
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl border border-blue-200 flex flex-col items-center justify-center gap-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="text-8xl text-blue-400 leading-none"
              >
                ✦
              </motion.div>
              <p className="text-blue-600 font-semibold text-lg">{tr.imgLabel[lang]}</p>
            </div>

            {/* Badge bottom-left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-4 -left-6 bg-white border border-blue-100 rounded-2xl shadow-xl px-5 py-4 flex flex-col items-center"
            >
              <span className="text-3xl font-black text-blue-700">500+</span>
              <span className="text-xs text-gray-500 font-medium">{lang === 'fr' ? 'Clients' : 'Clients'}</span>
            </motion.div>

            {/* Badge top-right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute -top-4 -right-6 bg-white border border-blue-100 rounded-2xl shadow-xl px-5 py-4 flex flex-col items-center"
            >
              <span className="text-lg font-bold text-gray-800">⭐ 5.0</span>
              <span className="text-xs text-gray-500">{lang === 'fr' ? 'Note moyenne' : 'Average Rating'}</span>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
