import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { startHostedLogin } from "@/lib/auth-flow";

export default function HeroSection({ heroImage }) {
  const handleEnter = async () => {
    const authed = await base44.auth.isAuthenticated();
    if (authed) window.location.href = "/feed";
    else startHostedLogin("/feed");
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 pt-24 pb-12">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-truth-cyan/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-truth-violet/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-truth-magenta/3 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <Shield className="w-4 h-4 text-truth-cyan" />
            <span className="text-sm font-mono text-truth-cyan">VERACITY ENGINE v1.0</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-heading font-900 leading-[1.08] mb-6"
        >
          <span className="text-foreground">The social platform where</span>
          <br />
          <span className="truth-gradient-text">every post comes with</span>
          <br />
          <span className="truth-gradient-text">credibility.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          TruthLayer helps people understand whether content is trustworthy
          through AI analysis, community ratings, and expert review.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" onClick={handleEnter} className="truth-gradient-bg text-white font-semibold px-8 py-6 text-lg rounded-xl hover:opacity-90 transition-opacity">
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <a href="#how-it-works">
            <Button size="lg" variant="outline" className="border-border/50 bg-transparent text-foreground px-8 py-6 text-lg rounded-xl hover:bg-muted/50">
              Explore the Platform
            </Button>
          </a>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 relative"
        >
          <div className="relative rounded-2xl overflow-hidden glow-cyan">
            <img
              src={heroImage}
              alt="Abstract glass prism refracting light into vibrant neon spectrum"
              className="w-full h-auto rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}