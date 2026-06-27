# Hero agency badge copy

## Goal

Replace the active home hero badge text `Agenzia` with the exact lowercase copy
`agenzia di mediazione immobiliare`.

## Scope

- Keep the existing `Badge` component, position, styling, and responsive behavior.
- Change only the badge copy in `src/pages/Landing.tsx`.
- Update the static site requirement test to require the new copy.
- Update `PRD.md` so the documented active home state matches the repository.

## Verification

- Observe the updated static requirement fail before changing production code.
- Run tests, lint, and production build after implementation.
- Reload the active local preview and confirm the new badge text is visible.

