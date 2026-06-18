'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type CSSProperties, FormEvent, useMemo, useState } from 'react';

type QuoteStatus = 'new' | 'reviewing' | 'quoted' | 'accepted' | 'scheduled' | 'completed';

type Quote = {
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
  assignedWorkerName?: string;
  assignedWorkerCode?: string;
  workerPay?: string;
};

type Worker = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  code: string;
  active: boolean;
};

type QuoteNotification = {
  id: string;
  quoteId: string;
  createdAt: string;
  audience: 'admin' | 'client' | 'all';
  title: string;
  message: string;
  tone: 'info' | 'success' | 'warning';
};

type AdminTab = 'dossiers' | 'planning' | 'equipe';
type DossierFilter = 'active' | 'history';

const statusLabels: Record<QuoteStatus, string> = {
  new: 'Nouvelle',
  reviewing: 'En analyse',
  quoted: 'Soumission envoyée',
  accepted: 'Acceptée par le client',
  scheduled: 'Travail planifié',
  completed: 'Terminé',
};

const statusIcons: Record<QuoteStatus, string> = {
  new: '✨',
  reviewing: '🔎',
  quoted: '💬',
  accepted: '✅',
  scheduled: '📅',
  completed: '🏁',
};

const pipelineSteps: Array<{ key: string; label: string; icon: string; statuses: QuoteStatus[] }> = [
  { key: 'request', label: 'Demande', icon: '✨', statuses: ['new', 'reviewing'] },
  { key: 'quote', label: 'Soumission', icon: '💬', statuses: ['quoted', 'accepted'] },
  { key: 'work', label: 'Travail', icon: '📅', statuses: ['scheduled', 'completed'] },
];

function formatDate(value?: string) {
  if (!value) return 'À confirmer';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'À confirmer';
  return date.toLocaleDateString('fr-CA', { day: '2-digit', month: 'short', year: 'numeric' });
}

function scheduleDate(quote: Quote) {
  if (quote.nextVisit) return quote.nextVisit.slice(0, 10);
  return quote.preferredDate;
}

function preferredDateTime(quote: Quote) {
  if (!quote.preferredDate) return '';
  const time = quote.preferredTime ? quote.preferredTime.slice(0, 5) : '09:00';
  return `${quote.preferredDate}T${time}`;
}

function scheduleTime(quote: Quote) {
  if (quote.nextVisit) return quote.nextVisit.slice(11, 16);
  if (quote.preferredTime) return quote.preferredTime.slice(0, 5);
  return '';
}

function pipelineProgress(status: QuoteStatus) {
  const index = Math.max(0, pipelineSteps.findIndex((step) => step.statuses.includes(status)));
  return String(index / (pipelineSteps.length - 1));
}

function pipelineHint(quote: Quote) {
  if (quote.status === 'new') return 'Demande a qualifier';
  if (quote.status === 'reviewing') return 'Estimation a preparer';
  if (quote.status === 'quoted') return 'En attente du client';
  if (quote.status === 'accepted') return 'Assigner un intervenant';
  if (quote.status === 'scheduled') return 'Travail a realiser';
  return 'Rapport envoye';
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'CL';
}

