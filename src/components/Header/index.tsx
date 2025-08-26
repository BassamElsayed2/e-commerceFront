"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import CustomSelect from "./CustomSelect";
import { menuData } from "./menuData";
import Dropdown from "./Dropdown";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import Image from "next/image";
import LanguageSwitcher from "@/components/Common/LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/apiCat";
import { FaShoppingCart } from "react-icons/fa";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { openCartModal } = useCartModalContext();
  const { user, signOut } = useAuth();
  const t = useTranslations("header");
  const commonT = useTranslations("common");

  const product = useAppSelector((state) => state.cartReducer.items);
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const locale = useLocale();

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleOpenCartModal = () => openCartModal();

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  // Sticky header effect
  useEffect(() => {
    const handleScroll = () => setStickyMenu(window.scrollY >= 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (userMenuOpen && !target.closest(".user-menu")) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  const options = React.useMemo(() => {
    if (!categories || categoriesLoading) {
      return [{ label: t("allCategories"), value: "0", id: "0" }];
    }
    return [
      { label: t("allCategories"), value: "0", id: "0" },
      ...categories.map((cat) => ({
        label: locale === "ar" ? cat.name_ar : cat.name_en,
        value: cat.id?.toString() || "",
        id: cat.id?.toString() || "",
      })),
    ];
  }, [categories, categoriesLoading, locale, t]);

  return (
    <header
  className={`fixed left-0 top-0 w-full z-40 transition-all duration-300 ${
    stickyMenu ? "bg-[#0C2756]/95 shadow-lg" : "bg-[#0C2756]"
  }`}
>

  
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C2756] via-[#0F355F] to-[#0C2756] animate-[gradientMove_8s_ease-in-out_infinite] z-0" />

      <div className="relative max-w-[1170px] mx-auto px-4 sm:px-7 xl:px-0 flex flex-col lg:flex-row items-center justify-between py-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex-shrink-0">
        <h3 className="relative inline-flex items-center gap-3 text-3xl font-extrabold group">
  <span className="text-4xl transform transition-transform duration-500 group-hover:scale-110">
    <FaShoppingCart
      style={{
        fill: "url(#gradient)",
      }}
    />
    <svg width="0" height="0">
      <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#239FBF" />
        <stop offset="50%" stopColor="#DFE0E2" />
        <stop offset="100%" stopColor="#239FBF" />
      </linearGradient>
    </svg>
  </span>

  <span className="bg-gradient-to-r from-[#239FBF] via-[#DFE0E2] to-[#239FBF] bg-clip-text text-transparent">
    The Cart
  </span>
</h3>

        </Link>

       {/* Search Bar */}
<div
  className={`flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 mt-4 lg:mt-0 w-full lg:max-w-xl border border-white/20 hover:border-[#239FBF] transition-all ${
    locale === "ar" ? "flex-row-reverse" : ""
  }`}
>
  {/* الفئات */}
  <CustomSelect options={options} isLoading={categoriesLoading} />

  {/* Input */}
  <input
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    type="search"
    placeholder={t("searchPlaceholder")}
    className="flex-1 bg-transparent outline-none text-white placeholder-white/70 px-3 text-sm"
  />

  {/* أيقونة البحث */}
  <button className="p-2 hover:bg-[#239FBF]/20 rounded-full transition flex-shrink-0">
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="#DFE0E2"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  </button>
</div>

        {/* Right Section */}
        <div className="flex items-center gap-6 mt-4 lg:mt-0">
          <LanguageSwitcher />
          {/* User Menu */}
          <div className="relative user-menu">
            {user ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-white hover:text-[#239FBF] transition"
              >
                <span>{user.user_metadata?.full_name || "User"}</span>
              </button>
            ) : (
              <Link href={`/${locale}/signin`} className="text-white hover:text-[#239FBF] transition">
                {t("signIn")}
              </Link>
            )}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg w-48 p-3">
                <Link href={`/${locale}/profile`} className="block py-2 text-[#0C2756] hover:text-[#239FBF]">
                  {commonT("profile")}
                </Link>
                <button onClick={handleSignOut} className="w-full text-left py-2 text-red-600 hover:bg-gray-100 rounded">
                  {commonT("logout")}
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            onClick={handleOpenCartModal}
            className="relative flex items-center gap-2 text-white hover:text-[#239FBF] transition"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-13L4 2H1" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-[#239FBF] text-[#0C2756] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {product.length}
            </span>
            <span>${totalPrice}</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-3 border-t border-white/20">
        <ul className="flex justify-center gap-6 py-3 text-white">
          {menuData.map((item, i) => (
            <li key={i} className="relative group">
              <Link
                href={`/${locale}/${item.path}`}
                className="hover:text-[#239FBF] transition after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#239FBF] after:transition-all group-hover:after:w-full"
              >
                {locale === "ar" ? item.title_ar : item.title_en}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;

