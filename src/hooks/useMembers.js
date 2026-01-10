import { useState, useEffect, useCallback } from 'react'
import MemberService from '../services/MemberService'

/**
 * useMembers Hook
 * Custom hook for member operations using MemberService (OOP)
 */
export default function useMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Fetch all members on mount
   */
  useEffect(() => {
    fetchMembers()
  }, [])

  /**
   * Fetch all members from database
   */
  const fetchMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await MemberService.getAllMembers()
      setMembers(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching members:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Get active members only
   */
  const fetchActiveMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await MemberService.getActiveMembers()
      setMembers(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching active members:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Get member by ID with loan history
   */
  const getMemberById = async (memberId) => {
    try {
      const data = await MemberService.getMemberById(memberId)
      return data
    } catch (err) {
      console.error('Error fetching member:', err)
      return null
    }
  }

  /**
   * Search members
   */
  const searchMembers = async (searchTerm) => {
    try {
      const data = await MemberService.searchMembers(searchTerm)
      setMembers(data)
    } catch (err) {
      console.error('Error searching members:', err)
      setError(err.message)
    }
  }

  /**
   * Add new member
   */
  const addMember = async (memberData) => {
    try {
      setError(null)
      
      // Check if email exists
      const emailExists = await MemberService.emailExists(memberData.email)
      if (emailExists) {
        return { success: false, error: 'Email already exists' }
      }

      const newMember = await MemberService.addMember(memberData)
      await fetchMembers() // Refresh list
      
      return { success: true, member: newMember }
    } catch (err) {
      console.error('Error adding member:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  /**
   * Update member
   */
  const updateMember = async (memberId, memberData) => {
    try {
      setError(null)
      const updatedMember = await MemberService.updateMember(memberId, memberData)
      await fetchMembers() // Refresh list
      
      return { success: true, member: updatedMember }
    } catch (err) {
      console.error('Error updating member:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  /**
   * Deactivate member
   */
  const deactivateMember = async (memberId) => {
    try {
      await MemberService.deactivateMember(memberId)
      await fetchMembers() // Refresh list
      return { success: true }
    } catch (err) {
      console.error('Error deactivating member:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Activate member
   */
  const activateMember = async (memberId) => {
    try {
      await MemberService.activateMember(memberId)
      await fetchMembers() // Refresh list
      return { success: true }
    } catch (err) {
      console.error('Error activating member:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Refresh members list
   */
  const refresh = useCallback(() => {
    fetchMembers()
  }, [])

  return {
    members,
    loading,
    error,
    fetchActiveMembers,
    getMemberById,
    searchMembers,
    addMember,
    updateMember,
    deactivateMember,
    activateMember,
    refresh
  }
}
