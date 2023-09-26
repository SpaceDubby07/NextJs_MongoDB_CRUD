/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  router.push('/posts');

  return <div className="mx-auto max-w-screen-lg p-4"></div>;
}
