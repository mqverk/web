'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Coffee } from 'lucide-react';
import { SwitchTheme } from './themeSwitch';

const mainNavItems = [
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
];

const dropdownNavItems = [
  { name: 'Guestbook', href: '/guestbook' },
  { name: 'Stats', href: '/stats' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDesktopDropdownOpen(false);
      }
    }

    if (isDesktopDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDesktopDropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-4 py-6 pointer-events-none">
      {/* Pill-shaped navbar container */}
      <div className="pointer-events-auto flex items-center justify-between px-8 py-4 bg-background/40 backdrop-blur-md border border-border/20 rounded-full shadow-lg hover:border-border/40 transition-all duration-300">
        {/* Left logo */}
        <Link
          className="relative transition-all duration-300 hover:rotate-12"
          href="/"
          aria-label="Home"
        >
          <Coffee
            className={`w-4 h-4 transition-colors duration-300 ${isHomePage ? 'text-orange-500' : 'text-foreground hover:text-foreground/60'}`}
          />
        </Link>

        {/* Desktop nav links + theme switch */}
        <div className="hidden md:flex items-center space-x-1 mx-4">
          {/* Main Nav Links */}
          {mainNavItems.map(({ name, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                data-href={href}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  isActive
                    ? 'text-foreground bg-foreground/10'
                    : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                {name}
              </Link>
            );
          })}

          {/* Desktop dropdown for additional items */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
              className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 flex items-center ${isDesktopDropdownOpen ? 'text-foreground bg-foreground/10' : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'}`}
              aria-label="More options"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isDesktopDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isDesktopDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-background/40 backdrop-blur-md border border-border/20 rounded-xl p-4 shadow-lg z-20 min-w-[140px]"
              >
                {/* Arrow pointer */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-border/20" />
                {dropdownNavItems.map(({ name, href }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      data-href={href}
                      className={`block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'text-foreground bg-foreground/10'
                          : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                      }`}
                      onClick={() => setIsDesktopDropdownOpen(false)}
                    >
                      {name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <SwitchTheme />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-4 pointer-events-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 transition-transform"
            aria-label="Toggle menu"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          <SwitchTheme />
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-background/40 backdrop-blur-md border border-border/20 rounded-xl p-3 shadow-lg z-20">
            {[...mainNavItems, ...dropdownNavItems].map(({ name, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  data-href={href}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'text-foreground bg-foreground/10'
                      : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
