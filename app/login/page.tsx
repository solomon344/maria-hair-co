"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/profile");
    }
  }, [session, router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "signup") {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone: phone || undefined }),
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.error || "Something went wrong.");
          setLoading(false);
          return;
        }

        setMessage("Account created! Sending magic link...");
        const result = await signIn("nodemailer", {
          email,
          name,
          redirect: false,
        });

        if (result?.ok) {
          setMessage("Account created. Check your email for a magic link.");
        } else {
          setMessage("Account created, but could not send magic link.");
        }
      } catch {
        setMessage("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const result = await signIn("nodemailer", {
        email,
        redirect: false,
      });

      if (result?.ok) {
        setMessage("Check your email for a magic link to continue.");
      } else if (result?.error) {
        setMessage("Something went wrong. Please try again.");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left branding */}
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

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-2xl font-header font-bold text-[#1a120b]">Mariéa Hair Co.</h1>
          </div>

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

          {message && (
            <div className="mb-4 p-3 text-sm bg-[#faf7f2] border border-[#e8dfd3] text-[#533a00]">
              {message}
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="space-y-5">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full border border-[#e8dfd3] px-4 py-3 font-body text-sm text-[#1a120b] focus:outline-none focus:border-[#533a00] transition-colors placeholder:text-[#c4b5a0]"
                />
              </div>
            )}

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-body text-[#6a5a4a] mb-1.5">Phone Number (optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 000 0000"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#533a00] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3d2b1f] transition-colors disabled:opacity-70"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Send Magic Link"
                  : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[#e8dfd3]" />
            <span className="text-xs font-body text-[#8a7a6a] uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 h-px bg-[#e8dfd3]" />
          </div>

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