import React from 'react';
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

// Animated background component with subtle bokeh effect
const AnimatedBackground = () => {
  // Create bokeh elements with different sizes, colors and properties
  const createBokehElements = () => {
    // Bokeh colors with increased opacity
    const bokehColors = [
      'rgba(70, 130, 180, 0.7)',  // Steel blue
      'rgba(147, 112, 219, 0.6)',  // Medium purple
      'rgba(255, 160, 122, 0.6)',  // Light salmon
      'rgba(102, 205, 170, 0.6)',  // Medium aquamarine
      'rgba(255, 215, 0, 0.5)',    // Gold
      'rgba(255, 105, 180, 0.5)',  // Hot pink
      'rgba(176, 224, 230, 0.65)', // Powder blue
      'rgba(255, 255, 240, 0.6)',  // Ivory
    ];
    
    const bokehElements = [];
    const numElements = 35; // Good number of elements for varied effect
    
    for (let i = 0; i < numElements; i++) {
      // Create varied sizes - mostly small with a few larger ones
      const isLarge = Math.random() > 0.85;
      const size = isLarge 
        ? Math.random() * 35 + 35  // 35-70px for larger ones
        : Math.random() * 15 + 10; // 10-25px for smaller ones
      
      // Different opacity based on size - increased for visibility
      const opacity = isLarge ? 0.5 + Math.random() * 0.3 : 0.4 + Math.random() * 0.3;
      
      // Random color from our palette
      const color = bokehColors[Math.floor(Math.random() * bokehColors.length)];
      
      // Random starting position
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      
      // Animation parameters
      const duration = Math.random() * 80 + 60; // Between 60-140 seconds for very slow movement
      
      bokehElements.push(
        <motion.div
          key={i}
          className="bokeh-particle"
          initial={{
            x: `${startX}%`,
            y: `${startY}%`,
            opacity: 0,
          }}
          animate={{
            x: [`${startX}%`, `${(startX + Math.random() * 10 - 5) % 100}%`],
            y: [`${startY}%`, `${(startY + Math.random() * 10 - 5) % 100}%`],
            opacity: [0, opacity, opacity, 0],
          }}
          transition={{
            duration: duration,
            times: [0, 0.1, 0.9, 1],
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: Math.random() * 5, // Stagger the start times
          }}
          style={{
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 ${size/1.5}px ${size/2}px ${color}`,
            filter: `blur(${Math.random() * 1.5 + 0.5}px)`, // Less blur for more visibility
            zIndex: 0,
          }}
        />
      );
    }
    return bokehElements;
  };
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Solid dark background - no gradient */}
      <div className="absolute inset-0 bg-[#050718]"></div>
      
      {/* Bokeh effect container */}
      <div className="bokeh-container pointer-events-none h-full w-full absolute">
        {createBokehElements()}
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