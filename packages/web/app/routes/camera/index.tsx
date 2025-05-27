/* eslint-disable @next/next/no-img-element */
import { CaptureCamera } from '@/components/capture-camera';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useState } from 'react';

export default function Index() {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setShowCamera(false);
  };

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">カメラアプリ</h1>
          <p className="mt-2 text-gray-600">写真を撮影してみましょう</p>
        </div>

        {capturedImage ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border shadow-lg">
              <img
                src={capturedImage || '/placeholder.svg'}
                alt="撮影した写真"
                className="h-auto w-full object-contain"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCapturedImage(null)}
                className="flex-1"
              >
                削除
              </Button>
              <Button onClick={() => setShowCamera(true)} className="flex-1">
                <Camera className="mr-2 h-4 w-4" />
                もう一度撮影
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="rounded-full bg-gray-100 p-8">
              <Camera className="h-16 w-16 text-gray-400" />
            </div>
            <Button
              size="lg"
              onClick={() => setShowCamera(true)}
              className="w-full"
            >
              <Camera className="mr-2 h-5 w-5" />
              カメラを起動
            </Button>
          </div>
        )}
      </div>

      {showCamera && (
        <CaptureCamera
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </main>
  );
}
