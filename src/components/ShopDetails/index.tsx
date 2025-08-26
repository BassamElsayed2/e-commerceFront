"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import RecentlyViewdItems from "./RecentlyViewd";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { getProductAttributes, getProductById } from "@/services/apiProducts";
import { Link } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { updateproductDetails } from "@/redux/features/product-details";
import ShopDetailsSkeleton from "../Shop/ShopDetailsSkeleton";

interface ShopDetailsProps {
  productId?: string;
}

// Theme palette
const COLORS = {
  primary: "#0C2756", // Dark Navy for headings & primary text
  accent: "#239FBF", // Light Blue for buttons & highlights
  surface: "#DFE0E2", // Soft White for cards/backgrounds
};

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

const ShopDetails = ({ productId }: ShopDetailsProps) => {
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);
  const locale = useLocale();
  const productFromRedux = useAppSelector(
    (state) => state.productDetailsReducer.value
  );

  const {
    data: fetchedProduct,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId,
    retry: 1,
    retryDelay: 1000,
  });

  const product = fetchedProduct || productFromRedux || {} as any;
  const [attributes, setAttributes] = useState<any[]>([]);

  useEffect(() => {
    if (fetchedProduct) {
      const productDetails = {
        title: locale === "ar" ? fetchedProduct.name_ar : fetchedProduct.name_en,
        reviews: fetchedProduct.reviews || 0,
        price: fetchedProduct.price || 0,
        discountedPrice: fetchedProduct.offer_price || fetchedProduct.price || 0,
        img: Array.isArray(fetchedProduct.image_url) ? fetchedProduct.image_url[0] : fetchedProduct.image_url || "",
        images: Array.isArray(fetchedProduct.image_url) ? fetchedProduct.image_url : [fetchedProduct.image_url || ""],
        id: fetchedProduct.id,
        imgs: {
          thumbnails: fetchedProduct.imgs?.thumbnails || (Array.isArray(fetchedProduct.image_url) ? fetchedProduct.image_url : [fetchedProduct.image_url || ""]),
          previews: fetchedProduct.imgs?.previews || (Array.isArray(fetchedProduct.image_url) ? fetchedProduct.image_url : [fetchedProduct.image_url || ""]),
        },
        description: locale === "ar" ? fetchedProduct.description_ar || "" : fetchedProduct.description_en || "",
        stock: fetchedProduct.stock || 0,
        attributes: fetchedProduct.attributes || [],
      };
      dispatch(updateproductDetails(product));

    }
  }, [fetchedProduct, locale, dispatch]);

  useEffect(() => {
    if (product && (product.title || product.name_ar || product.name_en)) {
      localStorage.setItem("productDetails", JSON.stringify(product));
    }
  }, [product]);

  useEffect(() => {
    const fetchAttributes = async () => {
      if (product?.id) {
        try {
          const attrs = await getProductAttributes(product.id.toString());
          setAttributes(attrs || []);
        } catch (error) {
          console.error("Error fetching attributes:", error);
          setAttributes([]);
        }
      }
    };

    fetchAttributes();
  }, [product?.id]);

  const handlePreviewSlider = () => {
    openPreviewModal();
  };

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      id: product.id,
      title: product.title || (locale === "ar" ? product.name_ar : product.name_en),
      price: product.price || 0,
      discountedPrice: product.discountedPrice || product.price || 0,
      quantity: quantity,
      imgs: product.imgs || {
        thumbnails: Array.isArray(product.image_url) ? product.image_url : [product.image_url || ""],
        previews: Array.isArray(product.image_url) ? product.image_url : [product.image_url || ""],
      },
    };
    dispatch(addItemToCart(cartItem));
  };

  if (productId && isLoading) {
    return <ShopDetailsSkeleton />;
  }

  if (productId && error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white/50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2" style={{ color: COLORS.primary }}>
            {locale === "ar" ? "حدث خطأ" : "Error occurred"}
          </h2>
          <p className="mb-3" style={{ color: `${COLORS.primary}B3` }}>
            {locale === "ar" ? "حدث خطأ أثناء تحميل بيانات المنتج" : "An error occurred while loading product data"}
          </p>
          <p className="mb-6 text-sm" style={{ color: "#FF4444" }}>
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <div className="mt-2 mb-6">
            <p className="text-sm opacity-70" style={{ color: COLORS.primary }}>Product ID: {productId}</p>
          </div>
          <Link
            href={`/${locale}/shop-without-sidebar`}
            className="inline-flex font-medium text-white py-3 px-7 rounded-md transition-transform"
            style={{ backgroundColor: COLORS.accent }}
          >
            {locale === "ar" ? "العودة إلى المتجر" : "Back to shop"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        title={
          product.title ||
          (locale === "ar" ? product.name_ar : product.name_en) ||
          (locale === "ar" ? "تفاصيل المنتج" : "Product Details")
        }
        pages={locale === "ar" ? ["تفاصيل المنتج"] : ["Product Details"]}
      />

      {!product ||
      !product.id ||
      (!product.title && !product.name_ar && !product.name_en) ||
      (productId && !fetchedProduct && !isLoading) ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: COLORS.primary }}>
              {productId
                ? isLoading
                  ? locale === "ar"
                    ? "جاري التحميل..."
                    : "Loading..."
                  : locale === "ar"
                  ? "المنتج غير موجود"
                  : "Product not found"
                : locale === "ar"
                ? "لا يوجد منتج محدد"
                : "No product selected"}
            </h2>
            <p className="mb-6" style={{ color: `${COLORS.primary}B3` }}>
              {productId
                ? isLoading
                  ? locale === "ar"
                    ? "جاري البحث عن المنتج في قاعدة البيانات..."
                    : "Searching for the product in the database..."
                  : locale === "ar"
                  ? "المنتج المطلوب غير موجود في قاعدة البيانات"
                  : "The requested product was not found in the database"
                : locale === "ar"
                ? "يرجى اختيار منتج من صفحة المتجر لعرض تفاصيله"
                : "Please select a product from the store page to view details"}
            </p>
            <Link
              href={`/${locale}/shop-without-sidebar`}
              className="inline-flex font-medium text-white py-3 px-7 rounded-md transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: COLORS.accent }}
            >
              {locale === "ar" ? "العودة إلى المتجر" : "Back to shop"}
            </Link>
            {productId && !isLoading && (
              <div className="mt-4">
                <p className="text-sm opacity-70" style={{ color: COLORS.primary }}>Product ID: {productId}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <motion.section
            {...fadeInUp}
            className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28"
            style={{ backgroundColor: "transparent" }}
          >
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
                {/* Left: Gallery */}
                <motion.div
                  {...fadeInUp}
                  className="lg:max-w-[570px] w-full"
                >
                  <div
                    className="lg:min-h-[512px] rounded-xl shadow-lg p-4 sm:p-7.5 relative flex items-center justify-center"
                    style={{ backgroundColor: COLORS.surface }}
                  >
                    <div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePreviewSlider}
                        aria-label="button for zoom"
                        className="w-11 h-11 rounded-md shadow-md flex items-center justify-center absolute top-4 lg:top-6 right-4 lg:right-6 z-50 text-white"
                        style={{ backgroundColor: COLORS.accent }}
                      >
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z"
                            fill="currentColor"
                          />
                        </svg>
                      </motion.button>

                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                        <Image
                          src={
                            product.imgs?.previews?.[previewImg] ||
                            (Array.isArray(product.image_url) ?                            product.image_url[0] : product.image_url) ||
                            "/images/products/product-1-bg-1.png"
                          }
                          alt="products-details"
                          width={500}
                          height={500}
                          className="rounded-lg object-contain max-h-[480px]"
                        />
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                    {(
                      product.imgs?.thumbnails ||
                      (Array.isArray(product.image_url) ? product.image_url : [product.image_url])
                    )?.map((item: string, key: number) => (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPreviewImg(key)}
                        key={key}
                        className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg shadow-md border-2 ${
                          key === previewImg ? "" : "border-transparent"
                        }`}
                        style={{
                          backgroundColor: COLORS.surface,
                          borderColor: key === previewImg ? COLORS.accent : "transparent",
                        }}
                        aria-label={`thumbnail-${key}`}
                      >
                        <Image
                          width={64}
                          height={64}
                          src={item || "/images/products/product-1-bg-1.png"}
                          alt="thumbnail"
                          className="object-contain"
                        />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  {...fadeInUp}
                  className="max-w-[539px] w-full"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2
                      className="font-semibold text-xl sm:text-2xl xl:text-3xl"
                      style={{ color: COLORS.primary }}
                    >
                      {product.title ||
                        (locale === "ar" ? product.name_ar : product.name_en)}
                    </h2>

                    {product.discountedPrice &&
                      product.discountedPrice < product.price && (
                        <div
                          className="inline-flex font-medium text-xs sm:text-sm text-white rounded py-1 px-3"
                          style={{ backgroundColor: COLORS.accent }}
                        >
                          {Math.round(
                            ((product.price - product.discountedPrice) /
                              product.price) *
                              100
                          )}
                          % OFF
                        </div>
                      )}
                  </div>

                  <div className="flex flex-wrap items-center gap-5.5 mb-4.5">
                    <div className="flex items-center gap-1.5">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_375_9221)">
                          <path
                            d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.78125 19.4688 10 19.4688C15.2188 19.4688 19.4688 15.2188 19.4688 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.59375 18.0625 10.0312C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                            fill={(product.stock || 0) > 0 ? "#22AD5C" : "#FF4444"}
                          />
                          <path
                            d="M12.6875 7.09374L8.9688 10.7187L7.2813 9.06249C7.00005 8.78124 6.56255 8.81249 6.2813 9.06249C6.00005 9.34374 6.0313 9.78124 6.2813 10.0625L8.2813 12C8.4688 12.1875 8.7188 12.2812 8.9688 12.2812C9.2188 12.2812 9.4688 12.1875 9.6563 12L13.6875 8.12499C13.9688 7.84374 13.9688 7.40624 13.6875 7.12499C13.4063 6.84374 12.9688 6.84374 12.6875 7.09374Z"
                            fill={(product.stock || 0) > 0 ? "#22AD5C" : "#FF4444"}
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_375_9221">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <span
                        className={(product.stock || 0) > 0 ? "" : ""}
                        style={{ color: `${COLORS.primary}B3` }}
                      >
                        {(product.stock || 0) > 0
                          ? locale === "ar"
                            ? `متوفر (${product.stock || 0})`
                            : `In Stock (${product.stock || 0})`
                          : locale === "ar"
                          ? "غير متوفر"
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-medium text-lg sm:text-xl mb-4.5" style={{ color: COLORS.primary }}>
                    {product.offer_price && product.offer_price < product.price ? (
                      <>
                        <span className="text-base sm:text-lg">
                          {locale === "ar" ? "السعر:" : "Price:"} {product.offer_price || 0} {locale === "ar" ? "ج.م" : "$"}
                        </span>
                        <span className="line-through ml-2 mr-2 text-sm opacity-70">
                          {locale === "ar" ? "السعر:" : "Price:"} {product.price || 0} {locale === "ar" ? "ج.م" : "$"}
                        </span>
                      </>
                    ) : (
                      <span className="text-base sm:text-lg">
                        {locale === "ar" ? "السعر:" : "Price:"} {product.price || 0} {locale === "ar" ? "ج.م" : "$"}
                      </span>
                    )}
                  </h3>

                  {(product.description ||
                    (locale === "ar" ? product.description_ar : product.description_en)) && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3" style={{ color: COLORS.primary }}>
                        {locale === "ar" ? "وصف المنتج:" : "Product Description:"}
                      </h4>
                      <div
                        className="leading-relaxed text-sm sm:text-base"
                        style={{ color: `${COLORS.primary}B3` }}
                        dangerouslySetInnerHTML={{
                          __html:
                            product.description ||
                            (locale === "ar" ? product.description_ar : product.description_en) ||
                            "",
                        }}
                      />
                    </div>
                  )}

                  {attributes.length > 0 && (
                    <div className="mt-7.5 mb-9 py-6 border-y" style={{ borderColor: `${COLORS.primary}1A` }}>
                      <h4 className="font-semibold mb-4" style={{ color: COLORS.primary }}>
                        {locale === "ar" ? "خصائص المنتج:" : "Product Attributes:"}
                      </h4>
                      <div className="space-y-3">
                        {attributes.map((attr, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="min-w-[120px]">
                              <h5 className="font-medium text-sm" style={{ color: COLORS.primary }}>
                                {attr.attribute_name}:
                              </h5>
                            </div>
                            <div className="w-full">
                              <p className="text-sm" style={{ color: `${COLORS.primary}B3` }}>
                                {attr.attribute_value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-wrap items-center gap-4.5">
                      <div
                        className="flex items-center rounded-md border"
                        style={{ borderColor: `${COLORS.primary}33` }}
                      >
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          aria-label="button for remove product"
                          className="flex items-center justify-center w-12 h-12 transition-colors"
                          style={{ color: COLORS.primary }}
                          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        >
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.33301 10.0001C3.33301 9.53984 3.7061 9.16675 4.16634 9.16675H15.833C16.2932 9.16675 16.6663 9.53984 16.6663 10.0001C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10.0001Z"
                              fill="currentColor"
                            />
                          </svg>
                        </motion.button>

                        <span className="flex items-center justify-center w-16 h-12 border-x" style={{ borderColor: `${COLORS.primary}1A`, color: COLORS.primary }}>
                          {quantity}
                        </span>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setQuantity(quantity + 1)}
                          aria-label="button for add product"
                          className="flex items-center justify-center w-12 h-12 transition-colors"
                          style={{ color: COLORS.primary }}
                        >
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.33301 10C3.33301 9.5398 3.7061 9.16671 4.16634 9.16671H15.833C16.2932 9.16671 16.6663 9.5398 16.6663 10C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10Z"
                              fill="currentColor"
                            />
                            <path
                              d="M9.99967 16.6667C9.53944 16.6667 9.16634 16.2936 9.16634 15.8334L9.16634 4.16671C9.16634 3.70647 9.53944 3.33337 9.99967 3.33337C10.4599 3.33337 10.833 3.70647 10.833 4.16671L10.833 15.8334C10.833 16.2936 10.4599 16.6667 9.99967 16.6667Z"
                              fill="currentColor"
                            />
                          </svg>
                        </motion.button>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        className="inline-flex font-medium text-white py-3 px-7 rounded-md shadow-md"
                        style={{ backgroundColor: COLORS.accent }}
                      >
                        {locale === "ar" ? "إضافة إلى السلة" : "Add to Cart"}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </motion.section>

          <RecentlyViewdItems />
        </>
      )}
    </>
  );
};

export default ShopDetails;
