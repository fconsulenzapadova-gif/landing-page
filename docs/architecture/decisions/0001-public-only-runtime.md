# ADR 0001: runtime public-only

Stato: accettata

Data: 16 luglio 2026 (decisione preesistente, formalizzata durante migrazione memoria)

## Contesto

Il repository conteneva una precedente struttura CRM/auth non necessaria alla landing pubblica.

## Decisione

Mantenere il runtime pubblico senza `AuthProvider`, React Query, dashboard CRM o componenti shadcn/Radix. Centralizzare contenuti in `src/content/site.ts`; mantenere un solo flusso lead in `RequestsPage.tsx` + `leads.ts`.

## Conseguenze

- Build e navigazione restano focalizzate sulle route pubbliche.
- Codice legacy/dormiente non deve essere descritto come feature attiva.
- Reintroduzioni richiedono una feature reale, aggiornamento architettura e verifica del bundle pubblico.
