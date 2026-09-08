'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'MASTER CATALOG', href: '/offerings', icon: 'list' },
  { name: 'CATEGORIES', href: '/categories', icon: 'category' },
  { name: 'IMPORT', href: '/import', icon: 'upload' },
  { name: 'SETTINGS', href: '/settings', icon: 'settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo/Brand */}
      <div className="px-4 py-6 bg-black">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" fill="black"/>
              <rect x="14" y="3" width="7" height="7" fill="black"/>
              <rect x="3" y="14" width="7" height="7" fill="black"/>
              <rect x="14" y="14" width="7" height="7" fill="black"/>
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-base">Offerings Pro</div>
            <div className="text-gray-400 text-[10px] uppercase tracking-wide">Enterprise Edition</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 pt-4">
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/offerings' && pathname.startsWith('/offerings'));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.icon === 'list' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                  {item.icon === 'category' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  )}
                  {item.icon === 'upload' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  )}
                  {item.icon === 'settings' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Action - View Reports */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button className="w-full py-2.5 px-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 transition-colors shadow-xs">
          View Reports
        </button>
      </div>
    </aside>
  );
}

