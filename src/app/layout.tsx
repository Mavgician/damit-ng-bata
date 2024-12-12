import type { Metadata } from "next";

import { FirebaseNextJSProvider } from "firebase-nextjs/client/auth";
import { Analytics } from "@vercel/analytics/react"

import 'react-loading-skeleton/dist/skeleton.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: "Damit ng bata",
  description: "A clothing store for kids",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <FirebaseNextJSProvider>
        <body>
          {children}
          <Analytics/>
        </body>
      </FirebaseNextJSProvider>
    </html>
  );
}