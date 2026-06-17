# PRD e mappa della repository - Gemüt Capital

Ultimo aggiornamento: 18 giugno 2026

## 1. Scopo del documento

Questo file e la fonte iniziale per capire:

- che cosa fa il prodotto;
- come e strutturata la repository;
- dove cercare prima di fare una modifica;
- quali parti sono attive, parziali, legacy o simulate;
- quali flussi coinvolgono frontend, Supabase, CRM esterno e localStorage;
- quali requisiti non devono regredire.

Prima di modificare il progetto, leggere questo documento e verificare i file indicati. Dopo modifiche funzionali, architetturali, di routing, dati, integrazioni o configurazione, aggiornare anche questo file.

## 2. Sintesi del prodotto

La repository contiene una SPA pubblica per **Gemüt Capital SRL**, societa di mediazione immobiliare focalizzata su Padova e provincia.

Il prodotto pubblico presenta:

- servizi di acquisto, vendita e locazione;
- servizi immobiliari personalizzati;
- ispezione tetti tramite UAV;
- valutazione del patrimonio immobiliare;
- profilo professionale di Filippo Marcuzzo;
- form per acquisizione lead e richieste immobiliari;
- contatti, prenotazione consulenza, privacy e preferenze cookie.

La repository contiene inoltre codice CRM storico o condiviso per clienti, immobili, operazioni concluse, contratti, notifiche, preferiti, profili e pubblicazione sui portali. Gran parte di questo codice non e raggiungibile dalle route pubbliche correnti.

## 3. Legenda stato

| Stato | Significato |
| --- | --- |
| Attivo | Montato o raggiungibile nell'app pubblica corrente |
| Parziale | Visibile, ma flusso incompleto o implementazione minima |
| Legacy/dormiente | Presente nel repository, ma non raggiungibile dal router corrente |
| Simulato | Comportamento fittizio, casuale, locale o non collegato a servizio reale |
| Infrastrutturale | Configurazione, libreria UI, tipi o supporto tecnico |

## 4. Mappa rapida: dove modificare

| Esigenza | File principali |
| --- | --- |
| Avvio app e provider globali | `src/main-landing.tsx`, `src/LandingApp.tsx` |
| Route, redirect, lazy loading | `src/LandingApp.tsx` |
| Menu globale | `src/components/GlobalNavigation.tsx` |
| Footer e dati societari | `src/components/SiteFooter.tsx` |
| Cookie consent | `src/components/CookieConsent.tsx` |
| Home, brand, biografia, servizi | `src/pages/Landing.tsx` |
| Acquisto | `src/pages/AcquistoCasa.tsx` |
| Vendita | `src/pages/VenditaImmobili.tsx` |
| Locazioni | `src/pages/Locazioni.tsx` |
| Servizi personalizzati | `src/pages/ServiziPersonalizzati.tsx` |
| Due servizi specialistici | `src/pages/ServiceDetail.tsx` |
| Form pubblico lead | `src/pages/PublicRequests.tsx` |
| Elaborazione e invio lead | `src/utils/clientRequestProcessor.ts` |
| Prenotazione consulenza | `src/pages/Prenotazione.tsx` |
| Privacy | `src/pages/Privacy.tsx` |
| Accesso clienti storico | `src/pages/ClientAccess.tsx` |
| Supabase client | `src/integrations/supabase/client.ts` |
| Tipi Supabase generati | `src/integrations/supabase/types.ts` |
| Schema lead pubblico e RLS | `database_schema.sql`, `fix_rls_policies.sql` |
| Auth condivisa | `src/contexts/AuthContext.tsx` |
| Clienti CRM | `src/hooks/useSupabaseClients.ts` |
| Operazioni concluse | `src/hooks/useCompletedOperations.tsx` |
| Contratti locali | `src/hooks/useContracts.tsx`, `src/types/contract.ts` |
| Match clienti/immobili | `src/hooks/useMatchCalculator.ts` |
| Notifiche CRM | `src/hooks/useNotifications.tsx` |
| Preferiti CRM | `src/hooks/useFavorites.tsx` |
| Profilo utente | `src/hooks/useSupabaseProfile.tsx`, `src/hooks/useProfile.tsx` |
| Pubblicazione portali simulata | `src/utils/portalIntegration.ts` |
| Dati demo e seed | `src/utils/sampleData.ts`, `src/utils/seedDatabase.ts` |
| Storage separato landing/CRM | `src/utils/storage.ts`, `src/hooks/useLocalStorage.ts` |
| WhatsApp | `src/utils/whatsapp.ts`, `src/components/WhatsAppButton.tsx` |
| Design system e CSS globale | `src/index.css`, `tailwind.config.js` |
| Componenti UI | `src/components/ui/` |
| Build Vite | `vite.config.ts`, `tsconfig*.json`, `package.json` |
| Deploy e fallback SPA | `vercel.json`, `public/CNAME` |
| Test requisiti pubblici | `tests/site-requirements.test.mjs` |
| Specifica di riallineamento sito | `prompt.md` |
| Piano storico di implementazione | `docs/superpowers/plans/2026-06-14-gemut-capital-final-site.md` |

