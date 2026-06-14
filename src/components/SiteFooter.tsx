import { Building2, FileText, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="bg-slate-950 px-4 py-12 text-white">
      <div className="container mx-auto flex max-w-5xl flex-col items-center text-center">
        <Building2 className="mb-3 h-7 w-7 text-blue-300" aria-hidden="true" />
        <p className="text-xl font-bold">Gemüt Capital SRL</p>
        <p className="mt-1 text-sm text-slate-300">Mediazione immobiliare</p>

        <div className="mt-7 grid w-full max-w-3xl gap-4 text-sm text-slate-200 sm:grid-cols-2">
          <a
            href="tel:+393792606775"
            className="flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-3 hover:bg-white/10"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Tel: 379 260 6775
          </a>
          <a
            href="mailto:info@gemutcapital.com"
            className="flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-3 hover:bg-white/10"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            info@gemutcapital.com
          </a>
          <div className="flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-3">
            <FileText className="h-4 w-4" aria-hidden="true" />
            P.IVA: 0555 8150 289
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-3">
            <FileText className="h-4 w-4" aria-hidden="true" />
            REA: da comunicare
          </div>
        </div>

        <Link
          to="/privacy"
          className="mt-7 text-sm font-medium text-blue-300 underline-offset-4 hover:underline"
        >
          Informativa Privacy
        </Link>
        <p className="mt-5 text-sm leading-relaxed text-slate-400">
          © 2025 Gemüt Capital SRL - Mediazione immobiliare. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}
