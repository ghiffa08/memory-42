import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Heart, Share2 } from 'lucide-react';

interface PhotoModalProps {
  imageUrl: string;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ imageUrl, onClose }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `pkkmb-memory-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PKKMB Memory',
          text: 'Check out this awesome PKKMB memory! 📸✨',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard! 📋');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-4xl max-h-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-pixel-red transition-colors z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={32} />
          </motion.button>

          {/* Image */}
          <img
            src={imageUrl}
            alt="PKKMB Memory"
            className="max-w-full max-h-[80vh] object-contain border-4 border-pixel-cyan shadow-glow"
          />

          {/* Action buttons */}
          <div className="absolute -bottom-16 left-0 right-0 flex justify-center space-x-4">
            <motion.button
              onClick={handleDownload}
              className="pixel-btn bg-pixel-blue text-retro-dark flex items-center space-x-2"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Download size={16} />
              <span>Download</span>
            </motion.button>
            
            <motion.button
              onClick={handleShare}
              className="pixel-btn bg-pixel-green text-retro-dark flex items-center space-x-2"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Share2 size={16} />
              <span>Share</span>
            </motion.button>
            
            <motion.button
              className="pixel-btn bg-pixel-red text-white flex items-center space-x-2"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Heart size={16} />
              <span>Like</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PhotoModal;