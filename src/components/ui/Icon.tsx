import { 
  Heart, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  Camera, 
  Music, 
  Car,
  ChefHat,
  Flower,
  Building,
  CheckCircle,
  ArrowUp,
  ExternalLink,
  Church,
  Sparkles,
  Castle,
  Wine,
  Sun,
  Target,
  Trophy,
  Zap,
  Settings,
  ClipboardList,
  Ban,
  Chrome,
  Globe,
  Briefcase,
  Instagram,
  Facebook,
  Cookie,
  Shield,
  BarChart,
  AlertTriangle,
  Info,
  Square,
  Search,
  Edit,
  Trash,
  Pause,
  Package,
  Scale,
  Mic,
  Users2,
  type LucideIcon 
} from 'lucide-react';

/**
 * Mapping des types d'icônes disponibles
 * Utilise Lucide React pour des icônes modernes et professionnelles
 */
const iconMap = {
  // Événements et mariages
  heart: Heart,
  star: Star,
  calendar: Calendar,
  users: Users,
  church: Church,
  sparkles: Sparkles,
  castle: Castle,
  wine: Wine,
  
  // Contact et localisation
  mapPin: MapPin,
  phone: Phone,
  mail: Mail,
  
  // Services
  camera: Camera,
  music: Music,
  car: Car,
  chefHat: ChefHat,
  flower: Flower,
  building: Building,
  sun: Sun,
  
  // Interface
  check: CheckCircle,
  arrowUp: ArrowUp,
  externalLink: ExternalLink,
  target: Target,
  trophy: Trophy,
  zap: Zap,
  settings: Settings,
  clipboardList: ClipboardList,
  ban: Ban,
  
  // Navigateurs et réseaux sociaux
  chrome: Chrome,
  globe: Globe,
  briefcase: Briefcase,
  instagram: Instagram,
  facebook: Facebook,
  
  // Interface spécialisée
  cookie: Cookie,
  shield: Shield,
  barChart: BarChart,
  alertTriangle: AlertTriangle,
  info: Info,
  square: Square,
  search: Search,
  edit: Edit,
  trash: Trash,
  pause: Pause,
  package: Package,
  scale: Scale,
  mic: Mic,
  users2: Users2,
} as const;

export type IconType = keyof typeof iconMap;

interface IconProps {
  /** Type d'icône à afficher */
  type: IconType;
  /** Taille de l'icône en pixels */
  size?: number;
  /** Classes CSS additionnelles */
  className?: string;
  /** Label d'accessibilité */
  'aria-label'?: string;
}

/**
 * Composant Icon moderne
 * 
 * Utilise Lucide React pour afficher des icônes SVG modernes et accessibles.
 * Remplace les emojis pour une interface plus professionnelle.
 * 
 * @example
 * ```tsx
 * <Icon type="heart" size={24} className="text-red-500" aria-label="Favori" />
 * ```
 */
export default function Icon({ 
  type, 
  size = 20, 
  className = '', 
  'aria-label': ariaLabel 
}: IconProps) {
  const IconComponent = iconMap[type] as LucideIcon;
  
  if (!IconComponent) {
    console.warn(`Icon type "${type}" not found in iconMap`);
    return null;
  }
  
  return (
    <IconComponent 
      size={size}
      className={className}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    />
  );
}

/**
 * Composant Icon avec style prédéfini pour les boutons
 */
export function ButtonIcon({ type, ...props }: Omit<IconProps, 'size' | 'className'>) {
  return (
    <Icon 
      type={type} 
      size={16} 
      className="inline-block mr-2" 
      {...props} 
    />
  );
}

/**
 * Composant Icon avec style prédéfini pour les sections
 */
export function SectionIcon({ type, ...props }: Omit<IconProps, 'size' | 'className'>) {
  return (
    <Icon 
      type={type} 
      size={24} 
      className="text-primary" 
      {...props} 
    />
  );
}