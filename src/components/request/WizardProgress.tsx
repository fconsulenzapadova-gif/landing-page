const screenLabels = [
  'Obiettivo',
  'Posizione',
  'Tipo immobile',
  'Budget',
  'Tempistica',
  'Dettagli',
  'Contatti',
  'Consenso',
] as const;

interface Props {
  screen: number;
}

export default function WizardProgress({ screen }: Props) {
  const currentScreen = screen + 1;
  const completion = (currentScreen / screenLabels.length) * 100;

  return (
    <div className={`grid w-full ${screen === 0 ? 'mb-10 gap-3 sm:mb-12' : 'mb-6 sm:mb-8'}`}>
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-[var(--line)]"
        role="progressbar"
        aria-label="Avanzamento richiesta"
        aria-valuemin={1}
        aria-valuemax={screenLabels.length}
        aria-valuenow={currentScreen}
      >
        <span className="block h-full bg-[var(--ink)] transition-[width] duration-300" style={{ width: `${completion}%` }} />
      </div>
      {screen === 0 && (
        <p className="text-center text-xs font-bold uppercase tracking-[0.08em] text-[var(--graphite)]">
          Passaggio {currentScreen} di {screenLabels.length} · Tempo stimato: circa 1 minuto
        </p>
      )}
      <ol className="sr-only" aria-label="Avanzamento richiesta">
        {screenLabels.map((label, index) => (
          <li key={label} aria-current={index === screen ? 'step' : undefined}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>
    </div>
  );
}
