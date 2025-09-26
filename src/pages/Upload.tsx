import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload as UploadIcon, MessageSquare, X, Check, Image } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import CameraCapture from '../components/CameraCapture';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

type UploadMode = 'photo' | 'camera' | 'message';

const Upload: React.FC = () => {
  const [mode, setMode] = useState<UploadMode>('photo');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (imageBlob: Blob) => {
    const file = new File([imageBlob], 'selfie.jpg', { type: 'image/jpeg' });
    setSelectedFile(file);
    const url = URL.createObjectURL(imageBlob);
    setPreview(url);
    setShowCamera(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !message.trim()) {
      showToast('error', 'Nama dan pesan harus diisi! 🙈');
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl: string | null = null;

      // Upload image if exists
      if (selectedFile && (mode === 'photo' || mode === 'camera')) {
        const imageRef = ref(storage, `memories/${Date.now()}_${selectedFile.name}`);
        const snapshot = await uploadBytes(imageRef, selectedFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // Save to Firestore
      const docData = {
        type: mode === 'message' ? 'message' : 'photo',
        name: name.trim(),
        message: message.trim(),
        ...(imageUrl && { imageUrl }),
        timestamp: new Date(),
        likes: 0
      };

      await addDoc(collection(db, 'memories'), docData);

      // Reset form
      setName('');
      setMessage('');
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      showToast('success', '🎉 Memory berhasil ditambahkan ke gallery!');
      
    } catch (error) {
      console.error('Error uploading:', error);
      showToast('error', 'Oops! Gagal upload. Coba lagi ya! 😅');
    } finally {
      setIsLoading(false);
    }
  };

  const clearPreview = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Menyimpan memory kamu..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-retro text-4xl md:text-6xl text-pixel-yellow mb-4">
          Share Memory
        </h1>
        <p className="font-pixel text-xl text-pixel-cyan mb-8">
          Bagikan momen seru PKKMB kamu! 📸✨
        </p>
      </motion.div>

      {/* Mode Selection */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { key: 'photo', label: '📷 Upload Foto', icon: UploadIcon, color: 'pixel-blue' },
          { key: 'camera', label: '🤳 Ambil Selfie', icon: Camera, color: 'pixel-green' },
          { key: 'message', label: '💌 Tulis Pesan', icon: MessageSquare, color: 'pixel-purple' }
        ].map(({ key, label, icon: Icon, color }) => (
          <motion.button
            key={key}
            onClick={() => setMode(key as UploadMode)}
            className={`pixel-btn flex items-center space-x-3 ${
              mode === key 
                ? `bg-${color} text-retro-dark shadow-pixel-hover` 
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
            whileHover={{ y: -2, scale: 1.05 }}
            whileTap={{ y: 0 }}
          >
            <Icon size={20} />
            <span>{label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Main Form */}
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="pixel-card p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block font-retro text-pixel-cyan mb-3">
                🎮 Nama Kamu
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama kamu..."
                className="pixel-input w-full"
                maxLength={50}
                required
              />
            </div>

            {/* Message Input */}
            <div>
              <label className="block font-retro text-pixel-cyan mb-3">
                💭 Ceritain Kesan PKKMB Kamu
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis kesan seru kamu tentang PKKMB..."
                className="pixel-input w-full h-32 resize-none"
                maxLength={300}
                required
              />
              <div className="text-right text-sm text-gray-500 mt-1 font-pixel">
                {message.length}/300
              </div>
            </div>

            {/* Photo Upload Section */}
            {mode === 'photo' && (
              <div>
                <label className="block font-retro text-pixel-cyan mb-3">
                  📸 Upload Foto
                </label>
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {!preview ? (
                    <motion.button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-4 border-dashed border-pixel-blue bg-retro-dark hover:bg-slate-800 transition-colors p-8 text-center group"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Image className="w-12 h-12 text-pixel-blue mx-auto mb-4 group-hover:text-pixel-cyan transition-colors" />
                      <p className="font-pixel text-pixel-blue group-hover:text-pixel-cyan">
                        Klik untuk pilih foto
                      </p>
                      <p className="font-pixel text-sm text-gray-500 mt-2">
                        JPG, PNG maksimal 10MB
                      </p>
                    </motion.button>
                  ) : (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover border-4 border-pixel-cyan"
                      />
                      <motion.button
                        type="button"
                        onClick={clearPreview}
                        className="absolute top-2 right-2 bg-pixel-red text-white p-2 hover:bg-red-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X size={16} />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Camera Section */}
            {mode === 'camera' && (
              <div>
                <label className="block font-retro text-pixel-cyan mb-3">
                  🤳 Ambil Selfie
                </label>
                
                {!preview ? (
                  <motion.button
                    type="button"
                    onClick={() => setShowCamera(true)}
                    className="w-full pixel-btn bg-pixel-green text-retro-dark py-6"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Camera className="w-8 h-8 mx-auto mb-2" />
                    <span className="block">Buka Kamera</span>
                  </motion.button>
                ) : (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Selfie Preview"
                      className="w-full h-64 object-cover border-4 border-pixel-green"
                    />
                    <motion.button
                      type="button"
                      onClick={clearPreview}
                      className="absolute top-2 right-2 bg-pixel-red text-white p-2 hover:bg-red-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={16} />
                    </motion.button>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !name.trim() || !message.trim()}
              className="w-full pixel-btn bg-pixel-yellow text-retro-dark py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center space-x-3">
                <Check size={24} />
                <span>
                  {mode === 'message' ? '💌 Kirim Pesan' : '📸 Share Memory'}
                </span>
              </div>
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default Upload;