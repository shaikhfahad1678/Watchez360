import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [visibleCount, setVisibleCount] = useState(8);
  
  // Initialize filter states from URL query parameters
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "All");
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get("price") || "All");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null);

  // Sync state with URL parameter changes
  useEffect(() => {
    setSearchQuery(queryParam);
    setSelectedBrand(searchParams.get("brand") || "All");
    setSelectedPrice(searchParams.get("price") || "All");
    setSelectedCategory(searchParams.get("category") || "All");
    setMaxPrice(searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null);
    setVisibleCount(8);
  }, [queryParam, searchParams]);

  // Fetch search results from backend dynamically
  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchSearchResults = async () => {
        setLoading(true);
        const apiHost = process.env.NEXT_PUBLIC_API_URL || "/api";
        try {
          let url = `${apiHost}/api/v1/product`;
          
          const params = new URLSearchParams();
          if (selectedCategory && selectedCategory !== "All") {
            params.set("category", selectedCategory);
          }
          if (selectedBrand && selectedBrand !== "All") {
            params.set("brand", selectedBrand);
          }

          if (searchQuery.trim()) {
            url = `${apiHost}/api/v1/product/search?q=${encodeURIComponent(searchQuery)}`;
            if (params.toString()) {
              url += `&${params.toString()}`;
            }
          } else if (params.toString()) {
            url = `${apiHost}/api/v1/product?${params.toString()}`;
          }

          const res = await fetch(url);
          const resData = await res.json();
          
          const items = resData.data || [];
          setDbProducts(items);
        } catch (error) {
          console.error("Failed to query search results:", error);
          setDbProducts([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSearchResults();
    }, 200);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedCategory, selectedBrand]);

  const baseList = dbProducts;

  // Logic to filter products dynamically
  const filteredProducts = useMemo(() => {
    return baseList.filter((product) => {
      const nameVal = product.model_name || product.name || "";
      const brandVal = product.brand || "";
      const descVal = product.description || "";
      const priceVal = typeof product.price === "number" ? product.price : (product.priceVal || 0);

      const queryMatch =
        nameVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brandVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        descVal.toLowerCase().includes(searchQuery.toLowerCase());

      const brandMatch = selectedBrand === "All" || brandVal === selectedBrand;
      
      // Match category case-insensitively with semantic fallbacks
      let categoryMatch = false;
      if (selectedCategory === "All") {
        categoryMatch = true;
      } else if (selectedCategory.toLowerCase() === "female" || selectedCategory.toLowerCase() === "women") {
        categoryMatch = (product.category && /female|women/i.test(product.category)) || 
                        (product.gender && product.gender.toLowerCase() === "women") ||
                        (nameVal.toLowerCase().includes("women") || nameVal.toLowerCase().includes("female"));
      } else if (selectedCategory.toLowerCase() === "luxury" || selectedCategory.toLowerCase() === "luxary") {
        categoryMatch = (product.category && /luxury|luxary/i.test(product.category)) ||
                        (descVal.toLowerCase().includes("luxury") || descVal.toLowerCase().includes("luxary")) ||
                        (brandVal && ["rolex", "seiko"].includes(brandVal.toLowerCase())) ||
                        (priceVal >= 5000);
      } else {
        categoryMatch = !!(product.category && product.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      }

      let priceMatch = true;
      if (maxPrice) {
        priceMatch = priceVal <= maxPrice;
      } else {
        if (selectedPrice === "Under ₹200") {
          priceMatch = priceVal < 200;
        } else if (selectedPrice === "₹200 - ₹1,000") {
          priceMatch = priceVal >= 200 && priceVal <= 1000;
        } else if (selectedPrice === "₹1,000 - ₹5,000") {
          priceMatch = priceVal >= 1000 && priceVal <= 5000;
        } else if (selectedPrice === "Over ₹5,000") {
          priceMatch = priceVal > 5000;
        }
      }

      return queryMatch && brandMatch && categoryMatch && priceMatch;
    });
  }, [baseList, searchQuery, selectedBrand, selectedPrice, selectedCategory, maxPrice]);



  const handleReset = () => {
    setSearchQuery("");
    setSearchParams({});
    setSelectedBrand("All");
    setSelectedPrice("All");
    setSelectedCategory("All");
  };

  return (
    <div className="bg-white text-neutral-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Filter and Content Layout */}
      <div className="max-w-7xl mx-auto px-1.5 sm:px-6 py-4 flex-1 w-full">

        {/* Sleek Minimal Header */}
        <div className="flex items-baseline justify-between mb-4 ">
          <h1 className="text-xl font-black uppercase tracking-wider text-black">
            Timepieces
          </h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
            {filteredProducts.length} Results
          </p>
        </div>



        {/* Always-visible Clean Filter Section */}
        <div className="flex flex-col gap-5 mb-5 pb-2">
          {/* Brand Filter Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <div className="relative w-full overflow-hidden">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {["All", "Titan", "Casio", "Fastrack", "Rolex"].map((brand) => {
                  const isSelected = selectedBrand === brand;
                  return (
                    <button
                      key={brand}
                      onClick={() => {
                        setSelectedBrand(brand);
                        if (brand === "All") {
                          searchParams.delete("brand");
                        } else {
                          searchParams.set("brand", brand);
                        }
                        setSearchParams(searchParams);
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${isSelected
                          ? "bg-black text-white border border-black shadow-sm"
                          : " text-neutral-800 border border-neutral-500 hover:border-neutral-800 hover:text-black hover:bg-neutral-100 active:scale-95"
                        }`}
                    >
                      {brand}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Category Filter Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <div className="relative w-full overflow-hidden">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {["All", "Analog", "Smart Watch", "Female", "Luxury"].map((cat) => {
                  const isSelected = selectedCategory === cat || 
                    (cat === "Smart Watch" && selectedCategory.toLowerCase().includes("smart")) ||
                    (cat === "Female" && selectedCategory.toLowerCase().includes("fem")) ||
                    (cat === "Luxury" && selectedCategory.toLowerCase().includes("lux"));
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        if (cat === "All") {
                          searchParams.delete("category");
                        } else {
                          searchParams.set("category", cat);
                        }
                        setSearchParams(searchParams);
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${isSelected
                          ? "bg-black text-white border border-black shadow-sm"
                          : " text-neutral-850 border border-neutral-500 hover:border-neutral-800 hover:text-black hover:bg-neutral-100 active:scale-95"
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Price Filter Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <div className="relative w-full overflow-hidden">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {["All", "Under ₹200", "₹200 - ₹1,000", "₹1,000 - ₹5,000", "Over ₹5,000"].map((priceRange) => {
                  const isSelected = selectedPrice === priceRange;
                  return (
                    <button
                      key={priceRange}
                      onClick={() => {
                        setSelectedPrice(priceRange);
                        searchParams.delete("maxPrice"); // Clear landing slider custom scale limit
                        if (priceRange === "All") {
                          searchParams.delete("price");
                        } else {
                          searchParams.set("price", priceRange);
                        }
                        setSearchParams(searchParams);
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${isSelected
                          ? "bg-black text-white border border-black shadow-sm"
                          : " text-neutral-850 border border-neutral-500 hover:border-neutral-805 hover:text-black hover:bg-neutral-100 active:scale-95"
                        }`}
                    >
                      {priceRange}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid / Empty State */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-6 md:gap-8 mb-8">
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <Card key={product._id || product.id} product={product} />
              ))}
            </div>
            {visibleCount < filteredProducts.length && (
              <div className="flex justify-center mb-16">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="px-6 py-3 bg-black hover:bg-neutral-800 text-[10px] font-black uppercase tracking-widest text-white rounded-full transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
                >
                  See More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 border border-dashed border-neutral-200 rounded-3xl mb-16 max-w-xl mx-auto px-6">
            <SlidersHorizontal size={24} className="mx-auto text-neutral-400 mb-4" />
            <h3 className="text-sm font-black uppercase tracking-wider text-black mb-1">No Timepieces Match</h3>
            <p className="text-xs text-neutral-500 font-medium mb-5 leading-relaxed">
              We couldn't find any watches matching your query. Try searching for other calibres, or select different filters.
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-[9px] font-black uppercase tracking-widest text-white rounded-full transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}