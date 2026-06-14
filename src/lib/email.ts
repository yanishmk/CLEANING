import type { QuoteSubmission } from '@/lib/db';

type EmailResult = {
  sent: boolean;
  reason?: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.CONFIRMATION_FROM_EMAIL ?? 'Cleaning Sol <onboarding@resend.dev>';
const siteUrl = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;

export async function sendQuoteConfirmation(quote: QuoteSubmission): Promise<EmailResult> {
  if (!resendApiKey) {
    return { sent: false, reason: 'RESEND_API_KEY missing' };
  }

  const portalUrl = siteUrl
    ? `${siteUrl.replace(/\/$/, '')}/portail?reference=${encodeURIComponent(quote.id)}`
    : undefined;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: quote.email,
      subject: `Confirmation de soumission ${quote.id} - Cleaning Sol`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #14213d; line-height: 1.6;">
          <h1>Soumission reçue</h1>
          <p>Bonjour ${quote.name},</p>
          <p>Nous avons bien reçu votre demande de soumission. Votre numéro de dossier est:</p>
          <p style="font-size: 22px; font-weight: 800;">${quote.id}</p>
          <p><strong>Conservez ce numéro.</strong> Il vous servira à suivre votre soumission dans le portail client.</p>
          ${
            portalUrl
              ? `<p><a href="${portalUrl}" style="display: inline-block; background: #0f766e; color: #ffffff; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: 700;">Ouvrir mon portail client</a></p>`
              : ''
          }
          <p>Nous vous répondrons avec une soumission claire sous 24h.</p>
          <h2>Détails</h2>
          <ul>
            <li><strong>Service:</strong> ${quote.service}</li>
            <li><strong>Adresse:</strong> ${quote.address}</li>
            <li><strong>Ville:</strong> ${quote.city}</li>
            <li><strong>Date souhaitee:</strong> ${quote.preferredDate || 'A confirmer'}</li>
            <li><strong>Heure souhaitee:</strong> ${quote.preferredTime || 'A confirmer'}</li>
            <li><strong>Téléphone:</strong> ${quote.phone}</li>
          </ul>
          <p>Pour suivre votre dossier, ouvrez le portail client et utilisez votre numéro de soumission avec votre courriel.</p>
          <p>Merci,<br/>Cleaning Sol</p>
        </div>
      `,
      text: [
        `Bonjour ${quote.name},`,
        '',
        `Nous avons bien reçu votre demande de soumission Cleaning Sol.`,
        `Numéro de soumission: ${quote.id}`,
        'Conservez ce numéro: il sert à suivre votre dossier dans le portail client.',
        ...(portalUrl ? [`Portail client: ${portalUrl}`] : []),
        `Service: ${quote.service}`,
        `Adresse: ${quote.address}`,
        `Ville: ${quote.city}`,
        `Date souhaitee: ${quote.preferredDate || 'A confirmer'}`,
        `Heure souhaitee: ${quote.preferredTime || 'A confirmer'}`,
        `Téléphone: ${quote.phone}`,
        '',
        'Nous vous répondrons sous 24h.',
      ].join('\n'),
    }),
  });

  if (!res.ok) {
    return { sent: false, reason: await res.text() };
  }

  return { sent: true };
}
