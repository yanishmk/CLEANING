'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/i18n';

export default function Navbar() {
  const { lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#services', label: t.nav.services[lang] },
    { href: '#why-us',   label: t.nav.whyUs[lang] },
    { href: '#zones',    label: t.nav.zones[lang] },
    { href: '#reviews',  label: t.nav.reviews[lang] },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center gap-8">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 text-xl font-semibold text-gray-900 shrink-0">
          <span className="text-blue-600">✦</span>
          <span>Cleaning <strong className="text-blue-700">Sol</strong></span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 ml-auto">
          {links.map(link => (
            <li key={link.href}>
              <a href={link.href} className="text-sm font-medium text-gray-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#booking" className="ml-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-200">
              {t.nav.cta[lang]}
            </a>
          </li>
        </ul>

        {/* Lang toggle */}
        <button
          onClick={toggle}
          className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
        >
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="md:hidden flex flex-col gap-1.5 p-1"
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-800 rounded transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-800 rounded transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-800 rounded transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {links.map(link => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  className="text-gray-700 font-medium py-3 border-b border-gray-50 text-base">
                  {link.label}
                </a>
              ))}
              <a href="#booking" onClick={() => setMenuOpen(false)}
                className="mt-3 bg-blue-700 text-white text-center py-3.5 rounded-xl font-semibold">
                {t.nav.cta[lang]}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
