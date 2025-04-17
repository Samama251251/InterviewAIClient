import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/services/supabase/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { AuthContextType } from "@/types/authContext";

// Create context with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isVerified, setIsVerified] = useState(false);

  // Sign up
  const signUpNewUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    console.log("Data coming in", data)

    // Check if the user has already created an account then we will return an error
    if (data.user?.user_metadata?.email_verified == true) {
      console.log("User already exists");
      return { success: false, error: "User already exists" };
    }

    if (error) {
      console.log("User already exists");
      console.error("Error signing up: ", error);
      if (error.code === 'user_already_exists') {
        return { success: false, error: "User already exists" };
      }
      else {
        return { success: false, error: "Sorry, we couldn't create your account. Please try again." };
      }
    }

    console.log(data.user);

    // Check if email confirmation is required
    const needsVerification = data?.user?.identities?.[0]?.identity_data?.email_verified === false;

    return { 
      success: true, 
      data, 
      needsVerification: needsVerification 
    };
  };

  // Sign in
  const signInUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      // Handle Supabase error explicitly
      if (error) {
        console.error("Sign-in error:", error.message);
        console.log("Sign in error: ", error)
        return { success: false, error: error.message };
      }

      // Check if email is verified
      const emailVerified = data?.user?.email_confirmed_at != null;
      setIsVerified(emailVerified);

      // If no error, return success
      console.log("Sign-in success:", data);
      return { success: true, data };
    } catch (err) {
      // Handle unexpected issues
      console.error("Unexpected error during sign-in:", (err as Error).message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // Check if email is verified when session is loaded
      if (session?.user) {
        setIsVerified(session.user.email_confirmed_at != null);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Update verification status when auth state changes
      if (session?.user) {
        setIsVerified(session.user.email_confirmed_at != null);
      } else {
        setIsVerified(false);
      }
    });
  }, []);

  // Sign out
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ signUpNewUser, signInUser, session, signOut, isVerified }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};