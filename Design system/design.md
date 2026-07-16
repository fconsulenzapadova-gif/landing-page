# Gemut Capital - Design system

Ultimo aggiornamento: 1 luglio 2026

## Direzione

Il nuovo sito prende come riferimento la pagina Tandem Awwwards: superfici editoriali chiare, navigazione minima, tipografia serif centrale, immagini immobiliari in strip e transizioni misurate. L'obiettivo e far percepire Gemut Capital come una realta immobiliare curata, metodica e contemporanea, senza trasformare la landing in una dashboard.

## Token principali

- Azzurro cielo brand: `#b3e5fc`.
- Ink: `#12130f`, testo principale e superfici scure.
- Graphite: `#666861`, testo secondario.
- Paper: `#ece9e2`, fondo principale leggermente piu scuro.
- Paper soft: `#f7f5ef`, superfici chiare.
- Line: `#d8d4ca`, bordi sottili.
- Control border: `#807e77`, contorno interattivo con contrasto non testuale.
- Sage: `#7d8777`, accento neutro secondario.
- Clay: `#b55d42`, accento caldo secondario.

L'azzurro brand e l'unico azzurro della UI. Su fondi chiari viene usato come
fondo o decorazione con testo ink, non come testo piccolo. Rapporti principali:
ink su azzurro `13.8:1`, graphite su paper `4.66:1`, ink su paper `14.5:1`,
conformi ai livelli AA richiamati da EN 301 549. Il focus usa doppio contorno
ink + azzurro.

## Tipografia

- Wordmark e micro-identita: `De Fonte Plus`, servito da `public/design-system/font`.
- Titoli editoriali: `Minion Variable Concept`, con fallback `Minion 3 Variable`, `Minion Pro`, `Georgia`, `serif`.
- Testo UI: `Avenir Next`, `Avenir`, `Helvetica Neue`, `Arial`, `sans-serif`.
- Letter spacing: `0`; gli elementi uppercase non usano spaziatura artificiale.

## Asset

- Logo nero navigazione: testo HTML `GEMÜT` con classe `font-brand`, non SVG esterno, per caricare correttamente De Fonte Plus anche su Safari.
- Logo azzurro cielo: `public/design-system/logo/logo-blue.svg`.
- Logo bianco: `public/design-system/logo/logo-white.svg`.
- Font logo: `public/design-system/font/*.woff2`.
- Reference: `public/design-system/reference/tandem-awwwards-reference.jpg`.
- Immagini contenuto: asset WebP in `public/images`, con `Home.webp` usata come hero full-bleed iniziale.

## Layout

- Hero home: primo viewport sempre full-screen con `Home.webp` full-bleed, overlay `bg-black/45` con opacita iniziale `0.67` e headline centrale `Casa nuova, stesso GEMÜT`; `GEMÜT` usa il font brand azzurro, il resto usa il font display; line-height e padding del wordmark evitano clipping della `Ü` su Safari.
- Gallery immobili: sezione sticky dopo la curve swipe, centrata verticalmente sulle cards placeholder in riga orizzontale, senza titolo o descrizione introduttiva; la prima card parte dal margine sinistro del viewport e usa immagini WebP esistenti.
- Pagine interne: hero chiaro con titolo serif e immagine laterale, niente overlay fotografici scuri come default.
- Sezioni: bande full-width con contenuto max `7xl`, bordi sottili e griglie responsive.
- Card: solo per elementi ripetuti o pannelli funzionali, raggio massimo `8px`.
- CTA: primarie azzurro cielo con testo ink, secondarie outline.

## Motion

- Libreria: GSAP con `@gsap/react` e `ScrollTrigger`.
- Setup: `src/lib/usePageAnimations.ts`.
- Pattern: reveal su elementi `data-animate`, crop reveal su `data-animate="image"`, parallax leggero su `data-parallax`.
- Home: transizione iniziale curve swipe su scroll, con hero pinnata e path SVG curvo che sale dal basso verso il colore carta del contenuto.
- Home: gallery orizzontale ispirata al pattern GSAP Horizontal Scrolling Gallery, con `ScrollTrigger` senza `pin` GSAP, sezione sticky CSS, `scrub: true` e movimento `x` del track che parte dopo il pin della curve swipe e termina prima del rilascio sticky; le card restano gia renderizzate, senza comparsa improvvisa o salto a fine scroll.
- Accessibilita: `prefers-reduced-motion: reduce` disattiva reveal e parallax.
- Cleanup: gestito da `useGSAP` con scope locale per pagina.

## UX

- Navigazione misurata sullo spazio reale: logo a sinistra, voci centrate e CTA richiesta a destra.
- Fondo navigazione: paper normale traslucido, piu coprente fuori dalla home, con backdrop blur.
- Voci principali della navigazione sempre a peso `600`; stato attivo indicato dal fondo azzurro, non da un cambio di peso.
- Menu a tendina centrato solo quando le voci non entrano piu nella barra; overlay full-screen con route pubbliche esplicite.
- Miniature gallery con padding nel contenitore scrollabile, cosi bordo e ring di selezione restano interamente visibili.
- Home dinamica: hover/focus sui servizi aggiorna l'immagine preview.
- Gli immobili in evidenza sono placeholder cliccabili verso pagine dettaglio dimostrative, poi verso il form richiesta coerente.
- Headline hero animata con GSAP core e fallback `prefers-reduced-motion`.
- Il passaggio dalla schermata iniziale al resto della home avviene con curve swipe scrubbed sullo scroll; in reduced motion resta uno scroll normale.
- Form richieste: unico flusso reale, tipo richiesta con controllo segmentato, stessi campi e stesso payload lead.
- Cookie banner: preferenze locali, analytics e marketing restano simulati.
