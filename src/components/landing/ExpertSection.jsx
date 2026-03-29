import { motion } from "framer-motion";
import { BadgeCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const badges = [
  "Verified Health Contributor",
  "Verified Science Contributor",
  "Verified Legal Contributor",
  "Verified Journalist",
  "Verified Technology Expert",
  "Verified Finance Analyst",
];

export default function ExpertsSection({ expertImage }) {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-truth-cyan/3 blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-sm text-truth-mint tracking-wider uppercase">Expertise</span>
            <h2 className="text-4xl md:text-5xl font-heading font-800 mt-4 mb-6">
              Become a <span className="truth-gradient-text">verified expert</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Apply to become a verified contributor in your domain. Your ratings and notes
              carry extra weight, helping the community distinguish fact from fiction.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {badges.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-mono text-truth-mint border border-truth-mint/20">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {badge}
                </span>
              ))}
            </div>

            <Link to="/expert-application">
              <Button className="truth-gradient-bg text-white font-semibold px-6 py-5 rounded-xl hover:opacity-90">
                Apply to be an Expert
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {expertImage && (
              <div className="rounded-2xl overflow-hidden glow-violet">
                <img
                  src={expertImage}
                  alt="High-tech obsidian lens reflecting digital landscape"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}