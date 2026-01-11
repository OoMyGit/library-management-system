import useBooks from '../hooks/useBooks'
import SearchBar from '../components/catalog/SearchBar'
import BookList from '../components/catalog/BookList'
import Loading from '../components/common/Loading'
import Alert from '../components/common/Alert'

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📚 Book Catalog
          </h1>
          <p className="text-gray-600">
            Browse and search our collection
          </p>
        </div>

        {/* Error */}
        {error && (
          <Alert 
            type="error" 
            message={error}
            onClose={refresh}
            className="mb-6"
          />
        )}

        {/* Search */}
        <SearchBar
          onSearch={handleSearch}
          onCategoryChange={handleCategoryFilter}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onRefresh={refresh}
        />

        {/* Books */}
        {loading && <Loading text="Loading books..." />}
        {!loading && <BookList books={books} loading={loading} />}

        {/* Info */}
        {!loading && books.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Visit the library desk to borrow books (7-day loan period).
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
