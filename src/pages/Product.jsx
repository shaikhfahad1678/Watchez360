import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductSection from "../components/ProductSection";
import WristFitGuide from "../components/WristFitGuide";
import {
  Maximize2,
  Cpu,
  Shield,
  Link2,
  Waves,
  Sparkles,
  Circle,
  Battery,
  Phone
} from "lucide-react";

const iconMap = {
  dial: Maximize2,
  shape: Circle,
  movement: Cpu,
  case: Shield,
  strap: Link2,
  resistance: Waves,
  glass: Sparkles,
  display: Sparkles,
  battery: Battery,
  calling: Phone
};

const specifications = [
  {
    id: "dial",
    label: "Dial Size",
    value: "40 mm",
    shortDesc: "Optimal casing diameter",
    details: "Perfect wrist presence with a 13mm thickness and a 48mm lug-to-lug distance, comfortable for all wrist sizes.",
    x: "50%", y: "50%",
  },
  {
    id: "movement",
    label: "Movement",
    value: "Automatic",
    shortDesc: "Self-winding calibre",
    details: "High-precision mechanical movement with a 42-hour power reserve, 25 jewels, and sweeping second hand.",
    x: "80%", y: "50%",
  },
  {
    id: "case",
    label: "Case Material",
    value: "Steel",
    shortDesc: "Marine-grade 316L",
    details: "Forged in surgical-grade 316L stainless steel, offering exceptional corrosion resistance and a pristine polish.",
    x: "22%", y: "30%",
  },
  {
    id: "strap",
    label: "Strap Material",
    value: "Bracelet",
    shortDesc: "Oyster-style links",
    details: "Three-piece solid link Oyster bracelet featuring a folding Oysterlock safety clasp with Easylink comfort extension.",
    x: "50%", y: "15%",
  },
  {
    id: "resistance",
    label: "Resistance",
    value: "300 m",
    shortDesc: "Triple-lock waterproof",
    details: "Diving-grade water resistance up to 300 meters (1,000 feet) secured by a triple-lock screw-down crown system.",
    x: "78%", y: "38%",
  },
  {
    id: "glass",
    label: "Glass",
    value: "Sapphire",
    shortDesc: "Double AR Scratch-proof",
    details: "Scratch-resistant synthetic sapphire crystal with double-sided anti-reflective coating for pristine legibility.",
    x: "38%", y: "42%",
  }
];

const colors = [
  { name: "Onyx Black", hex: "#1A1A1A" },
  { name: "Champagne Gold", hex: "#DFBA73" },
  { name: "Royal Blue", hex: "#223E6C" },
  { name: "Classic Silver", hex: "#D8D8D8" }
];

const getLinkStyles = (label) => {
  const normalized = label.toLowerCase();
  if (normalized.includes("amazon")) {
    return {
      dotColor: "bg-[#FF9900]",
      borderColor: "hover:border-[#FF9900]/40 hover:bg-[#FF9900]/5",
      textColor: "group-hover:text-[#FF9900]",
    };
  }
  if (normalized.includes("flipkart")) {
    return {
      dotColor: "bg-[#2874F0]",
      borderColor: "hover:border-[#2874F0]/40 hover:bg-[#2874F0]/5",
      textColor: "group-hover:text-[#2874F0]",
    };
  }
  if (normalized.includes("myntra")) {
    return {
      dotColor: "bg-[#F13AB1]",
      borderColor: "hover:border-[#F13AB1]/40 hover:bg-[#F13AB1]/5",
      textColor: "group-hover:text-[#F13AB1]",
    };
  }
  return {
    dotColor: "bg-neutral-900",
    borderColor: "hover:border-neutral-900 hover:bg-neutral-50",
    textColor: "group-hover:text-black",
  };
};

