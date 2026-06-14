'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type CSSProperties, FormEvent, Suspense, useMemo, useState } from 'react';

type QuoteStatus = 'new' | 'reviewing' | 'quoted' | 'accepted' | 'scheduled' | 'completed';

type PortalQuote = {
  id: string;
  createdAt: string;
  quoteDueAt: string;
  status: QuoteStatus;
  name: string;
  email: string;
  phone: string;
  service: string;
  address: string;
  city: string;
  message: string;
  preferredDate?: string;
  preferredTime?: string;
  propertyType?: string;
  spaceSize?: string;
  bedrooms?: string;
  bathrooms?: string;
  rooms?: string;
  currentCondition?: string;
  frequency?: string;
  extras?: string;
  accessNotes?: string;
  roomPhotos?: string[];
  estimate?: string;
  nextVisit?: string;
};

type PortalReport = {
  id: string;
  title: string;
  status: string;
  checklist: string[];
  notes: string;
  beforeImage?: string;
  afterImage?: string;
};

type PortalSession = {
  quotes: PortalQuote[];
  quote: PortalQuote;
  reports: PortalReport[];
};

const steps: Array<{ key: string; label: string; icon: string; statuses: QuoteStatus[] }> = [
  { key: 'request', label: 'Demande', icon: '✨', statuses: ['new', 'reviewing'] },
  { key: 'quote', label: 'Soumission', icon: '💬', statuses: ['quoted', 'accepted'] },
  { key: 'work', label: 'Travail', icon: '📅', statuses: ['scheduled', 'completed'] },
];

const statusLabels: Record<QuoteStatus, string> = {
  new: 'Demande reçue',
  reviewing: 'En analyse',
  quoted: 'Soumission envoyée',
  accepted: 'Soumission acceptée',
  scheduled: 'Travail planifié',
  completed: 'Travail terminé',
};

function progressValue(status: QuoteStatus) {
  const index = Math.max(0, steps.findIndex((step) => step.statuses.includes(status)));
  return String(index / (steps.length - 1));
}

export default function ClientPortalPage() {
  return (
    <Suspense>
      <ClientPortalContent />
    </Suspense>
  );
}

