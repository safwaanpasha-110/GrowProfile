'use client'

import { Instagram, Link as LinkIcon, Zap, Clock, AlertCircle, CheckCircle2, Play, Pause, Sparkles, MessageSquare, MousePointerClick, TrendingUp, ArrowRight, Plus, Hash, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function AutoDMPage() {
  const [selectedPosts, setSelectedPosts] = useState<number[]>([])
  const [keyword, setKeyword] = useState('price')
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')

  const posts = [
    { id: 1, url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300&h=300&fit=crop', likes: 2450, comments: 128 },
    { id: 2, url: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=300&h=300&fit=crop', likes: 8920, comments: 456 },
    { id: 3, url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=300&fit=crop', likes: 5670, comments: 289 },
    { id: 4, url: 'https://images.unsplash.com/photo-1598128558393-70ff21433be0?w=300&h=300&fit=crop', likes: 12030, comments: 892 },
    { id: 5, url: 'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=300&h=300&fit=crop', likes: 4330, comments: 198 },
    { id: 6, url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&h=300&fit=crop', likes: 7780, comments: 524 },
  ]

  const togglePost = (id: number) => {
    setSelectedPosts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AutoDM Campaign</h1>
            <p className="text-muted-foreground">Create automated DM responses for your Instagram posts</p>
          </div>
        </div>
      </div>

      {/* Connected Account Banner */}
      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 border border-pink-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Instagram className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-foreground text-lg">@yourbusiness</p>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Business Account</span>
              </div>
              <div className="flex items-center gap-1 text-green-600 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Connected via Meta OAuth</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl">
            Manage Connection
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Post Selector */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Selection */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Select Posts</h2>
                <p className="text-sm text-muted-foreground">
                  Choose which posts should trigger AutoDM when someone comments
                </p>
              </div>
              {selectedPosts.length > 0 && (
                <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  {selectedPosts.length} selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => togglePost(post.id)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 group ${
                    selectedPosts.includes(post.id)
                      ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'border-transparent hover:border-primary/30'
                  }`}
                >
                  <img
                    src={post.url}
                    alt={`Post ${post.id}`}
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <div className="flex justify-between text-sm text-white gap-2">
                      <span className="flex items-center gap-1">❤️ {(post.likes / 1000).toFixed(1)}k</span>
                      <span className="flex items-center gap-1">💬 {post.comments}</span>
                    </div>
                  </div>
                  {selectedPosts.includes(post.id) && (
                    <div className="absolute top-3 right-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity ${
                    selectedPosts.includes(post.id) ? 'opacity-100' : ''
                  }`}></div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-center">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary gap-2">
                <Plus className="w-4 h-4" />
                Load More Posts
              </Button>
            </div>
          </div>

          {/* How It Works */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">How AutoDM Works</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">User Comments</p>
                  <p className="text-xs text-muted-foreground">Someone comments with your keyword</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-secondary">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Webhook Triggers</p>
                  <p className="text-xs text-muted-foreground">Meta sends event to GrowProfile</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-accent">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">DM Sent</p>
                  <p className="text-xs text-muted-foreground">User receives your message + link</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Setup Panel */}
        <div className="space-y-6">
          {/* Campaign Setup Card */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Campaign Setup
            </h3>

            {selectedPosts.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-sm mb-6">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-700">
                  Select at least one post to configure your automation
                </p>
              </div>
            )}

            <div className="space-y-5">
              {/* Trigger Keyword */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  Trigger Keywords
                </label>
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="price, info, link"
                  className="rounded-xl border-border bg-background"
                />
                <p className="text-xs text-muted-foreground mt-1.5">Separate multiple keywords with commas</p>
              </div>

              {/* Message Template */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  DM Message Template
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-28 transition-all"
                  placeholder="Hey {name}! 👋 Thanks for your interest! Here's the info you requested..."
                />
                <p className="text-xs text-muted-foreground mt-1.5">Use {'{name}'} to personalize with username</p>
              </div>

              {/* Link */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  Include Link (Optional)
                </label>
                <Input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://yoursite.com/pricing"
                  className="rounded-xl border-border bg-background"
                />
              </div>

              {/* Settings Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Delay
                  </label>
                  <select className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none">
                    <option>Instant</option>
                    <option>30 seconds</option>
                    <option>1 minute</option>
                    <option>5 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    Daily Limit
                  </label>
                  <Input
                    type="number"
                    defaultValue="100"
                    className="rounded-xl border-border bg-background"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2 rounded-xl shadow-lg shadow-primary/25 text-base"
              disabled={selectedPosts.length === 0}
            >
              <Play className="w-5 h-5" />
              Launch Campaign
            </Button>
            <Button variant="outline" className="w-full h-11 gap-2 rounded-xl">
              <Pause className="w-4 h-4" />
              Save as Draft
            </Button>
          </div>

          {/* Preview Card */}
          <div className="p-5 rounded-2xl bg-muted/50 border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3">PREVIEW</p>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Send className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    {message || 'Your message will appear here...'}
                  </p>
                  {link && (
                    <p className="text-sm text-primary mt-2 truncate">{link}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-foreground mb-6">Campaign Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Campaigns</p>
            <p className="text-3xl font-bold text-foreground">3</p>
            <p className="text-xs text-green-600 font-medium mt-2">+1 this month</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">DMs Sent</p>
            <p className="text-3xl font-bold text-foreground">2,847</p>
            <p className="text-xs text-green-600 font-medium mt-2">+892 this week</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MousePointerClick className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Link Clicks</p>
            <p className="text-3xl font-bold text-foreground">1,234</p>
            <p className="text-xs text-green-600 font-medium mt-2">43.3% click rate</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
            <p className="text-3xl font-bold text-foreground">98.2%</p>
            <p className="text-xs text-green-600 font-medium mt-2">Delivery success</p>
          </div>
        </div>
      </div>
    </div>
  )
}
