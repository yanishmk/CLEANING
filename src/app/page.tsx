'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';

const copy = {
  fr: {
    nav: ['Services', 'Méthode', 'Suivi', 'Zones', 'Avis', 'FAQ'],
    estimate: 'Devis gratuit',
    heroEyebrow: 'Nettoyage résidentiel et commercial',
    heroTitle: 'Un espace propre, calme et prêt à vivre.',
    heroText:
      'Cleaning Sol aide les familles, bureaux et chantiers d’Ottawa-Gatineau avec un service ponctuel, assuré et facile à réserver.',
    primary: 'Demander un devis',
    secondary: 'Voir les services',
    trusted: 'Réponse sous 24h',
    insured: 'Équipe assurée',
    flexible: 'Horaires flexibles',
    servicesTitle: 'Des services clairs pour chaque besoin',
    servicesText:
      'Choisissez un entretien régulier ou une remise à neuf complète. Nous adaptons la checklist à votre espace avant chaque visite.',
    methodTitle: 'Une expérience simple, sans surprise',
    followTitle: 'Un suivi clair après chaque intervention',
    followText:
      'Vous savez exactement ce qui a été fait, avec des preuves visuelles et un accès simple à vos demandes.',
    zonesTitle: 'Secteurs desservis',
    zonesText:
      'Nous couvrons Ottawa, Gatineau et les quartiers voisins. Hors zone? Envoyez la demande, nous vous répondrons rapidement.',
    reviewsTitle: 'Ce que les clients apprécient',
    faqTitle: 'Questions fréquentes',
    faqText:
      'Les réponses aux questions qu’on nous pose le plus souvent avant une première réservation.',
    bookingTitle: 'Recevoir un devis gratuit',
    bookingText:
      'Décrivez votre espace et le service souhaité. Nous vous recontactons avec une soumission claire en ligne sous 24h.',
    submit: 'Envoyer la demande',
    sending: 'Préparation...',
    success: 'Merci, votre courriel est prêt à être envoyé.',
    footer: 'Services de nettoyage à Ottawa et Gatineau.',
    rights: 'Tous droits réservés.',
  },
  en: {
    nav: ['Services', 'Process', 'Follow-up', 'Areas', 'Reviews', 'FAQ'],
    estimate: 'Free quote',
    heroEyebrow: 'Residential and commercial cleaning',
    heroTitle: 'A clean, calm space ready for real life.',
    heroText:
      'Cleaning Sol helps families, offices, and job sites across Ottawa-Gatineau with punctual, insured service that is easy to book.',
    primary: 'Request a quote',
    secondary: 'View services',
    trusted: 'Reply within 24h',
    insured: 'Insured team',
    flexible: 'Flexible schedules',
    servicesTitle: 'Clear services for every need',
    servicesText:
      'Choose regular maintenance or a full reset. We tailor the checklist to your space before every visit.',
    methodTitle: 'A simple experience, no surprises',
    followTitle: 'Clear follow-up after every visit',
    followText:
      'You know exactly what was done, with visual proof and simple access to your requests.',
    zonesTitle: 'Service areas',
    zonesText:
      'We serve Ottawa, Gatineau, and nearby neighborhoods. Outside the area? Send the request and we will reply quickly.',
    reviewsTitle: 'What clients appreciate',
    faqTitle: 'Frequently asked questions',
    faqText: 'Answers to the questions clients usually ask before booking their first visit.',
    bookingTitle: 'Get a free quote',
    bookingText:
      'Tell us about your space and the service you need. We will get back to you with a clear online quote within 24h.',
    submit: 'Send request',
    sending: 'Preparing...',
    success: 'Thanks, your email is ready to send.',
    footer: 'Cleaning services in Ottawa and Gatineau.',
    rights: 'All rights reserved.',
  },
} as const;

