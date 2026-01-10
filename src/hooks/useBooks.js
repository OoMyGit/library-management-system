import { useState, useEffect, useCallback } from 'react'
import BookService from '../services/BookService'

/**
 * useBooks Hook
 * Custom hook for book operations using BookService (OOP)
 */
export default function useBooks() {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  /**
   * Fetch all books on mount
   */
  useEffect(() => {
    fetchBooks()
  }, [])

  /**
   * Fetch books from database using BookService
   */
  const fetchBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await BookService.getAllBooks()
      setBooks(data)
      setFilteredBooks(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Search books by title or author
   */
  const handleSearch = useCallback(async (term) => {
    setSearchTerm(term)
    
    if (!term.trim()) {
      // If search is empty, show all books or filtered by category
      if (selectedCategory === 'All Categories') {
        setFilteredBooks(books)
      } else {
        const filtered = books.filter(book => book.category === selectedCategory)
        setFilteredBooks(filtered)
      }
      return
    }

    try {
      const results = await BookService.searchBooks(term)
      
      // Apply category filter to search results if needed
      if (selectedCategory !== 'All Categories') {
        const filtered = results.filter(book => book.category === selectedCategory)
        setFilteredBooks(filtered)
      } else {
        setFilteredBooks(results)
      }
    } catch (err) {
      console.error('Error searching books:', err)
      setError('Failed to search books')
    }
  }, [books, selectedCategory])

  /**
   * Filter books by category
   */
  const handleCategoryFilter = useCallback(async (category) => {
    setSelectedCategory(category)
    
    try {
      let results
      
      if (category === 'All Categories') {
        results = await BookService.getAllBooks()
      } else {
        results = await BookService.getBooksByCategory(category)
      }
      
      // Apply search term to category results if exists
      if (searchTerm.trim()) {
        const searchResults = results.filter(book =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredBooks(searchResults)
      } else {
        setFilteredBooks(results)
      }
      
      setBooks(results)
    } catch (err) {
      console.error('Error filtering books:', err)
      setError('Failed to filter books')
    }
  }, [searchTerm])

  /**
   * Refresh books list
   */
  const refresh = useCallback(() => {
    fetchBooks()
    setSearchTerm('')
    setSelectedCategory('All Categories')
  }, [])

  return {
    books: filteredBooks,
    allBooks: books,
    loading,
    error,
    searchTerm,
    selectedCategory,
    handleSearch,
    handleCategoryFilter,
    refresh
  }
}
