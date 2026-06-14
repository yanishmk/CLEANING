'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/i18n';

export default function Testimonials() {
  const { lang } = useLang();
  const tr = t.testimonials;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="reviews" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16" ref={ref}>
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
            className="inline-block bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-blue-100 mb-4">
            {tr.tag[lang]}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            {tr.title[lang]}
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tr.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.15 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-blue-50 transition-shadow"
            >
              <div className="text-lg mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 text-sm leading-relaxed italic mb-6">{item.text[lang]}</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {item.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.role[lang]}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
