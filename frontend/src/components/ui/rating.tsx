import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  onChange: (value: number) => void;
}

export function Rating({ value, onChange }: RatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl ${
            star <= value ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          <Star className="h-6 w-6" fill={star <= value ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}