import type { Metadata } from 'next'
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
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-12">Last updated: March 4, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-700 leading-relaxed">
              By accessing or using GrowProfile (&quot;Service&quot;), operated by ScorpixMedia (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree, do not use the Service. The Service is available at <strong>growprofile.in</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Description of Service</h2>
            <p className="text-slate-700 leading-relaxed">
              GrowProfile is an Instagram automation platform that enables users to create automated Direct Message (DM) campaigns triggered by comments on their Instagram posts. The Service uses Meta&apos;s official Instagram Graph API and Instagram Messaging API to perform all actions on your behalf.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Eligibility</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>You must be at least 18 years old to use the Service.</li>
              <li>You must have an Instagram Business or Creator account.</li>
              <li>You must have the legal authority to bind yourself or your organization to these Terms.</li>
              <li>You must comply with all applicable laws and Instagram&apos;s Terms of Use.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Account Registration</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>You must provide accurate and complete information during registration.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must notify us immediately of any unauthorized access to your account.</li>
              <li>You may not share your account with others or create multiple accounts.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Instagram API Compliance</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              By using the Service, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>All Instagram interactions are performed through Meta&apos;s official APIs in compliance with the <a href="https://developers.facebook.com/terms/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meta Platform Terms</a>.</li>
              <li>You grant us permission to access your Instagram Business/Creator account data and send DMs on your behalf.</li>
              <li>You are responsible for the content of all automated messages sent through your campaigns.</li>
              <li>You must not use the Service to send spam, harassment, misleading content, or any content that violates Instagram&apos;s Community Guidelines.</li>
              <li>Meta may change API access, rate limits, or policies at any time, which may affect Service functionality.</li>
              <li>You may revoke our access to your Instagram account at any time through Instagram settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Acceptable Use</h2>
            <p className="text-slate-700 leading-relaxed mb-4">You agree NOT to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Send unsolicited spam messages or bulk promotional content.</li>
              <li>Harass, intimidate, threaten, or abuse other Instagram users.</li>
              <li>Send misleading, deceptive, or fraudulent messages.</li>
              <li>Promote illegal activities, hate speech, or harmful content.</li>
              <li>Attempt to circumvent rate limits or abuse the Instagram API.</li>
              <li>Scrape, crawl, or collect data beyond what the API provides.</li>
              <li>Interfere with the operation of the Service or other users&apos; accounts.</li>
              <li>Reverse engineer, decompile, or attempt to extract the source code of the Service.</li>
              <li>Violate any applicable law, regulation, or third-party rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Subscription &amp; Billing</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong>Free Plan:</strong> Limited features available at no cost, subject to usage limits.</li>
              <li><strong>Paid Plans:</strong> Billed monthly through Stripe or Razorpay. The Pro plan starts at ₹249/month ($2.99 introductory, then $5/month).</li>
              <li><strong>Auto-Renewal:</strong> Subscriptions auto-renew unless cancelled before the end of the billing period.</li>
              <li><strong>Cancellation:</strong> You may cancel at any time from your dashboard. Access continues until the end of the current billing period.</li>
              <li><strong>Refunds:</strong> We offer refunds within 7 days of initial purchase if the Service does not function as described. No refunds for partial months or after the 7-day period.</li>
              <li><strong>Price Changes:</strong> We may change pricing with 30 days&apos; notice. Existing subscriptions will be honoured until renewal.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Rate Limits &amp; Fair Use</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>The Service enforces rate limits in compliance with Instagram&apos;s API policies (currently 40 DMs/hour and 200 DMs/day per account).</li>
              <li>Usage limits vary by plan tier (Free: 50 DMs/month, Pro: 10,000 DMs/month).</li>
              <li>We reserve the right to throttle or suspend accounts that abuse rate limits or engage in patterns that risk our API access.</li>
              <li>Our abuse detection system may automatically pause campaigns that exhibit suspicious behavior.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>The Service, including its design, code, branding, and documentation, is owned by ScorpixMedia.</li>
              <li>You retain ownership of all content you create (DM templates, campaign configurations).</li>
              <li>You grant us a limited license to use your content solely to operate the Service on your behalf.</li>
              <li>GrowProfile and the GrowProfile logo are trademarks of ScorpixMedia.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Disclaimer of Warranties</h2>
            <p className="text-slate-700 leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT INSTAGRAM&apos;S API WILL REMAIN AVAILABLE OR UNCHANGED.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Limitation of Liability</h2>
            <p className="text-slate-700 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SCORPIXMEDIA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, BUSINESS OPPORTUNITIES, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE. OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Indemnification</h2>
            <p className="text-slate-700 leading-relaxed">
              You agree to indemnify and hold harmless ScorpixMedia, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Termination</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>You may terminate your account at any time from your dashboard settings.</li>
              <li>We may suspend or terminate your account immediately if you violate these Terms.</li>
              <li>Upon termination, your right to use the Service ceases immediately.</li>
              <li>We will delete your data in accordance with our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</li>
              <li>Sections on liability, indemnification, and dispute resolution survive termination.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">14. Dispute Resolution</h2>
            <p className="text-slate-700 leading-relaxed">
              These Terms are governed by the laws of India. Any disputes shall first be attempted to be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to binding arbitration in accordance with the Arbitration and Conciliation Act, 1996. The venue for any legal proceedings shall be Bangalore, Karnataka, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">15. Changes to Terms</h2>
            <p className="text-slate-700 leading-relaxed">
              We may modify these Terms at any time. Material changes will be communicated via email or a prominent notice on the Service at least 15 days before they take effect. Your continued use of the Service after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">16. Contact Us</h2>
            <p className="text-slate-700 leading-relaxed">
              For questions about these Terms, contact us at:
            </p>
            <div className="mt-4 p-6 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-800 font-medium">ScorpixMedia</p>
              <p className="text-slate-600">Email: <a href="mailto:legal@growprofile.in" className="text-primary hover:underline">legal@growprofile.in</a></p>
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
            <Link href="/privacy" className="text-slate-500 hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-primary font-medium">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
