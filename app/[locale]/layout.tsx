import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import Script from "next/script";
import clsx from "clsx";

import { Providers } from "./providers";

import { routing } from "@/i18n/routing";
import { fontSans, fontHeading } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/lib/auth-context";

export default async function LocaleLayout({
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

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html suppressHydrationWarning lang={locale}>
      <head>
        <Script id="wowhead-config" strategy="beforeInteractive">
          {`const whTooltips = { colorLinks: false, iconizeLinks: false, renameLinks: false };`}
        </Script>
        <Script
          src="https://wow.wowhead.com/widgets/power.js"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable,
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers
            themeProps={{
              attribute: "class",
              defaultTheme: "dark",
              forcedTheme: "dark",
            }}
          >
            <AuthProvider>
              <div className="relative flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </AuthProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
