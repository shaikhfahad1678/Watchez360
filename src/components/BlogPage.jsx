import { useState, useEffect } from "react";
import { Calendar, Clock, ArrowLeft, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
import Card from "./Card";

export default function BlogPage({ blogId, blogs = [], onBack, onSelectBlog }) {
  const blog = blogs.find((b) => (b._id || b.id) === blogId);
  const isTopList = blog?.type === "topList" || Array.isArray(blog?.items);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "/api";
      try {
        const res = await fetch(`${apiHost}/api/v1/product?limit=4`);
        if (res.ok) {
          const result = await res.json();
          if (Array.isArray(result.data)) {
            setRecommendedProducts(result.data.slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Error fetching recommended products:", err);
      }
    };
    fetchRecommendedProducts();
  }, [blogId]);

  if (!blog) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-neutral-900 font-bold">Article not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl">
          Back to list
        </button>
      </div>
    );
  }

  // Find other recommended blogs (filter out the active blog)
  const recommendations = blogs.filter((b) => (b._id || b.id) !== blogId).slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-black transition-colors mb-8 cursor-pointer"
      >
        <ArrowLeft size={12} />
        <span>Back to Gazette</span>
      </button>

      {/* Article Image */}
      <div className="w-full h-[320px] sm:h-[460px] rounded-2xl overflow-hidden bg-neutral-100 mb-8 border border-neutral-100">
        <img
          src={blog.images?.[0] || blog.topImage || blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight mb-4 leading-tight">
        {blog.title}
      </h2>

      {/* Author / Date */}
      <div className="flex items-center gap-4 text-xs font-semibold border-b border-neutral-100 pb-6 mb-8 text-neutral-800">
        {!isTopList && blog.author && (
          <>
            <span>By <strong className="text-black">{blog.author}</strong></span>
            <span>•</span>
          </>
        )}
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {blog.date || "No Date"}
        </span>
      </div>

      {/* Article Content */}
      {isTopList ? (
        <div className="mb-16">
          {blog.description && (
            <p className="text-neutral-950 leading-relaxed font-semibold text-sm sm:text-base mb-10 border-b border-neutral-100 pb-6">
              {blog.description}
            </p>
          )}

          {/* List Items */}
          {blog.items && blog.items.length > 0 && (
            <div className="space-y-16">
              {blog.items.map((item, idx) => (
                <div key={item._id || idx} className="border-b border-neutral-100 pb-12 last:border-b-0">
                  <div className="flex justify-between items-baseline flex-wrap gap-2 mb-4">
                    <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight leading-tight">
                      {item.title}
                    </h3>
                    {item.price && (
                      <span className="text-xs sm:text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
                        {item.price}
                      </span>
                    )}
                  </div>
                  {item.image && (
                    <div className="w-full h-[240px] sm:h-[420px] rounded-2xl overflow-hidden bg-neutral-100 my-6 border border-neutral-100 shadow-sm">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-neutral-950 leading-relaxed font-semibold text-sm sm:text-base mb-5">
                    {item.description}
                  </p>
                  
                  {/* Timepiece Pros & Cons */}
                  {((item.pros && item.pros.length > 0) || (item.cons && item.cons.length > 0)) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 bg-neutral-50/40 p-4 rounded-xl border border-neutral-100/65">
                      {/* Pros */}
                      {item.pros && item.pros.length > 0 && (
                        <div className="space-y-2">
                          <span className="flex items-center gap-1.5 text-xs font-black text-emerald-800 uppercase tracking-wider">
                            <ThumbsUp size={13} className="text-emerald-600" /> Pros
                          </span>
                          <ul className="space-y-1.5 text-xs text-neutral-900 font-semibold leading-relaxed">
                            {item.pros.map((pro, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Cons */}
                      {item.cons && item.cons.length > 0 && (
                        <div className="space-y-2">
                          <span className="flex items-center gap-1.5 text-xs font-black text-rose-800 uppercase tracking-wider">
                            <ThumbsDown size={13} className="text-rose-600" /> Cons
                          </span>
                          <ul className="space-y-1.5 text-xs text-neutral-900 font-semibold leading-relaxed">
                            {item.cons.map((con, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0"></span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black hover:text-neutral-700 border-b border-black pb-0.5"
                    >
                      View Timepiece <ArrowRight size={11} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="prose prose-neutral max-w-none text-neutral-950 leading-relaxed font-semibold text-sm sm:text-base space-y-6 mb-16">
          {(() => {
            const paragraphs = (blog.descrip || blog.content || "").split(/\r?\n\r?\n/);
            const middleIndex = Math.floor(paragraphs.length / 2);
            const elements = [];
            const middleImage = blog.images?.[1] || blog.middleImage;
            
            paragraphs.forEach((para, idx) => {
              if (para.trim()) {
                elements.push(<p key={`p-${idx}`} className="text-neutral-950 leading-relaxed font-semibold">{para}</p>);
                if (idx === middleIndex - 1 && middleImage) {
                  elements.push(
                    <div key="middle-img" className="w-full h-[240px] sm:h-[380px] rounded-2xl overflow-hidden bg-neutral-100 my-8 border border-neutral-100 shadow-sm">
                      <img
                        src={middleImage}
                        alt={`${blog.title} detail`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                }
              }
            });
            return elements;
          })()}
        </div>
      )}

      {/* Pros & Cons Section */}
      {((blog.pros && blog.pros.length > 0) || (blog.cons && blog.cons.length > 0)) && (
        <div className="mb-16 border-t border-neutral-100 pt-10">
          <h3 className="text-xl font-black text-black tracking-tight mb-6 uppercase tracking-wider text-center sm:text-left">
            Pros & Cons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pros */}
            <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-2xl p-6">
              <h4 className="flex items-center gap-2 text-sm font-black text-emerald-800 uppercase tracking-wider mb-4">
                <ThumbsUp size={16} className="text-emerald-600" /> Pros
              </h4>
              {blog.pros && blog.pros.length > 0 ? (
                <ul className="space-y-3">
                  {blog.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-neutral-900 text-sm font-semibold leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-neutral-500 text-xs italic">No pros mentioned.</p>
              )}
            </div>

            {/* Cons */}
            <div className="bg-rose-50/30 border border-rose-100/50 rounded-2xl p-6">
              <h4 className="flex items-center gap-2 text-sm font-black text-rose-800 uppercase tracking-wider mb-4">
                <ThumbsDown size={16} className="text-rose-600" /> Cons
              </h4>
              {blog.cons && blog.cons.length > 0 ? (
                <ul className="space-y-3">
                  {blog.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-neutral-900 text-sm font-semibold leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0"></span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-neutral-500 text-xs italic">No cons mentioned.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className=" pt-0 pb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-600 mb-6 block">
            Recommended Reading
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recommendations.map((rec) => {
              const recId = rec._id || rec.id;
              const recImage = rec.images?.[0] || rec.image;
              const recExcerpt = rec.excerpt || (rec.descrip ? rec.descrip.slice(0, 150) + "..." : "");

              return (
                <div
                  key={recId}
                  onClick={() => {
                    onSelectBlog(recId);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group flex flex-row gap-3 sm:gap-4 bg-neutral-50/50 hover:bg-white border border-neutral-100/60 hover:border-neutral-200 p-3 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-md items-center sm:items-stretch"
                >
                  {/* Left Content Area (Title and Description/Excerpt) */}
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <div>
                      <h4 className="text-sm font-black text-black tracking-tight mb-1 sm:mb-2 group-hover:text-neutral-800 transition-colors line-clamp-2 leading-tight">
                        {rec.title}
                      </h4>
                      <p className="text-xs text-neutral-900 font-medium line-clamp-2 leading-relaxed mb-3 sm:mb-4">
                        {recExcerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-neutral-100/60">
                      <span className="text-[9px] font-bold text-neutral-700">By {rec.author || "Admin"}</span>
                      <span className="text-[9px] font-black uppercase tracking-wider text-black flex items-center gap-1">
                        Read <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>

                  {/* Right Image Container */}
                  <div className="w-[85px] h-[85px] sm:w-[130px] sm:h-[130px] rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img
                      src={recImage}
                      alt={rec.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Products Section */}
      {recommendedProducts.length > 0 && (
        <div className=" pt-6 pb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-600 mb-6 block">
            Featured Timepieces
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-4">
            {recommendedProducts.map((p) => (
              <Card key={p._id || p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
