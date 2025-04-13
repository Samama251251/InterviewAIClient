import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const { signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signUpNewUser(email, password);

      if (result.success) {
        if (result.needsVerification) {
          setVerificationSent(true);
          console.log("Verification email sent");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="max-w-md m-auto pt-24 text-center">
        <h2 className="font-bold pb-2">Verification Email Sent!</h2>
        <p className="mb-4">
          We've sent a verification email to <strong>{email}</strong>.
        </p>
        <p className="mb-4">
          Please check your inbox and click the verification link to complete your registration.
        </p>
        <p>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Sign In
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSignUp} className="max-w-md m-auto pt-24">
        <h2 className="font-bold pb-2">Sign up today!</h2>
        <p>
          Already have an account? <Link to="/">Sign in</Link>
        </p>
        <div className="flex flex-col py-4">
          {/* <label htmlFor="Email">Email</label> */}
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 mt-2"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
          />
        </div>
        <div className="flex flex-col py-4">
          {/* <label htmlFor="Password">Password</label> */}
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 mt-2"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
        </div>
        <button type="submit" disabled={loading} className="w-full mt-4">
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        {error && <p className="text-red-600 text-center pt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Signup;