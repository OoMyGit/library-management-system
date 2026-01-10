import { useState } from 'react'
import Card from '../common/Card'
import Button from '../common/Button'
import { MEMBER_STATUS } from '../../constants/constants-index'

/**
 * MemberCard Component
 * Displays member information and loan history
 */
export default function MemberCard({ member, onActivate, onDeactivate, onViewHistory }) {
  const [showHistory, setShowHistory] = useState(false)
  const [loading, setLoading] = useState(false)

  const isActive = member.status === MEMBER_STATUS.ACTIVE

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleToggleStatus = async () => {
    setLoading(true)
    if (isActive) {
      await onDeactivate(member.id)
    } else {
      await onActivate(member.id)
    }
    setLoading(false)
  }

  const handleViewHistory = async () => {
    if (!showHistory && onViewHistory) {
      await onViewHistory(member.id)
    }
    setShowHistory(!showHistory)
  }

  return (
    <Card className="h-full hover:shadow-xl transition-shadow">
      <div className="flex flex-col h-full">
        {/* Member Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Member Code Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 mb-2">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              {member.member_code}
            </div>

            {/* Name */}
            <h3 className="font-bold text-xl text-gray-900 mb-2">
              {member.name}
            </h3>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {member.email}
              </div>
              
              {member.phone && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {member.phone}
                </div>
              )}

              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined: {formatDate(member.join_date)}
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {isActive ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                Inactive
              </span>
            )}
          </div>
        </div>

        {/* Loan Statistics (if available) */}
        {member.loans && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {member.loans.length}
              </div>
              <div className="text-xs text-blue-800">Total Loans</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {member.loans.filter(l => l.status === 'borrowed').length}
              </div>
              <div className="text-xs text-yellow-800">Active Loans</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-4 border-t border-gray-200 space-y-2">
          {onViewHistory && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewHistory}
              className="w-full"
            >
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {showHistory ? 'Hide' : 'View'} Loan History
            </Button>
          )}

          {(onActivate || onDeactivate) && (
            <Button
              variant={isActive ? 'secondary' : 'success'}
              size="sm"
              onClick={handleToggleStatus}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Processing...' : isActive ? 'Deactivate Member' : 'Activate Member'}
            </Button>
          )}
        </div>

        {/* Loan History (collapsible) */}
        {showHistory && member.loans && member.loans.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Loan History</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {member.loans.map((loan) => (
                <div key={loan.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="font-medium text-gray-900 mb-1">
                    {loan.books?.title || 'Unknown Book'}
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Loan: {formatDate(loan.loan_date)}</div>
                    <div>Due: {formatDate(loan.due_date)}</div>
                    {loan.return_date && (
                      <div>Returned: {formatDate(loan.return_date)}</div>
                    )}
                    <div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        loan.status === 'borrowed' ? 'bg-yellow-100 text-yellow-800' :
                        loan.status === 'returned' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showHistory && member.loans && member.loans.length === 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
            No loan history yet
          </div>
        )}
      </div>
    </Card>
  )
}
