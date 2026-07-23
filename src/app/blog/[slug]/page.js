import BlogClientWrapper from "./BlogClientWrapper";
import { getApiUrl } from "../../../utils/api";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  let blog = null;
  try {
    const [blogsRes, topListsRes] = await Promise.all([
      fetch(getApiUrl("/api/v1/blog"), { next: { revalidate: 60 } }).then(res => res.ok ? res.json() : null),
      fetch(getApiUrl("/api/v1/top-list"), { next: { revalidate: 60 } }).then(res => res.ok ? res.json() : null)
    ]);
    
    let combined = [];
    if (blogsRes?.success && Array.isArray(blogsRes.blogs)) {
      combined = [...combined, ...blogsRes.blogs.map(b => ({
        ...b,
        type: "standard",
        slug: b.slug || b.title?.toLowerCase().trim().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
      }))];
    }
    if (topListsRes?.success && Array.isArray(topListsRes.lists)) {
      combined = [...combined, ...topListsRes.lists.map(l => ({
        ...l,
        type: "topList",
        slug: l.slug || l.title?.toLowerCase().trim().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
      }))];
    }
    
    blog = combined.find(b => b.slug === slug);
  } catch (err) {
    console.error("Error fetching metadata for blog", slug, err);
  }
  
  if (!blog) {
    return {
      title: "Blog Article | Watchez360 Calibre Gazette",
      description: "Read premium horological reviews, watch listings, and news on Watchez360 Calibre Gazette."
    };
  }
  
  const title = `${blog.title} | Watchez360 Calibre Gazette`;
  const description = blog.description || (blog.items ? `Curated list featuring ${blog.items.length} luxury timepieces.` : "Explore the detailed review on Watchez360.");
  
  let imageUrl = "";
  if (blog.topImage) {
    imageUrl = typeof blog.topImage === "string" ? blog.topImage : blog.topImage.url;
  } else if (blog.image) {
    imageUrl = typeof blog.image === "string" ? blog.image : blog.image.url;
  } else if (blog.images && blog.images.length > 0) {
    const firstImg = blog.images[0];
    imageUrl = typeof firstImg === "string" ? firstImg : firstImg.url;
  }
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    }
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  
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
    console.error("Error fetching initial blogs for details page", err);
  }
  
  return <BlogClientWrapper initialBlogs={initialBlogs} />;
}
