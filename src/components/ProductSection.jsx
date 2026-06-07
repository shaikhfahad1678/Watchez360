import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";

export default function ProductSection({ currentProduct }) {
  const [similarWatches, setSimilarWatches] = useState([]);
  const [moreWatches, setMoreWatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://140.245.10.48:8000";
        const res = await fetch(`${apiHost}/api/v1/product/`);
        const result = await res.json();

        if (res.ok && Array.isArray(result.data)) {
          // Filter out current product if it exists
          const allWatches = currentProduct?._id
            ? result.data.filter((w) => w._id !== currentProduct._id)
            : result.data;

          // Score similarity based on matching brand, movement, shape, strap, and gender
          const scored = allWatches.map((watch) => {
            let score = 0;
            if (currentProduct) {
              if (watch.brand && currentProduct.brand && watch.brand.toLowerCase() === currentProduct.brand.toLowerCase()) {
                score += 5;
              }
              if (watch.movement_type && currentProduct.movement_type && watch.movement_type.toLowerCase() === currentProduct.movement_type.toLowerCase()) {
                score += 3;
              }
              if (watch.dial_shape && currentProduct.dial_shape && watch.dial_shape.toLowerCase() === currentProduct.dial_shape.toLowerCase()) {
                score += 2;
              }
              if (watch.strap_material && currentProduct.strap_material && watch.strap_material.toLowerCase() === currentProduct.strap_material.toLowerCase()) {
                score += 2;
              }
              if (watch.gender && currentProduct.gender && watch.gender.toLowerCase() === currentProduct.gender.toLowerCase()) {
                score += 1;
              }
            } else {
              score = Math.random();
            }
            return { watch, score };
          });

          // Sort by score descending
          scored.sort((a, b) => b.score - a.score);

          // Get top 4 similar watches
          const similar = scored.slice(0, 4).map((item) => item.watch);
          setSimilarWatches(similar);

          // Filter out the similar ones to select random items
          const similarIds = new Set(similar.map((w) => w._id));
          const remaining = allWatches.filter((w) => !similarIds.has(w._id));

          // Select up to 4 random watches
          const randomWatches = remaining.sort(() => 0.5 - Math.random()).slice(0, 4);
          setMoreWatches(randomWatches);
        }
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProduct?._id]);

  if (loading) {
    return (
      <div className="py-12 bg-neutral-50 text-center text-xs font-bold uppercase tracking-wider text-neutral-400">
        Loading recommendations...
      </div>
    );
  }

  return (
    <>
      {/* Similar Watches section */}
      {similarWatches.length > 0 && (
        <section className="py-12 bg-neutral-50 border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            {/* Heading */}
            <div className="flex items-center justify-between pb-2 mb-6">
              <h2 className="text-xl font-black text-black uppercase tracking-wider">
                Similar Watches
              </h2>
              <Link
                to="/collection"
                className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 hover:text-black transition-all duration-300 flex items-center gap-1 group cursor-pointer"
              >
                See More
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 md:gap-8">
              {similarWatches.map((watch) => (
                <Card key={watch._id} product={watch} />
              ))}
            </div>

          </div>
        </section>
      )}

      {/* More Watches section */}
      {moreWatches.length > 0 && (
        <section className="py-3 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            {/* Heading */}
            <div className="flex items-center justify-between pb-2 mb-6">
              <h2 className="text-xl font-black text-black uppercase tracking-wider">
                More Watches
              </h2>
              <Link
                to="/collection"
                className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 hover:text-black transition-all duration-300 flex items-center gap-1 group cursor-pointer"
              >
                See More
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 md:gap-8">
              {moreWatches.map((watch) => (
                <Card key={watch._id} product={watch} />
              ))}
            </div>

          </div>
        </section>
      )}
    </>
  );
}