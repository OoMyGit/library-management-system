import { useState, useEffect } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import Card from '../common/Card'
import Alert from '../common/Alert'
import BookService from '../../services/BookService'
import MemberService from '../../services/MemberService'
import { LOAN_DURATION_DAYS } from '../../constants/constants-index'

/**
 * LoanForm Component
 * Form for staff to create new book loans
 */
export default function LoanForm({ onLoanCreated }) {
  const [formData, setFormData] = useState({
    memberId: '',
    bookId: '',
    notes: ''
  })
  
  const [members, setMembers] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)

  // Fetch active members and available books
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [membersData, booksData] = await Promise.all([
        MemberService.getActiveMembers(),
        BookService.getBooks(true) // Only available books
      ])
      setMembers(membersData)
      setBooks(booksData)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load members and books')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Update selected book or member
    if (name === 'bookId') {
      const book = books.find(b => b.id === value)
      setSelectedBook(book)
    }
    if (name === 'memberId') {
      const member = members.find(m => m.id === value)
      setSelectedMember(member)
    }
  }

  const calculateDueDate = () => {
    const today = new Date()
    const dueDate = new Date(today)
    dueDate.setDate(dueDate.getDate() + LOAN_DURATION_DAYS)
    return dueDate.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.memberId || !formData.bookId) {
      setError('Please select both member and book')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Call parent component's onLoanCreated function
      const result = await onLoanCreated(
        formData.memberId,
        formData.bookId,
        formData.notes
      )

      if (result.success) {
        setSuccess(`Book successfully borrowed! Due date: ${calculateDueDate()}`)
        
        // Reset form
        setFormData({
          memberId: '',
          bookId: '',
          notes: ''
        })
        setSelectedBook(null)
        setSelectedMember(null)

        // Refresh available books
        setTimeout(() => {
          fetchData()
          setSuccess(null)
        }, 3000)
      } else {
        setError(result.error || 'Failed to create loan')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      memberId: '',
      bookId: '',
      notes: ''
    })
    setSelectedBook(null)
    setSelectedMember(null)
    setError(null)
    setSuccess(null)
  }

  return (
    <Card title="Borrow Book" subtitle="Create a new loan transaction">
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} />
      )}
      
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Member Selection */}
        <div>
          <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 mb-2">
            Select Member <span className="text-red-500">*</span>
          </label>
          <select
            id="memberId"
            name="memberId"
            value={formData.memberId}
            onChange={handleChange}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Choose a member --</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.member_code} - {member.name} ({member.email})
              </option>
            ))}
          </select>
          
          {selectedMember && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
              <p className="text-blue-900">
                <strong>Selected:</strong> {selectedMember.name}
                <br />
                <strong>Code:</strong> {selectedMember.member_code}
                <br />
                <strong>Email:</strong> {selectedMember.email}
              </p>
            </div>
          )}
        </div>

        {/* Book Selection */}
        <div>
          <label htmlFor="bookId" className="block text-sm font-medium text-gray-700 mb-2">
            Select Book <span className="text-red-500">*</span>
          </label>
          <select
            id="bookId"
            name="bookId"
            value={formData.bookId}
            onChange={handleChange}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Choose a book --</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author} (Available: {book.available_quantity})
              </option>
            ))}
          </select>

          {selectedBook && (
            <div className="mt-2 p-3 bg-green-50 rounded-lg text-sm">
              <p className="text-green-900">
                <strong>Title:</strong> {selectedBook.title}
                <br />
                <strong>Author:</strong> {selectedBook.author}
                <br />
                <strong>Available:</strong> {selectedBook.available_quantity} of {selectedBook.stock_quantity}
                <br />
                <strong>ISBN:</strong> {selectedBook.isbn}
              </p>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <Input
            label="Notes (Optional)"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any notes about this loan..."
            type="text"
          />
        </div>

        {/* Loan Info */}
        {formData.memberId && formData.bookId && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Loan Information</h4>
            <div className="space-y-1 text-sm text-purple-800">
              <p>
                <strong>Loan Date:</strong> {new Date().toLocaleDateString('id-ID')}
              </p>
              <p>
                <strong>Due Date:</strong> {calculateDueDate()} ({LOAN_DURATION_DAYS} days)
              </p>
              <p className="mt-2 text-xs text-purple-600">
                The book must be returned within {LOAN_DURATION_DAYS} days
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !formData.memberId || !formData.bookId}
            className="flex-1"
          >
            {loading ? 'Processing...' : 'Borrow Book'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  )
}
