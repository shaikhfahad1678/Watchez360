"use client";

import { useState, useRef } from "react";
import {
  Play,
  Tv,
  Smartphone,
  X,
  ExternalLink,
  Film,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const extractYoutubeId = (str) => {
  if (!str) return "";
  const s = String(str).trim();

  // 1. Direct 11-character YouTube video ID (e.g. "5WnN-QeYl-c")
  if (/^[\w-]{11}$/.test(s)) {
    return s;
  }

  // 2. YouTube Shorts (e.g. https://www.youtube.com/shorts/8Z1eK1s8aO0)
  const shortsMatch = s.match(/\/shorts\/([\w-]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }

  // 3. YouTube Watch parameter (e.g. https://www.youtube.com/watch?v=5WnN-QeYl-c)
  const watchMatch = s.match(/[?&]v=([\w-]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // 4. Shortened youtu.be link (e.g. https://youtu.be/8Z1eK1s8aO0)
  const youtuBeMatch = s.match(/youtu\.be\/([\w-]{11})/i);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return youtuBeMatch[1];
  }

  // 5. YouTube Embed link (e.g. https://www.youtube.com/embed/8Z1eK1s8aO0)
  const embedMatch = s.match(/\/embed\/([\w-]{11})/i);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  return "";
};

const parseVideoInput = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map(item => {
      if (typeof item === "string") return { url: item };
      if (typeof item === "object" && item !== null) {
        return {
          url: item.url || item.youtubeId || item.id,
          title: item.title,
          duration: item.duration,
          channel: item.channel
        };
      }
      return null;
    }).filter(Boolean);
  }
  if (typeof input === "string") {
    return input.split(/[;\n]/).map(s => ({ url: s.trim() })).filter(item => item.url);
  }
  return [];
};

const getResolvedVideos = (product) => {
  const brand = product?.brand || "Watch";
  const model = product?.model_name || product?.name || "Timepiece";

  const rawShorts = parseVideoInput(product?.shorts);
  const rawVideos = parseVideoInput(product?.videos);

  if (rawShorts.length > 0 || rawVideos.length > 0) {
    const list = [];
    if (rawShorts.length > 0) {
      rawShorts.forEach((item, idx) => {
        const yId = extractYoutubeId(item.url);
        if (yId) {
          list.push({
            id: `short-${idx}-${yId}`,
            youtubeId: yId,
            thumbnail: `https://img.youtube.com/vi/${yId}/hqdefault.jpg`,
            title: item.title || `${brand} ${model} Short #${idx + 1}`,
            type: "short",
            duration: item.duration || "0:45",
            views: "Watch Short",
            channel: item.channel || brand
          });
        }
      });
    }
    if (rawVideos.length > 0) {
      rawVideos.forEach((item, idx) => {
        const yId = extractYoutubeId(item.url);
        if (yId) {
          list.push({
            id: `video-${idx}-${yId}`,
            youtubeId: yId,
            thumbnail: `https://img.youtube.com/vi/${yId}/hqdefault.jpg`,
            title: item.title || `${brand} ${model} Full Review & Hands-On #${idx + 1}`,
            type: "video",
            duration: item.duration || "10:00",
            views: "Watch Review",
            channel: item.channel || brand
          });
        }
      });
    }
    if (list.length > 0) {
      return list;
    }
  }

  return [];
};

export default function WatchVideoSection({ product, brand = "Titan", name = "Timepiece" }) {
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [playingInlineId, setPlayingInlineId] = useState(null);

  const shortsRef = useRef(null);
  const videosRef = useRef(null);

  const resolvedVideos = getResolvedVideos(product);
  const shortsList = resolvedVideos.filter((v) => v.type === "short");
  const reviewsList = resolvedVideos.filter((v) => v.type === "video");

  if (shortsList.length === 0 && reviewsList.length === 0) {
    return null;
  }

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-5 sm:mt-5 pt-5 sm:pt-5 w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 flex items-center gap-1.5 mb-1.5">
            <Film size={14} className="text-red-600" /> Watch In Action
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.1em] text-black">
            Videos & YouTube Shorts
          </h2>
        </div>
        <p className="text-xs text-neutral-600 font-medium max-w-md">
          Watch real hands-on reviews, unboxings, and high-definition wrist shots of the {brand} {name}.
        </p>
      </div>

      {/* YouTube Shorts Sub-Section */}
      {shortsList.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              YouTube Shorts (9:16 Vertical)
            </h3>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[9px] font-bold text-neutral-400 uppercase tracking-widest mr-1">
                Vertical 9:16
              </span>
              <button
                onClick={() => scrollContainer(shortsRef, "left")}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                aria-label="Slide Shorts Left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollContainer(shortsRef, "right")}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                aria-label="Slide Shorts Right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Horizontal Track for Shorts (9:16 Aspect Ratio) */}
          <div
            ref={shortsRef}
            className="flex gap-4 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x snap-mandatory select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {shortsList.map((short) => {
              const thumb = short.thumbnail || `https://img.youtube.com/vi/${short.youtubeId}/hqdefault.jpg`;
              const isPlaying = playingInlineId === short.id;

              return (
                <div
                  key={short.id}
                  className="group relative flex-shrink-0 w-44 sm:w-52 aspect-[9/16] snap-start rounded-2xl overflow-hidden bg-black border border-neutral-200/80 hover:border-red-500/50 shadow-md transition-all flex flex-col justify-between"
                >
                  {isPlaying ? (
                    <div className="relative w-full h-full bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${short.youtubeId}?autoplay=1&rel=0&playsinline=1`}
                        title={short.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingInlineId(null);
                        }}
                        className="absolute top-2 right-2 z-20 bg-black/80 hover:bg-red-600 text-white p-1 rounded-full text-xs shadow-lg transition-colors cursor-pointer"
                        title="Close Player"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => setPlayingInlineId(short.id)}
                      className="relative w-full h-full flex flex-col justify-between p-3.5 cursor-pointer select-none"
                    >
                      {/* Thumbnail */}
                      <img
                        src={thumb}
                        alt={short.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

                      {/* Badges */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="bg-red-600 text-white text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          <Smartphone size={9} /> 9:16 Short
                        </span>
                        <span className="bg-black/70 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                          {short.duration}
                        </span>
                      </div>

                      {/* Play Button Overlay */}
                      <div className="relative z-10 my-auto self-center w-12 h-12 rounded-full bg-red-600/90 hover:bg-red-600 border border-white/40 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-all duration-300">
                        <Play size={20} className="fill-white translate-x-0.5" />
                      </div>

                      {/* Info */}
                      <div className="relative z-10">
                        <p className="text-white text-xs font-bold line-clamp-2 leading-tight mb-1 drop-shadow-sm">
                          {short.title}
                        </p>
                        <div className="flex items-center justify-between text-[9px] text-neutral-300 font-medium">
                          <span>{short.channel}</span>
                          <span className="text-red-400 font-bold uppercase tracking-wider">Play Inline ▶</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Reviews Sub-Section (16:9 Landscape) */}
      {reviewsList.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Film size={15} className="text-black" />
              In-Depth Reviews & Unboxing Videos (16:9)
            </h3>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[9px] font-bold text-neutral-400 uppercase tracking-widest mr-1">
                Horizontal 16:9
              </span>
              <button
                onClick={() => scrollContainer(videosRef, "left")}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                aria-label="Slide Videos Left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollContainer(videosRef, "right")}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                aria-label="Slide Videos Right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Horizontal Track for 16:9 Landscape Videos */}
          <div
            ref={videosRef}
            className="flex gap-4 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x snap-mandatory select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reviewsList.map((video) => {
              const thumb = video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
              const isPlaying = playingInlineId === video.id;

              return (
                <div
                  key={video.id}
                  className="group flex-shrink-0 w-68 sm:w-80 snap-start bg-white border border-neutral-200/80 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all cursor-pointer flex flex-col justify-between select-none shadow-sm hover:shadow-md"
                >
                  {/* 16:9 Aspect Ratio Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    {isPlaying ? (
                      <div className="relative w-full h-full bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1`}
                          title={video.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlayingInlineId(null);
                          }}
                          className="absolute top-2 right-2 z-20 bg-black/80 hover:bg-red-600 text-white p-1 rounded-full text-xs shadow-lg transition-colors cursor-pointer"
                          title="Close Player"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => setPlayingInlineId(video.id)}
                        className="relative w-full h-full cursor-pointer group/thumb"
                      >
                        <img
                          src={thumb}
                          alt={video.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-red-600/90 hover:bg-red-600 flex items-center justify-center text-white shadow-xl group-hover/thumb:scale-110 transition-all duration-300">
                            <Play size={20} className="fill-current translate-x-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                          {video.duration}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <h4 className="text-xs font-bold text-black leading-snug line-clamp-2 mb-2">
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 font-semibold border-t border-neutral-100 pt-2">
                      <span className="flex items-center gap-1 text-neutral-700">
                        <Tv size={11} /> {video.channel}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPlayingInlineId(isPlaying ? null : video.id)}
                        className="text-red-600 hover:text-red-700 font-black uppercase tracking-wider cursor-pointer"
                      >
                        {isPlaying ? "Close" : "Play Inline ▶"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl w-full flex flex-col ${
              activeVideoModal.type === "short" ? "max-w-xs sm:max-w-sm h-[80vh]" : "max-w-3xl"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800 text-white">
              <div className="flex items-center gap-2 overflow-hidden mr-3">
                <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase flex-shrink-0">
                  {activeVideoModal.type === "short" ? "Short" : "Review"}
                </span>
                <h3 className="text-xs font-bold truncate text-neutral-100">
                  {activeVideoModal.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                  href={`https://www.youtube.com/${activeVideoModal.type === "short" ? "shorts/" : "watch?v="}${activeVideoModal.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                  title="Watch on YouTube"
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="p-1.5 rounded bg-neutral-800 hover:bg-red-600 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Video Container */}
            <div className={`w-full relative bg-black flex items-center justify-center ${activeVideoModal.type === "short" ? "flex-1 min-h-[350px]" : "aspect-video"}`}>
              {activeVideoModal.mp4Url ? (
                <video
                  src={activeVideoModal.mp4Url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideoModal.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideoModal.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-3.5 py-2 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400 font-medium">
              <span>Channel: <strong className="text-white">{activeVideoModal.channel}</strong></span>
              <span>{activeVideoModal.views}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
