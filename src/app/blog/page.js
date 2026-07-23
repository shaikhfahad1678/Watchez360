import Blog from "../../pages/Blog";
import { getApiUrl } from "../../utils/api";

export default async function Page() {
  let initialBlogs = [];
  try {
    const [blogsRes, topListsRes] = await Promise.all([
      fetch(getApiUrl("/api/v1/blog"), { next: { revalidate: 60 } }).then(res => res.ok ? res.json() : null),
      fetch(getApiUrl("/api/v1/top-list"), { next: { revalidate: 60 } }).then(res => res.ok ? res.json() : null)
    ]);
    
    if (blogsRes?.success && Array.isArray(blogsRes.blogs)) {
      initialBlogs = [...initialBlogs, ...blogsRes.blogs.map(b => ({
        ...b,
        type: "standard",
        slug: b.slug || b.title?.toLowerCase().trim().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
      }))];
    }
    if (topListsRes?.success && Array.isArray(topListsRes.lists)) {
      initialBlogs = [...initialBlogs, ...topListsRes.lists.map(l => ({
        ...l,
        type: "topList",
        slug: l.slug || l.title?.toLowerCase().trim().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
      }))];
    }
    
    if (initialBlogs.length > 0) {
      initialBlogs.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));
    }
  } catch (err) {
    console.error("Error fetching initial blogs for list page", err);
  }
  
  return <Blog initialBlogs={initialBlogs} />;
}
