"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import Image from "next/image";
import { Link } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import { getLimitedTimeOfferProducts } from "@/services/apiProducts";
import { useQuery } from "@tanstack/react-query";

const HeroCarousal = () => {
  const locale = useLocale();
  const { data: limitedTimeProducts } = useQuery({
    queryKey: ["limitedTimeOfferProducts"],
    queryFn: getLimitedTimeOfferProducts,
  });

  const fallbackProducts = [
    {
      id: 1,
      name_en: "True Wireless Noise Cancelling Headphone",
      name_ar: "سماعات لاسلكية مع إلغاء الضوضاء",
      offer_price: 299,
      price: 399,
      image_url: "/images/hero/hero-01.png",
    },
    {
      id: 2,
      name_en: "iPhone 14 Plus & 14 Pro Max",
      name_ar: "آيفون 14 بلس و 14 برو ماكس",
      offer_price: 699,
      price: 999,
      image_url: "/images/hero/hero-02.png",
    },
  ];

  const productsToShow =
    limitedTimeProducts && limitedTimeProducts.length > 0
      ? limitedTimeProducts.slice(0, 2)
      : fallbackProducts;

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
        renderBullet: (index, className) => {
          return `<span class="${className} hero-dot"></span>`;
        },
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {productsToShow.map((product) => (
        <SwiperSlide key={product.id}>
          <div className="relative group">
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-800"></div>

            {/* Main Card */}
            <div className="relative flex items-center flex-col-reverse sm:flex-row bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transition-all duration-1000 hover:shadow-3xl hover:scale-[1.02] group-hover:bg-white/95 border border-white/20">
              {/* Content Section */}
              <div
                className={`relative z-10 max-w-[394px] py-12 sm:py-16 lg:py-28 ${
                  locale === "en"
                    ? "pl-6 sm:pl-8 lg:pl-14"
                    : "pr-6 sm:pr-8 lg:pr-14"
                }`}
              >
                {/* Badge Container */}
                <div className="flex items-center gap-4 mb-8 sm:mb-10">
                  {/* Discount Badge */}
                  <div className="relative">
                    <span className="block font-bold text-xl sm:text-2xl text-white bg-gradient-to-r from-[#239FBF] to-[#0C2756] rounded-full px-5 py-2 shadow-md transform transition-all duration-300">
                      {product.offer_price &&
                      product.price > product.offer_price
                        ? Math.round(
                            ((product.price - product.offer_price) /
                              product.price) *
                              100
                          )
                        : 30}
                      %
                    </span>
                    {/* Animated ring around badge */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#239FBF]-500 to-pink-500 opacity-20 animate-ping"></div>
                  </div>

                  {/* Sale Text */}
                  <div className="flex flex-col">
                    <span className="block text-dark font-semibold text-lg sm:text-xl leading-tight">
                      {locale === "en" ? "Flash Sale" : "عرض خاص "}
                    </span>
                    <span className="block text-dark/70 text-sm sm:text-base">
                      {locale === "en" ? "Limited Time" : "لفترة محدودة "}
                    </span>
                  </div>
                </div>

                {/* Product Title */}
                <h1 className="font-bold text-dark text-3xl sm:text-4xl lg:text-5xl mb-4 leading-tight transition-all duration-800 group-hover:translate-y-1">
                  <Link
                    href={`/shop-details?id=${product.id}`}
                    className="hover:text-[#239FBF] transition-colors duration-300"
                  >
                    {locale === "en" ? product.name_en : product.name_ar}
                  </Link>
                </h1>

                {/* Description */}
                {/*    <p className="text-gray-600 text-lg mb-6 leading-relaxed transition-opacity duration-700 group-hover:opacity-90 max-w-sm">
                  {locale === "en"
                    ? "🎉 Exclusive offer! Don't miss out!"
                    : "🎉 عرض حصري! لا تفوت الفرصة!"}
                </p> */}

                {/* Price Section */}
                <div className="flex items-center gap-4 mb-8 transition-all duration-700 group-hover:translate-x-2">
                  {/* Current Price */}
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {locale === "en" ? "Special Price" : "السعر الخاص"}
                    </span>
                    <span className="font-bold text-[#239FBF]-600 text-2xl sm:text-3xl">
                      ${product.offer_price || product.price}
                    </span>
                  </div>

                  {/* Original Price */}
                  {product.offer_price &&
                    product.price > product.offer_price && (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">
                          {locale === "en" ? "Was" : "كان"}
                        </span>
                        <span className="font-medium text-dark/50 line-through text-lg sm:text-xl">
                          ${product.price}
                        </span>
                      </div>
                    )}

                  {/* Savings Amount */}
                  {product.offer_price &&
                    product.price > product.offer_price && (
                      <div className="ml-auto">
                        <span className="inline-block bg-green-900 text-green text-xs font-semibold px-3 py-1 rounded-full">
                          {locale === "en" ? "Save $" : "وفر $"}
                          {product.price - product.offer_price}
                        </span>
                      </div>
                    )}
                </div>

                {/* CTA Button */}
                <Link
                  href={`/shop-details?id=${product.id}`}
                  className="group/btn inline-flex items-center justify-center font-semibold text-white text-lg rounded-2xl bg-gradient-to-r from-[#239FBF] to-[#0C2756] py-3 px-8 transition-all duration-300 hover:from-[#0C275F] hover:to-[#0C2746] hover:scale-105 hover:shadow-lg transform"
                >
                  <span className="mr-2 group-hover/btn:mr-3 transition-all duration-300">
                    {locale === "en" ? "Shop Now" : "تسوق الآن"}
                  </span>
                  <svg
                    className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>

                {/* Trust Indicators */}
                {/*  <div className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">{locale === "en" ? "Free Shipping" : "شحن مجاني"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">{locale === "en" ? "24/7 Support" : "دعم 24/7"}</span>
                  </div>
                </div> */}
              </div>

              {/* Image Section */}
              <div className="relative flex-shrink-0 transition-all duration-1000 group-hover:scale-105">
                <div className="relative rounded-r-3xl">
                  <Image
                    src={
                      Array.isArray(product.image_url)
                        ? product.image_url[0]
                        : product.image_url
                    }
                    alt={locale === "en" ? product.name_en : product.name_ar}
                    width={400}
                    height={450}
                    className="object-contain w-full h-auto transition-transform duration-1000 group-hover:scale-110"
                    style={{ maxHeight: "450px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousal;
