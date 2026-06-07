import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const bodyText = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoUrl = `mailto:watchez360@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    setTimeout(() => {
      setLoading(false);
      setSent(true);
      window.location.href = mailtoUrl;
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 800);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans selection:bg-neutral-100 text-neutral-900">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 md:py-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="mb-8">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-500 block mb-2">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-955">
              Contact Us
            </h1>
          </div>

          {sent ? (
            <div className="p-6 border border-neutral-200 rounded-2xl bg-neutral-50/50">
              <h3 className="text-sm font-black uppercase tracking-wider text-black mb-2">
                Message Dispatched
              </h3>
              <p className="text-xs text-neutral-600 font-semibold tracking-wide leading-relaxed">
                Thank you for contacting Watchez360. Our horological relations team will reply to your inquiry within 24 standard business hours.
              </p>
              <button 
                onClick={() => setSent(false)} 
                className="mt-4 text-[9px] font-black uppercase tracking-widest text-black hover:underline cursor-pointer"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-neutral-800 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arthur Pendragon"
                    className="w-full bg-white border border-neutral-250 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-black text-black placeholder:text-neutral-400 transition-all duration-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-neutral-800 ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arthur@camelot.com"
                    className="w-full bg-white border border-neutral-250 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-black text-black placeholder:text-neutral-400 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-800 ml-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Inquiry regarding Rolex Oystersteel availability"
                  className="w-full bg-white border border-neutral-250 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-black text-black placeholder:text-neutral-400 transition-all duration-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-800 ml-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your horological request here..."
                  className="w-full bg-white border border-neutral-250 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-black text-black placeholder:text-neutral-400 transition-all duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative py-3 bg-black text-white hover:bg-neutral-950 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-pulse">Dispatching...</span>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Contact Info Cards */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8 lg:border-l lg:border-neutral-100 lg:pl-12">
          


          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">
              Client Support Desk
            </h3>
            <p className="text-xs text-neutral-600 font-semibold leading-relaxed">
              For collection appraisals, order status, or servicing support:<br />
              <span className="text-black font-bold">watchez360@gmail.com</span>
            </p>
          </div>



        </div>

      </main>

      <Footer />
    </div>
  );
}
