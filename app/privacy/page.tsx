import type { Metadata } from 'next'
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
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary"></div>
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
        <p className="text-slate-500 mb-12">Last updated: March 4, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-700 leading-relaxed">
              GrowProfile (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is operated by ScorpixMedia. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website at <strong>growprofile.in</strong> and our Instagram automation services (collectively, the &quot;Service&quot;). By using the Service, you consent to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-medium text-slate-800 mt-6 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>Account Information:</strong> Name, email address, and password when you create an account via Firebase Authentication.</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through Stripe and/or Razorpay. We do not store full credit card numbers.</li>
              <li><strong>Campaign Configuration:</strong> Keywords, DM templates, and campaign settings you create.</li>
            </ul>

            <h3 className="text-lg font-medium text-slate-800 mt-6 mb-3">2.2 Information from Instagram (Meta Platform)</h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>Instagram Profile Data:</strong> Username, profile picture, account type, and Instagram Business/Creator account ID.</li>
              <li><strong>Media &amp; Comments:</strong> Public posts, comments on your media, and associated metadata — accessed via the official Instagram Graph API.</li>
              <li><strong>Direct Messages:</strong> We send automated DMs on your behalf through the Instagram Messaging API. We store message delivery status and metadata but do not read or store the content of messages you receive.</li>
              <li><strong>Access Tokens:</strong> OAuth tokens granted by Instagram are encrypted at rest using AES-256-GCM and stored securely in our database.</li>
            </ul>

            <h3 className="text-lg font-medium text-slate-800 mt-6 mb-3">2.3 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>Usage Data:</strong> Pages visited, features used, campaign performance metrics.</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers.</li>
              <li><strong>Cookies:</strong> Session cookies for authentication and preference storage.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>To provide, maintain, and improve the Service.</li>
              <li>To execute automated DM campaigns on your behalf via Instagram&apos;s official APIs.</li>
              <li>To monitor comments on your Instagram media for keyword triggers.</li>
              <li>To process payments and manage your subscription.</li>
              <li>To send transactional emails (welcome emails, campaign alerts, usage warnings).</li>
              <li>To detect and prevent abuse, fraud, and violations of our Terms of Service.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Instagram (Meta) Platform Data</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We access Instagram data exclusively through Meta&apos;s official APIs and comply with the <a href="https://developers.facebook.com/terms/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meta Platform Terms</a> and <a href="https://developers.facebook.com/devpolicy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Developer Policies</a>.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>We only request permissions necessary for the Service to function: <code className="bg-slate-100 px-1 rounded text-sm">instagram_business_basic</code>, <code className="bg-slate-100 px-1 rounded text-sm">instagram_business_manage_messages</code>, <code className="bg-slate-100 px-1 rounded text-sm">instagram_business_manage_comments</code>, and <code className="bg-slate-100 px-1 rounded text-sm">instagram_business_content_publish</code>.</li>
              <li>We do not sell, rent, or share Instagram data with third parties for their own purposes.</li>
              <li>We do not use Instagram data for advertising, profiling, or purposes unrelated to the Service.</li>
              <li>You may revoke access at any time through your Instagram settings or by disconnecting your account in our dashboard.</li>
              <li>Upon account deletion, all Instagram tokens and associated data are permanently deleted within 30 days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Data Sharing &amp; Third Parties</h2>
            <p className="text-slate-700 leading-relaxed mb-4">We do not sell your personal information. We share data only with:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>Meta/Instagram:</strong> To execute API calls on your behalf (sending DMs, reading comments).</li>
              <li><strong>Payment Processors:</strong> Stripe and Razorpay for subscription billing.</li>
              <li><strong>Email Provider:</strong> Resend for transactional emails.</li>
              <li><strong>Firebase (Google):</strong> For authentication services.</li>
              <li><strong>Law Enforcement:</strong> When required by law, legal process, or to protect our rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Data Security</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>All Instagram access tokens are encrypted using AES-256-GCM before storage.</li>
              <li>All data in transit is encrypted via TLS/HTTPS.</li>
              <li>Database access is restricted and protected by authentication.</li>
              <li>We regularly review our security practices, but no method of transmission over the Internet is 100% secure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>Account Data:</strong> Retained for the duration of your account. Deleted within 30 days of account deletion request.</li>
              <li><strong>Campaign Data:</strong> Retained while your account is active. Archived campaigns are retained for 90 days after archival.</li>
              <li><strong>DM Logs:</strong> Message delivery metadata is retained for 90 days for analytics and debugging.</li>
              <li><strong>Instagram Tokens:</strong> Encrypted tokens are deleted immediately upon account disconnection or deletion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Your Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data.</li>
              <li><strong>Deletion:</strong> Request deletion of your account and all associated data.</li>
              <li><strong>Portability:</strong> Request your data in a machine-readable format.</li>
              <li><strong>Withdraw Consent:</strong> Disconnect your Instagram account or delete your GrowProfile account at any time.</li>
              <li><strong>Object:</strong> Object to processing of your data for specific purposes.</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              To exercise any of these rights, email us at <a href="mailto:privacy@growprofile.in" className="text-primary hover:underline">privacy@growprofile.in</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Cookies</h2>
            <p className="text-slate-700 leading-relaxed">
              We use essential cookies for authentication and session management. We do not use tracking cookies or third-party advertising cookies. You can disable cookies in your browser settings, but some features of the Service may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-slate-700 leading-relaxed">
              The Service is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we learn that we have collected data from a child under 18, we will delete that information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Changes to This Policy</h2>
            <p className="text-slate-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Contact Us</h2>
            <p className="text-slate-700 leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, contact us at:
            </p>
            <div className="mt-4 p-6 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-800 font-medium">ScorpixMedia</p>
              <p className="text-slate-600">Email: <a href="mailto:privacy@growprofile.in" className="text-primary hover:underline">privacy@growprofile.in</a></p>
              <p className="text-slate-600">Website: <a href="https://growprofile.in" className="text-primary hover:underline">growprofile.in</a></p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">&copy; 2026 ScorpixMedia. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-primary font-medium">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-500 hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
