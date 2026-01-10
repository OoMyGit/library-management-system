import { useState } from 'react'
import { BOOK_CATEGORIES } from '../../constants/constants-index'
import Button from '../common/Button'

/**
 * SearchBar Component
 * Search and filter interface for book catalog
 */
export default function SearchBar({ 
  onSearch, 
  onCategoryChange, 
  searchTerm, 
  selectedCategory,
  onRefresh 
}) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '')

  const handleSearchChange = (e) => {
    setLocalSearchTerm(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onSearch(localSearchTerm)
  }

  const handleCategoryChange = (e) => {
    onCategoryChange(e.target.value)
  }

  const handleClear = () => {
    setLocalSearchTerm('')
    onSearch('')
    onCategoryChange('All Categories')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSearchSubmit} className="space-y-4">
        {/* Search Input */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Books
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                value={localSearchTerm}
                onChange={handleSearchChange}
                placeholder="Search by title or author..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-64">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {BOOK_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="primary">
            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </Button>
          
          <Button type="button" variant="outline" onClick={handleClear}>
            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </Button>

          {onRefresh && (
            <Button type="button" variant="ghost" onClick={onRefresh}>
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {(localSearchTerm || selectedCategory !== 'All Categories') && (
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {localSearchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Search: "{localSearchTerm}"
              </span>
            )}
            {selectedCategory !== 'All Categories' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                Category: {selectedCategory}
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
