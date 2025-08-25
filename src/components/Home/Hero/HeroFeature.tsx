"use client";
import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";

const featureData = [
  {
    img: "/images/icons/icon-01.svg",
    title_en: "Free Shipping",
    title_ar: "الشحن مجاني",
    description_en: "For all orders over $200",
    description_ar: "لجميع الطلبات فوق 200 ج.م",
  },
  {
    img: "/images/icons/icon-02.svg",
    title_en: "Easy Returns",
    title_ar: "إرجاع سهل",
    description_en: "Hassle-free returns within 30 days",
    description_ar: "إرجاع سهل خلال 30 يومًا",
  },
  {
    img: "/images/icons/icon-03.svg",
    title_en: "100% Secure Payments",
    title_ar: "الدفع الآمن 100%",
    description_en: "Your payment information is safe with us",
    description_ar: "معلومات الدفع الخاصة بك آمنة معنا",
  },
  {
    img: "/images/icons/icon-04.svg",
    title_en: "24/7 Customer Support",
    title_ar: "دعم العملاء 24/7",
    description_en: "We're here to help you anytime",
    description_ar: "نحن هنا لمساعدتك في أي وقت",
  },
];

const HeroFeature = () => {
  const locale = useLocale();
  return (
    <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-8 xl:px-0 mt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
        {featureData.map((item, key) => (
          <div
            key={key}
            className="flex items-start gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-xl border border-[#DFE0E2]/30 
            transition-all duration-300 hover:-translate-y-2 hover:bg-[#f9fafb]"
          >
            <div className="flex-shrink-0">
              <Image
                src={item.img}
                alt={locale === "en" ? item.title_en : item.title_ar}
                width={48}
                height={48}
                className="transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-[#239FBF] leading-snug">
                {locale === "en" ? item.title_en : item.title_ar}
              </h3>
              <p className="text-sm text-[#0C2756]/70 mt-1 leading-relaxed">
                {locale === "en" ? item.description_en : item.description_ar}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;
