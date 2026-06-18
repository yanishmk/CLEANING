import type { Metadata } from 'next';
import './globals.css';
import { LangProvider } from '@/context/LangContext';

export const metadata: Metadata = {
  title: 'Cleaning Sol - Nettoyage à Ottawa et Gatineau',
  description:
    'Services de nettoyage résidentiel, commercial et après travaux à Ottawa et Gatineau. Demandez un devis gratuit.',
  keywords: [
    'nettoyage Ottawa',
    'nettoyage Gatineau',
    'cleaning service Ottawa',
    'ménage résidentiel',
    'nettoyage commercial',
  ],
  icons: {
    icon: '/logo-cleaning.png',
    shortcut: '/logo-cleaning.png',
    apple: '/logo-cleaning.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
