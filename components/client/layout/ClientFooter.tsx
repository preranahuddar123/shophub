import React from 'react';
import Link from 'next/link';

export default function ClientFooter() {
  return (
    <footer className="w-full mt-14 pt-6 pb-12 border-t border-[#E8E4DA] text-xs text-gray-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Copyright */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-gray-900">HubInterior</span>
          <span>© 2024 HubInterior Premium Portal. All rights reserved.</span>
        </div>

        {/* Right Legal Links */}
        <div className="flex items-center gap-6 font-medium text-gray-600">
          <Link href="/legal" className="hover:text-gray-900 transition-colors">
            Legal
          </Link>
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/help" className="hover:text-gray-900 transition-colors">
            Help Center
          </Link>
          <Link href="/terms" className="hover:text-gray-900 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
