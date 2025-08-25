"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import Breadcrumb from "../Common/Breadcrumb";

import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import CustomSelect from "../ShopWithSidebar/CustomSelect";

import shopData from "../Shop/shopData";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  getLimitedTimeOfferProducts,
} from "@/services/apiProducts";
import { getCategories } from "@/services/apiCat";
import { useSearchParams } from "next/navigation";

/**
 * ShopWithoutSidebar - محسّن ومطابق للثيم
 * - Theme colors: #0C2756 (navy), #239FBF (light blue), #DFE0E2 (text/white)
 * - Animations: filter panel slide, product fade-in, grid/list toggle animation
 * - Accessibility: aria labels, focus-visible styles
 */

const THEME = {
  navy: "#0C2756",
  blue: "#239FBF",
  text: "#DFE0E2",
};

const ShopWithoutSidebar: React.FC = () => {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [productStyle, setProductStyle] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("latest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Get category and filter from URL params
  const categoryFromUrl = searchParams.get("category");
  const filterFromUrl = searchParams.get("filter");

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const {
    data: limitedTimeProducts,
    isLoading: limitedTimeLoading,
    error: limitedTimeError,
  } = useQuery({
    queryKey: ["limitedTimeOfferProducts"],
    queryFn: getLimitedTimeOfferProducts,
  });

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Options + items per page
  const options = useMemo(
    () => [
      {
        label: locale === "ar" ? "أحدث المنتجات" : "Latest Products",
        value: "latest",
      },
      {
        label: locale === "ar" ? "الأقدم" : "Oldest Products",
        value: "oldest",
      },
      {
        label: locale === "ar" ? "الأكثر مبيعاً" : "Best Selling",
        value: "best-selling",
      },
      {
        label:
          locale === "ar" ? "السعر: من الأقل إلى الأعلى" : "Price: Low to High",
        value: "price-low",
      },
      {
        label:
          locale === "ar" ? "السعر: من الأعلى إلى الأقل" : "Price: High to Low",
        value: "price-high",
      },
    ],
    [locale]
  );

  const itemsPerPageOptions = useMemo(
    () => [
      { label: "12", value: 12 },
      { label: "24", value: 24 },
      { label: "36", value: 36 },
      { label: "48", value: 48 },
    ],
    []
  );

  // Calculate actual price range from products
  const priceRangeFromData = useMemo(() => {
    if (!products || products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map((p: any) => p.offer_price || p.price || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min: Math.floor(min), max: Math.ceil(max) };
  }, [products]);

  // init priceRange when products load
  useEffect(() => {
    if (
      priceRangeFromData.min !== 0 ||
      priceRangeFromData.max !== 1000 ||
      (priceRange.min === 0 && priceRange.max === 1000)
    ) {
      setPriceRange(priceRangeFromData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRangeFromData.min, priceRangeFromData.max]);

  // set category from URL on mount
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  // Filter + sort logic (memoized)
  const filteredAndSortedProducts = useMemo(() => {
    const productsToFilter =
      filterFromUrl === "limited-offers" && limitedTimeProducts
        ? limitedTimeProducts
        : products;

    if (!productsToFilter) return [];

    // Filter by price & category
    let filtered = productsToFilter.filter((product: any) => {
      const price = product.offer_price || product.price || 0;
      if (price < priceRange.min || price > priceRange.max) return false;

      if (selectedCategories.length > 0) {
        const pid = product.category_id?.toString?.() || "";
        if (!selectedCategories.includes(pid)) return false;
      }

      return true;
    });

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a: any, b: any) => (a.offer_price || a.price) - (b.offer_price || b.price)
        );
        break;
      case "price-high":
        filtered.sort(
          (a: any, b: any) => (b.offer_price || b.price) - (a.offer_price || a.price)
        );
        break;
      case "best-selling":
        filtered.sort((a: any, b: any) =>
          (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0)
        );
        break;
      case "oldest":
        filtered.sort((a: any, b: any) => a.id - b.id);
        break;
      default:
        filtered.sort((a: any, b: any) => b.id - a.id);
        break;
    }

    return filtered;
  }, [products, limitedTimeProducts, filterFromUrl, priceRange, selectedCategories, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, selectedCategories, sortBy, itemsPerPage, filterFromUrl]);

  // Category counts (memoized)
  const categoryCounts = useMemo(() => {
    if (!products || !categories) return [];
    return categories
      .map((category: any) => {
        const count = products.filter(
          (product: any) => product.category_id?.toString() === category.id?.toString()
        ).length;
        return {
          id: category.id?.toString() || "",
          name: locale === "ar" ? category.name_ar : category.name_en,
          count,
        };
      })
      .filter((c: any) => c.count > 0);
  }, [products, categories, locale]);

  // selected category name for title
  const selectedCategoryName = useMemo(() => {
    if (!categoryFromUrl || !categories) return null;
    const cat = categories.find((c: any) => c.id?.toString() === categoryFromUrl);
    if (!cat) return null;
    return locale === "ar" ? cat.name_ar : cat.name_en;
  }, [categoryFromUrl, categories, locale]);

  // callbacks
  const handleCategoryToggle = useCallback((categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setPriceRange(priceRangeFromData);
    setSelectedCategories([]);
    setSortBy("latest");
    setCurrentPage(1);
  }, [priceRangeFromData]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const getPageNumbers = useCallback(() => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    if (end - start < maxVisiblePages - 1) start = Math.max(1, end - maxVisiblePages + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [totalPages, currentPage]);

  // small util for aria label text
  const getShowingText = () => {
    const from = filteredAndSortedProducts.length === 0 ? 0 : startIndex + 1;
    const to = Math.min(endIndex, filteredAndSortedProducts.length);
    return locale === "ar"
      ? `عرض ${from}-${to} من ${filteredAndSortedProducts.length} منتجات`
      : `Showing ${from}-${to} of ${filteredAndSortedProducts.length} products`;
  };

  return (
    <>
      <Breadcrumb
        title={
          filterFromUrl === "limited-offers"
            ? locale === "ar"
              ? "العروض المحدودة"
              : "Limited Time Offers"
            : selectedCategoryName
            ? locale === "ar"
              ? `المنتجات - ${selectedCategoryName}`
              : `Products - ${selectedCategoryName}`
            : locale === "ar"
            ? "المنتجات"
            : "Explore All Products"
        }
        pages={[
          locale === "ar" ? "المتجر" : "Shop",
          "/",
          filterFromUrl === "limited-offers"
            ? locale === "ar"
              ? "العروض المحدودة"
              : "Limited Offers"
            : selectedCategoryName
            ? selectedCategoryName
            : locale === "ar"
            ? "المنتجات"
            : "Products",
        ]}
        
      />

      <section className="relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            <div className="w-full">
              {/* ===== Category or filter messages ===== */}
              {selectedCategoryName && (
                <div className="mb-4 p-4 bg-[#eef9ff] border border-[#d7f2fb] rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#0C2756]" viewBox="0 0 24 24" fill="none">
                        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      <span className="text-[#0C2756] font-medium">
                        {locale === "ar"
                          ? `عرض المنتجات في فئة: ${selectedCategoryName}`
                          : `Showing products in category: ${selectedCategoryName}`}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategories([]);
                        // update URL (shallow)
                        try {
                          const base = `/${locale}/shop-without-sidebar`;
                          window.history.pushState({}, "", base);
                        } catch {}
                      }}
                      className="text-[#239FBF] hover:underline text-sm font-medium"
                    >
                      {locale === "ar" ? "إزالة التصفية" : "Clear Filter"}
                    </button>
                  </div>
                </div>
              )}

              {filterFromUrl === "limited-offers" && (
                <div className="mb-4 p-4 bg-[#fff4f4] border border-[#ffd7d7] rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#c53030]" viewBox="0 0 24 24" fill="none">
                        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[#7a1b1b] font-medium">
                        {locale === "ar" ? "عرض المنتجات ذات العروض المحدودة" : "Showing limited time offer products"}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        try {
                          const base = `/${locale}/shop-without-sidebar`;
                          window.history.pushState({}, "", base);
                        } catch {}
                      }}
                      className="text-[#c53030] hover:underline text-sm font-medium"
                    >
                      {locale === "ar" ? "إزالة التصفية" : "Clear Filter"}
                    </button>
                  </div>
                </div>
              )}

              {/* Toggle filters */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters((s) => !s)}
                    aria-expanded={showFilters}
                    aria-controls="filters-panel"
                    className="flex items-center gap-2 bg-white text-[#0C2756] px-4 py-2 rounded-lg shadow-sm border border-[#e6eef5] hover:shadow-md transition"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="text-sm font-medium">{locale === "ar" ? "المرشحات" : "Filters"}</span>
                    <span className="ml-2 text-sm text-[#239FBF]">
                      {selectedCategories.length > 0 || priceRange.min > priceRangeFromData.min || priceRange.max < priceRangeFromData.max ? "●" : ""}
                    </span>
                  </button>
                </div>

                {/* top-right controls */}
                <div className="flex items-center gap-3">
                  {/* items per page */}
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="hidden sm:inline">{locale === "ar" ? "عرض" : "Show"}</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      aria-label={locale === "ar" ? "عدد العناصر بالصفحة" : "Items per page"}
                    >
                      {itemsPerPageOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="flex items-center gap-2">
                    {/* Grid button */}
                    <button
                      onClick={() => setProductStyle("grid")}
                      aria-pressed={productStyle === "grid"}
                      aria-label="Grid View"
                      className={`flex items-center justify-center w-10 h-9 rounded-[6px] border px-2 transition ${productStyle === "grid" ? "bg-[#0C2756] text-[#DFE0E2] border-[#239FBF]" : "bg-white text-[#0C2756] border border-[#e6eef5]"}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="7" height="7" rx="1" fill="currentColor" />
                        <rect x="10" y="1" width="7" height="7" rx="1" fill="currentColor" />
                        <rect x="1" y="10" width="7" height="7" rx="1" fill="currentColor" />
                        <rect x="10" y="10" width="7" height="7" rx="1" fill="currentColor" />
                      </svg>
                    </button>

                    {/* List button */}
                    <button
                      onClick={() => setProductStyle("list")}
                      aria-pressed={productStyle === "list"}
                      aria-label="List View"
                      className={`flex items-center justify-center w-10 h-9 rounded-[6px] border px-2 transition ${productStyle === "list" ? "bg-[#0C2756] text-[#DFE0E2] border-[#239FBF]" : "bg-white text-[#0C2756] border border-[#e6eef5]"}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="2" width="14" height="2" rx="1" fill="currentColor" />
                        <rect x="1" y="8" width="14" height="2" rx="1" fill="currentColor" />
                        <rect x="1" y="14" width="14" height="2" rx="1" fill="currentColor" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* ===== Filters panel (slide down/up) ===== */}
              <div
                id="filters-panel"
                aria-hidden={!showFilters}
                className={`transform transition-all duration-300 origin-top ${showFilters ? "max-h-[900px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"} overflow-hidden`}
              >
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#0C2756]">{locale === "ar" ? "المرشحات" : "Filters"}</h3>
                    <div className="flex items-center gap-3">
                      <button onClick={clearAllFilters} className="text-[#239FBF] hover:underline">{locale === "ar" ? "مسح الكل" : "Clear All"}</button>
                      <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">{locale === "ar" ? "إغلاق" : "Close"}</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Price Inputs */}
                    <div>
                      <h4 className="font-medium text-[#0C2756] mb-2">{locale === "ar" ? "نطاق السعر" : "Price Range"}</h4>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={priceRange.min}
                          min={priceRangeFromData.min}
                          max={priceRangeFromData.max}
                          onChange={(e) => setPriceRange((p) => ({ ...p, min: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border rounded text-sm"
                          aria-label={locale === "ar" ? "سعر من" : "Price min"}
                        />
                        <input
                          type="number"
                          value={priceRange.max}
                          min={priceRangeFromData.min}
                          max={priceRangeFromData.max}
                          onChange={(e) => setPriceRange((p) => ({ ...p, max: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border rounded text-sm"
                          aria-label={locale === "ar" ? "سعر إلى" : "Price max"}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {locale === "ar" ? "النطاق:" : "Range:"} ${priceRangeFromData.min} - ${priceRangeFromData.max}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <h4 className="font-medium text-[#0C2756] mb-2">{locale === "ar" ? "الفئات" : "Categories"}</h4>
                      <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                        {categoriesLoading ? (
                          <div className="text-sm text-gray-500">{locale === "ar" ? "جاري التحميل..." : "Loading..."}</div>
                        ) : categoryCounts.length > 0 ? (
                          categoryCounts.map((cat: any) => (
                            <label key={cat.id} className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat.id)}
                                onChange={() => handleCategoryToggle(cat.id)}
                                className="h-4 w-4 rounded border-gray-300 text-[#239FBF] focus:ring-[#239FBF]"
                                aria-label={`${cat.name} (${cat.count})`}
                              />
                              <span className="text-sm text-[#0C2756]">{cat.name} <span className="text-gray-500">({cat.count})</span></span>
                            </label>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500">{locale === "ar" ? "لا توجد فئات" : "No categories"}</div>
                        )}
                      </div>
                    </div>

                    {/* Sort */}
                    <div>
                      <h4 className="font-medium text-[#0C2756] mb-2">{locale === "ar" ? "ترتيب حسب" : "Sort By"}</h4>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-sm"
                        aria-label={locale === "ar" ? "ترتيب" : "Sort by"}
                      >
                        {options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Top bar with counts & controls (compact) ===== */}
              <div className="rounded-lg bg-white shadow pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-sm text-gray-600">{getShowingText()}</div>
                    {products && products.length !== filteredAndSortedProducts.length && (
                      <div className="text-sm text-gray-500">{locale === "ar" ? "من أصل" : "of"} {products.length}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* repeat product style buttons for convenience on top */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setProductStyle("grid")}
                        aria-label="Grid View small"
                        className={`px-2 py-1 rounded text-sm transition ${productStyle === "grid" ? "bg-[#0C2756] text-white" : "bg-white text-[#0C2756] border border-[#e6eef5]"}`}
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => setProductStyle("list")}
                        aria-label="List View small"
                        className={`px-2 py-1 rounded text-sm transition ${productStyle === "list" ? "bg-[#0C2756] text-white" : "bg-white text-[#0C2756] border border-[#e6eef5]"}`}
                      >
                        List
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Products area (grid or list) ===== */}
              <div
                className={`transition-all duration-300 ${productStyle === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7.5 gap-y-9" : "flex flex-col gap-7.5"}`}
              >
                {productsLoading ? (
                  <div className="col-span-full text-center py-10">
                    <div className="text-gray-500">{locale === "ar" ? "جاري تحميل المنتجات..." : "Loading products..."}</div>
                  </div>
                ) : filteredAndSortedProducts.length === 0 ? (
                  <div className="col-span-full text-center py-10">
                    <div className="text-gray-500">
                      {selectedCategoryName
                        ? locale === "ar"
                          ? `لا توجد منتجات في فئة "${selectedCategoryName}"`
                          : `No products found in category "${selectedCategoryName}"`
                        : locale === "ar"
                        ? "لا توجد منتجات تطابق الفلاتر المحددة"
                        : "No products match the selected filters"}
                    </div>
                  </div>
                ) : (
                  currentProducts.map((item: any, key: number) =>
                    productStyle === "grid" ? (
                      <div key={item.id || key} className="animate-productFade">
                        <SingleGridItem item={item} />
                      </div>
                    ) : (
                      <div key={item.id || key} className="animate-productFade">
                        <SingleListItem item={item} />
                      </div>
                    )
                  )
                )}
              </div>

              {/* ===== Pagination ===== */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="bg-white shadow rounded-md p-2">
                    <ul className="flex items-center">
                      <li>
                        <button
                          aria-label="Previous page"
                          type="button"
                          disabled={currentPage === 1}
                          onClick={goToPreviousPage}
                          className="flex items-center justify-center w-8 h-9 rounded-[3px] transition disabled:opacity-40 hover:bg-[#0C2756] hover:text-white"
                        >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.1782 16.1156C12.0095 16.1156 11.8407 16.0594 11.7282 15.9187L5.37197 9.45C5.11885 9.19687 5.11885 8.80312 5.37197 8.55L11.7282 2.08125C11.9813 1.82812 12.3751 1.82812 12.6282 2.08125C12.8813 2.33437 12.8813 2.72812 12.6282 2.98125L6.72197 9L12.6563 15.0187C12.9095 15.2719 12.9095 15.6656 12.6563 15.9187C12.4876 16.0312 12.347 16.1156 12.1782 16.1156Z" fill="currentColor" />
                          </svg>
                        </button>
                      </li>

                      {getPageNumbers().map((page) => (
                        <li key={page}>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(page);
                            }}
                            className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${currentPage === page ? "bg-[#0C2756] text-white" : "hover:text-white hover:bg-[#239FBF]"}`}
                            aria-label={`Page ${page}`}
                          >
                            {page}
                          </a>
                        </li>
                      ))}

                      <li>
                        <button
                          aria-label="Next page"
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={goToNextPage}
                          className="flex items-center justify-center w-8 h-9 rounded-[3px] transition disabled:opacity-40 hover:bg-[#0C2756] hover:text-white"
                        >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.82197 16.1156C5.65322 16.1156 5.5126 16.0594 5.37197 15.9469C5.11885 15.6937 5.11885 15.3 5.37197 15.0469L11.2782 9L5.37197 2.98125C5.11885 2.72812 5.11885 2.33437 5.37197 2.08125C5.6251 1.82812 6.01885 1.82812 6.27197 2.08125L12.6282 8.55C12.8813 8.80312 12.8813 9.19687 12.6282 9.45L6.27197 15.9187C6.15947 16.0312 5.99072 16.1156 5.82197 16.1156Z" fill="currentColor" />
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Component scoped styles for animations */}
      <style jsx>{`
        /* product fade-in */
        @keyframes productFade {
          0% { opacity: 0; transform: translateY(6px); }
          60% { opacity: 0.7; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-productFade {
          animation: productFade 420ms ease both;
        }

        /* small helpers for rtl underline (kept minimal) */
        :global(html[dir="rtl"]) a { direction: rtl; }

        /* transitions for slide/opacity on filter panel are handled with tailwind classes above */
      `}</style>
    </>
  );
};

export default ShopWithoutSidebar;
