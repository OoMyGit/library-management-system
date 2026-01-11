import supabase from '../supabase-client'

/**
 * BaseService - Parent Class untuk semua Services
 * OOP: Inheritance (Pewarisan)
 * 
 * Method yang diwarisi oleh child classes:
 * - getAll()
 * - getById()
 * - count()
 */
class BaseService {
  constructor(tableName) {
    this.tableName = tableName
  }

  /**
   * Get all records - Method akan diwarisi oleh BookService, MemberService, dll
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error(`Error in ${this.tableName}:`, error)
      throw error
    }
  }

  /**
   * Get by ID - Method akan diwarisi oleh BookService, MemberService, dll
   */
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error in ${this.tableName}:`, error)
      throw error
    }
  }

  /**
   * Count records - Method akan diwarisi oleh BookService, MemberService, dll
   */
  async count() {
    try {
      const { count, error } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true })

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error(`Error counting ${this.tableName}:`, error)
      return 0
    }
  }
}

export default BaseService
