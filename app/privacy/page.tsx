import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - GrowProfile',
  description: 'GrowProfile Privacy Policy — how we collect, use, and protect your data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo-20260320.png" alt="GrowProfile Logo" width={36} height={36} className="rounded-lg" />
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
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-12">Last updated: March 20, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-700 leading-relaxed">
              GrowProfile (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is operated by ScorpixMedia. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our website at <strong>growprofile.in</strong> and our Instagram
              automation services (collectively, the &quot;Service&quot;). By using the Service, you consent to the practices described in this policy.
            </p>
            <p className="text-slate-700 leading-relaxed mt-3">
              We comply with Meta Platform Terms and Developer Policies. We use Instagram APIs provided by Meta Platforms, Inc.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-medium text-slate-800 mt-6 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>Account Information:</strong> Name and email address when you create an account via Google or email authentication.</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through Stripe and/or Razorpay. We do not store full credit card numbers.</li>
              <li><strong>Campaign Configuration:</strong> Keywords, DM templates, and campaign settings you create.</li>
            </ul>

            <h3 className="text-lg font-medium text-slate-800 mt-6 mb-3">2.2 Information from Instagram (Meta Platform)</h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>Instagram Account ID and Username:</strong> Used to identify your professional account.</li>
              <li><strong>Access Tokens:</strong> OAuth tokens granted by Instagram via the official Meta login flow. We do NOT collect your Instagram password.</li>
              <li><strong>Media &amp; Comments:</strong> Public posts and comments on your media, accessed via the official Instagram Graph API to power automation.</li>
              <li><strong>Direct Messages:</strong> We send automated DMs on your behalf through the Instagram Messaging API. We store message delivery status and metadata but do not read or store messages sent to you by other users.</li>
              <li><strong>User Interactions:</strong> Comment triggers, reply events, and automation-related metadata.</li>
            </ul>

            <h3 className="text-lg font-medium text-slate-800 mt-6 mb-3">2.3 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>IP address, browser type, and device information for security and analytics.</li>
              <li>Usage data including pages visited and features used.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. How We Use Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Provide the automated comment-reply and DM messaging features.</li>
              <li>Detect keywords in comments and trigger automation workflows.</li>
              <li>Send automated responses on your behalf as configured by you.</li>
              <li>Improve platform performance, reliability, and user experience.</li>
              <li>Process payments and manage subscriptions.</li>
              <li>Ensure compliance with Meta Platform Policies and applicable laws.</li>
              <li>Send service-related communications such as security alerts and policy updates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Data Sharing</h2>
            <p className="text-slate-700 leading-relaxed">
              We do <strong>NOT</strong> sell, rent, or trade your personal data to third parties.
            </p>
            <p className="text-slate-700 leading-relaxed mt-3">We may share data only in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>When required by applicable law or legal process.</li>
              <li>To comply with Meta Platform Terms and Developer Policies.</li>
              <li>With payment processors (Stripe, Razorpay) solely to process transactions.</li>
              <li>To provide core functionality of the Service to you.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Data Storage and Security</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>All Instagram access tokens are encrypted at rest using AES-256-GCM encryption.</li>
              <li>We implement industry-standard security measures including HTTPS, encrypted storage, and access controls.</li>
              <li>Data is stored only as long as necessary to provide the Service or as required by law.</li>
              <li>We do NOT expose tokens in the frontend or log sensitive credentials.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. User Control and Data Deletion</h2>
            <p className="text-slate-700 leading-relaxed">You have full control over your data:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>You can disconnect your Instagram account at any time from your dashboard settings.</li>
              <li>You can delete your GrowProfile account and all associated data at any time.</li>
              <li>To request complete data deletion, visit our <Link href="/data-deletion" className="text-primary underline">Data Deletion page</Link> or email <strong>support@growprofile.in</strong>.</li>
              <li>Upon request, we will delete all your data within <strong>7 business days</strong>, including access tokens, campaign data, and interaction history.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Third-Party Services</h2>
            <p className="text-slate-700 leading-relaxed">GrowProfile uses the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>Meta (Instagram) APIs</strong> — for authentication and automation features. Subject to <a href="https://developers.facebook.com/terms/" className="text-primary underline" target="_blank" rel="noopener">Meta Platform Terms</a> and <a href="https://www.facebook.com/privacy/policy/" className="text-primary underline" target="_blank" rel="noopener">Meta Privacy Policy</a>.</li>
              <li><strong>Firebase (Google)</strong> — for user authentication.</li>
              <li><strong>Stripe / Razorpay</strong> — for payment processing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Automated Messaging Disclosure</h2>
            <p className="text-slate-700 leading-relaxed">
              GrowProfile sends automated messages on behalf of users only when triggered by user-defined conditions (e.g., a comment containing a keyword).
              End-users receiving automated messages may be informed that they are interacting with an automated system. Messages are only sent within
              the 24-hour messaging window permitted by Instagram policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-slate-700 leading-relaxed">
              GrowProfile is not directed to individuals under the age of 18. We do not knowingly collect personal data from minors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-slate-700 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
              Continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Contact</h2>
            <p className="text-slate-700 leading-relaxed">For any privacy-related questions or data requests:</p>
            <ul className="list-none pl-0 space-y-1 text-slate-700 mt-3">
              <li><strong>Email:</strong> support@growprofile.in</li>
              <li><strong>Website:</strong> <Link href="/" className="text-primary underline">https://growprofile.in</Link></li>
              <li><strong>Data Deletion:</strong> <Link href="/data-deletion" className="text-primary underline">https://growprofile.in/data-deletion</Link></li>
            </ul>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} GrowProfile by ScorpixMedia. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-primary">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-primary">Terms of Service</Link>
            <Link href="/data-deletion" className="text-sm text-slate-500 hover:text-primary">Data Deletion</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}


