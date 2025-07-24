import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Mail, Lock, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { isValidUsername } from '../lib/profanityFilter';

export const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUsernameError('');

    try {
      if (isSignUp) {
        // Username validation
        if (!formData.username.trim()) {
          setUsernameError('Username is required');
          setLoading(false);
          return;
        }
        
        if (formData.username.length < 3) {
          setUsernameError('Username must be at least 3 characters long');
          setLoading(false);
          return;
        }
        
        if (!isValidUsername(formData.username)) {
          setUsernameError('Username contains inappropriate content or invalid characters');
          setLoading(false);
          return;
        }
        
        const { error } = await signUp(formData.email, formData.password, formData.username);
        if (error) throw error;
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear username error when user types in the username field
    if (name === 'username') {
      setUsernameError('');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex justify-center mb-4"
          >
            <Film className="w-12 h-12 text-purple-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white">
            {isSignUp ? 'Create your account' : 'Sign in to FinalReel'}
          </h2>
          <p className="mt-2 text-gray-400">
            {isSignUp 
              ? 'Join the ultimate movie discovery platform'
              : 'Welcome back to your movie universe'
            }
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required={isSignUp}
                    value={formData.username}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      usernameError ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="Username"
                  />
                  {usernameError && (
                    <div className="flex items-center mt-1 text-red-400 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      <span>{usernameError}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setUsernameError('');
                setFormData({ email: '', password: '', username: '' });
              }}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};