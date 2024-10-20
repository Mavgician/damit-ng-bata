'use client'

import { fetchUserPost } from "@/src/lib/DataServer";
import useSWR from "swr";

export default function Home() {
  const { data } = useSWR('api/user/verify', fetchUserPost, { suspense: true })

  return (
    <main>
      <h1>in admin page</h1>
    </main>
  );
}