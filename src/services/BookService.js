import supabase from '../supabase-client'

/**
 * BookService Class - Handles all book-related operations
 * OOP Pattern: Encapsulates book business logic
 */
class BookService {
  constructor() {
    this.tableName = 'books'
  }

  /**
   * Get all books from database
   * @returns {Promise<Array>} Array of book objects
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

  /**
   * Get books by availability status
   * @param {boolean} availableOnly - Filter only available books
   * @returns {Promise<Array>} Array of book objects
   */
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

  /**
   * Search books by title or author
   * @param {string} searchTerm - Search query
   * @returns {Promise<Array>} Array of matching books
   */
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

  /**
   * Filter books by category
   * @param {string} category - Book category
   * @returns {Promise<Array>} Array of filtered books
   */
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
      console.error('Error filtering books by category:', error)
      throw error
    }
  }

  /**
   * Get a single book by ID
   * @param {string} bookId - Book UUID
   * @returns {Promise<Object>} Book object
   */
  async getBookById(bookId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', bookId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching book by ID:', error)
      throw error
    }
  }

  /**
   * Update book availability when borrowed
   * @param {string} bookId - Book UUID
   * @returns {Promise<boolean>} Success status
   */
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
      console.error('Error decreasing book availability:', error)
      throw error
    }
  }

  /**
   * Update book availability when returned
   * @param {string} bookId - Book UUID
   * @returns {Promise<boolean>} Success status
   */
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
      console.error('Error increasing book availability:', error)
      throw error
    }
  }

  /**
   * Check if book is available for borrowing
   * @param {string} bookId - Book UUID
   * @returns {Promise<boolean>} Availability status
   */
  async isBookAvailable(bookId) {
    try {
      const book = await this.getBookById(bookId)
      return book.available_quantity > 0
    } catch (error) {
      console.error('Error checking book availability:', error)
      return false
    }
  }
}

// Export singleton instance
export default new BookService()
