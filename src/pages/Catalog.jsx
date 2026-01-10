import useBooks from '../hooks/useBooks'
import SearchBar from '../components/catalog/SearchBar'
import BookList from '../components/catalog/BookList'
import Loading from '../components/common/Loading'
import Alert from '../components/common/Alert'

/**
 * Catalog Page
 * Public page for members/visitors to browse book catalog
 */
export default function Catalog() {
  const {
    books,
    loading,
    error,
    searchTerm,
    selectedCategory,
    handleSearch,
    handleCategoryFilter,
    refresh
  } = useBooks()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📚 Book Catalog
          </h1>
          <p className="text-gray-600 text-lg">
            Browse our collection of books. Search by title, author, or filter by category.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert 
            type="error" 
            message={`Error loading books: ${error}`}
            onClose={() => refresh()}
            className="mb-6"
          />
        )}

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          onCategoryChange={handleCategoryFilter}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onRefresh={refresh}
        />

        {/* Loading State */}
        {loading && <Loading text="Loading books..." />}

        {/* Book List */}
        {!loading && <BookList books={books} loading={loading} />}

        {/* Info Box for Members */}
        {!loading && books.length > 0 && (
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Want to borrow a book?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Please visit the library desk to borrow books. Our staff will help you with the borrowing process.
                    Books can be borrowed for <strong>7 days</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
