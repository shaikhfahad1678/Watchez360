import ProductClientWrapper from "./ProductClientWrapper";

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  let product = null;
  try {
    const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiHost}/api/v1/product/${id}`);
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        product = result.data;
      }
    }
  } catch (err) {
    console.error("Error fetching product metadata for ID", id, err);
  }
  
  if (!product) {
    return {
      title: "Premium Timepiece | Watchez360",
      description: "Explore exquisite luxury watches and smart wearable technology on Watchez360."
    };
  }
  
  const title = `${product.name} | ${product.brand || "Watchez360"}`;
  const description = product.description || `Buy ${product.name} at Watchez365. Premium horology collection.`;
  
  let imageUrl = "";
  if (product.image) {
    imageUrl = typeof product.image === "string" ? product.image : product.image.url;
  } else if (product.images && product.images.length > 0) {
    const firstImg = product.images[0];
    imageUrl = typeof firstImg === "string" ? firstImg : firstImg.url;
  }
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    }
  };
}

export default async function Page({ params }) {
  return <ProductClientWrapper />;
}
