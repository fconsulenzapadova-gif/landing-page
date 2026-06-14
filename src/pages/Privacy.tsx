import { ShieldCheck } from 'lucide-react';

export default function Privacy() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-24">
      <article className="container mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-12">
        <ShieldCheck className="h-10 w-10 text-blue-700" aria-hidden="true" />
        <h1 className="mt-5 text-4xl font-bold text-slate-950">Informativa Privacy</h1>
        <p className="mt-6 leading-relaxed text-slate-700">
          Gemüt Capital SRL tratta i dati inviati tramite i moduli del sito esclusivamente per
          rispondere alle richieste di contatto e fornire i servizi di mediazione immobiliare
          richiesti.
        </p>
        <p className="mt-4 leading-relaxed text-slate-700">
          Per informazioni, aggiornamenti o richieste relative ai dati personali puoi scrivere a{' '}
          <a className="font-semibold text-blue-700 hover:underline" href="mailto:info@gemutcapital.com">
            info@gemutcapital.com
          </a>
          .
        </p>
      </article>
    </main>
  );
}
