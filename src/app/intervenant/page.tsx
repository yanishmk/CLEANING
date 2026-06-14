'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

type WorkerJob = {
  id: string;
  status: string;
  name: string;
  phone: string;
  service: string;
  address: string;
  city: string;
  message: string;
  preferredDate?: string;
  preferredTime?: string;
  nextVisit?: string;
  assignedWorkerName?: string;
  workerPay?: string;
};

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function WorkerPage() {
  const [code, setCode] = useState('');
  const [jobs, setJobs] = useState<WorkerJob[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedJob = jobs.find((job) => job.id === selectedId) ?? jobs[0];

  async function loadJobs(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch(`/api/worker/jobs?code=${encodeURIComponent(code)}`);
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message ?? 'Code intervenant invalide.');
      setJobs([]);
    } else {
      setJobs(data.jobs);
      setSelectedId(data.jobs[0]?.id ?? '');
      setMessage(data.jobs.length ? '' : 'Aucun travail assigné pour ce code.');
    }
    setLoading(false);
  }

  async function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedJob) return;
    setSaving(true);
    setMessage('');

    const form = event.currentTarget;
    const data = new FormData(form);
    const beforeFile = data.get('beforeImage');
    const afterFile = data.get('afterImage');

    const beforeImage = beforeFile instanceof File && beforeFile.size ? await fileToDataUrl(beforeFile) : '';
    const afterImage = afterFile instanceof File && afterFile.size ? await fileToDataUrl(afterFile) : '';

    const res = await fetch('/api/worker/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        quoteId: selectedJob.id,
        title: data.get('title'),
        checklist: data.get('checklist'),
        notes: data.get('notes'),
        beforeImage,
        afterImage,
      }),
    });
    const result = await res.json();

    if (!res.ok) {
      setMessage(result.message ?? 'Impossible d envoyer le rapport.');
    } else {
      setJobs((current) =>
        current.map((job) => (job.id === selectedJob.id ? { ...job, status: 'completed' } : job)),
      );
      form.reset();
      setMessage('Rapport envoyé. Le client peut maintenant voir les photos.');
    }
    setSaving(false);
  }

  return (
    <main className="portal-page worker-page">
      <div className="manager-topbar">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-sun" />
            <span className="brand-shine" />
          </span>
          <span>Cleaning Sol Intervenant</span>
        </Link>
        <Link className="button button-secondary button-small" href="/admin">
          Manager
        </Link>
      </div>

      <section className="portal-hero worker-hero">
        <div>
          <p className="eyebrow">Espace intervenant</p>
          <h1>Travaux assignés et rapports photo.</h1>
          <p>
            Entrez votre code intervenant pour voir vos travaux, le montant prévu, puis envoyer le
            rapport avec photos avant/après.
          </p>
        </div>
        <form className="portal-login" onSubmit={loadJobs}>
          <label>
            Code intervenant
            <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="SAMIR-2481" required />
          </label>
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Chargement...' : 'Voir mes travaux'}
          </button>
          {message && <p className="form-status">{message}</p>}
        </form>
      </section>

      {jobs.length > 0 && selectedJob && (
        <section className="worker-dashboard">
          <aside className="client-quotes-panel">
            <div>
              <p className="eyebrow">🧰 Travaux</p>
              <h2>{jobs.length} assignation{jobs.length > 1 ? 's' : ''}</h2>
            </div>
            <div className="client-quote-list">
              {jobs.map((job) => (
                <button
                  className={job.id === selectedJob.id ? 'active' : ''}
                  key={job.id}
                  onClick={() => setSelectedId(job.id)}
                  type="button"
                >
                  <span>{job.id}</span>
                  <strong>🧼 {job.service}</strong>
                  <small>📍 {job.city} - 💵 {job.workerPay || 'Paiement à confirmer'}</small>
                </button>
              ))}
            </div>
          </aside>

          <section className="submission-detail">
            <div className="detail-head">
              <div>
                <p className="eyebrow">{selectedJob.id}</p>
                <h2>{selectedJob.name}</h2>
                <p>{selectedJob.address}, {selectedJob.city}</p>
              </div>
              <span className="status-pill">💵 {selectedJob.workerPay || 'Prix à confirmer'}</span>
            </div>

            <div className="detail-grid">
              <article>
                <span>👤 Client</span>
                <strong>{selectedJob.name}</strong>
                <p>{selectedJob.phone}</p>
              </article>
              <article>
                <span>📅 Date prévue</span>
                <strong>{selectedJob.nextVisit || selectedJob.preferredDate || 'À confirmer'}</strong>
                <p>{selectedJob.preferredTime || 'Heure à confirmer'}</p>
              </article>
              <article>
                <span>🧼 Service</span>
                <strong>{selectedJob.service}</strong>
                <p>{selectedJob.message || 'Aucun détail.'}</p>
              </article>
            </div>

            <details className="worker-report-panel collapsible-panel" open>
              <summary>
                <span className="panel-icon">📸</span>
                <span>Envoyer le rapport</span>
              </summary>
            <form className="worker-report-form" onSubmit={submitReport}>
              <label>
                Titre du rapport
                <input name="title" defaultValue="Rapport après intervention" />
              </label>
              <label>
                Checklist
                <textarea name="checklist" rows={4} placeholder={'Cuisine terminée\nSols lavés\nSalle de bain terminée'} />
              </label>
              <label>
                Notes
                <textarea name="notes" rows={4} placeholder="Commentaires pour le client..." />
              </label>
              <label>
                Photo avant
                <input name="beforeImage" type="file" accept="image/*" capture="environment" />
              </label>
              <label>
                Photo après
                <input name="afterImage" type="file" accept="image/*" capture="environment" />
              </label>
              <button className="button" type="submit" disabled={saving}>
                {saving ? 'Envoi...' : 'Envoyer le rapport'}
              </button>
            </form>
            </details>
          </section>
        </section>
      )}
    </main>
  );
}
