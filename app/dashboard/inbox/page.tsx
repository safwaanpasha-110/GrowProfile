'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { formatDateTime } from '@/lib/utils'
import {
  MessageCircle, MessageSquare, Send, ArrowRight,
  Zap, CheckCircle2, Clock, AlertCircle, Loader2,
  RefreshCw, User, Instagram, ToggleLeft, ToggleRight,
  ChevronRight, Bot, Hash
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// ─── Types ────────────────────────────────────────────────

interface Thread {
  igScopedUserId: string
  igUsername: string
  interactionCount: number
  latestAt: string
  latestType: string | null
  latestStatus: string | null
  latestText: string | null
  campaignName: string | null
}

interface Interaction {
  id: string
  igUsername: string | null
  igScopedUserId: string
  type: 'COMMENT' | 'DM_RECEIVED' | 'DM_SENT' | 'FOLLOW_CHECK'
  status: string
  commentId: string | null
  commentText: string | null
  dmMessageId: string | null
  metadata: Record<string, any> | null
  followUpCount: number
  createdAt: string
  updatedAt: string
  campaign: { id: string; name: string; requireFollow: boolean } | null
  igAccount: { igUsername: string } | null
}

// ─── Demo Data ────────────────────────────────────────────

const DEMO_THREADS: Thread[] = [
  { igScopedUserId: 'demo_1', igUsername: 'john_doe', interactionCount: 3, latestAt: new Date(Date.now() - 120000).toISOString(), latestType: 'COMMENT', latestStatus: 'COMPLETED', latestText: 'price', campaignName: 'Product Launch' },
  { igScopedUserId: 'demo_2', igUsername: 'anna_smith', interactionCount: 2, latestAt: new Date(Date.now() - 600000).toISOString(), latestType: 'DM_RECEIVED', latestStatus: 'COMPLETED', latestText: 'details please', campaignName: 'Summer Sale' },
  { igScopedUserId: 'demo_3', igUsername: 'raj_patel', interactionCount: 1, latestAt: new Date(Date.now() - 3600000).toISOString(), latestType: 'COMMENT', latestStatus: 'FOLLOW_PENDING', latestText: 'info', campaignName: 'Product Launch' },
  { igScopedUserId: 'demo_4', igUsername: 'sara_k', interactionCount: 4, latestAt: new Date(Date.now() - 7200000).toISOString(), latestType: 'COMMENT', latestStatus: 'COMPLETED', latestText: 'link', campaignName: 'Summer Sale' },
]

const DEMO_INTERACTIONS: Record<string, Interaction[]> = {
  demo_1: [
    { id: 'd1a', igUsername: 'john_doe', igScopedUserId: 'demo_1', type: 'COMMENT', status: 'COMPLETED', commentId: 'c1', commentText: 'price', dmMessageId: null, metadata: { matchedKeyword: 'price', triggerMatched: true }, followUpCount: 0, createdAt: new Date(Date.now() - 180000).toISOString(), updatedAt: new Date(Date.now() - 120000).toISOString(), campaign: { id: 'c1', name: 'Product Launch', requireFollow: false }, igAccount: { igUsername: 'mybrand' } },
    { id: 'd1b', igUsername: 'mybrand', igScopedUserId: 'demo_1', type: 'DM_SENT', status: 'COMPLETED', commentId: null, commentText: null, dmMessageId: 'msg_001', metadata: { dmText: 'Hey john_doe! 👋 Thanks for commenting! Here\'s what you asked for below 👇', automated: true }, followUpCount: 0, createdAt: new Date(Date.now() - 120000).toISOString(), updatedAt: new Date(Date.now() - 120000).toISOString(), campaign: { id: 'c1', name: 'Product Launch', requireFollow: false }, igAccount: { igUsername: 'mybrand' } },
  ],
  demo_2: [
    { id: 'd2a', igUsername: 'anna_smith', igScopedUserId: 'demo_2', type: 'DM_RECEIVED', status: 'COMPLETED', commentId: null, commentText: 'details please', dmMessageId: null, metadata: { matchedKeyword: 'details', triggerMatched: true }, followUpCount: 0, createdAt: new Date(Date.now() - 700000).toISOString(), updatedAt: new Date(Date.now() - 600000).toISOString(), campaign: { id: 'c2', name: 'Summer Sale', requireFollow: false }, igAccount: { igUsername: 'mybrand' } },
    { id: 'd2b', igUsername: 'mybrand', igScopedUserId: 'demo_2', type: 'DM_SENT', status: 'COMPLETED', commentId: null, commentText: null, dmMessageId: 'msg_002', metadata: { dmText: 'Hi anna_smith! Here are the summer sale details you asked for 🎉', automated: true }, followUpCount: 0, createdAt: new Date(Date.now() - 600000).toISOString(), updatedAt: new Date(Date.now() - 600000).toISOString(), campaign: { id: 'c2', name: 'Summer Sale', requireFollow: false }, igAccount: { igUsername: 'mybrand' } },
  ],
  demo_3: [
    { id: 'd3a', igUsername: 'raj_patel', igScopedUserId: 'demo_3', type: 'COMMENT', status: 'FOLLOW_PENDING', commentId: 'c3', commentText: 'info', dmMessageId: null, metadata: { matchedKeyword: 'info', triggerMatched: true }, followUpCount: 0, createdAt: new Date(Date.now() - 3700000).toISOString(), updatedAt: new Date(Date.now() - 3600000).toISOString(), campaign: { id: 'c1', name: 'Product Launch', requireFollow: true }, igAccount: { igUsername: 'mybrand' } },
    { id: 'd3b', igUsername: 'mybrand', igScopedUserId: 'demo_3', type: 'DM_SENT', status: 'FOLLOW_PENDING', commentId: null, commentText: null, dmMessageId: 'msg_003', metadata: { dmText: 'Almost there! Please visit my profile and tap follow to continue 😁', gated: true, automated: true }, followUpCount: 0, createdAt: new Date(Date.now() - 3600000).toISOString(), updatedAt: new Date(Date.now() - 3600000).toISOString(), campaign: { id: 'c1', name: 'Product Launch', requireFollow: true }, igAccount: { igUsername: 'mybrand' } },
  ],
  demo_4: [
    { id: 'd4a', igUsername: 'sara_k', igScopedUserId: 'demo_4', type: 'COMMENT', status: 'COMPLETED', commentId: 'c4', commentText: 'link', dmMessageId: null, metadata: { matchedKeyword: 'link', triggerMatched: true }, followUpCount: 0, createdAt: new Date(Date.now() - 7300000).toISOString(), updatedAt: new Date(Date.now() - 7200000).toISOString(), campaign: { id: 'c2', name: 'Summer Sale', requireFollow: false }, igAccount: { igUsername: 'mybrand' } },
    { id: 'd4b', igUsername: 'mybrand', igScopedUserId: 'demo_4', type: 'DM_SENT', status: 'COMPLETED', commentId: null, commentText: null, dmMessageId: 'msg_004', metadata: { dmText: 'Hi sara_k! Here\'s the link 👉 https://example.com', automated: true }, followUpCount: 0, createdAt: new Date(Date.now() - 7200000).toISOString(), updatedAt: new Date(Date.now() - 7200000).toISOString(), campaign: { id: 'c2', name: 'Summer Sale', requireFollow: false }, igAccount: { igUsername: 'mybrand' } },
  ],
}

// ─── Helpers ──────────────────────────────────────────────

function getInteractionLabel(type: string, isOutgoing: boolean) {
  if (type === 'COMMENT' && !isOutgoing) return { label: 'Incoming Comment', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' }
  if (type === 'DM_RECEIVED') return { label: 'Incoming DM', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' }
  if (type === 'DM_SENT') return { label: 'Automated DM Sent', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' }
  if (type === 'FOLLOW_CHECK') return { label: 'Follow Check', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' }
  return { label: type, color: 'bg-muted text-muted-foreground' }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'COMPLETED': return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
    case 'FOLLOW_PENDING': return <Clock className="w-3.5 h-3.5 text-amber-500" />
    case 'FAILED': return <AlertCircle className="w-3.5 h-3.5 text-red-500" />
    case 'PENDING': return <Clock className="w-3.5 h-3.5 text-muted-foreground" />
    default: return <Clock className="w-3.5 h-3.5 text-muted-foreground" />
  }
}

// ─── Main Component ───────────────────────────────────────

export default function InboxPage() {
  const { user, authFetch } = useAuth()
  const igAccount = user?.instagramAccounts?.[0]

  const [demoMode, setDemoMode] = useState(false)
  const [threads, setThreads] = useState<Thread[]>([])
  const [loadingThreads, setLoadingThreads] = useState(true)
  const [activeThread, setActiveThread] = useState<string | null>(null)
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [loadingThread, setLoadingThread] = useState(false)
  const [activeUsername, setActiveUsername] = useState<string>('')

  // ─── Fetch thread list ──────────────────────────────────

  const fetchThreads = useCallback(async () => {
    if (demoMode) {
      setThreads(DEMO_THREADS)
      setLoadingThreads(false)
      return
    }
    if (!igAccount) { setLoadingThreads(false); return }
    try {
      setLoadingThreads(true)
      const res = await authFetch(`/api/inbox?igAccountId=${igAccount.id}`)
      const data = await res.json()
      if (data.success) setThreads(data.threads || [])
    } catch (err) {
      console.error('Failed to fetch inbox threads', err)
    } finally {
      setLoadingThreads(false)
    }
  }, [demoMode, igAccount, authFetch])

  useEffect(() => { fetchThreads() }, [fetchThreads])

  // ─── Fetch single thread ────────────────────────────────

  const openThread = useCallback(async (scopedUserId: string, username: string) => {
    setActiveThread(scopedUserId)
    setActiveUsername(username)
    if (demoMode) {
      setInteractions(DEMO_INTERACTIONS[scopedUserId] || [])
      return
    }
    if (!igAccount) return
    try {
      setLoadingThread(true)
      const res = await authFetch(`/api/inbox?igAccountId=${igAccount.id}&threadUserId=${scopedUserId}`)
      const data = await res.json()
      if (data.success) setInteractions(data.interactions || [])
    } catch (err) {
      console.error('Failed to fetch thread', err)
    } finally {
      setLoadingThread(false)
    }
  }, [demoMode, igAccount, authFetch])

  // ─── Render ───────────────────────────────────────────

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] overflow-hidden">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Unified Inbox</h1>
            <p className="text-xs text-muted-foreground">All comment & DM interactions in one place</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Demo Mode toggle */}
          <button
            onClick={() => { setDemoMode(!demoMode); setActiveThread(null); setInteractions([]) }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
              demoMode
                ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300'
                : 'bg-muted border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {demoMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            Demo Mode {demoMode ? 'ON' : 'OFF'}
          </button>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-lg" onClick={fetchThreads}>
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {demoMode && (
        <div className="mx-6 mt-3 px-4 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2 flex-shrink-0">
          <Zap className="w-3.5 h-3.5" />
          <strong>Demo Mode ON</strong> — showing sample data to demonstrate the automation flow (Meta App Review mode)
        </div>
      )}

      {/* Main layout: left panel + right panel */}
      <div className="flex flex-1 overflow-hidden mt-3 gap-0">

        {/* ── Left: Thread List ─────────────────────────── */}
        <div className="w-72 flex-shrink-0 border-r border-border flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Conversations ({threads.length})
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingThreads ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : threads.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MessageCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">No conversations yet</p>
                <p className="text-xs text-muted-foreground">Enable Demo Mode to preview the flow, or wait for your first campaign interaction.</p>
              </div>
            ) : (
              threads.map((thread) => {
                const isActive = activeThread === thread.igScopedUserId
                return (
                  <button
                    key={thread.igScopedUserId}
                    onClick={() => openThread(thread.igScopedUserId, thread.igUsername)}
                    className={`w-full text-left px-4 py-3.5 border-b border-border/50 transition-colors hover:bg-muted/50 ${
                      isActive ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-white">{thread.igUsername[0]?.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-sm font-semibold text-foreground truncate">@{thread.igUsername}</span>
                          <span className="text-[10px] text-muted-foreground ml-2 flex-shrink-0">
                            {formatDateTime(thread.latestAt)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {thread.latestText || thread.latestType || 'Interaction'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          {thread.campaignName && (
                            <span className="text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5 font-medium truncate max-w-[120px]">
                              {thread.campaignName}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground">{thread.interactionCount} events</span>
                        </div>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-2" />}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ── Right: Thread Detail ──────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!activeThread ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">Select a conversation</p>
                <p className="text-xs text-muted-foreground">Click a user on the left to see their full interaction timeline</p>
              </div>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="px-6 py-3 border-b border-border flex items-center gap-3 flex-shrink-0 bg-card">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{activeUsername[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">@{activeUsername}</p>
                  <p className="text-xs text-muted-foreground">{interactions.length} events in timeline</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {loadingThread ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : interactions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">No interactions found for this user</p>
                  </div>
                ) : (
                  interactions.map((item, idx) => {
                    const isOutgoing = item.type === 'DM_SENT'
                    const isSystem = isOutgoing
                    const label = getInteractionLabel(item.type, isOutgoing)
                    const meta = item.metadata || {}
                    const dmText = meta.dmText as string | undefined
                    const triggerMatched = meta.triggerMatched as boolean | undefined
                    const matchedKeyword = meta.matchedKeyword as string | undefined
                    const isGated = meta.gated as boolean | undefined

                    return (
                      <div key={item.id} className={`flex gap-3 ${isOutgoing ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                          isSystem
                            ? 'bg-gradient-to-br from-primary to-secondary'
                            : 'bg-gradient-to-br from-pink-400 to-orange-400'
                        }`}>
                          {isSystem
                            ? <Bot className="w-4 h-4 text-white" />
                            : <span className="text-xs font-bold text-white">{(item.igUsername || 'U')[0]?.toUpperCase()}</span>
                          }
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[75%] space-y-1.5 ${isOutgoing ? 'items-end flex flex-col' : ''}`}>
                          {/* Type badge */}
                          <div className={`flex items-center gap-2 ${isOutgoing ? 'flex-row-reverse' : ''}`}>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${label.color}`}>
                              {label.label}
                            </span>
                            {triggerMatched && (
                              <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                                <Zap className="w-2.5 h-2.5" /> Trigger Matched
                              </span>
                            )}
                            {isGated && (
                              <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                                Follow Gate
                              </span>
                            )}
                          </div>

                          {/* Message bubble */}
                          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            isOutgoing
                              ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-tr-sm'
                              : 'bg-card border border-border text-foreground rounded-tl-sm'
                          }`}>
                            {item.type === 'COMMENT' && item.commentText && (
                              <p>
                                <span className="opacity-70 text-xs mr-2">💬 Comment:</span>
                                {item.commentText}
                              </p>
                            )}
                            {item.type === 'DM_RECEIVED' && item.commentText && (
                              <p>
                                <span className="opacity-70 text-xs mr-2">✉️ DM:</span>
                                {item.commentText}
                              </p>
                            )}
                            {item.type === 'DM_SENT' && (
                              <p>
                                <span className="opacity-70 text-xs mr-2">🤖 Auto-reply:</span>
                                {dmText || 'Automated DM sent'}
                              </p>
                            )}
                            {item.type === 'FOLLOW_CHECK' && (
                              <p className="text-xs opacity-80">Follow status checked</p>
                            )}
                          </div>

                          {/* Meta row */}
                          <div className={`flex items-center gap-2 ${isOutgoing ? 'flex-row-reverse' : ''}`}>
                            {getStatusIcon(item.status)}
                            <span className="text-[10px] text-muted-foreground">{formatDateTime(item.createdAt)}</span>
                            {item.campaign && (
                              <span className="text-[10px] text-muted-foreground">
                                · {item.campaign.name}
                              </span>
                            )}
                            {matchedKeyword && (
                              <span className="text-[10px] text-primary flex items-center gap-0.5">
                                <Hash className="w-2.5 h-2.5" />{matchedKeyword}
                              </span>
                            )}
                          </div>

                          {/* Trigger summary card — shown on incoming events that matched */}
                          {triggerMatched && !isOutgoing && (
                            <div className="mt-1 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs space-y-0.5">
                              <p className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-1">
                                <Zap className="w-3 h-3" /> Automation Triggered
                              </p>
                              <p className="text-green-700 dark:text-green-400">
                                Trigger: <strong>&quot;{matchedKeyword}&quot;</strong> · Matched: YES
                              </p>
                              <p className="text-green-700 dark:text-green-400">
                                Action: <strong>DM sent automatically</strong>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
