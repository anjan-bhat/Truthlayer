import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";
import FeedCard from "../components/feed/FeedCard";
import CategoryFilter from "../components/feed/CategoryFilter";

export default function Feed() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  // Check onboarding
  useEffect(() => {
    if (user) {
      base44.entities.UserPreference.filter({ user_email: user.email }, "-created_date", 1).then(prefs => {
        if (prefs.length === 0 || !prefs[0].onboarding_complete) {
          navigate("/onboarding");
        }
      });
    }
  }, [user, navigate]);

  useEffect(() => {
    loadPosts();
  }, [category]);

  useEffect(() => {
    const unsub = base44.entities.Post.subscribe((event) => {
      if (event.type === "create") {
        setPosts((prev) => [event.data, ...prev]);
      } else if (event.type === "update") {
        setPosts((prev) => prev.map((p) => (p.id === event.id ? event.data : p)));
      } else if (event.type === "delete") {
        setPosts((prev) => prev.filter((p) => p.id !== event.id));
      }
    });
    return unsub;
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    let data;
    if (category === "all") {
      data = await base44.entities.Post.list("-created_date", 50);
    } else {
      data = await base44.entities.Post.filter({ category }, "-created_date", 50);
    }
    setPosts(data);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-800 mb-1">Feed</h1>
        <p className="text-sm text-muted-foreground">AI-analyzed content with credibility ratings</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <CategoryFilter selected={category} onChange={setCategory} />
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-sm">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <FeedCard key={post.id} post={post} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
