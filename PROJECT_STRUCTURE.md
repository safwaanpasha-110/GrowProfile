# GrowProfile - Project Structure (Modular)

## Directory Layout

```
app/
├── page.tsx                          # Landing page (minimal, uses landing components)
├── layout.tsx                        # Root layout with AuthProvider
├── auth/                             # Authentication pages
│   ├── login/page.tsx               # Login page (uses LoginForm)
│   └── signup/page.tsx              # Signup page (uses SignupForm)
├── dashboard/                        # User dashboard (protected)
│   ├── layout.tsx                   # Dashboard layout with sidebar & header
│   ├── page.tsx                     # Dashboard home (uses dashboard components)
│   ├── account/page.tsx             # Account settings
│   ├── apps/autodm/page.tsx         # AutoDM campaigns
│   ├── growth/
│   │   ├── audience/page.tsx        # Audience analytics
│   │   └── insights/page.tsx        # Growth insights
│   ├── plan/
│   │   ├── pricing/page.tsx         # Plan selection
│   │   └── usage/page.tsx           # Usage metrics
│   ├── refer/page.tsx               # Referral program
│   ├── help/
│   │   ├── faq/page.tsx             # FAQ
│   │   └── support/page.tsx         # Support tickets
├── admin/                            # Admin dashboard (protected)
│   ├── layout.tsx                   # Admin layout with admin sidebar & header
│   ├── page.tsx                     # Admin home
│   ├── users/page.tsx               # User management
│   ├── subscriptions/page.tsx        # Subscription management
│   └── settings/page.tsx            # Admin settings
├── pricing/page.tsx                 # Public pricing page
├── faq/page.tsx                     # Public FAQ page
└── contexts/
    └── AuthContext.tsx              # Global auth state & login/logout logic

components/
├── landing/                          # Landing page sections
│   ├── Navigation.tsx               # Header navigation
│   ├── HeroSection.tsx              # Hero with CTA
│   ├── FeaturesSection.tsx          # 6 feature cards grid
│   ├── IntegrationsSection.tsx      # Integration logos grid
│   ├── CTASection.tsx               # Call-to-action section
│   └── Footer.tsx                   # Footer with links
├── auth/                             # Authentication components
│   ├── AuthLayout.tsx               # Reusable auth page wrapper
│   ├── LoginForm.tsx                # Login form with validation
│   └── SignupForm.tsx               # Signup form with validation
├── dashboard/                        # Dashboard components
│   ├── WelcomeCard.tsx              # Welcome banner
│   ├── StatsGrid.tsx                # 4 stat cards grid
│   ├── CampaignsList.tsx            # Recent campaigns list
│   └── QuickActions.tsx             # Quick action buttons & plan info
├── Sidebar.tsx                      # User dashboard sidebar
├── Header.tsx                       # User dashboard header (with logout)
├── AdminSidebar.tsx                 # Admin sidebar navigation
├── AdminHeader.tsx                  # Admin header
├── ProtectedRoute.tsx               # Route guard for auth/role
└── ui/                               # shadcn/ui components
```

## Component Patterns

### Page Files (Minimal)
Pages should only contain imports and minimal JSX structure. All content is in reusable components.

**Before (Old):**
```tsx
// app/page.tsx - 250+ lines of JSX
export default function Home() {
  return <div>... all code here ...</div>
}
```

**After (Modular):**
```tsx
// app/page.tsx - 11 lines, clean imports
import { Navigation } from '@/components/landing/Navigation'
import { HeroSection } from '@/components/landing/HeroSection'
// ...

export default function Home() {
  return (
    <div>
      <Navigation />
      <HeroSection />
      {/* ... */}
    </div>
  )
}
```

### Component Organization

**Landing Page Components** (`components/landing/`)
- Each section is a self-contained component
- Contains all styling, data, and logic for that section
- No state lifting needed

**Dashboard Components** (`components/dashboard/`)
- Split into: WelcomeCard, StatsGrid, CampaignsList, QuickActions
- Each component is independently reusable
- Can be used in multiple dashboard pages

**Auth Components** (`components/auth/`)
- AuthLayout: Reusable wrapper for login/signup pages
- LoginForm: Login form with validation & auth logic
- SignupForm: Signup form with validation
- Keeps auth UI consistent

## Auth Flow

```
/auth/login (public)
  ├─ LoginForm component
  │  └─ Calls useAuth().login()
  └─ If role="user" → redirect /dashboard
  └─ If role="admin" → redirect /admin

/auth/signup (public)
  └─ SignupForm component

/dashboard/* (protected)
  └─ ProtectedRoute wrapper
     └─ Requires role="user"
     └─ Redirects to /auth/login if not authenticated

/admin/* (protected)
  └─ ProtectedRoute wrapper
     └─ Requires role="admin"
     └─ Redirects to /auth/login if not authenticated
```

## Benefits of This Structure

1. **Modularity** - Each component has single responsibility
2. **Reusability** - Components can be used in multiple pages
3. **Maintainability** - Easy to find and update specific features
4. **Testability** - Smaller components are easier to test
5. **Scalability** - Easy to add new pages/sections
6. **Clean Pages** - page.tsx files stay minimal and focused
7. **Separation of Concerns** - Layout, navigation, forms in separate components

## Key Files

- `contexts/AuthContext.tsx` - Global auth state management
- `components/ProtectedRoute.tsx` - Route protection & role checking
- `components/auth/` - All auth-related UI components
- `components/landing/` - All landing page sections
- `components/dashboard/` - All dashboard UI components
