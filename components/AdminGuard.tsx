'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // If not logged in and not already on the login page, redirect to login
      if (!currentUser && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      
      // If logged in and on the login page, redirect to admin dashboard
      if (currentUser && pathname === '/admin/login') {
        router.push('/admin');
      }
    });
    
    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm p-3 mb-4 animate-pulse">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img src="/logo.png" alt="Loading" className="w-full h-full object-contain opacity-50" />
        </div>
        <div className="text-gray-500 font-medium">Verifying access...</div>
      </div>
    );
  }

  // Allow rendering if user is authenticated OR if they are currently on the login page
  if (user || pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Fallback (should be caught by the redirect anyway)
  return null;
}
