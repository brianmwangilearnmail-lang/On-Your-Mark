import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Lock, User as UserIcon } from 'lucide-react';
import { db } from '../db/db';

interface AuthFormsProps {
  initialMode: 'login' | 'signup';
  onBack: () => void;
  onSuccess: () => void;
}

export function AuthForms({ initialMode, onBack, onSuccess }: AuthFormsProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const user = await db.users.get(email);
        if (user && user.passwordHash === password) { // Note: insecure plain-text for demo mock
          localStorage.setItem('oym_user_email', email);
          onSuccess();
        } else {
          setError('Invalid email or password');
        }
      } else {
        const existing = await db.users.get(email);
        if (existing) {
          setError('Email already in use');
          return;
        }
        await db.users.put({
          email,
          passwordHash: password, // In a real app, never store plain text passwords
          name
        });
        localStorage.setItem('oym_user_email', email);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#1CB0F6] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <button 
          onClick={onBack}
          className="absolute left-0 top-1 text-[#6B7280] hover:text-[#111827] flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
        </button>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-[#111827]">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="mt-2 text-center text-sm text-[#6B7280]">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="font-medium text-[#1CB0F6] hover:text-[#0A8FCC]"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-[#E5E7EB]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#4B4B4B]">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1CB0F6] focus:border-transparent transition-all sm:text-sm bg-gray-50/50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#4B4B4B]">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1CB0F6] focus:border-transparent transition-all sm:text-sm bg-gray-50/50 focus:bg-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4B4B4B]">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1CB0F6] focus:border-transparent transition-all sm:text-sm bg-gray-50/50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#1CB0F6] hover:bg-[#0A8FCC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1CB0F6] transition-all"
              >
                {isLogin ? 'Log in' : 'Sign up'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
