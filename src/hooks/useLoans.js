import { useState, useEffect, useCallback } from 'react'
import LoanService from '../services/LoanService'

/**
 * useLoans Hook
 * Custom hook for loan operations using LoanService (OOP)
 */
export default function useLoans() {
  const [loans, setLoans] = useState([])
  const [filteredLoans, setFilteredLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all') // all, borrowed, returned, overdue

  /**
   * Fetch all loans on mount
   */
  useEffect(() => {
    fetchLoans()
  }, [])

  /**
   * Apply filter when filterStatus changes
   */
  useEffect(() => {
    applyFilter()
  }, [filterStatus, loans])

  /**
   * Fetch all loans from database
   */
  const fetchLoans = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await LoanService.getAllLoans()
      setLoans(data)
      setFilteredLoans(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching loans:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Apply status filter
   */
  const applyFilter = useCallback(() => {
    if (filterStatus === 'all') {
      setFilteredLoans(loans)
    } else {
      const filtered = loans.filter(loan => loan.status === filterStatus)
      setFilteredLoans(filtered)
    }
  }, [filterStatus, loans])

  /**
   * Get active loans only
   */
  const fetchActiveLoans = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await LoanService.getActiveLoans()
      setLoans(data)
      setFilteredLoans(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching active loans:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Get overdue loans only
   */
  const fetchOverdueLoans = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await LoanService.getOverdueLoans()
      setLoans(data)
      setFilteredLoans(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching overdue loans:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Create new loan (borrow book)
   */
  const createLoan = async (memberId, bookId, notes = '') => {
    try {
      setError(null)
      const newLoan = await LoanService.createLoan(memberId, bookId, notes)
      
      // Refresh loans list
      await fetchLoans()
      
      return { success: true, loan: newLoan }
    } catch (err) {
      console.error('Error creating loan:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  /**
   * Return book
   */
  const returnBook = async (loanId) => {
    try {
      setError(null)
      const updatedLoan = await LoanService.returnBook(loanId)
      
      // Refresh loans list
      await fetchLoans()
      
      return { success: true, loan: updatedLoan }
    } catch (err) {
      console.error('Error returning book:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  /**
   * Update overdue status
   */
  const updateOverdueStatus = async () => {
    try {
      const count = await LoanService.updateOverdueLoans()
      await fetchLoans() // Refresh list
      return count
    } catch (err) {
      console.error('Error updating overdue status:', err)
      return 0
    }
  }

  /**
   * Get loans by member
   */
  const getLoansByMember = async (memberId) => {
    try {
      const data = await LoanService.getLoansByMember(memberId)
      return data
    } catch (err) {
      console.error('Error fetching member loans:', err)
      return []
    }
  }

  /**
   * Refresh loans list
   */
  const refresh = useCallback(() => {
    fetchLoans()
  }, [])

  return {
    loans: filteredLoans,
    allLoans: loans,
    loading,
    error,
    filterStatus,
    setFilterStatus,
    createLoan,
    returnBook,
    fetchActiveLoans,
    fetchOverdueLoans,
    updateOverdueStatus,
    getLoansByMember,
    refresh
  }
}
