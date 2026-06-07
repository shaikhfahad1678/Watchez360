import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Reset scroll to top
    window.scrollTo(0, 0);
    
    // Also reset Lenis scroll if Lenis is active on document
    try {
      const lenisInstance = document.querySelector("html")?.lenis;
      if (lenisInstance && typeof lenisInstance.scrollTo === "function") {
        lenisInstance.scrollTo(0, { immediate: true });
      }
    } catch (err) {
      console.error("Failed to reset Lenis scroll:", err);
    }
  }, [pathname, search]);

  return null;
}
