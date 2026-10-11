"use client";

import { useState } from "react";
import Logo from "./Logo";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/lib/i18n";
import { useCart } from "@/lib/cart";

interface NavLink {
  key: string;
  href: string;
}

const LINKS: NavLink[] = [
  { key: "home", href: "#home" },
  { key: "products", href: "#products" },
  { key: "faq", href: "#faq" },
  { key: "support", href: "#support" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const { count } = useCart();

  const openCart = () => {
    window.dispatchEvent(new CustomEvent("ath:open-cart"));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 animate-[rise_.6s_ease-out]">
      <nav className="max-w-6xl mx-auto mt-4 rounded-2xl glass px-4 py-2 flex items-center justify-between">
        <a href="#home" aria-label="AI Tools HuB home">
          <Logo size={36} />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-200">
          {LINKS.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                className="hover:text-cyan-300 transition-colors"
              >
                {t(`nav.${link.key}`)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LanguageToggle />

          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="relative p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path d="M6 7h15l-1.5 9h-12z" />
              <path d="M6 7L5 3H2" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="17" cy="20" r="1.5" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-cyan-400 text-navy text-xs font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-6 h-6"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden max-w-6xl mx-auto mt-2 px-4">
          <ul className="glass p-2 space-y-1 text-sm font-medium text-slate-200">
            {LINKS.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 rounded-xl hover:bg-white/10 hover:text-cyan-300 transition-colors"
                >
                  {t(`nav.${link.key}`)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
