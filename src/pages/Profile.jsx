import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BadgeCheck, Edit3, Save, Loader2, Flag, Camera, MessageCircle, Star } from "lucide-react";
import FeedCard from "../components/feed/FeedCard";

const REPORT_CATEGORIES = ["bullying", "harassment", "aggression", "toxic_conduct", "manipulation", "spam", "impersonation", "other"];

export default function Profile() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const viewEmail = urlParams.get('email');
  const [viewUser, setViewUser] = useState(null);
  const [reportCategory, setReportCategory] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [avgPostScore, setAvgPostScore] = useState(null);
  const [credibilityScore, setCredibilityScore] = useState(null);
  const [ratingsGiven, setRatingsGiven] = useState([]);

  const isOwnProfile = !viewEmail || viewEmail === user?.email;
  const displayUser = isOwnProfile ? user : viewUser;

  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
    }
  }, [user]);

  useEffect(() => {
    if (viewEmail && viewEmail !== user?.email) {
      base44.entities.User.filter({ email: viewEmail }).then(users => {
        if (users.length > 0) setViewUser(users[0]);
      });
    }
  }, [viewEmail, user]);

  useEffect(() => {
    const email = isOwnProfile ? user?.email : viewEmail;
    if (email) {
      base44.entities.Post.filter({ author_email: email }, "-created_date", 20).then((posts) => {
        setMyPosts(posts);
        setLoadingPosts(false);
        // Calculate author avg
        const rated = posts.filter(p => p.rating_count > 0);
        if (rated.length > 0) {
          const avg = rated.reduce((sum, p) => sum + (p.avg_rating || 0), 0) / rated.length;
          setAvgPostScore(Math.round(avg * 10) / 10);
        }
        // Credibility: average of AI avg_rating across all posts
        const aiRated = posts.filter(p => p.avg_rating > 0);
        if (aiRated.length > 0) {
          const cred = aiRated.reduce((sum, p) => sum + (p.avg_rating || 0), 0) / aiRated.length;
          setCredibilityScore(Math.round(cred * 10) / 10);
        } else {
          setCredibilityScore(0);
        }
      });
      base44.entities.Rating.filter({ user_email: email }, "-created_date", 20).then(setRatingsGiven);
    }
  }, [user, viewEmail, isOwnProfile]);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({ bio });
    setSaving(false);
    setEditing(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.auth.updateMe({ profile_photo: file_url });
    window.location.reload();
  };

  const handleStartChat = async () => {
    if (!user || !viewEmail) return;
    // Check if conversation exists
    const all = await base44.entities.Conversation.list("-updated_date", 100);
    const existing = all.find(c =>
      c.participant_emails?.includes(user.email) && c.participant_emails?.includes(viewEmail)
    );
    if (existing) {
      window.location.href = `/chat/${existing.id}`;
      return;
    }
    const conv = await base44.entities.Conversation.create({
      participant_emails: [user.email, viewEmail],
      participant_names: [user.full_name || "User", displayUser?.full_name || "User"],
    });
    window.location.href = `/chat/${conv.id}`;
  };

  const getCredibilityLabel = (score) => {
    if (score === null) return null;
    if (score === 0) return { label: "No posts yet", color: "text-muted-foreground" };
    if (score >= 4) return { label: "High credibility", color: "text-truth-mint" };
    if (score >= 2.5) return { label: "Medium credibility", color: "text-truth-amber" };
    return { label: "Low credibility", color: "text-destructive" };
  };

  const handleReport = async () => {
    if (!reportCategory || !reportDesc) return;
    await base44.entities.BehaviorReport.create({
      reported_user_email: viewEmail,
      reporter_email: user.email,
      category: reportCategory,
      description: reportDesc,
      status: "pending",
    });
    setReportOpen(false);
    setReportCategory("");
    setReportDesc("");
  };

  if (!displayUser) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Profile header */}
      <div className="glass rounded-2xl border border-border/30 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold overflow-hidden">
              {displayUser.profile_photo ? (
                <img src={displayUser.profile_photo} alt="" className="w-full h-full object-cover" />
              ) : (
                displayUser.full_name?.[0] || "U"
              )}
            </div>
            {isOwnProfile && (
              <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center cursor-pointer">
                <Camera className="w-3 h-3 text-primary-foreground" />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-heading font-800">{displayUser.full_name || "User"}</h1>
              {displayUser.is_expert && <BadgeCheck className="w-5 h-5 text-truth-mint" />}
            </div>
            <p className="text-sm text-muted-foreground">{displayUser.email}</p>
            {displayUser.expert_badge && (
              <Badge variant="outline" className="mt-1 text-truth-mint border-truth-mint/30 text-xs">
                {displayUser.expert_badge}
              </Badge>
            )}
            {displayUser.organization && (
              <p className="text-xs text-muted-foreground mt-1">{displayUser.organization}</p>
            )}
          </div>
          {isOwnProfile && (
            <Button variant="ghost" size="icon" onClick={() => setEditing(!editing)}>
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
          {!isOwnProfile && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleStartChat} className="rounded-xl">
                <MessageCircle className="w-4 h-4 mr-1" /> Message
              </Button>
            <Dialog open={reportOpen} onOpenChange={setReportOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Flag className="w-4 h-4 mr-1" /> Report
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-border/30">
                <DialogHeader>
                  <DialogTitle>Report User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Select value={reportCategory} onValueChange={setReportCategory}>
                    <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                    <SelectContent>
                      {REPORT_CATEGORIES.map(c => (
                        <SelectItem key={c} value={c}>{c.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea placeholder="Describe the issue..." value={reportDesc} onChange={e => setReportDesc(e.target.value)} className="bg-muted/30 border-border/30 rounded-xl" />
                  <Button onClick={handleReport} className="w-full truth-gradient-bg text-white rounded-xl hover:opacity-90">Submit Report</Button>
                </div>
              </DialogContent>
            </Dialog>
            </div>
          )}
        </div>

        {/* Bio edit */}
        {editing ? (
          <div className="mt-4 space-y-3">
            <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Write your bio..." className="bg-muted/30 border-border/30 rounded-xl" />
            <Button onClick={handleSave} disabled={saving} size="sm" className="truth-gradient-bg text-white rounded-lg hover:opacity-90">
              <Save className="w-3.5 h-3.5 mr-1" /> {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : displayUser.bio ? (
          <p className="mt-4 text-sm text-foreground/80 leading-relaxed">{displayUser.bio}</p>
        ) : null}

        {/* Credibility rating */}
        {(() => {
          const cred = getCredibilityLabel(credibilityScore);
          if (!cred) return null;
          return (
            <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/30">
              <Star className="w-4 h-4 text-truth-amber flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{credibilityScore > 0 ? `${credibilityScore} / 5` : "—"}</span>
                  <span className={`text-xs font-medium ${cred.color}`}>{cred.label}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Credibility rating · based on {myPosts.length} posts</p>
              </div>
            </div>
          );
        })()}

        {/* Interests */}
        {displayUser.interests?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {displayUser.interests.map(i => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground">{i}</span>
            ))}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-xl border border-border/30 p-4 text-center">
          <p className="text-2xl font-heading font-800 text-primary">{myPosts.length}</p>
          <p className="text-xs text-muted-foreground">Posts</p>
        </div>
        <div className="glass rounded-xl border border-border/30 p-4 text-center">
          <p className="text-2xl font-heading font-800 text-truth-cyan">{ratingsGiven.length}</p>
          <p className="text-xs text-muted-foreground">Ratings Given</p>
        </div>
      </div>

      {/* Posts */}
      <h2 className="text-lg font-heading font-700 mb-4">Posts</h2>
      {loadingPosts ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : myPosts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {myPosts.map(post => (
            <FeedCard key={post.id} post={post} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

