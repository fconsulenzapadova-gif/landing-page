DELETE FROM listing_images WHERE listing_id LIKE 'demo-%';
DELETE FROM listings WHERE id LIKE 'demo-%';

INSERT INTO listings (
  id, code, slug, status, contract_type, title, property_type, municipality, zone,
  postal_code, price_cents, surface_sqm, rooms, bedrooms, bathrooms, floor,
  elevator, condition, energy_class, available_from, summary, description,
  features, highlights, sort_order, published_at
) VALUES
  ('demo-001', 'DEMO-001', 'attico-demo-prato-della-valle', 'published', 'vendita',
   'Attico demo vicino a Prato della Valle', 'Attico', 'Padova', 'Prato della Valle',
   '35123', 69500000, 180, 6, 3, 2, 'Ultimo', 'Sì', 'Ristrutturato', 'A2', 'Subito',
   'Scheda dimostrativa per verificare catalogo, filtri e dettaglio.',
   'Immobile fittizio: spazi luminosi, terrazza panoramica e finiture contemporanee.',
   '["Terrazza","Garage","Riscaldamento autonomo"]',
   '["Vista aperta","Zona centrale","Ampia zona giorno"]', 10, CURRENT_TIMESTAMP),
  ('demo-002', 'DEMO-002', 'loft-demo-portello', 'published', 'locazione',
   'Loft demo nel quartiere Portello', 'Loft', 'Padova', 'Portello',
   '35129', 145000, 78, 2, 1, 1, '1', 'Sì', 'Ottimo', 'B', 'Settembre 2026',
   'Scheda dimostrativa per il flusso degli immobili in locazione.',
   'Immobile fittizio: loft arredato con doppia altezza e posto auto riservato.',
   '["Arredato","Posto auto","Fibra ottica"]',
   '["Vicino agli istituti universitari","Spazi flessibili"]', 20, CURRENT_TIMESTAMP),
  ('demo-003', 'DEMO-003', 'casa-demo-colli-euganei', 'published', 'vendita',
   'Casa demo sui Colli Euganei', 'Casa indipendente', 'Teolo', 'Colli Euganei',
   '35037', NULL, 240, 7, 4, 3, 'Su due livelli', 'No', 'Buono', 'C', 'Da concordare',
   'Terza scheda dimostrativa con prezzo su richiesta.',
   'Immobile fittizio: casa indipendente immersa nel verde con giardino e portico.',
   '["Giardino","Portico","Cantina"]',
   '["Privacy","Contesto verde","Spazi per famiglia"]', 30, CURRENT_TIMESTAMP);

INSERT INTO listing_images (id, listing_id, object_key, alt_text, position) VALUES
  ('demo-img-001', 'demo-001', 'demo/attico-padova/cover.webp', 'Attico demo a Padova', 0),
  ('demo-img-002', 'demo-001', 'demo/attico-padova/gallery.webp', 'Vista urbana della scheda demo', 1),
  ('demo-img-003', 'demo-002', 'demo/loft-portello/cover.webp', 'Loft demo al Portello', 0),
  ('demo-img-004', 'demo-002', 'demo/loft-portello/gallery.webp', 'Dettaglio della scheda loft demo', 1),
  ('demo-img-005', 'demo-003', 'demo/casa-colli/cover.webp', 'Casa demo sui Colli Euganei', 0),
  ('demo-img-006', 'demo-003', 'demo/casa-colli/gallery.webp', 'Paesaggio della scheda casa demo', 1);
