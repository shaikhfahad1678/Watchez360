import SmartWatches from "../../pages/SmartWatches";
import { getApiUrl } from "../../utils/api";

export default async function Page() {
  let initialProducts = [];
  try {
    const apiHost = getApiUrl("/api/v1/product?category=Smart%20Watch");
    const res = await fetch(apiHost, { next: { revalidate: 60 } });
    const result = await res.json();
    if (result.statusCode === 200 && Array.isArray(result.data)) {
      initialProducts = result.data;
    }
  } catch (err) {
    console.error("Failed to pre-fetch smart watches on server:", err);
  }

  return <SmartWatches initialProducts={initialProducts} />;
}