const services = [
  {
    title: { fr: 'Ménage résidentiel', en: 'Residential cleaning' },
    text: {
      fr: 'Maisons, condos et appartements: entretien régulier, grand ménage, emménagement ou déménagement.',
      en: 'Homes, condos, and apartments: regular upkeep, deep cleaning, move-in or move-out service.',
    },
    points: {
      fr: ['Cuisine et salles de bain', 'Sols, poussière et surfaces', 'Options hebdomadaires ou mensuelles'],
      en: ['Kitchen and bathrooms', 'Floors, dusting, and surfaces', 'Weekly or monthly options'],
    },
  },
  {
    title: { fr: 'Nettoyage commercial', en: 'Commercial cleaning' },
    text: {
      fr: 'Bureaux, commerces, studios et espaces communs nettoyés selon vos horaires d’ouverture.',
      en: 'Offices, shops, studios, and common areas cleaned around your operating hours.',
    },
    points: {
      fr: ['Contrats récurrents', 'Sanitaires et zones partagées', 'Interventions discrètes'],
      en: ['Recurring contracts', 'Restrooms and shared areas', 'Low-disruption visits'],
    },
  },
  {
    title: { fr: 'Après travaux', en: 'Post-construction' },
    text: {
      fr: 'Retrait de poussière fine, traces de travaux et résidus pour livrer un espace vraiment prêt.',
      en: 'Fine dust removal, renovation marks, and residue cleanup so the space is truly ready.',
    },
    points: {
      fr: ['Poussière de chantier', 'Vitres et surfaces', 'Préparation avant livraison'],
      en: ['Construction dust', 'Windows and surfaces', 'Final handover preparation'],
    },
  },
];

const processSteps = [
  {
    title: { fr: '1. Demande rapide', en: '1. Quick request' },
    text: {
      fr: 'Vous envoyez les détails essentiels: type d’espace, fréquence, ville et contraintes.',
      en: 'You send the essentials: space type, frequency, city, and any constraints.',
    },
  },
  {
    title: { fr: '2. Devis transparent', en: '2. Transparent quote' },
    text: {
      fr: 'Nous confirmons le périmètre, la durée estimée et le prix avant la première visite.',
      en: 'We confirm the scope, estimated duration, and price before the first visit.',
    },
  },
  {
    title: { fr: '3. Nettoyage suivi', en: '3. Tracked cleaning' },
    text: {
      fr: 'L’équipe suit une checklist claire et ajuste les priorités selon votre retour.',
      en: 'The team follows a clear checklist and adjusts priorities based on your feedback.',
    },
  },
];

const portalTabs = [
  { id: 'report', label: { fr: 'Rapport', en: 'Report' } },
  { id: 'photos', label: { fr: 'Avant / après', en: 'Before / after' } },
  { id: 'portal', label: { fr: 'Portail client', en: 'Client portal' } },
  { id: 'quote', label: { fr: 'Soumission 24h', en: '24h quote' } },
] as const;

type PortalTab = (typeof portalTabs)[number]['id'];

const reviews = [
  {
    name: 'Sophie M.',
    role: 'Ottawa',
    image: '/testimonials/sophie.png',
    text: {
      fr: 'Service ponctuel et très soigné. La cuisine et les salles de bain étaient impeccables.',
      en: 'Punctual and careful service. The kitchen and bathrooms were spotless.',
    },
  },
  {
    name: 'Karim B.',
    role: 'Gatineau',
    image: '/testimonials/karim.png',
    text: {
      fr: 'Communication claire, prix juste et aucun détail oublié dans nos bureaux.',
      en: 'Clear communication, fair pricing, and no detail missed in our office.',
    },
  },
  {
    name: 'Nadia R.',
    role: 'Kanata',
    image: '/testimonials/nadia.png',
    text: {
      fr: 'Après les rénovations, ils ont remis la maison en état beaucoup plus vite que prévu.',
      en: 'After renovations, they reset the house much faster than expected.',
    },
  },
];

