import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="bg-slate-950 px-4 py-12 text-white">
      <div className="container mx-auto flex max-w-5xl flex-col items-center text-center">
        <Building2 className="mb-3 h-7 w-7 text-blue-300" aria-hidden="true" />
        <p className="text-xl font-bold">Gemüt Capital SRL</p>
        <p className="mt-1 text-sm text-slate-300">Mediazione immobiliare</p>

        <div className="mt-7 space-y-2 text-sm text-slate-200">
          <p>
            Tel:{' '}
            <a href="tel:+393792606775" className="hover:text-blue-300">
              379 260 6775
            </a>
          </p>
          <p>
            Email:{' '}
            <a href="mailto:info@gemutcapital.com" className="hover:text-blue-300">
              info@gemutcapital.com
            </a>
          </p>
          <p>Partita IVA: 05791060287</p>
          <p>REA: PD - 492863</p>
          <p>
            PEC:{' '}
            <a href="mailto:gemutcapital@pec.it" className="hover:text-blue-300">
              gemutcapital@pec.it
            </a>
          </p>
        </div>

        <Link
          to="/privacy"
          className="mt-7 text-sm font-medium text-blue-300 underline-offset-4 hover:underline"
        >
          Informativa Privacy
        </Link>
        <p className="mt-5 text-sm leading-relaxed text-slate-400">
          © 2026 Gemüt Capital SRL - Mediazione immobiliare. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}
