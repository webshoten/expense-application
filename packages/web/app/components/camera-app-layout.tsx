import { Camera } from 'lucide-react';

export const CameraAppLayout = () => {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          <span>カメラアプリ</span>
        </h1>
        <p className="mt-2 text-gray-600">写真を撮影してみましょう</p>
      </div>
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="rounded-full bg-gray-100 p-8">
          <Camera className="h-16 w-16 text-gray-400" />
        </div>
      </div>
    </div>
  );
};
