"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send a magic link or authenticate
    // For now, just redirect to home
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* ─── Left: Illustration / Branding ─── */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#3d2b1f] to-[#1a120b] items-center justify-center p-16 relative">
        <div className="absolute inset-0 bg-[url('/banner.jpeg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center max-w-md">
          <h2 className="text-white text-4xl font-header mb-6">Welcome to Mariéa</h2>
          <p className="text-[#c4b5a0] font-body text-lg leading-relaxed">
            Naturally rooted beauty starts here. Sign in to access your orders, save your favorites, and experience hair care perfected by nature and science.
          </p>
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-[#c4a35a]" />
            <span className="text-[#c4a35a] text-xs uppercase tracking-[0.3em] font-semibold">Premium Hair Care</span>
            <div className="w-12 h-px bg-[#c4a35a]" />
          </div>
        </div>
      </div>

      {/* ─── Right: Form ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="mb-10">
            <h1 className="text-2xl font-header font-bold text-[#1a120b]">Mariéa Hair Co.</h1>
          </div>

          {/* Tabs */}
          <div className="flex items-center border-b border-[#e8dfd3] mb-8">
            <button
              onClick={() => setMode("login")}
              className={`pb-3 px-1 text-sm font-body font-semibold transition-colors relative ${
                mode === "login"
                  ? "text-[#533a00] border-b-2 border-[#533a00]"
                  : "text-[#8a7a6a] hover:text-[#533a00]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`pb-3 px-1 ml-8 text-sm font-body font-semibold transition-colors relative ${
                mode === "signup"
                  ? "text-[#533a00] border-b-2 border-[#533a00]"
                  : "text-[#8a7a6a] hover:text-[#533a00]"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4b5a0]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full border border-[#e8dfd3] pl-10 pr-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4b5a0]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Create a password" : "Enter your password"}
                  required
                  className="w-full border border-[#e8dfd3] pl-10 pr-10 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4b5a0] hover:text-[#6a5a4a] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[#e8dfd3]" />
            <span className="text-xs font-body text-[#8a7a6a] uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 h-px bg-[#e8dfd3]" />
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 border border-[#e8dfd3] py-3 px-4 hover:bg-[#faf7f2] transition-colors group">
              <svg className="w-5 h-5 text-[#6a5a4a]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-body text-[#1a120b] group-hover:text-[#533a00]">
                Continue with Google
              </span>
            </button>
            <button className="w-full flex items-center justify-center gap-3 border border-[#e8dfd3] py-3 px-4 hover:bg-[#faf7f2] transition-colors group">
              <svg className="w-5 h-5 text-[#6a5a4a]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="text-sm font-body text-[#1a120b] group-hover:text-[#533a00]">
                Continue with Apple
              </span>
            </button>
          </div>

          {/* Toggle mode */}
          <p className="mt-8 text-center text-sm font-body text-[#6a5a4a]">
            {mode === "login" ? (
              <>
                Don&rsquo;t have an account?{" "}
                <button onClick={() => setMode("signup")} className="text-[#533a00] font-semibold hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-[#533a00] font-semibold hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}