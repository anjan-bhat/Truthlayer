import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2, LogOut, Shield, Bell, Eye } from "lucide-react";

export default function Settings() {
  const { user } = useOutletContext();
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contentPref, setContentPref] = useState("balanced");
  const [followExperts, setFollowExperts] = useState(true);
  const [notifFreq, setNotifFreq] = useState("important");

  useEffect(() => {
    if (user) {
      base44.entities.UserPreference.filter({ user_email: user.email }, "-created_date", 1).then(p => {
        if (p.length > 0) {
          setPrefs(p[0]);
          setContentPref(p[0].content_preference || "balanced");
          setFollowExperts(p[0].follow_experts !== false);
          setNotifFreq(p[0].notification_frequency || "important");
        }
        setLoading(false);
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    if (prefs) {
      await base44.entities.UserPreference.update(prefs.id, {
        content_preference: contentPref,
        follow_experts: followExperts,
        notification_frequency: notifFreq,
      });
    }
    setSaving(false);
  };

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-heading font-800 mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Privacy */}
        <div className="glass rounded-2xl border border-border/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-truth-cyan" />
            <h2 className="text-sm font-heading font-700">Privacy & Account</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Your data is protected. TruthLayer never shares your personal information with third parties.
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><span className="text-foreground font-medium">Email:</span> {user?.email}</p>
            <p><span className="text-foreground font-medium">Role:</span> {user?.role || "user"}</p>
          </div>
        </div>

        {/* Feed preferences */}
        <div className="glass rounded-2xl border border-border/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-truth-violet" />
            <h2 className="text-sm font-heading font-700">Feed Preferences</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Content preference</label>
              <Select value={contentPref} onValueChange={setContentPref}>
                <SelectTrigger className="bg-muted/30 border-border/30 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">Verified Content</SelectItem>
                  <SelectItem value="trending">Trending Content</SelectItem>
                  <SelectItem value="balanced">Balanced Mix</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Follow expert content</label>
              <Switch checked={followExperts} onCheckedChange={setFollowExperts} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass rounded-2xl border border-border/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-truth-magenta" />
            <h2 className="text-sm font-heading font-700">Notifications</h2>
          </div>
          <Select value={notifFreq} onValueChange={setNotifFreq}>
            <SelectTrigger className="bg-muted/30 border-border/30 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="important">Important Only</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full truth-gradient-bg text-white font-semibold py-5 rounded-xl hover:opacity-90">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>

        <Button onClick={handleLogout} variant="outline" className="w-full rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5">
          <LogOut className="w-4 h-4 mr-2" /> Log Out
        </Button>
      </div>
    </div>
  );
}

