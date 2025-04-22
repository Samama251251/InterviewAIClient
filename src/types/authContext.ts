// import { Session } from "@supabase/supabase-js"; // No longer needed

// Define placeholder types - replace with actual types from better-auth if available
type AuthSession = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined;
  };
  session: {
    id: string;
    createdAt: Date;
    userAgent?: string | null | undefined;
    ipAddress?: string | null | undefined; // Assuming this might exist
    expiresAt?: Date | null | undefined; // Assuming this might exist
    // Add other session properties if known
  };
} | null;
// Remove unused placeholder types
// type AuthUser = { email?: string; name?: string; emailVerified?: boolean; /* other user props */ };
// type AuthError = Error;

// Define the shape of the context value
export interface AuthContextType {
    session: AuthSession | null | undefined;
    isVerified: boolean;
    isPending: boolean; // Add loading state
    // Removed email/password specific functions

    // Add Google Sign-In function
    signInWithGoogle: () => Promise<void>; // Assuming it initiates the flow

    signOut: () => Promise<void>; // Keep signOut, implementation might change

    // Removed updateUser for now
}