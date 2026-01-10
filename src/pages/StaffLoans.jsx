import { useState } from 'react'
import useLoans from '../hooks/useLoans'
import LoanForm from '../components/loans/LoanForm'
import LoanTable from '../components/loans/LoanTable'
import Button from '../components/common/Button'
import Alert from '../components/common/Alert'
import Card from '../components/common/Card'

/**
 * StaffLoans Page
 * Staff page for managing book loans (borrow & return)
 */
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

  /**
   * Handle loan creation
   */
  const handleLoanCreated = async (memberId, bookId, notes) => {
    const result = await createLoan(memberId, bookId, notes)
    
    if (result.success) {
      setNotification({
        type: 'success',
        message: 'Book borrowed successfully! The book will be due in 7 days.'
      })
      
      // Hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000)
    }
    
    return result
  }

  /**
   * Handle book return
   */
  const handleReturn = async (loanId) => {
    const result = await returnBook(loanId)
    
    if (result.success) {
      setNotification({
        type: 'success',
        message: 'Book returned successfully! Inventory updated.'
      })
      
      setTimeout(() => setNotification(null), 5000)
    } else {
      setNotification({
        type: 'error',
        message: result.error || 'Failed to return book'
      })
    }
  }

  /**
   * Handle overdue update
   */
  const handleUpdateOverdue = async () => {
    const count = await updateOverdueStatus()
    setNotification({
      type: 'info',
      message: `Overdue status updated. ${count} loan(s) marked as overdue.`
    })
    setTimeout(() => setNotification(null), 5000)
  }

  // Calculate stats
  const stats = {
    total: loans.length,
    borrowed: loans.filter(l => l.status === 'borrowed').length,
    returned: loans.filter(l => l.status === 'returned').length,
    overdue: loans.filter(l => l.status === 'overdue').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📋 Loan Management
              </h1>
              <p className="text-gray-600 text-lg">
                Manage book borrowing and returns
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Hide Form' : 'Show Form'}
              </Button>
              <Button
                variant="ghost"
                onClick={refresh}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="text-3xl font-bold mb-1">{stats.total}</div>
              <div className="text-sm text-blue-100">Total Loans</div>
            </Card>
            <Card className="text-center bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <div className="text-3xl font-bold mb-1">{stats.borrowed}</div>
              <div className="text-sm text-yellow-100">Currently Borrowed</div>
            </Card>
            <Card className="text-center bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="text-3xl font-bold mb-1">{stats.returned}</div>
              <div className="text-sm text-green-100">Returned</div>
            </Card>
            <Card className="text-center bg-gradient-to-br from-red-500 to-red-600 text-white">
              <div className="text-3xl font-bold mb-1">{stats.overdue}</div>
              <div className="text-sm text-red-100">Overdue</div>
            </Card>
          </div>
        </div>

        {/* Global Notification */}
        {notification && (
          <Alert
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
            className="mb-6"
          />
        )}

        {/* Global Error */}
        {error && (
          <Alert
            type="error"
            message={`Error: ${error}`}
            onClose={refresh}
            className="mb-6"
          />
        )}

        {/* Loan Form */}
        {showForm && (
          <div className="mb-8">
            <LoanForm onLoanCreated={handleLoanCreated} />
          </div>
        )}

        {/* Actions */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Button
            variant="warning"
            onClick={handleUpdateOverdue}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Update Overdue Status
          </Button>
          
          <div className="flex-grow"></div>
          
          <div className="text-sm text-gray-600 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Books are automatically due <strong className="mx-1">7 days</strong> after loan date
          </div>
        </div>

        {/* Loans Table */}
        <LoanTable
          loans={loans}
          loading={loading}
          onReturn={handleReturn}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />

        {/* Help Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Use
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Borrowing a Book:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Select an active member from the dropdown</li>
                <li>Choose an available book</li>
                <li>Add optional notes</li>
                <li>Click "Borrow Book"</li>
                <li>Due date is automatically set to 7 days from today</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Returning a Book:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Find the loan in the table below</li>
                <li>Click the "Return" button</li>
                <li>Confirm the return</li>
                <li>Book inventory is automatically updated</li>
                <li>Loan status changes to "Returned"</li>
              </ol>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Click "Update Overdue Status" to automatically mark loans as overdue if they exceed the due date.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
