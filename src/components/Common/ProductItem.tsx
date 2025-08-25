"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Link } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";

const ProductItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const locale = useLocale();
  const dispatch = useDispatch<AppDispatch>();
  const [showCartSuccess, setShowCartSuccess] = useState(false);

  const handleQuickViewUpdate = () => dispatch(updateQuickView({ ...item }));

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

  const handleProductDetails = () => {
    const productDetails = {
      title: locale === "ar" ? item.name_ar : item.name_en,
      reviews: item.reviews || 0,
      price: item.price,
      discountedPrice: item.offer_price || item.price,
      img: Array.isArray(item.image_url) ? item.image_url[0] : item.image_url,
      images: Array.isArray(item.image_url) ? item.image_url : [item.image_url],
      id: item.id,
      imgs: {
        thumbnails:
          item.imgs?.thumbnails ||
          (Array.isArray(item.image_url) ? item.image_url : [item.image_url]),
        previews:
          item.imgs?.previews ||
          (Array.isArray(item.image_url) ? item.image_url : [item.image_url]),
      },
      description: locale === "ar" ? item.description_ar : item.description_en,
      stock: item.stock,
      attributes: item.attributes || [],
    };
    dispatch(updateproductDetails(productDetails));
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-2xl hover:h-[420px] h-[360px] flex flex-col">
      {/* Success Messages */}
      {showCartSuccess && (
        <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-md text-sm animate-fade-in">
          {locale === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart!"}
        </div>
      )}

      {/* Image */}
      <div className="relative w-full h-[200px] flex items-center justify-center bg-[#F6F7FB] overflow-hidden">
      <Image     
      src={
        item.imgs?.thumbnails?.[0] ||
        (Array.isArray(item.image_url)
          ? item.image_url[0]
          : item.image_url) ||
        "/images/products/product-1-bg-1.png"
      }
      alt={locale === "ar" ? item.name_ar : item.name_en}
      width={200}
      height={200}
      className="object-contain transition-transform duration-500 group-hover:scale-105"
    />
      </div>

      {/* Title */}
      <h3
        className="px-4 mt-3 font-semibold text-[#0C2756] text-lg hover:text-[#239FBF] cursor-pointer"
        onClick={() => handleProductDetails()}
      >
        <Link href={`/shop-details?id=${item.id}`}>
          {locale === "ar" ? item.name_ar : item.name_en}
        </Link>
      </h3>

      {/* Price */}
      <div className="px-4 mt-1 flex items-center gap-2 font-medium text-lg">
        {item.offer_price && item.offer_price > 0 ? (
          <>
            <span className="text-[#239FBF] font-bold">
              {`${locale === "ar" ? "ج.م" : "$"} ${item.offer_price}`}
            </span>
            <span className="text-gray-400 line-through">
              {`${locale === "ar" ? "ج.م" : "$"} ${item.price}`}
            </span>
          </>
        ) : (
          <span className="text-[#239FBF] font-bold">
            {`${locale === "ar" ? "ج.م" : "$"} ${item.price}`}
          </span>
        )}
      </div>

      {/* Hidden Buttons (slide in on hover by expanding card) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 mt-auto flex justify-center gap-3 pb-4">
        <button
          onClick={() => {
            openModal();
            handleQuickViewUpdate();
          }}
          className="flex items-center justify-center px-4 py-2 rounded-md shadow-md text-[#0C2756] bg-white border border-[#239FBF] hover:bg-[#239FBF] hover:text-white transition-colors"
        >
         👁
        </button>

        <button
          onClick={() => handleAddToCart()}
          className="inline-flex font-medium text-sm py-2 px-5 rounded-md bg-[#239FBF] text-white hover:bg-[#0C2756] transition-colors"
        >
          {locale === "ar" ? "إضافة للسلة" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
