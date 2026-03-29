import { motion } from "framer-motion";
import { TrendingUp, Eye, Heart, Shield } from "lucide-react";

export default function WhyDifferentSection() {
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="font-mono text-sm text-truth-cyan tracking-wider uppercase">The Shift</span>
          <h2 className="text-4xl md:text-5xl font-heading font-800 mt-4 mb-6">
            Why we are <span className="truth-gradient-text">different</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Traditional social media optimizes for attention. TruthLayer optimizes for
            trust, clarity, and healthier engagement.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <ComparisonCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Traditional Social Media"
            title="Optimized for Attention"
            description="Algorithms reward outrage, sensationalism, and addictive scrolling. Content credibility is an afterthought."
            variant="old"
            delay={0}
          />
          <ComparisonCard
            icon={<Shield className="w-5 h-5" />}
            label="TruthLayer"
            title="Optimized for Trust"
            description="Every piece of content goes through AI analysis, community vetting, and expert review before you see a credibility score."
            variant="new"
            delay={0.1}
          />
          <ComparisonCard
            icon={<Eye className="w-5 h-5" />}
            label="Traditional Social Media"
            title="Shallow Reactions"
            description="Likes, shares, and emoji reactions encourage surface-level engagement without any critical thinking."
            variant="old"
            delay={0.2}
          />
          <ComparisonCard
            icon={<Heart className="w-5 h-5" />}
            label="TruthLayer"
            title="Meaningful Engagement"
            description="Star ratings, evidence-based comments, expert notes, and context contributions drive deeper understanding."
            variant="new"
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}

function ComparisonCard({ icon, label, title, description, variant, delay }) {
  const isNew = variant === "new";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`rounded-2xl p-8 border transition-all ${
        isNew
          ? "glass glow-cyan border-truth-cyan/20"
          : "bg-muted/30 border-border/30"
      }`}
    >
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 ${
        isNew ? "bg-truth-cyan/10 text-truth-cyan" : "bg-muted text-muted-foreground"
      }`}>
        {icon}
        {label}
      </div>
      <h3 className={`text-xl font-heading font-700 mb-3 ${isNew ? "text-foreground" : "text-muted-foreground"}`}>
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}