import { useState } from "react";
import { Info } from "lucide-react";

export default function WristFitGuide({ dialSize = 4.0, dialShape = "Round" }) {
  const [wristWidth, setWristWidth] = useState(6.0);

  // Normalize dialSize to centimeters (e.g. if it's 40 or 42 mm, convert to 4.0 or 4.2 cm)
  const normalizedDialSize = dialSize > 10 ? dialSize / 10 : dialSize;
  const r = normalizedDialSize * 8.5;
  const isSquare = dialShape && (
    dialShape.toLowerCase().includes("square") || 
    dialShape.toLowerCase().includes("rect")
  );

  const w = wristWidth * 18;
  const yT = 160 - w / 2;
  const yB = 160 + w / 2;
  const s = wristWidth / 6.2;

  // Shift anchor to 100, 160 to keep hand and watch in proportion within a wider viewBox
  const sx = (x) => 100 + (x - 100) * s;
  const sy = (y) => 160 + (y - 160) * s;

  return (
    <div className="w-full lg:col-span-6 flex flex-col items-center bg-neutral-50/40 border border-neutral-100/60 rounded-3xl p-4 sm:p-8 relative min-h-[480px] lg:min-h-[540px] select-none shadow-inner">

      {/* Label */}
      <span className="absolute top-4 left-4 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-neutral-700 bg-white border border-neutral-100 px-2.5 py-1 rounded-full shadow-sm">
        <Info size={10} className="text-neutral-700 animate-pulse" />
        Wrist Fit Guide Blueprint
      </span>

      {/* SVG */}
      <div className="w-full max-w-[340px] sm:max-w-[440px] relative flex-1 flex items-center justify-center mt-6">
        <svg
          viewBox="0 0 480 300"
          className="w-full h-auto overflow-hidden rounded-2xl"
        >
          <defs>
            <pattern
              id="blueprint-grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(0,0,0,0.03)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>

          {/* Background */}
          <rect
            width="480"
            height="300"
            fill="url(#blueprint-grid)"
            rx="16"
          />

          {/* Center Guide */}
          <line
            x1="20"
            y1="160"
            x2="460"
            y2="160"
            stroke="rgba(0,0,0,0.03)"
            strokeDasharray="3,3"
          />

          {/* HAND OUTLINE IMAGE */}
          <image
            href="/hand_outline.png"
            x={100 - 319 * s}
            y={160 - 255 * s}
            width={742 * s}
            height={417 * s}
            className="transition-all duration-300 ease-out pointer-events-none"
          />

          {/* WATCH STRAP */}
          <g
            className="stroke-neutral-300"
            fill="none"
            strokeWidth="1"
          >
            {/* Top */}
            <path
              d={`M 78,126 L 78,${yT} L 122,${yT} L 122,126 Z`}
            />
            <line
              x1="78"
              y1={126 - (126 - yT) * 0.33}
              x2="122"
              y2={126 - (126 - yT) * 0.33}
            />
            <line
              x1="78"
              y1={126 - (126 - yT) * 0.66}
              x2="122"
              y2={126 - (126 - yT) * 0.66}
            />

            {/* Bottom */}
            <path
              d={`M 78,194 L 78,${yB} L 122,${yB} L 122,194 Z`}
            />
            <line
              x1="78"
              y1={194 + (yB - 194) * 0.33}
              x2="122"
              y2={194 + (yB - 194) * 0.33}
            />
            <line
              x1="78"
              y1={194 + (yB - 194) * 0.66}
              x2="122"
              y2={194 + (yB - 194) * 0.66}
            />
          </g>

          {/* WATCH */}
          <g>
            {isSquare ? (
              <>
                {/* Square Dial Outer */}
                <rect
                  x={100 - r}
                  y={160 - r}
                  width={2 * r}
                  height={2 * r}
                  rx={r * 0.35}
                  fill="white"
                  stroke="black"
                  strokeWidth="1.5"
                />
                {/* Square Dial Inner Border */}
                <rect
                  x={100 - r * 0.85}
                  y={160 - r * 0.85}
                  width={2 * r * 0.85}
                  height={2 * r * 0.85}
                  rx={r * 0.25}
                  fill="none"
                  stroke="black"
                  strokeWidth="0.8"
                />
                
                {/* Digital smartwatch face */}
                <text
                  x="100"
                  y="152"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-sans fill-black"
                  style={{ fontSize: `${r * 0.44}px`, fontWeight: 900, letterSpacing: "-0.03em" }}
                >
                  09:41
                </text>
                <text
                  x="100"
                  y="174"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-sans fill-neutral-455"
                  style={{ fontSize: `${r * 0.15}px`, fontWeight: 800, letterSpacing: "0.15em" }}
                >
                  WED 3
                </text>
              </>
            ) : (
              <>
                {/* Round Dial Outer */}
                <circle
                  cx="100"
                  cy="160"
                  r={r}
                  fill="white"
                  stroke="black"
                  strokeWidth="1.5"
                />
                {/* Round Dial Inner Border */}
                <circle
                  cx="100"
                  cy="160"
                  r={r * 0.85}
                  fill="none"
                  stroke="black"
                  strokeWidth="0.8"
                />
                <circle
                  cx="100"
                  cy="160"
                  r={r * 0.8}
                  fill="rgba(255,255,255,0.9)"
                />
                {/* Ticks for round */}
                <line x1="100" y1={160 - r * 0.75} x2="100" y2={160 - r * 0.6} stroke="black" strokeWidth="1" />
                <line x1="100" y1={160 + r * 0.75} x2="100" y2={160 + r * 0.6} stroke="black" strokeWidth="1" />
                <line x1={100 - r * 0.75} y1="160" x2={100 - r * 0.6} y2="160" stroke="black" strokeWidth="1" />
                <line x1={100 + r * 0.75} y1="160" x2={100 + r * 0.6} y2="160" stroke="black" strokeWidth="1" />

                {/* Center Hub */}
                <circle cx="100" cy="160" r="3" fill="black" />

                {/* Hour Hand */}
                <line
                  x1="100"
                  y1="160"
                  x2="100"
                  y2={160 - normalizedDialSize * 3}
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  transform="rotate(35 100 160)"
                />

                {/* Minute Hand */}
                <line
                  x1="100"
                  y1="160"
                  x2={100 + normalizedDialSize * 5}
                  y2="160"
                  stroke="black"
                  strokeWidth="1"
                  strokeLinecap="round"
                  transform="rotate(-15 100 160)"
                />
              </>
            )}
          </g>
        </svg>
      </div>

      {/* SLIDER */}
      <div className="w-full mt-4 bg-white/90 border border-neutral-200/50 p-4 rounded-2xl shadow-sm z-10 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-700">
            Watch Dial Size
          </span>
          <span className="text-xs font-black text-black">
            {(normalizedDialSize * 10).toFixed(0)} mm ({normalizedDialSize.toFixed(1)} cm)
          </span>
        </div>
        <div className="border-t border-neutral-100/60 my-0.5"></div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
              Adjust Wrist Width
            </span>
            <span className="text-xs font-black text-black">
              {wristWidth.toFixed(1)} cm
            </span>
          </div>

          <input
            type="range"
            min="5"
            max="8"
            step="0.1"
            value={wristWidth}
            onChange={(e) => setWristWidth(parseFloat(e.target.value))}
            className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
          />
        </div>
      </div>
    </div>
  );
}