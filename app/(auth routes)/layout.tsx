'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return children;
}
