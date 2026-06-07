import { useState, useEffect, useRef, useMemo, useCallback } from "react";

const calculatePriceFromAngle = (angle, min, max) => {
  let normalizedAngle = (angle + 90) % 360;
  if (normalizedAngle < 0) normalizedAngle += 360;

  const percentage = normalizedAngle / 360;
  const value = min + (max - min) * percentage;
  return Math.round(value / 100) * 100;
};

export default function PriceFilter({ price, setPrice }) {
  const min = 1000;
  const max = 20000;

  const [isDragging, setIsDragging] = useState(false);

  // 1. Setup Refs for direct DOM access (Bypassing React renders)
  const dialRectRef = useRef(null);
  const localPriceRef = useRef(price);
  const handRef = useRef(null);
  const progressRef = useRef(null);
  const textRef = useRef(null);
  const rAFRef = useRef(null); // requestAnimationFrame ref

  // Sync if parent changes price
  useEffect(() => {
    if (!isDragging) {
      localPriceRef.current = price;
      updateVisuals(price);
    }
  }, [price, isDragging]);

  const updateDialRect = () => {
    const dial = document.getElementById("clock-dial");
    if (dial) {
      dialRectRef.current = dial.getBoundingClientRect();
    }
  };

  // 2. Direct DOM mutation function locked to screen refresh rate
  const updateVisuals = useCallback((currentPrice) => {
    if (rAFRef.current) cancelAnimationFrame(rAFRef.current);

    rAFRef.current = requestAnimationFrame(() => {
      const rotation = ((currentPrice - min) / (max - min)) * 360 - 90;
      const dashOffset = 276.46 - (276.46 * ((currentPrice - min) / (max - min)));

      // Directly manipulate the DOM elements via Refs
      if (handRef.current) {
        handRef.current.style.transform = `rotate(${rotation + 90}deg)`;
      }
      if (progressRef.current) {
        progressRef.current.style.strokeDashoffset = dashOffset;
      }
      if (textRef.current) {
        textRef.current.innerText = `₹${Number(currentPrice).toLocaleString()}`;
      }
    });
  }, [min, max]);

  const handleInteraction = useCallback((clientX, clientY) => {
    if (!dialRectRef.current) updateDialRect();
    const rect = dialRectRef.current;
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    const newPrice = calculatePriceFromAngle(angle, min, max);

    // Update the ref value and visual DOM, completely skipping React state
    localPriceRef.current = newPrice;
    updateVisuals(newPrice);
  }, [updateVisuals, min, max]);

  const getCoordinates = (e) => {
    const clientX = e.clientX !== undefined ? e.clientX : e.touches?.[0]?.clientX;
    const clientY = e.clientY !== undefined ? e.clientY : e.touches?.[0]?.clientY;
    return { clientX, clientY };
  };

  const onMouseDown = (e) => {
    updateDialRect();
    setIsDragging(true); // Triggers 1 render to disable CSS transitions
    const { clientX, clientY } = getCoordinates(e);
    if (clientX !== undefined && clientY !== undefined) {
      handleInteraction(clientX, clientY);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      if (e.cancelable) e.preventDefault();
      const { clientX, clientY } = getCoordinates(e);
      if (clientX !== undefined && clientY !== undefined) {
        handleInteraction(clientX, clientY);
      }
    };

    const handleUp = () => {
      setIsDragging(false); // Triggers 1 render to re-enable CSS transitions
      setPrice(localPriceRef.current); // Send final data to parent
    };

    window.addEventListener("mousemove", handleMove, { passive: false });
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [isDragging, handleInteraction, setPrice]);

  const clockTicksSVG = useMemo(() => {
    return (
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {[...Array(60)].map((_, i) => {
          const angle = (i * 6 * Math.PI) / 180;
          const isMajor = i % 5 === 0;
          const isSuperMajor = i % 15 === 0;
          const r1 = 43.5;
          const r2 = isSuperMajor ? 39 : (isMajor ? 41 : 42.2);

          const x1 = Number((50 + r1 * Math.sin(angle)).toFixed(4));
          const y1 = Number((50 - r1 * Math.cos(angle)).toFixed(4));
          const x2 = Number((50 + r2 * Math.sin(angle)).toFixed(4));
          const y2 = Number((50 - r2 * Math.cos(angle)).toFixed(4));

          const color = isSuperMajor ? '#000000' : (isMajor ? '#9CA3AF' : '#E5E7EB');
          const width = isSuperMajor ? 0.6 : (isMajor ? 0.45 : 0.25);

          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />
          );
        })}
      </svg>
    );
  }, []);

  // Initial render values
  const initialRotation = ((price - min) / (max - min)) * 360 - 90;
  const initialDashOffset = 276.46 - (276.46 * ((price - min) / (max - min)));

  return (
    <div className="w-full max-w-[320px] pt-5 pb-4 px-5 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white flex flex-col items-center group/card transition-all duration-500">
      <div className="w-full mb-3 px-2">
        <div className="flex flex-col">
          <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-black mb-0">Price Scale</h2>
          <div className="flex items-baseline gap-0.5">
            {/* Attached textRef here */}
            <span ref={textRef} className="text-2xl font-black text-black tracking-tighter tabular-nums">
              ₹{Number(price).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div
        id="clock-dial"
        className="relative w-60 h-60 flex items-center justify-center cursor-pointer touch-none select-none"
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-100 to-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_8px_16px_rgba(0,0,0,0.02)]"></div>

        <div
          className="absolute inset-0 rounded-full bg-black/10 blur-[30px] transition-all duration-700 opacity-0 group-hover/card:opacity-100"
          style={{
            transform: `scale(${isDragging ? 1.1 : 1})`,
            opacity: isDragging ? 0.2 : 0.1,
            willChange: "transform, opacity"
          }}
        ></div>

        {clockTicksSVG}

        <div className="absolute w-[84%] h-[84%] rounded-full bg-white shadow-[0_12px_28px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90 scale-[0.84]">
            <defs>
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#111" />
                <stop offset="100%" stopColor="#444" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="44" fill="none" stroke="#f9fafb" strokeWidth="4" />
            {/* Attached progressRef here */}
            <circle
              ref={progressRef}
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="url(#arcGradient)"
              strokeWidth="4"
              strokeDasharray="276.46"
              strokeDashoffset={initialDashOffset}
              strokeLinecap="round"
              className={isDragging ? "transition-none" : "transition-all duration-150 ease-out"}
            />
          </svg>
        </div>

        {/* Attached handRef here */}
        <div
          ref={handRef}
          className={`absolute w-0.5 h-[41%] origin-bottom bottom-1/2 rounded-full z-20 ${isDragging ? "transition-none" : "transition-transform duration-150 ease-out"}`}
          style={{
            transform: `rotate(${initialRotation + 90}deg)`,
            background: 'linear-gradient(to top, #000, #333)',
            boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
            willChange: "transform"
          }}
        >
          <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full border-2 border-white shadow-sm"></div>
        </div>

        <div className="absolute w-5 h-5 bg-white rounded-full border-[3px] border-black z-30 shadow-sm"></div>
      </div>

      <div className="mt-1 w-full flex justify-between items-center px-4">
        <div className="flex flex-col items-start">
          <span className="text-[9px] font-black uppercase tracking-widest text-black mb-0.5">Min</span>
          <span className="text-[11px] font-bold text-gray-700 italic">₹{min.toLocaleString()}</span>
        </div>
        <div className="h-[1px] flex-1 mx-3 bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-black uppercase tracking-widest text-black mb-0.5">Max</span>
          <span className="text-[11px] font-bold text-gray-700 italic">₹{max.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}