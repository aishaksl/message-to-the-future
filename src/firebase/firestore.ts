import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Message interface
export interface Message {
    id?: string;
    senderId: string;
    recipientId?: string;
    recipientEmail?: string;
    recipientPhone?: string;
    recipientName: string;
    recipientType: 'self' | 'other';
    subject: string;
    content: string;
    type: 'text' | 'image' | 'video' | 'audio';
    deliveryDate: Date;
    deliveryMethod: 'email';
    status: 'scheduled' | 'delivered' | 'failed';
    isSurprise: boolean;
    mediaUrls?: string[];
    createdAt: Date;
    deliveredAt?: Date;
}

// User interface
export interface UserProfile {
    id?: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    createdAt: Date;
    preferences: {
        notifications: boolean;
        emailUpdates: boolean;
    };
}

// Create a new message
export const createMessage = async (messageData: Omit<Message, 'id' | 'createdAt'>) => {
    try {
        // Clean the data - remove undefined values
        const cleanData = Object.fromEntries(
            Object.entries(messageData).filter(([_, value]) => value !== undefined)
        );
        
        const docRef = await addDoc(collection(db, 'messages'), {
            ...cleanData,
            createdAt: serverTimestamp(),
        });

        return { id: docRef.id, error: null };
    } catch (error: unknown) {
        console.error('Error creating message:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { id: null, error: errorMessage };
    }
};

// Get user's messages
export const getUserMessages = async (userId: string) => {
    try {
        const q = query(
            collection(db, 'messages'),
            where('senderId', '==', userId)
        );

        const querySnapshot = await getDocs(q);
        const messages: Message[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                deliveryDate: data.deliveryDate?.toDate() || new Date(),
                deliveredAt: data.deliveredAt?.toDate() || undefined,
            } as Message);
        });

        // Sort messages by createdAt in JavaScript (temporary solution)
        messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return { messages, error: null };
    } catch (error: unknown) {
        console.error('Error getting messages:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { messages: [], error: errorMessage };
    }
};

// Get messages sent to user
export const getReceivedMessages = async (userEmail: string) => {
    try {
        // For now, return empty array to avoid permissions issues
        // Later we'll implement proper message delivery system
        console.log('getReceivedMessages called for:', userEmail);
        return { messages: [], error: null };
    } catch (error: unknown) {
        console.error('Error getting received messages:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { messages: [], error: errorMessage };
    }
};

// Update a message
export const updateMessage = async (messageId: string, updates: Partial<Message>) => {
    try {
        const messageRef = doc(db, 'messages', messageId);
        await updateDoc(messageRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });

        return { error: null };
    } catch (error: unknown) {
        console.error('Error updating message:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { error: errorMessage };
    }
};

// Delete a message
export const deleteMessage = async (messageId: string) => {
    try {
        await deleteDoc(doc(db, 'messages', messageId));
        return { error: null };
    } catch (error: unknown) {
        console.error('Error deleting message:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { error: errorMessage };
    }
};

// Create or update user profile
export const createUserProfile = async (userId: string, profileData: Omit<UserProfile, 'id' | 'createdAt'>) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            ...profileData,
            createdAt: serverTimestamp(),
        });

        return { error: null };
    } catch (error: unknown) {
        // If document doesn't exist, create it
        try {
            await addDoc(collection(db, 'users'), {
                id: userId,
                ...profileData,
                createdAt: serverTimestamp(),
            });
            return { error: null };
        } catch (createError: unknown) {
            console.error('Error creating user profile:', createError);
            const errorMessage = createError instanceof Error ? createError.message : String(createError);
            return { error: errorMessage };
        }
    }
};

// Get user profile
export const getUserProfile = async (userId: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            return {
                profile: {
                    id: userSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                } as UserProfile,
                error: null
            };
        } else {
            return { profile: null, error: 'User profile not found' };
        }
    } catch (error: unknown) {
        console.error('Error getting user profile:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { profile: null, error: errorMessage };
    }
};