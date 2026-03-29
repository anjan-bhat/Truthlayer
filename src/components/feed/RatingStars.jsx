import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RatingStars({ rating = 0, count = 0, userRating = 0, interactive = false, onRate, size = "sm" }) {
  const [hovered, setHovered] = useState(0);

  const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const displayRating = interactive ? (hovered || userRating || 0) : Math.round(rating);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={cn(
              "transition-transform",
              interactive && "hover:scale-115 cursor-pointer"
            )}
          >
            <Star
              className={cn(
                starSize,
                star <= displayRating
                  ? "fill-truth-amber text-truth-amber"
                  : interactive && star <= hovered
                  ? "fill-truth-amber/50 text-truth-amber/50"
                  : "text-muted-foreground/30"
              )}
            />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        {rating > 0 && (
          <span className="text-xs font-mono text-foreground/80 font-semibold">{rating.toFixed(1)}</span>
        )}
        {count > 0 && (
          <span className="text-xs text-muted-foreground font-mono">({count})</span>
        )}
        {userRating > 0 && (
          <span className="text-[10px] text-truth-blue font-mono ml-1">· your vote: {userRating}★</span>
        )}
      </div>
    </div>
  );
}