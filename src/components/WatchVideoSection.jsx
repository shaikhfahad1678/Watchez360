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

const getResolvedVideos = (product) => {
  if (product?.videos && Array.isArray(product.videos) && product.videos.length > 0) {
    return product.videos;
  }

  const brand = product?.brand || "Watch";
  const model = product?.model_name || product?.name || "Timepiece";

  return [
    {
      id: "short-1",
      youtubeId: "8Z1eK1s8aO0",
      mp4Url: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-gold-watch-41558-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      title: `${brand} ${model} - 4K Wrist Roll & Dial Shine`,
      type: "short",
      duration: "0:45",
      views: "185K views",
      channel: "WatchShorts HQ",
    },
    {
      id: "video-1",
      youtubeId: "5WnN-QeYl-c",
      mp4Url: "https://assets.mixkit.co/videos/preview/mixkit-macro-shot-of-the-gears-of-a-watch-41560-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
      title: `${brand} ${model} Full Review & Hands-On Unboxing`,
      type: "video",
      duration: "12:42",
      views: "440K views",
      channel: "Teddy Baldassarre",
    },
    {
      id: "short-2",
      youtubeId: "lY20FX3B2Qo",
      mp4Url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-wrist-watch-41559-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      title: `Unboxing ${brand} ${model} - First Impressions`,
      type: "short",
      duration: "0:35",
      views: "120K views",
      channel: "Horology Shorts",
    },
    {
      id: "video-2",
      youtubeId: "aVv-H11Xw48",
      mp4Url: "https://assets.mixkit.co/videos/preview/mixkit-man-putting-on-a-watch-41557-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop&q=80",
      title: `Is the ${brand} ${model} Worth Buying? In-Depth Review`,
      type: "video",
      duration: "10:15",
      views: "310K views",
      channel: "Timepiece Enthusiast",
    },
    {
      id: "short-3",
      youtubeId: "k2wLpZ3n3_k",
      mp4Url: "https://assets.mixkit.co/videos/preview/mixkit-checking-the-time-on-a-wrist-watch-41561-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80",
      title: `${brand} Craftsmanship & Movement Details`,
      type: "short",
      duration: "0:50",
      views: "290K views",
      channel: "Macro Watch Daily",
    },
    {
      id: "video-3",
      youtubeId: "G6yY4_WJ4M8",
      mp4Url: "https://assets.mixkit.co/videos/preview/mixkit-watch-adjusting-the-time-41562-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80",
      title: `${brand} ${model} Water Resistance & Durability Test`,
      type: "video",
      duration: "14:20",
      views: "520K views",
      channel: "Watch Tech Reviews",
    },
  ];
};

