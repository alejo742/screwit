/**
 * User Service
 * This service handles user-related operations such as fetching user data, updating user profiles, and managing user preferences.
 */

import { auth, db } from '@/lib/firebase';
import { User } from '../types/user';
import { getDoc, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';


export default class UserService {
  /****** USER OPERATIONS ******/
  
  /**
   * Creates a user in Firestore
   * @param user - The user object containing user details.
   * @returns {Promise<void>} Returns a promise that resolves when the user is created successfully.
   */
  static async createUser(user: User): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', user.id);
      await setDoc(userDocRef, {
        ...user,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw the error for further handling
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<User | null>} Returns a promise that resolves to the current user profile (not parsed).
   */
  static async getCurrentUserProfile(): Promise<User | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null; // Return null if no user is logged in

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        return {
          ...userData,
          id: user.uid, // Ensure the ID is included
        };
      } else {
        console.warn('No user data found for current user');
        return null;
      }
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error; // Re-throw the error for further handling
    }
  }

  /**
   * Get user document by ID
   * @param userId User's unique ID
   * @returns {Promise<User | null>} User document data or null if not found
   */
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? userDoc.data() as User : null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Get a user document by email
   * @param email User's email address
   * @returns {Promise<User | null>} User document data or null if not found
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return userDoc.data() as User;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Deletes a user from Firestore
   * @param userId - The ID of the user to be deleted.
   * @return {Promise<void>} Returns a promise that resolves when the user is deleted successfully.
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {}, { merge: true });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error; // Re-throw the error for further handling
    }
  }
}