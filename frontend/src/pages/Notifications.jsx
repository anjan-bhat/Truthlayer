import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Bell, Star, MessageSquare, BadgeCheck, TrendingUp, Clock, Loader2, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { localMoment } from "@/lib/time";

const TYPE_ICONS = {
  rating: Star,
  comment: MessageSquare,
  expert_review: BadgeCheck,
  trending: TrendingUp,
  reminder: Clock,
  system: Bell,
};

const TYPE_COLORS = {
  rating: "text-truth-amber",
  comment: "text-truth-cyan",
  expert_review: "text-truth-mint",
  trending: "text-truth-magenta",
  reminder: "text-truth-violet",
  system: "text-muted-foreground",
};

export default function Notifications() {
  const { user } = useOutletContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      base44.entities.Notification.filter({ user_email: user.email }, "-created_date", 50).then(n => {
        setNotifications(n);
        setLoading(false);
      });
    }
  }, [user]);

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    for (const n of unread) {
      await base44.entities.Notification.update(n.id, { is_read: true });
    }
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const markRead = async (notif) => {
    if (!notif.is_read) {
      await base44.entities.Notification.update(notif.id, { is_read: true });
      setNotifications(notifications.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-800">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs">
            <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const Icon = TYPE_ICONS[notif.type] || Bell;
            const color = TYPE_COLORS[notif.type] || "text-muted-foreground";
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif)}
                className={cn(
                  "glass rounded-xl p-4 border border-border/20 transition-all cursor-pointer hover:border-border/40",
                  !notif.is_read && "border-primary/20 bg-primary/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-muted/50", color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                    <span className="text-[10px] text-muted-foreground font-mono mt-1 block">
                      {localMoment(notif.created_date).fromNow()}
                    </span>
                  </div>
                  {!notif.is_read && (
                    <div className="w-2 h-2 rounded-full truth-gradient-bg mt-1.5" />
                  )}
                </div>
                {notif.post_id && (
                  <Link to={`/post/${notif.post_id}`} className="text-[10px] text-primary font-mono mt-2 block hover:underline">
                    View post →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
