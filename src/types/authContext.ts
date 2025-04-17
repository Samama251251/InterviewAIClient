import { Session } from "@supabase/supabase-js";

// Define the shape of the context value
export interface AuthContextType {
    session: Session | null | undefined;
    isVerified: boolean;
    signUpNewUser: (email: string, password: string, name: string) => Promise<{
      success: boolean;
      data?: any;
      error?: any;
      needsVerification?: boolean;
    }>;
    signInUser: (email: string, password: string) => Promise<{
      success: boolean;
      data?: any;
      error?: any;
    }>;
    signOut: () => Promise<void>;
}