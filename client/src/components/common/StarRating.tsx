import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  label?: string;
  showValue?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  max = 5,
  size = 'md',
  readOnly = false,
  label,
  showValue = false,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const starSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';

  const activeValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs font-semibold text-slate-700">{label}</span>}
      <div className="flex items-center gap-1.5">
        <div
          className="flex items-center gap-1"
          onMouseLeave={() => !readOnly && setHoverValue(null)}
        >
          {Array.from({ length: max }, (_, index) => {
            const starNumber = index + 1;
            const isFilled = starNumber <= activeValue;

            return (
              <button
                type="button"
                key={index}
                disabled={readOnly}
                onClick={() => !readOnly && onChange && onChange(starNumber)}
                onMouseEnter={() => !readOnly && setHoverValue(starNumber)}
                className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform focus:outline-none`}
              >
                <Star
                  className={`${starSize} ${
                    isFilled
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300 fill-slate-100'
                  } transition-colors`}
                />
              </button>
            );
          })}
        </div>
        {showValue && (
          <span className="text-xs font-bold text-slate-700 ml-1">
            {value.toFixed(1)} <span className="text-slate-400 font-normal">/ {max}</span>
          </span>
        )}
      </div>
    </div>
  );
};
