import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BadgeCheck, Send, MessageSquare, FileText, BookOpen, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { localMoment } from "@/lib/time";

const TABS = [
  { key: "comment", label: "Comments", icon: MessageSquare },
  { key: "evidence", label: "Context", icon: FileText },
  { key: "expert_note", label: "Expert Notes", icon: BookOpen },
];

function CommentItem({ comment, user, onReply }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadReplies = async () => {
    if (loadingReplies) return;
    setLoadingReplies(true);
    const r = await base44.entities.Comment.filter({ parent_comment_id: comment.id }, "created_date", 20);
    setReplies(r);
    setLoadingReplies(false);
    setShowReplies(true);
  };

  const handleReply = async () => {
    if (!replyText.trim() || !user) return;
    setSubmitting(true);
    const newReply = await base44.entities.Comment.create({
      post_id: comment.post_id,
      author_email: user.email,
      author_name: user.full_name || "Anonymous",
      comment_type: comment.comment_type,
      content: replyText.trim(),
      parent_comment_id: comment.id,
    });
    setReplies(prev => [...prev, newReply]);
    setReplyText("");
    setSubmitting(false);
    setReplyOpen(false);
    setShowReplies(true);
    onReply?.();
  };

  return (
    <div className="glass rounded-xl p-4 border border-border/20">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary">
          {comment.author_name?.[0]?.toUpperCase() || "A"}
        </div>
        <span className="text-xs font-semibold">{comment.author_name || "Anonymous"}</span>
        {comment.comment_type === "expert_note" && (
          <BadgeCheck className="w-3 h-3 text-truth-mint" />
        )}
        <span className="text-[10px] text-muted-foreground ml-auto font-mono">
          {localMoment(comment.created_date).fromNow()}
        </span>
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-3">
        {user && (
          <button
            onClick={() => setReplyOpen(v => !v)}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
          >
            <Reply className="w-3 h-3" /> Reply
          </button>
        )}
        <button
          onClick={() => showReplies ? setShowReplies(false) : loadReplies()}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
        >
          {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {replies.length > 0 ? `${replies.length} repl${replies.length > 1 ? "ies" : "y"}` : "replies"}
        </button>
      </div>

      {/* Reply input */}
      {replyOpen && (
        <div className="mt-3 flex gap-2">
          <Textarea
            placeholder="Write a reply..."
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            className="flex-1 min-h-[50px] bg-muted/30 border-border/30 rounded-xl resize-none text-xs"
          />
          <Button
            size="icon"
            onClick={handleReply}
            disabled={submitting || !replyText.trim()}
            className="truth-gradient-bg text-white rounded-xl h-auto self-end hover:opacity-90"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Replies */}
      {showReplies && replies.length > 0 && (
        <div className="mt-3 ml-4 space-y-2 border-l-2 border-primary/15 pl-3">
          {replies.map(reply => (
            <div key={reply.id} className="rounded-lg p-3 bg-muted/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-[9px] font-bold text-primary">
                  {reply.author_name?.[0]?.toUpperCase() || "A"}
                </div>
                <span className="text-[11px] font-semibold">{reply.author_name || "Anonymous"}</span>
                <span className="text-[10px] text-muted-foreground ml-auto font-mono">{localMoment(reply.created_date).fromNow()}</span>
              </div>
              <p className="text-xs text-foreground/85 leading-relaxed">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentSection({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState("comment");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    base44.entities.Comment.filter({ post_id: postId }, "-created_date", 100)
      .then(data => {
        if (mountedRef.current) {
          setComments(data);
          setLoaded(true);
        }
      });
    return () => { mountedRef.current = false; };
  }, [postId]);

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;
    setSubmitting(true);
    const comment = await base44.entities.Comment.create({
      post_id: postId,
      author_email: user.email,
      author_name: user.full_name || "Anonymous",
      comment_type: activeTab,
      content: content.trim(),
    });
    setComments(prev => [comment, ...prev]);
    setContent("");
    setSubmitting(false);
  };

  // Only show top-level comments (no parent) for this tab
  const filtered = comments.filter(c => c.comment_type === activeTab && !c.parent_comment_id);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-muted/30 rounded-xl">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
              activeTab === tab.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add comment */}
      {user && (
        <div className="flex gap-2 mb-5">
          <Textarea
            placeholder={
              activeTab === "evidence"
                ? "Share evidence or context links..."
                : activeTab === "expert_note"
                ? "Add an expert note (verified experts only)..."
                : "Write a comment..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 min-h-[64px] bg-muted/30 border-border/30 rounded-xl resize-none text-sm"
          />
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={submitting || !content.trim()}
            className="truth-gradient-bg text-white rounded-xl h-auto self-end hover:opacity-90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Comments list */}
      {!loaded ? (
        <div className="text-center py-8 text-xs text-muted-foreground">Loading comments...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            No {activeTab === "evidence" ? "context" : activeTab === "expert_note" ? "expert notes" : "comments"} yet. Be the first!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              user={user}
              onReply={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}