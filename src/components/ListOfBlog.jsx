import { Calendar, ArrowRight } from "lucide-react";

export default function ListOfBlog({ blogs = [], onSelectBlog }) {
  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-6">
      {/* Blog Cards Grid with Increased Card Width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
        {blogs.map((blog) => {
          const blogId = blog._id || blog.id;
          const blogImage = blog.topImage || blog.images?.[0] || blog.image;
          const blogExcerpt = blog.excerpt || blog.description || (blog.descrip ? blog.descrip.slice(0, 160) + "..." : "");
          const isTopList = blog.type === "topList" || Array.isArray(blog.items);

          return (
            <article
              key={blogId}
              onClick={() => onSelectBlog(blogId)}
              className="group flex flex-col bg-white border border-neutral-100/90 rounded-3xl p-4 sm:p-6 hover:shadow-xl hover:border-neutral-200 transition-all duration-300 cursor-pointer"
            >
              {/* Image Container */}
              <div className="w-full h-[240px] sm:h-[280px] rounded-2xl overflow-hidden bg-neutral-50 mb-6 relative">
                {blogImage ? (
                  <img
                    src={blogImage}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-50 flex items-center justify-center text-neutral-400 font-bold uppercase tracking-wider text-xs">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-3 text-[10px] font-bold text-neutral-800 uppercase tracking-widest mb-3">
                <span className="flex items-center gap-1.5 text-neutral-600">
                  <Calendar size={12} />
                  {blog.date || "No Date"}
                </span>
                {isTopList && (
                  <>
                    <span className="text-neutral-350">•</span>
                    <span className="text-emerald-700 font-black">
                      {blog.items?.length || 0} Timepieces Curated
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-black tracking-tight mb-2.5 group-hover:text-neutral-800 transition-colors leading-tight">
                {blog.title}
              </h3>

              {/* Excerpt */}
              <p className="text-xs sm:text-sm text-neutral-900 font-medium leading-relaxed mb-6 flex-grow">
                {blogExcerpt}
              </p>

              {/* Read Button */}
              <div className="flex items-center justify-between mt-auto pt-1">
                <span className="text-[10px] font-bold text-neutral-700">
                  {isTopList ? "Curated List" : `By ${blog.author || "Admin"}`}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  {isTopList ? "Read List" : "Read Article"} <ArrowRight size={11} />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
