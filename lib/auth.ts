import { db } from "./firebase"
import { collection, doc, getDoc, getDocs, addDoc, deleteDoc, query, where } from "firebase/firestore"

export interface User {
  id: string
  name: string
  email: string
  password: string
  avatar?: string
  role: "member" | "captain" | "coach"
  joinDate: string
}

const USERS_COLLECTION = "users"

// Authenticate user by checking Firestore
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const usersRef = collection(db, USERS_COLLECTION)
    const q = query(usersRef, where("email", "==", email), where("password", "==", password))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const userDoc = querySnapshot.docs[0]
    return {
      id: userDoc.id,
      ...userDoc.data(),
    } as User
  } catch (error) {
    console.error("[v0] Error authenticating user:", error)
    return null
  }
}

// Create user by coach (stores in Firestore)
export async function createUserByCoach(
  name: string,
  email: string,
  password: string,
  role: "member" | "captain" | "coach",
  coachId: string,
): Promise<User> {
  try {
    // Verify the coach exists and has coach role
    const coachDoc = await getDoc(doc(db, USERS_COLLECTION, coachId))
    if (!coachDoc.exists() || coachDoc.data()?.role !== "coach") {
      throw new Error("Only coaches can create users")
    }

    // Check if email already exists
    const usersRef = collection(db, USERS_COLLECTION)
    const q = query(usersRef, where("email", "==", email))
    const existingUsers = await getDocs(q)

    if (!existingUsers.empty) {
      throw new Error("A user with this email already exists")
    }

    const newUser = {
      name,
      email,
      password,
      avatar: "/placeholder.svg?height=40&width=40",
      role,
      joinDate: new Date().toISOString().split("T")[0],
    }

    const docRef = await addDoc(collection(db, USERS_COLLECTION), newUser)

    return {
      id: docRef.id,
      ...newUser,
    }
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    throw error
  }
}

// Get all users from Firestore
export async function getAllUsers(): Promise<User[]> {
  try {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION))
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as User,
    )
  } catch (error) {
    console.error("[v0] Error getting users:", error)
    return []
  }
}

// Delete user by coach
export async function deleteUserByCoach(userId: string, coachId: string): Promise<boolean> {
  try {
    const coachDoc = await getDoc(doc(db, USERS_COLLECTION, coachId))
    if (!coachDoc.exists() || coachDoc.data()?.role !== "coach") {
      throw new Error("Only coaches can delete users")
    }

    await deleteDoc(doc(db, USERS_COLLECTION, userId))
    return true
  } catch (error) {
    console.error("[v0] Error deleting user:", error)
    throw error
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId))
    if (!userDoc.exists()) {
      return null
    }
    return {
      id: userDoc.id,
      ...userDoc.data(),
    } as User
  } catch (error) {
    console.error("[v0] Error getting user:", error)
    return null
  }
}
