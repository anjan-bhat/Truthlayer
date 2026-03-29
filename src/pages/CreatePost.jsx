import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Video, Type, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "politics", "health", "science", "sports", "entertainment",
  "local_news", "technology", "finance", "global_events", "education", "social_issues", "other"
];

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [contentType, setContentType] = useState("text");
  const [textContent, setTextContent] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [publishing, setPublishing] = useState(false);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
      if (file.type.startsWith("video")) setContentType("video");
      else if (file.type.startsWith("image")) setContentType("image");
    }
  };

  const handlePublish = async () => {
    if (!textContent && !mediaFile) return;
    setPublishing(true);

    let media_url = null;
    if (mediaFile) {
      const result = await base44.integrations.Core.UploadFile({ file: mediaFile });
      media_url = result.file_url;
    }

    const finalType = mediaFile && textContent ? "mixed" : contentType;

    const post = await base44.entities.Post.create({
      author_email: user.email,
      author_name: user.full_name || "Anonymous",
      author_photo: user.profile_photo || "",
      content_type: finalType,
      text_content: textContent,
      caption,
      media_url,
      category: category || "other",
      ai_detected_type: "pending",
      avg_rating: 0,
      rating_count: 0,
      expert_avg_rating: 0,
      expert_rating_count: 0,
      comment_count: 0,
      is_flagged: false,
    });

    // AI analysis in background
    analyzePost(post.id, textContent, caption, media_url);
    navigate("/feed");
  };

  const analyzePost = async (postId, text, cap, mediaUrl) => {
    const fileUrls = mediaUrl ? [mediaUrl] : undefined;
    const prompt = `Analyze this social media post for credibility and classify it.

Text content: "${text || "No text"}"
Caption: "${cap || "No caption"}"
${mediaUrl ? "There is also media attached." : ""}

Classify this post into one of these types: news, rumor, opinion, satire, misleading, verified, not_enough_evidence.
Also provide a short credibility analysis (1-2 sentences), suggest a category from: politics, health, science, sports, entertainment, local_news, technology, finance, global_events, education, social_issues, other.
Extract up to 5 relevant tags.
Provide a brief summary.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      file_urls: fileUrls,
      response_json_schema: {
        type: "object",
        properties: {
          detected_type: { type: "string", enum: ["news", "rumor", "opinion", "satire", "misleading", "verified", "not_enough_evidence"] },
          credibility_label: { type: "string" },
          suggested_category: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          summary: { type: "string" },
        },
      },
    });

    await base44.entities.Post.update(postId, {
      ai_detected_type: result.detected_type || "not_enough_evidence",
      ai_credibility_label: result.credibility_label || "",
      ai_tags: result.tags || [],
      ai_summary: result.summary || "",
      category: result.suggested_category || category || "other",
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-heading font-800">Create Post</h1>
      </div>

      <div className="glass rounded-2xl border border-border/30 p-6 space-y-5">
        {/* Content type selector */}
        <div className="flex gap-2">
          {[
            { type: "text", icon: Type, label: "Text" },
            { type: "image", icon: ImagePlus, label: "Photo" },
            { type: "video", icon: Video, label: "Video" },
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => setContentType(item.type)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                contentType === item.type
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "border-border/30 text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Text content */}
        <Textarea
          placeholder="What's on your mind? Share something worth verifying..."
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          className="min-h-[120px] bg-muted/30 border-border/30 rounded-xl resize-none"
        />

        {/* Media upload */}
        {(contentType === "image" || contentType === "video") && (
          <div>
            {mediaPreview ? (
              <div className="relative rounded-xl overflow-hidden">
                {contentType === "video" ? (
                  <video src={mediaPreview} controls className="w-full max-h-64 object-cover rounded-xl" />
                ) : (
                  <img src={mediaPreview} alt="" className="w-full max-h-64 object-cover rounded-xl" />
                )}
                <button
                  onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-border/40 cursor-pointer hover:border-primary/40 transition-colors">
                <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload media</span>
                <input type="file" className="hidden" accept="image/*,video/*" onChange={handleMediaChange} />
              </label>
            )}
          </div>
        )}

        {/* Caption */}
        <Input
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="bg-muted/30 border-border/30 rounded-xl"
        />

        {/* Category */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="bg-muted/30 border-border/30 rounded-xl">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* AI Notice */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-truth-cyan" />
          AI will automatically analyze your post for content type and credibility after publishing.
        </div>

        {/* Publish */}
        <Button
          onClick={handlePublish}
          disabled={publishing || (!textContent && !mediaFile)}
          className="w-full truth-gradient-bg text-white font-semibold py-5 rounded-xl hover:opacity-90"
        >
          {publishing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            "Publish Post"
          )}
        </Button>
      </div>
    </div>
  );
}
