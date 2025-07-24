import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Search, Heart, User, LogOut, Menu, X, Play } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Film },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/playlists', label: 'Playlists', icon: Play },
    ...(user ? [{ path: '/watchlist', label: 'Watchlist', icon: Heart }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{ 
        background: 'rgba(24, 24, 24, 0.9)',
        borderBottomColor: 'rgba(212, 175, 55, 0.1)'
      }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Film className="w-8 h-8" style={{ color: '#CBAF6C' }} />
              <span className="text-xl font-light" style={{ color: '#F0EDE3', letterSpacing: '0.02em' }}>
                The FinalReel
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive(path)
                    ? 'text-white'
                    : 'hover:text-white'
                }`}
                style={{
                  color: isActive(path) ? '#F0EDE3' : '#AFAFAF',
                  backgroundColor: isActive(path) ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span style={{ color: '#AFAFAF' }}>
                  Welcome, {user.user_metadata?.username || user.email}
                </span>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  icon={LogOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                variant="primary"
                size="sm"
                className="flex items-center space-x-1 px-4"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 transition-colors"
            style={{ color: '#AFAFAF' }}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4"
            style={{ borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}
          >
            <div className="space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(path)
                      ? 'text-white'
                      : 'hover:text-white'
                  }`}
                  style={{
                    color: isActive(path) ? '#F0EDE3' : '#AFAFAF',
                    backgroundColor: isActive(path) ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
              
              <div className="pt-4 mt-4" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}>
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2" style={{ color: '#AFAFAF' }}>
                      Welcome, {user.user_metadata?.username || user.email}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg transition-all duration-300"
                      style={{ color: '#AFAFAF' }}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/auth');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg transition-all duration-300"
                    style={{ color: '#AFAFAF' }}
                  >
                    <User className="w-5 h-5" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};