import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo List Dashboard",
  description: "Hệ thống quản lý danh sách công việc và tiến độ hàng ngày",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 flex`} suppressHydrationWarning>

        {/* Thanh bên trái */}
        <Sidebar />

        {/* Nội dung chính bên phải */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>

      </body>
    </html>
  );
}