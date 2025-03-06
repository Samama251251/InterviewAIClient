import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';

export function Login({ onViewChange }: { onViewChange: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="card-body p-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
        Welcome Back
      </h2>
      
      {error && (
        <div className="alert bg-red-50 text-red-700 shadow-sm mb-6">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base text-green-800">Email</span>
          </label>
          <input
            type="email"
            placeholder="email@example.com"
            className="input input-bordered w-full focus:border-green-500 focus:ring-2 focus:ring-green-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base text-green-800">Password</span>
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="input input-bordered w-full focus:border-green-500 focus:ring-2 focus:ring-green-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-control mt-6">
          <button 
            type="submit" 
            className={`btn bg-green-600 hover:bg-green-700 border-none text-white btn-block ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            Sign In
          </button>
        </div>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button 
            className="text-green-600 hover:text-green-700 hover:underline font-medium"
            onClick={onViewChange}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}