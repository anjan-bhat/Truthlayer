import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import AppSidebar from "./AppSidebar";
import MobileNav from "./MobileNav";

export default function AppLayout() {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar user={user} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <main className={collapsed ? "lg:ml-16 min-h-screen pb-20 lg:pb-0 transition-all duration-300" : "lg:ml-64 min-h-screen pb-20 lg:pb-0 transition-all duration-300"}>
        <Outlet context={{ user }} />
      </main>
      <MobileNav />
    </div>
  );
}