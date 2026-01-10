import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import Card from '../common/Card'
import Alert from '../common/Alert'

/**
 * MemberForm Component
 * Form for staff to register new library members
 */
export default function MemberForm({ onMemberAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await onMemberAdded(formData)

      if (result.success) {
        setSuccess(
          `Member registered successfully! Member Code: ${result.member.member_code}`
        )
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: ''
        })

        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(null)
        }, 5000)
      } else {
        setError(result.error || 'Failed to register member')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: ''
    })
    setErrors({})
    setError(null)
    setSuccess(null)
  }

  return (
    <Card title="Register New Member" subtitle="Add a new library member">
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} />
      )}
      
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter member's full name"
          required
          error={errors.name}
        />

        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="member@example.com"
          required
          error={errors.email}
        />

        {/* Phone Input */}
        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="081234567890 (optional)"
          error={errors.phone}
        />

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Auto-Generated Member Code</p>
              <p>A unique member code will be automatically generated in format: <strong>M-YYYY-XXX</strong></p>
              <p className="mt-1 text-xs text-blue-600">Example: M-2026-001, M-2026-002, etc.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Registering...' : 'Register Member'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  )
}
