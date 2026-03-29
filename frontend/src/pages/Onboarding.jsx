import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "politics", "health", "science", "sports", "entertainment",
  "local_news", "technology", "finance", "global_events", "education", "social_issues"
];

const CATEGORY_LABELS = {
  politics: "Politics", health: "Health", science: "Science", sports: "Sports",
  entertainment: "Entertainment", local_news: "Local News", technology: "Technology",
  finance: "Finance", global_events: "Global Events", education: "Education", social_issues: "Social Issues"
};

const CONTENT_PREFS = [
  { value: "verified", label: "Verified Content", desc: "Prioritize content that has been verified by experts" },
  { value: "trending", label: "Trending Content", desc: "Show me what's popular and generating discussion" },
  { value: "balanced", label: "Balanced Mix", desc: "A healthy blend of verified, trending, and recent content" },
];

const NOTIF_PREFS = [
  { value: "all", label: "All Notifications", desc: "Get notified about everything" },
  { value: "important", label: "Important Only", desc: "Ratings, expert reviews, and mentions" },
  { value: "minimal", label: "Minimal", desc: "Only critical alerts" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [preferred, setPreferred] = useState([]);
  const [avoided, setAvoided] = useState([]);
  const [contentPref, setContentPref] = useState("balanced");
  const [followExperts, setFollowExperts] = useState(true);
  const [notifPref, setNotifPref] = useState("important");
  const [saving, setSaving] = useState(false);

  const toggleCategory = (cat, list, setter) => {
    setter(list.includes(cat) ? list.filter(c => c !== cat) : [...list, cat]);
  };

  const handleFinish = async () => {
    setSaving(true);
    const user = await base44.auth.me();
    await base44.entities.UserPreference.create({
      user_email: user.email,
      preferred_categories: preferred,
      avoided_categories: avoided,
      content_preference: contentPref,
      follow_experts: followExperts,
      notification_frequency: notifPref,
      onboarding_complete: true,
    });
    await base44.auth.updateMe({ onboarding_complete: true });
    navigate("/feed");
  };

  const steps = [
    {
      title: "What topics interest you?",
      subtitle: "Select categories you want to see more of",
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat, preferred, setPreferred)}
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                preferred.includes(cat)
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "glass border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60"
              )}
            >
              {preferred.includes(cat) && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Anything to avoid?",
      subtitle: "Select categories you'd rather not see",
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.filter(c => !preferred.includes(c)).map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat, avoided, setAvoided)}
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                avoided.includes(cat)
                  ? "bg-destructive/10 border-destructive/30 text-destructive"
                  : "glass border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60"
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Content preference",
      subtitle: "How should we curate your feed?",
      content: (
        <div className="space-y-3">
          {CONTENT_PREFS.map((pref) => (
            <button
              key={pref.value}
              onClick={() => setContentPref(pref.value)}
              className={cn(
                "w-full text-left px-5 py-4 rounded-xl border transition-all",
                contentPref === pref.value
                  ? "bg-primary/10 border-primary/30"
                  : "glass border-border/30 hover:border-border/60"
              )}
            >
              <p className="font-medium text-sm">{pref.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{pref.desc}</p>
            </button>
          ))}
          <button
            onClick={() => setFollowExperts(!followExperts)}
            className={cn(
              "w-full text-left px-5 py-4 rounded-xl border transition-all mt-4",
              followExperts
                ? "bg-truth-mint/10 border-truth-mint/30"
                : "glass border-border/30"
            )}
          >
            <p className="font-medium text-sm">Follow verified experts</p>
            <p className="text-xs text-muted-foreground mt-0.5">See expert-reviewed content and notes in your feed</p>
          </button>
        </div>
      ),
    },
    {
      title: "Notification preferences",
      subtitle: "How often should we reach out?",
      content: (
        <div className="space-y-3">
          {NOTIF_PREFS.map((pref) => (
            <button
              key={pref.value}
              onClick={() => setNotifPref(pref.value)}
              className={cn(
                "w-full text-left px-5 py-4 rounded-xl border transition-all",
                notifPref === pref.value
                  ? "bg-primary/10 border-primary/30"
                  : "glass border-border/30 hover:border-border/60"
              )}
            >
              <p className="font-medium text-sm">{pref.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{pref.desc}</p>
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-truth-cyan/5 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-truth-violet/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg truth-gradient-bg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-800 text-lg">TruthLayer</span>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={cn(
              "flex-1 h-1 rounded-full transition-all",
              i <= step ? "truth-gradient-bg" : "bg-muted"
            )} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-heading font-800 mb-1">{steps[step].title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{steps[step].subtitle}</p>
            {steps[step].content}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>

          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} className="truth-gradient-bg text-white rounded-xl hover:opacity-90">
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={saving} className="truth-gradient-bg text-white rounded-xl hover:opacity-90">
              {saving ? "Setting up..." : "Start Exploring"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
