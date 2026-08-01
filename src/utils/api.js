export function getApiUrl(path) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  if (typeof window === "undefined") {
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
    return `${backendUrl}${cleanPath}`;
  } else {
    // Client-side: use local port 8000 direct connection during development to avoid proxy issues, or relative /api
    const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const apiHost = isLocalhost ? "http://localhost:8000" : (process.env.NEXT_PUBLIC_API_URL || "/api");
    
    // Avoid double /api if apiHost is "/api" and cleanPath is "/api/..."
    if (apiHost === "/api" && cleanPath.startsWith("/api/")) {
      return cleanPath;
    }
    // Clean double /api or absolute host concatenation
    if (apiHost.startsWith("http") && cleanPath.startsWith("/api/")) {
      return `${apiHost}${cleanPath}`;
    }
    return `${apiHost}${cleanPath}`;
  }
}