export default function Product() {
  const location = useLocation();
  const { id } = useParams();

  const [dbProduct, setDbProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!dbProduct && !!id);

  useEffect(() => {
    if (!dbProduct && id) {
      setLoading(true);
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://140.245.10.48:8000";
      fetch(`${apiHost}/api/v1/product/${id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) {
            setDbProduct(res.data);
          }
        })
        .catch((err) => console.error("Error loading product:", err))
        .finally(() => setLoading(false));
    }
  }, [id, dbProduct]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-neutral-900 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center relative">
            <div className="absolute w-[1px] h-[5px] bg-black origin-bottom rounded-full animate-[spin_2s_linear_infinite] -translate-y-[2.5px]"></div>
            <div className="absolute w-[1px] h-[8px] bg-black origin-bottom rounded-full animate-[spin_8s_linear_infinite] -translate-y-[4px]"></div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-800 animate-pulse">
            Syncing Timepiece...
          </span>
        </div>
      </div>
    );
  }

  if (!dbProduct) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-neutral-900 font-sans">
        <p className="text-sm font-bold text-neutral-600">Timepiece not found.</p>
      </div>
    );
  }

  const handleAddToCollection = async () => {
    if (!dbProduct?._id) {
      alert("This timepiece cannot be saved (missing ID).");
      return;
    }
    try {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://140.245.10.48:8000";
      const res = await fetch(`${apiHost}/api/v1/user/collection/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watchId: dbProduct._id }),
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

  useEffect(() => {
    if (!dbProduct?._id) return;
    const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://140.245.10.48:8000";

    // 1. Increment product views (always, logged in or not)
    fetch(`${apiHost}/api/v1/product/view/${dbProduct._id}`, {
      method: "POST",
    }).catch((err) => console.error("Error updating views:", err));

    // 2. Add to recent products list (only if logged in)
    fetch(`${apiHost}/api/v1/user/recent/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watchId: dbProduct._id }),
      credentials: "include",
    }).catch((err) => console.error("Error updating recent products:", err));
  }, [dbProduct?._id]);

  const handleLinkClick = () => {
    if (!dbProduct?._id) return;
    const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://140.245.10.48:8000";
    fetch(`${apiHost}/api/v1/product/click/${dbProduct._id}`, {
      method: "POST",
    }).catch((err) => console.error("Error tracking link click:", err));
  };

  const brand = dbProduct?.brand || "Titan";
  const name = dbProduct?.model_name || dbProduct?.name || "Titan Karishma Analog Black Dial Men's Watch";
  const description = dbProduct?.description || "A masterpiece of modern watchmaking, the Submariner Classic merges iconic vintage design codes with high-precision engineering. Built for explorers, enthusiasts, and collectors alike, it features an incredible level of polish and visual excellence that adapts seamlessly from active outdoor pursuits to sophisticated formal evenings.";
  
  let resolvedImages = [];
  if (dbProduct?.images && dbProduct.images.length > 0) {
    resolvedImages = [...dbProduct.images]
      .sort((a, b) => (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0))
      .map(img => img.url);
  } else {
    resolvedImages = [
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRDSGVPYjcIbgC2TcaURidzP_LNZWZqEDBD1U-IUbwtQN-YLZwoNugvKX0yEPxBNARVOHGLnXMZxsLxmZ7ipe5Q2pzE4TFuo6P2eApx-J9FXbvI8xi7c22umA",
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQw7OrZGZgrbBkEDEKIOE1NB9hKgxq819aPBqMvmz6oTqIl7q2my82ufZChJtmg2d1GsvwhRjC8geBvjk4JociI4bOewShFiwCmqPUk1kCxhOxltMFHTAcEu-1F",
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRsEuTalyrc53qV6NG4Yo0zd87aJNKP0BXVensp6GWW19I_Glo4OHmqI2y7h7krki2-ajdRkKRCM6DCQn-a4h3XxmlbnW2CYWOdvyxr_6S2nNnqz2mpI9ZcwXnQ",
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQqYDBtw8x13hRvaecIYLOWarLkY1sje9d_MNJhHP2pJkzUSKAAJZHffs5Eunzc0RnaX4pbqhu1Py_wH25W5gtwPF9noZ_d8rqeUJBCygh7clQ3YzC41XhxWoE",
    ];
  }

  const [mainImage, setMainImage] = useState(resolvedImages[0] || "");
  const [hoveredSpec, setHoveredSpec] = useState(null);

  let priceStr = "";
  if (dbProduct) {
    priceStr = typeof dbProduct.price === "number" ? `₹${dbProduct.price.toLocaleString("en-IN")}` : dbProduct.price;
  } else {
    priceStr = "₹8,499";
  }

  let resolvedColors = [];
  if (dbProduct?.color) {
    resolvedColors = dbProduct.color.split(",").map(c => c.trim()).filter(Boolean).map(c => ({
      name: c,
      hex: c.toLowerCase() === "black" ? "#1A1A1A" :
           c.toLowerCase() === "silver" ? "#D8D8D8" :
           c.toLowerCase() === "gold" ? "#DFBA73" :
           c.toLowerCase() === "rose gold" ? "#E0A899" :
           c.toLowerCase() === "steel" ? "#B0C4DE" :
           c.toLowerCase() === "blue" ? "#223E6C" :
           c.toLowerCase() === "green" ? "#2E8B57" :
           c.toLowerCase() === "white" ? "#FFFFFF" :
           c.toLowerCase() === "grey" ? "#808080" :
           c.toLowerCase() === "brown" ? "#8B4513" :
           c.toLowerCase() === "red" ? "#FF0000" : "#CCCCCC"
    }));
  } else {
    resolvedColors = colors;
  }

  const [selectedColor, setSelectedColor] = useState(resolvedColors[0] || { name: "Default", hex: "#CCCCCC" });

  const resolvedSpecs = [
    {
      id: "dial",
      label: "Dial Size",
      value: dbProduct?.dial_size_cm ? `${dbProduct.dial_size_cm} cm` : "40 mm",
      shortDesc: "Optimal casing diameter",
      details: dbProduct?.dial_size_cm ? `Comfortable wrist presence with a ${dbProduct.dial_size_cm} cm dial width.` : "Perfect wrist presence with a 13mm thickness and a 48mm lug-to-lug distance, comfortable for all wrist sizes.",
      x: "50%", y: "50%",
    },
    {
      id: "shape",
      label: "Dial Shape",
      value: dbProduct?.dial_shape || "Round",
      shortDesc: "Timepiece dial geometry",
      details: dbProduct?.dial_shape ? `Crafted with a sleek and symmetric ${dbProduct.dial_shape} dial shape.` : "Crafted with a sleek and symmetric Round dial shape for classic aesthetics.",
      x: "50%", y: "30%",
    },
    {
      id: "movement",
      label: "Movement",
      value: dbProduct?.movement_type || "Automatic",
      shortDesc: "Self-winding calibre",
      details: dbProduct?.movement_type ? `Watch movement powered by high-precision ${dbProduct.movement_type} system.` : "High-precision mechanical movement with a 42-hour power reserve, 25 jewels, and sweeping second hand.",
      x: "80%", y: "50%",
    },
    {
      id: "case",
      label: "Case Material",
      value: dbProduct?.case_material || "Steel",
      shortDesc: "Marine-grade casing",
      details: dbProduct?.case_material ? `Forged in high-quality ${dbProduct.case_material} for exceptional durability.` : "Forged in surgical-grade 316L stainless steel, offering exceptional corrosion resistance and a pristine polish.",
      x: "22%", y: "30%",
    },
    {
      id: "strap",
      label: "Strap Material",
      value: dbProduct?.strap_material || "Bracelet",
      shortDesc: "Premium bands",
      details: dbProduct?.strap_material ? `Fitted with a comfortable and secure ${dbProduct.strap_material} strap.` : "Three-piece solid link Oyster bracelet featuring a folding Oysterlock safety clasp with Easylink comfort extension.",
      x: "50%", y: "15%",
    },
    {
      id: "resistance",
      label: "Resistance",
      value: dbProduct?.water_resistance_m ? `${dbProduct.water_resistance_m} m` : "300 m",
      shortDesc: "Waterproof capabilities",
      details: dbProduct?.water_resistance_m ? `Secured waterproof performance up to ${dbProduct.water_resistance_m} meters.` : "Diving-grade water resistance up to 300 meters (1,000 feet) secured by a triple-lock screw-down crown system.",
      x: "78%", y: "38%",
    },
    {
      id: "glass",
      label: "Glass",
      value: dbProduct?.glass_type || "Sapphire",
      shortDesc: "Scratch-guard shield",
      details: dbProduct?.glass_type ? `Equipped with highly protective ${dbProduct.glass_type} dial cover.` : "Scratch-resistant synthetic sapphire crystal with double-sided anti-reflective coating for pristine legibility.",
      x: "38%", y: "42%",
    }
  ];

  const isSmartWatch = dbProduct?.category?.toLowerCase().includes("smart") || 
                       dbProduct?.category?.toLowerCase().includes("fitness");

  if (isSmartWatch) {
    if (dbProduct?.display_type) {
      resolvedSpecs.push({
        id: "display",
        label: "Display Type",
        value: dbProduct.display_type,
        shortDesc: "Display technology",
        details: `Advanced high-brightness ${dbProduct.display_type} screen.`,
        x: "50%", y: "45%",
      });
    }
    if (dbProduct?.screen_size_in) {
      resolvedSpecs.push({
        id: "dial",
        label: "Screen Size",
        value: dbProduct.screen_size_in,
        shortDesc: "Display screen space",
        details: `Featuring a responsive ${dbProduct.screen_size_in} touch screen display.`,
        x: "50%", y: "55%",
      });
    }
    if (dbProduct?.battery_life_days) {
      resolvedSpecs.push({
        id: "battery",
        label: "Battery Life",
        value: dbProduct.battery_life_days,
        shortDesc: "Endurance rating",
        details: `Efficient energy system providing up to ${dbProduct.battery_life_days} of battery life.`,
        x: "20%", y: "60%",
      });
    }
    if (dbProduct?.bluetooth_calling) {
      resolvedSpecs.push({
        id: "calling",
        label: "Bluetooth Calling",
        value: dbProduct.bluetooth_calling === "Yes" ? "Supported" : "Not Supported",
        shortDesc: "Call connectivity",
        details: dbProduct.bluetooth_calling === "Yes"
          ? "Allows hands-free calling directly from the smartwatch via Bluetooth connectivity."
          : "Does not support native Bluetooth voice calling.",
        x: "30%", y: "70%",
      });
    }
  }
  
  const resolvedLinks = dbProduct?.custom_links && dbProduct.custom_links.length > 0
    ? dbProduct.custom_links
    : [
        { label: "Amazon", url: "https://www.amazon.in" },
        { label: "Flipkart", url: "https://www.flipkart.com" },
        { label: "Titan", url: "https://www.titan.co.in" }
      ];

  return (
    <div className="bg-white min-h-screen text-neutral-900 selection:bg-neutral-100 overflow-x-hidden">

      <Navbar />

      {/* Main Product Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-5 w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start w-full">

          {/* Left Column: Image Showcase */}
          <div className="flex flex-col w-full min-w-0">
            {/* Studio Shot Display */}
            <div className="relative w-full h-[320px] sm:h-[500px] bg-gradient-to-b from-neutral-50/50 to-neutral-100/20 border border-neutral-100/60 rounded-2xl flex items-center justify-center pt-10 sm:pt-6 pb-10 sm:pb-0 overflow-hidden group">
              <img
                src={mainImage}
                alt={name}
                className="max-w-full max-h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 select-none"
              />
              <span className="absolute bottom-3 right-3 text-[8px] font-black uppercase tracking-widest text-neutral-400 select-none">Studio Shot</span>
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex gap-3 sm:gap-4 mt-4 overflow-x-auto pb-1 select-none">
              {resolvedImages.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-neutral-50/80 border rounded-xl flex items-center justify-center p-2 cursor-pointer transition-all duration-300 hover:bg-white
                  ${mainImage === img ? "border-black shadow-sm scale-[0.98]" : "border-neutral-200/60 hover:border-neutral-400"}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Premium Product Specifications */}
          <div className="flex flex-col pt-2 lg:pt-4 w-full min-w-0">
            {/* Brand Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-800 border border-neutral-200 px-3 py-1 rounded-md shadow-sm">
                {brand}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight mb-2">
              {name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-6">
              <div className="flex gap-0.5 text-amber-500 text-sm">
                <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-neutral-300">★</span>
              </div>
              <span className="text-black font-black">4.8</span>
              <span className="text-neutral-300">|</span>
              <span className="hover:text-black transition-colors cursor-pointer">124 Curated Reviews</span>
            </div>

            {/* Features Description */}
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium mb-8">
              {description}
            </p>



            {/* Available Colors */}
            <div className="mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-800 mb-3 flex items-center justify-between">
                <span>Available Colors</span>
                <span className="text-[10px] font-bold text-neutral-500 normal-case tracking-normal">
                  {selectedColor?.name}
                </span>
              </h3>
              <div className="flex gap-2">
                {resolvedColors.map((color) => {
                  const isSelected = selectedColor?.name === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full p-[2px] border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-neutral-900"
                          : "border-transparent hover:border-neutral-300"
                      }`}
                      title={color.name}
                      aria-label={`Select ${color.name} color`}
                    >
                      <span
                        className="block w-full h-full rounded-full border border-neutral-200/40"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing Area */}
            <div className="flex items-end justify-between pt-3 mt-1 mb-8">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400 mb-1">Retail Price</span>
                <span className="text-3xl sm:text-4xl font-black text-black tracking-tight tabular-nums">{priceStr}</span>
              </div>
            </div>

            {/* Add to Collection Button */}
            <button
              onClick={handleAddToCollection}
              className="w-full py-4 sm:py-4.5 bg-black text-white hover:bg-neutral-800 text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] rounded-full transition-all duration-300 shadow-sm hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
            >
              Add to Collection
            </button>

            {/* Check Price On Section */}
            {resolvedLinks.length > 0 && (
              <div className="mt-6 pt-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-800 mb-3">
                  Check Price On
                </h4>
                <div className="flex flex-col gap-2">
                  {resolvedLinks.map((link, idx) => {
                    const styles = getLinkStyles(link.label);
                    return (
                      <a
                        key={idx}
                        href={link.url}
                        onClick={handleLinkClick}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between py-3 px-4 border border-neutral-700 ${styles.borderColor} rounded-xl text-[10px] font-black uppercase tracking-wider text-neutral-800 transition-all duration-300 cursor-pointer group`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${styles.dotColor}`} />
                          {link.label}
                        </span>
                        <span className={`text-[10px] text-neutral-400 ${styles.textColor} transition-colors`}>↗</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Specifications Section */}
        <div className="mt-12 sm:mt-16 border-t border-neutral-100 pt-12 sm:pt-16 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 block mb-2">
                Technical Calibre
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.1em] text-black">
                Watch Specifications
              </h2>
            </div>
            <p className="text-xs text-neutral-700 mt-2 md:mt-0 font-medium max-w-sm">
              Compare the watch dial size with your wrist width using our interactive fit guide.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            {/* Left Column: Interactive Watch Wrist Fit Guide */}
            <WristFitGuide 
              dialSize={dbProduct?.dial_size_cm ? parseFloat(dbProduct.dial_size_cm) : 4.0} 
              dialShape={dbProduct?.dial_shape || "Round"}
            />

            {/* Right Column: Detailed Specifications Grid */}
            <div className="w-full lg:col-span-6 min-w-0">
              <div className="grid sm:grid-cols-2 gap-4">
                {resolvedSpecs.map((spec) => {
                  const IconComponent = iconMap[spec.id];
                  const isActive = hoveredSpec === spec.id;

                  return (
                    <div
                      key={spec.id}
                      onMouseEnter={() => setHoveredSpec(spec.id)}
                      onMouseLeave={() => setHoveredSpec(null)}
                      className={`group relative rounded-2xl p-5 border select-none
                        ${isActive
                          ? "bg-white border-neutral-950 shadow-md"
                          : "bg-neutral-50/50 border-neutral-100/80 hover:bg-white hover:border-neutral-200"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`p-2 rounded-xl
                          ${isActive
                            ? "bg-neutral-950 text-white"
                            : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-900 group-hover:text-white"
                          }`}
                        >
                          <IconComponent size={16} />
                        </span>

                        <span className={`text-[8px] font-black uppercase tracking-widest
                          ${isActive ? "text-neutral-950" : "text-neutral-400 group-hover:text-neutral-600"}`}
                        >
                          {spec.label}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-black tracking-tight mb-0.5">
                        {spec.value}
                      </h3>

                      <p className="text-[10px] font-semibold text-neutral-400 group-hover:text-neutral-500">
                        {spec.shortDesc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Additional Sections (Similar & More Watches) */}
      <ProductSection currentProduct={dbProduct} />

      <Footer />
    </div>
  );
}