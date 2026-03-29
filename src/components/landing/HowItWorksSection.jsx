import { motion } from "framer-motion";
import { Upload, Cpu, Users, BadgeCheck, BarChart3 } from "lucide-react";

const steps = [
  { icon: Upload, label: "Post", description: "User uploads content — text, photo, video, or mixed media with a caption.", color: "text-truth-cyan", bg: "bg-truth-cyan/10" },
  { icon: Cpu, label: "AI Analyzes", description: "Our AI engine classifies the content type, detects credibility signals, and extracts relevant tags.", color: "text-truth-violet", bg: "bg-truth-violet/10" },
  { icon: Users, label: "Community Rates", description: "Users rate the credibility from 1–5 stars, adding context and evidence to support their assessment.", color: "text-truth-magenta", bg: "bg-truth-magenta/10" },
  { icon: BadgeCheck, label: "Expert Review", description: "Verified domain experts can add authoritative notes and provide independent credibility ratings.", color: "text-truth-mint", bg: "bg-truth-mint/10" },
  { icon: BarChart3, label: "Score Appears", description: "A composite credibility score emerges — combining AI analysis, community wisdom, and expert judgment.", color: "text-truth-amber", bg: "bg-truth-amber/10" },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-32 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="font-mono text-sm text-truth-magenta tracking-wider uppercase">Process</span>
          <h2 className="text-4xl md:text-5xl font-heading font-800 mt-4 mb-6">
            How it <span className="truth-gradient-text">works</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-truth-cyan via-truth-violet to-truth-magenta opacity-30" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`flex items-start gap-6 md:gap-12 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className={`glass rounded-2xl p-6 border border-border/30 inline-block ${i % 2 === 0 ? "md:ml-auto" : ""}`}>
                    <div className={`inline-flex items-center gap-2 ${step.bg} px-3 py-1 rounded-full mb-3`}>
                      <span className={`font-mono text-xs font-semibold ${step.color}`}>
                        0{i + 1}
                      </span>
                      <span className={`font-mono text-xs ${step.color}`}>{step.label}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{step.description}</p>
                  </div>
                </div>

                {/* Center icon */}
                <div className="relative z-10 flex-shrink-0 hidden md:flex">
                  <div className={`w-12 h-12 rounded-xl ${step.bg} border border-border/30 flex items-center justify-center`}>
                    <step.icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                </div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}