import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function CTASection() {
  const handleEnter = async () => {
    const authed = await base44.auth.isAuthenticated();
    if (authed) window.location.href = "/feed";
    else base44.auth.redirectToLogin("/feed");
  };
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-truth-cyan/3 to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-heading font-900 mb-6">
            Ready to see the <span className="truth-gradient-text">truth</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Join a community that values clarity over chaos. Every post rated.
            Every claim analyzed. Every voice heard.
          </p>
          <Button size="lg" onClick={handleEnter} className="truth-gradient-bg text-white font-semibold px-10 py-6 text-lg rounded-xl hover:opacity-90 transition-opacity">
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}