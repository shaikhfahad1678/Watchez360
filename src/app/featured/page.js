import Featured from "../../pages/Featured";
import { getApiUrl } from "../../utils/api";

export default async function Page() {
  let initialProducts = [];
  try {
    const apiHost = getApiUrl("/api/v1/product/section/Featured");
    const res = await fetch(apiHost, { next: { revalidate: 60 } });
    const result = await res.json();
    if (result.success && result.data?.products?.length > 0) {
      initialProducts = result.data.products;
    } else {
      // fallback
      const backupRes = await fetch(getApiUrl("/api/v1/product"), { next: { revalidate: 60 } });
      const backupData = await backupRes.json();
      initialProducts = backupData.data || [];
    }
  } catch (err) {
    console.error("Failed to pre-fetch featured watches on server:", err);
  }

  return <Featured initialProducts={initialProducts} />;
}
