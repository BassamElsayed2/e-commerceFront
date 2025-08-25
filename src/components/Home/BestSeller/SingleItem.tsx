"use client";
import React, { useState } from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import Image from "next/image";
import { Link } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";

const SingleItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const locale = useLocale();
  const [showCartSuccess, setShowCartSuccess] = useState(false);

  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: item.id,
      title: locale === "ar" ? item.name_ar : item.name_en,
      price: item.price,
      discountedPrice: item.offer_price || item.price,
      quantity: 1,
      imgs: {
        thumbnails:
          item.imgs?.thumbnails ||
          (Array.isArray(item.image_url) ? item.image_url : [item.image_url]),
        previews:
          item.imgs?.previews ||
          (Array.isArray(item.image_url) ? item.image_url : [item.image_url]),
      },
    };

    dispatch(addItemToCart(cartItem));
    setShowCartSuccess(true);
    setTimeout(() => setShowCartSuccess(false), 2000);
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Success Message */}
      {showCartSuccess && (
        <div className="absolute top-3 right-3 z-10 bg-[#0C2756] text-[#DFE0E2] px-3 py-1 rounded-md text-sm animate-fade-in">
          {locale === "ar" ? "تمت الإضافة" : "Added to cart!"}
        </div>
      )}

      {/* صورة المنتج */}
      <div className="relative w-full h-[280px] flex items-center justify-center bg-[#DFE0E2]/40">
  <Image
    src={
      item.imgs?.thumbnails?.[0] ||
      (Array.isArray(item.image_url)
        ? item.image_url[0]
        : item.image_url) ||
      "/images/products/product-1-bg-1.png"
    }
    alt={locale === "ar" ? item.name_ar : item.name_en}
    width={250}
    height={250}
    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
    onError={(e) => {
      e.currentTarget.src = "/images/products/product-1-bg-1.png";
    }}
  />
</div>

      {/* تفاصيل المنتج */}
      <div className="text-center px-4 py-5">
        <h3 className="font-semibold text-[#0C2756] text-lg mb-2 hover:text-[#239FBF] transition-colors line-clamp-1">
          <Link href={`/shop-details?id=${item.id}`}>
            {locale === "ar" ? item.name_ar : item.name_en}
          </Link>
        </h3>

        <div className="flex items-center justify-center gap-2">
          {item.offer_price && item.offer_price > 0 ? (
            <>
              <span className="text-[#239FBF] text-xl font-bold">
                {`${locale === "ar" ? "ج.م" : "$"} ${item.offer_price}`}
              </span>
              <span className="text-gray-400 line-through text-sm">
                {`${locale === "ar" ? "ج.م" : "$"} ${item.price}`}
              </span>
            </>
          ) : (
            <span className="text-[#239FBF] text-xl font-bold">
              {`${locale === "ar" ? "ج.م" : "$"} ${item.price}`}
            </span>
          )}
        </div>
      </div>

      {/* أزرار الأكشن */}
      <div className="absolute right-3 top-3 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => {
            handleQuickViewUpdate();
            openModal();
          }}
          aria-label="Quick view"
          className="flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white text-[#0C2756] hover:bg-[#239FBF] hover:text-white transition-colors"
        >
          👁
        </button>

        <button
          onClick={handleAddToCart}
          aria-label="Add to cart"
          className="flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white text-[#0C2756] hover:bg-[#239FBF] hover:text-white transition-colors"
        >
          🛒
        </button>
      </div>
    </div>
  );
};

export default SingleItem;
