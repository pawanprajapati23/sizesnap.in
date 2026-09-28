// app/admin/layout.tsx
import '@/app/globals.css';
import { Navbar } from '@/components/Navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-[1600px] mx-auto p-6" id="admin-main">
        {children}
      </main>
    </div>
  );
}
