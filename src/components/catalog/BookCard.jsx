import Card from '../common/Card'

/**
 * BookCard Component
 * Displays individual book information in catalog
 */
export default function BookCard({ book }) {
  const isAvailable = book.available_quantity > 0

  return (
    <Card className="h-full hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col h-full">
        {/* Book Cover Placeholder */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-8 mb-4 flex items-center justify-center h-48">
          <svg className="w-20 h-20 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        {/* Book Info */}
        <div className="flex-grow">
          {/* Title */}
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-gray-600 text-sm mb-3">
            by <span className="font-medium">{book.author}</span>
          </p>

          {/* Details */}
          <div className="space-y-2 mb-4">
            {book.publisher && (
              <div className="flex items-start text-sm">
                <span className="text-gray-500 w-24 flex-shrink-0">Publisher:</span>
                <span className="text-gray-700 font-medium">{book.publisher}</span>
              </div>
            )}
            
            {book.publication_year && (
              <div className="flex items-start text-sm">
                <span className="text-gray-500 w-24 flex-shrink-0">Year:</span>
                <span className="text-gray-700 font-medium">{book.publication_year}</span>
              </div>
            )}

            {book.category && (
              <div className="flex items-start text-sm">
                <span className="text-gray-500 w-24 flex-shrink-0">Category:</span>
                <span className="text-gray-700 font-medium">{book.category}</span>
              </div>
            )}

            <div className="flex items-start text-sm">
              <span className="text-gray-500 w-24 flex-shrink-0">ISBN:</span>
              <span className="text-gray-700 font-mono text-xs">{book.isbn}</span>
            </div>
          </div>
        </div>

        {/* Availability Status */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Availability</p>
              <p className="text-sm font-semibold text-gray-700">
                {book.available_quantity} of {book.stock_quantity} available
              </p>
            </div>
            
            <div>
              {isAvailable ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Available
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
