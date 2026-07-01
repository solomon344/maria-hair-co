"use client";

import { useState } from "react";
import { Button, Kbd, Link, TextField, InputGroup } from "@heroui/react";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { Logo } from "./logo";
import { ShoppingBag, UserIcon, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useSession, signOut } from "next-auth/react";


export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname()
  const { openCart, itemCount } = useCart();
  const { data: session } = useSession();

  const routed = [
    {
      name:"Shop All",
      href:"/shop"
    },
    {
      name:"New Arrivals",
      href:"/arrivals"
    },
    {
      name:"Hair Care",
      href:"/haircare"
    },
    {
      name:"Our Story",
      href:"/ourstory"
    }
  ]

  // Landing page has a dark hero behind the navbar, other pages have light backgrounds
  const isLanding = pathname === "/";

  const closeMobileMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className={clsx(
        "w-full px-6 md:px-8 py-4 flex items-center justify-between z-50",
        isLanding ? "absolute top-0" : "relative bg-white border-b border-[#e8dfd3]"
      )}>
        {/* Mobile: Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={clsx(
            "md:hidden p-1 transition-opacity hover:opacity-70",
            isLanding ? "text-white" : "text-[#1a120b]"
          )}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:block">
          <ul className="flex items-center gap-6">
            {routed.map((item) => (
              <li key={item.name} className={clsx(
                "underline-offset-8 hover:underline",
                isLanding
                  ? "hover:text-accent-hover text-white font-semibold hover:decoration-accent-hover"
                  : "hover:text-[#533a00] text-[#6a5a4a] font-semibold hover:decoration-[#533a00]",
                pathname == item.href
                  ? isLanding ? "underline decoration-accent-hover" : "underline decoration-[#533a00] text-[#533a00]"
                  : ""
              )}>
                <NextLink className="font-light " href={item.href}>
                  {item.name.toUpperCase()}
                </NextLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Icons */}
        <div className={clsx(
          "flex items-center gap-3 md:gap-4",
          isLanding ? "text-white" : "text-[#1a120b]"
        )}>
          {session ? (
            <>
              <NextLink href="/profile" className="hover:opacity-70 transition-opacity inline-flex">
                <UserIcon className="w-5 h-5" />
              </NextLink>
              <button
                onClick={() => signOut()}
                className="text-xs font-body font-semibold hover:opacity-70 transition-opacity"
              >
                Sign Out
              </button>
            </>
          ) : (
            <NextLink href="/login" className="hover:opacity-70 transition-opacity inline-flex">
              <UserIcon className="w-5 h-5" />
            </NextLink>
          )}
          <button onClick={openCart} className="relative p-1 hover:opacity-70 transition-opacity">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c4a35a] text-[#1a120b] text-[10px] font-bold flex items-center justify-center rounded-full">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
        </div>

      </nav>

      {/* ─── Mobile Drawer ─── */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeMobileMenu}
          />

          {/* Drawer */}
          <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-2xl animate-slide-in">
            <div className="p-6 border-b border-[#e8dfd3] flex items-center justify-between">
              <h2 className="font-header font-bold text-[#1a120b]">Menu</h2>
              <button
                onClick={closeMobileMenu}
                className="p-1 text-[#6a5a4a] hover:text-[#1a120b] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ul className="p-4 space-y-1">
              {routed.map((item) => (
                <li key={item.name}>
                  <NextLink
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={clsx(
                      "block px-4 py-3 font-body text-sm transition-colors",
                      pathname === item.href
                        ? "bg-[#faf7f2] text-[#533a00] font-semibold border-l-2 border-[#533a00]"
                        : "text-[#6a5a4a] hover:text-[#533a00] hover:bg-[#faf7f2]"
                    )}
                  >
                    {item.name}
                  </NextLink>
                </li>
              ))}
            </ul>

            {/* Mobile Account links */}
            <div className="p-4 border-t border-[#e8dfd3] mt-4">
              <p className="px-4 text-xs uppercase tracking-wider text-[#8a7a6a] font-body font-semibold mb-3">Account</p>
              {session ? (
                <>
                  <NextLink
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-sm font-body text-[#6a5a4a] hover:text-[#533a00] hover:bg-[#faf7f2] transition-colors"
                  >
                    My Account
                  </NextLink>
                  <button
                    onClick={() => { signOut(); closeMobileMenu(); }}
                    className="block w-full text-left px-4 py-3 text-sm font-body text-[#6a5a4a] hover:text-[#533a00] hover:bg-[#faf7f2] transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <NextLink
                  href="/login"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-sm font-body text-[#6a5a4a] hover:text-[#533a00] hover:bg-[#faf7f2] transition-colors"
                >
                  Sign In / Register
                </NextLink>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Slide-in animation */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.25s ease-out;
        }
      `}</style>
    </>
  );
};