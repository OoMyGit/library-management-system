/**
 * Alert Component
 * Displays alert messages with different types
 */
export default function Alert({ type = 'info', message, onClose, className = '' }) {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: '✓'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '✕'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: '⚠'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'ℹ'
    }
  }

  const style = types[type]

  return (
    <div className={`${style.bg} ${style.border} ${style.text} border rounded-lg p-4 mb-4 ${className}`}>
      <div className="flex items-start">
        <span className="text-xl mr-3">{style.icon}</span>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
