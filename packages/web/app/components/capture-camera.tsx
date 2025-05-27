/* eslint-disable @next/next/no-img-element */
'use client';

import { Camera, FlipVerticalIcon as FlipCameraIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose?: () => void;
}

export function CaptureCamera({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    'environment',
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isCameraActive) return;

    const startCamera = async () => {
      try {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setError(null);
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError(
          'カメラへのアクセスが拒否されました。設定を確認してください。',
        );
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraActive, facingMode]);

  const handleStartCamera = () => {
    setIsCameraActive(true);
    setCapturedImage(null);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleAccept = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      setCapturedImage(null);
      if (onClose) onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    handleStartCamera();
  };

  const handleClose = () => {
    if (stream) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      stream.getTracks().forEach((track) => track.stop());
    }
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="relative flex-1">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
            <div className="rounded-lg bg-red-100 p-4 text-red-700">
              <p>{error}</p>
              <Button onClick={handleClose} className="mt-4">
                閉じる
              </Button>
            </div>
          </div>
        )}

        {!isCameraActive && !capturedImage && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 text-center text-white">
            <Camera size={64} />
            <h2 className="text-xl font-bold">カメラへのアクセス</h2>
            <p>写真を撮影するにはカメラへのアクセスを許可してください</p>

            <Button onClick={handleStartCamera} className="mt-2">
              カメラを起動
            </Button>
          </div>
        )}

        {isCameraActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
            onLoadedMetadata={() => {
              if (videoRef.current) {
                videoRef.current.play();
              }
            }}
          />
        )}

        {capturedImage && (
          <div className="absolute inset-0">
            <img
              src={capturedImage || '/placeholder.svg'}
              alt="Captured"
              className="h-full w-full object-contain"
            />
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {isCameraActive && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <div className="flex items-center gap-8">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/30 text-white rounded-full h-12 w-12"
                onClick={handleClose}
              >
                <X className="h-6 w-6" />
              </Button>

              <Button
                onClick={handleCapture}
                className="h-20 w-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg border-4 border-white transition-all duration-200 active:scale-95"
              >
                <div className="h-16 w-16 rounded-full flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <span className="sr-only">撮影</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="bg-black/30 text-white rounded-full h-12 w-12"
                onClick={handleSwitchCamera}
              >
                <FlipCameraIcon className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {capturedImage && (
        <div className="flex items-center justify-between bg-black p-4">
          <Button onClick={handleRetake} variant="ghost" className="text-white">
            撮り直す
          </Button>
          <Button
            onClick={handleAccept}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            使用する
          </Button>
        </div>
      )}
    </div>
  );
}
