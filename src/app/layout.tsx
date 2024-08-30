import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TopNav } from "./_components/topnav";
import { Footer } from "./_components/footer";

export const metadata: Metadata = {
  title: "Avecusho",
  description: "Genius artist's store",
  icons: [{ rel: "icon", url: "/avecusho.svg" }],
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TopNav />
        {children}
        {modal}
        <div id="modal-root" />
        <Footer />
      </body>
    </html>
  );
}
