import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import SideBar from "@/components/SideBar";

export const metadata: Metadata = {
  title: "BERANDA PIKAT SMKN 1 KATAPANG",
  description: "BERNANDA PIKAT SMKN 1 KATAPANG",
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
    <main className={`${poppins.className} antialiased`}>
      <div className="flex">
        <SideBar />
        {children}
      </div>
    </main>
  );
}
