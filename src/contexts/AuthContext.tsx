import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType } from "@/types/authContext";
import { authClient } from "@/lib/auth-client"; //import the auth client

// Create context with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  // Is pending represets the loading state of authentications session.When true, it indicates that the session data is still being fetched or authenticated
  // It is useful for showing loading indicators in your ui while authentication status is being determined 
  const { data: session, isPending } = authClient.useSession();
  const [isVerified, setIsVerified] = useState(false);
  console.log("This is the value of session", session)
  useEffect(() => {
    if (session?.user) {
      setIsVerified(session.user.emailVerified || false);
    } else {
      setIsVerified(false);
    }
    // Session is the dependency
  }, [session]);

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social(
        {
           provider: "google",
           // Remove client-side callbackURL, let server handle final redirect
          callbackURL: "http://localhost:5173/dashboard"
        }
      );
      // The browser should redirect to Google, and then back based on server config
      // Session update will be handled by the useSession hook automatically upon redirect
    } catch (error) {
      console.error("Google Sign-In error:", error);
      // Handle error appropriately, e.g., show a notification to the user
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  // GitHub Sign In
  const signInWithGithub = async () => {
    try {
      // Initiate GitHub Sign-In flow
      await authClient.signIn.social(
        {
          provider: "github",
          callbackURL: "http://localhost:5173/dashboard"
        }
      );
    } catch (error) {
      console.error("GitHub Sign-In error:", error);
      alert("Failed to sign in with GitHub. Please try again.");
    }
  };
  

  // Sign out
  async function signOut() {
    try {
      await authClient.signOut();
      // Session should automatically update via useSession hook
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle sign-out error
      alert("Failed to sign out. Please try again.");
    }
  }

  // REMOVED: signUpNewUser, signInUser, updateUser functions

  // Provide isPending in the context value
  return (
    <AuthContext.Provider
      value={{ 
        session, 
        isVerified, 
        isPending, 
        signInWithGoogle, 
        signInWithGithub, 
        signOut ,
      }}
    >
      {/* Render children directly, PrivateRoute will handle loading UI */}
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