## 5. Stack e architettura

### 5.1 Stack

- React 18;
- TypeScript;
- Vite 8 con SWC;
- React Router 6;
- Tailwind CSS;
- componenti shadcn/Radix;
- Lucide React;
- TanStack React Query;
- Supabase JS;
- React Hook Form presente come dipendenza;
- Node test runner per test statici;
- Vercel per build, hosting e rewrite SPA.

### 5.2 Struttura runtime

```text
index.html
  -> src/main-landing.tsx
    -> LandingApp
      -> QueryClientProvider
        -> AuthProvider
          -> BrowserRouter
            -> GlobalNavigation
            -> Routes lazy-loaded
            -> SiteFooter
            -> Toaster
            -> CookieConsent
```

`LandingApp` monta navigazione, footer e servizi globali fuori dalle singole route. Le pagine sono caricate con `React.lazy` e mostrate dentro `Suspense`.

### 5.3 Alias

L'alias `@` punta a `src`, configurato in `vite.config.ts` e nei file TypeScript.

## 6. Routing pubblico

| Route | Componente/comportamento | Stato |
| --- | --- | --- |
| `/` | `Landing` | Attivo |
| `/privacy` | `Privacy` | Attivo, contenuto minimo |
| `/richieste` | `PublicRequests` | Attivo |
| `/richieste?type=acquisto` | Form preimpostato su acquisto | Attivo |
| `/richieste?type=vendita` | Form preimpostato su vendita | Attivo |
| `/richieste?type=locazione` | Form preimpostato su locazione | Attivo |
| `/accesso-clienti` | `ClientAccess` | Attivo nel router, ma non nel menu globale; contenuto storico CRM |
| `/acquisto-casa` | `AcquistoCasa` | Attivo |
| `/vendita-immobili` | `VenditaImmobili` | Attivo |
| `/locazioni` | `Locazioni` | Attivo |
| `/servizi-personalizzati` | `ServiziPersonalizzati` | Attivo, invio form simulato |
| `/prenotazione` | `Prenotazione` | Attivo |
| `/verifica-stato-tetto` | `ServiceDetail` con slug UAV | Attivo |
| `/valorizzazione-book-fotografico` | Redirect a `/` | Rimosso/legacy |
| `/valutazione-patrimonio` | `ServiceDetail` con slug patrimonio | Attivo |
| `/servizi-premium` | Redirect a `/` | Legacy |
| `/dettaglio-verifica-tetto` | Redirect alla route UAV | Legacy |
| `/dettaglio-valorizzazione-book` | Redirect a `/` | Rimosso/legacy |
| `/dettaglio-valutazione-patrimonio` | Redirect alla route patrimonio | Legacy |
| `/dashboard` | Redirect a `http://localhost:8081` | Sviluppo/legacy |
| `/crm/*` | Redirect a `http://localhost:8081` | Sviluppo/legacy |
| `/login`, `/auth` | Redirect a `http://localhost:8081/auth` | Sviluppo/legacy |
| Qualsiasi altra route | Redirect a `/` | Attivo |

Vercel reindirizza ogni URL a `index.html`, permettendo apertura diretta delle route SPA.

## 7. Esperienza pubblica

### 7.1 Navigazione globale

`GlobalNavigation` fornisce:

- pulsante menu fisso in alto a sinistra su tutte le route pubbliche;
- apertura del pannello laterale al passaggio mouse/penna e al focus tastiera;
- click desktop sul pulsante che porta direttamente alla route `/`;
- tap touch/mobile sul pulsante che apre il menu, dato che non esiste hover;
- icona menu che diventa casa al passaggio del mouse;
- pannello laterale;
- evidenza della route corrente;
- chiusura su navigazione, click overlay o tasto `Escape`;
- blocco scroll pagina durante apertura;
- CTA verso `/prenotazione`.

