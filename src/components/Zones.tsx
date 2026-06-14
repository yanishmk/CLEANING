'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/i18n';

export default function Zones() {
  const { lang } = useLang();
  const tr = t.zones;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="zones" className="py-24 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16" ref={ref}>
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
            className="inline-block bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/20 mb-4">
            {tr.tag[lang]}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            {tr.title[lang]}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-lg leading-relaxed">
            {tr.sub[lang]}
          </motion.p>
        </div>

        {/* Zones grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Ottawa */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
          >
            <div className="text-3xl mb-3">🇨🇦</div>
            <h3 className="text-2xl font-bold text-white mb-5">Ottawa</h3>
            <div className="flex flex-wrap gap-2">
              {tr.ottawa.map((area, i) => (
                <motion.span
                  key={area}
                  initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                  className="bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {area}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Gatineau */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
          >
            <div className="text-3xl mb-3">🏛️</div>
            <h3 className="text-2xl font-bold text-white mb-5">Gatineau</h3>
            <div className="flex flex-wrap gap-2">
              {tr.gatineau.map((area, i) => (
                <motion.span
                  key={area}
                  initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  className="bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {area}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Map visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 flex items-center justify-center mb-8"
        >
          <div className="relative w-64 h-40 flex items-center justify-center">
            {/* River line */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
            {/* Ottawa pin */}
            <div className="absolute top-4 right-12 flex flex-col items-center gap-1">
              <motion.div
                className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"
                animate={{ boxShadow: ['0 0 0 0 rgba(59,130,246,0.4)', '0 0 0 12px rgba(59,130,246,0)', '0 0 0 0 rgba(59,130,246,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs text-white font-semibold">Ottawa</span>
            </div>
            {/* Gatineau pin */}
            <div className="absolute bottom-4 left-12 flex flex-col items-center gap-1">
              <motion.div
                className="w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow-lg"
                animate={{ boxShadow: ['0 0 0 0 rgba(96,165,250,0.4)', '0 0 0 12px rgba(96,165,250,0)', '0 0 0 0 rgba(96,165,250,0)'] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <span className="text-xs text-white font-semibold">Gatineau</span>
            </div>
            <span className="text-xs text-gray-500 text-center absolute bottom-0">{tr.mapLabel[lang]}</span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-gray-400 text-sm">
          {tr.note[lang]}
        </motion.p>
      </div>
    </section>
  );
}
