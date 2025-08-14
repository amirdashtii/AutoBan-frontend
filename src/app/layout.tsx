import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppTheme from "@/theme/AppTheme";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://autoban.example.com"
  ),
  title: {
    default: "AutoBan - مدیریت خودرو و سرویس",
    template: "%s | AutoBan",
  },
  description: "برنامه مدیریت خودرو و سرویس خودرو",
  keywords: "خودرو, سرویس, تعمیر, نگهداری, AutoBan",
  authors: [{ name: "AutoBan Team" }],
  openGraph: {
    title: "AutoBan - مدیریت خودرو و سرویس",
    description: "برنامه مدیریت خودرو و سرویس خودرو",
    type: "website",
    locale: "fa_IR",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoBan - مدیریت خودرو و سرویس",
    description: "برنامه مدیریت خودرو و سرویس خودرو",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={inter.className}>
        <AppTheme>
          <ClientProviders>{children}</ClientProviders>
        </AppTheme>
      </body>
    </html>
  );
}
