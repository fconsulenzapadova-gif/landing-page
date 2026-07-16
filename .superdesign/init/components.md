# Components

React 18 + TypeScript, custom Tailwind UI.

- `src/components/Section.tsx`: responsive full-width section wrapper; full source passed to drafts.
- `src/components/ButtonLink.tsx`: primary/secondary/outline/light CTA; full source passed to drafts.
- `src/components/Icon.tsx`: Lucide mapping.
- `src/components/Turnstile.tsx`: interaction-only Cloudflare challenge.
- `src/components/RequestSuccess.tsx`: GSAP accessible success state.
- `src/pages/RequestsPage.tsx`: full wizard and local `Field` primitive.

```tsx
// src/components/Section.tsx
import type { ReactNode } from 'react';
interface SectionProps { children: ReactNode; className?: string; id?: string; }
export default function Section({ children, className = '', id }: SectionProps) {
  return <section id={id} className={`px-4 py-16 sm:px-6 sm:py-24 ${className}`}><div className="mx-auto w-full max-w-7xl">{children}</div></section>;
}
```
