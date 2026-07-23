import Home from "../pages/Home";
import { getApiUrl } from "../utils/api";

export default async function Page() {
  let initialFeaturedProducts = [];
  let initialTrendingProducts = [];
  let initialSmartProducts = [];

  try {
    const [featuredRes, trendingRes, smartRes] = await Promise.all([
      fetch(getApiUrl("/api/v1/product/section/Featured"), { next: { revalidate: 60 } }).then(res => res.ok ? res.json() : null),
      fetch(getApiUrl("/api/v1/product/section/Trending"), { next: { revalidate: 60 } }).then(res => res.ok ? res.json() : null),
      fetch(getApiUrl("/api/v1/product?category=Smart%20Watch&limit=4"), { next: { revalidate: 60 } }).then(res => res.ok ? res.json() : null)
    ]);

    // 1. Featured Section
    if (featuredRes?.success && Array.isArray(featuredRes.data?.products)) {
      initialFeaturedProducts = featuredRes.data.products;
    } else {
      // fallback
      const backupRes = await fetch(getApiUrl("/api/v1/product?limit=4"), { next: { revalidate: 60 } }).then(res => res.ok ? res.json() : null);
      initialFeaturedProducts = backupRes?.data || [];
    }

    // 2. Trending Section
    if (trendingRes?.success && Array.isArray(trendingRes.data?.products)) {
      initialTrendingProducts = trendingRes.data.products;
    } else {
      // fallback
      const backupRes = await fetch(getApiUrl("/api/v1/product?limit=4"), { next: { revalidate: 60 } }).then(res => res.ok ? res.json() : null);
      initialTrendingProducts = backupRes?.data ? [...backupRes.data].reverse() : [];
    }

    // 3. Smart Watches Section
    if (smartRes?.statusCode === 200 && Array.isArray(smartRes.data)) {
      initialSmartProducts = smartRes.data;
    }
  } catch (err) {
    console.error("Error fetching homepage sections on the server", err);
  }

  return (
    <Home 
      initialFeaturedProducts={initialFeaturedProducts}
      initialTrendingProducts={initialTrendingProducts}
      initialSmartProducts={initialSmartProducts}
    />
  );
}
