import { Link, useLocation } from 'react-router-dom'
import { APP_NAME, ROUTES } from '../../constants/constants-index'

/**
 * Navbar Component with Member/Staff Mode Toggle
 */
export default function Navbar({ userMode, onToggleMode }) {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinkClass = (path) => {
    const baseClass = "px-4 py-2 rounded-md font-medium transition-colors"
    return isActive(path)
      ? `${baseClass} bg-blue-600 text-white`
      : `${baseClass} text-gray-700 hover:bg-blue-50 hover:text-blue-600`
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white rounded-lg p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
          </Link>

          {/* Navigation Links + Toggle */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Always visible */}
            <Link to={ROUTES.HOME} className={navLinkClass(ROUTES.HOME)}>
              Home
            </Link>
            <Link to={ROUTES.CATALOG} className={navLinkClass(ROUTES.CATALOG)}>
              Book Catalog
            </Link>

            {/* Only visible in Staff Mode */}
            {userMode === 'staff' && (
              <>
                <Link to={ROUTES.STAFF_LOANS} className={navLinkClass(ROUTES.STAFF_LOANS)}>
                  Loans
                </Link>
                <Link to={ROUTES.STAFF_MEMBERS} className={navLinkClass(ROUTES.STAFF_MEMBERS)}>
                  Members
                </Link>
              </>
            )}

            {/* Divider */}
            <div className="h-8 w-px bg-gray-300 mx-2"></div>

            {/* Mode Toggle Button */}
            <button
              onClick={onToggleMode}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all
                ${userMode === 'member' 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }
              `}
              title={`Switch to ${userMode === 'member' ? 'Staff' : 'Member'} Mode`}
            >
              {/* Icon */}
              <span className="text-xl">
                {userMode === 'member' ? '👤' : '💼'}
              </span>
              
              {/* Mode Label */}
              <span className="font-semibold">
                {userMode === 'member' ? 'Member' : 'Staff'} Mode
              </span>

              {/* Switch Icon */}
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
