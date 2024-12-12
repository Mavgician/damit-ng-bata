'use client'

import { Navigationbar } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Analytics } from "@vercel/analytics/react"

export default function Layout({children}) {
  return (
    <>
      <Navigationbar />
        {children}
        <Analytics/>
      <Footer/>
    </>
  );
}