import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, User, Calendar, Image as ImageIcon } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import PhotoModal from '../components/PhotoModal';

interface GalleryItem {
  id: string;
  type: 'photo' | 'message';
  name: string;
  message: string;
  imageUrl?: string;
  timestamp: Date;
  likes: number;
}

const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'photos' | 'messages'>('all');

  // Dummy data for demonstration
  const dummyData: GalleryItem[] = [
    {
      id: '1',
      type: 'photo',
      name: 'Andi Pratama',
      message: 'PKKMB hari pertama! Excited banget ketemu temen baru! 🎉',
      imageUrl: 'https://picsum.photos/400/300?random=1',
      timestamp: new Date('2024-09-20'),
      likes: 15
    },
    {
      id: '2',
      type: 'message',
      name: 'Sari Indah',
      message: 'Terima kasih kakak-kakak senior yang udah ngajarin banyak hal. PKKMB ini seru banget! Semoga bisa jadi mahasiswa yang berprestasi! ✨',
      timestamp: new Date('2024-09-21'),
      likes: 8
    },
    {
      id: '3',
      type: 'photo',
      name: 'Budi Santoso',
      message: 'Games seru abis! Tim kita menang! 🏆',
      imageUrl: 'https://picsum.photos/400/300?random=2',
      timestamp: new Date('2024-09-21'),
      likes: 23
    },
    {
      id: '4',
      type: 'photo',
      name: 'Maya Sari',
      message: 'Foto bareng angkatan 2024! We are family now! 👨‍👩‍👧‍👦',
      imageUrl: 'https://picsum.photos/400/300?random=3',
      timestamp: new Date('2024-09-22'),
      likes: 42
    },
    {
      id: '5',
      type: 'message',
      name: 'Rizky Pratama',
      message: 'Makasih PKKMB udah ngajarin tentang kehidupan kampus. Sekarang udah siap jadi mahasiswa yang aktif dan bertanggung jawab! 🎓',
      timestamp: new Date('2024-09-22'),
      likes: 12
    },
    {
      id: '6',
      type: 'photo',
      name: 'Dewi Lestari',
      message: 'Outbound PKKMB di alam terbuka. Fresh air, fresh mind! 🌿',
      imageUrl: 'https://picsum.photos/400/300?random=4',
      timestamp: new Date('2024-09-23'),
      likes: 18
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setItems(dummyData);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredItems = items.filter(item => {
    if (filter === 'photos') return item.type === 'photo';
    if (filter === 'messages') return item.type === 'message';
    return true;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-retro text-4xl md:text-6xl text-pixel-yellow mb-4">
          Memory Arcade
        </h1>
        <p className="font-pixel text-xl text-pixel-cyan mb-8">
          Koleksi momen seru PKKMB 2024! 🎮✨
        </p>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { key: 'all', label: '🎮 Semua', color: 'pixel-purple' },
            { key: 'photos', label: '📸 Foto', color: 'pixel-blue' },
            { key: 'messages', label: '💬 Pesan', color: 'pixel-orange' }
          ].map(({ key, label, color }) => (
            <motion.button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`font-retro text-sm px-6 py-3 border-4 border-black shadow-pixel transition-all duration-150 ${
                filter === key 
                  ? `bg-${color} text-retro-dark shadow-pixel-hover` 
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { label: 'Total Memories', value: items.length, icon: '🎮', color: 'pixel-yellow' },
          { label: 'Foto Seru', value: items.filter(i => i.type === 'photo').length, icon: '📸', color: 'pixel-blue' },
          { label: 'Sweet Messages', value: items.filter(i => i.type === 'message').length, icon: '💌', color: 'pixel-pink' },
          { label: 'Total Likes', value: items.reduce((sum, item) => sum + item.likes, 0), icon: '❤️', color: 'pixel-red' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="pixel-card p-6 text-center"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`font-retro text-2xl text-${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="font-pixel text-sm text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Gallery Grid */}
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                layout: { duration: 0.3 }
              }}
              whileHover={{ y: -5 }}
              className="pixel-card overflow-hidden group"
            >
              {/* Image Section */}
              {item.type === 'photo' && item.imageUrl && (
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={`Memory by ${item.name}`}
                    className="w-full h-48 object-cover cursor-pointer transition-transform group-hover:scale-105"
                    onClick={() => setSelectedPhoto(item.imageUrl!)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                  <div className="absolute top-2 right-2 bg-pixel-green text-retro-dark font-retro text-xs px-2 py-1">
                    📸 PHOTO
                  </div>
                </div>
              )}

              {/* Message-only card styling */}
              {item.type === 'message' && (
                <div className="bg-gradient-to-br from-pixel-purple to-pixel-pink p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-white mx-auto mb-4" />
                  <div className="bg-pixel-orange text-retro-dark font-retro text-xs px-3 py-1 rounded-full inline-block">
                    💌 MESSAGE
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div className="p-6">
                {/* User Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-pixel-cyan to-pixel-blue rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-pixel text-pixel-yellow font-bold">
                      {item.name}
                    </div>
                    <div className="font-pixel text-xs text-gray-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.timestamp.toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <p className="font-pixel text-sm text-gray-300 mb-4 leading-relaxed">
                  {item.message}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <motion.button
                    className="flex items-center space-x-2 text-pixel-red hover:text-pixel-pink transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className="w-4 h-4" />
                    <span className="font-pixel text-sm">{item.likes}</span>
                  </motion.button>

                  <div className="flex items-center space-x-1 text-gray-500">
                    {item.type === 'photo' && <ImageIcon className="w-4 h-4" />}
                    {item.type === 'message' && <MessageCircle className="w-4 h-4" />}
                    <span className="font-pixel text-xs capitalize">{item.type}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          imageUrl={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="font-retro text-xl text-pixel-yellow mb-2">
            Belum ada memories nih!
          </h3>
          <p className="font-pixel text-gray-400">
            Yuk upload foto atau tulis pesan pertama kamu! ✨
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Gallery;