import {
  Award,
  BarChart3,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Expand,
  FileText,
  Home,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Target,
  Users,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { IconName } from '../content/site';

const icons = {
  award: Award,
  'bar-chart': BarChart3,
  building: Building2,
  calendar: CalendarDays,
  camera: Camera,
  check: CheckCircle2,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  close: X,
  expand: Expand,
  file: FileText,
  home: Home,
  key: KeyRound,
  mail: Mail,
  map: MapPin,
  phone: Phone,
  search: Search,
  shield: ShieldCheck,
  target: Target,
  users: Users,
} satisfies Record<IconName, LucideIcon>;

interface IconProps {
  name: IconName;
  className?: string;
}

export default function Icon({ name, className }: IconProps) {
  const Component = icons[name];
  return <Component className={className} aria-hidden />;
}
