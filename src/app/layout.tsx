import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "PIKAT SMKN 1 KATAPANG",
  description: "PIKAT SMKN 1 KATAPANG",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${poppins.className} antialiased`}
        suppressHydrationWarning={true} 
      >
        <Toaster position="bottom-right" />
        {children}
      </body>
    </html>
  );
}