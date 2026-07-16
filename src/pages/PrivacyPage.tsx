import { useRef } from 'react';
import Section from '../components/Section';
import { company } from '../content/site';
import { usePageAnimations } from '../lib/usePageAnimations';

export default function PrivacyPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  usePageAnimations(pageRef);

  return (
    <div ref={pageRef}>
      <Section className="section-line bg-[var(--paper-soft)]">
        <article data-animate className="mx-auto max-w-3xl rounded-lg border border-[var(--line)] bg-white p-8 sm:p-12">
          <p className="eyebrow">Privacy</p>
          <h1 className="font-display mt-3 text-5xl leading-tight text-[var(--ink)]">Informativa privacy sintetica</h1>
          <div className="mt-6 space-y-4 text-base leading-8 text-[var(--graphite)]">
            <p>
              {company.legalName} tratta i dati inviati tramite i moduli del sito esclusivamente per rispondere alle richieste di contatto e fornire informazioni sui servizi immobiliari richiesti.
            </p>
            <p>
              I dati possono essere usati per ricontattarti via telefono o email. Non sono presenti in questa versione sistemi analytics o marketing attivati dal consenso cookie.
            </p>
            <p>
              Le richieste vengono protette da Cloudflare Turnstile e salvate in un database Cloudflare D1. Quando usi i suggerimenti di indirizzo, il testo digitato viene inviato direttamente dal browser a Geoapify esclusivamente per proporre indirizzi pertinenti. Il sito non invia i dati del modulo a Google Forms, Supabase o CRM esterni e non conserva nel database l’indirizzo IP o il token antispam.
            </p>
            <p>
              I dati vengono conservati per il tempo necessario a gestire la richiesta e gli eventuali rapporti conseguenti, nel rispetto degli obblighi applicabili.
            </p>
            <p>
              Per informazioni o richieste sui dati personali puoi scrivere a{' '}
              <a className="font-semibold text-[var(--ink)] underline decoration-[var(--brand-blue)] decoration-4 underline-offset-4" href={`mailto:${company.email}`}>
                {company.email}
              </a>
              .
            </p>
          </div>
        </article>
      </Section>
    </div>
  );
}
