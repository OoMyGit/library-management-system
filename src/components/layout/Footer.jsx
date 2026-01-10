import { APP_NAME } from '../../constants/constants-index'

/**
 * Footer Component
 * Application footer with credits
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{APP_NAME}</h3>
            <p className="text-gray-300 text-sm">
              Modern library management system built with React, Supabase, and Tailwind CSS.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/catalog" className="hover:text-white transition-colors">
                  Book Catalog
                </a>
              </li>
              <li>
                <a href="/staff/loans" className="hover:text-white transition-colors">
                  Loan Management
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Project Info</h3>
            <p className="text-gray-300 text-sm mb-2">
              Tugas Praktek Programmer Certification
            </p>
            <p className="text-gray-300 text-sm">
              Built with modern web technologies
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
