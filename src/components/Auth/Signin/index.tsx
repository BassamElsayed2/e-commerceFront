"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";

const Signin = () => {
  const locale = useLocale();
  const t = useTranslations("auth");
  const { signIn, redirectIfAuthenticated, loading, user } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && user) {
      redirectIfAuthenticated();
    }
  }, [loading, user, redirectIfAuthenticated]);

  useEffect(() => {
    console.log("Signin component - loading:", loading, "user:", !!user);
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0C2756] mx-auto mb-4"></div>
          <p className="text-[#0C2756]">Loading authentication...</p>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn(formData.email, formData.password);

      if (result.success) {
        setFormData({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.error("Signin error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Signin"} pages={["Signin"]} />
      <section className="overflow-hidden py-20 bg-white">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-[#0C2756] mb-1.5">
                {t("signIn")}
              </h2>
              <p className="text-[#0C2756]">{t("enterYourDetail")}</p>
            </div>

            <div>
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5 text-[#0C2756]">
                    {t("emailAddress")}
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t("enterEmailAddress")}
                    className={`rounded-lg border ${
                      errors.email ? "border-red-500" : "border-[#239FBF]"
                    } bg-white placeholder:text-[#0C2756] w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-[#239FBF]/20`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5 text-[#0C2756]">
                    {t("password")}
                  </label>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t("enterPassword")}
                    autoComplete="current-password"
                    className={`rounded-lg border ${
                      errors.password ? "border-red-500" : "border-[#239FBF]"
                    } bg-white placeholder:text-[#0C2756] w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-[#239FBF]/20`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center font-medium text-white bg-gradient-to-r from-[#0C2756] to-[#239FBF] py-3 px-6 rounded-lg ease-out duration-200 hover:from-[#239FBF] hover:to-[#0C2756] mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("signingIn")}
                    </div>
                  ) : (
                    t("signIn")
                  )}
                </button>

                <a
                  href="#"
                  className="block text-center text-[#0C2756] mt-4.5 ease-out duration-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#0C2756] hover:to-[#239FBF]"
                >
                  {t("forgetPassword")}
                </a>

                <p className="text-center mt-6 text-[#0C2756]">
                  {t("dontHaveAccount")}
                  <Link
                    href={`/${locale}/signup`}
                    className="text-[#0C2756] ease-out duration-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#0C2756] hover:to-[#239FBF] pl-2"
                  >
                    {t("signUpNow")}
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
