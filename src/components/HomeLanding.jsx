import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PriceFilter from "./PriceFilter";

export default function HomeLanding() {
  const navigate = useNavigate();
  const [price, setPrice] = useState(5000);
  const [brand, setBrand] = useState("All");
  const [category, setCategory] = useState("All");
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint is 1024px
    };
    checkMobile();
    let timeoutId;
    const debouncedCheckMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };
    window.addEventListener("resize", debouncedCheckMobile);
    return () => {
      window.removeEventListener("resize", debouncedCheckMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (brand !== "All") params.set("brand", brand);
    if (category !== "All") params.set("category", category);
    params.set("maxPrice", price.toString());
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen lg:h-[560px] flex flex-col lg:flex-row px-6 md:px-10 py-0 md:py-10 lg:py-0 items-center lg:items-start transition-all duration-500">

      {/* Left Image - Completely excluded on mobile/tablet to prevent downloading 711KB of hidden asset */}
      {!isMobile && (
        <div className="hidden lg:flex justify-start pt-10 pl-0 pr-5 shrink-0">
          <img
            src="/white watch.png"
            alt="WATCH"
            className="h-[430px] w-auto animate-float"
            decoding="async"
          />
        </div>
      )}

      {/* Right Content Area */}
      <div className="w-full lg:max-w-4xl flex flex-col items-center lg:items-start">

        {/* Responsive Banner Image */}
        <picture className="w-full">
          <source media="(max-width: 640px)" srcSet="/banner 3-mobile.png" />
          <img
            src="/banner 3.png"
            alt="Watch Banner"
            fetchPriority="high"
            decoding="async"
            className="
    w-[calc(100%+3rem)]
    max-w-none
    -mx-6
    h-auto
    object-contain
    select-none
    pointer-events-none

    /* Tablet */
    sm:mx-0
    sm:w-full
    sm:max-w-full
    sm:px-4
    md:px-6

    /* Desktop */
    lg:px-0
  "
          />
        </picture>



        {/* Filters Layout - Stacked & Centered on mobile, side-by-side on tablet/desktop */}
        <div id="home-filters" className="flex flex-col md:flex-row gap-6 mt-3 md:mt-6 w-full justify-center lg:justify-start items-center md:items-start">
          <PriceFilter price={price} setPrice={setPrice} />
          <div className="w-full max-w-[320px] flex flex-col gap-4">
            <BrandFilter selected={brand} setSelected={setBrand} />
            <CategoryFilter selected={category} setSelected={setCategory} />
            {/* Premium Search Button with Ticking Watch Dial Complication */}
            <button
              onClick={handleSearch}
              className="self-center w-48 relative py-2.5 px-4 rounded-xl bg-black text-white hover:bg-white hover:text-black font-black uppercase tracking-[0.25em] text-[9px] flex items-center justify-center gap-2.5 transition-[background-color,color,transform,box-shadow] duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:translate-y-[-1px] active:scale-[0.97] border border-black overflow-hidden group cursor-pointer"
            >
              {/* Mechanical Watch Second-Hand Sub-dial Icon */}
              <div className="relative w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center shrink-0">
                {/* 12, 3, 6, 9 markers */}
                <div className="absolute top-0 w-[1px] h-[2px] bg-current/40"></div>
                <div className="absolute right-0 w-[2px] h-[1px] bg-current/40"></div>
                <div className="absolute bottom-0 w-[1px] h-[2px] bg-current/40"></div>
                <div className="absolute left-0 w-[2px] h-[1px] bg-current/40"></div>
                {/* Static watch hand */}
                <div
                  className="absolute w-[1px] h-[5px] bg-current origin-bottom bottom-1/2 rounded-full rotate-45"
                ></div>
                {/* Hub */}
                <div className="absolute w-0.5 h-0.5 bg-current rounded-full"></div>
              </div>
              <span className="relative z-20">Search Matches</span>
            </button>
          </div>
        </div>

      </div>

    </div >
  );
}



export const BrandFilter = memo(function BrandFilter({ selected, setSelected }) {
  const brands = ["All", "Titan", "Fastrack", "Casio", "Rolex", "Sonata", "Fossil", "Seiko"];

  return (
    <div className="w-full max-w-[320px] pt-5 pb-4 px-5 bg-white lg:bg-white/80 lg:backdrop-blur-xl rounded-[2.5rem] shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white">
      <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-4">Brands</h2>
      <div className="grid grid-cols-2 gap-3">
        {brands.map((brand) => {
          const isActive = selected === brand;
          return (
            <button
              key={brand}
              onClick={() => setSelected(brand)}
              className={`flex items-center justify-center py-2.5 px-3 rounded-xl border transition-all cursor-pointer ${isActive
                ? "bg-black text-white border-black shadow-sm"
                : "bg-gray-50/50 text-gray-700 border-gray-100 hover:border-black hover:shadow-sm"
                }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {brand}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export const CategoryFilter = memo(function CategoryFilter({ selected, setSelected }) {
  const options = ["All", "Analog", "Smart Watch", "Female", "Luxury"];

  return (
    <div className="w-full max-w-[320px] pt-4 pb-3 px-5 bg-white lg:bg-white/80 lg:backdrop-blur-xl rounded-[1.75rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white flex flex-col gap-2.5">
      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-black pl-1">Category</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selected === option;
          return (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={`py-1.5 px-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all duration-300 relative border cursor-pointer ${isActive
                ? "bg-black text-white border-black shadow-sm"
                : "bg-gray-50/50 text-gray-700 border-gray-100 hover:border-black hover:shadow-sm"
                }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
});



