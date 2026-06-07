import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function Account() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Profile / Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      const apiHost = `http://${window.location.hostname}:8000`;
      const res = await fetch(`${apiHost}/api/v1/user/me`, {
        credentials: "include",
      });
      const result = await res.json();
      if (res.ok && result.data) {
        setCurrentUser(result.data);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.log("Not logged in", err);
      setCurrentUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleWishlistUpdate = () => {
      fetchUser();
    };
    window.addEventListener("wishlist-updated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
    };
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    setError("");

    try {
      const apiHost = `http://${window.location.hostname}:8000`;
      const res = await fetch(`${apiHost}/api/v1/user/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: response.credential }),
        credentials: "include",
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.message || "Google authentication failed.");
      }

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        fetchUser();
        window.dispatchEvent(new Event("wishlist-updated"));
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Google authentication failed.");
    }
  };

  useEffect(() => {
    if (currentUser) return; // Skip if already logged in
    
    const renderGoogleBtn = () => {
      /* global google */
      if (typeof google !== "undefined") {
        const btnEl = document.getElementById("google-signin-btn");
        if (btnEl) {
          if (!window.googleInitialized) {
            google.accounts.id.initialize({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID,
              callback: handleGoogleCredentialResponse,
            });
            window.googleInitialized = true;
          }

          google.accounts.id.renderButton(
            btnEl,
            { 
              theme: "outline", 
              size: "large", 
              text: "continue_with",
              shape: "pill",
              width: "360"
            }
          );
        }
      }
    };

    renderGoogleBtn();

    // Set a short timeout as fallback to ensure DOM rendering has finished
    const timer = setTimeout(renderGoogleBtn, 100);
    return () => clearTimeout(timer);
  }, [isLogin, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!isLogin && !name) {
      setError("Please enter your full name.");
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const apiHost = `http://${window.location.hostname}:8000`;
      const url = isLogin 
        ? `${apiHost}/api/v1/user/login`
        : `${apiHost}/api/v1/user/register`;

      const generatedUsername = !isLogin 
        ? name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() + Math.floor(Math.random() * 1000)
        : undefined;

      const payload = isLogin
        ? { email, username: email, password }
        : { email, username: generatedUsername, password, fullName: name };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Authentication failed.");
      }

      if (!isLogin) {
        // Auto-login after successful registration
        const loginResponse = await fetch(`${apiHost}/api/v1/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username: email, password }),
          credentials: "include",
        });
        if (!loginResponse.ok) {
          // If auto-login fails, just switch to login view
          setIsLogin(true);
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        fetchUser();
        window.dispatchEvent(new Event("wishlist-updated"));
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleLogout = async () => {
    try {
      const apiHost = `http://${window.location.hostname}:8000`;
      const res = await fetch(`${apiHost}/api/v1/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setCurrentUser(null);
        navigate("/");
        // Dispatch event so navbar updates instantly
        window.dispatchEvent(new Event("wishlist-updated"));
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during logout");
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans selection:bg-neutral-100 text-neutral-900 relative overflow-hidden">
      <Navbar />

      {/* Background Gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(248,248,248,0.7)_100%)]"></div>

      {checkingAuth ? (
        <div className="flex-1 flex items-center justify-center py-20 z-20 relative">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-800 animate-pulse">Syncing Calibre...</span>
        </div>
      ) : currentUser ? (
        /* Account Details Page */
        <div className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-12 w-full z-20 relative">
          {/* User Details Header */}
          <div className="bg-neutral-50/50 border border-neutral-200/50 rounded-3xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-800 block mb-1">Authenticated Member</span>
              <h2 className="text-3xl font-black text-black tracking-tight mb-1">{currentUser.fullName || currentUser.username}</h2>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">{currentUser.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-black text-white hover:bg-neutral-800 hover:text-black hover:bg-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 cursor-pointer active:scale-95 border border-black shadow-sm"
            >
              Sign Out
            </button>
          </div>

          {/* Wishlist / Collection Section */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-neutral-800 mb-6 border-b border-neutral-105 pb-2">Your Wishlist ({currentUser.watchCollection?.length || 0})</h3>
            
            {currentUser.watchCollection && currentUser.watchCollection.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-6 md:gap-8">
                {currentUser.watchCollection.map((watch) => (
                  <Card key={watch._id || watch.id} product={watch} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-neutral-200 rounded-3xl max-w-xl mx-auto px-6 bg-white">
                <h4 className="text-xs font-black uppercase tracking-wider text-black mb-1">Your Wishlist is Empty</h4>
                <p className="text-[11px] text-neutral-500 font-medium mb-6 leading-relaxed">
                  Browse our catalog of premium timepieces and add them to your custom wishlist to see them here.
                </p>
                <button
                  onClick={() => navigate("/search")}
                  className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-[9px] font-black uppercase tracking-widest text-white rounded-full transition-colors cursor-pointer"
                >
                  Explore Timepieces
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Main Authentication Container */
        <div className="flex-1 flex items-center justify-center py-12 md:py-20 px-4 bg-transparent z-20 relative">
          <div className="w-full max-w-[440px] bg-white border border-neutral-200/80 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-6 sm:p-10 flex flex-col justify-center relative">
            
            {/* Top decorative dot for active page layout */}
            <div className="absolute top-6 right-6 flex gap-1.5">
              <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${isLogin ? 'bg-black' : 'bg-neutral-200'}`}></span>
              <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${!isLogin ? 'bg-black' : 'bg-neutral-200'}`}></span>
            </div>

            {success ? (
              <div className="text-center py-10 flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                  <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-black uppercase tracking-wider text-black mb-1">
                  Access Granted
                </h3>
                <p className="text-xs text-neutral-800 font-semibold tracking-wide">
                  Welcome to Watchez360. Syncing timepiece calibre...
                </p>
              </div>
            ) : (
              <>
                {/* Form Heading */}
                <div className="mb-6">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-900 block mb-1">
                    {isLogin ? "Exclusive Portal" : "Join the Club"}
                  </span>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-950">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h2>
                </div>

                {/* Validation Error Banner */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-[10px] font-bold text-red-700 uppercase tracking-wider">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name field (Sign Up Only) */}
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-neutral-900 ml-1">Full Name</label>
                      <div className="relative">
                        <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Arthur Pendragon"
                          className="w-full bg-white border border-neutral-300 rounded-xl pl-9.5 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-black text-black placeholder:text-neutral-400 transition-all duration-200"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-neutral-900 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="arthur@camelot.com"
                        className="w-full bg-white border border-neutral-300 rounded-xl pl-9.5 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-black text-black placeholder:text-neutral-400 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-neutral-900">Password</label>
                      {isLogin && (
                        <button
                          type="button"
                          onClick={() => alert("Password reset link has been dispatched to your email.")}
                          className="text-[9px] font-black uppercase tracking-widest text-neutral-905 hover:text-black transition-colors"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-white border border-neutral-300 rounded-xl pl-9.5 pr-10 py-2.5 text-xs font-semibold outline-none focus:border-black text-black placeholder:text-neutral-400 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-black transition-colors"
                      >
                        {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (Sign Up Only) */}
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-neutral-900 ml-1">Confirm Password</label>
                      <div className="relative">
                        <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-white border border-neutral-300 rounded-xl pl-9.5 pr-10 py-2.5 text-xs font-semibold outline-none focus:border-black text-black placeholder:text-neutral-400 transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-black transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Minimalist Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-black text-white hover:bg-neutral-950 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      <span>{isLogin ? "Login" : "Register"}</span>
                    )}
                  </button>
                </form>

                {/* Social Dividers */}
                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-neutral-200"></div>
                  <span className="flex-shrink mx-4 text-[9px] font-black uppercase tracking-widest text-neutral-800">or continue with</span>
                  <div className="flex-grow border-t border-neutral-200"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="flex justify-center w-full min-h-[44px]">
                  <div id="google-signin-btn" className="w-full flex justify-center"></div>
                </div>

                {/* Switch Login/Signup Footer */}
                <div className="text-xs text-neutral-800 text-center mt-6 font-semibold">
                  {isLogin ? "New to Watchez360?" : "Already possess an account?"}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError("");
                    }}
                    className="ml-2 text-black hover:underline font-black uppercase tracking-wider text-[10px]"
                  >
                    {isLogin ? "Register" : "Access Portal"}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}