Le destinazioni principali devono restare disponibili da ogni pagina.

Il copy pubblico usa la prima persona plurale per la voce di Gemüt Capital e mantiene il cliente come interlocutore singolare. La sezione espandibile `Scopri Chi Sono Io` conserva la voce personale di Filippo Marcuzzo in prima persona singolare.

### 7.2 Home

`Landing.tsx` contiene:

- hero con immagine di Padova come primo blocco visibile della pagina, sotto il solo pulsante menu globale;
- badge hero `agenzia di mediazione immobiliare`;
- titolo hero `Gemüt Capital, il tuo partner immobiliare di fiducia.`, con `Gemüt Capital` e `di fiducia` in azzurro chiaro;
- definizione del termine tedesco Gemüt nascosta per default e mostrata sopra il titolo su hover/focus di `Gemüt Capital` o tap mobile, con espansione animata che sposta titolo e claim;
- claim operativo su esperienza, professionalita e tecnologia, visibile subito da `md` in su e rivelato una sola volta su mobile con fade/slide dopo il primo scroll verso il basso oltre 24 px;
- sezione `I Nostri Servizi` con titolo/sottotitolo e card `Sto cercando un immobile`, `Vorrei sapere quanto vale il mio immobile` e `Servizi per l'affitto`; il comportamento attivo e bidirezionale e si ripete a ogni attraversamento: su desktop, scorrendo verso il basso, titolo e sottotitolo compaiono dall'alto seguiti dalle card 1 → 2 → 3, mentre scorrendo verso l'alto le card scompaiono verso l'alto in ordine 3 → 2 → 1 e infine titolo e sottotitolo; su mobile ogni blocco impilato compare da sinistra quando entra nel viewport scorrendo verso il basso e scompare verso sinistra, nel naturale ordine inverso dei blocchi impilati, scorrendo verso l'alto; `prefers-reduced-motion` continua a ridurre le transizioni;
- biografia espandibile di Filippo Marcuzzo;
- smooth scroll verso la biografia;
- vantaggi e rete professionale;
- card UAV e valutazione patrimonio in formato compatto, ridotte di circa il 30% con testi, icone e CTA proporzionati;
- accesso ai servizi personalizzati;
- CTA verso form richieste e contatti.

### 7.3 Servizi principali

`AcquistoCasa`, `VenditaImmobili` e `Locazioni` usano pagine editoriali con:

- hero fotografica;
- CTA verso `/richieste` con query `type`;
- descrizione dei servizi;
- metodo/processo;
- vantaggi;
- contatti finali.

Le immagini iniziali sono:

- acquisto: `/foto-cortina.JPG`;
- vendita: `/sfondo-patrimoni.jpg`;
- locazioni: `/Sfondo locazioni.JPG`.

### 7.4 Servizi specialistici

`ServiceDetail.tsx` usa una configurazione dati unica per due varianti:

- verifica tetto tramite UAV;
- valutazione del patrimonio.

Ogni variante definisce icona, colori, badge, titolo, descrizione, CTA, immagine, vantaggi e processo. Le CTA portano a prenotazione e WhatsApp.

La precedente feature "Valorizzazione con Book Fotografico" e stata rimossa dalla home, dal menu e dalla configurazione runtime. I suoi URL pubblico e legacy reindirizzano alla home.

### 7.5 Servizi personalizzati

`ServiziPersonalizzati.tsx` presenta:

- ricerca mirata;
- analisi investimenti;
- verifica tetto UAV;
- due diligence;
- strategie di vendita;
- consulenza familiare;
- metodo in quattro fasi;
- form modale.

Il form modale e **simulato**: stampa dati in console, mostra `alert`, resetta il form. Non salva su Supabase e non invia al CRM.

### 7.6 Prenotazione

`Prenotazione.tsx` non integra un calendario reale. Offre:

- link al form richieste;
- chiamata telefonica;
- email.

Stato: **parziale**.

### 7.7 Privacy e cookie

`Privacy.tsx` contiene una breve informativa generale e contatto email. Non e una privacy policy legale completa.

`CookieConsent.tsx` salva preferenze in `localStorage` con chiave `cookie-consent`. Le opzioni analytics e marketing non caricano script reali: producono solo log.

Stato: UI attiva, integrazioni cookie **simulate/non collegate**.

## 8. Flusso lead pubblico

### 8.1 Origine

