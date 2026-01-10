import supabase from '../supabase-client'
import BookService from './BookService'
import { LOAN_STATUS, LOAN_DURATION_DAYS } from '../constants/constants-index'

/**
 * LoanService Class - Handles all loan-related operations
 * OOP Pattern: Encapsulates loan business logic
 */
class LoanService {
  constructor() {
    this.tableName = 'loans'
    this.bookService = BookService
  }

  /**
   * Calculate due date (loan date + 7 days)
   * @param {Date} loanDate - Loan start date
   * @returns {Date} Due date
   */
  calculateDueDate(loanDate = new Date()) {
    const dueDate = new Date(loanDate)
    dueDate.setDate(dueDate.getDate() + LOAN_DURATION_DAYS)
    return dueDate
  }

  /**
   * Check if loan is overdue
   * @param {string} dueDate - Due date string
   * @param {string} returnDate - Return date string (nullable)
   * @returns {boolean} Overdue status
   */
  isOverdue(dueDate, returnDate) {
    if (returnDate) return false // Already returned
    const due = new Date(dueDate)
    const today = new Date()
    return today > due
  }

  /**
   * Get all loans with related data
   * @returns {Promise<Array>} Array of loan objects with member and book info
   */
  async getAllLoans() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          members (
            id,
            member_code,
            name,
            email
          ),
          books (
            id,
            title,
            author,
            isbn
          )
        `)
        .order('loan_date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching loans:', error)
      throw error
    }
  }

  /**
   * Get active loans (not returned)
   * @returns {Promise<Array>} Array of active loans
   */
  async getActiveLoans() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          members (
            id,
            member_code,
            name,
            email
          ),
          books (
            id,
            title,
            author,
            isbn
          )
        `)
        .eq('status', LOAN_STATUS.BORROWED)
        .order('loan_date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching active loans:', error)
      throw error
    }
  }

  /**
   * Get overdue loans
   * @returns {Promise<Array>} Array of overdue loans
   */
  async getOverdueLoans() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          members (
            id,
            member_code,
            name,
            email
          ),
          books (
            id,
            title,
            author,
            isbn
          )
        `)
        .eq('status', LOAN_STATUS.OVERDUE)
        .order('due_date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching overdue loans:', error)
      throw error
    }
  }

  /**
   * Get loans by member
   * @param {string} memberId - Member UUID
   * @returns {Promise<Array>} Array of member's loans
   */
  async getLoansByMember(memberId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          books (
            id,
            title,
            author
          )
        `)
        .eq('member_id', memberId)
        .order('loan_date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching member loans:', error)
      throw error
    }
  }

  /**
   * Create new loan (borrow book)
   * @param {string} memberId - Member UUID
   * @param {string} bookId - Book UUID
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} Created loan object
   */
  async createLoan(memberId, bookId, notes = '') {
    try {
      // Check if book is available
      const isAvailable = await this.bookService.isBookAvailable(bookId)
      if (!isAvailable) {
        throw new Error('Book is not available for borrowing')
      }

      const loanDate = new Date()
      const dueDate = this.calculateDueDate(loanDate)

      // Create loan record
      const { data, error } = await supabase
        .from(this.tableName)
        .insert({
          member_id: memberId,
          book_id: bookId,
          loan_date: loanDate.toISOString().split('T')[0],
          due_date: dueDate.toISOString().split('T')[0],
          status: LOAN_STATUS.BORROWED,
          notes: notes
        })
        .select(`
          *,
          members (
            id,
            member_code,
            name,
            email
          ),
          books (
            id,
            title,
            author,
            isbn
          )
        `)
        .single()

      if (error) throw error

      // Decrease book availability
      await this.bookService.decreaseAvailability(bookId)

      return data
    } catch (error) {
      console.error('Error creating loan:', error)
      throw error
    }
  }

  /**
   * Return book
   * @param {string} loanId - Loan UUID
   * @returns {Promise<Object>} Updated loan object
   */
  async returnBook(loanId) {
    try {
      // Get loan details
      const { data: loan, error: fetchError } = await supabase
        .from(this.tableName)
        .select('*, books(*)')
        .eq('id', loanId)
        .single()

      if (fetchError) throw fetchError

      if (loan.status === LOAN_STATUS.RETURNED) {
        throw new Error('Book already returned')
      }

      const returnDate = new Date()

      // Update loan record
      const { data, error } = await supabase
        .from(this.tableName)
        .update({
          return_date: returnDate.toISOString().split('T')[0],
          status: LOAN_STATUS.RETURNED
        })
        .eq('id', loanId)
        .select(`
          *,
          members (
            id,
            member_code,
            name,
            email
          ),
          books (
            id,
            title,
            author,
            isbn
          )
        `)
        .single()

      if (error) throw error

      // Increase book availability
      await this.bookService.increaseAvailability(loan.book_id)

      return data
    } catch (error) {
      console.error('Error returning book:', error)
      throw error
    }
  }

  /**
   * Update overdue loans
   * This method checks active loans and marks overdue ones
   * @returns {Promise<number>} Number of loans marked as overdue
   */
  async updateOverdueLoans() {
    try {
      const activeLoans = await this.getActiveLoans()
      const today = new Date()
      let overdueCount = 0

      for (const loan of activeLoans) {
        const dueDate = new Date(loan.due_date)
        if (today > dueDate) {
          await supabase
            .from(this.tableName)
            .update({ status: LOAN_STATUS.OVERDUE })
            .eq('id', loan.id)
          overdueCount++
        }
      }

      return overdueCount
    } catch (error) {
      console.error('Error updating overdue loans:', error)
      throw error
    }
  }
}

// Export singleton instance
export default new LoanService()
