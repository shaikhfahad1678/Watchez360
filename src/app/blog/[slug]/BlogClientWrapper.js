"use client";

import Blog from "../../../pages/Blog";

export default function BlogClientWrapper({ initialBlogs }) {
  return <Blog initialBlogs={initialBlogs} />;
}
