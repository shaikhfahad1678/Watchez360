import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListOfBlog from "../components/ListOfBlog";
import BlogPage from "../components/BlogPage";
import { mockBlogs } from "../data/blogData";

export default function Blog() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Find the selected blog/top-list by slug from loaded lists
  const selectedBlog = blogs.find((b) => b.slug === slug);
  const selectedBlogId = selectedBlog ? (selectedBlog._id || selectedBlog.id) : null;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_URL || "/api";
        const [blogsRes, topListsRes] = await Promise.all([
          fetch(`${apiHost}/api/v1/blog`),
          fetch(`${apiHost}/api/v1/top-list`)
        ]);

        let combined = [];

        if (blogsRes.ok) {
          const blogsData = await blogsRes.json();
          if (blogsData.success && Array.isArray(blogsData.blogs)) {
            combined = [...combined, ...blogsData.blogs.map(b => ({
              ...b,
              type: "standard",
              slug: b.slug || b.title?.toLowerCase().trim().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
            }))];
          }
        }

        if (topListsRes.ok) {
          const topListData = await topListsRes.json();
          if (topListData.success && Array.isArray(topListData.lists)) {
            combined = [...combined, ...topListData.lists.map(l => ({
              ...l,
              type: "topList",
              slug: l.slug || l.title?.toLowerCase().trim().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
            }))];
          }
        }

        if (combined.length > 0) {
          // Sort chronologically descending
          combined.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));
          setBlogs(combined);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Failed to load backend blogs/lists, falling back to mock blogs:", err);
      }
      setBlogs(mockBlogs.map(b => ({ ...b, type: "standard" })));
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="bg-white text-neutral-900 min-h-screen flex flex-col font-sans selection:bg-neutral-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex-1 w-full">
        {/* Editorial Header */}
        <div className="mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-600 mb-2 block">
            Watchez360 Journal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-black">
            The Calibre Gazette
          </h1>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-bold uppercase tracking-wider text-neutral-400 animate-pulse">
            Syncing Articles...
          </div>
        ) : selectedBlogId ? (
          <BlogPage
            blogId={selectedBlogId}
            blogs={blogs}
            onBack={() => navigate("/blog")}
            onSelectBlog={(id) => {
              const b = blogs.find((x) => (x._id || x.id) === id);
              if (b?.slug) navigate(`/blog/${b.slug}`);
            }}
          />
        ) : (
          <ListOfBlog
            blogs={blogs}
            onSelectBlog={(id) => {
              const b = blogs.find((x) => (x._id || x.id) === id);
              if (b?.slug) navigate(`/blog/${b.slug}`);
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
