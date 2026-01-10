import { useState } from 'react'
import useMembers from '../hooks/useMembers'
import MemberForm from '../components/members/MemberForm'
import MemberCard from '../components/members/MemberCard'
import Button from '../components/common/Button'
import Alert from '../components/common/Alert'
import Loading from '../components/common/Loading'
import Input from '../components/common/Input'

/**
 * StaffMembers Page
 * Staff page for managing library members
 */
export default function StaffMembers() {
  const {
    members,
    loading,
    error,
    addMember,
    activateMember,
    deactivateMember,
    getMemberById,
    searchMembers,
    refresh
  } = useMembers()

  const [showForm, setShowForm] = useState(true)
  const [notification, setNotification] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, active, inactive
  const [membersWithHistory, setMembersWithHistory] = useState({})

  /**
   * Handle member registration
   */
  const handleMemberAdded = async (memberData) => {
    const result = await addMember(memberData)
    
    if (result.success) {
      setNotification({
        type: 'success',
        message: `Member registered successfully! Member Code: ${result.member.member_code}`
      })
      
      setTimeout(() => setNotification(null), 5000)
    }
    
    return result
  }

  /**
   * Handle member activation
   */
  const handleActivate = async (memberId) => {
    const result = await activateMember(memberId)
    
    if (result.success) {
      setNotification({
        type: 'success',
        message: 'Member activated successfully!'
      })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  /**
   * Handle member deactivation
   */
  const handleDeactivate = async (memberId) => {
    if (window.confirm('Are you sure you want to deactivate this member?')) {
      const result = await deactivateMember(memberId)
      
      if (result.success) {
        setNotification({
          type: 'info',
          message: 'Member deactivated. They can no longer borrow books.'
        })
        setTimeout(() => setNotification(null), 3000)
      }
    }
  }

  /**
   * Handle view member history
   */
  const handleViewHistory = async (memberId) => {
    if (!membersWithHistory[memberId]) {
      const memberData = await getMemberById(memberId)
      setMembersWithHistory(prev => ({
        ...prev,
        [memberId]: memberData
      }))
    }
  }

  /**
   * Handle search
   */
  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      await searchMembers(searchTerm)
    } else {
      refresh()
    }
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    refresh()
  }

  /**
   * Filter members by status
   */
  const getFilteredMembers = () => {
    let filtered = members

    if (filterStatus === 'active') {
      filtered = members.filter(m => m.status === 'active')
    } else if (filterStatus === 'inactive') {
      filtered = members.filter(m => m.status === 'inactive')
    }

    // Merge with history data if available
    return filtered.map(member => ({
      ...member,
      loans: membersWithHistory[member.id]?.loans || []
    }))
  }

  const filteredMembers = getFilteredMembers()

  // Calculate stats
  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    inactive: members.filter(m => m.status === 'inactive').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                👥 Member Management
              </h1>
              <p className="text-gray-600 text-lg">
                Register and manage library members
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Members</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.active}</div>
              <div className="text-sm text-gray-600">Active Members</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-gray-600 mb-1">{stats.inactive}</div>
              <div className="text-sm text-gray-600">Inactive Members</div>
            </div>
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

        {/* Member Form */}
        {showForm && (
          <div className="mb-8">
            <MemberForm onMemberAdded={handleMemberAdded} />
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Members
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, or member code..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-48">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status Filter
                </label>
                <select
                  id="status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Members</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </Button>
              
              {searchTerm && (
                <Button type="button" variant="outline" onClick={handleClearSearch}>
                  Clear Search
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Members Grid */}
        {loading ? (
          <Loading text="Loading members..." />
        ) : filteredMembers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Members Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'No members registered yet'}
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredMembers.length}</span> member{filteredMembers.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onActivate={handleActivate}
                  onDeactivate={handleDeactivate}
                  onViewHistory={handleViewHistory}
                />
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Member Management Guide
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Registering a New Member:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Fill in member's full name</li>
                <li>Enter valid email address</li>
                <li>Add phone number (optional)</li>
                <li>Click "Register Member"</li>
                <li>Member code is auto-generated (M-YYYY-XXX)</li>
                <li>Member is active by default</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Managing Members:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Use search to find specific members</li>
                <li>Filter by active/inactive status</li>
                <li>View loan history for each member</li>
                <li>Deactivate members who can't borrow</li>
                <li>Reactivate members when needed</li>
                <li>Each member has a unique code</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Only active members can borrow books. Inactive members will not appear in the loan form dropdown.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
