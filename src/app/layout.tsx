import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/templates/header";
import { ProviderLayout } from "@/components/layouts/providers";
import { cn } from "@/lib/utils";
import { DashSideBar } from "@/components/dashboard/DashSideBar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layouts/theme-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "ЖКХ",
  description: "Приложение для управление объектами недвижимости и счетами",
};

interface IProps {
  children: React.ReactNode;
}
export default async function RootLayout({ children }: IProps) {
  return (
    <ProviderLayout>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("font-sans antialiased", fontSans.variable)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
              <DashSideBar />
              <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header />
                <main>{children}</main>
                <Toaster />
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ProviderLayout>
  );
}
