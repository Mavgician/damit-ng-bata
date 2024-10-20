'use client'

import { fetchUserPost } from "@/src/lib/DataServer";
import { getUserCS } from "firebase-nextjs/client/auth";
import { LogoutButton } from 'firebase-nextjs/client/components';
import useSWR from "swr";

export default function Home() {
  const { data } = useSWR('api/user/verify', fetchUserPost, { suspense: true })

  

  return (
    <main>
      <h1>in Landing Page</h1>
    </main>
  );
}