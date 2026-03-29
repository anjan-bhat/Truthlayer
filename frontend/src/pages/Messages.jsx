import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { MessageCircle, Loader2 } from "lucide-react";
import { localMoment } from "@/lib/time";

export default function Messages() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    base44.entities.Conversation.list("-updated_date", 50).then((all) => {
      const mine = all.filter(c => c.participant_emails?.includes(user.email));
      setConversations(mine);
      setLoading(false);
    });
  }, [user]);

  const getOtherParticipant = (conv) => {
    const idx = conv.participant_emails?.findIndex(e => e !== user.email);
    return {
      name: conv.participant_names?.[idx] || "User",
      email: conv.participant_emails?.[idx] || "",
    };
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-heading font-800 mb-6">Messages</h1>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm text-muted-foreground">No conversations yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Visit a user's profile to start a chat.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const other = getOtherParticipant(conv);
            return (
              <button
                key={conv.id}
                onClick={() => navigate(`/chat/${conv.id}`)}
                className="w-full glass rounded-2xl border border-border/30 p-4 flex items-center gap-4 hover:border-primary/20 transition-all text-left"
              >
                <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                  {other.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{other.name}</p>
                  {conv.last_message && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.last_message}</p>
                  )}
                </div>
                {conv.last_message_time && (
                  <span className="text-[10px] text-muted-foreground font-mono flex-shrink-0">
                    {localMoment(conv.last_message_time).format("MMM D")}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
