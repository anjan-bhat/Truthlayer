import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BadgeCheck, Loader2, CheckCircle, Clock, XCircle } from "lucide-react";

const AREAS = ["health", "science", "politics", "legal", "journalism", "technology", "finance", "education", "other"];

export default function ExpertApplication() {
  const { user } = useOutletContext();
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [area, setArea] = useState("");
  const [org, setOrg] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      base44.entities.ExpertApplication.filter({ user_email: user.email }, "-created_date", 1).then(apps => {
        if (apps.length > 0) setExisting(apps[0]);
        setLoading(false);
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!area || !reason) return;
    setSubmitting(true);
    const app = await base44.entities.ExpertApplication.create({
      user_email: user.email,
      full_name: fullName,
      expertise_area: area,
      organization: org,
      linkedin_url: linkedin,
      verification_reason: reason,
      status: "pending",
    });
    setExisting(app);
    setSubmitting(false);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  if (existing) {
    const statusConfig = {
      pending: { icon: Clock, color: "text-truth-amber", label: "Pending Review" },
      approved: { icon: CheckCircle, color: "text-truth-mint", label: "Approved" },
      rejected: { icon: XCircle, color: "text-truth-red", label: "Rejected" },
    };
    const s = statusConfig[existing.status] || statusConfig.pending;
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-2xl font-heading font-800 mb-6">Expert Application</h1>
        <div className="glass rounded-2xl border border-border/30 p-6 text-center">
          <s.icon className={`w-12 h-12 mx-auto mb-4 ${s.color}`} />
          <h2 className="text-xl font-heading font-700 mb-2">Application {s.label}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Your application as a <strong>{existing.expertise_area}</strong> expert is currently {existing.status}.
          </p>
          {existing.expert_badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-truth-mint/10 text-truth-mint text-xs font-mono border border-truth-mint/20">
              <BadgeCheck className="w-3.5 h-3.5" /> {existing.expert_badge}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-heading font-800 mb-2">Become a Verified Expert</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Verified experts provide authoritative ratings and notes that carry extra weight in credibility scores.
      </p>

      <div className="glass rounded-2xl border border-border/30 p-6 space-y-4">
        <div>
          <label className="text-xs font-medium mb-1 block">Full Name</label>
          <Input value={fullName} onChange={e => setFullName(e.target.value)} className="bg-muted/30 border-border/30 rounded-xl" />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Area of Expertise</label>
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger className="bg-muted/30 border-border/30 rounded-xl"><SelectValue placeholder="Select area" /></SelectTrigger>
            <SelectContent>
              {AREAS.map(a => <SelectItem key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Organization</label>
          <Input value={org} onChange={e => setOrg(e.target.value)} placeholder="University, company, etc." className="bg-muted/30 border-border/30 rounded-xl" />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">LinkedIn Profile</label>
          <Input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="bg-muted/30 border-border/30 rounded-xl" />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Why should you be verified?</label>
          <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Describe your qualifications and why you'd be a valuable expert on TruthLayer..." className="bg-muted/30 border-border/30 rounded-xl min-h-[100px]" />
        </div>
        <Button onClick={handleSubmit} disabled={submitting || !area || !reason} className="w-full truth-gradient-bg text-white font-semibold py-5 rounded-xl hover:opacity-90">
          {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Application"}
        </Button>
      </div>
    </div>
  );
}

