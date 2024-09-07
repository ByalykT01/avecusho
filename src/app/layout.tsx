import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TopNav } from "./_components/topnav";
import { Footer } from "./_components/footer";
import { CSPostHogProvider } from "./_analytics/provider";
import { SessionProvider } from "next-auth/react"; 
import { auth } from "auth";

export const metadata: Metadata = {
  title: "Avecusho",
  description: "Genius artist's store",
  icons: [{ rel: "icon", url: "/avecusho.svg" }],
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
    <CSPostHogProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="flex min-h-screen flex-col">
          <TopNav />
          <main className="flex flex-1">
            {children}
            {modal}
          </main>
          <Footer />
          <div id="modal-root" />
        </body>
      </html>
    </CSPostHogProvider>
    </SessionProvider>
  );
}
