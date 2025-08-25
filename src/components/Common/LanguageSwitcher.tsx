"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "@/app/i18n/navigation"; // صحيح
import { useSearchParams } from "next/navigation"; // صح
import { useLocale } from "next-intl";
import { routing } from "@/app/i18n/routing";

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const rootRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or pressing Esc
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const getLanguageLabel = (loc: string) => (loc === "ar" ? "العربية" : "English");

  const handleSelect = (loc: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const query = params.toString();
    const newPath = query ? `${pathname}?${query}` : pathname;
    router.replace(newPath, { locale: loc });
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className="relative custom-select min-w-[120px] shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="h-11 px-3 bg-transparent text-[#DFE0E2] outline-none inline-flex items-center justify-between gap-2 w-full cursor-pointer"
      >
        <span>{getLanguageLabel(locale)}</span>
        <svg
          className={`transition ${isOpen ? "rotate-180" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <ul
        role="listbox"
        className={`${
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
        } absolute ${locale === "ar" ? "right-0" : "left-0"} top-full z-[9999] mt-1 w-[min(200px,90vw)] max-h-64 overflow-auto
           rounded-xl bg-[#0f2f66] ring-1 ring-white/15 shadow-2xl outline-none transition`}
      >
        {routing.locales.map((loc, idx) => {
          const active = locale === loc;
          const focused = idx === focusIndex;
          return (
            <li
              key={loc}
              role="option"
              aria-selected={active}
              onMouseEnter={() => setFocusIndex(idx)}
              onClick={() => handleSelect(loc)}
              className={`px-3 py-2 text-sm cursor-pointer text-[#DFE0E2]
                ${active ? "bg-[#239FBF]/25" : ""} ${focused ? "bg-white/10" : ""} hover:bg-white/10`}
            >
              {getLanguageLabel(loc)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
