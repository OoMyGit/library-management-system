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
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {APP_NAME} by Kwandy Chandra.
          </p>
        </div>
      </div>
    </footer>
  )
}
