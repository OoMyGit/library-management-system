import { useState } from 'react'
import useLoans from '../hooks/useLoans'
import LoanForm from '../components/loans/LoanForm'
import LoanTable from '../components/loans/LoanTable'
import Button from '../components/common/Button'
import Alert from '../components/common/Alert'
import Card from '../components/common/Card'

export default function StaffLoans() {
  const {
    loans,
    loading,
    error,
    filterStatus,
    setFilterStatus,
    createLoan,
    returnBook,
    updateOverdueStatus,
    refresh
  } = useLoans()

  const [showForm, setShowForm] = useState(true)
  const [notification, setNotification] = useState(null)

  const handleLoanCreated = async (memberId, bookId, notes) => {
    const result = await createLoan(memberId, bookId, notes)
    
    if (result.success) {
      setNotification({
        type: 'success',
        message: 'Book borrowed successfully!'
      })
      setTimeout(() => setNotification(null), 4000)
    }
    
    return result
  }

  const handleReturn = async (loanId) => {
    const result = await returnBook(loanId)
    
    if (result.success) {
      setNotification({
        type: 'success',
        message: 'Book returned successfully!'
      })
      setTimeout(() => setNotification(null), 4000)
    } else {
      setNotification({
        type: 'error',
        message: result.error || 'Failed to return book'
      })
    }
  }

  const handleUpdateOverdue = async () => {
    const count = await updateOverdueStatus()
    setNotification({
      type: 'info',
      message: `${count} loan(s) marked as overdue`
    })
    setTimeout(() => setNotification(null), 4000)
  }

  const stats = {
    total: loans.length,
    borrowed: loans.filter(l => l.status === 'borrowed').length,
    returned: loans.filter(l => l.status === 'returned').length,
    overdue: loans.filter(l => l.status === 'overdue').length
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📋 Loan Management
              </h1>
              <p className="text-gray-600">
                Manage book borrowing and returns
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowForm(!showForm)}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                {showForm ? 'Hide' : 'Show'} Form
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={refresh}
                className="text-gray-700 hover:bg-gray-100"
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats - FIX: Use INLINE STYLE to force colors! */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total - Blue */}
            <div className="bg-blue-600 rounded-lg shadow-md p-6 text-center" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
              <div className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                {stats.total}
              </div>
              <div className="text-xs" style={{ color: '#dbeafe' }}>
                Total
              </div>
            </div>

            {/* Borrowed - Amber */}
            <div className="bg-amber-600 rounded-lg shadow-md p-6 text-center" style={{ backgroundColor: '#d97706', color: '#ffffff' }}>
              <div className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                {stats.borrowed}
              </div>
              <div className="text-xs" style={{ color: '#fef3c7' }}>
                Borrowed
              </div>
            </div>

            {/* Returned - Green */}
            <div className="bg-green-600 rounded-lg shadow-md p-6 text-center" style={{ backgroundColor: '#16a34a', color: '#ffffff' }}>
              <div className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                {stats.returned}
              </div>
              <div className="text-xs" style={{ color: '#dcfce7' }}>
                Returned
              </div>
            </div>

            {/* Overdue - Red */}
            <div className="bg-red-600 rounded-lg shadow-md p-6 text-center" style={{ backgroundColor: '#dc2626', color: '#ffffff' }}>
              <div className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                {stats.overdue}
              </div>
              <div className="text-xs" style={{ color: '#fee2e2' }}>
                Overdue
              </div>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <Alert
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
            className="mb-6"
          />
        )}

        {/* Error */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={refresh}
            className="mb-6"
          />
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-6">
            <LoanForm onLoanCreated={handleLoanCreated} />
          </div>
        )}

        {/* Actions */}
        <div className="mb-6 flex items-center gap-3">
          <Button 
            variant="warning" 
            onClick={handleUpdateOverdue}
            className="bg-amber-600 text-white hover:bg-amber-700"
            style={{ backgroundColor: '#d97706', color: '#ffffff' }}
          >
            Update Overdue
          </Button>
          
          <div className="text-sm text-gray-600 ml-auto bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
            Due date: <strong className="text-blue-700">7 days</strong> from loan date
          </div>
        </div>

        {/* Table */}
        <LoanTable
          loans={loans}
          loading={loading}
          onReturn={handleReturn}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />
      </div>
    </div>
  )
}
