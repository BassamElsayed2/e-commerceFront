import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "NextCommerce | Nextjs E-commerce template",
  description: "This is Home for NextCommerce Template",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const isRtl = locale === "ar";

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
      <link
  href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;700&display=swap"
  rel="stylesheet"
/>

      </head>
      <body className={isRtl ? "rtl" : "ltr"}>{children}</body>
    </html>
  );
}
