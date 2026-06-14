'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/i18n';

export default function Services() {
  const { lang } = useLang();
  const tr = t.services;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16" ref={ref}>
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
            className="inline-block bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-blue-100 mb-4">
            {tr.tag[lang]}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {tr.title[lang]}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-lg leading-relaxed">
            {tr.sub[lang]}
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {tr.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.15, ease: 'easeOut' }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative rounded-2xl p-8 border overflow-hidden group transition-shadow hover:shadow-2xl hover:shadow-blue-100 ${
                item.featured
                  ? 'bg-gradient-to-br from-blue-800 to-blue-600 border-blue-700 text-white'
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Top accent line */}
              {!item.featured && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-t-2xl" />
              )}

              {item.featured && (
                <span className="absolute top-5 right-5 bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/30">
                  {tr.popular[lang]}
                </span>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 ${
                item.featured ? 'bg-white/20 border border-white/30' : 'bg-blue-50 border border-blue-100'
              }`}>
                {item.icon}
              </div>

              <h3 className={`text-xl font-bold mb-3 ${item.featured ? 'text-white' : 'text-gray-900'}`}>
                {item.title[lang]}
              </h3>
              <p className={`text-sm leading-relaxed mb-5 ${item.featured ? 'text-blue-100' : 'text-gray-600'}`}>
                {item.desc[lang]}
              </p>

              <ul className="flex flex-col gap-2 mb-7">
                {item.features.map((f, j) => (
                  <li key={j} className={`text-sm flex items-start gap-2 ${item.featured ? 'text-blue-50' : 'text-gray-700'}`}>
                    <span className={`mt-0.5 font-bold ${item.featured ? 'text-white/70' : 'text-blue-500'}`}>✓</span>
                    {f[lang]}
                  </li>
                ))}
              </ul>

              <a href="#booking" className={`inline-flex items-center text-sm font-bold gap-1 transition-all hover:gap-3 ${
                item.featured ? 'text-white/90 hover:text-white' : 'text-blue-700 hover:text-blue-800'
              }`}>
                {tr.cta[lang]}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