Il flusso principale parte da `PublicRequests.tsx`.

La pagina usa `/prato-padova.jpg` come unico sfondo continuo, incluso dietro la hero e il form. La hero mantiene overlay scuro e pannello verde traslucido per la leggibilita.

Campi:

- nome;
- telefono;
- email;
- tipo richiesta;
- tipo immobile;
- zona;
- budget;
- tempistiche;
- caratteristiche;
- note.

Campi obbligatori applicativi:

- nome;
- telefono;
- email valida;
- zona.

### 8.2 Elaborazione

`processClientRequest`:

1. cerca il cliente in Supabase tramite email;
2. aggiorna nome/telefono se esiste;
3. crea il cliente se non esiste;
4. crea una riga in `client_requests`;
5. invia in modo non bloccante nome, email e telefono al CRM esterno;
6. restituisce successo o errore alla UI.

### 8.3 CRM esterno

Endpoint corrente:

```text
https://crm-pro-five.vercel.app/api/submit-lead
```

Payload:

```json
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "landing_page_url": "www.gemutcapital.com"
}
```

L'errore CRM non blocca il salvataggio Supabase. Il payload identifica la landing con il dominio Gemüt Capital.

### 8.4 Vincolo RLS importante

Il codice pubblico esegue una `SELECT` per email e, per clienti esistenti, una `UPDATE`. Lo schema SQL incluso consente agli utenti anonimi solo `INSERT`, mentre `SELECT` e `UPDATE` sono riservati agli autenticati.

Con RLS applicata esattamente come nei file SQL, il flusso anonimo puo fallire prima dell'inserimento. Ogni intervento sul form deve verificare policy reali, schema deployato e comportamento anonimo end-to-end.

## 9. Modello dati

### 9.1 Tabelle descritte da `database_schema.sql`

#### `clients`

- `id`;
- `name`;
- `email` univoca;
- `phone`;
- `created_at`;
- `updated_at`.

#### `client_requests`

- `id`;
- `client_id`;
- `request_type`: acquisto, vendita, locazione;
- `property_type`;
- `location`;
- `budget`;
- `timeframe`;
- `features`;
- `notes`;
- `status`: pending, in_progress, completed, cancelled;
- `processed_by`;
- `processed_at`;
- timestamp.

### 9.2 Tabelle usate da codice legacy

I tipi Supabase e gli hook fanno riferimento anche a:

- `buyers`;
- `sellers`;
- `completed_operations`;
- `client_favorites`;
- `profiles`.

Queste aree supportano il CRM storico, ma non sono descritte completamente da `database_schema.sql`. Prima di cambiarle, confrontare `src/integrations/supabase/types.ts` con lo schema Supabase effettivo.

## 10. Auth e Supabase

`AuthProvider`:

- ascolta `onAuthStateChange`;
- recupera sessione corrente;
- espone `user`, `session`, `isAuthenticated`, `logout`;
- prova a condividere token tramite storage namespaced.

Il client Supabase configura:

- `persistSession: false`;
- `autoRefreshToken: false`;
- storage browser standard.

Il provider viene montato anche sul sito pubblico e puo ritardare il rendering finche il controllo sessione non termina.

Esiste una possibile incoerenza tra storage Supabase standard e token salvato nello storage namespaced. Verificare auth reale prima di estendere flussi autenticati.

## 11. Moduli CRM legacy/dormienti

### 11.1 Clienti

`useSupabaseClients.ts` gestisce CRUD per buyer e seller tramite Supabase.

### 11.2 Operazioni concluse

`useCompletedOperations.tsx`:

- legge, crea ed elimina operazioni;
- richiede utente autenticato;
- dopo una creazione genera automaticamente un contratto locale;
- salva il contratto in `localStorage`.

### 11.3 Contratti

`useContracts.tsx` legge `crm-contracts` da localStorage e calcola:

- contratti da registrare;
- scadenze prossime;
- scadenze critiche.

### 11.4 Matching

`useMatchCalculator.ts` calcola compatibilita tra buyer e immobili seller tramite:

- tipo operazione;
- tipo immobile;
- budget/prezzo;
- zona;
- caratteristiche.

Produce liste separate per vendita e locazione.

### 11.5 Notifiche

`useNotifications.tsx` genera e persiste notifiche CRM usando dati buyer, seller e contratti in localStorage.

### 11.6 Preferiti

`useFavorites.tsx` salva preferiti buyer/seller in Supabase per utente autenticato.

