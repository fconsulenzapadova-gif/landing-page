const stepLabels = ['Obiettivo', 'Immobile', 'Contatti'] as const;

interface Props {
  step: number;
}

export default function WizardProgress({ step }: Props) {
  return (
    <div className="mb-8 grid gap-3">
      <ol className="grid grid-cols-3 gap-2" aria-label="Avanzamento richiesta">
        {stepLabels.map((label, index) => (
          <li key={label} className="grid gap-2" aria-current={index === step ? 'step' : undefined}>
            <span
              className={`h-1 rounded-full ${index <= step ? 'bg-[var(--ink)]' : 'bg-[var(--line)]'}`}
              aria-hidden="true"
            />
            <span className={`text-xs font-semibold ${index === step ? 'text-[var(--ink)]' : 'text-[var(--graphite)]'}`}>
              {index + 1}. {label}
            </span>
          </li>
        ))}
      </ol>
      <p className="text-right text-xs font-medium text-[var(--graphite)]">Tempo stimato: circa 2 minuti</p>
    </div>
  );
}
