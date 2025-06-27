import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { SearchPage } from './pages/SearchPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { PlaylistPage } from './pages/PlaylistPage';
import { AuthPage } from './pages/AuthPage';
import { motion } from 'framer-motion';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function createBokehParticle() {
  return {
    size: Math.random() * 45 + 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.4 + 0.1,
    duration: Math.random() * 45 + 15,
    delay: Math.random() * 10,
  };
}

function BokehBackground() {
  const particles = Array.from({ length: 15 }, () => createBokehParticle());

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/10 blur-xl"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 relative">
          <BokehBackground />
          <Navbar />
          <main className="pb-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/playlists" element={<PlaylistsPage />} />
              <Route path="/playlist/:id" element={<PlaylistPage />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;