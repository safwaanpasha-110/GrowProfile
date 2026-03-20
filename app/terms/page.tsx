import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - GrowProfile',
  description: 'GrowProfile Terms of Service — rules and guidelines for using our platform.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo-20260320-v4.png" alt="GrowProfile Logo" width={36} height={36} className="rounded-lg" />
              <span className="text-xl font-bold text-slate-900">GrowProfile</span>
            </Link>
            <div className="flex gap-3">
              <Link href="/auth/login" className="text-sm text-slate-600 hover:text-primary transition-colors">Log in</Link>
              <Link href="/auth/signup" className="text-sm font-medium text-white bg-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-12">Last updated: March 20, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Service Description</h2>
            <p className="text-slate-700 leading-relaxed">
              GrowProfile is an Instagram automation SaaS platform operated by ScorpixMedia (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
              The Service provides professional Instagram account holders with tools including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mt-3">
              <li>Comment-keyword triggered automated DM responses</li>
              <li>Automated comment reply workflows</li>
              <li>Campaign management for Instagram engagement</li>
              <li>Analytics and interaction tracking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Eligibility</h2>
            <p className="text-slate-700 leading-relaxed">To use GrowProfile, you must:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mt-3">
              <li>Be at least 18 years old</li>
              <li>Have a valid Instagram Professional (Business or Creator) account</li>
              <li>Comply with Instagram&apos;s Terms of Use and Community Guidelines</li>
              <li>Comply with Meta Platform Terms and Developer Policies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. User Responsibilities</h2>
            <p className="text-slate-700 leading-relaxed">By using GrowProfile, you agree:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mt-3">
              <li>Not to use GrowProfile for spam, harassment, or abusive behavior</li>
              <li>Not to violate Instagram&apos;s Terms of Use or Community Guidelines</li>
              <li>Not to misuse automation features in ways that circumvent Meta policies</li>
              <li>Not to send unsolicited messages or bulk DMs without user interaction</li>
              <li>To take full responsibility for the content of any automated messages you configure</li>
              <li>To keep your account credentials secure and not share access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Compliance with Meta Policies</h2>
            <p className="text-slate-700 leading-relaxed">
              You agree to comply with all applicable Meta policies including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mt-3">
              <li><a href="https://developers.facebook.com/terms/" className="text-primary underline" target="_blank" rel="noopener">Meta Platform Terms</a></li>
              <li><a href="https://www.facebook.com/policies/ads/" className="text-primary underline" target="_blank" rel="noopener">Instagram Community Guidelines</a></li>
              <li>Meta Messaging and Automation policies</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-3">
              GrowProfile is not responsible for any account restrictions, bans, or penalties imposed by Meta arising from your misuse of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Messaging Limitations</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Automated DMs can only be sent after a user has first interacted (e.g., left a comment) — in compliance with Instagram rules.</li>
              <li>All messaging must respect Instagram&apos;s 24-hour messaging window.</li>
              <li>GrowProfile does not guarantee message delivery. Delivery depends on Instagram API availability and recipient settings.</li>
              <li>Automated messages sent through the platform must include a disclosure that they are automated where required.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Account Access &amp; Permissions</h2>
            <p className="text-slate-700 leading-relaxed">
              By connecting your Instagram account via OAuth, you grant GrowProfile permission to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mt-3">
              <li>Read comments on your media posts</li>
              <li>Send automated replies to comments</li>
              <li>Send direct messages to users who interact with your content (when permitted by Instagram)</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-3">
              You can revoke these permissions at any time by disconnecting your Instagram account from the dashboard or from your Instagram account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Payments &amp; Subscriptions</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Paid plans are billed monthly or annually as selected at signup.</li>
              <li>Payments are processed securely through Stripe or Razorpay.</li>
              <li>Refunds are handled on a case-by-case basis. Contact support@growprofile.in for refund requests.</li>
              <li>We reserve the right to change pricing with reasonable notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Termination</h2>
            <p className="text-slate-700 leading-relaxed">We may suspend or terminate your access to GrowProfile if:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mt-3">
              <li>You violate these Terms or Meta&apos;s policies</li>
              <li>You misuse automation features</li>
              <li>Required by Meta or applicable law</li>
              <li>You engage in fraudulent or abusive behavior</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-3">
              You may terminate your account at any time. To request data deletion upon termination, visit our <Link href="/data-deletion" className="text-primary underline">Data Deletion page</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-slate-700 leading-relaxed">
              To the maximum extent permitted by law, GrowProfile and ScorpixMedia shall not be liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 mt-3">
              <li>Instagram account restrictions, bans, or penalties caused by your use or misuse of the Service</li>
              <li>Loss of data, followers, or engagement</li>
              <li>API limitations, outages, or changes imposed by Meta</li>
              <li>Indirect, incidental, or consequential damages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Intellectual Property</h2>
            <p className="text-slate-700 leading-relaxed">
              GrowProfile and the GrowProfile logo are trademarks of ScorpixMedia. All platform content, design, and code remain the intellectual property of ScorpixMedia.
              You may not copy, reproduce, or redistribute any part of the Service without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Changes to Service</h2>
            <p className="text-slate-700 leading-relaxed">
              We may modify, suspend, or discontinue features of the Service at any time. We will provide reasonable notice for material changes.
              Continued use of the Service after changes constitutes your acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Governing Law</h2>
            <p className="text-slate-700 leading-relaxed">
              These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Contact</h2>
            <ul className="list-none pl-0 space-y-1 text-slate-700">
              <li><strong>Support:</strong> support@growprofile.in</li>
              <li><strong>General Enquiries:</strong> info@growprofile.in</li>
              <li><strong>Website:</strong> <Link href="/" className="text-primary underline">https://growprofile.in</Link></li>
            </ul>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} GrowProfile by ScorpixMedia. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-primary">Terms of Service</Link>
            <Link href="/data-deletion" className="text-sm text-slate-500 hover:text-primary">Data Deletion</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}


