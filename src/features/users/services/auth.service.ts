/**
 * Auth Service
 * This service handles authentication-related operations such as login and logout.
 */

import { auth } from '@/lib/firebase';
import { 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  UserCredential,
  User as FirebaseUser, 
} from 'firebase/auth';


export default class AuthService {
  /****** SIGN IN LOGIC ******/
  /**
   * Sign in with Google
   * @returns {Promise<object>} Returns a promise that resolves to the user object (not yet parsed) after successful sign-in.
   */
  static async signInWithGoogle(): Promise<FirebaseUser | null> {
    const provider = new GoogleAuthProvider();
    try {
      const result: UserCredential = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error; // Re-throw the error for further handling
    }
  }

  /****** SIGN OUT LOGIC ******/
  /**
   * Sign out the current user
   * @returns {Promise<void>} Returns a promise that resolves when the user is signed out.
   */
  static async signOutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error; // Re-throw the error for further handling
    }
  }
}