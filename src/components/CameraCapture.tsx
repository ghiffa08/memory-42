import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, RotateCcw, Download } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageBlob: Blob) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Tidak bisa akses kamera. Pastikan izin kamera sudah diberikan! 📸');
    } finally {
      setIsLoading(false);
    }
  }, [facingMode]);

  React.useEffect(() => {
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera, stream]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip image if using front camera
    if (facingMode === 'user') {
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(dataUrl);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const confirmCapture = () => {
    if (!capturedImage || !canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        onCapture(blob);
        closeCamera();
      }
    }, 'image/jpeg', 0.8);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-4xl aspect-video bg-retro-dark border-4 border-pixel-cyan overflow-hidden"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black to-transparent p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-retro text-pixel-cyan text-lg">
                📸 Camera Mode
              </h3>
              <button
                onClick={closeCamera}
                className="text-white hover:text-pixel-red transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Camera View */}
          {!capturedImage ? (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="loading-dots mb-4">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <p className="font-pixel text-pixel-cyan">
                      Mengakses kamera...
                    </p>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${
                    facingMode === 'user' ? 'scale-x-[-1]' : ''
                  }`}
                />
              )}
            </>
          ) : (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}

          {/* Canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black to-transparent p-6">
            <div className="flex justify-center items-center space-x-6">
              {!capturedImage ? (
                <>
                  {/* Switch Camera */}
                  <motion.button
                    onClick={switchCamera}
                    className="pixel-btn bg-pixel-blue text-retro-dark p-3"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw size={20} />
                  </motion.button>

                  {/* Capture Button */}
                  <motion.button
                    onClick={capturePhoto}
                    className="w-16 h-16 bg-pixel-red border-4 border-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                  >
                    <Camera className="text-white" size={24} />
                  </motion.button>

                  <div className="w-12 h-12" /> {/* Spacer */}
                </>
              ) : (
                <>
                  {/* Retake */}
                  <motion.button
                    onClick={retakePhoto}
                    className="pixel-btn bg-pixel-orange text-retro-dark"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw size={16} className="mr-2" />
                    Foto Ulang
                  </motion.button>

                  {/* Use Photo */}
                  <motion.button
                    onClick={confirmCapture}
                    className="pixel-btn bg-pixel-green text-retro-dark"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download size={16} className="mr-2" />
                    Gunakan Foto
                  </motion.button>
                </>
              )}
            </div>
          </div>

          {/* Camera guide overlay */}
          {!capturedImage && !isLoading && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="relative w-full h-full">
                {/* Corner guides */}
                <div className="absolute top-1/4 left-1/4 w-8 h-8 border-t-4 border-l-4 border-pixel-cyan"></div>
                <div className="absolute top-1/4 right-1/4 w-8 h-8 border-t-4 border-r-4 border-pixel-cyan"></div>
                <div className="absolute bottom-1/4 left-1/4 w-8 h-8 border-b-4 border-l-4 border-pixel-cyan"></div>
                <div className="absolute bottom-1/4 right-1/4 w-8 h-8 border-b-4 border-r-4 border-pixel-cyan"></div>
                
                {/* Center instruction */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="bg-black bg-opacity-70 px-4 py-2 rounded">
                    <p className="font-pixel text-pixel-cyan text-sm">
                      Posisikan wajah di tengah frame
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CameraCapture;