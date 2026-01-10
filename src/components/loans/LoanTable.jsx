import { useState } from 'react'
import Button from '../common/Button'
import { LOAN_STATUS } from '../../constants/constants-index'

/**
 * LoanTable Component
 * Displays loan records in a table format
 */
export default function LoanTable({ loans, loading, onReturn, filterStatus, onFilterChange }) {
  const [returningLoanId, setReturningLoanId] = useState(null)

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const badges = {
      [LOAN_STATUS.BORROWED]: {
        class: 'bg-yellow-100 text-yellow-800',
        icon: '📖',
        label: 'Borrowed'
      },
      [LOAN_STATUS.RETURNED]: {
        class: 'bg-green-100 text-green-800',
        icon: '✓',
        label: 'Returned'
      },
      [LOAN_STATUS.OVERDUE]: {
        class: 'bg-red-100 text-red-800',
        icon: '⚠',
        label: 'Overdue'
      }
    }

    const badge = badges[status] || badges[LOAN_STATUS.BORROWED]

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
        <span className="mr-1">{badge.icon}</span>
        {badge.label}
      </span>
    )
  }

  const handleReturn = async (loanId) => {
    if (window.confirm('Are you sure you want to mark this book as returned?')) {
      setReturningLoanId(loanId)
      await onReturn(loanId)
      setReturningLoanId(null)
    }
  }

  const isOverdue = (dueDate, returnDate, status) => {
    if (returnDate || status === LOAN_STATUS.RETURNED) return false
    return new Date(dueDate) < new Date()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Filter Tabs */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Loans
          </button>
          <button
            onClick={() => onFilterChange(LOAN_STATUS.BORROWED)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === LOAN_STATUS.BORROWED
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Borrowed
          </button>
          <button
            onClick={() => onFilterChange(LOAN_STATUS.RETURNED)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === LOAN_STATUS.RETURNED
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Returned
          </button>
          <button
            onClick={() => onFilterChange(LOAN_STATUS.OVERDUE)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === LOAN_STATUS.OVERDUE
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Overdue
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loan Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Return Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium">No loans found</p>
                    <p className="text-sm">Loans will appear here once books are borrowed</p>
                  </div>
                </td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr 
                  key={loan.id} 
                  className={`hover:bg-gray-50 ${
                    isOverdue(loan.due_date, loan.return_date, loan.status) ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {loan.members?.name || 'Unknown'}
                      </div>
                      <div className="text-gray-500">
                        {loan.members?.member_code || '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 max-w-xs truncate">
                        {loan.books?.title || 'Unknown'}
                      </div>
                      <div className="text-gray-500">
                        by {loan.books?.author || '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(loan.loan_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(loan.due_date)}
                    </div>
                    {isOverdue(loan.due_date, loan.return_date, loan.status) && (
                      <div className="text-xs text-red-600 font-semibold">
                        Overdue!
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(loan.return_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(loan.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {loan.status === LOAN_STATUS.BORROWED && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleReturn(loan.id)}
                        disabled={returningLoanId === loan.id}
                      >
                        {returningLoanId === loan.id ? 'Processing...' : 'Return'}
                      </Button>
                    )}
                    {loan.status === LOAN_STATUS.OVERDUE && (
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => handleReturn(loan.id)}
                        disabled={returningLoanId === loan.id}
                      >
                        {returningLoanId === loan.id ? 'Processing...' : 'Return (Late)'}
                      </Button>
                    )}
                    {loan.status === LOAN_STATUS.RETURNED && (
                      <span className="text-gray-400 text-xs">Completed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Results Counter */}
      {loans.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{loans.length}</span> loan{loans.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
