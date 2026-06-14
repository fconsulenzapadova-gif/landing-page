import { CalendarDays, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Prenotazione() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-24">
      <section className="container mx-auto max-w-3xl rounded-3xl border border-white bg-white/85 p-8 text-center shadow-xl backdrop-blur md:p-14">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
          <CalendarDays className="h-8 w-8 text-indigo-700" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-4xl font-bold text-slate-950">Prenota una Consulenza</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          Raccontaci la tua esigenza immobiliare. Ti ricontatteremo per concordare il momento più
          adatto e preparare un confronto utile fin dal primo incontro.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <Link to="/richieste">
              <CalendarDays className="mr-2 h-5 w-5" />
              Invia una richiesta
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="tel:+393792606775">
              <Phone className="mr-2 h-5 w-5" />
              379 260 6775
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="mailto:info@gemutcapital.com">
              <Mail className="mr-2 h-5 w-5" />
              Email
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
