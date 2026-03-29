import LandingNav from "../components/landing/LandingNav";
import HeroSection from "../components/landing/HeroSection";
import WhyDifferentSection from "../components/landing/WhyDifferentSection";
import PillarsSection from "../components/landing/PillarsSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import ExpertsSection from "../components/landing/ExpertSection";
import CTASection from "../components/landing/CTASection";
import { Shield } from "lucide-react";

const HERO_IMAGE = "https://media.base44.com/images/public/69c82c29a57ce9794ef22d8f/b6039376f_generated_a4bc6c79.png";
const PILLARS_IMAGE = "https://media.base44.com/images/public/69c82c29a57ce9794ef22d8f/c247bd922_generated_b4c2b871.png";
const EXPERT_IMAGE = "https://media.base44.com/images/public/69c82c29a57ce9794ef22d8f/78bc8b8c6_generated_69d8ffaf.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <HeroSection heroImage={HERO_IMAGE} />
      <WhyDifferentSection />
      <PillarsSection pillarsImage={PILLARS_IMAGE} />
      <HowItWorksSection />
      <ExpertsSection expertImage={EXPERT_IMAGE} />
      <CTASection />

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md truth-gradient-bg flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
            <span className="font-heading font-700 text-sm">TruthLayer</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 TruthLayer. Building trust in the digital age.
          </p>
        </div>
      </footer>
    </div>
  );
}