export default function WatchVideoSection({ product, brand = "Titan", name = "Timepiece" }) {
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  const shortsRef = useRef(null);
  const videosRef = useRef(null);

  const resolvedVideos = getResolvedVideos(product);

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-5 sm:mt-5 pt-5 sm:pt-5 w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div> 
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 flex items-center gap-1.5 mb-2">
            <Film size={14} className="text-red-600" /> Watch In Action
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.1em] text-black flex items-center gap-2">
            Videos & YouTube Shorts
          </h2>
        </div>
        <p className="text-xs text-neutral-600 font-medium max-w-md">
          Watch real hands-on reviews, unboxings, and high-definition 4K wrist shots of the {brand} {name}.
        </p>
      </div>

      {/* YouTube Shorts Sub-Section */}
      <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              YouTube Shorts
            </h3>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Vertical 9:16 Experience
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollContainer(shortsRef, "left")}
                  className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors shadow-sm cursor-pointer"
                  aria-label="Slide Shorts Left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollContainer(shortsRef, "right")}
                  className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors shadow-sm cursor-pointer"
                  aria-label="Slide Shorts Right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Slide Roll Horizontal Track */}
          <div
            ref={shortsRef}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {resolvedVideos
              .filter((v) => v.type === "short")
              .map((short) => {
                const thumb = short.thumbnail || `https://img.youtube.com/vi/${short.youtubeId}/hqdefault.jpg`;
                return (
                  <div
                    key={short.id}
                    onClick={() => setActiveVideoModal(short)}
                    className="group relative flex-shrink-0 w-44 sm:w-52 aspect-[9/16] snap-start rounded-2xl overflow-hidden bg-neutral-900 cursor-pointer shadow-md border border-neutral-200/80 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between p-3 select-none"
                  >
                    {/* Background Thumbnail */}
                    <img
                      src={thumb}
                      alt={short.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 group-hover:from-black/95 transition-colors" />

                    {/* Top Badges */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="bg-red-600 text-white text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                        <Smartphone size={10} /> Short
                      </span>
                      <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                        {short.duration}
                      </span>
                    </div>

                    {/* Center Play Icon */}
                    <div className="relative z-10 my-auto self-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:bg-red-600 group-hover:border-red-500 group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <Play size={20} className="fill-white translate-x-0.5" />
                    </div>

                    {/* Bottom Info */}
                    <div className="relative z-10">
                      <p className="text-white text-xs font-bold line-clamp-2 leading-tight mb-1 group-hover:text-red-400 transition-colors">
                        {short.title}
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-neutral-300 font-medium">
                        <span>{short.channel}</span>
                        <span>{short.views}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Full Reviews / Long-form Videos Sub-Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Film size={16} className="text-black" />
              In-Depth Reviews & Unboxing Videos
            </h3>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Horizontal 16:9 Widescreen
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollContainer(videosRef, "left")}
                  className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors shadow-sm cursor-pointer"
                  aria-label="Slide Videos Left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollContainer(videosRef, "right")}
                  className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors shadow-sm cursor-pointer"
                  aria-label="Slide Videos Right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Slide Roll Horizontal Track */}
          <div
            ref={videosRef}
            className="flex gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {resolvedVideos
              .filter((v) => v.type === "video")
              .map((video) => {
                const thumb = video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                return (
                  <div
                    key={video.id}
                    onClick={() => setActiveVideoModal(video)}
                    className="group flex-shrink-0 w-72 sm:w-84 snap-start bg-neutral-50/60 border border-neutral-200/80 rounded-2xl overflow-hidden hover:bg-white hover:border-neutral-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between select-none"
                  >
                    {/* Thumbnail Container */}
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                      <img
                        src={thumb}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black shadow-xl group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all duration-300">
                          <Play size={22} className="fill-current translate-x-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                        {video.duration}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <h4 className="text-sm font-black text-black group-hover:text-neutral-700 transition-colors leading-snug line-clamp-2 mb-3">
                        {video.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold border-t border-neutral-100 pt-3">
                        <span className="flex items-center gap-1.5 text-neutral-700">
                          <Tv size={12} /> {video.channel}
                        </span>
                        <span className="text-neutral-400">{video.views}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

      {/* Video Player Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div
            className={`relative bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl w-full flex flex-col ${
              activeVideoModal.type === "short" ? "max-w-md h-[85vh]" : "max-w-4xl"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800 text-white">
              <div className="flex items-center gap-2 overflow-hidden mr-4">
                {activeVideoModal.type === "short" ? (
                  <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase flex-shrink-0">
                    Short
                  </span>
                ) : (
                  <span className="bg-neutral-800 text-neutral-300 text-[10px] font-black px-2 py-0.5 rounded uppercase flex-shrink-0">
                    Review
                  </span>
                )}
                <h3 className="text-xs sm:text-sm font-bold truncate">
                  {activeVideoModal.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={`https://www.youtube.com/${activeVideoModal.type === "short" ? "shorts/" : "watch?v="}${activeVideoModal.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                  title="Watch on YouTube"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-600 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Video Media Container */}
            <div className={`w-full relative bg-black flex items-center justify-center ${activeVideoModal.type === "short" ? "flex-1 min-h-[400px]" : "aspect-video"}`}>
              {activeVideoModal.mp4Url ? (
                <video
                  src={activeVideoModal.mp4Url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain bg-black rounded-b-2xl"
                />
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideoModal.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideoModal.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-medium">
              <span>Channel: <strong className="text-white">{activeVideoModal.channel}</strong></span>
              <span>{activeVideoModal.views}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
