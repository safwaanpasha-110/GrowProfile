'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { formatDateTime } from '@/lib/utils'
import {
  Activity, MessageCircle, MessageSquare, Zap, CheckCircle2,
  Clock, AlertCircle, Loader2, RefreshCw, ToggleLeft, ToggleRight,
  Filter, ArrowDownToLine, Bot, Hash
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// ─── Types ────────────────────────────────────────────────

interface WebhookEvent {
  id: string
  eventType: string
  payload: Record<string, any>
  status: string
  processedAt: string | null
  createdAt: string
  igAccount: { igUsername: string } | null
}

interface EventRow {
  id: string
  type: 'comment' | 'message' | 'postback' | 'other'
  username: string
  content: string
  status: 'received' | 'processed' | 'failed'
  igAccount: string
  timestamp: string
  triggerMatched?: boolean
}

// ─── Demo Data ────────────────────────────────────────────

const DEMO_EVENTS: EventRow[] = [
  { id: 'e1', type: 'comment', username: 'john_doe', content: 'price', status: 'processed', igAccount: 'mybrand', timestamp: new Date(Date.now() - 120000).toISOString(), triggerMatched: true },
  { id: 'e2', type: 'message', username: 'anna_smith', content: 'details please', status: 'processed', igAccount: 'mybrand', timestamp: new Date(Date.now() - 600000).toISOString(), triggerMatched: true },
  { id: 'e3', type: 'comment', username: 'raj_patel', content: 'info', status: 'processed', igAccount: 'mybrand', timestamp: new Date(Date.now() - 3600000).toISOString(), triggerMatched: true },
  { id: 'e4', type: 'comment', username: 'mike_d', content: 'great post!', status: 'received', igAccount: 'mybrand', timestamp: new Date(Date.now() - 4000000).toISOString(), triggerMatched: false },
  { id: 'e5', type: 'message', username: 'sara_k', content: 'link', status: 'processed', igAccount: 'mybrand', timestamp: new Date(Date.now() - 7200000).toISOString(), triggerMatched: true },
  { id: 'e6', type: 'postback', username: 'raj_patel', content: 'CHECK_FOLLOW:campaign_1:interaction_3', status: 'processed', igAccount: 'mybrand', timestamp: new Date(Date.now() - 3500000).toISOString(), triggerMatched: false },
  { id: 'e7', type: 'comment', username: 'user_xyz', content: 'lol', status: 'received', igAccount: 'mybrand', timestamp: new Date(Date.now() - 8000000).toISOString(), triggerMatched: false },
  { id: 'e8', type: 'message', username: 'buyer99', content: 'pricing', status: 'processed', igAccount: 'mybrand', timestamp: new Date(Date.now() - 10000000).toISOString(), triggerMatched: true },
]

// ─── Parse real webhook event payload ────────────────────

function parseWebhookEvent(event: WebhookEvent): EventRow {
  const payload = event.payload || {}
  let username = 'unknown'
  let content = ''
  let type: EventRow['type'] = 'other'

  try {
    if (event.eventType === 'comment' || event.eventType === 'comments') {
      type = 'comment'
      username = payload.from?.username || payload.username || 'unknown'
      content = payload.text || payload.comment || ''
    } else if (event.eventType === 'message' || event.eventType === 'messages') {
      type = 'message'
      username = payload.from?.username || payload.sender?.username || 'unknown'
      content = payload.text || payload.message?.text || ''
    } else if (event.eventType === 'postback') {
      type = 'postback'
      username = payload.sender?.id || 'unknown'
      content = payload.postback?.payload || ''
    }
  } catch {
    // ignore parse errors
  }

  return {
    id: event.id,
    type,
    username,
    content: content || JSON.stringify(payload).slice(0, 80),
    status: event.status === 'PROCESSED' ? 'processed' : event.status === 'FAILED' ? 'failed' : 'received',
    igAccount: event.igAccount?.igUsername || 'unknown',
    timestamp: event.createdAt,
  }
}

// ─── Helpers ──────────────────────────────────────────────

const typeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  comment: { icon: MessageCircle, label: 'Comment Received', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300' },
  message: { icon: MessageSquare, label: 'Message Received', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300' },
  postback: { icon: Bot, label: 'Button Postback', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300' },
  other: { icon: Activity, label: 'Webhook Event', color: 'text-muted-foreground bg-muted' },
}

const statusConfig = {
  processed: { icon: CheckCircle2, label: 'Processed', color: 'text-green-600' },
  received: { icon: Clock, label: 'Received', color: 'text-amber-500' },
  failed: { icon: AlertCircle, label: 'Failed', color: 'text-red-500' },
}

// ─── Main Component ───────────────────────────────────────

export default function ActivityPage() {
  const { user, authFetch } = useAuth()
  const igAccount = user?.instagramAccounts?.[0]

  const [demoMode, setDemoMode] = useState(false)
  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<'all' | 'comment' | 'message' | 'postback'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'processed' | 'received' | 'failed'>('all')

  const fetchEvents = useCallback(async () => {
    if (demoMode) {
      setEvents(DEMO_EVENTS)
      setLoading(false)
      return
    }
    if (!igAccount) { setLoading(false); return }
    try {
      setLoading(true)
      const res = await authFetch(`/api/inbox?igAccountId=${igAccount.id}`)
      const data = await res.json()
      if (data.success) {
        const parsed = (data.events || []).map(parseWebhookEvent)
        setEvents(parsed)
      }
    } catch (err) {
      console.error('Failed to fetch events', err)
    } finally {
      setLoading(false)
    }
  }, [demoMode, igAccount, authFetch])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const filtered = events.filter(e =>
    (filterType === 'all' || e.type === filterType) &&
    (filterStatus === 'all' || e.status === filterStatus)
  )

  const stats = {
    total: events.length,
    comments: events.filter(e => e.type === 'comment').length,
    messages: events.filter(e => e.type === 'message').length,
    triggered: events.filter(e => e.triggerMatched).length,
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Activity Log</h1>
            <p className="text-xs text-muted-foreground">Webhook events received from Instagram</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
              demoMode
                ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300'
                : 'bg-muted border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {demoMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            Demo {demoMode ? 'ON' : 'OFF'}
          </button>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-lg" onClick={fetchEvents}>
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {demoMode && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" />
          <strong>Demo Mode ON</strong> — showing sample webhook events for Meta App Review demonstration
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Events', value: stats.total, icon: Activity, color: 'from-primary to-secondary' },
          { label: 'Comments', value: stats.comments, icon: MessageCircle, color: 'from-blue-500 to-blue-600' },
          { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'from-purple-500 to-purple-600' },
          { label: 'Triggers Fired', value: stats.triggered, icon: Zap, color: 'from-green-500 to-emerald-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-xl bg-card border border-border">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Filter:</span>
        </div>
        <div className="flex gap-1">
          {(['all', 'comment', 'message', 'postback'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterType === t ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1) + 's'}
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-2">
          {(['all', 'processed', 'received', 'failed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Event list */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-12 px-4 py-2.5 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="col-span-3">Event</span>
          <span className="col-span-2">Username</span>
          <span className="col-span-4">Content</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-2">Timestamp (IST)</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <ArrowDownToLine className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No events yet</p>
            <p className="text-xs text-muted-foreground">Webhook events will appear here as Instagram sends them. Enable Demo Mode to preview.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((event) => {
              const cfg = typeConfig[event.type] || typeConfig.other
              const TypeIcon = cfg.icon
              const stCfg = statusConfig[event.status]
              const StatusIcon = stCfg.icon

              return (
                <div key={event.id} className="grid grid-cols-12 px-4 py-3.5 hover:bg-muted/30 transition-colors items-center">
                  {/* Event type */}
                  <div className="col-span-3 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                      <TypeIcon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                    {event.triggerMatched && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        <Zap className="w-2.5 h-2.5" /> Trigger
                      </span>
                    )}
                  </div>

                  {/* Username */}
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-foreground">@{event.username}</span>
                    {event.igAccount !== 'unknown' && (
                      <p className="text-[10px] text-muted-foreground">→ @{event.igAccount}</p>
                    )}
                  </div>

                  {/* Content */}
                  <div className="col-span-4">
                    <p className="text-sm text-foreground truncate">&quot;{event.content}&quot;</p>
                    {event.type === 'comment' && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">💬 Comment on post</p>
                    )}
                    {event.type === 'message' && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">✉️ Direct Message</p>
                    )}
                    {event.type === 'postback' && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">🔘 Button interaction</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`flex items-center gap-1 text-xs font-medium ${stCfg.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {stCfg.label}
                    </span>
                  </div>

                  {/* Timestamp */}
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">{formatDateTime(event.timestamp)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
