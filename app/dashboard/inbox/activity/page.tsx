'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { formatDateTime } from '@/lib/utils'
import {
  Activity, MessageCircle, MessageSquare, Zap, CheckCircle2,
  Clock, AlertCircle, Loader2, RefreshCw, ToggleLeft, ToggleRight,
  Filter, ArrowDownToLine, Bot, Send, Reply, Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'

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

// Direction + subtype for precise labelling
type EventKind =
  | 'comment_in'      // user commented on post
  | 'comment_reply'   // we replied publicly on post
  | 'dm_in'           // user sent us a DM
  | 'dm_sent'         // we sent an automated DM (isEcho)
  | 'follow_check'    // user tapped "I'm following" postback button
  | 'postback'        // other button tap
  | 'other'

interface EventRow {
  id: string
  kind: EventKind
  username: string
  content: string
  status: 'received' | 'processed' | 'failed'
  igAccount: string
  timestamp: string
  triggerMatched?: boolean
}

// ─── Demo Data ────────────────────────────────────────────

const _now = Date.now()
const DEMO_EVENTS: EventRow[] = [
  { id: 'e1', kind: 'comment_in',    username: 'john_doe',   content: 'price',                               status: 'processed', igAccount: 'mybrand', timestamp: new Date(_now - 60000).toISOString(),   triggerMatched: true  },
  { id: 'e2', kind: 'comment_reply', username: 'mybrand',    content: 'Sent you a DM! Check inbox 📥',       status: 'processed', igAccount: 'mybrand', timestamp: new Date(_now - 58000).toISOString(),   triggerMatched: false },
  { id: 'e3', kind: 'dm_sent',       username: 'AutoBot',    content: 'Hey john_doe 👋 Here\'s your link!',  status: 'processed', igAccount: 'mybrand', timestamp: new Date(_now - 55000).toISOString(),   triggerMatched: false },
  { id: 'e4', kind: 'comment_in',    username: 'anna_smith', content: 'details please',                      status: 'processed', igAccount: 'mybrand', timestamp: new Date(_now - 600000).toISOString(),  triggerMatched: true  },
  { id: 'e5', kind: 'comment_reply', username: 'mybrand',    content: 'Sent you a DM! Check inbox 📥',       status: 'processed', igAccount: 'mybrand', timestamp: new Date(_now - 598000).toISOString(),  triggerMatched: false },
  { id: 'e6', kind: 'dm_sent',       username: 'AutoBot',    content: '[Interactive DM with link button]',   status: 'processed', igAccount: 'mybrand', timestamp: new Date(_now - 595000).toISOString(),  triggerMatched: false },
  { id: 'e7', kind: 'comment_in',    username: 'raj_patel',  content: 'info',                                status: 'processed', igAccount: 'mybrand', timestamp: new Date(_now - 3600000).toISOString(), triggerMatched: true  },
  { id: 'e8', kind: 'follow_check',  username: 'raj_patel',  content: 'Tapped "I\'m following ✅" button',  status: 'processed', igAccount: 'mybrand', timestamp: new Date(_now - 3500000).toISOString(),  triggerMatched: false },
  { id: 'e9', kind: 'dm_in',         username: 'sara_k',     content: 'link',                                status: 'processed', igAccount: 'mybrand', timestamp: new Date(_now - 7200000).toISOString(), triggerMatched: true  },
]

// ─── Parse real webhook payload ──────────────────────────

function parseWebhookEvent(event: WebhookEvent, myUsername?: string): EventRow {
  const p = event.payload || {}
  let kind: EventKind = 'other'
  let username = 'unknown'
  let content = ''

  try {
    if (event.eventType === 'comments') {
      const fromUsername: string = p.from?.username || ''
      const isOwnReply = !!(myUsername && fromUsername &&
        fromUsername.toLowerCase() === myUsername.toLowerCase())
      kind = isOwnReply ? 'comment_reply' : 'comment_in'
      username = fromUsername || 'unknown'
      content = p.text || ''

    } else if (event.eventType === 'messages') {
      const isEcho = Boolean(p.isEcho ?? p.is_echo)
      if (isEcho) {
        kind = 'dm_sent'
        username = 'AutoBot'
        content = (p.text && p.text.trim()) ? p.text : '[Interactive DM with button]'
      } else {
        kind = 'dm_in'
        // resolvedUsername is injected by the API (looked up from Interaction records)
        // senderId is the raw IGSID — show truncated as last resort
        const senderId: string = p.senderId || ''
        username =
          p.resolvedUsername ||
          p.from?.username ||
          p.sender?.username ||
          (senderId ? `id:${senderId.slice(-6)}` : 'unknown')
        content = p.text || p.message?.text || ''
        if (!content.trim()) content = '[Voice / media message]'
      }

    } else if (event.eventType === 'postback') {
      const postbackPayload: string = p.postback?.payload || p.payload || ''
      if (postbackPayload.startsWith('CHECK_FOLLOW:')) {
        kind = 'follow_check'
        username = p.sender?.id || p.from?.id || 'unknown'
        content = 'Tapped "I\'m following ✅" button'
      } else {
        kind = 'postback'
        username = p.sender?.id || 'unknown'
        content = postbackPayload || '[button tap]'
      }
    }
  } catch {
    // keep defaults
  }

  return {
    id: event.id,
    kind,
    username: username || 'unknown',
    content: content || '[no content]',
    status: event.status === 'PROCESSED' ? 'processed'
      : event.status === 'FAILED' ? 'failed'
      : 'received',
    igAccount: event.igAccount?.igUsername || 'unknown',
    timestamp: event.createdAt,
  }
}

// ─── Kind config ─────────────────────────────────────────

const kindConfig: Record<EventKind, { icon: React.ElementType; label: string; color: string; sub: string }> = {
  comment_in:    { icon: MessageCircle, label: 'Comment Received',   color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300',       sub: '💬 On post' },
  comment_reply: { icon: Reply,         label: 'Comment Reply Sent', color: 'text-teal-600 bg-teal-100 dark:bg-teal-900/40 dark:text-teal-300',       sub: '↩ Public reply' },
  dm_in:         { icon: MessageSquare, label: 'DM Received',        color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300', sub: '✉ Direct Message' },
  dm_sent:       { icon: Send,          label: 'Automated DM Sent',  color: 'text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-300',    sub: '🤖 Bot sent' },
  follow_check:  { icon: CheckCircle2,  label: 'Follow Verified',   color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300',    sub: '👤 Follow button' },
  postback:      { icon: Bot,           label: 'Button Tap',         color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-300', sub: '🔘 Postback' },
  other:         { icon: Activity,      label: 'Webhook Event',      color: 'text-muted-foreground bg-muted',                                           sub: '' },
}

const statusConfig = {
  processed: { icon: CheckCircle2, label: 'Processed', color: 'text-green-600' },
  received:  { icon: Clock,        label: 'Pending',   color: 'text-amber-500' },
  failed:    { icon: AlertCircle,  label: 'Failed',    color: 'text-red-500'   },
}

const FILTER_KINDS = [
  { value: 'all',           label: 'All'             },
  { value: 'comment_in',    label: 'Comments In'     },
  { value: 'comment_reply', label: 'Replies Sent'    },
  { value: 'dm_in',         label: 'DMs Received'    },
  { value: 'dm_sent',       label: 'DMs Sent'        },
  { value: 'follow_check',  label: 'Follow Verified' },
]

// ─── Main Component ───────────────────────────────────────

export default function ActivityPage() {
  const { user, authFetch } = useAuth()
  const igAccount = user?.instagramAccounts?.[0]

  const [demoMode, setDemoMode]           = useState(false)
  const [events, setEvents]               = useState<EventRow[]>([])
  const [loading, setLoading]             = useState(true)
  const [filterKind, setFilterKind]       = useState('all')
  const [filterStatus, setFilterStatus]   = useState<'all' | 'processed' | 'received' | 'failed'>('all')
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [clearing, setClearing]           = useState(false)

  const fetchEvents = useCallback(async () => {
    if (demoMode) { setEvents(DEMO_EVENTS); setLoading(false); return }
    if (!igAccount) { setLoading(false); return }
    try {
      setLoading(true)
      const res = await authFetch(`/api/inbox?igAccountId=${igAccount.id}`)
      const data = await res.json()
      if (data.success) {
        const myUsername = igAccount.igUsername
        const parsed = (data.events || []).map((e: WebhookEvent) => parseWebhookEvent(e, myUsername))
        setEvents(parsed)
      }
    } catch (err) {
      console.error('Failed to fetch events', err)
    } finally {
      setLoading(false)
    }
  }, [demoMode, igAccount, authFetch])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const handleClearAll = async () => {
    if (demoMode) { setEvents([]); setShowClearConfirm(false); return }
    if (!igAccount) return
    try {
      setClearing(true)
      await authFetch(`/api/inbox?igAccountId=${igAccount.id}`, { method: 'DELETE' })
      setEvents([])
    } catch (err) {
      console.error('Clear failed', err)
    } finally {
      setClearing(false)
      setShowClearConfirm(false)
    }
  }

  const filtered = events.filter(e =>
    (filterKind === 'all' || e.kind === filterKind) &&
    (filterStatus === 'all' || e.status === filterStatus)
  )

  const stats = {
    total:     events.length,
    comments:  events.filter(e => e.kind === 'comment_in').length,
    dmSent:    events.filter(e => e.kind === 'dm_sent').length,
    triggered: events.filter(e => e.triggerMatched).length,
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* ── Clear confirmation modal ── */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Clear Activity Log?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This will permanently delete all {events.length} webhook events from the database. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {clearing ? 'Clearing…' : 'Yes, Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Activity Log</h1>
            <p className="text-xs text-muted-foreground">All webhook events from Instagram — in order</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
          {events.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
              onClick={() => setShowClearConfirm(true)}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {demoMode && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" />
          <strong>Demo Mode ON</strong> — showing sample events for Meta App Review. Toggle off to see live data.
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Events',   value: stats.total,    icon: Activity,      color: 'from-primary to-secondary' },
          { label: 'Comments In',    value: stats.comments, icon: MessageCircle, color: 'from-blue-500 to-blue-600' },
          { label: 'DMs Sent',       value: stats.dmSent,   icon: Send,          color: 'from-green-500 to-emerald-600' },
          { label: 'Triggers Fired', value: stats.triggered, icon: Zap,          color: 'from-amber-500 to-orange-500' },
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

      {/* ── Filters ── */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Type:</span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {FILTER_KINDS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilterKind(value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterKind === value ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
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

      {/* ── Event list ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-2.5 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="col-span-3">Event Type</span>
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
            <p className="text-xs text-muted-foreground">Events appear here as Instagram sends them. Enable Demo Mode to preview.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((event) => {
              const cfg = kindConfig[event.kind] ?? kindConfig.other
              const TypeIcon = cfg.icon
              const stCfg = statusConfig[event.status]
              const StatusIcon = stCfg.icon
              const isSent = event.kind === 'dm_sent' || event.kind === 'comment_reply'

              return (
                <div
                  key={event.id}
                  className={`grid grid-cols-12 px-4 py-3.5 hover:bg-muted/30 transition-colors items-center ${isSent ? 'bg-muted/10' : ''}`}
                >
                  {/* Event type */}
                  <div className="col-span-3 flex items-center gap-2">
                    {isSent && <span className="w-4 h-px bg-border flex-shrink-0" />}
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
                    <span className={`text-sm font-medium ${isSent ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {event.kind === 'dm_sent' ? '🤖 AutoBot' : `@${event.username}`}
                    </span>
                    {event.igAccount !== 'unknown' && (
                      <p className="text-[10px] text-muted-foreground">→ @{event.igAccount}</p>
                    )}
                  </div>

                  {/* Content */}
                  <div className="col-span-4">
                    <p className="text-sm text-foreground truncate">&ldquo;{event.content}&rdquo;</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{cfg.sub}</p>
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
