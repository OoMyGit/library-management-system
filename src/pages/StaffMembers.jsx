import { useState } from 'react'
import useMembers from '../hooks/useMembers'
import MemberForm from '../components/members/MemberForm'
import MemberCard from '../components/members/MemberCard'
import Button from '../components/common/Button'
import Alert from '../components/common/Alert'
import Loading from '../components/common/Loading'

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
  const [filterStatus, setFilterStatus] = useState('all')
  const [membersWithHistory, setMembersWithHistory] = useState({})

  const handleMemberAdded = async (memberData) => {
    const result = await addMember(memberData)
    
    if (result.success) {
      setNotification({
        type: 'success',
        message: `Member registered! Code: ${result.member.member_code}`
      })
      setTimeout(() => setNotification(null), 4000)
    }
    
    return result
  }

  const handleActivate = async (memberId) => {
    const result = await activateMember(memberId)
    
    if (result.success) {
      setNotification({
        type: 'success',
        message: 'Member activated'
      })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleDeactivate = async (memberId) => {
    if (window.confirm('Deactivate this member?')) {
      const result = await deactivateMember(memberId)
      
      if (result.success) {
        setNotification({
          type: 'info',
          message: 'Member deactivated'
        })
        setTimeout(() => setNotification(null), 3000)
      }
    }
  }

  const handleViewHistory = async (memberId) => {
    if (!membersWithHistory[memberId]) {
      const memberData = await getMemberById(memberId)
      setMembersWithHistory(prev => ({
        ...prev,
        [memberId]: memberData
      }))
    }
  }

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

  const getFilteredMembers = () => {
    let filtered = members

    if (filterStatus === 'active') {
      filtered = members.filter(m => m.status === 'active')
    } else if (filterStatus === 'inactive') {
      filtered = members.filter(m => m.status === 'inactive')
    }

    return filtered.map(member => ({
      ...member,
      loans: membersWithHistory[member.id]?.loans || []
    }))
  }

  const filteredMembers = getFilteredMembers()

  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    inactive: members.filter(m => m.status === 'inactive').length
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                👥 Member Management
              </h1>
              <p className="text-gray-600">
                Register and manage members
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Hide' : 'Show'} Form
              </Button>
              <Button variant="ghost" onClick={refresh}>
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-gray-600">Active</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
              <div className="text-xs text-gray-600">Inactive</div>
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
            <MemberForm onMemberAdded={handleMemberAdded} />
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or code..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <Button type="submit" variant="primary">
              Search
            </Button>
            
            {searchTerm && (
              <Button type="button" variant="outline" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </form>
        </div>

        {/* Grid */}
        {loading ? (
          <Loading text="Loading members..." />
        ) : filteredMembers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Members Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try different search terms' : 'No members registered yet'}
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing <strong>{filteredMembers.length}</strong> member{filteredMembers.length !== 1 ? 's' : ''}
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
      </div>
    </div>
  )
}