export default function AdminPage() {
  const [code, setCode] = useState('');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [notifications, setNotifications] = useState<QuoteNotification[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [search, setSearch] = useState('');
  const [dossierFilter, setDossierFilter] = useState<DossierFilter>('active');
  const [estimate, setEstimate] = useState('');
  const [nextVisit, setNextVisit] = useState('');
  const [assignedWorkerName, setAssignedWorkerName] = useState('');
  const [assignedWorkerCode, setAssignedWorkerCode] = useState('');
  const [workerPay, setWorkerPay] = useState('');
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerPhone, setNewWorkerPhone] = useState('');
  const [newWorkerEmail, setNewWorkerEmail] = useState('');
  const [newWorkerCode, setNewWorkerCode] = useState('');
  const [showClientInfo, setShowClientInfo] = useState(false);
  const [showTreatment, setShowTreatment] = useState(false);
  const [showQuoteActions, setShowQuoteActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [fullscreenPhoto, setFullscreenPhoto] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dossiers');
  const [saving, setSaving] = useState(false);
  const [creatingWorker, setCreatingWorker] = useState(false);

  const selectedQuote = quotes.find((quote) => quote.id === selectedId) ?? quotes[0];
  const selectedNotifications = useMemo(() => {
    if (!selectedQuote) return [];
    return notifications.filter((notification) => notification.quoteId === selectedQuote.id).slice(0, 4);
  }, [notifications, selectedQuote]);
  const recentNotifications = useMemo(() => notifications.slice(0, 6), [notifications]);

  const filteredQuotes = useMemo(() => {
    const term = search.toLowerCase().trim();

    return quotes.filter((quote) => {
      const dossierMatches =
        (dossierFilter === 'active' && quote.status !== 'completed') ||
        (dossierFilter === 'history' && quote.status === 'completed');
      const searchMatches =
        !term ||
        [
          quote.id,
          quote.name,
          quote.email,
          quote.phone,
          quote.service,
          quote.city,
          quote.address,
          quote.assignedWorkerName,
          quote.propertyType,
          quote.spaceSize,
          quote.currentCondition,
          quote.frequency,
          quote.extras,
        ]
          .join(' ')
          .toLowerCase()
          .includes(term);

      return dossierMatches && searchMatches;
    });
  }, [quotes, search, dossierFilter]);

  const dossierCounts = useMemo(() => {
    return {
      active: quotes.filter((quote) => quote.status !== 'completed').length,
      history: quotes.filter((quote) => quote.status === 'completed').length,
    };
  }, [quotes]);

  const calendarItems = useMemo(() => {
    return [...quotes]
      .filter((quote) => quote.status !== 'completed' && scheduleDate(quote))
      .sort((a, b) => String(scheduleDate(a)).localeCompare(String(scheduleDate(b))))
      .slice(0, 12);
  }, [quotes]);

  function syncEditor(quote: Quote) {
    setSelectedId(quote.id);
    setShowClientInfo(false);
    setShowTreatment(false);
    setShowQuoteActions(false);
    setEstimate(quote.estimate ?? '');
    setNextVisit(quote.nextVisit || preferredDateTime(quote));
    setAssignedWorkerName(quote.assignedWorkerName ?? '');
    setAssignedWorkerCode(quote.assignedWorkerCode ?? '');
    setWorkerPay(quote.workerPay ?? '');
  }

  function assignWorker(workerCode: string) {
    const worker = workers.find((item) => item.code === workerCode);
    if (!worker) {
      setAssignedWorkerName('');
      setAssignedWorkerCode('');
      return;
    }

    setAssignedWorkerName(worker.name);
    setAssignedWorkerCode(worker.code);
  }

  async function loadManager(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const [quotesRes, workersRes] = await Promise.all([
      fetch(`/api/admin/quotes?code=${encodeURIComponent(code)}`),
      fetch(`/api/admin/workers?code=${encodeURIComponent(code)}`),
    ]);
    const quotesData = await quotesRes.json();
    const workersData = await workersRes.json();

    if (!quotesRes.ok) {
      setMessage(quotesData.message ?? 'Accès refusé');
      setQuotes([]);
      setWorkers([]);
      setNotifications([]);
    } else {
      setQuotes(quotesData.quotes);
      setWorkers(workersRes.ok ? workersData.workers : []);
      setNotifications(quotesData.notifications ?? []);
      const firstActive = quotesData.quotes.find((quote: Quote) => quote.status !== 'completed');
      if (firstActive ?? quotesData.quotes[0]) syncEditor(firstActive ?? quotesData.quotes[0]);
    }
    setLoading(false);
  }

  async function createWorker(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatingWorker(true);
    setMessage('');

    const res = await fetch('/api/admin/workers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adminCode: code,
        name: newWorkerName,
        phone: newWorkerPhone,
        email: newWorkerEmail,
        code: newWorkerCode,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message ?? 'Impossible d ajouter l intervenant.');
    } else {
      setWorkers((current) => [data.worker, ...current]);
      setNewWorkerName('');
      setNewWorkerPhone('');
      setNewWorkerEmail('');
      setNewWorkerCode('');
      setMessage('Intervenant ajouté.');
    }
    setCreatingWorker(false);
  }

  async function saveQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedQuote) return;

    setSaving(true);
    setMessage('');

    const res = await fetch(`/api/admin/quotes/${selectedQuote.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        estimate,
        nextVisit,
        assignedWorkerName,
        assignedWorkerCode,
        workerPay,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message ?? 'Impossible de sauvegarder.');
    } else {
      setQuotes((current) =>
        current.map((quote) => (quote.id === data.quote.id ? data.quote : quote)),
      );
      if (data.email?.sent) {
        setMessage('Soumission mise à jour. Courriel envoyé au client.');
      } else if (data.email && !data.email.sent) {
        setMessage(`Soumission mise à jour, mais le courriel n est pas parti: ${data.email.reason ?? 'configuration email a verifier'}.`);
      } else {
        setMessage('Soumission mise à jour.');
      }
      if (data.notifications) setNotifications(data.notifications);
    }
    setSaving(false);
  }

  async function completeQuote() {
    if (!selectedQuote) return;

    setSaving(true);
    setMessage('');

    const res = await fetch(`/api/admin/quotes/${selectedQuote.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, status: 'completed' }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message ?? 'Impossible de terminer la demande.');
    } else {
      setQuotes((current) => current.map((quote) => (quote.id === data.quote.id ? data.quote : quote)));
      syncEditor(data.quote);
      setDossierFilter('history');
      if (data.notifications) setNotifications(data.notifications);
      setShowQuoteActions(false);
      setMessage("Demande placée dans l'historique.");
    }
    setSaving(false);
  }

  async function deleteSelectedQuote() {
    if (!selectedQuote) return;
    const confirmed = window.confirm(`Supprimer définitivement la demande ${selectedQuote.id} ?`);
    if (!confirmed) return;

    setSaving(true);
    setMessage('');

    const res = await fetch(`/api/admin/quotes/${selectedQuote.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message ?? 'Impossible de supprimer la demande.');
    } else {
      const remaining = quotes.filter((quote) => quote.id !== selectedQuote.id);
      setNotifications((current) => current.filter((notification) => notification.quoteId !== selectedQuote.id));
      const next =
        remaining.find((quote) =>
          dossierFilter === 'active' ? quote.status !== 'completed' : quote.status === 'completed',
        ) ?? remaining[0];

      setQuotes(remaining);
      if (next) syncEditor(next);
      else setSelectedId('');
      setShowQuoteActions(false);
      setMessage('Demande supprimée.');
    }
    setSaving(false);
  }

  return (
    <main className="admin-page manager-page">
      <div className="manager-topbar">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-sun" />
            <span className="brand-shine" />
          </span>
          <span>Cleaning Sol Manager</span>
        </Link>
        <div className="manager-nav-actions">
          <div className="admin-notification-menu">
            <button
              aria-expanded={showNotifications}
              aria-label="Notifications admin"
              className="notification-bubble-button"
              onClick={() => setShowNotifications((current) => !current)}
              type="button"
            >
              <span aria-hidden="true">!</span>
              {notifications.length > 0 && <strong>{notifications.length}</strong>}
            </button>
            {showNotifications && (
              <div className="admin-notification-popover">
                <div className="notification-feed-head">
                  <span>Notifications</span>
                  <strong>{notifications.length}</strong>
                </div>
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notification) => (
                    <button
                      className={`notification-item notification-item-compact tone-${notification.tone}`}
                      key={notification.id}
                      onClick={() => {
                        const quote = quotes.find((item) => item.id === notification.quoteId);
                        if (quote) syncEditor(quote);
                        else setSelectedId(notification.quoteId);
                        setActiveTab('dossiers');
                        setShowNotifications(false);
                      }}
                      type="button"
                    >
                      <strong>{notification.title}</strong>
                      <span>{notification.message} · {new Date(notification.createdAt).toLocaleDateString('fr-CA')}</span>
                    </button>
                  ))
                ) : (
                  <p className="notification-empty">Aucune notification pour le moment.</p>
                )}
              </div>
            )}
          </div>
          <Link className="button button-secondary button-small" href="/portail">
            Portail client
          </Link>
          <Link className="button button-secondary button-small" href="/intervenant">
            Espace intervenant
          </Link>
        </div>
      </div>

      <section className="admin-panel manager-hero">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Soumissions, intervenants et travaux</h1>
          <p>
            Connecte-toi avec le code manager, crée tes intervenants, planifie les travaux et
            assigne la bonne personne à chaque soumission.
          </p>
        </div>
        <form className="admin-login" onSubmit={loadManager}>
          <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Code manager" />
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Chargement...' : 'Ouvrir le manager'}
          </button>
        </form>
        {message && <p className={message.includes('Accès') ? 'form-status error' : 'form-status'}>{message}</p>}
      </section>

      {quotes.length > 0 && (
        <>
          <div className={`manager-view-tabs active-${activeTab}`} role="tablist" aria-label="Sections admin">
            <button aria-selected={activeTab === 'dossiers'} onClick={() => setActiveTab('dossiers')} role="tab" type="button">
              🗂️ Dossiers
            </button>
            <button aria-selected={activeTab === 'planning'} onClick={() => setActiveTab('planning')} role="tab" type="button">
              📅 Planning
            </button>
            <button aria-selected={activeTab === 'equipe'} onClick={() => setActiveTab('equipe')} role="tab" type="button">
              👥 Équipe
            </button>
          </div>

          {activeTab === 'dossiers' && (
          <section className="manager-workspace tab-panel-enter">
            <aside className="submission-list">
              <div className="manager-filters">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher client, intervenant, ville..."
                />
                <div className="dossier-filter" aria-label="Tri des dossiers">
                  <button className={dossierFilter === 'active' ? 'active' : ''} onClick={() => setDossierFilter('active')} type="button">
                    Actifs <span>{dossierCounts.active}</span>
                  </button>
                  <button className={dossierFilter === 'history' ? 'active' : ''} onClick={() => setDossierFilter('history')} type="button">
                    Historique <span>{dossierCounts.history}</span>
                  </button>
                </div>
              </div>

              {filteredQuotes.map((quote) => (
                <button
                  key={quote.id}
                  className={`submission-row status-border-${quote.status} ${selectedQuote?.id === quote.id ? 'active' : ''}`}
                  type="button"
                  onClick={() => syncEditor(quote)}
                >
                  <span className="submission-client">
                    <strong>{quote.name}</strong>
                    <small>{quote.id}</small>
                  </span>
                  <span className="submission-job">
                    <strong>🧼 {quote.service}</strong>
                    <small>📍 {scheduleDate(quote) ? `${formatDate(scheduleDate(quote))} ${scheduleTime(quote)}` : quote.city}</small>
                    <small>👤 {quote.assignedWorkerName || 'Intervenant non assigne'}</small>
                  </span>
                  <span className="submission-state">
                    <em className={`status-pill admin-status-${quote.status}`}>{statusIcons[quote.status]} {statusLabels[quote.status]}</em>
                    <small>{pipelineHint(quote)}</small>
                  </span>
                </button>
              ))}
            </aside>

            {selectedQuote && (
              <section className="submission-detail">
                <div className="detail-head">
                  <div className="detail-title">
                    <button
                      aria-expanded={showClientInfo}
                      className="client-avatar-button"
                      onClick={() => setShowClientInfo((current) => !current)}
                      title="Voir les informations client"
                      type="button"
                    >
                      {initials(selectedQuote.name)}
                    </button>
                    <div>
                    <strong>{selectedQuote.id}</strong>
                    <span>{selectedQuote.service} · {selectedQuote.city}</span>
                    </div>
                  </div>
                  <span className={`status-pill admin-status-${selectedQuote.status}`}>
                    {statusIcons[selectedQuote.status]} {statusLabels[selectedQuote.status]}
                  </span>
                  <div className="detail-actions">
                    <button
                      className="button button-secondary button-small"
                      onClick={() => setShowTreatment((current) => !current)}
                      type="button"
                    >
                      Modifier
                    </button>
                    <div className="quote-actions-menu">
                      <button
                        aria-expanded={showQuoteActions}
                        aria-label="Options de la demande"
                        className="icon-menu-button"
                        onClick={() => setShowQuoteActions((current) => !current)}
                        type="button"
                      >
                        ...
                      </button>
                      {showQuoteActions && (
                        <div className="quote-actions-popover">
                          {selectedQuote.status !== 'completed' && (
                            <button disabled={saving} onClick={completeQuote} type="button">
                              Mettre en historique
                            </button>
                          )}
                          <button className="danger-menu-item" disabled={saving} onClick={deleteSelectedQuote} type="button">
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {showClientInfo && (
                  <article className="client-private-panel">
                    <div>
                      <span>Client</span>
                      <strong>{selectedQuote.name}</strong>
                    </div>
                    <div>
                      <span>Courriel</span>
                      <strong>{selectedQuote.email}</strong>
                    </div>
                    <div>
                      <span>Téléphone</span>
                      <strong>{selectedQuote.phone}</strong>
                    </div>
                  </article>
                )}

                {selectedNotifications.length > 0 && (
                  <article className={`manager-live-alert tone-${selectedNotifications[0].tone}`}>
                    <span aria-hidden="true">{selectedNotifications[0].tone === 'success' ? '✓' : '!'}</span>
                    <div>
                      <strong>{selectedNotifications[0].title}</strong>
                      <small>{selectedNotifications[0].message}</small>
                    </div>
                  </article>
                )}

                <div
                  className="pipeline-bar"
                  aria-label="Pipeline de la demande"
                  style={{ '--pipeline-progress': pipelineProgress(selectedQuote.status) } as CSSProperties}
                >
                  {pipelineSteps.map((step, index) => {
                    const currentIndex = Math.max(0, pipelineSteps.findIndex((item) => item.statuses.includes(selectedQuote.status)));
                    return (
                      <span className={index <= currentIndex ? 'done' : ''} key={step.key}>
                        <span aria-hidden="true">{step.icon}</span>
                        {step.label}
                      </span>
                    );
                  })}
                </div>

                <div className="manager-quick-actions" aria-label="Actions rapides du dossier">
                  <button
                    className={showClientInfo ? 'active' : ''}
                    onClick={() => setShowClientInfo((current) => !current)}
                    type="button"
                  >
                    <span>{initials(selectedQuote.name)}</span>
                    Client
                  </button>
                  <button
                    onClick={() => setShowTreatment((current) => !current)}
                    type="button"
                  >
                    <span>$</span>
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      const firstPhoto = selectedQuote.roomPhotos?.[0];
                      if (firstPhoto) setFullscreenPhoto(firstPhoto);
                    }}
                    type="button"
                    disabled={!selectedQuote.roomPhotos?.length}
                  >
                    <span>{selectedQuote.roomPhotos?.length ?? 0}</span>
                    Photos
                  </button>
                </div>

                <div className="detail-grid manager-client-grid">
                  <article>
                    <span>📍 Adresse</span>
                    <strong>{selectedQuote.address}</strong>
                    <p>{selectedQuote.city}</p>
                  </article>
                  <article>
                    <span>🕒 Souhait client</span>
                    <strong>{formatDate(selectedQuote.preferredDate)}</strong>
                    <p>{selectedQuote.preferredTime || 'Heure à confirmer'}</p>
                  </article>
                  <article>
                    <span>👤 Intervenant</span>
                    <strong>{selectedQuote.assignedWorkerName || 'Non assigné'}</strong>
                    <p>{selectedQuote.workerPay ? `Paiement: ${selectedQuote.workerPay}` : 'Prix interne à définir'}</p>
                  </article>
                </div>

                <details className="manager-estimate-drawer collapsible-panel">
                  <summary>
                    <span className="panel-icon">↧</span>
                    <span>Infos estimation</span>
                  </summary>
                  <article className="estimate-brief">
                    <div>
                      <span>Type</span>
                      <strong>{selectedQuote.propertyType || selectedQuote.service}</strong>
                    </div>
                    <div>
                      <span>Surface</span>
                      <strong>{selectedQuote.spaceSize || 'A confirmer'}</strong>
                    </div>
                    <div>
                      <span>Etat</span>
                      <strong>{selectedQuote.currentCondition || 'A confirmer'}</strong>
                    </div>
                    <div>
                      <span>Frequence</span>
                      <strong>{selectedQuote.frequency || 'A confirmer'}</strong>
                    </div>
                    <div>
                      <span>Pieces</span>
                      <strong>
                        {[
                          selectedQuote.bedrooms && `${selectedQuote.bedrooms} ch.`,
                          selectedQuote.bathrooms && `${selectedQuote.bathrooms} sdb`,
                          selectedQuote.rooms && `${selectedQuote.rooms} pieces`,
                        ]
                          .filter(Boolean)
                          .join(' / ') || 'A confirmer'}
                      </strong>
                    </div>
                    <div>
                      <span>Options</span>
                      <strong>{selectedQuote.extras || 'Aucune option'}</strong>
                    </div>
                    <div>
                      <span>Acces</span>
                      <strong>{selectedQuote.accessNotes || 'A confirmer'}</strong>
                    </div>
                  </article>
                </details>

                {selectedQuote.roomPhotos && selectedQuote.roomPhotos.length > 0 && (
                  <details className="manager-photo-drawer collapsible-panel">
                    <summary>
                      <span className="panel-icon">{selectedQuote.roomPhotos.length}</span>
                      <span>Photos client</span>
                    </summary>
                    <article className="room-photo-strip">
                      <div>
                        {selectedQuote.roomPhotos.map((photo, index) => (
                          <button
                            aria-label={`Voir la photo ${index + 1} en plein écran`}
                            className="room-photo-button"
                            key={`${selectedQuote.id}-room-${index}`}
                            onClick={() => setFullscreenPhoto(photo)}
                            type="button"
                          >
                            <Image alt="" height={130} src={photo} unoptimized width={190} />
                          </button>
                        ))}
                      </div>
                    </article>
                  </details>
                )}

                <details className="manager-note collapsible-panel">
                  <summary>
                    <span className="panel-icon">i</span>
                    <span>Note</span>
                  </summary>
                  <p>{selectedQuote.message || 'Aucun détail supplémentaire.'}</p>
                </details>

                <details
                  className="manager-treatment-panel collapsible-panel"
                  onToggle={(event) => setShowTreatment(event.currentTarget.open)}
                  open={showTreatment}
                >
                  <summary>
                    <span className="panel-icon">⚙️</span>
                    <span>Traitement</span>
                  </summary>
                <form className="manager-edit-form manager-edit-form-wide" onSubmit={saveQuote}>
                  <label>
                    Estimation client
                    <input
                      value={estimate}
                      onChange={(event) => setEstimate(event.target.value)}
                      placeholder="Ex: 145 $ / visite"
                    />
                  </label>
                  <label>
                    Date et heure planifiées
                    <input
                      type="datetime-local"
                      value={nextVisit}
                      onChange={(event) => setNextVisit(event.target.value)}
                      placeholder={preferredDateTime(selectedQuote) || 'Ex: 2026-06-13T09:00'}
                    />
                  </label>
                  <label>
                    Choisir un intervenant
                    <select value={assignedWorkerCode} onChange={(event) => assignWorker(event.target.value)}>
                      <option value="">Non assigné</option>
                      {workers.map((worker) => (
                        <option key={worker.id} value={worker.code}>
                          {worker.name} - {worker.code}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Nom intervenant
                    <input
                      value={assignedWorkerName}
                      onChange={(event) => setAssignedWorkerName(event.target.value)}
                      placeholder="Ex: Samir"
                    />
                  </label>
                  <label>
                    Code intervenant
                    <input
                      value={assignedWorkerCode}
                      onChange={(event) => setAssignedWorkerCode(event.target.value)}
                      placeholder="Ex: SAMIR-01"
                    />
                  </label>
                  <label>
                    Prix pour cette tâche
                    <input
                      value={workerPay}
                      onChange={(event) => setWorkerPay(event.target.value)}
                      placeholder="Ex: 85 $"
                    />
                  </label>
                  <button className="button" type="submit" disabled={saving}>
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </form>
                </details>
              </section>
            )}
          </section>
          )}

          {activeTab === 'planning' && (
            <section className="manager-calendar tab-panel-enter">
              <div className="calendar-strip calendar-strip-roomy">
                {calendarItems.map((quote) => (
                  <button key={quote.id} type="button" onClick={() => {
                    syncEditor(quote);
                    setActiveTab('dossiers');
                  }}>
                    <span>{formatDate(scheduleDate(quote))}</span>
                    <strong>⏰ {scheduleTime(quote) || 'Heure à confirmer'}</strong>
                    <small>{quote.name} - {quote.city}</small>
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'equipe' && (
            <section className="manager-workers-panel tab-panel-enter">
              <form className="worker-create-form" onSubmit={createWorker}>
                <input value={newWorkerName} onChange={(event) => setNewWorkerName(event.target.value)} placeholder="Nom" required />
                <input value={newWorkerPhone} onChange={(event) => setNewWorkerPhone(event.target.value)} placeholder="Téléphone" required />
                <input value={newWorkerEmail} onChange={(event) => setNewWorkerEmail(event.target.value)} placeholder="Courriel optionnel" />
                <input value={newWorkerCode} onChange={(event) => setNewWorkerCode(event.target.value.toUpperCase())} placeholder="Code ex: SAMIR-01" required />
                <button className="button" type="submit" disabled={creatingWorker}>
                  {creatingWorker ? 'Ajout...' : 'Ajouter'}
                </button>
              </form>
              <div className="worker-list">
                {workers.map((worker) => (
                  <button key={worker.id} type="button" onClick={() => assignWorker(worker.code)}>
                    <span>{worker.code}</span>
                    <strong>{worker.name}</strong>
                    <small>{worker.phone}</small>
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}
      {fullscreenPhoto && (
        <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="Photo en plein écran">
          <button className="photo-lightbox-backdrop" aria-label="Fermer" onClick={() => setFullscreenPhoto('')} type="button" />
          <div className="photo-lightbox-content">
            <button className="photo-lightbox-close" onClick={() => setFullscreenPhoto('')} type="button">
              Fermer
            </button>
            <Image alt="" height={900} src={fullscreenPhoto} unoptimized width={1200} />
          </div>
        </div>
      )}
    </main>
  );
}
