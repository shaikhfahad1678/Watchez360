import { useState, useEffect } from "react";
import { useCompare } from "../context/CompareContext";
import { X, GitCompare, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const specsToCompare = [
  { label: "Price", key: "price" },
  { label: "Gender", key: "gender" },
  { label: "Movement", key: "movement_type" },
  { label: "Strap Material", key: "strap_material" },
  { label: "Case Material", key: "case_material" },
  { label: "Dial Size", key: "dial_size_cm", format: (val) => val ? `${val} cm` : null },
  { label: "Dial Shape", key: "dial_shape" },
  { label: "Water Resistance", key: "water_resistance_m", format: (val) => val ? `${val}m` : null },
  { label: "Glass Type", key: "glass_type" },
  { label: "Display Type", key: "display_type" },
  { label: "Screen Size", key: "screen_size_in", format: (val) => val ? `${val}"` : null },
  { label: "Battery Life", key: "battery_life_days", format: (val) => val ? `${val} days` : null },
  { label: "Bluetooth Calling", key: "bluetooth_calling" },
  { label: "Color", key: "color" },
  { label: "Weight", key: "weight_g", format: (val) => val ? `${val} g` : null },
  { label: "Release Year", key: "release_year" },
  { label: "Rating", key: "rating", format: (val) => val ? `${val} / 5` : null },
];

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Scroll locking for modal
  useEffect(() => {
    if (isOpen) {
      document.documentElement.lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.lenis?.start();
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (compareList.length === 0) return null;

  const handleViewDetails = (mockProduct) => {
    setIsOpen(false);
    const productPayload = {
      ...mockProduct,
      _id: mockProduct._id || mockProduct.id,
    };
    navigate(`/product/${productPayload._id || productPayload.id}`, { state: { product: productPayload } });
  };

  // Only display specs that are defined on at least one compared timepiece
  const activeSpecs = specsToCompare.filter(spec => 
    compareList.some(product => {
      const val = product[spec.key];
      return val !== undefined && val !== null && val !== "";
    })
  );

  // We always render exactly 2 comparison slots
  const productsToRender = [compareList[0] || null, compareList[1] || null];

  return (
    <>
      {/* Bottom Sticky Shelf */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200/80 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] px-4 py-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 transition-transform duration-300">
        <div className="flex items-center gap-4 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
          <div className="flex items-center gap-2 shrink-0">
            <GitCompare size={18} className="text-black" />
            <span className="text-[10px] font-black uppercase tracking-wider text-black">
              Compare ({compareList.length}/2)
            </span>
          </div>

          <div className="h-4 w-[1px] bg-neutral-200 hidden sm:block shrink-0"></div>

          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            {compareList.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-2 bg-neutral-50 border border-neutral-200/60 rounded-xl p-1.5 pr-3 shrink-0 group relative hover:border-neutral-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shrink-0 border border-neutral-100 flex items-center justify-center p-0.5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="max-w-[100px] sm:max-w-[120px]">
                  <p className="text-[10px] font-black text-black truncate">{product.brand}</p>
                  <p className="text-[9px] text-neutral-500 font-bold truncate leading-none">{product.name}</p>
                </div>
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="ml-2 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
          <button
            onClick={clearCompare}
            className="px-4 py-2 text-neutral-500 hover:text-black text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer"
          >
            Clear All
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            Compare Now
          </button>
        </div>
      </div>

      {/* Compare Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-neutral-200/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <GitCompare size={18} className="text-black" />
              <h2 className="text-xs font-black uppercase tracking-wider text-black">
                Compare Timepieces
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full border border-neutral-200 hover:border-black flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Modal Grid Content - Maximized space, minimal padding, no card boxes, vertically scrollable */}
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-10 bg-white -webkit-overflow-scrolling-touch">
            <div className="w-full max-w-full pb-20 md:pb-24">
              <div className="grid grid-cols-2 gap-0 w-full items-start">
                {productsToRender.map((product, index) => {
                  const isFirst = index === 0;
                  
                  // Mathematically symmetrical paddings to guarantee matching width of aspect-ratio elements
                  const columnClass = isFirst
                    ? "flex flex-col bg-white transition-all duration-350 pr-4 md:pr-10 border-r border-neutral-200/80 pb-12 w-full"
                    : "flex flex-col bg-white transition-all duration-350 pl-4 md:pl-10 pb-12 w-full";

                  // Slot is empty
                  if (!product) {
                    return (
                      <div 
                        key={`empty-${index}`} 
                        className={`${columnClass} min-h-[350px] md:min-h-[500px] flex flex-col justify-center items-center`}
                      >
                        <div className="border border-dashed border-neutral-200 rounded-[2rem] p-6 text-center w-full min-h-[350px] flex flex-col justify-center items-center bg-neutral-50/10">
                          <div className="w-10 h-10 rounded-full border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 mb-3 animate-pulse">
                            <GitCompare size={16} />
                          </div>
                          <h4 className="text-[11px] font-black uppercase tracking-wider text-black mb-1">
                            Compare Side-by-Side
                          </h4>
                          <p className="text-[10px] text-neutral-400 font-bold max-w-[130px] leading-relaxed">
                            Choose another timepiece to compare details.
                          </p>
                        </div>
                      </div>
                    );
                  }

                  // Timepiece present in comparison slot
                  return (
                    <div key={product.id} className={columnClass}>
                      {/* Large Showcase Image - Clean floating watch, no card borders */}
                      <div 
                        onClick={() => handleViewDetails(product)}
                        className="w-full aspect-square flex items-center justify-center p-2 mb-6 cursor-pointer"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-w-full max-h-[300px] md:max-h-[420px] object-contain transition-transform duration-500 hover:scale-105 select-none"
                        />
                      </div>

                      {/* Brand Label & Title */}
                      <div className="mb-6 cursor-pointer" onClick={() => handleViewDetails(product)}>
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                          {product.brand}
                        </span>
                        <h3 className="text-xs sm:text-lg font-black text-black tracking-tight leading-tight hover:text-neutral-700 transition-colors">
                          {product.name}
                        </h3>
                      </div>

                      {/* Spec Fields Stacked Vertically with Increased Text Sizes */}
                      <div className="space-y-5 flex-1">
                        {activeSpecs.map((spec) => {
                          const value = product[spec.key];
                          const formattedValue = spec.format ? spec.format(value) : value;
                          return (
                            <div key={spec.key} className="border-b border-neutral-100 pb-2">
                              <span className="text-[9px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                                {spec.label}
                              </span>
                              <span className="text-xs sm:text-sm font-semibold text-neutral-900 block leading-normal">
                                {formattedValue || <span className="text-neutral-300">—</span>}
                              </span>
                            </div>
                          );
                        })}

                        {/* Description Section */}
                        {product.description && (
                          <div className="pt-2">
                            <span className="text-[9px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                              Description
                            </span>
                            <p 
                              className="text-xs sm:text-sm font-normal text-neutral-600 leading-relaxed italic"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden"
                              }}
                              title={product.description}
                            >
                              {product.description}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action buttons at the bottom of the column */}
                      <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center gap-3">
                        <button
                          onClick={() => handleViewDetails(product)}
                          className="flex-grow py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          View Details
                          <ArrowRight size={12} className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="px-4 py-2.5 text-neutral-500 hover:text-red-500 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}