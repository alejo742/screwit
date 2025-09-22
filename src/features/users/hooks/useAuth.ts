"use client"
/**
 * useAuth hook
 * Mainly intended to be used across pages to easily fetch authentication status and user data
 */

import { useEffect, useState } from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User } from "../types/user";
import UserService from "../services/user.service";

interface AuthState {
  user: User | null;
  loading: boolean;
}
export default function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  /**
   * Listen to auth. changes
   */
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        // User is signed out
        setFirebaseUser(null);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  /**
   * Listen to changes in the firebase user to fetch the user info. again
   */
  useEffect(() => {
    setState({
      user: null,
      loading: true,
    });

    async function fetch() {
      const newUser: User | null = await UserService.getCurrentUserProfile();
      setState({
        user: newUser,
        loading: false,
      });
    }

    fetch();
  }, [firebaseUser])
  
  return state;
}