function ClientPortalContent() {
  const searchParams = useSearchParams();
  const [reference, setReference] = useState(() => searchParams.get('reference') ?? '');
  const [contact, setContact] = useState('');
  const [session, setSession] = useState<PortalSession | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const activeQuote = session?.quote ?? null;
  const currentStepIndex = useMemo(() => {
    if (!activeQuote) return 0;
    return Math.max(0, steps.findIndex((step) => step.statuses.includes(activeQuote.status)));
  }, [activeQuote]);

  async function loadPortal(nextReference = reference) {
    setLoading(true);
    setMessage('');
    setSession(null);

    const res = await fetch('/api/client-portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference: nextReference, contact }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message ?? 'Dossier introuvable.');
    } else {
      setSession({ quotes: data.quotes ?? [data.quote], quote: data.quote, reports: data.reports });
      setReference(data.quote.id);
    }
    setLoading(false);
  }

  async function openPortal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadPortal(reference);
  }

  async function selectQuote(quoteId: string) {
    setReference(quoteId);
    await loadPortal(quoteId);
  }

  async function acceptEstimate() {
    if (!activeQuote) return;
    setAccepting(true);
    setMessage('');

    const res = await fetch('/api/client-portal/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference: activeQuote.id, contact }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message ?? 'Impossible d accepter la soumission.');
    } else {
      setSession((current) => {
        if (!current) return current;
        const nextQuote = data.quote as PortalQuote;
        return {
          ...current,
          quote: nextQuote,
          quotes: current.quotes.map((quote) => (quote.id === nextQuote.id ? nextQuote : quote)),
        };
      });
      setMessage('Soumission acceptée. Nous allons planifier le travail.');
    }
    setAccepting(false);
  }

  return (
    <main className="portal-page client-page">
      <div className="manager-topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">CS</span>
          <span>Cleaning Sol</span>
        </Link>
        <a className="button button-secondary button-small" href="https://wa.me/15145704038" target="_blank" rel="noreferrer">
          WhatsApp
        </a>
      </div>

      <section className="portal-hero client-hero">
        <div>
          <p className="eyebrow">Portail client</p>
          <h1>Toutes vos soumissions au même endroit.</h1>
          <p>
            Identifiez-vous avec votre courriel ou téléphone. Le numéro de soumission reste utile
            pour ouvrir un dossier précis, mais il n&apos;est plus obligatoire.
          </p>
        </div>
        <form className="portal-login client-login" onSubmit={openPortal}>
          <label>
            Courriel ou téléphone
            <input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="marie@example.com" required />
          </label>
          <label>
            Numéro de soumission optionnel
            <input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="CS-2026-ABCD" />
          </label>
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Recherche...' : 'Accéder à mon espace'}
          </button>
          {message && <p className="form-status">{message}</p>}
        </form>
      </section>

      {session && activeQuote && (
        <section className="client-dashboard">
          <aside className="client-quotes-panel">
            <div>
              <p className="eyebrow">Mes soumissions</p>
              <h2>{session.quotes.length} dossier{session.quotes.length > 1 ? 's' : ''}</h2>
            </div>
            <div className="client-quote-list">
              {session.quotes.map((quote) => (
                <button
                  className={quote.id === activeQuote.id ? 'active' : ''}
                  disabled={loading}
                  key={quote.id}
                  onClick={() => selectQuote(quote.id)}
                  type="button"
                >
                  <span>{quote.id}</span>
                  <strong>🧼 {quote.service}</strong>
                  <small>{statusLabels[quote.status]} - {quote.city}</small>
                </button>
              ))}
            </div>
          </aside>

          <article className="client-status-card">
            <div>
              <p className="eyebrow">{activeQuote.id}</p>
              <h2>{statusLabels[activeQuote.status]}</h2>
              <p>
                Soumission demandée le {new Date(activeQuote.createdAt).toLocaleDateString('fr-CA')}.
                Réponse prévue avant le {new Date(activeQuote.quoteDueAt).toLocaleDateString('fr-CA')}.
              </p>
            </div>
            <div
              className="client-stepper"
              aria-label="Progression de la soumission"
              style={{ '--pipeline-progress': progressValue(activeQuote.status) } as CSSProperties}
            >
              {steps.map((step, index) => (
                <span key={step.key} className={index <= currentStepIndex ? 'done' : ''}>
                  <span aria-hidden="true">{step.icon}</span>
                  {step.label}
                </span>
              ))}
            </div>
          </article>

          <section className="client-info-grid">
            <article>
              <span>🧼 Service</span>
              <strong>{activeQuote.service}</strong>
              <p>{activeQuote.city}</p>
            </article>
            <article>
              <span>📍 Adresse</span>
              <strong>{activeQuote.address}</strong>
              <p>{activeQuote.city}</p>
            </article>
            <article>
              <span>🕒 Date souhaitée</span>
              <strong>{activeQuote.preferredDate ?? 'À confirmer'}</strong>
              <p>{activeQuote.preferredTime ?? 'Heure à confirmer'}</p>
            </article>
            <article className="client-price-card">
              <span>💵 Prix proposé</span>
              <strong>{activeQuote.estimate ?? 'En préparation'}</strong>
              <p>{activeQuote.nextVisit ? `Prochaine visite: ${activeQuote.nextVisit}` : 'Nous vous répondons sous 24h.'}</p>
            </article>
          </section>

          <section className="estimate-brief client-estimate-brief">
            <div>
              <span>Type</span>
              <strong>{activeQuote.propertyType || activeQuote.service}</strong>
            </div>
            <div>
              <span>Surface</span>
              <strong>{activeQuote.spaceSize || 'A confirmer'}</strong>
            </div>
            <div>
              <span>Etat</span>
              <strong>{activeQuote.currentCondition || 'A confirmer'}</strong>
            </div>
            <div>
              <span>Frequence</span>
              <strong>{activeQuote.frequency || 'A confirmer'}</strong>
            </div>
            <div>
              <span>Pieces</span>
              <strong>
                {[
                  activeQuote.bedrooms && `${activeQuote.bedrooms} ch.`,
                  activeQuote.bathrooms && `${activeQuote.bathrooms} sdb`,
                  activeQuote.rooms && `${activeQuote.rooms} pieces`,
                ]
                  .filter(Boolean)
                  .join(' / ') || 'A confirmer'}
              </strong>
            </div>
            <div>
              <span>Options</span>
              <strong>{activeQuote.extras || 'Aucune option'}</strong>
            </div>
          </section>

          {activeQuote.roomPhotos && activeQuote.roomPhotos.length > 0 && (
            <section className="room-photo-strip client-room-photo-strip">
              <span>Photos transmises</span>
              <div>
                {activeQuote.roomPhotos.map((photo, index) => (
                  <Image alt="" height={130} key={`${activeQuote.id}-room-${index}`} src={photo} unoptimized width={190} />
                ))}
              </div>
            </section>
          )}

          {activeQuote.estimate && activeQuote.status === 'quoted' && (
            <article className="client-action-card">
              <div>
                <span>✅ Validation client</span>
                <h2>Accepter cette estimation</h2>
                <p>Après acceptation, l&apos;équipe pourra planifier le travail et assigner un intervenant.</p>
              </div>
              <button className="button" type="button" disabled={accepting} onClick={acceptEstimate}>
                {accepting ? 'Acceptation...' : 'Accepter le prix'}
              </button>
            </article>
          )}

          <details className="client-message-card collapsible-panel">
            <summary>
              <span className="panel-icon">📝</span>
              <span>Détails transmis</span>
            </summary>
            <p>{activeQuote.message || 'Aucun détail supplémentaire.'}</p>
          </details>

          {session.reports.length > 0 ? (
            session.reports.map((report) => (
              <article className="portal-report client-report" key={report.id}>
                <div>
                  <p className="eyebrow">{report.status}</p>
                  <h2>{report.title}</h2>
                  <p>{report.notes}</p>
                  <ul className="check-list">
                    {report.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                {report.beforeImage && report.afterImage && (
                  <div className="portal-photo-grid">
                    <div>
                      <Image src={report.beforeImage} alt="" width={520} height={320} unoptimized />
                      <strong>Avant</strong>
                    </div>
                    <div>
                      <Image src={report.afterImage} alt="" width={520} height={320} unoptimized />
                      <strong>Après</strong>
                    </div>
                  </div>
                )}
              </article>
            ))
          ) : (
            <article className="client-empty-report">
              <h2>Aucun rapport pour le moment</h2>
              <p>Le rapport et les photos seront disponibles ici après l&apos;intervention.</p>
            </article>
          )}
        </section>
      )}
    </main>
  );
}