### 11.7 Profilo

`useSupabaseProfile.tsx` legge, crea e aggiorna profili Supabase e permette cambio password.

`useProfile.tsx` e un wrapper/fallback minimale.

### 11.8 Pubblicazione portali

`portalIntegration.ts` prepara dati per portali immobiliari e valida annunci, ma le operazioni di pubblicazione, aggiornamento, eliminazione e stato sono **simulate** con timeout e risultati casuali.

Non considerare questo modulo una vera integrazione Immobiliare.it o Idealista.

### 11.9 Dashboard

`components/Dashboard.tsx` contiene soprattutto tipi condivisi (`Property`, `BuyerClient`, `SellerClient`) e una UI placeholder. Non e montata dal router pubblico.

## 12. Storage browser

`src/utils/storage.ts` separa chiavi:

- `landing:<chiave>`;
- `crm:<chiave>`.

La scelta dipende da porta, path `/crm` o `VITE_APP=crm`.

Chiavi note:

- `cookie-consent`;
- `landing:supabase.auth.token` o `crm:supabase.auth.token`;
- `crm-contracts`;
- `crm-buyers`;
- `crm-sellers`;
- `crm-notifications`.

Parte del codice usa storage namespaced, parte usa `localStorage` direttamente. Questa incoerenza puo separare dati che dovrebbero essere condivisi.

## 13. Componenti condivisi e UI

### 13.1 Componenti applicativi

- `GlobalNavigation`: menu pubblico globale;
- `SiteFooter`: footer societario;
- `CookieConsent`: banner e dialog cookie;
- `LoadingSpinner`: fallback caricamento;
- `WhatsAppButton`: apertura chat;
- `BackButton`: componente storico, non usato nelle route specialistiche correnti;
- `PageHeader`: header storico orientato dashboard;
- `Dashboard`: placeholder e tipi CRM.

### 13.2 Libreria UI

`src/components/ui/` contiene componenti shadcn/Radix generici. Non rappresentano feature prodotto finche non vengono importati da pagine o componenti applicativi.

Prima di modificare un componente UI condiviso, cercare tutti gli import con `rg`.

### 13.3 Design system

`src/index.css` definisce:

- variabili HSL light/dark;
- colori immobiliari;
- gradienti e ombre;
- stili glass/liquid glass;
- focus globale;
- animazioni;
- supporto `prefers-reduced-motion`;
- larghezza minima 320 px;
- blocco overflow orizzontale.

`tailwind.config.js` estende i token CSS e include `tailwindcss-animate`.

## 14. Asset pubblici

Asset prodotto principali:

- `public/prato-padova.jpg`;
- `public/sfondo-patrimoni.jpg`;
- `public/foto-cortina.JPG`;
- `public/Sfondo locazioni.JPG`;
- `public/dji_fly_20250917_193124_297_1758130816590_photo.JPG`;
- `public/piazza-vicina.JPG`;
- `public/strada-verde.JPG`;
- `public/profile.jpg`.

Altri file:

- `public/robots.txt`;
- `public/CNAME`;
- `public/placeholder.svg`;
- `public/padova-test.jpg`.

I nomi asset sono case-sensitive in produzione Linux. Conservare maiuscole, spazi ed estensioni esatte.

`index.html` riferisce `/favicon.svg`, ma il file non risulta presente nello stato corrente della working tree.

## 15. Configurazione

### 15.1 Variabili ambiente

Da `.env.example`:

- `VITE_SUPABASE_URL`;
- `VITE_SUPABASE_PUBLISHABLE_KEY`;
- `VITE_APP_DOMAIN`;
- `VITE_APP_NAME`;
- `VITE_SUPABASE_PROJECT_ID`;
- `VITE_APP`, normalmente `landing`.

Non inserire segreti reali nel repository. Le variabili `VITE_*` sono esposte al browser.

### 15.2 Vite

- Vite 8 con plugin React SWC;
- server dev su porta `8080`;
- host `::`;
- output `dist`;
- alias `@`;
- filtro warning Rollup per `PLUGIN_WARNING` storico.

### 15.3 Vercel

`vercel.json` usa:

- `npm install`;
- `CI=false npm run build`;
- output `dist`;
- rewrite globale verso `/index.html`.

`public/CNAME` gestisce il dominio custom.

## 16. Test e verifica

### 16.1 Test esistente

`tests/site-requirements.test.mjs` esegue controlli statici su:

