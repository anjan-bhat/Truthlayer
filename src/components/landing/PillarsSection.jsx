import { motion } from "framer-motion";
import { ShieldCheck, Heart, Lock, MessageSquare } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Misinformation Control",
    description: "AI classifies every post as news, rumor, opinion, satire, misleading, or verified — giving you clarity before you believe or share.",
    color: "text-truth-cyan",
    glow: "glow-cyan",
    bgAccent: "bg-truth-cyan/5",
    borderAccent: "border-truth-cyan/20",
  },
  {
    icon: Heart,
    title: "Mental Health Protection",
    description: "A calm, intelligent interface designed to reduce toxicity and cognitive overload. Content comes with context, not chaos.",
    color: "text-truth-magenta",
    glow: "glow-magenta",
    bgAccent: "bg-truth-magenta/5",
    borderAccent: "border-truth-magenta/20",
  },
  {
    icon: Lock,
    title: "Privacy-First Design",
    description: "Secure accounts, granular profile controls, and transparent data boundaries. Your information stays yours.",
    color: "text-truth-violet",
    glow: "glow-violet",
    bgAccent: "bg-truth-violet/5",
    borderAccent: "border-truth-violet/20",
  },
  {
    icon: MessageSquare,
    title: "Meaningful Engagement",
    description: "Star ratings, evidence contributions, expert reviews, and context notes replace shallow likes and empty reactions.",
    color: "text-truth-amber",
    glow: "",
    bgAccent: "bg-truth-amber/5",
    borderAccent: "border-truth-amber/20",
  },
];

export default function PillarsSection({ pillarsImage }) {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-truth-violet/3 blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="font-mono text-sm text-truth-violet tracking-wider uppercase">Foundation</span>
          <h2 className="text-4xl md:text-5xl font-heading font-800 mt-4 mb-6">
            Built on <span className="truth-gradient-text">four pillars</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Every decision we make is guided by these core principles.
          </p>
        </motion.div>

        {pillarsImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-16 rounded-2xl overflow-hidden"
          >
            <img src={pillarsImage} alt="Four geometric shapes representing TruthLayer pillars" className="w-full h-48 md:h-64 object-cover rounded-2xl opacity-60" />
          </motion.div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass rounded-2xl p-6 border ${pillar.borderAccent} hover:scale-[1.02] transition-transform`}
            >
              <div className={`w-12 h-12 rounded-xl ${pillar.bgAccent} flex items-center justify-center mb-4`}>
                <pillar.icon className={`w-6 h-6 ${pillar.color}`} />
              </div>
              <h3 className="text-lg font-heading font-700 mb-2">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}