const faqs = [
  {
    question: { fr: 'Pourquoi choisir Cleaning Sol?', en: 'Why choose Cleaning Sol?' },
    answer: {
      fr: 'Parce que le service est simple, fiable et suivi. L’équipe arrive avec une checklist claire, respecte vos priorités et ajuste le nettoyage selon vos retours.',
      en: 'Because the service is simple, reliable, and tracked. The team arrives with a clear checklist, respects your priorities, and adjusts the cleaning based on your feedback.',
    },
  },
  {
    question: { fr: 'Est-ce que l’équipe est assurée?', en: 'Is the team insured?' },
    answer: {
      fr: 'Oui. Les interventions sont réalisées par une équipe professionnelle et assurée, avec des méthodes adaptées aux maisons, bureaux et espaces après travaux.',
      en: 'Yes. Visits are handled by a professional, insured team with methods adapted to homes, offices, and post-construction spaces.',
    },
  },
  {
    question: { fr: 'Comment le prix est-il calculé?', en: 'How is pricing calculated?' },
    answer: {
      fr: 'Le devis dépend du type de service, de la taille de l’espace, de l’état général, de la fréquence et des priorités demandées. Le prix est confirmé avant la visite.',
      en: 'The quote depends on service type, space size, current condition, frequency, and requested priorities. Pricing is confirmed before the visit.',
    },
  },
  {
    question: { fr: 'Fournissez-vous les produits?', en: 'Do you bring supplies?' },
    answer: {
      fr: 'Oui, nous pouvons apporter les produits et outils nécessaires. Si vous préférez certains produits pour votre maison ou votre commerce, indiquez-le dans la demande.',
      en: 'Yes, we can bring the required products and tools. If you prefer specific products for your home or business, mention it in the request.',
    },
  },
  {
    question: { fr: 'Peut-on réserver un nettoyage régulier?', en: 'Can I book recurring cleaning?' },
    answer: {
      fr: 'Oui. Nous proposons des passages hebdomadaires, aux deux semaines, mensuels ou sur mesure selon votre rythme et vos besoins.',
      en: 'Yes. We offer weekly, bi-weekly, monthly, or custom schedules depending on your routine and needs.',
    },
  },
];

const areas = ['Ottawa', 'Gatineau', 'Kanata', 'Barrhaven', 'Nepean', 'Orleans', 'Hull', 'Aylmer'];
const contactPhoneDisplay = '514 570 4038';
const contactPhoneHref = '+15145704038';
const whatsappHref = 'https://wa.me/15145704038';
const quoteSteps = ['Contact', 'Lieu', 'Estimation', 'Photos'] as const;

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function imageFileToSmallDataUrl(file: File) {
  if (!file.type.startsWith('image/')) return fileToDataUrl(file);

  return new Promise<string>((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      const maxSize = 1200;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d');

      if (!context) {
        URL.revokeObjectURL(url);
        fileToDataUrl(file).then(resolve);
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.74));
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      fileToDataUrl(file).then(resolve);
    };

    image.src = url;
  });
}

