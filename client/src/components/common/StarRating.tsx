import { Star } from 'lucide-react';

interface Props {
  rating: number;
  max?: number;
}

export function StarRating({ rating, max = 5 }: Props) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < rating ? '#f59e0b' : 'none'}
          stroke={i < rating ? '#f59e0b' : '#d1d5db'}
        />
      ))}
    </div>
  );
}
