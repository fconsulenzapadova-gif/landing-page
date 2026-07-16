export default function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-4 text-[var(--graphite)]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--brand-blue)] border-t-[var(--ink)]" aria-label="Caricamento" />
    </div>
  );
}
