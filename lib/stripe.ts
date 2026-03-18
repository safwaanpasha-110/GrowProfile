/**
 * Stripe client singleton
 * Docs: https://stripe.com/docs/api
 *
 * Set STRIPE_SECRET_KEY in .env
 * Set STRIPE_PUBLISHABLE_KEY in .env.local (client-side)
 */
import Stripe from 'stripe'

// Singleton pattern — avoids creating multiple instances during hot-reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var _stripe: Stripe | undefined
}

function getStripe(): Stripe {
  if (!global._stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('Stripe is not configured: set STRIPE_SECRET_KEY')
    }
    global._stripe = new Stripe(key, {
      apiVersion: '2026-02-25.clover',
      typescript: true,
    })
  }
  return global._stripe
}

// Proxy so callers can still `import stripe from '@/lib/stripe'`
// without triggering construction at import time or during next build.
const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    if (prop === '__esModule' || prop === 'then' || typeof prop === 'symbol') {
      return undefined
    }
    const instance = getStripe()
    const value = Reflect.get(instance, prop, receiver)
    return typeof value === 'function' ? value.bind(instance) : value
  },
})

export default stripe

// ─── Helper: get or create Stripe customer for a user ─────────────────────

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null,
): Promise<string> {
  const prisma = (await import('./prisma')).default

  // Look for an existing subscription with a stripeCustomerId
  const existing = await prisma.subscription.findFirst({
    where: { userId, stripeCustomerId: { not: null } },
    select: { stripeCustomerId: true },
  })

  if (existing?.stripeCustomerId) return existing.stripeCustomerId

  // Create a new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { userId },
  })

  return customer.id
}

// ─── Helper: build absolute URL ───────────────────────────────────────────

export function buildUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.FRONTEND_URL ||
    'https://growprofile.in'
  return `${base.replace(/\/$/, '')}${path}`
}
