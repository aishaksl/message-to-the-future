import { useState, useEffect } from 'react';
import {
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import { auth } from '@/firebase/config';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Email/Password Sign In
    const signIn = async (email: string, password: string) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return { user: result.user, error: null };
        } catch (error: any) {
            return { user: null, error: error.message };
        }
    };

    // Email/Password Sign Up
    const signUp = async (email: string, password: string, displayName: string) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update user profile with display name
            await updateProfile(result.user, {
                displayName: displayName
            });

            return { user: result.user, error: null };
        } catch (error: any) {
            return { user: null, error: error.message };
        }
    };

    // Google Sign In
    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            return { user: result.user, error: null };
        } catch (error: unknown) {
            return { user: null, error: error.message };
        }
    };



    // Sign Out
    const logout = async () => {
        try {
            await signOut(auth);
            return { error: null };
        } catch (error: unknown) {
            return { error: error.message };
        }
    };

    return {
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        logout
    };
};