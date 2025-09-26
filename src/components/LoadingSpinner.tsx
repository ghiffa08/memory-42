import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading memories...' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Spinning gamepad */}
        <motion.div
          className="mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Gamepad2 className="w-16 h-16 text-pixel-yellow mx-auto" />
        </motion.div>

        {/* Pixel-style loading dots */}
        <div className="loading-dots mb-6">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <motion.h2
          className="font-retro text-2xl text-pixel-cyan mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.h2>

        <p className="font-pixel text-gray-400">
          {message}
        </p>

        {/* Progress bar animation */}
        <div className="w-64 h-4 bg-retro-dark border-4 border-pixel-blue mx-auto mt-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pixel-green to-pixel-cyan"
            animate={{ width: ['0%', '100%'] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;