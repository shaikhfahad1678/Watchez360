export function getOptimizedThumbnail(url, width = 400) {
  if (!url || typeof url !== "string") return url;

  // 1. YouTube Thumbnails Optimization (Use 320x180 mqdefault for fast mobile rendering)
  if (url.includes("img.youtube.com") || url.includes("i.ytimg.com")) {
    return url
      .replace("/maxresdefault.jpg", "/mqdefault.jpg")
      .replace("/hqdefault.jpg", "/mqdefault.jpg")
      .replace("/sddefault.jpg", "/mqdefault.jpg");
  }

  // 2. Cloudflare R2 / CDN Image Resizing & Format Optimization
  if (url.includes("cloudflarestorage.com") || url.includes("r2.dev") || url.includes("cloudflare")) {
    if (url.includes("/cdn-cgi/image/")) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}width=${width}&quality=80&format=auto`;
  }

  return url;
}
