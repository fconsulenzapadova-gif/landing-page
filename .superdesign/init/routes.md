# Routes

React Router config: `src/LandingApp.tsx`. Global layout: `src/components/AppLayout.tsx`.

- `/` → `HomePage`
- `/immobili` and `/immobili/:slug` → listing pages
- `/servizi` plus service routes → service pages
- `/richieste` → `src/pages/RequestsPage.tsx` (target)
- `/prenotazione` → `BookingPage`
- `/privacy` → `PrivacyPage`

Query `?type=acquisto|vendita|locazione` preselects request type.