export default function Home() {
  const { lang, toggle } = useLang();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activePortalTab, setActivePortalTab] = useState<PortalTab>('report');
  const [compareValue, setCompareValue] = useState(52);
  const [clientCode, setClientCode] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [portalRecord, setPortalRecord] = useState<{
    quote: {
      id: string;
      status: string;
      service: string;
      address: string;
      city: string;
      quoteDueAt: string;
      nextVisit?: string;
    };
    reports: Array<{ id: string; title: string; notes: string; checklist: string[] }>;
  } | null>(null);
  const [portalMessage, setPortalMessage] = useState('');
  const [quoteReference, setQuoteReference] = useState('');
  const [confirmationEmailSent, setConfirmationEmailSent] = useState<boolean | null>(null);
  const [confirmationEmailReason, setConfirmationEmailReason] = useState('');
  const [quoteCopied, setQuoteCopied] = useState(false);
  const [quoteStep, setQuoteStep] = useState(0);
  const [formError, setFormError] = useState('');
  const c = copy[lang];

  async function submitEstimate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (quoteStep < quoteSteps.length - 1) {
      nextQuoteStep();
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const required = ['name', 'email', 'phone', 'address', 'service', 'city'];
    const missing = required.find((field) => !String(formData.get(field) ?? '').trim());

    if (missing) {
      setQuoteStep(['name', 'email', 'phone'].includes(missing) ? 0 : 1);
      setSent(false);
      setFormError('Completez les champs obligatoires avant d envoyer la demande.');
      return;
    }

    setLoading(true);
    setSent(false);
    setFormError('');
    setQuoteReference('');
    setConfirmationEmailSent(null);
    setConfirmationEmailReason('');
    setQuoteCopied(false);

    const roomPhotoFiles = formData
      .getAll('roomPhotos')
      .filter((file): file is File => file instanceof File && file.size > 0)
      .slice(0, 4);
    const roomPhotos = await Promise.all(roomPhotoFiles.map(imageFileToSmallDataUrl));
    const data = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      address: String(formData.get('address') ?? ''),
      service: String(formData.get('service') ?? ''),
      city: String(formData.get('city') ?? ''),
      preferredDate: String(formData.get('preferredDate') ?? ''),
      preferredTime: String(formData.get('preferredTime') ?? ''),
      propertyType: String(formData.get('propertyType') ?? ''),
      spaceSize: String(formData.get('spaceSize') ?? ''),
      currentCondition: String(formData.get('currentCondition') ?? ''),
      frequency: String(formData.get('frequency') ?? ''),
      bedrooms: String(formData.get('bedrooms') ?? ''),
      bathrooms: String(formData.get('bathrooms') ?? ''),
      rooms: String(formData.get('rooms') ?? ''),
      extras: formData.getAll('extras').map(String).filter(Boolean).join(', '),
      accessNotes: String(formData.get('accessNotes') ?? ''),
      message: String(formData.get('message') ?? ''),
      roomPhotos,
    };

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => null);

      if (!res.ok || !result?.quote?.id) {
        setFormError(result?.message ?? 'Impossible d envoyer la demande. Reessayez ou contactez-nous sur WhatsApp.');
        setLoading(false);
        return;
      }

      setQuoteReference(result.quote.id);
      setConfirmationEmailSent(Boolean(result.email?.sent));
      setConfirmationEmailReason(result.email?.sent ? '' : String(result.email?.reason ?? 'Email non envoye.'));
      setSent(true);
      setQuoteStep(0);
      form.reset();
    } catch (error) {
      const detail = error instanceof Error ? ` (${error.message})` : '';
      setFormError(`Impossible d envoyer la demande. Verifiez votre connexion ou envoyez-nous un message WhatsApp.${detail}`);
    }

    setLoading(false);
  }

  function nextQuoteStep() {
    setFormError('');
    setQuoteStep((current) => Math.min(current + 1, quoteSteps.length - 1));
  }

  function previousQuoteStep() {
    setFormError('');
    setQuoteStep((current) => Math.max(current - 1, 0));
  }

  async function copyQuoteReference() {
    if (!quoteReference) return;

    try {
      await navigator.clipboard.writeText(quoteReference);
      setQuoteCopied(true);
      window.setTimeout(() => setQuoteCopied(false), 2200);
    } catch {
      setQuoteCopied(false);
    }
  }

  async function openClientPortal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPortalMessage('');
    setPortalRecord(null);

    const res = await fetch('/api/client-portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference: clientCode, contact: clientContact }),
    });
    const result = await res.json();

    if (!res.ok) {
      setPortalMessage(result.message ?? 'Dossier introuvable.');
    } else {
      setPortalRecord({ quote: result.quote, reports: result.reports });
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Cleaning Sol">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-sun" />
            <span className="brand-shine" />
          </span>
          <span>Cleaning Sol</span>
        </a>
        <nav aria-label="Navigation principale">
          {['services', 'process', 'follow', 'areas', 'reviews', 'faq'].map((id, index) => (
            <a key={id} href={`#${id}`}>
              {c.nav[index]}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="lang-button" onClick={toggle} aria-label="Changer la langue">
            {lang === 'fr' ? 'English' : 'Français'}
          </button>
          <Link className="button button-secondary button-small" href="/portail">
            Portail
          </Link>
          <a className="button button-small" href="#booking">
            {c.estimate}
          </a>
        </div>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">{c.heroEyebrow}</p>
          <h1>{c.heroTitle}</h1>
          <p className="hero-text">{c.heroText}</p>
          <div className="hero-actions">
            <a className="button" href="#booking">
              {c.primary}
            </a>
            <a className="button button-secondary" href="#services">
              {c.secondary}
            </a>
          </div>
          <div className="trust-row" aria-label="Points de confiance">
            <span>{c.trusted}</span>
            <span>{c.insured}</span>
            <span>{c.flexible}</span>
          </div>
        </div>
        <div className="hero-media">
          <Image src="/cleaning-hero.png" alt="" fill priority sizes="(max-width: 920px) 100vw, 50vw" />
          <div className="hero-note">
            <strong>4.9/5</strong>
            <span>Ottawa-Gatineau</span>
          </div>
        </div>
      </section>

      <section id="services" className="section">
        <div className="section-heading">
          <p className="eyebrow">Services</p>
          <h2>{c.servicesTitle}</h2>
          <p>{c.servicesText}</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title.fr}>
              <h3>{service.title[lang]}</h3>
              <p>{service.text[lang]}</p>
              <ul>
                {service.points[lang].map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className="section section-muted">
        <div className="section-heading">
          <p className="eyebrow">Process</p>
          <h2>{c.methodTitle}</h2>
        </div>
        <div className="process-grid">
          {processSteps.map((step) => (
            <article key={step.title.fr}>
              <h3>{step.title[lang]}</h3>
              <p>{step.text[lang]}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="follow" className="section follow-section">
        <div className="section-heading">
          <p className="eyebrow">Suivi client</p>
          <h2>{c.followTitle}</h2>
          <p>{c.followText}</p>
        </div>
        <div className="portal-shell">
          <div className="portal-tabs" role="tablist" aria-label="Suivi client">
            {portalTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={activePortalTab === tab.id ? 'active' : ''}
                onClick={() => setActivePortalTab(tab.id)}
              >
                {tab.label[lang]}
              </button>
            ))}
          </div>

          <div className="portal-panel">
            {activePortalTab === 'report' && (
              <div className="report-layout">
                <div className="report-card">
                  <div className="report-header">
                    <span>CS-2481</span>
                    <strong>{lang === 'fr' ? 'Intervention complétée' : 'Visit completed'}</strong>
                  </div>
                  <h3>{lang === 'fr' ? 'Rapport du 7 juin' : 'June 7 report'}</h3>
                  <ul className="check-list">
                    <li>{lang === 'fr' ? 'Cuisine: surfaces, évier, sol' : 'Kitchen: surfaces, sink, floor'}</li>
                    <li>{lang === 'fr' ? 'Salle de bain: sanitaires et miroirs' : 'Bathroom: fixtures and mirrors'}</li>
                    <li>{lang === 'fr' ? 'Bureau: poussière et zones communes' : 'Office: dusting and common areas'}</li>
                    <li>{lang === 'fr' ? 'Point à suivre: vitres extérieures' : 'Follow-up: exterior windows'}</li>
                  </ul>
                </div>
                <div className="status-card">
                  <span className="status-dot" />
                  <strong>{lang === 'fr' ? 'Envoyé au client' : 'Sent to client'}</strong>
                  <p>
                    {lang === 'fr'
                      ? 'Le rapport est prêt à être partagé après chaque intervention.'
                      : 'The report is ready to be shared after every visit.'}
                  </p>
                </div>
              </div>
            )}

            {activePortalTab === 'photos' && (
              <div className="compare-module">
                <div className="compare-frame">
                  <Image
                    src="/follow/kitchen-before-real-v4.png"
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 920px) 100vw, 50vw"
                  />
                  <div className="compare-after" style={{ width: `${compareValue}%` }}>
                    <Image
                      src="/follow/kitchen-after-real-v4.png"
                      alt=""
                      fill
                      unoptimized
                      sizes="(max-width: 920px) 100vw, 50vw"
                    />
                  </div>
                  <span className="compare-label before">Avant</span>
                  <span className="compare-label after">Après</span>
                </div>
                <label className="compare-control">
                  {lang === 'fr' ? 'Glisser pour comparer' : 'Drag to compare'}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={compareValue}
                    onChange={(event) => setCompareValue(Number(event.target.value))}
                  />
                </label>
              </div>
            )}

            {activePortalTab === 'portal' && (
              <div className="client-portal-demo">
                <form
                  className="portal-login"
                  onSubmit={openClientPortal}
                >
                  <label>
                    {lang === 'fr' ? 'Référence client' : 'Client reference'}
                    <input
                      value={clientCode}
                      onChange={(event) => setClientCode(event.target.value)}
                      placeholder="CS-2481"
                    />
                  </label>
                  <label>
                    {lang === 'fr' ? 'Courriel ou téléphone' : 'Email or phone'}
                    <input
                      value={clientContact}
                      onChange={(event) => setClientContact(event.target.value)}
                      placeholder="marie@example.com"
                    />
                  </label>
                  <button className="button" type="submit">
                    {lang === 'fr' ? 'Ouvrir le portail' : 'Open portal'}
                  </button>
                </form>
                <div className="portal-preview">
                  <strong>
                    {portalRecord?.quote.id ?? (lang === 'fr' ? 'Aperçu client' : 'Client preview')}
                  </strong>
                  {portalRecord ? (
                    <>
                      <p>Statut: {portalRecord.quote.status}</p>
                      <p>Service: {portalRecord.quote.service} - {portalRecord.quote.city}</p>
                      <p>Adresse: {portalRecord.quote.address}</p>
                      <p>
                        {lang === 'fr' ? 'Soumission avant: ' : 'Quote by: '}
                        {new Date(portalRecord.quote.quoteDueAt).toLocaleDateString('fr-CA')}
                      </p>
                      <p>
                        {portalRecord.reports.length > 0
                          ? lang === 'fr'
                            ? 'Rapport disponible'
                            : 'Report available'
                          : lang === 'fr'
                            ? 'Aucun rapport encore'
                            : 'No report yet'}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>{lang === 'fr' ? 'Exemple: CS-2481 + marie@example.com' : 'Example: CS-2481 + marie@example.com'}</p>
                      <p>{portalMessage || (lang === 'fr' ? 'Consultez votre statut après soumission.' : 'Check your status after submission.')}</p>
                    </>
                  )}
                  <a className="button button-secondary" href="/portail">
                    {lang === 'fr' ? 'Ouvrir la page portail' : 'Open portal page'}
                  </a>
                </div>
              </div>
            )}

            {activePortalTab === 'quote' && (
              <div className="quote-module">
                <div>
                  <h3>{lang === 'fr' ? 'Soumission en ligne sous 24h' : 'Online quote within 24h'}</h3>
                  <p>
                    {lang === 'fr'
                      ? 'Le formulaire prépare la demande par courriel, et les boutons ci-dessous ouvrent directement SMS ou WhatsApp avec le bon numéro.'
                      : 'The form prepares the request by email, and the buttons below open SMS or WhatsApp directly with the right number.'}
                  </p>
                </div>
                <div className="quick-contact">
                  <a className="button" href={whatsappHref} target="_blank" rel="noreferrer">
                    WhatsApp {contactPhoneDisplay}
                  </a>
                  <a className="button button-secondary" href={`sms:${contactPhoneHref}`}>
                    SMS {contactPhoneDisplay}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="areas" className="section split-section">
        <div>
          <p className="eyebrow">Ottawa - Gatineau</p>
          <h2>{c.zonesTitle}</h2>
          <p>{c.zonesText}</p>
        </div>
        <div className="area-list">
          {areas.map((area) => (
            <span key={area}>{area}</span>
          ))}
        </div>
      </section>

      <section id="reviews" className="section section-dark">
        <div className="section-heading">
          <p className="eyebrow">Avis</p>
          <h2>{c.reviewsTitle}</h2>
        </div>
        <div className="review-grid">
          {reviews.map((review) => (
            <article key={review.name}>
              <div className="review-stars" aria-label="5 étoiles">
                ★★★★★
              </div>
              <p>{review.text[lang]}</p>
              <div className="review-author">
                <Image src={review.image} alt="" width={56} height={56} />
                <div>
                  <strong>{review.name}</strong>
                  <span>{review.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="booking" className="booking-section">
        <div className="booking-copy">
          <p className="eyebrow">Contact</p>
          <h2>{c.bookingTitle}</h2>
          <p>{c.bookingText}</p>
          <div className="contact-lines">
            <a href={`tel:${contactPhoneHref}`}>{contactPhoneDisplay}</a>
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp {contactPhoneDisplay}
            </a>
            <a href="mailto:info@cleaningsol.ca">info@cleaningsol.ca</a>
          </div>
        </div>
        <form className="quote-form" onSubmit={submitEstimate} noValidate>
          <div className="quote-stepper full" aria-label="Etapes du questionnaire">
            {quoteSteps.map((step, index) => (
              <span className={index <= quoteStep ? 'active' : ''} key={step}>
                <span>{index + 1}</span>
                {step}
              </span>
            ))}
          </div>
          <fieldset className={`quote-step ${quoteStep === 0 ? 'active' : ''}`}>
          <div className="quote-form-intro full">
            <span>1</span>
            <div>
              <strong>Coordonnees</strong>
              <p>On confirme le dossier et on vous repond sous 24h.</p>
            </div>
          </div>
          <label>
            Nom
            <input name="name" required placeholder="Marie Dupont" />
          </label>
          <label>
            Courriel
            <input name="email" type="email" required placeholder="marie@exemple.com" />
          </label>
          <label>
            Téléphone
            <input name="phone" type="tel" required placeholder={contactPhoneDisplay} />
          </label>
          </fieldset>
          <fieldset className={`quote-step ${quoteStep === 1 ? 'active' : ''}`}>
          <div className="quote-form-intro full">
            <span>2</span>
            <div>
              <strong>Lieu et moment souhaite</strong>
              <p>On garde votre date par defaut, sauf si on doit l&apos;ajuster avec vous.</p>
            </div>
          </div>
          <label className="full">
            Adresse complète
            <input name="address" required placeholder="123 rue Principale, app. 4" />
          </label>
          <label>
            Service
            <select name="service" required defaultValue="">
              <option value="" disabled>
                Choisir un service
              </option>
              <option>Résidentiel</option>
              <option>Commercial</option>
              <option>Après travaux</option>
              <option>Grand ménage</option>
            </select>
          </label>
          <label>
            Ville
            <input name="city" required placeholder="Ottawa, Gatineau..." />
          </label>
          <label>
            Date souhaitée
            <input name="preferredDate" type="date" />
          </label>
          <label>
            Heure souhaitée
            <input name="preferredTime" type="time" />
          </label>
          </fieldset>
          <fieldset className={`quote-step ${quoteStep === 2 ? 'active' : ''}`}>
          <div className="quote-form-intro full">
            <span>3</span>
            <div>
              <strong>Details pour une estimation juste</strong>
              <p>Ces infos evitent les prix approximatifs et les allers-retours inutiles.</p>
            </div>
          </div>
          <label>
            Type de lieu
            <select name="propertyType" defaultValue="">
              <option value="">A confirmer</option>
              <option>Appartement</option>
              <option>Condo</option>
              <option>Maison</option>
              <option>Bureau</option>
              <option>Commerce</option>
            </select>
          </label>
          <label>
            Superficie approx.
            <select name="spaceSize" defaultValue="">
              <option value="">A confirmer</option>
              <option>Moins de 800 pi2</option>
              <option>800-1500 pi2</option>
              <option>1500-2500 pi2</option>
              <option>2500 pi2 et plus</option>
            </select>
          </label>
          <label>
            Etat actuel
            <select name="currentCondition" defaultValue="">
              <option value="">A confirmer</option>
              <option>Leger</option>
              <option>Normal</option>
              <option>Tres sale</option>
              <option>Apres renovation</option>
              <option>Apres demenagement</option>
            </select>
          </label>
          <label>
            Frequence souhaitee
            <select name="frequency" defaultValue="">
              <option value="">A confirmer</option>
              <option>Une fois</option>
              <option>Chaque semaine</option>
              <option>Aux 2 semaines</option>
              <option>Chaque mois</option>
            </select>
          </label>
          <label>
            Chambres
            <input name="bedrooms" inputMode="numeric" placeholder="Ex: 3" />
          </label>
          <label>
            Salles de bain
            <input name="bathrooms" inputMode="numeric" placeholder="Ex: 2" />
          </label>
          <label>
            Pieces au total
            <input name="rooms" inputMode="numeric" placeholder="Ex: 7" />
          </label>
          <fieldset className="quote-options full">
            <legend>Options speciales</legend>
            {['Four', 'Frigo', 'Vitres interieures', 'Armoires', 'Tapis', 'Murs', 'Animaux sur place'].map((option) => (
              <label key={option}>
                <input name="extras" type="checkbox" value={option} />
                <span>{option}</span>
              </label>
            ))}
          </fieldset>
          </fieldset>
          <fieldset className={`quote-step ${quoteStep === 3 ? 'active' : ''}`}>
          <div className="quote-form-intro quote-final-intro full">
            <span>4</span>
            <div>
              <strong>Derniere verification</strong>
              <p>Les photos sont optionnelles. Vous pouvez envoyer la demande maintenant.</p>
            </div>
          </div>
          <details className="quote-photo-details full">
            <summary>Ajouter des photos des pieces</summary>
            <div>
              <label>
                Prendre une photo
                <input name="roomPhotos" type="file" accept="image/*" capture="environment" />
              </label>
              <label>
                Charger depuis la galerie
                <input name="roomPhotos" type="file" accept="image/*" multiple />
              </label>
            </div>
          </details>
          <label className="full quote-clean-field">
            Acces / stationnement
            <input name="accessNotes" placeholder="Code, etage, ascenseur, animaux..." />
          </label>
          <label className="full quote-clean-field">
            Détails
            <textarea name="message" rows={5} placeholder="Surface, fréquence, date souhaitée..." />
          </label>
          </fieldset>
          {formError && <p className="form-status error">{formError}</p>}
          <div className="quote-form-actions full">
            <button className="button button-secondary" type="button" onClick={previousQuoteStep} disabled={quoteStep === 0 || loading}>
              Precedent
            </button>
            {quoteStep < quoteSteps.length - 1 ? (
              <button className="button" type="button" onClick={nextQuoteStep} disabled={loading}>
                Suivant
              </button>
            ) : (
              <button className="button" type="submit" disabled={loading}>
                {loading ? c.sending : c.submit}
              </button>
            )}
          </div>
          {sent && (
            <div className="form-status quote-confirmation">
              <span className="confirmation-kicker">Numéro de soumission</span>
              <strong className="quote-reference">{quoteReference}</strong>
              <span>Gardez ce numéro: il sert à suivre votre dossier dans le portail client.</span>
              <span className="email-status">
                {confirmationEmailSent
                  ? 'Un courriel de confirmation avec ce numéro vient aussi de vous être envoyé.'
                  : `Le dossier est cree, mais le courriel n est pas parti: ${confirmationEmailReason || 'configuration email a verifier'}.`}
              </span>
              <div className="confirmation-actions">
                <button className="button button-small" type="button" onClick={copyQuoteReference}>
                  {quoteCopied ? 'Copié' : 'Copier le numéro'}
                </button>
                <Link className="button button-secondary button-small" href={`/portail?reference=${encodeURIComponent(quoteReference)}`}>
                  Suivre mon dossier
                </Link>
              </div>
            </div>
          )}
        </form>
      </section>

      <section id="faq" className="section faq-section">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>{c.faqTitle}</h2>
          <p>{c.faqText}</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question.fr} className="faq-item">
              <summary>{faq.question[lang]}</summary>
              <p>{faq.answer[lang]}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>Cleaning Sol</strong>
          <p>{c.footer}</p>
        </div>
        <div className="footer-actions">
          <Link className="button button-secondary button-small" href="/admin">
            Admin
          </Link>
          <Link className="button button-secondary button-small" href="/intervenant">
            Intervenant
          </Link>
        </div>
        <span>© 2026 Cleaning Sol. {c.rights}</span>
      </footer>
    </main>
  );
}
