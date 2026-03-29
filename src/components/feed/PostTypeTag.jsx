import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  news: { label: "NEWS", color: "bg-truth-cyan/10 text-truth-cyan border-truth-cyan/20" },
  rumor: { label: "RUMOR", color: "bg-truth-amber/10 text-truth-amber border-truth-amber/20" },
  opinion: { label: "OPINION", color: "bg-truth-violet/10 text-truth-violet border-truth-violet/20" },
  satire: { label: "SATIRE", color: "bg-truth-magenta/10 text-truth-magenta border-truth-magenta/20" },
  misleading: { label: "MISLEADING", color: "bg-truth-red/10 text-truth-red border-truth-red/20" },
  verified: { label: "VERIFIED", color: "bg-truth-mint/10 text-truth-mint border-truth-mint/20" },
  not_enough_evidence: { label: "UNVERIFIED", color: "bg-muted text-muted-foreground border-border/30" },
  pending: { label: "ANALYZING...", color: "bg-muted text-muted-foreground border-border/30" },
};

export default function PostTypeTag({ type }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.pending;
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold tracking-wider border", config.color)}>
      {config.label}
    </span>
  );
}