# Firebase Authentication Setup

Firebase authentication has been integrated into the GrowProfile app. Here's what has been done and what you need to do next:

## ✅ Completed

1. **Firebase Client SDK initialized** (`lib/firebase.ts`)
   - Configured to use environment variables
   - Safe client-side initialization

2. **AuthContext updated** (`contexts/AuthContext.tsx`)
   - Replaced demo auth with Firebase Authentication
   - Added email/password sign-in and sign-up
   - Added Google OAuth sign-in
   - Automated role detection (admin vs user)
   - Persistent auth state with Firebase `onAuthStateChanged`

3. **LoginForm updated** (`components/auth/LoginForm.tsx`)
   - Removed demo credentials
   - Integrated Firebase email/password login
   - Added functional Google sign-in button
   - Error handling and loading states

4. **SignupForm updated** (`components/auth/SignupForm.tsx`)
   - Integrated Firebase email/password registration
   - Added password validation
   - Added functional Google sign-up button
   - Terms acceptance requirement

## 🔧 Required: Get Firebase Web App Credentials

You need to add Firebase Web App configuration to your `.env.local` file:

### Step 1: Go to Firebase Console
Visit: https://console.firebase.google.com/project/growprofile-7544a/settings/general

### Step 2: Add a Web App (if not already done)
1. Scroll down to "Your apps"
2. Click the **Web** icon (`</>`)
3. Register app with nickname: "GrowProfile Web"
4. You'll see a `firebaseConfig` object with these values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "growprofile-7544a.firebaseapp.com",
  projectId: "growprofile-7544a",
  storageBucket: "growprofile-7544a.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

### Step 3: Create `.env.local` file

Create a file named `.env.local` in the project root with these values:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=growprofile-7544a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=growprofile-7544a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=growprofile-7544a.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

**Important:** Replace `your_api_key_here`, `your_sender_id_here`, and `your_app_id_here` with the actual values from your Firebase Console.

### Step 4: Enable Authentication Methods in Firebase

Go to: https://console.firebase.google.com/project/growprofile-7544a/authentication/providers

1. **Enable Email/Password:**
   - Click "Email/Password"
   - Toggle "Enable"
   - Save

2. **Enable Google Sign-In:**
   - Click "Google"
   - Toggle "Enable"
   - Set support email
   - Save

### Step 5: Configure Authorized Domains

In Firebase Console → Authentication → Settings → Authorized domains:
- Add your production domain
- `localhost` is already authorized for development

### Step 6: Restart Dev Server

After adding `.env.local`:

```bash
# Stop the current dev server (Ctrl+C or kill process)
bun run dev --port 4001
```

## 🔐 User Roles

Admin role is automatically assigned to these emails:
- `admin@admin.com`
- `admin@growprofile.com`

To add more admin emails, edit `contexts/AuthContext.tsx` line 38:

```typescript
const adminEmails = ['admin@admin.com', 'admin@growprofile.com', 'your-new-admin@example.com']
```

## 🧪 Testing the Auth Flow

1. **Sign Up**: Go to `/auth/signup`
   - Create a new account with email/password
   - Or use Google sign-in

2. **Sign In**: Go to `/auth/login`
   - Login with created credentials
   - Or use Google sign-in

3. **Protected Routes**:
   - After login, you'll be redirected to `/dashboard` (or `/admin` for admin users)
   - `ProtectedRoute` component guards authenticated pages

## 📝 What's in `.env` vs `.env.local`

- **`.env`**: Contains Firebase Admin SDK service account credentials (for server-side operations)
- **`.env.local`** (you need to create): Contains Firebase Web SDK config (for client-side auth)

Both are needed for a complete Firebase integration.

## 🚨 Security Notes

- `.env.local` is already in `.gitignore` - never commit it
- The `NEXT_PUBLIC_*` variables are exposed to the browser (this is expected and safe for Firebase config)
- Keep your service account JSON (in `.env`) secret and never expose it client-side

## Next Steps

After Firebase auth is working:
1. Set up Firebase Firestore for user data
2. Implement user profile management
3. Add Instagram OAuth integration (Meta API)
4. Set up backend API routes for Instagram operations
