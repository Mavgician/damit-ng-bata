import type { Metadata } from "next";

import { FirebaseNextJSProvider } from "firebase-nextjs/client/auth";

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
        </body>
      </FirebaseNextJSProvider>
    </html>
  );
}