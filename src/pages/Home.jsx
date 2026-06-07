import { useNavigate } from 'react-router-dom';
import HomeLanding from '../components/HomeLanding';
import Navbar from '../components/Navbar';
import HomeSection from '../components/HomeSection';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col">

      {/* Navbar */}
      <Navbar />

      <section className="w-full h-auto lg:h-[560px]">
        {/* Background Image */}
        <HomeLanding />
      </section>

      {/* Grouped Watch Collections Component */}
      <HomeSection />

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-6 py-10 text-center">

        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-neutral-800 mb-2">
          Timeless Style Meets Precision
        </h2>

        <p className="text-[11px] text-neutral-400 max-w-md mx-auto mb-6 tracking-wide leading-relaxed font-medium">
          Elevate your everyday look with our curated, premium watch collection.
        </p>

        <button 
          onClick={() => navigate("/collection")}
          className="text-[9px] font-black uppercase tracking-[0.2em] border-b border-black pb-0.5 hover:text-neutral-500 hover:border-neutral-500 transition-all duration-300 cursor-pointer active:scale-95"
        >
          Explore Collection
        </button>

      </section>

      {/* Shared Footer */}
      <Footer />

    </div>
  );
}