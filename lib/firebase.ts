import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCUfvpnH18Zx3fmHg_Cmi8eeko_DtaTNbA",
  authDomain: "allen-thsba.firebaseapp.com",
  projectId: "allen-thsba",
  storageBucket: "allen-thsba.firebasestorage.app",
  messagingSenderId: "1041302305389",
  appId: "1:1041302305389:web:f5122b1d98637d542e9d64",
  measurementId: "G-K6GW8KE770",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
