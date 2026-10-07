'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { NAV_MENUS } from '@/data/tools';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleDropdown = (label: string) => {
    setActiveDropdown((prev) => (prev === label ? null : label));
  };

  const closeAllMenus = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <>
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] select-none" ref={navRef}>
      <div className="mx-auto flex h-[64px] max-w-full items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={closeAllMenus}
          className="flex items-center gap-2.5 px-1 py-1 rounded-lg group focus-visible:outline-2 focus-visible:outline-[#414FA8] transition-all"
          aria-label="SizeSnap Homepage"
        >
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
            <Image
              src="/logo.png"
              alt="SizeSnap Logo"
              width={32}
              height={32}
              priority className="h-full w-full object-contain group-hover:scale-105 transition-transform"
            />
          </div>
          <span className="text-[21px] font-extrabold tracking-tight text-gray-900 select-none">
            sizesnap
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
          {NAV_MENUS.map((menu) => {
            const hasSubmenu = Boolean(menu.items && menu.items.length > 0);
            const isOpen = activeDropdown === menu.label;

            if (!hasSubmenu) {
              return (
                <Link
                  key={menu.label}
                  href={menu.href || '#'}
                  className="px-3.5 py-2 text-[14px] font-medium text-gray-700 hover:text-[#414FA8] hover:bg-gray-50 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-[#414FA8]"
                >
                  {menu.label}
                </Link>
              );
            }

            return (
              <div
                key={menu.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(menu.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => toggleDropdown(menu.label)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-[14px] font-medium rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-[#414FA8] ${
                    isOpen ? 'bg-[#EEF1FB] text-[#414FA8]' : 'text-gray-700 hover:text-[#414FA8] hover:bg-gray-50'
                  }`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  <span>{menu.label}</span>
                  {menu.label === 'Govt Exams' && (
                    <span className="text-[10px] font-bold bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full leading-tight">
                      NEW
                    </span>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-150 ${
                      isOpen ? 'transform rotate-180 text-[#414FA8]' : 'text-gray-500'
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div
                    className="absolute left-0 mt-1 w-64 rounded-xl bg-white py-1.5 shadow-xl border border-gray-200 z-50 animate-in fade-in zoom-in-95 duration-100"
                    role="menu"
                  >
                    <div className="px-3.5 py-2 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                      <span>{menu.label}</span>
                      {menu.label === 'Govt Exams' && (
                        <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                          Official Limits
                        </span>
                      )}
                    </div>
                    {menu.items?.map((item) => (
                      <Link
                        key={item.slug}
                        href={item.href || `/tools/${item.slug}`}
                        onClick={closeAllMenus}
                        className="block px-3.5 py-2 text-[13px] text-gray-700 hover:bg-[#EEF1FB] hover:text-[#414FA8] font-medium transition-colors"
                        role="menuitem"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile Hamburger / Toggle Button */}
        <div className="flex lg:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-[#414FA8] transition-colors"
            aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-gray-800" /> : <Menu className="h-6 w-6 text-gray-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[64px] bottom-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity">
          <div className="flex flex-col h-full bg-[#FAFAFA] border-t border-gray-200 shadow-2xl overflow-y-auto max-w-sm ml-auto sm:max-w-md w-full">
            {/* Clean Mobile Header Banner - Removed the duplicate X button */}
            <div className="px-5 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-gray-900">Quick Navigation</p>
                <p className="text-xs text-gray-500">Tap any tool to open immediately</p>
              </div>
              <span className="text-[11px] font-semibold text-[#414FA8] bg-[#EEF1FB] px-2 py-0.5 rounded-full">
                All Tools Free
              </span>
            </div>

            <div className="p-4 space-y-4 flex-1">
              {NAV_MENUS.map((menu) => (
                <div key={menu.label} className="bg-white rounded-xl border border-gray-200/80 p-3.5 shadow-xs">
                  <div className="font-bold text-xs text-[#414FA8] uppercase tracking-wider mb-2.5 flex items-center justify-between border-b pb-2 border-gray-100">
                    <span>{menu.label}</span>
                    {menu.href && (
                      <Link
                        href={menu.href}
                        onClick={closeAllMenus}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium capitalize"
                      >
                        View all <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                  {menu.items && menu.items.length > 0 && (
                    <div className="grid grid-cols-1 gap-1">
                      {menu.items.map((item) => (
                        <Link
                          key={item.slug}
                          href={item.href || `/tools/${item.slug}`}
                          onClick={closeAllMenus}
                          className="px-2.5 py-2 text-[13px] font-medium text-gray-700 hover:bg-[#EEF1FB] hover:text-[#414FA8] rounded-lg transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-200 text-center text-xs text-gray-400 font-semibold tracking-wider">
              SIZESNAP • 100% PRIVATE CLIENT-SIDE
            </div>
          </div>
        </div>
      )}
    </header>
    {/* Global Desktop Ad Banner (728x90) */}
    <div className="hidden lg:flex w-full justify-center py-4 bg-[#F5F5F7] border-b border-gray-200/50">
      <AdsterraAd dataKey="3bd154ece61c60859c2b8242ae85b927" width={728} height={90} />
    </div>
    </>
  );
}
