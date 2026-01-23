import type { Metadata } from "next";
import SideBar from "@/components/SideBar";

export const metadata: Metadata = {
  title: "BERANDA PIKAT SMKN 1 KATAPANG",
  description: "BERNANDA PIKAT SMKN 1 KATAPANG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen bg-slate-50 bg-main">
      <SideBar />
      <section
        className="flex-1 w-full transition-all duration-300 p-4 pt-16 md:p-8 md:ml-64 ">
        {children}
      </section>
    </main>
  );
}
