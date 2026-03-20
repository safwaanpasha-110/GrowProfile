import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Data Deletion - GrowProfile',
  description: 'Request deletion of your GrowProfile data including Instagram tokens and campaign history.',
}

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="GrowProfile Logo" width={36} height={36} className="rounded-lg" />
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
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Data Deletion</h1>
        <p className="text-slate-500 mb-12">Last updated: March 20, 2026</p>

        <div className="space-y-8">

          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">How to Request Data Deletion</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You can request the complete deletion of your GrowProfile account and all associated data at any time through any of the following methods:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5">1</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Via Dashboard</h3>
                  <p className="text-slate-600 text-sm">Log in to your GrowProfile account → Account Settings → Delete Account.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5">2</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Via Email</h3>
                  <p className="text-slate-600 text-sm">
                    Send an email to{' '}
                    <a href="mailto:support@growprofile.in" className="text-primary underline">support@growprofile.in</a>
                    {' '}with the subject line <strong>&quot;Data Deletion Request&quot;</strong> and include your registered email address.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5">3</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Via Instagram (Meta)</h3>
                  <p className="text-slate-600 text-sm">
                    If you originally connected through Instagram/Facebook Login, you can revoke app access from your Instagram settings under
                    <strong> Apps and Websites</strong>. After revocation, we will automatically delete your data within 30 days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">What Data Gets Deleted</h2>
            <p className="text-slate-700 leading-relaxed mb-4">Upon a deletion request, we permanently remove:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Your GrowProfile account and profile information</li>
              <li>Instagram access tokens and authentication data</li>
              <li>All campaigns and automation rules you created</li>
              <li>Comment and direct message interaction history</li>
              <li>Subscription and billing history (financial records may be retained as required by law)</li>
              <li>Any activity logs and analytics data</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Timeline</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>Deletion requests submitted via the dashboard are processed <strong>immediately</strong>.</li>
              <li>Deletion requests via email are processed within <strong>7 business days</strong>.</li>
              <li>Backup copies may be retained for up to <strong>30 days</strong> before permanent deletion from all systems.</li>
              <li>We will send a confirmation email once deletion is complete.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Retained by Law</h2>
            <p className="text-slate-700 leading-relaxed">
              Some data may be retained where required by applicable law, including financial transaction records required for tax and accounting compliance. This data is not used for any other purpose.
            </p>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact</h2>
            <p className="text-slate-700 leading-relaxed">
              For any questions about data deletion or privacy, contact us:
            </p>
            <ul className="list-none pl-0 space-y-1 text-slate-700 mt-3">
              <li><strong>Email:</strong> <a href="mailto:support@growprofile.in" className="text-primary underline">support@growprofile.in</a></li>
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
            <Link href="/terms" className="text-sm text-slate-500 hover:text-primary">Terms of Service</Link>
            <Link href="/data-deletion" className="text-sm text-primary">Data Deletion</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
