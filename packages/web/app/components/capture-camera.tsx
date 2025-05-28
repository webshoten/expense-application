'use client';

import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface CaptureCameraProps {
  onCapture: (imageFile: File) => void;
  onClose: () => void;
}

export function CaptureCamera({ onCapture, onClose }: CaptureCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('カメラアクセスエラー:', err);
        setError('カメラにアクセスできませんでした');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              // BlobをFileオブジェクトに変換
              const file = new File([blob], `photo-${Date.now()}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              onCapture(file);
            }
          },
          'image/jpeg',
          0.8,
        );
      }
    }
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="bg-white p-6 rounded-lg text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={handleClose}>閉じる</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* ヘッダー */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white font-medium">カメラ</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* カメラプレビュー */}
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* 撮影ボタンエリア */}
        <div className="absolute bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 text-black shadow-lg"
            >
              <Camera className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </div>

      {/* 隠しcanvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
