"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useTranslations } from "next-intl";

const Contact = () => {
    const t = useTranslations("footer");

  return (
    <>
      <Breadcrumb title={"Contact"} pages={["contact"]} />

      <section className="overflow-hidden py-20 bg-[#DFE0E2]/20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            {/* Contact Info */}
<div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.02]">
  <div className="py-5 px-4 sm:px-7.5 border-b border-[#DFE0E2]/50">
    <p className="font-medium text-xl text-[#0C2756]">
    Contact Information
    </p>
  </div>

  <div className="p-4 sm:p-7.5 flex flex-col gap-6 text-[#0C2756]">
    {/* Name */}
    <div className="flex items-center gap-4">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#239FBF]/10 text-[#239FBF]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </span>
      <span>Name: James Septimus</span>
    </div>

    {/* Phone */}
    <div className="flex items-center gap-4">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#239FBF]/10 text-[#239FBF]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.36 11.36 0 003.55.57 1 1 0 011 1V20a1 1 0 01-1 1C9.39 21 3 14.61 3 7a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.19 2.49.57 3.55a1 1 0 01-.21 1.11l-2.24 2.13z"/>
        </svg>
      </span>
      <span>{t("phone")}</span>
    </div>

    {/* Address */}
    <div className="flex items-center gap-4">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#239FBF]/10 text-[#239FBF]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
      </span>
      <span>{t("address")}</span>
    </div>
  </div>
</div>


            {/* Contact Form */}
            <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-md p-4 sm:p-7.5 xl:p-10 transition-transform duration-300 hover:scale-[1.02]">
              <form>
                <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="w-full rounded-md border border-[#DFE0E2] bg-white py-2.5 px-5 placeholder:text-[#0C2756]/50 outline-none focus:ring-2 focus:ring-[#239FBF]/40 hover:shadow-md transition"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full rounded-md border border-[#DFE0E2] bg-white py-2.5 px-5 placeholder:text-[#0C2756]/50 outline-none focus:ring-2 focus:ring-[#239FBF]/40 hover:shadow-md transition"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    className="w-full rounded-md border border-[#DFE0E2] bg-white py-2.5 px-5 placeholder:text-[#0C2756]/50 outline-none focus:ring-2 focus:ring-[#239FBF]/40 hover:shadow-md transition"
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    className="w-full rounded-md border border-[#DFE0E2] bg-white py-2.5 px-5 placeholder:text-[#0C2756]/50 outline-none focus:ring-2 focus:ring-[#239FBF]/40 hover:shadow-md transition"
                  />
                </div>

                <textarea
                  name="message"
                  rows={5}
                  placeholder="Message"
                  className="w-full rounded-md border border-[#DFE0E2] bg-white p-5 placeholder:text-[#0C2756]/50 outline-none focus:ring-2 focus:ring-[#239FBF]/40 hover:shadow-md transition mb-5"
                />

                <button
                  type="submit"
                  className="inline-flex font-medium text-white bg-[#239FBF] py-3 px-7 rounded-md hover:bg-gradient-to-r hover:from-[#239FBF] hover:to-[#0C2756] transition-all shadow-md hover:shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
