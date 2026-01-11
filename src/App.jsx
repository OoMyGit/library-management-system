import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { ROUTES } from './constants/constants-index'

// Pages
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import StaffLoans from './pages/StaffLoans'
import StaffMembers from './pages/StaffMembers'

function App() {
  // Mode state: 'member' or 'staff'
  const [userMode, setUserMode] = useState(() => {
    // Load from localStorage or default to 'member'
    const savedMode = localStorage.getItem('userMode')
    return savedMode || 'member'
  })

  // Save to localStorage when mode changes
  useEffect(() => {
    localStorage.setItem('userMode', userMode)
  }, [userMode])

  // Toggle function
  const toggleMode = () => {
    setUserMode(prev => prev === 'member' ? 'staff' : 'member')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar userMode={userMode} onToggleMode={toggleMode} />
      
      <main className="flex-grow">
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.CATALOG} element={<Catalog />} />
          <Route path={ROUTES.STAFF_LOANS} element={<StaffLoans />} />
          <Route path={ROUTES.STAFF_MEMBERS} element={<StaffMembers />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App
