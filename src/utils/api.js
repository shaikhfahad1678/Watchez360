export function getApiUrl(path) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  if (typeof window === "undefined") {
    // Server-side: Node cannot resolve relative URLs, so we use the absolute staging API endpoint.
    const backendUrl = process.env.BACKEND_API_URL || "http://140.245.10.48:8000";
    return `${backendUrl}${cleanPath}`;
  } else {
    // Client-side: use the relative endpoint which gets proxied via Next.js rewrites.
    const apiHost = process.env.NEXT_PUBLIC_API_URL || "/api";
    // Avoid double /api if apiHost is "/api" and cleanPath is "/api/..."
    if (apiHost === "/api" && cleanPath.startsWith("/api/")) {
      return cleanPath;
    }
    return `${apiHost}${cleanPath}`;
  }
}
