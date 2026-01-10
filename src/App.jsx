import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { ROUTES } from './constants/constants-index'

// Pages
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import StaffLoans from './pages/StaffLoans'
import StaffMembers from './pages/StaffMembers'
import TestConnection from './pages/TestConnection'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.CATALOG} element={<Catalog />} />
          <Route path={ROUTES.STAFF_LOANS} element={<StaffLoans />} />
          <Route path={ROUTES.STAFF_MEMBERS} element={<StaffMembers />} />
          <Route path="/test" element={<TestConnection />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App
