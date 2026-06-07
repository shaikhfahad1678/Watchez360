import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutUs() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans selection:bg-neutral-100 text-neutral-900">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-20 w-full flex flex-col justify-center">
        {/* Page Header */}
        <div className="mb-10 sm:mb-16">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-500 block mb-2">
            Our Horological Philosophy
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            About Watchez360
          </h1>
        </div>

        {/* Brand Story Sections */}
        <div className="space-y-12 text-sm leading-relaxed text-neutral-700 font-medium">
          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-neutral-950">
              The Heritage of Precision
            </h2>
            <p>
              Watchez360 was founded with a singular, clear mandate: to connect discerning watch collectors and daily wear enthusiasts with timepieces of exceptional craft, reliability, and visual character. We believe a watch is far more than a mechanism to track seconds; it is a mechanical sculpture, an extension of personal expression, and a monument to human engineering.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-neutral-950">
              Curated Curation
            </h2>
            <p>
              Every timepiece in our catalog is hand-selected and verified for architectural value, caliber complexity, and quality materials. From the rugged dive durability of classic automatic calibres to the refined digital integration of modern high-performance smartwatches, we prioritize quality over abundance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-neutral-950">
              Uncompromised Authenticity
            </h2>
            <p>
              We source directly from certified manufacturers and authorized boutique networks. When you acquire a timepiece through Watchez360, you receive absolute assurance of caliber authenticity, manufacturer warranty support, and pristine presentation boxes. Our client support team remains at your disposal to advise on size compatibility, fit adjustments, and collection maintenance.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
