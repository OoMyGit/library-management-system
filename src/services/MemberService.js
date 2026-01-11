import supabase from '../supabase-client'
import BaseService from './BaseService'
import { MEMBER_STATUS } from '../constants/constants-index'

/**
 * MemberService - Child Class
 * OOP: Inheritance - Extends BaseService
 * 
 * parent (BaseService):
 * ✓ getAll()
 * ✓ getById()
 * ✓ count()
 * 
 * Method MemberService:
 * - generateMemberCode()
 * - getActiveMembers()
 * - addMember()
 * - searchMembers()
 */

class MemberService extends BaseService {
  constructor() {
    super('members') // Panggil constructor parent
  }

  // ✓ getAll() & getById() sudah dari BaseService

  /**
   * Generate member code - Menggunakan getAll() dari parent!
   */
  async generateMemberCode() {
    try {
      const year = new Date().getFullYear()
      
      // Pakai getAll() dari parent class!
      const allMembers = await this.getAll()
      
      const codesThisYear = allMembers
        .filter(m => m.member_code.startsWith(`M-${year}-`))
        .map(m => m.member_code)
        .sort()
        .reverse()

      let nextNumber = 1
      if (codesThisYear.length > 0) {
        const lastCode = codesThisYear[0]
        nextNumber = parseInt(lastCode.split('-')[2]) + 1
      }

      return `M-${year}-${String(nextNumber).padStart(3, '0')}`
    } catch (error) {
      console.error('Error generating member code:', error)
      throw error
    }
  }

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

  async addMember(memberData) {
    try {
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

export default new MemberService()
