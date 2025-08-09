import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppTheme from "@/theme/AppTheme";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoBan - مدیریت خودرو و سرویس",
  description: "برنامه مدیریت خودرو و سرویس خودرو",
  keywords: "خودرو, سرویس, تعمیر, نگهداری, AutoBan",
  authors: [{ name: "AutoBan Team" }],
  openGraph: {
    title: "AutoBan - مدیریت خودرو و سرویس",
    description: "برنامه مدیریت خودرو و سرویس خودرو",
    type: "website",
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoBan - مدیریت خودرو و سرویس",
    description: "برنامه مدیریت خودرو و سرویس خودرو",
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
          <AuthProvider>{children}</AuthProvider>
        </AppTheme>
      </body>
    </html>
  );
}
