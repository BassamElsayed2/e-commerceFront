import { useLocale } from "next-intl";
import Link from "next/link";
import React from "react";

interface BreadcrumbProps {
  title: string;
  pages: string[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title, pages }) => {
  const locale = useLocale();

  return (
    <div className="overflow-hidden shadow-breadcrumb pt-[209px] sm:pt-[155px] lg:pt-[95px] xl:pt-[165px] bg-[#DFE0E2]20">
      <div className="border-t border-white/40">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-5 xl:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="font-semibold text-[#0C2756] text-xl sm:text-2xl xl:text-custom-2">
              {title}
            </h1>

            <ul className="flex items-center gap-2">
              <li className="text-custom-sm hover:text-[#239FBF] transition-colors duration-200">
                <Link href="/">{locale === "ar" ? "الرئيسية" : "Home"} /</Link>
              </li>

              {pages.length > 0 &&
                pages.map((page, key) => (
                  <li
                    className="text-custom-sm last:text-[#239FBF] capitalize transition-colors duration-200"
                    key={key}
                  >
                    {page}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
