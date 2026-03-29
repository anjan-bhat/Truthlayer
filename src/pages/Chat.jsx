import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";

export default function Chat() {
  const { id } = useParams();
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    base44.entities.Conversation.filter({ id }).then(res => {
      if (res.length > 0) setConversation(res[0]);
    });
    base44.entities.Message.filter({ conversation_id: id }, "created_date", 100).then(msgs => {
      setMessages(msgs);
      setLoading(false);
    });
    const unsub = base44.entities.Message.subscribe((event) => {
      if (event.data?.conversation_id !== id) return;
      if (event.type === "create") setMessages(prev => [...prev, event.data]);
    });
    return unsub;
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const otherName = () => {
    if (!conversation || !user) return "User";
    const idx = conversation.participant_emails?.findIndex(e => e !== user.email);
    return conversation.participant_names?.[idx] || "User";
  };

  const handleSend = async () => {
    if (!input.trim() || !user || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    await base44.entities.Message.create({
      conversation_id: id,
      sender_email: user.email,
      sender_name: user.full_name || "User",
      content,
      is_read: false,
    });
    await base44.entities.Conversation.update(id, {
      last_message: content,
      last_message_time: new Date().toISOString(),
      last_message_sender: user.email,
    });
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate("/messages")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
          {otherName()?.[0]?.toUpperCase() || "U"}
        </div>
        <h1 className="text-lg font-heading font-700">{otherName()}</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 py-2">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
        ) : messages.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground py-10">No messages yet. Say hello!</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_email === user?.email;
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "glass border border-border/30 rounded-bl-sm"
                )}>
                  <p>{msg.content}</p>
                  <p className={cn("text-[10px] mt-1 font-mono", isMe ? "text-primary-foreground/60 text-right" : "text-muted-foreground")}>
                    {moment(msg.created_date).format("h:mm A")}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-muted/30 border border-border/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors"
        />
        <Button onClick={handleSend} disabled={!input.trim() || sending} className="truth-gradient-bg text-white rounded-xl hover:opacity-90">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}