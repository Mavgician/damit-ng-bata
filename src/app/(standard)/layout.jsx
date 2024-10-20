'use client'

import { Navigationbar } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function Layout({children}) {
  return (
    <>
      <Navigationbar />
        {children}
      <Footer/>
    </>
  );
}