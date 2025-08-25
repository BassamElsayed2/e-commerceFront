import { Category } from "@/types/category";
import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import Link from "next/link";

const SingleItem = ({ item }: { item: Category }) => {
  const locale = useLocale();

  // استخدم صورة افتراضية لو ما في صورة
  const imgSrc = item.image_url && item.image_url.trim() !== "" ? item.image_url : "/placeholder.png";

  return (
    <Link
      href={`/${locale}/shop-without-sidebar?category=${item.id}`}
      className="group flex flex-col items-center w-full"
    >
      {/* Circle Background + Image */}
      <div className="w-[150px] h-[150px] rounded-full bg-[#F2F3F8] flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110">
        <Image
          src={imgSrc}
          alt={locale === "ar" ? item.name_ar : item.name_en}
          width={120}
          height={90}
          className="object-contain"
        />
      </div>

      {/* Category Name */}
      <h3 className="font-bold text-center text-[#239FBF] text-base bg-gradient-to-r from-blue-500 to-blue-700 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 group-hover:bg-[length:100%_2px] group-hover:text-blue-600">
        {locale === "ar" ? item.name_ar : item.name_en}
      </h3>
    </Link>
  );
};

export default SingleItem;
