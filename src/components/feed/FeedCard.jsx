import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck, MessageSquare, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { base44 } from "@/api/base44Client";
import PostTypeTag from "./PostTypeTag";
import RatingStars from "./RatingStars";
import moment from "moment";

export default function FeedCard({ post, user, onRatingUpdate }) {
  const navigate = useNavigate();
  const [avgRating, setAvgRating] = useState(post.avg_rating || 0);
  const [ratingCount, setRatingCount] = useState(post.rating_count || 0);
  const [userRating, setUserRating] = useState(post._userRating || 0);
  const [submitting, setSubmitting] = useState(false);

  const handleRate = useCallback(async (stars) => {
    if (!user || submitting) return;
    setSubmitting(true);

    const existing = await base44.entities.Rating.filter({ post_id: post.id, user_email: user.email }, "-created_date", 1);

    let newCount = ratingCount;
    let newAvg = avgRating;

    if (existing.length > 0) {
      // Update existing rating
      const oldStars = existing[0].stars;
      await base44.entities.Rating.update(existing[0].id, { stars });
      // Recalculate avg: remove old, add new
      newAvg = ((avgRating * ratingCount) - oldStars + stars) / ratingCount;
    } else {
      // New rating
      await base44.entities.Rating.create({
        post_id: post.id,
        user_email: user.email,
        user_name: user.full_name || "Anonymous",
        stars,
        is_expert_rating: user.is_expert || false,
      });
      newCount = ratingCount + 1;
      newAvg = ((avgRating * ratingCount) + stars) / newCount;
    }

    newAvg = Math.round(newAvg * 10) / 10;
    setAvgRating(newAvg);
    setRatingCount(newCount);
    setUserRating(stars);
    setSubmitting(false);

    await base44.entities.Post.update(post.id, {
      avg_rating: newAvg,
      rating_count: newCount,
    });

    onRatingUpdate?.(post.id, newAvg, newCount);
  }, [user, post.id, avgRating, ratingCount, submitting]);

  const isLowCredibility = avgRating > 0 && avgRating < 2.5;

  const goToAuthor = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/profile?email=${post.author_email}`);
  };

  return (
    <div className={cn(
      "glass rounded-2xl border border-border/30 overflow-hidden transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
      isLowCredibility && "opacity-75 hover:opacity-100",
      post.expert_rating_count > 0 && "expert-pulse"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <button onClick={goToAuthor} className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left">
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold overflow-hidden ring-2 ring-transparent hover:ring-primary/40 transition-all">
            {post.author_photo ? (
              <img src={post.author_photo} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary font-bold">{(post.author_name?.[0] || "U").toUpperCase()}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold hover:text-primary transition-colors">{post.author_name || "Anonymous"}</span>
              {post.is_expert && <BadgeCheck className="w-3.5 h-3.5 text-truth-mint" />}
            </div>
            <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {moment(post.created_date).calendar(null, {
                sameDay: '[Today at] h:mm A',
                lastDay: '[Yesterday at] h:mm A',
                lastWeek: 'MMM D [at] h:mm A',
                sameElse: 'MMM D, YYYY [at] h:mm A'
              })}
            </span>
          </div>
        </button>
        <PostTypeTag type={post.ai_detected_type || "pending"} />
      </div>

      {/* Category */}
      {post.category && (
        <div className="px-5 pb-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            <Tag className="w-3 h-3" />
            {post.category?.replace(/_/g, " ")}
          </span>
        </div>
      )}

      {/* Content */}
      <Link to={`/post/${post.id}`} className="block">
        {post.media_url && (
          <div className="px-5 pb-3">
            <div className="rounded-xl overflow-hidden">
              {post.content_type === "video" ? (
                <video src={post.media_url} controls className="w-full max-h-96 object-cover rounded-xl" />
              ) : (
                <img src={post.media_url} alt="" className="w-full max-h-96 object-cover rounded-xl" />
              )}
            </div>
          </div>
        )}
        {post.text_content && (
          <div className="px-5 pb-3">
            <p className="text-sm leading-relaxed line-clamp-4">{post.text_content}</p>
          </div>
        )}
      </Link>

      {post.caption && (
        <div className="px-5 pb-3">
          <p className="text-xs text-muted-foreground italic">{post.caption}</p>
        </div>
      )}

      {/* AI Label */}
      {post.ai_credibility_label && (
        <div className="px-5 pb-3">
          <div className="rounded-lg px-3 py-2 text-xs text-muted-foreground border border-primary/15 bg-primary/5">
            <span className="font-mono text-primary text-[10px] font-semibold">AI: </span>
            {post.ai_credibility_label}
          </div>
        </div>
      )}

      {/* Rating */}
      <div className="px-5 pb-3">
        <RatingStars
          rating={avgRating}
          count={ratingCount}
          userRating={userRating}
          interactive={!!user && !submitting}
          onRate={handleRate}
        />
        {post.expert_avg_rating > 0 && (
          <div className="flex items-center gap-1.5 mt-1">
            <BadgeCheck className="w-3 h-3 text-truth-mint" />
            <span className="text-[10px] font-mono text-truth-mint">
              Expert: {post.expert_avg_rating?.toFixed(1)} ({post.expert_rating_count})
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {post.ai_tags?.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1">
          {post.ai_tags.slice(0, 4).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <Link
        to={`/post/${post.id}`}
        className="flex items-center gap-2 px-5 py-3 border-t border-border/20 text-muted-foreground hover:text-primary transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="text-xs font-medium">{post.comment_count || 0} comments · Read more</span>
      </Link>
    </div>
  );
}