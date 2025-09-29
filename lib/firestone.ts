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