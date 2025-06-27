import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { HomePage } from './pages/HomePage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { SearchPage } from './pages/SearchPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { PlaylistPage } from './pages/PlaylistPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { AuthPage } from './pages/AuthPage';
import { Navbar } from './components/Navbar';
import { useAuth } from './hooks/useAuth';
import { motion } from 'framer-motion';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Animated background component
const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900/40"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(76, 29, 149, 0.3) 0%, rgba(17, 24, 39, 0.4) 70%)',
            'radial-gradient(circle at 100% 100%, rgba(76, 29, 149, 0.3) 0%, rgba(17, 24, 39, 0.4) 70%)',
            'radial-gradient(circle at 100% 0%, rgba(76, 29, 149, 0.3) 0%, rgba(17, 24, 39, 0.4) 70%)',
            'radial-gradient(circle at 0% 100%, rgba(76, 29, 149, 0.3) 0%, rgba(17, 24, 39, 0.4) 70%)',
            'radial-gradient(circle at 0% 0%, rgba(76, 29, 149, 0.3) 0%, rgba(17, 24, 39, 0.4) 70%)',
          ]
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Bokeh effect */}
      <div className="bokeh-container">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="bokeh"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.3 + 0.1,
            }}
            animate={{
              x: `calc(${Math.random() * 100}% + ${(mousePosition.x - 0.5) * -30}px)`,
              y: `calc(${Math.random() * 100}% + ${(mousePosition.y - 0.5) * -30}px)`,
              scale: [
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.7 + 0.3,
                Math.random() * 0.5 + 0.5,
              ],
              opacity: [
                Math.random() * 0.3 + 0.1,
                Math.random() * 0.3 + 0.1,
                Math.random() * 0.3 + 0.1,
              ]
            }}
            transition={{
              duration: Math.random() * 20 + 30,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              background: `radial-gradient(circle at center, ${
                i % 2 === 0
                  ? 'rgba(139, 92, 246, 0.5)'
                  : 'rgba(91, 33, 182, 0.5)'
              } 0%, transparent 70%)`,
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              borderRadius: '50%',
              filter: 'blur(60px)',
              position: 'absolute',
            }}
          />
        ))}
      </div>
    </div>
  );
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AnimatedBackground />
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
      
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;