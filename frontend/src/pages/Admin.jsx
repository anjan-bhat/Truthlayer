import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Flag, AlertTriangle, Loader2, Check, X } from "lucide-react";
import moment from "moment";

export default function Admin() {
  const { user } = useOutletContext();
  const [applications, setApplications] = useState([]);
  const [reports, setReports] = useState([]);
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.ExpertApplication.list("-created_date", 50),
      base44.entities.BehaviorReport.list("-created_date", 50),
      base44.entities.Post.filter({ is_flagged: true }, "-created_date", 50),
    ]).then(([apps, reps, posts]) => {
      setApplications(apps);
      setReports(reps);
      setFlaggedPosts(posts);
      setLoading(false);
    });
  }, []);

  const handleApproveExpert = async (app) => {
    const badge = `Verified ${app.expertise_area.charAt(0).toUpperCase() + app.expertise_area.slice(1)} Contributor`;
    await base44.entities.ExpertApplication.update(app.id, { status: "approved", expert_badge: badge });
    // Update user
    const users = await base44.entities.User.filter({ email: app.user_email });
    if (users.length > 0) {
      await base44.entities.User.update(users[0].id, {
        is_expert: true,
        expert_badge: badge,
        expertise_area: app.expertise_area,
        organization: app.organization,
        role: "expert",
      });
    }
    setApplications(applications.map(a => a.id === app.id ? { ...a, status: "approved", expert_badge: badge } : a));
  };

  const handleRejectExpert = async (app) => {
    await base44.entities.ExpertApplication.update(app.id, { status: "rejected" });
    setApplications(applications.map(a => a.id === app.id ? { ...a, status: "rejected" } : a));
  };

  const handleResolveReport = async (report) => {
    await base44.entities.BehaviorReport.update(report.id, { status: "resolved" });
    setReports(reports.map(r => r.id === report.id ? { ...r, status: "resolved" } : r));
  };

  const handleDismissReport = async (report) => {
    await base44.entities.BehaviorReport.update(report.id, { status: "dismissed" });
    setReports(reports.map(r => r.id === report.id ? { ...r, status: "dismissed" } : r));
  };

  if (user?.role !== "admin" && user?.role !== "moderator") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-10 h-10 text-truth-amber mx-auto mb-3" />
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const pendingApps = applications.filter(a => a.status === "pending");
  const pendingReports = reports.filter(r => r.status === "pending");

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-heading font-800 mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass rounded-xl border border-border/30 p-4 text-center">
          <p className="text-2xl font-heading font-800 text-truth-cyan">{pendingApps.length}</p>
          <p className="text-xs text-muted-foreground">Pending Applications</p>
        </div>
        <div className="glass rounded-xl border border-border/30 p-4 text-center">
          <p className="text-2xl font-heading font-800 text-truth-red">{pendingReports.length}</p>
          <p className="text-xs text-muted-foreground">Pending Reports</p>
        </div>
        <div className="glass rounded-xl border border-border/30 p-4 text-center">
          <p className="text-2xl font-heading font-800 text-truth-amber">{flaggedPosts.length}</p>
          <p className="text-xs text-muted-foreground">Flagged Posts</p>
        </div>
      </div>

      <Tabs defaultValue="applications">
        <TabsList className="glass border border-border/30 mb-4">
          <TabsTrigger value="applications">Expert Applications</TabsTrigger>
          <TabsTrigger value="reports">Behavior Reports</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <div className="space-y-3">
            {applications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No applications.</p>
            ) : applications.map(app => (
              <div key={app.id} className="glass rounded-xl border border-border/30 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{app.full_name}</span>
                      <Badge variant="outline" className="text-[10px]">{app.expertise_area}</Badge>
                      <Badge variant={app.status === "approved" ? "default" : app.status === "rejected" ? "destructive" : "secondary"} className="text-[10px]">
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{app.user_email} · {app.organization}</p>
                    {app.linkedin_url && <a href={app.linkedin_url} target="_blank" className="text-[10px] text-primary hover:underline">LinkedIn</a>}
                    <p className="text-xs text-foreground/80 mt-2">{app.verification_reason}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{moment(app.created_date).fromNow()}</p>
                  </div>
                  {app.status === "pending" && (
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" onClick={() => handleApproveExpert(app)} className="bg-truth-mint/20 text-truth-mint hover:bg-truth-mint/30 h-8 px-3">
                        <Check className="w-3 h-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleRejectExpert(app)} className="text-truth-red hover:bg-truth-red/10 h-8 px-3">
                        <X className="w-3 h-3 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-3">
            {reports.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No reports.</p>
            ) : reports.map(report => (
              <div key={report.id} className="glass rounded-xl border border-border/30 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Flag className="w-3.5 h-3.5 text-truth-red" />
                      <Badge variant="outline" className="text-[10px]">{report.category?.replace("_", " ")}</Badge>
                      <Badge variant={report.status === "resolved" ? "default" : report.status === "dismissed" ? "secondary" : "destructive"} className="text-[10px]">
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Reported: {report.reported_user_email}</p>
                    <p className="text-xs text-muted-foreground">By: {report.reporter_email}</p>
                    <p className="text-xs text-foreground/80 mt-2">{report.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{moment(report.created_date).fromNow()}</p>
                  </div>
                  {report.status === "pending" && (
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" onClick={() => handleResolveReport(report)} className="bg-truth-mint/20 text-truth-mint hover:bg-truth-mint/30 h-8 px-3">
                        Resolve
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDismissReport(report)} className="text-muted-foreground h-8 px-3">
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flagged">
          <div className="space-y-3">
            {flaggedPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No flagged content.</p>
            ) : flaggedPosts.map(post => (
              <div key={post.id} className="glass rounded-xl border border-border/30 p-4">
                <p className="text-sm font-medium">{post.text_content?.slice(0, 100) || "Media post"}</p>
                <p className="text-xs text-muted-foreground mt-1">By: {post.author_email} · {moment(post.created_date).fromNow()}</p>
                <p className="text-xs text-muted-foreground">Type: {post.ai_detected_type}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
