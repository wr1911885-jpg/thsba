# Firebase and Gemini API Integration Guide

This guide will walk you through setting up Firebase authentication and database, as well as integrating Google's Gemini AI API for the Allen THSBA Fishing Team app.

## Table of Contents
1. [Firebase Setup](#firebase-setup)
2. [Gemini API Setup](#gemini-api-setup)
3. [Environment Variables](#environment-variables)
4. [Code Integration](#code-integration)
5. [Testing](#testing)

## Firebase Setup

### Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `allen-thsba-fishing-team`
4. Enable Google Analytics (recommended)
5. Choose or create a Google Analytics account
6. Click "Create project"

### Step 2: Enable Authentication

1. In the Firebase Console, navigate to **Authentication** > **Sign-in method**
2. Enable the following sign-in providers:
   - **Email/Password**: Click "Enable" and save
   - **Google** (optional): Click "Enable", add your domain, and save
3. Go to **Authentication** > **Users** to manage users later

### Step 3: Create Firestore Database

1. Navigate to **Firestore Database** in the Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select a location closest to your users (e.g., `us-central1`)
5. Click "Done"

### Step 4: Set up Firestore Security Rules

Replace the default rules with these secure rules:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tournament posts - authenticated users can read all, write their own
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == resource.data.userId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Tournament data - read only for authenticated users
    match /tournaments/{tournamentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['coach', 'captain'];
    }
    
    // Practice logs - users can manage their own
    match /practiceLogs/{logId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
\`\`\`

### Step 5: Get Firebase Configuration

1. Go to **Project Settings** (gear icon) > **General**
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (`</>`)
4. Register your app with nickname: `allen-thsba-web`
5. Copy the Firebase configuration object

## Gemini API Setup

### Step 1: Enable Gemini API

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key" in the top right
4. Create a new API key or use an existing one
5. Copy the API key (keep it secure!)

### Step 2: Set up Billing (if needed)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable billing for the project
4. Navigate to **APIs & Services** > **Library**
5. Search for "Generative Language API" and enable it

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

\`\`\`bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Development URLs (for auth redirects)
NEXT_PUBLIC_DEV_URL=http://localhost:3000
\`\`\`

## Code Integration

### Step 1: Install Dependencies

\`\`\`bash
npm install firebase @google/generative-ai
\`\`\`

### Step 2: Firebase Configuration

Create `lib/firebase.ts`:

\`\`\`typescript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
\`\`\`

### Step 3: Authentication Hook

Create `hooks/useFirebaseAuth.ts`:

\`\`\`typescript
import { useState, useEffect } from 'react'
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    return signOut(auth)
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    logout,
  }
}
\`\`\`

### Step 4: Gemini AI Integration

Create `lib/gemini.ts`:

\`\`\`typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateFishingAdvice(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const fishingContext = `You are an expert bass fishing guide with extensive knowledge of North Texas lakes including Ray Roberts, Lewisville, Tawakoni, and Cedar Creek. Provide helpful, specific advice for high school bass fishing tournament competitors.`
    
    const result = await model.generateContent(`${fishingContext}\n\nQuestion: ${prompt}`)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating fishing advice:', error)
    throw new Error('Failed to generate fishing advice')
  }
}

export async function generateTournamentStrategy(lake: string, date: string, conditions?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Generate a tournament fishing strategy for ${lake} on ${date}. ${conditions ? `Current conditions: ${conditions}` : ''} Focus on techniques, lures, and locations that would be effective for high school tournament bass fishing.`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating tournament strategy:', error)
    throw new Error('Failed to generate tournament strategy')
  }
}
\`\`\`

### Step 5: Firestore Data Operations

Create `lib/firestore.ts`:

\`\`\`typescript
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

export interface FirestorePost {
  id?: string
  userId: string
  userName: string
  content: string
  type: 'note' | 'catch' | 'gear-reminder' | 'tournament-update'
  tournamentId?: string
  timestamp: Timestamp
  likes: number
  catchDetails?: {
    species: string
    weight: number
    length: number
    lure: string
    location: string
  }
}

export async function createPost(post: Omit<FirestorePost, 'id' | 'timestamp' | 'likes'>) {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...post,
      timestamp: Timestamp.now(),
      likes: 0,
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export async function getPosts(tournamentId?: string) {
  try {
    let q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'))
    
    if (tournamentId) {
      q = query(collection(db, 'posts'), where('tournamentId', '==', tournamentId), orderBy('timestamp', 'desc'))
    }
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestorePost[]
  } catch (error) {
    console.error('Error getting posts:', error)
    throw error
  }
}
\`\`\`

## Testing

### Step 1: Test Firebase Authentication

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Try creating a new account
4. Check the Firebase Console > Authentication > Users to see the new user

### Step 2: Test Firestore Database

1. Create a test post in your app
2. Check Firebase Console > Firestore Database to see the new document
3. Verify security rules by trying to access data without authentication

### Step 3: Test Gemini API

Create a test API route `pages/api/test-gemini.ts`:

\`\`\`typescript
import { NextApiRequest, NextApiResponse } from 'next'
import { generateFishingAdvice } from '@/lib/gemini'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { prompt } = req.body
    const advice = await generateFishingAdvice(prompt)
    res.status(200).json({ advice })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate advice' })
  }
}
\`\`\`

Test by sending a POST request to `/api/test-gemini` with a fishing question.

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Implement proper Firestore security rules**
4. **Validate all user inputs** before sending to APIs
5. **Set up Firebase App Check** for production
6. **Monitor API usage** to prevent abuse
7. **Use HTTPS** in production

## Deployment Considerations

### Vercel Deployment

1. Add environment variables in Vercel dashboard
2. Update Firebase authorized domains to include your Vercel domain
3. Update CORS settings if needed

### Firebase Hosting (Alternative)

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase init hosting`
3. Build your app: `npm run build`
4. Deploy: `firebase deploy`

## Troubleshooting

### Common Issues

1. **"Firebase not initialized"**: Check environment variables
2. **"Permission denied"**: Review Firestore security rules
3. **"API key invalid"**: Verify Gemini API key and billing
4. **CORS errors**: Add your domain to Firebase authorized domains

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test API endpoints individually
4. Check Firebase Console logs
5. Monitor network requests in browser dev tools

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)

For team-specific issues, contact the development team or create an issue in the project repository.
