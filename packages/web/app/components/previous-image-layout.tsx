import { PreviousImageForm } from './previous-image-form';

export const PreviousImageLayout = ({
  onUpload,
  onAI,
}: {
  onUpload: (currentId: string) => void;
  onAI: (currentId: string, action: 'ファイル名を生成') => void;
}) => {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          <span>直近の写真</span>
        </h1>
        <p className="mt-2 text-gray-600">写真を撮影してみましょう</p>
      </div>
      <div className="space-y-4">
        <PreviousImageForm onUpload={onUpload} onAI={onAI} />
      </div>
    </div>
  );
};
