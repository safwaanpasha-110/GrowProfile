'use client'

import { useState } from 'react'
import { Search, Plus, Bell, User, LogOut, Settings, ChevronDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  return (
    <header className="fixed top-0 left-64 right-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="px-8 py-4 flex items-center justify-between gap-6">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search campaigns, settings..."
              className="pl-11 h-11 bg-muted/50 border-transparent focus:border-primary/50 focus:bg-background rounded-xl transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Create Campaign Button */}
          <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2 rounded-xl shadow-lg shadow-primary/20">
            <Link href="/dashboard/apps/autodm">
              <Plus className="w-4 h-4" />
              <span>New Campaign</span>
            </Link>
          </Button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl hover:bg-muted transition-colors group">
            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full ring-2 ring-background"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 pl-3 pr-2 py-2 rounded-xl hover:bg-muted transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role || 'User'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                  {/* Profile Section */}
                  <div className="p-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user?.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.role} Account</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="p-2">
                    <Link
                      href="/dashboard/account"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Account Settings</span>
                    </Link>
                    <Link
                      href="/dashboard/plan/pricing"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">Upgrade Plan</span>
                    </Link>
                  </div>
                  
                  {/* Logout */}
                  <div className="p-2 border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
