import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";

export default function HomeSection() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [smartProducts, setSmartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSections = async () => {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "/api";
      try {
        // 1. Fetch Featured Section
        const featuredRes = await fetch(`${apiHost}/api/v1/product/section/Featured`);
        const featuredData = await featuredRes.json();
        if (featuredData.success && featuredData.data?.products?.length > 0) {
          setFeaturedProducts(featuredData.data.products);
        } else {
          const backupRes = await fetch(`${apiHost}/api/v1/product?limit=4`);
          const backupData = await backupRes.json();
          setFeaturedProducts(backupData.data || []);
        }

        // 2. Fetch Trending Section
        const trendingRes = await fetch(`${apiHost}/api/v1/product/section/Trending`);
        const trendingData = await trendingRes.json();
        if (trendingData.success && trendingData.data?.products?.length > 0) {
          setTrendingProducts(trendingData.data.products);
        } else {
          const backupRes = await fetch(`${apiHost}/api/v1/product?limit=4`);
          const backupData = await backupRes.json();
          setTrendingProducts(backupData.data ? [...backupData.data].reverse() : []);
        }

        // 3. Fetch Smart Watches
        const productsRes = await fetch(`${apiHost}/api/v1/product?category=Smart%20Watch&limit=4`);
        const productsData = await productsRes.json();
        if (productsData.statusCode === 200 && Array.isArray(productsData.data) && productsData.data.length > 0) {
          setSmartProducts(productsData.data);
        } else {
          setSmartProducts([]);
        }
      } catch (error) {
        console.error("Error fetching homepage product sections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  const displayFeatured = featuredProducts;
  const displayTrending = trendingProducts;
  const displaySmart = smartProducts;

  return (
    <>
      {/* Featured Products */}
      <section className="py-5 bg-gray-50">
        <div className="max-w-7xl mx-auto px-1.5 sm:px-6">

          {/* Premium Minimalist Headline with See More Option */}
          <div className="flex items-center justify-between pb-2 mb-4 border-gray-200/50">
            <h2 className="text-2xl font-black text-black">
              Featured Watches
            </h2>
            <Link
              to="/featured"
              className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 hover:text-black transition-all duration-300 flex items-center gap-1 group cursor-pointer"
            >
              See More
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-6 md:gap-8">
            {displayFeatured.map((p) => (
              <Card key={p._id || p.id} product={p} />
            ))}
          </div>

        </div>
      </section>

      {/* Trending Now */}
      <section className="py-5 bg-gray-50 border-gray-200/40">
        <div className="max-w-7xl mx-auto px-1.5 sm:px-6">

          {/* Premium Minimalist Headline with See More Option */}
          <div className="flex items-center justify-between pb-2 mb-4 border-gray-200/50">
            <h2 className="text-2xl font-black text-black">
              Trending Now
            </h2>
            <Link
              to="/trending"
              className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 hover:text-black transition-all duration-300 flex items-center gap-1 group cursor-pointer"
            >
              See More
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-6 md:gap-8">
            {displayTrending.map((p) => (
              <Card key={p._id || p.id} product={p} />
            ))}
          </div>

        </div>
      </section>

      {/* Smart Watches */}
      <section className="py-5 bg-gray-50  border-gray-200/40">
        <div className="max-w-7xl mx-auto px-1.5 sm:px-6">

          {/* Premium Minimalist Headline with See More Option */}
          <div className="flex items-center justify-between pb-2 mb-4 border-gray-200/50">
            <h2 className="text-2xl font-black text-black">
              Smart Watches
            </h2>
            <Link
              to="/smart-watches"
              className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 hover:text-black transition-all duration-300 flex items-center gap-1 group cursor-pointer"
            >
              See More
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-6 md:gap-8">
            {displaySmart.map((p) => (
              <Card key={p._id || p.id} product={p} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
