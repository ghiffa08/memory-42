import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Home, Upload, Gamepad2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <motion.header 
        className="relative z-10 border-b-4 border-pixel-cyan bg-gradient-to-r from-retro-dark to-purple-900"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <Gamepad2 className="w-8 h-8 text-pixel-yellow" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-pixel-red rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
              <div>
                <h1 className="font-retro text-xl text-pixel-yellow">
                  PKKMB Gallery
                </h1>
                <p className="font-pixel text-sm text-pixel-cyan">
                  Kenangan Pixel Paradise 🎮
                </p>
              </div>
            </motion.div>

            {/* Navigation */}
            <nav className="flex space-x-4">
              <Link to="/">
                <motion.button
                  className={`pixel-btn flex items-center space-x-2 ${
                    isActive('/') 
                      ? 'bg-pixel-yellow text-retro-dark' 
                      : 'bg-pixel-green text-retro-dark'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Home size={16} />
                  <span className="hidden sm:inline">Gallery</span>
                </motion.button>
              </Link>
              
              <Link to="/upload">
                <motion.button
                  className={`pixel-btn flex items-center space-x-2 ${
                    isActive('/upload') 
                      ? 'bg-pixel-yellow text-retro-dark' 
                      : 'bg-pixel-orange text-retro-dark'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Upload size={16} />
                  <span className="hidden sm:inline">Upload</span>
                </motion.button>
              </Link>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-4 border-pixel-purple bg-retro-darker mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Camera className="w-6 h-6 text-pixel-pink" />
            <span className="font-pixel text-pixel-cyan">
              Made with ❤️ for Kelompok 42 - PKKMB UNIKU 2025
            </span>
          </div>
          <p className="font-pixel text-sm text-gray-400">
            Share your memories, create lasting bonds! 🌟
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;