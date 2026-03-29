import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, BadgeCheck, Clock, Tag, Loader2, Sparkles } from "lucide-react";
import PostTypeTag from "../components/feed/PostTypeTag";
import RatingStars from "../components/feed/RatingStars";
import CommentSection from "../components/feed/CommentSection";
import moment from "moment";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [raters, setRaters] = useState([]);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    loadPost();
    loadRaters();
  }, [id]);

  const loadPost = async () => {
    const posts = await base44.entities.Post.filter({ id }, "-created_date", 1);
    setPost(posts[0] || null);
    setLoading(false);
  };

  const loadRaters = async () => {
    const ratings = await base44.entities.Rating.filter({ post_id: id }, "-created_date", 20);
    setRaters(ratings);
    if (user) {
      const mine = ratings.find((r) => r.user_email === user.email);
      if (mine) setUserRating(mine.stars);
    }
  };

  const handleRate = async (stars) => {
    if (!user) return;
    const existing = await base44.entities.Rating.filter({ post_id: id, user_email: user.email }, "-created_date", 1);
    let newCount = post.rating_count || 0;
    let newAvg = post.avg_rating || 0;
    if (existing.length > 0) {
      const oldStars = existing[0].stars;
      await base44.entities.Rating.update(existing[0].id, { stars });
      newAvg = ((newAvg * newCount) - oldStars + stars) / newCount;
    } else {
      await base44.entities.Rating.create({
        post_id: id,
        user_email: user.email,
        user_name: user.full_name || "Anonymous",
        stars,
        is_expert_rating: user.is_expert || false,
      });
      newCount = newCount + 1;
      newAvg = ((newAvg * (newCount - 1)) + stars) / newCount;
    }
    newAvg = Math.round(newAvg * 10) / 10;
    setUserRating(stars);
    await base44.entities.Post.update(id, { avg_rating: newAvg, rating_count: newCount });
    setPost({ ...post, avg_rating: newAvg, rating_count: newCount });
    loadRaters();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Post not found.</p>
      </div>
    );
  }

  const expertRaters = raters.filter((r) => r.is_expert_rating);
  const communityRaters = raters.filter((r) => !r.is_expert_rating);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to feed
      </button>

      <div className="glass rounded-2xl border border-border/30 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <Link to={`/profile?email=${post.author_email}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold overflow-hidden ring-2 ring-transparent hover:ring-primary/40 transition-all">
              {post.author_photo ? (
                <img src={post.author_photo} alt="" className="w-full h-full object-cover" />
              ) : <span className="text-primary font-bold">{(post.author_name?.[0] || "U").toUpperCase()}</span>}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold hover:text-primary transition-colors">{post.author_name || "Anonymous"}</span>
                {post.is_expert && <BadgeCheck className="w-4 h-4 text-truth-mint" />}
              </div>
              <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> {moment(post.created_date).fromNow()}
              </span>
            </div>
          </Link>
          <PostTypeTag type={post.ai_detected_type || "pending"} />
        </div>

        {/* Category + Tags */}
        <div className="px-6 pb-3 flex items-center gap-3 flex-wrap">
          {post.category && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              <Tag className="w-3 h-3" /> {post.category?.replace("_", " ")}
            </span>
          )}
          {post.ai_tags?.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground">#{tag}</span>
          ))}
        </div>

        {/* Media */}
        {post.media_url && (
          <div className="px-6 pb-4">
            {post.content_type === "video" ? (
              <video src={post.media_url} controls className="w-full rounded-xl" />
            ) : (
              <img src={post.media_url} alt="" className="w-full rounded-xl" />
            )}
          </div>
        )}

        {/* Text */}
        {post.text_content && (
          <div className="px-6 pb-4">
            <p className="leading-relaxed">{post.text_content}</p>
          </div>
        )}

        {/* Caption */}
        {post.caption && (
          <div className="px-6 pb-4">
            <p className="text-sm text-muted-foreground italic">{post.caption}</p>
          </div>
        )}

        {/* AI Analysis */}
        {post.ai_credibility_label && (
          <div className="px-6 pb-4">
            <div className="glass rounded-xl p-4 border border-truth-cyan/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-truth-cyan" />
                <span className="font-mono text-xs text-truth-cyan font-semibold">AI ANALYSIS</span>
              </div>
              <p className="text-sm text-foreground/90">{post.ai_credibility_label}</p>
              {post.ai_summary && (
                <p className="text-xs text-muted-foreground mt-2">{post.ai_summary}</p>
              )}
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="px-6 pb-4">
          <h3 className="text-sm font-semibold mb-2">Credibility Rating</h3>
          <RatingStars
            rating={post.avg_rating || 0}
            count={post.rating_count || 0}
            userRating={userRating}
            interactive={!!user}
            onRate={handleRate}
            size="md"
          />
        </div>

        {/* Who rated */}
        {raters.length > 0 && (
          <div className="px-6 pb-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">Rated by</h3>
            <div className="flex flex-wrap gap-2">
              {expertRaters.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <BadgeCheck className="w-3 h-3 text-truth-mint" />
                  <div className="flex -space-x-1.5">
                    {expertRaters.slice(0, 5).map((r) => (
                      <div key={r.id} className="w-6 h-6 rounded-full bg-truth-mint/20 border border-truth-mint/30 flex items-center justify-center text-[8px] font-bold text-truth-mint">
                        {r.user_name?.[0] || "E"}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-truth-mint font-mono">{expertRaters.length} expert{expertRaters.length > 1 ? "s" : ""}</span>
                </div>
              )}
              <div className="flex -space-x-1.5">
                {communityRaters.slice(0, 8).map((r) => (
                  <div key={r.id} className="w-6 h-6 rounded-full bg-muted border border-border/30 flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                    {r.user_name?.[0] || "U"}
                  </div>
                ))}
              </div>
              {communityRaters.length > 8 && (
                <span className="text-[10px] text-muted-foreground font-mono">+{communityRaters.length - 8}</span>
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border/20" />

        {/* Comments section */}
        <div className="px-6 py-5">
          <CommentSection postId={id} user={user} />
        </div>
      </div>
    </div>
  );
}
