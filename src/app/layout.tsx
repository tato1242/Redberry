
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fontsource/firago/400.css"; 
import "@fontsource/firago/700.css"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <div className="border-[1px] border-gray-300  px-[162px] py-[36px] h-[100px] w-full ">
          <img  className=" h-[24px] w-[150px] " src="LOGO.png" alt="" />
          </div>
        </header>
        {children}
        </body>
    </html>
  );
}
