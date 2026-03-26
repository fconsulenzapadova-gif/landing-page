import React, { useEffect } from 'react';
import { Building, Phone, FileText } from 'lucide-react';

const Privacy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
             <a href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">Gemüt Capital</a>
          </div>
          <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">Torna alla Home</a>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Informativa sulla Privacy</h1>
          
          <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Titolare del Trattamento</h2>
              <p>
                Il Titolare del trattamento dei dati è Gemüt Capital - Consulente Immobiliare, con sede a Padova.
                P.IVA: 0555 8150 289. Email di contatto: info@gemutcapital.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Tipologia di Dati Trattati</h2>
              <p>
                Raccogliamo e trattiamo i dati personali forniti volontariamente dagli utenti (nome, cognome, email, numero di telefono) 
                attraverso i moduli di contatto diretti o tramite WhatsApp per finalità legate alle richieste di consulenza o ai servizi offerti.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Finalità del Trattamento</h2>
              <p>
                I dati personali sono trattati per le seguenti finalità:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Rispondere alle richieste di informazioni o consulenza descritte nel sito.</li>
                <li>Fornire i servizi immobiliari richiesti (ricerca, valutazione, assistenza).</li>
                <li>Adempiere agli obblighi precontrattuali, contrattuali e fiscali.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Base Giuridica</h2>
              <p>
                La base giuridica del trattamento è rappresentata dall'esecuzione di misure precontrattuali o contrattuali
                adottate su richiesta dell'interessato, nonché dal consenso prestato.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Modalità del Trattamento e Conservazione</h2>
              <p>
                Il trattamento avviene mediante strumenti informatici e/o telematici o cartacei, con modalità organizzative e con logiche 
                strettamente correlate alle finalità indicate. I dati saranno conservati per il tempo strettamente necessario a 
                conseguire gli scopi per cui sono stati raccolti e per l'adempimento di obblighi legali.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Diritti dell'Interessato</h2>
              <p>
                L'utente ha il diritto in qualunque momento di chiedere al Titolare l'accesso ai propri dati personali, la rettifica, 
                la cancellazione degli stessi, la limitazione del trattamento o di opporsi al loro trattamento, oltre al 
                diritto alla portabilità dei dati. Tali diritti possono essere esercitati contattandoci all'indirizzo email info@gemutcapital.com.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Modifiche a questa Policy</h2>
              <p>
                Il Titolare si riserva il diritto di apportare modifiche alla presente privacy policy in qualunque momento 
                dandone in caso di necessità comunicazione agli Utenti. Verrà aggiornata la data di revisione.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-auto">
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
            © {new Date().getFullYear()} Gemüt Capital - Consulente Immobiliare. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
