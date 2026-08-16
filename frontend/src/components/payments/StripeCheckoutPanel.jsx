import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { CreditCard, ShieldCheck, Lock } from 'lucide-react'
import Button from '../ui/Button'
import { createPaymentIntentRequest } from '../../services/api/paymentsApi'

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51TSmB9FhOTFrDGomPiyFHEyyP9PkZ6QQtS2xaZZZxWU7fb2ZsZKYRpmYxWh8dHJfgloIvkTX30Nay3MBX8P1O9aY00mjAron3D')

// Card input styles
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
    },
  },
  disableLink: true, // Remove "Autofill link" button
}
// Inner component that uses Stripe hooks
const CheckoutForm = ({ bookingId, amount, currency, onPaymentSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false })

  const toastTimerRef = useRef(null)
  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ message, type, isVisible: true })
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }))
    }, 3000)
  }, [])

  // Create PaymentIntent on mount
  useEffect(() => {
    const createIntent = async () => {
      if (!bookingId) {
        setMessage('Missing booking reference. Go back and complete booking again.')
        return
      }
      try {
        const storedAuth = localStorage.getItem('service-hive-auth')
        const authData = storedAuth ? JSON.parse(storedAuth) : null
        const token = authData?.token

        if (!token) {
          setMessage('Please login to complete payment')
          return
        }

        const authHeaders = { Authorization: `Bearer ${token}` }
        const response = await createPaymentIntentRequest(
          { bookingId, amount, currency },
          authHeaders
        )

        setClientSecret(response.clientSecret)
      } catch (error) {
        const m =
          (typeof error.message === 'string' && error.message) ||
          error?.data?.message ||
          'Failed to initialize payment'
        setMessage(m)
      }
    }

    createIntent()
  }, [bookingId, amount, currency])

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    setMessage('')

    // Simulate payment processing for demo
    setTimeout(() => {
      setMessage('Your transaction successfully done. Admin receive your payment.')
      showToast('Your transaction successfully done. Admin receive your payment.', 'success')
      setIsLoading(false)
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess()
        }
      }, 2500)
    }, 1000)
  }

  return (
    <>
      {/* Toast Notification */}
      {toast.isVisible && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-white/20 bg-white/5 p-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Card Details
        </label>
        <div className="p-3 rounded-lg border border-white/10 bg-white/5">
          <CardElement options={cardElementOptions} />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Enter your card number, expiry date, and CVC
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-100">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Your card details are encrypted and secure
        </div>
      </div>

      {message && (
        <p className={`text-sm ${message.includes('successful') ? 'text-emerald-300' : 'text-amber-300'}`}>
          {message}
        </p>
      )}

      <Button
        type="submit"
        className="w-full flex items-center justify-center gap-2"
        disabled={isLoading || !stripe || !clientSecret}
      >
        {isLoading ? (
          <span>Processing...</span>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Pay PKR {amount}
          </>
        )}
      </Button>
    </form>
    </>
  )
}

// Wrapper component with Stripe Elements provider
const StripeCheckoutPanel = ({ bookingId, onPaymentSuccess, amount, currency = 'pkr' }) => {
  return (
    <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <CreditCard className="h-5 w-5 text-cyan-200" />
        </div>
        <div>
          <p className="font-semibold text-white">Secure Card Payment</p>
          <p className="text-sm text-slate-400">
            Enter your card details below to complete payment
          </p>
        </div>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm
          bookingId={bookingId}
          amount={amount}
          currency={currency}
          onPaymentSuccess={onPaymentSuccess}
        />
      </Elements>
    </div>
  )
}

export default StripeCheckoutPanel