'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

export default function AdminLayoutWrapper({ 
  children, 
  header, 
  sidebar, 
  footer 
}: { 
  children: React.ReactNode, 
  header: React.ReactNode, 
  sidebar: React.ReactNode, 
  footer: React.ReactNode 
}) {
  const pathname = usePathname()
  
  // If we are on an admin route, DO NOT render the public header, sidebar, or footer.
  // Just render the children (which is the AdminLayout) taking up the full screen.
  if (pathname?.startsWith('/admin')) {
    return <main className="w-full min-h-screen">{children}</main>
  }

  // Otherwise, render the standard public layout
  return (
    <>
      {header}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6 w-full flex-1">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          {sidebar}
        </aside>
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
      {footer}
    </>
  )
}
