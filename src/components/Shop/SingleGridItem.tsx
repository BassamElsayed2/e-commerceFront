"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Link } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import { FaEye, FaCartPlus, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SingleGridItem (محسّن بصرياً)
 * - ثيم: #0C2756 (navy) | #239FBF (light blue) | #DFE0E2 (text)
 */

const THEME = {
  navy: "#0C2756",
  blue: "#239FBF",
  text: "#DFE0E2",
  lightBg: "#ffffff",
};

const imageVariants = {
  initial: { scale: 1, opacity: 0 },
  enter: { scale: 1, opacity: 1 },
  hover: { scale: 1.06 },
};

const btnTap = { scale: 0.97 };

type Props = { item: Product };

const SingleGridItem: React.FC<Props> = ({ item }) => {
  const { openModal } = useModalContext();
  const locale = useLocale();
  const [showCartSuccess, setShowCartSuccess] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  // تحديث QuickView
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
    openModal?.();
  };

  // تحديث بيانات تفاصيل المنتج
  const handleProductDetailsUpdate = () => {
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
    dispatch({ type: "product-details/update", payload: productDetails } as any);
  };

  // إضافة للسلة
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

    dispatch(addItemToCart(cartItem) as any);

    setShowCartSuccess(true);
    window.setTimeout(() => setShowCartSuccess(false), 1800);
  };

  const productTitle = locale === "ar" ? item.name_ar : item.name_en;
  const primaryImg =
    item.imgs?.thumbnails?.[0] ||
    (Array.isArray(item.image_url) ? item.image_url[0] : item.image_url) ||
    "/images/products/product-1-bg-1.png";

  return (
    <motion.article
      layout
      initial="initial"
      animate="enter"
      exit="initial"
      className="group relative rounded-lg"
      aria-labelledby={`product-title-${item.id}`}
      role="article"
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-lg bg-white shadow-sm group"
        style={{ minHeight: 270 }}
      >
        {/* Image */}
        <motion.div
          className="relative w-full h-[270px] flex items-center justify-center bg-[#f8fafc]"
          variants={imageVariants}
          initial="initial"
          animate="enter"
          whileHover="hover"
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Image
            src={primaryImg}
            alt={productTitle || "product"}
            width={360}
            height={360}
            className="object-contain max-h-[240px]"
            priority={false}
          />
        </motion.div>

        {/* Overlay actions (فوق النص بمسافة) */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 left-0 w-full flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-3 transition-all duration-300"
        >
          {/* Quick View */}
          <motion.button
            onClick={handleQuickViewUpdate}
            whileTap={btnTap}
            aria-label={locale === "ar" ? "عرض سريع" : "Quick view"}
            className="flex items-center gap-2 px-3 py-2 rounded-md border bg-white text-[#0C2756] shadow-sm hover:scale-105 transition"
            title={locale === "ar" ? "عرض سريع" : "Quick view"}
          >
            <FaEye className="text-base" />
            <span className="text-xs font-medium hidden sm:inline">
              {locale === "ar" ? "عرض سريع" : "Quick view"}
            </span>
          </motion.button>

          {/* Add to cart */}
          <motion.button
            onClick={handleAddToCart}
            whileTap={btnTap}
            aria-label={locale === "ar" ? "أضف الى السلة" : "Add to cart"}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#239FBF] text-white shadow-md hover:shadow-lg"
            title={locale === "ar" ? "أضف الى السلة" : "Add to cart"}
          >
            <FaCartPlus />
            <span className="text-xs font-medium hidden sm:inline">
              {locale === "ar" ? "إضافة إلى السلة" : "Add to cart"}
            </span>
          </motion.button>
        </motion.div>

        {/* Card body */}
        <div className="p-3 mt-12">
          <h3
            id={`product-title-${item.id}`}
            className="mb-1.5 text-sm font-medium text-[#0C2756] hover:text-[#239FBF] transition-colors"
          >
            <Link href={`/shop-details?id=${item.id}`} onClick={handleProductDetailsUpdate}>
              {productTitle}
            </Link>
          </h3>

          <div className="flex items-center gap-3">
            {item.offer_price && item.offer_price > 0 ? (
              <>
                <span className="text-lg font-semibold text-[#0C2756]">
                  {locale === "ar" ? "ج.م" : "$"} {item.offer_price}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {locale === "ar" ? "ج.م" : "$"} {item.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-[#0C2756]">
                {locale === "ar" ? "ج.م" : "$"} {item.price}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add to cart success toast */}
      <AnimatePresence>
        {showCartSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute top-2 right-2 z-50 flex items-center gap-2 rounded-md bg-[#0C2756] text-[#DFE0E2] px-3 py-1 shadow"
            role="status"
            aria-live="polite"
          >
            <FaCheck className="w-4 h-4" />
            <span className="text-xs">{locale === "ar" ? "تم الإضافة" : "Added"}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        :global(button:focus-visible),
        :global(a:focus-visible) {
          outline: 3px solid ${THEME.blue};
          outline-offset: 2px;
          border-radius: 6px;
        }
      `}</style>
    </motion.article>
  );
};

export default SingleGridItem;
