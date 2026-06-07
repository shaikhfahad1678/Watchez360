import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";

export default function Trending() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://140.245.10.48:8000";
      try {
        const res = await fetch(`${apiHost}/api/v1/product/section/Trending`);
        const result = await res.json();
        if (result.success && result.data?.products?.length > 0) {
          setProducts(result.data.products);
        } else {
          // fallback
          const backupRes = await fetch(`${apiHost}/api/v1/product`);
          const backupData = await backupRes.json();
          setProducts(backupData.data ? [...backupData.data].reverse() : []);
        }
      } catch (err) {
        console.error("Failed to load trending watches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="bg-white text-neutral-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Header */}
        <div className="mb-8 border-b border-neutral-100 pb-5">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400 mb-2 block">
            Most Coveted
          </span>
          <h1 className="text-3xl font-black uppercase tracking-wider text-black">
            Trending timepieces
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center shrink-0 mx-auto relative">
              <div className="absolute w-[1px] h-[5px] bg-black origin-bottom rounded-full animate-[spin_2s_linear_infinite] -translate-y-[2.5px]"></div>
              <div className="absolute w-[1px] h-[8px] bg-black origin-bottom rounded-full animate-[spin_8s_linear_infinite] -translate-y-[4px]"></div>
            </div>
            <p className="text-xs font-semibold text-neutral-500 mt-4 uppercase tracking-widest animate-pulse">Syncing Trending Calibres...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-6 md:gap-8 mb-16">
            {products.map((p) => (
              <Card key={p._id || p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-neutral-200 rounded-3xl mb-16 max-w-xl mx-auto px-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-black mb-1">No Trending Timepieces</h3>
            <p className="text-xs text-neutral-500 font-medium mb-5 leading-relaxed">
              We couldn't find any watches in the trending category at this moment.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
