import supabase from '../supabase-client'
import { MEMBER_STATUS } from '../constants/constants-index'

/**
 * MemberService Class - Handles all member-related operations
 * OOP Pattern: Encapsulates member business logic
 */
class MemberService {
  constructor() {
    this.tableName = 'members'
  }

  /**
   * Generate unique member code (format: M-YYYY-XXX)
   * @returns {Promise<string>} Generated member code
   */
  async generateMemberCode() {
    try {
      const year = new Date().getFullYear()
      
      // Get latest member code for current year
      const { data, error } = await supabase
        .from(this.tableName)
        .select('member_code')
        .like('member_code', `M-${year}-%`)
        .order('member_code', { ascending: false })
        .limit(1)

      if (error) throw error

      let nextNumber = 1
      if (data && data.length > 0) {
        const lastCode = data[0].member_code
        const lastNumber = parseInt(lastCode.split('-')[2])
        nextNumber = lastNumber + 1
      }

      const paddedNumber = String(nextNumber).padStart(3, '0')
      return `M-${year}-${paddedNumber}`
    } catch (error) {
      console.error('Error generating member code:', error)
      throw error
    }
  }

  /**
   * Get all members
   * @returns {Promise<Array>} Array of member objects
   */
  async getAllMembers() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('join_date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching members:', error)
      throw error
    }
  }

  /**
   * Get active members only
   * @returns {Promise<Array>} Array of active member objects
   */
  async getActiveMembers() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('status', MEMBER_STATUS.ACTIVE)
        .order('name', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching active members:', error)
      throw error
    }
  }

  /**
   * Get member by ID with loan history
   * @param {string} memberId - Member UUID
   * @returns {Promise<Object>} Member object with loans
   */
  async getMemberById(memberId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(`
          *,
          loans (
            *,
            books (
              id,
              title,
              author
            )
          )
        `)
        .eq('id', memberId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching member by ID:', error)
      throw error
    }
  }

  /**
   * Search members by name or email
   * @param {string} searchTerm - Search query
   * @returns {Promise<Array>} Array of matching members
   */
  async searchMembers(searchTerm) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,member_code.ilike.%${searchTerm}%`)
        .order('name', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching members:', error)
      throw error
    }
  }

  /**
   * Add new member
   * @param {Object} memberData - Member information
   * @returns {Promise<Object>} Created member object
   */
  async addMember(memberData) {
    try {
      // Generate member code
      const memberCode = await this.generateMemberCode()

      const { data, error } = await supabase
        .from(this.tableName)
        .insert({
          member_code: memberCode,
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone || null,
          status: MEMBER_STATUS.ACTIVE
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding member:', error)
      throw error
    }
  }

  /**
   * Update member information
   * @param {string} memberId - Member UUID
   * @param {Object} memberData - Updated member information
   * @returns {Promise<Object>} Updated member object
   */
  async updateMember(memberId, memberData) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(memberData)
        .eq('id', memberId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating member:', error)
      throw error
    }
  }

  /**
   * Deactivate member (soft delete)
   * @param {string} memberId - Member UUID
   * @returns {Promise<boolean>} Success status
   */
  async deactivateMember(memberId) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .update({ status: MEMBER_STATUS.INACTIVE })
        .eq('id', memberId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deactivating member:', error)
      throw error
    }
  }

  /**
   * Activate member
   * @param {string} memberId - Member UUID
   * @returns {Promise<boolean>} Success status
   */
  async activateMember(memberId) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .update({ status: MEMBER_STATUS.ACTIVE })
        .eq('id', memberId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error activating member:', error)
      throw error
    }
  }

  /**
   * Check if email already exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} True if email exists
   */
  async emailExists(email) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('email', email)
        .limit(1)

      if (error) throw error
      return data && data.length > 0
    } catch (error) {
      console.error('Error checking email:', error)
      return false
    }
  }
}

// Export singleton instance
export default new MemberService()
