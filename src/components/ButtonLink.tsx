import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'light';

interface ButtonLinkProps {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  showArrow?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--brand-blue)] text-[var(--ink)] hover:bg-[var(--brand-blue-hover)] focus-visible:ring-[#b3e5fc]/60',
  secondary: 'bg-[var(--ink)] text-white hover:bg-black focus-visible:ring-black/20',
  outline:
    'border border-[var(--ink)]/20 bg-transparent text-[var(--ink)] hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue-strong)] focus-visible:ring-[#b3e5fc]/60',
  light: 'bg-[var(--paper-soft)] text-[var(--ink)] hover:bg-white focus-visible:ring-white/70',
};

const baseClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4';

export default function ButtonLink({
  children,
  to,
  href,
  variant = 'primary',
  className = '',
  showArrow = false,
}: ButtonLinkProps) {
  const classes = `${baseClass} ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {showArrow && <ArrowRight className="h-4 w-4" aria-hidden />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
      {content}
    </a>
  );
}
