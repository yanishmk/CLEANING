'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/i18n';

export default function Booking() {
  const { lang } = useLang();
  const tr = t.booking;
  const f = tr.form;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? '';

    if (FORMSPREE_ID) {
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) { form.reset(); setSuccess(true); setTimeout(() => setSuccess(false), 6000); }
      } catch { /* fallthrough to mailto */ }
    } else {
      const body = encodeURIComponent(
        `Nouvelle demande — Cleaning Sol\n\nNom: ${data.fname} ${data.lname}\nCourriel: ${data.email}\nTéléphone: ${data.phone}\nService: ${data.service}\nVille: ${data.city}\nDate: ${data.date ?? 'N/A'}\nMessage: ${data.message ?? 'N/A'}`
      );
      await new Promise(r => setTimeout(r, 600));
      window.location.href = `mailto:info@cleaningsol.ca?subject=Estimation%20Cleaning%20Sol&body=${body}`;
      form.reset();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 6000);
    }
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-sm font-medium text-gray-800 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-gray-400";

  return (
    <section id="booking" className="py-24 bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-start" ref={ref}>

          {/* Left */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
              className="inline-block bg-white/15 text-white/90 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/20 mb-4">
              {tr.tag[lang]}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
              {tr.title[lang]}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }}
              className="text-blue-100 text-lg leading-relaxed mb-8">
              {tr.sub[lang]}
            </motion.p>

            <div className="flex flex-col gap-3 mb-10">
              {tr.perks.map((perk, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-blue-100"
                >
                  <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">✓</span>
                  {perk[lang]}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col gap-3"
            >
              <a href="tel:+16135550100" className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm">
                📞 (613) 555-0100
              </a>
              <a href="mailto:info@cleaningsol.ca" className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm">
                ✉ info@cleaningsol.ca
              </a>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl shadow-blue-950/30"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">{f.fname[lang]}</label>
                  <input type="text" name="fname" required placeholder="Marie" className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">{f.lname[lang]}</label>
                  <input type="text" name="lname" required placeholder="Dupont" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">{f.email[lang]}</label>
                  <input type="email" name="email" required placeholder="marie@exemple.com" className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">{f.phone[lang]}</label>
                  <input type="tel" name="phone" required placeholder="(613) 555-0100" className={inputClass} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">{f.service[lang]}</label>
                <select name="service" required className={inputClass}>
                  {f.serviceOptions.map(o => (
                    <option key={o.value} value={o.value}>{o[lang]}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">{f.city[lang]}</label>
                  <select name="city" required className={inputClass}>
                    {f.cityOptions.map(o => (
                      <option key={o.value} value={o.value}>{o[lang]}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">{f.date[lang]}</label>
                  <input type="date" name="date" className={inputClass} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">{f.details[lang]}</label>
                <textarea name="message" rows={3} placeholder={f.placeholder_details[lang]} className={`${inputClass} resize-none`} />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(37,99,235,0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-70 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-200 mt-1"
              >
                <span>{loading ? f.sending[lang] : f.submit[lang]}</span>
                {!loading && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </motion.button>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 font-semibold text-sm"
                >
                  <span className="text-lg">✓</span> {f.success[lang]}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
