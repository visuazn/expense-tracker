import { Category } from '@/lib/types';
import { CategoryIcon } from './category-icon';
import { Badge } from '@/components/ui/badge';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={className}
      style={{ borderColor: category.color }}
    >
      <CategoryIcon icon={category.icon} color={category.color} className="h-3 w-3 mr-1" />
      {category.name}
    </Badge>
  );
}

