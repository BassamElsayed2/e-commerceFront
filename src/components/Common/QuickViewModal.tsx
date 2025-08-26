"use client";
import React, { useEffect, useState } from "react";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { updateproductDetails } from "@/redux/features/product-details";
import { useLocale } from "next-intl";
import { Link } from "@/app/i18n/navigation";

const QuickViewModal = () => {
  const { isModalOpen, closeModal } = useModalContext();
  const { openPreviewModal } = usePreviewSlider();
  const [quantity, setQuantity] = useState(1);
  const locale = useLocale();

  const dispatch = useDispatch<AppDispatch>();

  // get the product data
  const product = useAppSelector((state) => state.quickViewReducer.value);

  const [activePreview, setActivePreview] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePreviewSlider = () => {
    dispatch(updateproductDetails(product));
    openPreviewModal();
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      title: locale === "ar" ? product.name_ar : product.name_en,
      price: product.price,
      discountedPrice: product.offer_price || product.price,
      quantity,
      imgs: {
        thumbnails:
          product.imgs?.thumbnails ||
          (Array.isArray(product.image_url)
            ? product.image_url
            : [product.image_url]),
        previews:
          product.imgs?.previews ||
          (Array.isArray(product.image_url)
            ? product.image_url
            : [product.image_url]),
      },
    };

    dispatch(addItemToCart(cartItem));
    closeModal();
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (!event.target.closest(".modal-content")) {
        closeModal();
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setQuantity(1);
    };
  }, [isModalOpen, closeModal]);

  useEffect(() => {
    setActivePreview(0);
  }, [product?.id]);

  if (!product || !product.id) {
    return null;
  }

  const productImages =
    product.imgs?.thumbnails ||
    (Array.isArray(product.image_url)
      ? product.image_url
      : [product.image_url]) ||
    ["/images/products/product-1-bg-1.png"];

  const productPreviews =
    product.imgs?.previews ||
    (Array.isArray(product.image_url)
      ? product.image_url
      : [product.image_url]) ||
    ["/images/products/product-1-bg-1.png"];

  const description =
    locale === "ar" ? product.description_ar ?? "" : product.description_en ?? "";

  return (
    <div
      className={`${
        isModalOpen ? "z-[9999]" : "hidden"
      } fixed top-0 left-0 w-full h-screen bg-[#0C2756]/80 flex items-center justify-center px-4 sm:px-8 py-8`}
    >
      <div className="w-full max-w-[1100px] rounded-2xl shadow-2xl bg-white p-8 relative modal-content overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => closeModal()}
          aria-label="close modal"
          className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-dark hover:bg-red-100 hover:text-red-600 transition"
        >
          ✕
        </button>

        <div className="flex flex-wrap items-start gap-12">
          {/* الصور */}
          <div className="max-w-[500px] w-full flex gap-5 justify-center">
            <div className="flex flex-col gap-4">
              {productImages.map((img, key) => (
                <button
                  onClick={() => setActivePreview(key)}
                  key={key}
                  className={`w-20 h-20 flex items-center justify-center rounded-lg overflow-hidden border ${
                    activePreview === key
                      ? "border-blue-600"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={img || "/images/products/product-1-bg-1.png"}
                    alt="thumbnail"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </button>
              ))}
            </div>

            <div className="relative flex-1 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 overflow-hidden">
              <button
                onClick={handlePreviewSlider}
                aria-label="zoom image"
                className="absolute top-4 right-4 z-10 bg-white rounded-md shadow p-2 hover:bg-blue-50"
              >
                🔍
              </button>
              <Image
                src={productPreviews[activePreview]}
                alt="product preview"
                width={400}
                height={400}
                className="object-contain"
              />
            </div>
          </div>

          {/* التفاصيل */}
          <div className="flex-1 max-h-[500px] overflow-y-auto pr-2">
            {product.offer_price && product.offer_price < product.price && (
              <span className="inline-block text-sm font-medium text-white bg-green-600 py-1 px-3 rounded-md mb-4">
                {locale === "ar"
                  ? `خصم ${Math.round(
                      ((product.price - product.offer_price) / product.price) *
                        100
                    )}%`
                  : `SALE ${Math.round(
                      ((product.price - product.offer_price) / product.price) *
                        100
                    )}% OFF`}
              </span>
            )}

            <h3 className="text-2xl font-bold text-[#0C2756] mb-4">
              {locale === "ar" ? product.name_ar : product.name_en}
            </h3>

            <div className="flex items-center gap-3 mb-6">
              <span
                className={`text-sm font-medium ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? locale === "ar"
                    ? "متوفر"
                    : "In Stock"
                  : locale === "ar"
                  ? "غير متوفر"
                  : "Out of Stock"}
              </span>
            </div>

            {/* الوصف مع عرض المزيد */}
            <div className="text-gray-700 mb-6">
              <div
                className={`transition-all ${
                  isExpanded ? "line-clamp-none" : "line-clamp-4"
                }`}
                dangerouslySetInnerHTML={{ __html: description }}
              />
              {description.length > 150 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-600 text-sm mt-2"
                >
                  {isExpanded
                    ? locale === "ar"
                      ? "عرض أقل"
                      : "Show Less"
                    : locale === "ar"
                    ? "عرض المزيد"
                    : "Show More"}
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* السعر والكمية */}
              <div className="flex flex-wrap justify-between items-start gap-6">
                {/* السعر */}
                <div>
                  <h4 className="font-semibold text-lg text-[#0C2756] mb-2">
                    {locale === "ar" ? "السعر" : "Price"}
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#0C2756]">
                      ${product.offer_price || product.price}
                    </span>
                    {product.offer_price && product.offer_price < product.price && (
                      <span className="text-gray-400 line-through text-lg">
                        ${product.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* الكمية */}
                <div>
                  <h4 className="font-semibold text-lg text-[#0C2756] mb-2">
                    {locale === "ar" ? "الكمية" : "Quantity"}
                  </h4>
                  <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center text-xl font-bold text-[#0C2756] hover:bg-gray-100 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      –
                    </button>
                    <span className="w-14 text-center text-lg font-medium text-[#0C2756] bg-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-xl font-bold text-[#0C2756] hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* الأزرار */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={quantity === 0}
                  className={`flex-1 min-w-[150px] px-6 py-3 rounded-lg font-medium text-white bg-[#0C2756] hover:bg-[#14386c] transition ${
                    quantity === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {locale === "ar" ? "إضافة إلى السلة" : "Add to Cart"}
                </button>

                <Link
                  href={`/shop-details?id=${product.id}`}
                  className="flex-1 min-w-[150px] px-6 py-3 rounded-lg font-medium text-[#0C2756] border border-gray-300 bg-gray-50 hover:bg-[#0C2756] hover:text-white transition"
                >
                  {locale === "ar" ? "عرض التفاصيل" : "View Details"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
