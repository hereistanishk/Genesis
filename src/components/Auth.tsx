import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { auth, googleProvider, facebookProvider } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';

interface AuthProps {
  onLogin: () => void;
  onGuest: () => void;
}

export function Auth({ onLogin, onGuest }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'An error occurred during password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await signInWithPopup(auth, facebookProvider);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'An error occurred during Facebook authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 font-sans text-stone-900">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm ring-1 ring-stone-900/5 p-8 space-y-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-10 h-10">
              <g fill="#171717" stroke="#171717" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
                <circle cx="50" cy="20" r="5" />
                <path d="M 50 26 C 72 26, 72 46, 66 54 C 60 62, 54 62, 50 62 C 46 62, 40 62, 34 54 C 28 46, 28 26, 50 26 Z" />
                <rect x="36" y="62" width="28" height="6" rx="3" />
                <path d="M 40 68 C 40 78, 28 80, 26 84 L 74 84 C 72 80, 60 78, 60 68 Z" />
                <rect x="20" y="86" width="60" height="8" rx="4" />
              </g>
              <line x1="56" y1="34" x2="42" y2="48" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Genesis Chess</h1>
          <p className="text-stone-500 text-sm">
            {isResetPassword ? 'Reset your password.' : isLogin ? 'Welcome back. Sign in to your account.' : 'Create an account to save your games.'}
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 text-sm text-green-600 bg-green-50 rounded-xl border border-green-100">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={isResetPassword ? handleResetPassword : handleEmailAuth}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {!isResetPassword && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-stone-700 block">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => { setIsResetPassword(true); setError(''); setMessage(''); }}
                    className="text-xs font-medium text-stone-500 hover:text-stone-900 focus:outline-none hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all"
                  required={!isResetPassword}
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white font-medium py-2.5 rounded-xl hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 mt-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isResetPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {isResetPassword ? (
          <p className="text-center text-sm text-stone-500 pt-4">
            Remember your password?{' '}
            <button 
              onClick={() => { setIsResetPassword(false); setError(''); setMessage(''); }}
              className="font-medium text-stone-900 hover:underline focus:outline-none"
            >
              Back to sign in
            </button>
          </p>
        ) : (
          <>
            <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-stone-500 text-xs uppercase tracking-wider font-medium">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-1 disabled:opacity-50"
          >
            <GoogleIcon /> Google
          </button>
          <button 
            type="button"
            onClick={handleFacebookAuth}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-1 disabled:opacity-50"
          >
            <FacebookIcon /> Facebook
          </button>
        </div>

        <div className="pt-2">
          <button 
            type="button"
            onClick={onGuest}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-stone-100 text-stone-900 rounded-xl hover:bg-stone-200 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
          >
            <User className="w-4 h-4" /> Play as Guest
          </button>
        </div>

        <p className="text-center text-sm text-stone-500 pt-2">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}
            className="font-medium text-stone-900 hover:underline focus:outline-none"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
          </>
        )}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z" fill="#1877F2"/>
    </svg>
  );
}
