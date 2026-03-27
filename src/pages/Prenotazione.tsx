import React from 'react';
import { Building, Phone, FileText } from 'lucide-react';

const Prenotazione: React.FC = () => {
  return (
    <div className="min-h-screen relative bg-gray-50 flex flex-col">
      {/* Header / Hero */}
      <section className="py-12 bg-gradient-to-r from-lime-600 to-emerald-700 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Prenota una Consulenza</h1>
          <p className="text-xl text-lime-100 max-w-2xl mx-auto">
            Scegli il giorno e l'orario più comodi per te per discutere del tuo progetto immobiliare.
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="flex-grow py-12 px-4 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden p-2 md:p-6 border border-gray-100">
            {/* Google Calendar Appointment Scheduling begin */}
            <iframe 
              src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0ByydrKrLbdoanLEQ0AIG2UNoBFnwTu9ZvkQBntyKI3JGKUTvQpvoYbCzYpAhfliIaUj1kp0R0?gv=true" 
              style={{ border: 0 }} 
              width="100%" 
              height="600" 
              frameBorder="0"
              title="Prenotazione Appuntamento Gemüt Capital"
            ></iframe>
            {/* end Google Calendar Appointment Scheduling */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/90 backdrop-blur-sm text-white py-8 px-4 mt-auto">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building className="h-6 w-6" />
            <span className="text-lg font-semibold">Gemüt Capital</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Tel: 379 260 6775</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>P.IVA: 0555 8150 289</span>
            </div>
          </div>
          <div className="mt-4 mb-4">
            <a href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors underline">
              Informativa Privacy
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Gemüt Capital - Consulente Immobiliare. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Prenotazione;
