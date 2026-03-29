import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, Bell, User, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { path: "/feed", icon: Home, label: "Feed" },
  { path: "/notifications", icon: Bell, label: "Alerts" },
  { path: "/create-post", icon: PlusCircle, label: "Post" },
  { path: "/messages", icon: MessageCircle, label: "Chats" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/30">
      <div className="flex items-center justify-around py-2 px-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const isCreate = item.path === "/create-post";
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all",
                isCreate && "relative",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isCreate ? (
                <div className="w-10 h-10 rounded-full truth-gradient-bg flex items-center justify-center -mt-4 shadow-lg">
                  <PlusCircle className="w-5 h-5 text-white" />
                </div>
              ) : (
                <item.icon className="w-5 h-5" />
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}