/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ImageObject } from '@/routes/camera.gallery';
import { FileImage, HardDrive } from 'lucide-react';

// ファイルサイズを読みやすい形式に変換
const formatFileSize = (bytes: number | undefined) => {
  if (bytes == null) return '0 Bytes';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  );
};

// 日付をフォーマット
const formatDate = (dateString: Date | undefined) => {
  if (dateString == null) return '';
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const ThumbnailCard = ({
  image,
  onClick,
}: {
  image: ImageObject | null;
  onClick: () => void;
}) => {
  return (
    <Card
      key={image?.Key}
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={image?.presignedUrl || '/placeholder.svg'}
            alt={`Image`}
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder.jpg';
            }}
            className="w-fit"
          />
        </div>
      </CardContent>
      <CardHeader className="p-3">
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FileImage className="w-3 h-3" />
            <span>{image?.Key?.split('/')[1]}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <HardDrive className="w-3 h-3" />
            <span>{formatFileSize(image?.Size)}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(image?.LastModified)}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
