"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

type Option = { label: string; value: string; id?: string };

const CustomSelect = ({
  options = [],
  isLoading = false,
}: {
  options: Option[];
  isLoading?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(options[0] ?? null);
  const [focusIndex, setFocusIndex] = useState(0);
  const router = useRouter();
  const locale = useLocale();
  const rootRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // تحديث selected عند تغير الخيارات
  useEffect(() => {
    if (options.length > 0) {
      setSelected(options[0]);
      setFocusIndex(0);
    }
  }, [options]);

  // إدارة فتح/إغلاق القايمة وحساب موقعها
  useEffect(() => {
    if (!isOpen) return;

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

    if (rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      const dropdownHeight = 256; // تقريبًا max-h-64
      let top = rect.bottom;
      if (rect.bottom + dropdownHeight > window.innerHeight) {
        top = Math.max(10, rect.top - dropdownHeight);
      }
      setDropdownPosition({
        top: top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]); // ثابت

  const list = options.slice(1);

  const onSelect = (opt: Option) => {
    setSelected(opt);
    setIsOpen(false);
    if (opt.value !== "0") {
      router.push(`/${locale}/shop-without-sidebar?category=${opt.value}`);
    } else {
      router.push(`/${locale}/shop-without-sidebar`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setIsOpen(true);
      return;
    }
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusIndex((i) => Math.min(i + 1, list.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (list[focusIndex]) onSelect(list[focusIndex]);
    }
  };

  return (
    <div ref={rootRef} className="relative custom-select min-w-[160px] shrink-0">
      <button
        type="button"
        disabled={isLoading}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`h-11 px-3 bg-transparent text-[#DFE0E2] placeholder-[#DFE0E2]/70 outline-none inline-flex items-center justify-between gap-2 w-full ring-0 ${
          isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <span className="truncate">
          {isLoading ? (locale === "ar" ? "جاري التحميل..." : "Loading...") : selected?.label}
        </span>
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

      {isOpen &&
        createPortal(
          <ul
            role="listbox"
            style={{ top: dropdownPosition.top, left: dropdownPosition.left, width: dropdownPosition.width }}
            className={`absolute z-[9999] max-h-64 overflow-auto rounded-xl bg-[#0f2f66] ring-1 ring-white/15 shadow-2xl outline-none transition custom-scrollbar`}
          >
            {list.length === 0 && (
              <li className="px-3 py-2 text-sm text-[#DFE0E2]/70 select-none">
                {locale === "ar" ? "لا توجد فئات" : "No categories"}
              </li>
            )}
            {list.map((opt, idx) => {
              const active = selected?.value === opt.value;
              const focused = idx === focusIndex;
              return (
                <li
                  key={opt.id ?? opt.value ?? idx}
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setFocusIndex(idx)}
                  onClick={() => onSelect(opt)}
                  className={`px-3 py-2 text-sm cursor-pointer text-[#DFE0E2]
                  ${active ? "bg-[#239FBF]/25" : ""} ${focused ? "bg-white/10" : ""} hover:bg-white/10`}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>,
          document.body
        )}
    </div>
  );
};

export default CustomSelect;
