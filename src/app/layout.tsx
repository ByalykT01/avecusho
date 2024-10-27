import "~/styles/globals.css";
import "@uploadthing/react/styles.css";

import { type Metadata } from "next";
import { CSPostHogProvider } from "./_analytics/provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "auth";
import { Toaster } from "~/components/ui/sonner";
import TopNav from "~/components/nav/topnav";
import Footer from "~/components/nav/footer";

// import { ThemeProvider } from "~/providers/ThemeProvider";

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
      {/*<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">*/}
      <CSPostHogProvider>
      <html lang="en" className="font-helvetica">
        <body className="flex min-h-screen flex-col">
          <TopNav />
          <main className="flex flex-1">
            <Toaster />
            {children}
            {modal}
          </main>
          <Footer />
          <div id="modal-root" />
        </body>
      </html>
      </CSPostHogProvider>
      {/*</ThemeProvider>*/}
    </SessionProvider>
  );
}
