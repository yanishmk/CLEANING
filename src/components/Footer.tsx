'use client';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/i18n';

export default function Footer() {
  const { lang } = useLang();
  const tr = t.footer;

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-0">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#hero" className="flex items-center gap-2 text-xl font-semibold text-white mb-4">
              <span className="text-blue-400">✦</span>
              <span>Cleaning <strong className="text-blue-400">Sol</strong></span>
            </a>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">{tr.desc[lang]}</p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook"
                className="w-9 h-9 bg-white/10 hover:bg-blue-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram"
                className="w-9 h-9 bg-white/10 hover:bg-blue-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">{tr.services[lang]}</h4>
            <div className="flex flex-col gap-2.5">
              {tr.serviceLinks.map((s, i) => (
                <a key={i} href="#services" className="text-sm text-gray-400 hover:text-blue-300 transition-colors">
                  {s[lang]}
                </a>
              ))}
            </div>
          </div>

          {/* Zones */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">{tr.zones[lang]}</h4>
            <div className="flex flex-col gap-2.5">
              {['Ottawa', 'Gatineau', 'Barrhaven', 'Kanata', 'Hull / Aylmer'].map(z => (
                <span key={z} className="text-sm text-gray-400">{z}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">{tr.contact[lang]}</h4>
            <div className="flex flex-col gap-3 mb-5">
              <a href="tel:+16135550100" className="text-sm text-gray-400 hover:text-white transition-colors">
                📞 (613) 555-0100
              </a>
              <a href="mailto:info@cleaningsol.ca" className="text-sm text-gray-400 hover:text-white transition-colors">
                ✉ info@cleaningsol.ca
              </a>
              <span className="text-sm text-gray-400">📍 Ottawa & Gatineau, ON/QC</span>
            </div>
            <a href="#booking"
              className="inline-flex items-center justify-center bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              {tr.bookNow[lang]}
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-3 text-xs text-gray-500">
          <span>{tr.rights[lang]}</span>
          <span>{tr.location[lang]}</span>
        </div>
      </div>
    </footer>
  );
}
