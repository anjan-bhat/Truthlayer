import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, Bell, User, Shield, Settings, BadgeCheck, LayoutDashboard, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/feed", icon: Home, label: "Feed" },
  { path: "/create-post", icon: PlusCircle, label: "Create Post" },
  { path: "/notifications", icon: Bell, label: "Notifications" },
  { path: "/profile", icon: User, label: "Profile" },
  { path: "/messages", icon: MessageCircle, label: "Messages" },
  { path: "/expert-application", icon: BadgeCheck, label: "Experts" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

const adminItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Admin" },
];

export default function AppSidebar({ user, collapsed, onToggle }) {
  const location = useLocation();
  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  return (
    <aside className={cn(
      "hidden lg:flex flex-col h-screen fixed left-0 top-0 border-r border-border/30 bg-card/50 backdrop-blur-xl z-40 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-border/20 min-h-[64px]">
        {!collapsed && (
          <Link to="/feed" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg truth-gradient-bg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-800 text-lg">TruthLayer</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/feed" className="w-8 h-8 rounded-lg truth-gradient-bg flex items-center justify-center mx-auto">
            <Shield className="w-4 h-4 text-white" />
          </Link>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "w-7 h-7 rounded-lg border border-border/40 bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex-shrink-0",
            collapsed && "mx-auto mt-1"
          )}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                collapsed ? "justify-center" : "",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="h-px bg-border/30 my-3" />
            {adminItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    collapsed ? "justify-center" : "",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                  {!collapsed && item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User */}
      {user && !collapsed && (
        <div className="px-4 py-4 border-t border-border/20">
          <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary overflow-hidden flex-shrink-0">
              {user.profile_photo ? (
                <img src={user.profile_photo} alt="" className="w-full h-full object-cover" />
              ) : (
                user.full_name?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.full_name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </Link>
        </div>
      )}
      {user && collapsed && (
        <div className="px-2 py-4 border-t border-border/20 flex justify-center">
          <Link to="/profile" title={user.full_name || "Profile"} className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
            {user.profile_photo ? (
              <img src={user.profile_photo} alt="" className="w-full h-full object-cover" />
            ) : (
              user.full_name?.[0]?.toUpperCase() || "U"
            )}
          </Link>
        </div>
      )}
    </aside>
  );
}