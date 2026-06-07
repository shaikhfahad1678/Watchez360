"use client";

import { Suspense } from "react";
import Account from "../../pages/AuthPage";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-800 animate-pulse">
          Loading Account...
        </span>
      </div>
    }>
      <Account />
    </Suspense>
  );
}
