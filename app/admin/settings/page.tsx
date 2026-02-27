'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Configure platform-wide settings and integrations.</p>
      </div>

      {/* General Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Platform Name</label>
            <Input
              defaultValue="GrowProfile"
              className="max-w-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Support Email</label>
            <Input
              type="email"
              defaultValue="support@growprofile.com"
              className="max-w-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">API Base URL</label>
            <Input
              defaultValue="https://api.growprofile.com"
              className="max-w-md"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">SMTP Host</label>
            <Input
              defaultValue="smtp.gmail.com"
              className="max-w-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">SMTP Port</label>
            <Input
              type="number"
              defaultValue="587"
              className="max-w-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">From Address</label>
            <Input
              type="email"
              defaultValue="noreply@growprofile.com"
              className="max-w-md"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90">Test Connection</Button>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Stripe Public Key</label>
            <Input
              defaultValue="pk_test_..."
              className="max-w-md"
              type="password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Stripe Secret Key</label>
            <Input
              defaultValue="sk_test_..."
              className="max-w-md"
              type="password"
            />
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> These are test keys. Replace with production keys when going live.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Update Keys</Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Two-Factor Authentication</p>
              <p className="text-sm text-slate-600">Require 2FA for admin accounts</p>
            </div>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          <hr className="border-slate-200" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Session Timeout</p>
              <p className="text-sm text-slate-600">Auto-logout after inactivity</p>
            </div>
            <Input
              type="number"
              defaultValue="30"
              className="w-24"
              placeholder="Minutes"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90">Update Security</Button>
        </CardContent>
      </Card>
    </div>
  )
}
