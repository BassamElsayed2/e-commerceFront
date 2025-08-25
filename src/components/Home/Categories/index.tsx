"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/apiCat";
import SingleItem from "./SingleItem";

// Import Swiper styles
import "swiper/css/navigation";
import "swiper/css";

const Categories = () => {
  const locale = useLocale();
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.swiper.init();
    }
  }, []);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <section className="overflow-hidden pt-16">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-12 border-b border-[#DFE0E2]">
        <div className="swiper categories-carousel common-carousel">
          {/* Title */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <span className="flex items-center gap-2.5 font-medium text-[#0C2756] mb-1.5">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0)">
                    <path
                      d="M3.9 13.4C2.6 12.1 2 11.5 1.8 10.7C1.5 9.8 1.7 9 2.1 7.2L2.4 6.1C2.7 4.6 2.9 3.9 3.4 3.4C3.9 2.9 4.7 2.7 6.2 2.4L7.2 2.1C9 1.7 9.8 1.5 10.7 1.8C11.5 2 12.2 2.6 13.4 3.9L15 5.5C17.2 7.7 18.3 8.8 18.3 10.2C18.3 11.6 17.2 12.7 15 14.9C12.7 17.2 11.6 18.3 10.2 18.3C8.8 18.3 7.7 17.2 5.5 14.9L3.9 13.4Z"
                      stroke="#239FBF"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="7.2"
                      cy="7.4"
                      r="1.7"
                      transform="rotate(-45 7.2 7.4)"
                      stroke="#239FBF"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M9.6 15.4L15.4 9.6"
                      stroke="#239FBF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                {locale === "ar" ? "الفئات" : "Categories"}
              </span>
              <h2 className="font-semibold text-xl xl:text-2xl text-[#0C2756]">
                {locale === "ar" ? "تصفح حسب الفئة" : "Browse by Category"}
              </h2>
            </div>

            {/* Arrows */}
            <div
              className={`flex items-center gap-3 ${
                locale === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <button
                onClick={handlePrev}
                className="p-2 rounded-full border border-[#239FBF] hover:bg-[#239FBF] hover:text-white transition"
              >
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M15.5 4.4c.3.3.4.8.1 1.1L9.9 12l5.7 6.5c.3.3.2.8-.1 1.1-.3.3-.8.2-1.1-.1l-6-6.5c-.2-.3-.2-.7 0-1l6-6.5c.3-.3.8-.3 1.1 0z" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="p-2 rounded-full border border-[#239FBF] hover:bg-[#239FBF] hover:text-white transition"
              >
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.5 4.4c-.3.3-.4.8-.1 1.1L14.1 12l-5.7 6.5c-.3.3-.2.8.1 1.1.3.3.8.2 1.1-.1l6-6.5c.2-.3.2-.7 0-1l-6-6.5c-.3-.3-.8-.3-1.1 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Swiper */}
          <Swiper
  ref={sliderRef}
  slidesPerView={6}
  spaceBetween={20}       // مسافة بين الشرائح
  loop={true}             // يجعل السلايدر يكرر نفسه
  breakpoints={{
    0: { slidesPerView: 2, spaceBetween: 10 },
    768: { slidesPerView: 4, spaceBetween: 15 },
    1000: { slidesPerView: 4, spaceBetween: 20 },
    1200: { slidesPerView: 6, spaceBetween: 20 },
  }}
  className="py-4"
>
  {categories?.map((item, index) => (
    <SwiperSlide key={index} className="flex justify-center">
      <SingleItem item={item} />
    </SwiperSlide>
  ))}
</Swiper>

        </div>
      </div>
    </section>
  );
};

export default Categories;
