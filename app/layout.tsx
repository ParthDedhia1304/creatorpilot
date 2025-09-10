import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { cn } from "@/lib/utils"; // helper to merge classes
import { ThemeProvider } from "next-themes"; // <-- for dark mode toggle

export const metadata: Metadata = {
  title: "Creatorpilot",
  description: "Explore the power of AI",
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(outfit.className, "bg-background text-foreground")}>
          {/* Wrap everything in ThemeProvider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Provider>{children}</Provider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
