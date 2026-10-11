"use client";

import { useState } from "react";
import Logo from "./Logo";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/lib/i18n";
import { useCart } from "@/lib/cart";

const LINKS = [
  { key: "nav.catalog", href: "#products" },
  { key: "nav.howToOrder", href: "#checkout" },
  { key: "nav.warranty", href: "#faq" },
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
      <nav className="glass mx-auto mt-4 flex max-w-6xl items-center justify-between gap-2 rounded-3xl px-4 py-2.5">
        {/* Logo + links */}
        <div className="flex items-center gap-6">
          <a href="#home" aria-label="AI Tools HuB home" className="shrink-0">
            <img
              src="/logo.png"
              alt="AI Tools HuB logo"
              className="h-10 w-10 rounded-full object-cover"
            />
          </a>
          <ul className="hidden items-center gap-6 text-sm font-semibold text-slate-200 md:flex">
            {LINKS.map((link) => (
              <li key={link.key}>
                <a href={link.href} className="transition-colors hover:text-blue-300">
                  {t(link.key)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>
          <a
            href="#support"
            className="glass hidden rounded-full px-4 py-2 text-sm font-bold text-slate-100 transition hover:border-blue-400/40 hover:text-white md:inline-block"
          >
            {t("nav.support")}
          </a>
          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
          >
            {t("nav.cart")}
            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white px-1 text-xs font-extrabold text-slate-900">
              {count}
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="rounded-xl p-2 transition-colors hover:bg-white/10 md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-6 w-6"
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
        <div className="mx-auto mt-2 max-w-6xl px-4 md:hidden">
          <ul className="glass space-y-1 p-2 text-sm font-semibold text-slate-200">
            {LINKS.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-2.5 transition-colors hover:bg-white/10 hover:text-blue-300"
                >
                  {t(link.key)}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#support"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-2.5 transition-colors hover:bg-white/10 hover:text-blue-300"
              >
                {t("nav.support")}
              </a>
            </li>
            <li className="px-4 py-2">
              <LanguageToggle />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