- destinazioni del menu;
- brand e copy home;
- CTA servizi specialistici;
- assenza di copy rimossi;
- asset richiesti;
- dati societari footer.

Limite: il test cerca stringhe nei file. Non verifica rendering, interazioni, accessibilita runtime, API, Supabase o layout responsive.

### 16.2 Comandi previsti

```bash
npm test
npm run lint
npm run build
npm run dev
npm run preview
```

Nell'ambiente analizzato il comando `npm` non era disponibile nel `PATH` locale. Il 16 giugno 2026 le verifiche sono state comunque eseguite direttamente con il runtime Node integrato e con `pnpm dlx npm@10` per audit/npm:

- test statici: 15 superati, 0 falliti;
- lint globale: completato senza errori;
- build Vite di produzione: completata con successo;
- audit npm: 0 vulnerabilita;
- warning non bloccanti: dati `baseline-browser-mapping` e `caniuse-lite` non aggiornati; `PLUGIN_TIMINGS` segnala tempo CSS post-processing in Vite/Rolldown.

### 16.3 Checklist minima dopo modifiche

1. Eseguire test, lint e build.
2. Verificare route direttamente e tramite menu.
3. Provare almeno mobile e desktop.
4. Controllare console browser e richieste di rete.
5. Verificare asset senza 404.
6. Per form lead, verificare Supabase anonimo e CRM esterno.
7. Per cambi schema, verificare tipi generati e RLS.
8. Aggiornare questo PRD.

## 17. Requisiti invarianti

- Brand pubblico: `Gemüt Capital`.
- Focus: mediazione immobiliare e valorizzazione patrimoniale.
- Menu globale disponibile su tutte le pagine pubbliche.
- Footer globale centrato con dati societari.
- Route interne compatibili con refresh diretto.
- CTA principali collegate a richiesta, prenotazione o contatto.
- Form richieste precompilabile tramite query `type`.
- Asset locali preferiti alle immagini remote.
- Accessibilita base: label, `aria-label`, focus visibile, tastiera.
- Layout responsive da 320 px.
- Nessuna regressione delle route coperte dai test.
- Non presentare feature simulate come integrazioni reali.

## 18. Limiti e debito tecnico noto

- Form servizi personalizzati non invia dati.
- Prenotazione non contiene calendario o booking reale.
- Analytics e marketing cookie non attivano script.
- Privacy page minimale.
- Redirect CRM puntano a `localhost:8081`, quindi non sono validi in produzione pubblica.
- `ClientAccess` duplica il flusso richieste ed espone copy CRM storico.
- RLS SQL e flusso anonimo `saveOrGetClient` possono essere incompatibili.
- Moduli portali immobiliari sono simulati.
- Dashboard e diversi hook CRM sono dormienti.
- Storage namespaced e storage diretto sono mescolati.
- Tipi condivisi CRM vivono in un componente placeholder.
- Auth disabilita persistenza e refresh automatico Supabase.
- Alcuni import/dependency dei componenti UI possono non essere necessari al bundle pubblico.
- `favicon.svg` e referenziato ma non presente nello stato corrente.
- Anno footer fissato a `2025`.
- REA indicato come `da comunicare`.
- Working tree osservata con file marcati contemporaneamente rimossi e non tracciati; non normalizzare Git senza richiesta esplicita.

## 19. Regole per modifiche future

Prima della modifica:

1. leggere `AGENTS.md`;
2. leggere questo PRD;
3. usare la mappa rapida per trovare i file;
4. cercare import, route, stringhe e dipendenze con `rg`;
5. distinguere comportamento attivo da codice legacy o simulato;
6. controllare lo stato Git senza cancellare modifiche esistenti.

Dopo la modifica:

1. aggiornare sezioni coinvolte del PRD;
2. aggiornare tabella route se necessario;
3. aggiornare mappa file se responsabilita o path cambiano;
4. aggiornare modello dati e integrazioni se cambiano;
5. segnare feature nuove come attive, parziali o simulate;
6. aggiornare limiti noti;
7. eseguire verifiche proporzionate al rischio.

## 20. Criteri di completamento del prodotto

Una modifica e completa quando:

- requisito utente e implementato;
- route e flussi coinvolti funzionano;
- errori e stati di caricamento sono gestiti;
- dati sono salvati nel sistema previsto;
- copy non promette funzioni simulate;
- accessibilita e responsive non regrediscono;
- test/build pertinenti passano;
- PRD riflette lo stato reale della repository.
