import { useState, useEffect, useRef } from "react";
import { LucideWatch, MoreHorizontal, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryClick = (type) => {
    if (type === "smartwatch") {
      navigate("/search?category=Smart%20Watch");
      return;
    }
    if (type === "female") {
      navigate("/search?category=Female");
      return;
    }
    if (type === "luxury") {
      navigate("/search?category=Luxury");
      return;
    }

    if (location.pathname === "/") {
      const el = document.getElementById("home-filters");
      if (el) {
        const lenisInstance = document.documentElement.lenis;
        if (lenisInstance) {
          lenisInstance.scrollTo(el);
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      navigate("/search");
    }
  };
  const [searchVal, setSearchVal] = useState("");
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_URL || "/api";
        const res = await fetch(`${apiHost}/api/v1/user/me`, {
          credentials: "include",
        });
        const result = await res.json();
        if (res.ok && result.data) {
          setUser(result.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.log("Not logged in", err);
        setUser(null);
      }
    };
    fetchUser();

    const handleWishlistUpdate = () => {
      fetchUser();
    };
    window.addEventListener("wishlist-updated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
    };
  }, []);

  useEffect(() => {
    let scrollTimeout = null;
    let lastKnownScrollY = window.scrollY;

    const handleScroll = () => {
      if (scrollTimeout) return;

      scrollTimeout = setTimeout(() => {
        const currentScrollY = window.scrollY;

        // Apply a threshold of 20px to avoid micro-scroll trigger thrashing
        if (Math.abs(currentScrollY - lastKnownScrollY) > 20) {
          if (currentScrollY <= 10) {
            setVisible(true);
          } else if (currentScrollY > lastKnownScrollY) {
            setVisible(false);
          } else {
            setVisible(true);
          }
          lastKnownScrollY = currentScrollY;
        }
        scrollTimeout = null;
      }, 100); // Throttle re-renders to 100ms
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 w-full bg-white border-b border-gray-100/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out`}
      style={{
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        willChange: "transform",
        backfaceVisibility: "hidden"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        {isMobileSearchExpanded ? (
          /* Mobile Search Mode Header Cover */
          <div className="flex items-center gap-3 w-full py-0.5">
            <button 
              onClick={() => setIsMobileSearchExpanded(false)}
              className="p-1.5 text-neutral-600 hover:text-black transition"
            >
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search premium timepieces..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (searchVal.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
                    } else {
                      navigate(`/search`);
                    }
                    setIsMobileSearchExpanded(false);
                  }
                }}
                className="w-full pl-4 pr-10 py-1.5 bg-neutral-50 border border-neutral-250 rounded-full text-xs font-semibold text-black placeholder-gray-500 focus:outline-none focus:border-black outline-none"
                autoFocus
              />
              <button 
                onClick={() => {
                  if (searchVal.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchVal)}`);
                  } else {
                    navigate(`/search`);
                  }
                  setIsMobileSearchExpanded(false);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-black"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* Normal Header Mode */
          <>
            {/* Logo */}
            <div
              onClick={() => navigate(`/`)}
              className="flex items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              <img
                src="/Watchez360.png"
                alt="WATCH"
                className="h-8 md:h-10 w-auto"
              />
            </div>

            {/* Search */}
            <div className="flex items-center">

              {/* Desktop Search Bar */}
              <div className="relative hidden md:block w-[360px] group transition-all duration-300">
                {/* Watch-Search Hybrid Icon */}
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black pointer-events-none z-10 w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="10" cy="10" r="9" />
                  <line x1="16.4" y1="16.4" x2="22" y2="22" strokeWidth="1.8" />
                  <line x1="10" y1="1" x2="10" y2="2.5" strokeWidth="1.2" />
                  <line x1="19" y1="10" x2="17.5" y2="10" strokeWidth="1.2" />
                  <line x1="10" y1="19" x2="10" y2="17.5" strokeWidth="1.2" />
                  <line x1="1" y1="10" x2="2.5" y2="10" strokeWidth="1.2" />
                  <line x1="10" y1="10" x2="14.5" y2="6.0" strokeWidth="1.5" />
                  <line x1="10" y1="10" x2="6.0" y2="6.0" strokeWidth="1.0" />
                  <circle cx="10" cy="10" r="0.5" fill="currentColor" stroke="none" />
                </svg>
                <input
                  type="text"
                  placeholder="Search premium timepieces..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-black/85 hover:border-black rounded-full text-xs font-semibold text-black placeholder-gray-700 transition-all duration-300 outline-none hover:shadow-[0_8px_25px_rgba(0,0,0,0.04)]"
                />
              </div>

            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 md:gap-6">

              {/* Mobile Search Icon */}
              <div
                onClick={() => setIsMobileSearchExpanded(true)}
                className="md:hidden p-2 rounded-full hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-center group"
              >
                {/* Watch-Search Hybrid Icon */}
                <svg
                  className="text-black w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="10" cy="10" r="9" />
                  <line x1="16.4" y1="16.4" x2="22" y2="22" strokeWidth="1.8" />
                  <line x1="10" y1="1" x2="10" y2="2.5" strokeWidth="1.2" />
                  <line x1="19" y1="10" x2="17.5" y2="10" strokeWidth="1.2" />
                  <line x1="10" y1="19" x2="10" y2="17.5" strokeWidth="1.2" />
                  <line x1="1" y1="10" x2="2.5" y2="10" strokeWidth="1.2" />
                  <line x1="10" y1="10" x2="14.5" y2="6.0" strokeWidth="1.5" />
                  <line x1="10" y1="10" x2="6.0" y2="6.0" strokeWidth="1.0" />
                  <circle cx="10" cy="10" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </div>

              {/* Collection */}
              <button
                onClick={() => navigate(`/collection`)}
                className="relative p-2.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-300 group cursor-pointer"
              >
                <Heart size={20} className="text-black group-hover:scale-110 transition-transform duration-300" />
                {(user?.watchCollection?.length ?? 0) > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 text-[8px] font-black bg-black text-white w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-sm">
                    {user.watchCollection.length}
                  </span>
                )}
              </button>

              {/* Login */}
              {user ? (
                <button
                  onClick={() => navigate(`/account`)}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-800 hover:text-neutral-500 transition-colors cursor-pointer px-1 py-1"
                >
                  {user.fullName || user.username}
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/account`)}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-800 hover:text-neutral-500 transition-colors cursor-pointer px-1 py-1"
                >
                  Login
                </button>
              )}

            </div>
          </>
        )}
      </div>

      {/* Category Bar */}
      <div className="w-full bg-white border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-5 md:px-9">
          <ul className="flex items-center gap-8 h-9 text-[10px] uppercase font-black tracking-[0.2em] text-gray-700 overflow-x-auto whitespace-nowrap scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <li 
              onClick={() => handleCategoryClick("smartwatch")}
              className="cursor-pointer hover:text-black transition-colors duration-300 relative group flex items-center h-full shrink-0"
            >
              Smart Watches
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li 
              onClick={() => handleCategoryClick("female")}
              className="cursor-pointer hover:text-black transition-colors duration-300 relative group flex items-center h-full shrink-0"
            >
              Female
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li 
              onClick={() => handleCategoryClick("luxury")}
              className="cursor-pointer hover:text-black transition-colors duration-300 relative group flex items-center h-full shrink-0"
            >
              Luxury
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li 
              onClick={() => handleCategoryClick("brands")}
              className="cursor-pointer hover:text-black transition-colors duration-300 relative group flex items-center h-full shrink-0"
            >
              Brands
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li 
              onClick={() => handleCategoryClick("category")}
              className="cursor-pointer hover:text-black transition-colors duration-300 relative group flex items-center h-full shrink-0"
            >
              Category
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li 
              onClick={() => navigate("/blog")}
              className="cursor-pointer hover:text-black transition-colors duration-300 relative group flex items-center h-full shrink-0"
            >
              Blog
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}