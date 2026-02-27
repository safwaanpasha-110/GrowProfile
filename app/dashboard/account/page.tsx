'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Instagram,
  Link2,
  Unlink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  User as UserIcon,
  Shield,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface IgAccount {
  id: string
  igUserId: string
  igUsername: string
  isActive: boolean
  tokenExpiresAt: string | null
  tokenStatus: 'valid' | 'expiring_soon' | 'expired' | 'unknown'
  subscribedWebhooks: boolean
  campaignCount: number
  interactionCount: number
  createdAt: string
}

export default function AccountPage() {
  const { user, authFetch, refreshProfile } = useAuth()
  const searchParams = useSearchParams()
  const [igAccounts, setIgAccounts] = useState<IgAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Show toast from URL params (redirect from OAuth callback)
  useEffect(() => {
    const igConnected = searchParams.get('ig_connected')
    const igError = searchParams.get('ig_error')
    if (igConnected) {
      setToast({ type: 'success', message: `Successfully connected @${igConnected}!` })
      refreshProfile()
    } else if (igError) {
      setToast({ type: 'error', message: igError })
    }
  }, [searchParams, refreshProfile])

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 6000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await authFetch('/api/instagram/accounts')
      const data = await res.json()
      if (data.success) {
        setIgAccounts(data.accounts)
      }
    } catch (err) {
      console.error('Failed to fetch IG accounts:', err)
    } finally {
      setLoading(false)
    }
  }, [authFetch])

  useEffect(() => {
    if (user) fetchAccounts()
  }, [user, fetchAccounts])

  const handleConnect = async () => {
    setConnecting(true)
    try {
      const res = await authFetch('/api/instagram/auth')
      const data = await res.json()
      if (data.authUrl) {
        window.location.href = data.authUrl
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to start Instagram auth' })
        setConnecting(false)
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to initiate connection' })
      setConnecting(false)
    }
  }

  const handleDisconnect = async (accountId: string, username: string) => {
    if (!confirm(`Disconnect @${username}? All related campaigns will be paused.`)) return
    setDisconnecting(accountId)
    try {
      const res = await authFetch('/api/instagram/accounts', {
        method: 'DELETE',
        body: JSON.stringify({ accountId }),
      })
      const data = await res.json()
      if (data.success) {
        setToast({ type: 'success', message: `Disconnected @${username}` })
        fetchAccounts()
        refreshProfile()
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to disconnect' })
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to disconnect account' })
    } finally {
      setDisconnecting(null)
    }
  }

  const handleRefreshToken = async (accountId: string) => {
    setRefreshing(accountId)
    try {
      const res = await authFetch('/api/instagram/accounts', {
        method: 'POST',
        body: JSON.stringify({ accountId, action: 'refresh_token' }),
      })
      const data = await res.json()
      if (data.success) {
        setToast({ type: 'success', message: 'Token refreshed successfully' })
        fetchAccounts()
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to refresh token' })
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to refresh token' })
    } finally {
      setRefreshing(null)
    }
  }

  const maxAccounts = user?.plan?.maxIgAccounts ?? 1
  const canConnect = igAccounts.length < maxAccounts

  const tokenStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Valid</Badge>
      case 'expiring_soon':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> Expiring Soon</Badge>
      case 'expired':
        return <Badge className="bg-red-100 text-red-700 border-red-200"><AlertCircle className="w-3 h-3 mr-1" /> Expired</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile, Instagram accounts, and security</p>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          toast.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Instagram Accounts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Instagram className="w-5 h-5" />
                  Instagram Accounts
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {igAccounts.length}/{maxAccounts} connected
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {igAccounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                          <Instagram className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">@{acc.igUsername}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {tokenStatusBadge(acc.tokenStatus)}
                            {acc.isActive ? (
                              <Badge variant="outline" className="text-xs">Active</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {acc.campaignCount} campaigns &middot; {acc.interactionCount} interactions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(acc.tokenStatus === 'expiring_soon' || acc.tokenStatus === 'expired') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRefreshToken(acc.id)}
                            disabled={refreshing === acc.id}
                          >
                            {refreshing === acc.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 border-red-200"
                          onClick={() => handleDisconnect(acc.id, acc.igUsername)}
                          disabled={disconnecting === acc.id}
                        >
                          {disconnecting === acc.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Unlink className="w-4 h-4 mr-1" /> Disconnect
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}

                  {igAccounts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Instagram className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No Instagram accounts connected</p>
                      <p className="text-sm mt-1">
                        Connect your Instagram Business account to start creating AutoDM campaigns
                      </p>
                    </div>
                  )}

                  {canConnect ? (
                    <Button
                      onClick={handleConnect}
                      disabled={connecting}
                      className="w-full gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500"
                    >
                      {connecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Link2 className="w-4 h-4" />
                      )}
                      Connect Instagram Account
                    </Button>
                  ) : (
                    <div className="text-center p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                      You&apos;ve reached your plan limit ({maxAccounts} account{maxAccounts > 1 ? 's' : ''}).
                      Upgrade to connect more accounts.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{user?.name || 'User'}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <Input
                      defaultValue={user?.name || ''}
                      className="border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <Input
                      type="email"
                      defaultValue={user?.email || ''}
                      disabled
                      className="border-border bg-muted text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your account is secured through Firebase Authentication.
                Password and 2FA settings are managed by Google.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-base">Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Plan</p>
                  <p className="font-medium text-foreground">
                    {user?.plan?.displayName || 'Starter'}
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-muted-foreground mb-1">Subscription</p>
                  <p className="font-medium text-foreground capitalize">
                    {user?.subscription?.status?.toLowerCase() || 'Free'}
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-muted-foreground mb-1">Instagram Accounts</p>
                  <p className="font-medium text-foreground">
                    {igAccounts.length} of {maxAccounts} connected
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-muted-foreground mb-1">Campaigns</p>
                  <p className="font-medium text-foreground">{user?.stats?.campaigns ?? 0}</p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-muted-foreground mb-1">Leads Collected</p>
                  <p className="font-medium text-foreground">{user?.stats?.leads ?? 0}</p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-muted-foreground mb-1">Role</p>
                  <Badge variant="outline">{user?.role}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
