import {
  Utensils,
  Car,
  Tv,
  FileText,
  ShoppingBag,
  HeartPulse,
  BookOpen,
  MoreHorizontal,
  ShoppingCart,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'utensils': Utensils,
  'car': Car,
  'tv': Tv,
  'file-text': FileText,
  'shopping-bag': ShoppingBag,
  'heart-pulse': HeartPulse,
  'book-open': BookOpen,
  'shopping-cart': ShoppingCart,
  'more-horizontal': MoreHorizontal,
};

interface CategoryIconProps {
  icon: string;
  className?: string;
  color?: string;
}

export function CategoryIcon({ icon, className = 'h-5 w-5', color }: CategoryIconProps) {
  const Icon = iconMap[icon] || MoreHorizontal;
  return <Icon className={className} style={{ color }} />;
}

export function getCategoryIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || MoreHorizontal;
}

