/**
 * Razorpay client singleton
 * Docs: https://razorpay.com/docs/api
 *
 * Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env
 */
import Razorpay from 'razorpay'
import crypto from 'crypto'

// Lazy singleton — avoids constructing at build time when env vars are missing
function getRazorpay(): Razorpay {
  const keyId     = process.env.RAZORPAY_KEY_ID     || ''
  const keySecret = process.env.RAZORPAY_KEY_SECRET || ''

  if (!keyId || !keySecret) {
    throw new Error('Razorpay is not configured: set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET')
  }

  if (!global._razorpay) {
    global._razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
  }
  return global._razorpay
}

declare global {
  // eslint-disable-next-line no-var
  var _razorpay: Razorpay | undefined
}

// Proxy so callers can still `import razorpay from '@/lib/razorpay'`
// without triggering construction at import time or during next build.
const razorpay = new Proxy({} as Razorpay, {
  get(_target, prop, receiver) {
    if (prop === '__esModule' || prop === 'then' || typeof prop === 'symbol') {
      return undefined
    }
    const instance = getRazorpay()
    const value = Reflect.get(instance, prop, receiver)
    return typeof value === 'function' ? value.bind(instance) : value
  },
})

export default razorpay

// ─── Verify Razorpay payment signature ────────────────────────────────────

/**
 * Verifies the HMAC-SHA256 signature returned by Razorpay after payment.
 * @param orderId    razorpay_order_id from the callback
 * @param paymentId  razorpay_payment_id from the callback
 * @param signature  razorpay_signature from the callback
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET || ''
  if (!keySecret) return false
  const hmac = crypto.createHmac('sha256', keySecret)
  hmac.update(`${orderId}|${paymentId}`)
  const expected = hmac.digest('hex')
  return expected === signature
}

/**
 * Verifies a Razorpay webhook signature.
 * @param rawBody   raw request body string
 * @param signature X-Razorpay-Signature header value
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) return false
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(rawBody)
  const expected = hmac.digest('hex')
  return expected === signature
}

// ─── Amount helpers ────────────────────────────────────────────────────────

/** Convert USD dollars to INR paise (Razorpay uses smallest unit) */
export function usdToInrPaise(usd: number, exchangeRate = 84): number {
  return Math.round(usd * exchangeRate * 100)
}
