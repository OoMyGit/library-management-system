import supabase from '../supabase-client'
import BaseService from './BaseService'

/**
 * BookService - Child Class
 * OOP: Inheritance - Extends BaseService
 * 
 * parent (BaseService):
 * ✓ getAll()
 * ✓ getById() 
 * ✓ count()
 * 
 * Method BookService:
 * - getAllBooks() -  custom sorting
 * - searchBooks()
 * - getBooksByCategory()
 * - isBookAvailable()
 */
class BookService extends BaseService {
  constructor() {
    super('books') // Panggil constructor parent
  }

  // ✓ getAll() & getById() sudah dari BaseService!

  /**
   * Get all books dengan custom sorting
   */
  async getAllBooks() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('title', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching books:', error)
      throw error
    }
  }

  async getBooks(availableOnly = false) {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*')
        .order('title', { ascending: true })

      if (availableOnly) {
        query = query.gt('available_quantity', 0)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching books:', error)
      throw error
    }
  }

  async searchBooks(searchTerm) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`)
        .order('title', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching books:', error)
      throw error
    }
  }

  async getBooksByCategory(category) {
    try {
      if (!category || category === 'All Categories') {
        return await this.getAllBooks()
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('category', category)
        .order('title', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error filtering books:', error)
      throw error
    }
  }

  /**
   * Memanggil getById() dari parent class
   */
  async getBookById(bookId) {
    return await this.getById(bookId)
  }

  async decreaseAvailability(bookId) {
    try {
      const book = await this.getBookById(bookId)
      
      if (book.available_quantity <= 0) {
        throw new Error('Book is not available')
      }

      const { error } = await supabase
        .from(this.tableName)
        .update({ 
          available_quantity: book.available_quantity - 1,
          status: book.available_quantity - 1 === 0 ? 'unavailable' : 'available'
        })
        .eq('id', bookId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error decreasing availability:', error)
      throw error
    }
  }

  async increaseAvailability(bookId) {
    try {
      const book = await this.getBookById(bookId)

      const { error } = await supabase
        .from(this.tableName)
        .update({ 
          available_quantity: book.available_quantity + 1,
          status: 'available'
        })
        .eq('id', bookId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error increasing availability:', error)
      throw error
    }
  }

  async isBookAvailable(bookId) {
    try {
      const book = await this.getBookById(bookId)
      return book.available_quantity > 0
    } catch (error) {
      console.error('Error checking availability:', error)
      return false
    }
  }
}

export default new BookService()
