"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { CompareProvider } from "../context/CompareContext";
import CompareDrawer from "../components/CompareDrawer";

export default function Providers({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smoothTargets: true,
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    });

    document.documentElement.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      document.documentElement.lenis = null;
    };
  }, []);

  return (
    <CompareProvider>
      {children}
      <CompareDrawer />
    </CompareProvider>
  );
}
