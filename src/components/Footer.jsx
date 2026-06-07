import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-900 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand / Logo */}
        <div className="flex flex-col gap-3">
          <div 
            onClick={() => navigate("/")} 
            className="text-white text-base font-black tracking-[0.3em] uppercase cursor-pointer hover:opacity-80 transition-opacity"
          >
            Watchez360
          </div>
          <p className="text-[11px] text-neutral-500 max-w-xs leading-relaxed font-medium">
            Curating the world's most exquisite and precise timepieces. Elevating horological collections since 2026.
          </p>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-3.5">
          <h3 className="text-white text-[10px] font-black uppercase tracking-[0.25em]">Company</h3>
          <ul className="flex flex-col gap-2 text-xs font-semibold">
            <li>
              <button 
                onClick={() => navigate("/about-us")} 
                className="hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-none p-0 outline-none text-left"
              >
                About Us
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate("/contact-us")} 
                className="hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-none p-0 outline-none text-left"
              >
                Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* Contact/Info */}
        <div className="flex flex-col gap-3.5">
          <h3 className="text-white text-[10px] font-black uppercase tracking-[0.25em]">Support</h3>
          <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">
            For app assistance, account calibrations, or collection inquiries:
          </p>
          <p className="text-[11px] text-neutral-400 font-bold">
            watchez360@gmail.com
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-neutral-900 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-[9px] font-semibold text-neutral-600 uppercase tracking-widest">
          © 2026 Watchez360. All rights reserved.
        </div>
        <div className="flex gap-4 text-[9px] font-semibold text-neutral-600 uppercase tracking-widest">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
        </div>
      </div>
    </footer>
  );
}
