import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "politics", label: "Politics" },
  { value: "health", label: "Health" },
  { value: "science", label: "Science" },
  { value: "technology", label: "Tech" },
  { value: "sports", label: "Sports" },
  { value: "entertainment", label: "Entertainment" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "global_events", label: "Global" },
  { value: "social_issues", label: "Social" },
];

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
            selected === cat.value
              ? "truth-gradient-bg text-white border-transparent"
              : "glass border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}