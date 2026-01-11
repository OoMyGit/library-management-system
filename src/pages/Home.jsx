import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ROUTES, APP_NAME } from '../constants/constants-index'
import BookService from '../services/BookService'
import MemberService from '../services/MemberService'
import LoanService from '../services/LoanService'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

export default function Home() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalMembers: 0,
    activeLoans: 0,
    loading: true
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [books, members, loans] = await Promise.all([
          BookService.getAllBooks(),
          MemberService.getAllMembers(),
          LoanService.getActiveLoans()
        ])

        const availableBooks = books.filter(book => book.available_quantity > 0).length

        setStats({
          totalBooks: books.length,
          availableBooks: availableBooks,
          totalMembers: members.length,
          activeLoans: loans.length,
          loading: false
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats(prev => ({ ...prev, loading: false }))
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: '📚',
      color: 'blue'
    },
    {
      title: 'Available',
      value: stats.availableBooks,
      icon: '✓',
      color: 'green'
    },
    {
      title: 'Members',
      value: stats.totalMembers,
      icon: '👥',
      color: 'indigo'
    },
    {
      title: 'Active Loans',
      value: stats.activeLoans,
      icon: '📖',
      color: 'amber'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {APP_NAME}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Library Management System
          </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={ROUTES.CATALOG}>
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                  style={{ backgroundColor: '#ffffff', color: '#2563eb' }}
                >
                  Browse Books
                </Button>
              </Link>
            </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 -mt-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.loading ? '...' : stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 mb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="For Members">
            <ul className="space-y-2 text-gray-700">
              <li>• Browse book collection</li>
              <li>• Search by title or author</li>
              <li>• Check availability</li>
              <li>• Borrow up to 7 days</li>
            </ul>
          </Card>

          <Card title="For Staff">
            <ul className="space-y-2 text-gray-700">
              <li>• Manage loans & returns</li>
              <li>• Track overdue books</li>
              <li>• Register members</li>
              <li>• Auto due date calculation</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 mb-12">
        <Card title="How to Borrow">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Browse</h3>
              <p className="text-sm text-gray-600">Search for books</p>
            </div>
            <div>
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Visit Desk</h3>
              <p className="text-sm text-gray-600">Bring your member ID</p>
            </div>
            <div>
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Enjoy!</h3>
              <p className="text-sm text-gray-600">Return within 7 days</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
