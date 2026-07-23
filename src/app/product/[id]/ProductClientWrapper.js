"use client";

import Product from "../../../pages/Product";

export default function ProductClientWrapper({ initialProduct }) {
  return <Product initialProduct={initialProduct} />;
}
