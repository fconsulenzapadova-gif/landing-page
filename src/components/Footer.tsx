import { Link } from 'react-router-dom';
import { company } from '../content/site';

export default function Footer() {
  return (
    <footer className="bg-[var(--ink)] px-4 py-14 text-white sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.3fr_0.8fr_0.9fr]">
        <div data-animate>
          <img src="/design-system/logo/logo-white.svg" alt={company.brand} className="h-10 w-auto" />
          <p className="mt-5 max-w-md text-sm leading-6 text-white/70">
            Mediazione immobiliare, consulenza e valorizzazione patrimoniale per Padova e provincia.
          </p>
        </div>

        <div data-animate>
          <h2 className="text-sm font-bold uppercase text-white">Contatti</h2>
          <div className="mt-4 space-y-2 text-sm text-white/70">
            <p>
              Tel:{' '}
              <a className="hover:text-white" href={`tel:${company.phoneHref}`}>
                {company.phone}
              </a>
            </p>
            <p>
              Email:{' '}
              <a className="hover:text-white" href={`mailto:${company.email}`}>
                {company.email}
              </a>
            </p>
            <p>
              PEC:{' '}
              <a className="hover:text-white" href={`mailto:${company.pec}`}>
                {company.pec}
              </a>
            </p>
          </div>
        </div>

        <div data-animate>
          <h2 className="text-sm font-bold uppercase text-white">Societa</h2>
          <div className="mt-4 space-y-2 text-sm text-white/70">
            <p>{company.legalName}</p>
            <p>Partita IVA: {company.vat}</p>
            <p>REA: {company.rea}</p>
            <Link to="/privacy" className="inline-flex font-semibold text-white hover:underline">
              Informativa Privacy
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-white/50">
        © 2026 {company.legalName}. Tutti i diritti riservati.
      </div>
    </footer>
  );
}
