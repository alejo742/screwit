/**
 * Sign In or Register Utility
 * This utility function attempts to sign in a user in the specified provider
 * and if the user does not exist, it registers them.
 */

import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import { User, providerType } from '../types/user';
import { User as FirebaseUser } from 'firebase/auth';

export async function signInOrRegister(provider: providerType): Promise<User> {
  try {
    // Attempt to sign in the user with the specified provider
    let firebaseUser: FirebaseUser | null = null; 
    if (provider === 'google') {
      firebaseUser = await AuthService.signInWithGoogle();
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    
    if (!firebaseUser) {
      throw new Error('No user information returned from sign-in.');
    }

    // Check if the user already exists in Firestore
    const user = await UserService.getCurrentUserProfile();
    if (user) {
      // User exists, return the user profile
      return user;
    } else {
      // User does not exist, register them
      const newUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Anonymous',
        email: firebaseUser.email || 'No Email',
        provider: provider,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await UserService.createUser(newUser);
      return newUser;
    }
  } catch (error) {
    console.error('Error in signInOrRegister:', error);
    throw error; // Re-throw the error for further handling
  }
}
