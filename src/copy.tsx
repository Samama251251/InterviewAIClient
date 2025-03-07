import './index.css'
import { useState, useEffect, FormEvent } from 'react'
import { createClient, Session } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  const handleEmailSignUp = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'candidate'
        }
      }
    })
    
    if (error) {
      setError(error.message)
    } else {
      setError('Check your email for the confirmation link')
    }
    setLoading(false)
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="card w-full max-w-md bg-white shadow-xl border border-green-100">
          <div className="card-body p-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
              {view === 'sign_in' ? 'Welcome Back' : 'Create Account'}
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
            
            <form onSubmit={view === 'sign_in' ? handleEmailSignIn : handleEmailSignUp} className="space-y-4">
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
                  {view === 'sign_in' ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </form>
            
            <div className="text-center mt-6">
              {view === 'sign_in' ? (
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button 
                    className="text-green-600 hover:text-green-700 hover:underline font-medium"
                    onClick={() => setView('sign_up')}
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button 
                    className="text-green-600 hover:text-green-700 hover:underline font-medium"
                    onClick={() => setView('sign_in')}
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="card w-full max-w-lg bg-white shadow-xl border border-green-100">
          <div className="card-body p-8 text-center">
            <h1 className="text-4xl font-bold mb-2 text-green-700">Welcome!</h1>
            <div className="avatar placeholder my-6">
              <div className="bg-green-600 text-white rounded-full w-24">
                <span className="text-3xl">{session.user.email?.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <p className="text-xl mb-8 text-gray-700">You are signed in as <span className="font-semibold">{session.user.email}</span></p>
            <button 
              className="btn bg-red-500 hover:bg-red-600 border-none text-white btn-lg"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }
}