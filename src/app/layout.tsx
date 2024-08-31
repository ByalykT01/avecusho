import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TopNav } from "./_components/topnav";
import { Footer } from "./_components/footer";
import { CSPostHogProvider } from "./_analytics/provider";

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
    <CSPostHogProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="flex min-h-screen flex-col">
          <TopNav />
          <main className="flex-grow">
            {children}
            {modal}
          </main>
          <Footer />
          <div id="modal-root" />
        </body>
      </html>
    </CSPostHogProvider>
  );
}
