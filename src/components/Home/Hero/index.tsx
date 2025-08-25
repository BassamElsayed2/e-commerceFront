"use client";
import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import { Link } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import { getLimitedTimeOfferProducts } from "@/services/apiProducts";
import { useQuery } from "@tanstack/react-query";

const Hero = () => {
  const locale = useLocale();
  const { data: limitedTimeProducts } = useQuery({
    queryKey: ["limitedTimeOfferProducts"],
    queryFn: getLimitedTimeOfferProducts,
  });

  const fallbackProducts = [
    {
      id: 1,
      name_en: "iPhone 14 Plus & 14 Pro Max",
      name_ar: "آيفون 14 بلس و 14 برو ماكس",
      offer_price: 699,
      price: 999,
      image_url: "/images/hero/hero-02.png",
    },
    {
      id: 2,
      name_en: "Wireless Headphone",
      name_ar: "سماعات لاسلكية",
      offer_price: 299,
      price: 399,
      image_url: "/images/hero/hero-01.png",
    },
  ];

  const productsToShow =
    limitedTimeProducts && limitedTimeProducts.length > 0
      ? limitedTimeProducts.slice(0, 2)
      : fallbackProducts;

  return (
    <section className="overflow-hidden pb-10 lg:pb-12 xl:pb-15 pt-20 sm:pt-16 lg:pt-12 xl:pt-20 bg-[#DFE0E2]/20 mt-30">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          {/* Carousel Section */}
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-0 rounded-[10px] bg-white overflow-hidden shadow-lg">
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero background shapes"
                className="absolute right-0 bottom-0 -z-10"
                width={534}
                height={520}
              />
              <HeroCarousel />
            </div>
          </div>

          {/* Products Section */}
          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              {productsToShow.map((product) => (
                <div
                  key={product.id}
                  className="w-full relative rounded-[10px] bg-white p-4 sm:p-6 shadow-md transition-transform duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-4 sm:gap-14">
                    <div>
                      <h2 className="max-w-[153px] font-semibold text-[#0C2756] text-xl mb-2">
                        <Link
                          href={`/shop-details?id=${product.id}`}
                          className="hover:text-[#239FBF] transition-colors duration-300"
                        >
                          {locale === "en" ? product.name_en : product.name_ar}
                        </Link>
                      </h2>

                      <div>
                        <p className="font-medium text-[#0C2756]/70 text-sm mb-1.5">
                          {locale === "en" ? "Limited Time Offer" : "عرض محدود"}
                        </p>
                        <span className="flex items-center gap-3">
                          <span className="font-semibold text-[#239FBF] text-lg">
                            ${product.offer_price || product.price}
                          </span>
                          {product.offer_price && product.price > product.offer_price && (
                            <span className="font-medium text-[#0C2756]/50 line-through">
                              ${product.price}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Image
                        src={Array.isArray(product.image_url) ? product.image_url[0] : product.image_url}
                        alt={locale === "en" ? product.name_en : product.name_ar}
                        width={123}
                        height={161}
                        className="object-cover rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Features */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
