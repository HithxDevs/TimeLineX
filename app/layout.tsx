// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TimelineX - Your Calendar App",
  description: "Manage your schedule with TimelineX",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>

          {children}
        </AuthProvider>

      </body>
    </html>
  );
}