import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Trash2, ShoppingBag } from "lucide-react";

export default function Collection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const apiHost = `http://${window.location.hostname}:8000`;
        const res = await fetch(`${apiHost}/api/v1/user/me`, {
          credentials: "include",
        });
        const result = await res.json();
        if (res.ok && result.data?.watchCollection) {
          setItems(result.data.watchCollection);
        }
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (watchId) => {
    try {
      const apiHost = `http://${window.location.hostname}:8000`;
      const res = await fetch(`${apiHost}/api/v1/user/collection/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watchId }),
        credentials: "include",
      });
      const result = await res.json();
      if (res.ok && result.data) {
        setItems(result.data);
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const getWatchImage = (watch) => {
    let img = watch.image;
    if (!img && watch.images) {
      img = watch.images.find((i) => i.is_main)?.url || watch.images[0]?.url;
    }
    return img || "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTks2A_m02ftOVE8GfuqOanpR67Uo4KWA0cz2eOFsPXIvvB2ZaA1MHkartj-fLktkBPf3_8YX2wtaFpUkzzeAcJpYeQeIqy-Irp6DoGb4BgH_8H128dmNPTlg";
  };

  const getWatchPrice = (watch) => {
    if (typeof watch.price === "number") {
      return `₹${watch.price.toLocaleString("en-IN")}`;
    }
    return watch.price || "₹8,499";
  };

  return (
    <div className="bg-white text-neutral-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-6 flex-1 w-full">
        {/* Sleek Minimalist Header */}
        <div className="mb-5  flex items-baseline justify-between">
          <div>
            <span className="text-[9px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-2 block">
              Wishlist / My Selection
            </span>
            <h1 className="text-2xl font-black uppercase tracking-wider text-black">
              Saved Timepieces
            </h1>
          </div>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest hidden sm:block">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center shrink-0 mx-auto">
              <div className="absolute w-[1px] h-[5px] bg-black origin-bottom rounded-full animate-[spin_1.5s_linear_infinite]"></div>
            </div>
            <p className="text-xs font-semibold text-neutral-500 mt-4 uppercase tracking-widest">Winding collection calibre...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-4 max-w-4xl">
            {items.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col md:flex-row md:items-center gap-4 p-4 bg-white border border-neutral-100 rounded-2xl hover:shadow-lg hover:shadow-neutral-100/40 transition-all duration-300"
              >
                {/* Image + Details (Always horizontal side-by-side) */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Image Container */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-50 shrink-0 relative">
                    <img
                      src={getWatchImage(item)}
                      alt={item.model_name || item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] font-black uppercase tracking-[0.25em] text-neutral-400 mb-1 block">
                      {item.brand}
                    </span>
                    <h2 className="text-xs font-bold text-neutral-800 mb-1 leading-relaxed truncate">
                      {item.model_name || item.name}
                    </h2>
                    <p className="text-xs font-black uppercase tracking-wider text-black">
                      {getWatchPrice(item)}
                    </p>
                  </div>
                </div>

                {/* Actions (Horizontal layout below image+details on mobile, side-by-side on desktop) */}
                <div className="flex items-center gap-2.5 mt-3 md:mt-0 justify-end w-full md:w-auto">
                  <button className="flex-1 md:flex-none px-5 py-2.5 bg-black hover:bg-neutral-800 text-[9px] font-black uppercase tracking-widest text-white rounded-full transition duration-300 cursor-pointer active:scale-[0.97] text-center">
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item._id)}
                    aria-label="Remove watch from wishlist"
                    className="w-9 h-9 border border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 max-w-md mx-auto">
            <ShoppingBag className="mx-auto text-neutral-300 mb-6" size={40} strokeWidth={1.5} />
            <h2 className="text-sm font-black uppercase tracking-wider text-black mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-neutral-500 font-medium leading-relaxed mb-8">
              Explore our curation of premium calibres and add watches to your saved selection.
            </p>
            <Link
              to="/search"
              className="inline-block px-6 py-3 bg-black hover:bg-neutral-800 text-[9px] font-black uppercase tracking-widest text-white rounded-full transition duration-300 cursor-pointer"
            >
              Explore Timepieces
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}