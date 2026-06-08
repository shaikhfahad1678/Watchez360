import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";

export default function SmartWatches() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSmart = async () => {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "/api";
      try {
        const res = await fetch(`${apiHost}/api/v1/product?category=Smart%20Watch`);
        const result = await res.json();
        if (result.statusCode === 200 && Array.isArray(result.data)) {
          setProducts(result.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to load smart watches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSmart();
  }, []);

  return (
    <div className="bg-white text-neutral-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Header */}
        <div className="mb-8 border-b border-neutral-100 pb-5">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400 mb-2 block">
            Digital Intellect
          </span>
          <h1 className="text-3xl font-black uppercase tracking-wider text-black">
            Smart Watches
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center shrink-0 mx-auto relative">
              <div className="absolute w-[1px] h-[5px] bg-black origin-bottom rounded-full animate-[spin_2s_linear_infinite] -translate-y-[2.5px]"></div>
              <div className="absolute w-[1px] h-[8px] bg-black origin-bottom rounded-full animate-[spin_8s_linear_infinite] -translate-y-[4px]"></div>
            </div>
            <p className="text-xs font-semibold text-neutral-500 mt-4 uppercase tracking-widest animate-pulse">Syncing Smart Wear Calibres...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-6 md:gap-8 mb-16">
            {products.map((p) => (
              <Card key={p._id || p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-neutral-200 rounded-3xl mb-16 max-w-xl mx-auto px-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-black mb-1">No Smart Watches</h3>
            <p className="text-xs text-neutral-500 font-medium mb-5 leading-relaxed">
              We couldn't find any smart watches in the catalog at this moment.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
