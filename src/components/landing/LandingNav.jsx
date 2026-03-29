import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function LandingNav() {
  const handleEnter = async () => {
    const authed = await base44.auth.isAuthenticated();
    if (authed) {
      window.location.href = "/feed";
    } else {
      base44.auth.redirectToLogin("/feed");
    }
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg truth-gradient-bg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-800 text-lg text-foreground">TruthLayer</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
          <Link to="/expert-application" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Experts
          </Link>
          <Button size="sm" onClick={handleEnter} className="truth-gradient-bg text-white font-semibold rounded-lg hover:opacity-90">
            Enter Platform
          </Button>
        </div>
      </div>
    </nav>
  );
}