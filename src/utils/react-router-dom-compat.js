"use client";

import React from "react";
import NextLink from "next/link";
import { useRouter, usePathname, useSearchParams as useNextSearchParams, useParams as useNextParams } from "next/navigation";

// Mock Link
export const Link = React.forwardRef(({ to, href, ...props }, ref) => {
  return <NextLink ref={ref} href={to || href || "#"} {...props} />;
});
Link.displayName = "Link";

// Mock useNavigate
export function useNavigate() {
  const router = useRouter();
  return React.useCallback((to, options) => {
    if (to === -1) {
      router.back();
    } else {
      router.push(to);
    }
  }, [router]);
}

// Mock useLocation
export function useLocation() {
  const pathname = usePathname();
  const searchParams = useNextSearchParams();
  const search = searchParams ? `?${searchParams.toString()}` : "";
  
  // Next.js doesn't natively support history state like react-router-dom,
  // so we default to an empty state object.
  return React.useMemo(() => ({
    pathname,
    search,
    hash: "",
    state: {}
  }), [pathname, search]);
}

// Mock useParams
export function useParams() {
  return useNextParams() || {};
}

// Mock useSearchParams
export function useSearchParams() {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = React.useCallback((newParams) => {
    let queryStr = "";
    if (newParams instanceof URLSearchParams) {
      queryStr = newParams.toString();
    } else if (typeof newParams === "object") {
      const p = new URLSearchParams();
      Object.entries(newParams).forEach(([k, v]) => {
        if (v !== undefined && v !== null) p.set(k, v);
      });
      queryStr = p.toString();
    }
    const suffix = queryStr ? `?${queryStr}` : "";
    router.push(`${pathname}${suffix}`);
  }, [router, pathname]);

  // Next.js searchParams is read-only. We construct a mutable URLSearchParams object.
  const searchParamsObj = React.useMemo(() => {
    return new URLSearchParams(searchParams?.toString() || "");
  }, [searchParams]);

  return [searchParamsObj, setSearchParams];
}
