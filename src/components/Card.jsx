import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import { GitCompare } from "lucide-react";

const Card = memo(function Card({ product = {} }) {
  console.log("Card render", product._id || product.id);
  const navigate = useNavigate();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const brand = product.brand || "Titan";
  const name = product.model_name || product.name || "Titan Karishma Analog Black Dial Men's Watch";

  let image = product.image;
  if (!image && product.images) {
    image = product.images.find(img => img.is_main)?.url || product.images[0]?.url;
  }
  if (!image) {
    image = "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTks2A_m02ftOVE8GfuqOanpR67Uo4KWA0cz2eOFsPXIvvB2ZaA1MHkartj-fLktkBPf3_8YX2wtaFpUkzzeAcJpYeQeIqy-Irp6DoGb4BgH_8H128dmNPTlg";
  }

  let price = product.price;
  if (typeof product.price === "number") {
    price = `₹${product.price.toLocaleString("en-IN")}`;
  } else if (!price) {
    price = "₹8,499";
  }

  const description = product.description || "Luxury stainless steel dive watch with sapphire crystal and precision mechanical movement.";

  const mockProduct = {
    ...product,
    id: product._id || product.id || `static-${brand.toLowerCase().replace(/\s+/g, '-')}-${price.replace(/[^0-9]/g, '')}`,
    brand,
    name,
    image,
    price,
    description
  };

  const isCompared = isInCompare(mockProduct.id);

  const handleAddToCollection = async (e) => {
    e.stopPropagation();
    const watchId = product._id || product.id;
    if (!watchId || String(watchId).startsWith("static-")) {
      alert("This static demo timepiece cannot be saved.");
      return;
    }
    try {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "/api";
      const res = await fetch(`${apiHost}/api/v1/user/collection/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watchId }),
        credentials: "include",
      });
      const result = await res.json();
      if (res.ok) {
        window.dispatchEvent(new Event("wishlist-updated"));
        alert("Added to your wishlist!");
      } else {
        alert(result.message || "Failed to add to collection. Please check if you are logged in.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add to collection.");
    }
  };

  const getOptimizedImageUrl = (url) => {
    if (!url) return url;
    if (url.includes("unsplash.com")) {
      const baseUrl = url.split("?")[0];
      return `${baseUrl}?auto=format&fit=crop&w=240&q=70`;
    }
    if (url.includes("cloudflare") || (url.includes("r2.dev") && !url.includes("pub-d8cc81bcc5e745daa136d306cefc6ae5.r2.dev"))) {
      // Only rewrite if it's on a custom cloudflare zone, not on default r2.dev subdomains
      if (url.includes("cloudflare") && !url.includes("/cdn-cgi/image/")) {
        try {
          const parsedUrl = new URL(url);
          const origin = parsedUrl.origin;
          const path = parsedUrl.pathname;
          return `${origin}/cdn-cgi/image/width=200,quality=70,format=auto${path}`;
        } catch (e) {
          return url;
        }
      }
    }
    return url;
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id || product.id}`, { state: { product } })}
      className="w-full max-w-[340px] mx-auto bg-white border border-neutral-100/80 rounded-2xl overflow-hidden hover:shadow-lg hover:border-neutral-200/80 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 flex flex-col group cursor-pointer relative"
    >
      {/* Compare Button overlay (placed as direct child of card container for absolute positioning safety) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isCompared) {
            removeFromCompare(mockProduct.id);
          } else {
            addToCompare(mockProduct);
          }
        }}
        className={`absolute top-2 left-2 z-30 px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[7px] sm:text-[8px] font-black uppercase tracking-wider rounded-md border flex items-center gap-1 transition-colors duration-200 cursor-pointer active:scale-95 ${isCompared
          ? "bg-black text-white border-black shadow-sm"
          : "bg-white/95 text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:text-black"
          }`}
      >
        <GitCompare size={9} className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        <span>{isCompared ? "Comparing" : "Compare"}</span>
      </button>

      {/* Product Image Container with Sleek Subtle Gradient */}
      <div className="relative w-full h-[180px] sm:h-[220px] bg-gradient-to-b from-neutral-50/40 to-white flex items-center justify-center p-0.5 sm:p-2 overflow-hidden">
        <img
          src={getOptimizedImageUrl(image)}
          alt={name}
          className="max-w-full max-h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 select-none"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Card Content Area - Compact padding on mobile */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Brand Label & Attribute Dots */}
        <div className="flex items-center justify-between mb-1.5 sm:mb-2.5">
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] text-neutral-800 border border-neutral-200  px-2 py-0.5 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 group-hover:border-neutral-300 group-hover:bg-white group-hover:text-black">
            {brand}
          </span>
          <div className="hidden sm:flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
          </div>
        </div>

        {/* Title - Smaller on mobile */}
        <h3 className="text-xs sm:text-sm font-black text-black tracking-tight mb-0.5 sm:mb-1 group-hover:text-gray-700 transition-colors duration-300">
          {name}
        </h3>

        {/* Description - Hidden on mobile for clean catalog alignment */}
        <p
          className="hidden sm:block text-[11px] font-medium text-gray-500 leading-relaxed mb-4"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.5rem" // Align the height of the description block across cards
          }}
        >
          {description}
        </p>

        {/* Price + Action Button */}
        <div className="flex items-center justify-between mt-auto pt-2.5 sm:pt-3">
          <div className="flex flex-col">
            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-gray-400 mb-0 sm:mb-0.5">Price</span>
            <span className="text-xs sm:text-sm font-black text-black tracking-tighter tabular-nums">
              {price}
            </span>
          </div>

          <button
            onClick={handleAddToCollection}
            className="px-2.5 sm:px-4 py-1.5 sm:py-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] bg-black text-white hover:bg-neutral-800 hover:scale-[1.02] rounded-full transition-all duration-300 shadow-sm active:scale-[0.96] cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
});

export default Card;