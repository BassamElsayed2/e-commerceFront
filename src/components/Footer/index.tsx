"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

/**
 * - ثيم الألوان:
 *    #0C2756 (كحلي)  |  #239FBF (أزرق فاتح)  |  #DFE0E2 (أبيض)
 */
const Footer = () => {
  const year = new Date().getFullYear();
  const t = useTranslations("footer");

  return (
    <footer className="relative overflow-hidden text-[#DFE0E2] bg-[#0C2756]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_20%,rgba(35,159,191,0.25),transparent_60%),radial-gradient(45%_45%_at_80%_30%,rgba(223,224,226,0.12),transparent_60%)] opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2756] via-[#102e63] to-[#0C2756] bg-[length:200%_200%] animate-gradientMove opacity-[0.22]" />
        <div className="absolute -inset-x-1/3 inset-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#239FBF]/60 to-transparent animate-shine" />
      </div>

      <div className="relative z-10 max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="[--card:#0f2f66]">
          <h3 className="relative inline-flex items-center gap-3 text-3xl font-extrabold group">
            <span className="text-4xl transform transition-transform duration-500 group-hover:scale-110">
              <FaShoppingCart
                style={{
                  fill: "url(#gradient)",
                }}
              />
              <svg width="0" height="0">
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#239FBF" />
                  <stop offset="50%" stopColor="#DFE0E2" />
                  <stop offset="100%" stopColor="#239FBF" />
                </linearGradient>
              </svg>
            </span>

            <span className="bg-gradient-to-r from-[#239FBF] via-[#DFE0E2] to-[#239FBF] bg-clip-text text-transparent">
              The Cart
            </span>
            <span className="absolute left-0 bottom-0 h-[3px] w-0 bg-gradient-to-r from-[#239FBF] to-[#DFE0E2] transition-all duration-500 group-hover:w-full"></span>
          </h3>

          <p className="mt-4 text-sm leading-7 text-[#DFE0E2]/90">
            {t("aboutUsText")}
          </p>

          <div className="mt-6 flex gap-3">
            {[
              { icon: <FaFacebookF />, href: "#", label: "Facebook" },
              { icon: <FaTwitter />, href: "#", label: "Twitter" },
              { icon: <FaInstagram />, href: "#", label: "Instagram" },
              { icon: <FaLinkedinIn />, href: "#", label: "LinkedIn" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                aria-label={item.label}
                className="group relative grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#239FBF] hover:text-[#0C2756] hover:ring-[#239FBF]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#239FBF] focus-visible:ring-offset-[#0C2756]"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="text-base">{item.icon}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-5 text-base font-semibold text-[#239FBF] tracking-wide">
            {t("helpSupport")}
          </h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-4">
              <span className="mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 text-[#239FBF]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.25 8.51464C4.25 4.45264 7.77146 1.25 12 1.25C16.2285 1.25 19.75 4.45264 19.75 8.51464C19.75 12.3258 17.3871 16.8 13.5748 18.4292C12.574 18.8569 11.426 18.8569 10.4252 18.4292C6.61289 16.8 4.25 12.3258 4.25 8.51464ZM12 2.75C8.49655 2.75 5.75 5.38076 5.75 8.51464C5.75 11.843 7.85543 15.6998 11.0147 17.0499C11.639 17.3167 12.361 17.3167 12.9853 17.0499C16.1446 15.6998 18.25 11.843 18.25 8.51464C18.25 5.38076 15.5034 2.75 12 2.75ZM12 7.75C11.3096 7.75 10.75 8.30964 10.75 9C10.75 9.69036 11.3096 10.25 12 10.25C12.6904 10.25 13.25 9.69036 13.25 9C13.25 8.30964 12.6904 7.75 12 7.75ZM9.25 9C9.25 7.48122 10.4812 6.25 12 6.25C13.5188 6.25 14.75 7.48122 14.75 9C14.75 10.5188 13.5188 11.75 12 11.75C10.4812 11.75 9.25 10.5188 9.25 9ZM3.59541 14.9966C3.87344 15.3036 3.84992 15.7779 3.54288 16.0559C2.97519 16.57 2.75 17.0621 2.75 17.5C2.75 18.2637 3.47401 19.2048 5.23671 19.998C6.929 20.7596 9.31952 21.25 12 21.25C14.6805 21.25 17.071 20.7596 18.7633 19.998C20.526 19.2048 21.25 18.2637 21.25 17.5C21.25 17.0621 21.0248 16.57 20.4571 16.0559C20.1501 15.7779 20.1266 15.3036 20.4046 14.9966C20.6826 14.6895 21.1569 14.666 21.4639 14.9441C22.227 15.635 22.75 16.5011 22.75 17.5C22.75 19.2216 21.2354 20.5305 19.3788 21.3659C17.4518 22.2331 14.8424 22.75 12 22.75C9.15764 22.75 6.54815 22.2331 4.62116 21.3659C2.76457 20.5305 1.25 19.2216 1.25 17.5C1.25 16.5011 1.77305 15.635 2.53605 14.9441C2.84309 14.666 3.31738 14.6895 3.59541 14.9966Z"
                  />
                </svg>
              </span>
              <span className="pt-0.5">{t("address")}</span>
            </li>

            <li>
              <a
                href="#"
                className="group inline-flex items-center gap-4 hover:text-[#239FBF] transition-colors"
              >
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 text-[#239FBF]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.7177 3.0919C5.94388 1.80096 7.9721 2.04283 8.98569 3.47641L10.2467 5.25989C11.0574 6.40656 10.9889 8.00073 10.0214 9.0194L9.7765 9.27719C9.77582 9.27897 9.7751 9.2809 9.77436 9.28299C9.76142 9.31935 9.7287 9.43513 9.7609 9.65489C9.82765 10.1104 10.1793 11.0361 11.607 12.5392C13.0391 14.0469 13.9078 14.4023 14.3103 14.4677C14.484 14.4959 14.5748 14.4714 14.6038 14.4612L15.0124 14.031C15.8862 13.111 17.2485 12.9298 18.347 13.5621L20.2575 14.6617C21.8904 15.6016 22.2705 17.9008 20.9655 19.2747L19.545 20.7703C19.1016 21.2371 18.497 21.6355 17.75 21.7092C15.9261 21.8893 11.701 21.6548 7.27161 16.9915C3.13844 12.64 2.35326 8.85513 2.25401 7.00591L2.92011 6.97016L2.25401 7.00591C2.20497 6.09224 2.61224 5.30855 3.1481 4.7444L4.7177 3.0919ZM7.7609 4.34237C7.24855 3.61773 6.32812 3.57449 5.80528 4.12493L4.23568 5.77743C3.90429 6.12632 3.73042 6.52621 3.75185 6.92552C3.83289 8.43533 4.48307 11.8776 8.35919 15.9584C12.4234 20.2373 16.1676 20.3581 17.6026 20.2165C17.8864 20.1885 18.1783 20.031 18.4574 19.7373L19.8779 18.2417C20.4907 17.5965 20.3301 16.4342 19.5092 15.9618L17.5987 14.8621C17.086 14.567 16.4854 14.6582 16.1 15.064L15.6445 15.5435L15.1174 15.0428C15.6445 15.5435 15.6438 15.5442 15.6432 15.545L15.6417 15.5464L15.6388 15.5495L15.6324 15.556L15.6181 15.5701C15.6078 15.5801 15.5959 15.591 15.5825 15.6028C15.5556 15.6264 15.5223 15.6533 15.4824 15.6816C15.4022 15.7384 15.2955 15.8009 15.1606 15.8541C14.8846 15.963 14.5201 16.0214 14.0699 15.9483C13.1923 15.8058 12.0422 15.1755 10.5194 13.5722C8.99202 11.9642 8.40746 10.7645 8.27675 9.87234C8.21022 9.41827 8.26346 9.05468 8.36116 8.78011C8.40921 8.64508 8.46594 8.53742 8.51826 8.45566C8.54435 8.41489 8.56922 8.38075 8.5912 8.35298C8.60219 8.33909 8.61246 8.32678 8.62182 8.31603L8.63514 8.30104L8.64125 8.29441L8.64415 8.2913L8.64556 8.2898C8.64625 8.28907 8.64694 8.28835 9.17861 8.79333L8.64695 8.28834L8.93376 7.98637C9.3793 7.51731 9.44403 6.72292 9.02189 6.12586L7.7609 4.34237Z"
                    />
                  </svg>
                </span>
                <span className="underline-animated">{t("phone")}</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="group inline-flex items-center gap-4 hover:text-[#239FBF] transition-colors"
              >
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 text-[#239FBF]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.94358 3.25H14.0564C15.8942 3.24998 17.3498 3.24997 18.489 3.40314C19.6614 3.56076 20.6104 3.89288 21.3588 4.64124C22.1071 5.38961 22.4392 6.33856 22.5969 7.51098C22.75 8.65019 22.75 10.1058 22.75 11.9436V12.0564C22.75 13.8942 22.75 15.3498 22.5969 16.489C22.4392 17.6614 22.1071 18.6104 21.3588 19.3588C20.6104 20.1071 19.6614 20.4392 18.489 20.5969C17.3498 20.75 15.8942 20.75 14.0564 20.75H9.94359C8.10583 20.75 6.65019 20.75 5.51098 20.5969C4.33856 20.4392 3.38961 20.1071 2.64124 19.3588C1.89288 18.6104 1.56076 17.6614 1.40314 16.489C1.24997 15.3498 1.24998 13.8942 1.25 12.0564V11.9436C1.24998 10.1058 1.24997 8.65019 1.40314 7.51098C1.56076 6.33856 1.89288 5.38961 2.64124 4.64124C3.38961 3.89288 4.33856 3.56076 5.51098 3.40314C6.65019 3.24997 8.10582 3.24998 9.94358 3.25ZM5.71085 4.88976C4.70476 5.02502 4.12511 5.27869 3.7019 5.7019C3.27869 6.12511 3.02502 6.70476 2.88976 7.71085C2.75159 8.73851 2.75 10.0932 2.75 12C2.75 13.9068 2.75159 15.2615 2.88976 16.2892C3.02502 17.2952 3.27869 17.8749 3.7019 18.2981C4.12511 18.7213 4.70476 18.975 5.71085 19.1102C6.73851 19.2484 8.09318 19.25 10 19.25H14C15.9068 19.25 17.2615 19.2484 18.2892 19.1102C19.2952 18.975 19.8749 18.7213 20.2981 18.2981C20.7213 17.8749 20.975 17.2952 21.1102 16.2892C21.2484 15.2615 21.25 13.9068 21.25 12C21.25 10.0932 21.2484 8.73851 21.1102 7.71085C20.975 6.70476 20.7213 6.12511 20.2981 5.7019C19.8749 5.27869 19.2952 5.02502 18.2892 4.88976C17.2615 4.75159 15.9068 4.75 14 4.75H10C8.09318 4.75 6.73851 4.75159 5.71085 4.88976ZM5.42383 7.51986C5.68901 7.20165 6.16193 7.15866 6.48014 7.42383L8.63903 9.22291C9.57199 10.0004 10.2197 10.5384 10.7666 10.8901C11.2959 11.2306 11.6549 11.3449 12 11.3449C12.3451 11.3449 12.7041 11.2306 13.2334 10.8901C13.7803 10.5384 14.428 10.0004 15.361 9.22291L17.5199 7.42383C17.8381 7.15866 18.311 7.20165 18.5762 7.51986C18.8413 7.83807 18.7983 8.31099 18.4801 8.57617L16.2836 10.4066C15.3973 11.1452 14.6789 11.7439 14.0448 12.1517C13.3843 12.5765 12.7411 12.8449 12 12.8449C11.2589 12.8449 10.6157 12.5765 9.95518 12.1517C9.32112 11.7439 8.60272 11.1452 7.71636 10.4066L5.51986 8.57617C5.20165 8.31099 5.15866 7.83807 5.42383 7.51986Z"
                    />
                  </svg>
                </span>
                <span className="underline-animated">{t("email")}</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-5 text-base font-semibold text-[#239FBF] tracking-wide">
            {t("account")}
          </h2>
          <ul className="flex flex-col space-y-3.5 text-sm">
            {["myAccount", "loginRegister", "cart", "wishlist", "shop"].map(
              (key) => (
                <li key={key}>
                  <a href="#" className="link-underline hover:text-[#239FBF]">
                    {t(key)}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-base font-semibold text-[#239FBF] tracking-wide">
            {t("quickLinks")}
          </h4>
          <ul className="flex flex-col space-y-3.5 text-sm">
            {[
              "privacyPolicy",
              "refundPolicy",
              "termsOfUse",
              "faqs",
              "contact",
            ].map((key) => (
              <li key={key}>
                <a href="#" className="link-underline hover:text-[#239FBF]">
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative z-10 max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 pb-12 text-center">
        <h2 className="text-base font-semibold mb-2 text-[#239FBF] tracking-wide">
          {t("downloadApp")}
        </h2>
        {/*   <p className="mb-6 text-sm text-[#DFE0E2]/90">{t("saveWithApp")}</p>
         */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#"
            className="group inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 pr-7 py-2.5 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-2px] hover:bg-[#239FBF] hover:text-[#0C2756] hover:shadow-[0_8px_30px_rgba(35,159,191,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#239FBF] focus-visible:ring-offset-[#0C2756]"
          >
            <svg
              className="h-[34px] w-[34px]"
              viewBox="0 0 34 35"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M29.5529 12.3412C29.3618 12.4871 25.9887 14.3586 25.9887 18.5198C25.9887 23.3331 30.2809 25.0358 30.4093 25.078C30.3896 25.1818 29.7275 27.41 28.1463 29.6804C26.7364 31.6783 25.264 33.6731 23.024 33.6731C20.7841 33.6731 20.2076 32.3918 17.6217 32.3918C15.1018 32.3918 14.2058 33.7152 12.1569 33.7152C10.1079 33.7152 8.6783 31.8664 7.03456 29.5961C5.13062 26.93 3.59229 22.7882 3.59229 18.8572C3.59229 12.552 7.756 9.20804 11.8538 9.20804C14.0312 9.20804 15.8462 10.6157 17.2133 10.6157C18.5144 10.6157 20.5436 9.12373 23.0207 9.12373C23.9595 9.12373 27.3327 9.20804 29.5529 12.3412ZM21.8447 6.45441C22.8692 5.25759 23.5939 3.59697 23.5939 1.93635C23.5939 1.70607 23.5741 1.47254 23.5313 1.28442C21.8645 1.34605 19.8815 2.37745 18.6857 3.74292C17.7469 4.79379 16.8707 6.45441 16.8707 8.13773C16.8707 8.39076 16.9135 8.64369 16.9333 8.72476C17.0387 8.74426 17.21 8.76694 17.3813 8.76694C18.8768 8.76694 20.7577 7.78094 21.8447 6.45441Z" />
            </svg>
            <div className="text-left">
              <span className="block text-[11px] leading-none">
                {t("downloadOnThe")}
              </span>
              <p className="mt-0.5 text-[15px] font-medium">{t("appStore")}</p>
            </div>
          </a>

          <a
            href="#"
            className="group inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 pr-8 py-2.5 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-2px] hover:bg-[#239FBF] hover:text-[#0C2756] hover:shadow-[0_8px_30px_rgba(35,159,191,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#239FBF] focus-visible:ring-offset-[#0C2756]"
          >
            <svg
              className="h-[34px] w-[34px]"
              viewBox="0 0 34 35"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.45764 1.03125L19.9718 15.5427L23.7171 11.7973C18.5993 8.69224 11.7448 4.52679 8.66206 2.65395L6.59681 1.40278C6.23175 1.18039 5.84088 1.06062 5.45764 1.03125ZM3.24214 2.76868C3.21276 2.92814 3.1875 3.08837 3.1875 3.26041V31.939C3.1875 32.0593 3.21169 32.1713 3.22848 32.2859L17.9939 17.5205L3.24214 2.76868ZM26.1785 13.2916L21.9496 17.5205L26.1047 21.6756C28.3062 20.3412 29.831 19.4147 30.0003 19.3126C30.7486 18.8552 31.1712 18.1651 31.1586 17.4112C31.1474 16.6713 30.7247 16.0098 30.0057 15.6028C29.8449 15.5104 28.3408 14.6022 26.1785 13.2916ZM19.9718 19.4983L5.50135 33.9688C5.78248 33.9198 6.06327 33.836 6.33182 33.6737C6.70387 33.4471 16.7548 27.3492 23.6433 23.1699L19.9718 19.4983Z" />
            </svg>
            <div className="text-left">
              <span className="block text-[11px] leading-none">
                {t("getInOn")}
              </span>
              <p className="mt-0.5 text-[15px] font-medium">
                {t("googlePlay")}
              </p>
            </div>
          </a>
        </div>
      </div>
      <div className="bg-white py-4">
        <div className="max-w-[1170px] mx-auto flex items-center justify-center gap-6">
          <Image
            src="/images/payment/payment-01.svg"
            alt="Visa"
            width={66}
            height={22}
          />
          <Image
            src="/images/payment/payment-02.svg"
            alt="PayPal"
            width={18}
            height={21}
          />
          <Image
            src="/images/payment/payment-03.svg"
            alt="MasterCard"
            width={33}
            height={24}
          />
          <Image
            src="/images/payment/payment-04.svg"
            alt="Apple Pay"
            width={52}
            height={22}
          />
          <Image
            src="/images/payment/payment-05.svg"
            alt="Google Pay"
            width={56}
            height={22}
          />
        </div>
      </div>

      <div className="bg-[#0C2756] py-4 text-center text-sm text-[#DFE0E2]/80 border-t border-white/10">
        © {year} {t("allRightsReserved")}
      </div>

      <style jsx>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes shine {
          0% {
            transform: translateX(-40%);
            opacity: 0;
          }
          15% {
            opacity: 0.35;
          }
          50% {
            transform: translateX(40%);
            opacity: 0.15;
          }
          100% {
            transform: translateX(140%);
            opacity: 0;
          }
        }
        .animate-gradientMove {
          animation: gradientMove 12s ease-in-out infinite;
        }
        .animate-shine {
          animation: shine 8s linear infinite;
        }

        .link-underline {
          position: relative;
          display: inline-block;
          transition: color 0.25s ease;
        }
        .link-underline::after {
          content: "";
          position: absolute;
          inset-inline-start: 0;
          bottom: -2px;
          height: 2px;
          width: 0;
          background: #239fbf;
          transition: width 0.3s ease;
        }
        .link-underline:hover::after {
          width: 100%;
        }

        :global(html[dir="rtl"]) .underline-animated::after,
        .underline-animated::after {
          display: none;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
