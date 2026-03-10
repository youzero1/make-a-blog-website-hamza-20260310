'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/posts/create', label: 'Create Post', icon: '✍️' },
  ];

  return (
    <header className="bg-royal-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-crown-400 rounded-full flex items-center justify-center shadow-md group-hover:bg-crown-300 transition-colors duration-200">
              <span className="text-xl">👑</span>
            </div>
            <span className="text-2xl font-bold font-serif tracking-wide group-hover:text-crown-200 transition-colors duration-200">
              Crown Blogs
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-royal-600 text-white'
                    : 'text-royal-200 hover:bg-royal-700 hover:text-white'
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-royal-700 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden py-3 border-t border-royal-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 mb-1 ${
                  pathname === link.href
                    ? 'bg-royal-600 text-white'
                    : 'text-royal-200 hover:bg-royal-700 hover:text-white'
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
