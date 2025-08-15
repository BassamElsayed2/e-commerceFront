import "@/app/css/euclid-circular-a-font.css";
import "@/app/css/style.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/app/i18n/routing";
import { notFound } from "next/navigation";
import ClientLayout from "@/app/(site)/[locale]/ClientLayout";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html
      lang={locale}
      suppressHydrationWarning={true}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <body className={locale === "ar" ? "rtl" : "ltr"}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
