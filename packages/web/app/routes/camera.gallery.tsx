/* eslint-disable @next/next/no-img-element */
import { getPresignedGetUrl, listAllObjects } from '@/actions/s3';
import ImageDialog from '@/components/image-dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { _Object } from '@aws-sdk/client-s3';
import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Calendar, FileImage, HardDrive } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '~/components/ui/badge';

export type ImageObject = _Object & { presignedUrl: string };
type LoaderData = {
  objects: ImageObject[];
};

export const loader: LoaderFunction = async () => {
  const objs = await listAllObjects();
  const objects: ImageObject[] = [];

  for (const obj of objs) {
    const url = obj.Key ? await getPresignedGetUrl({ key: obj.Key }) : '';
    objects.push({ ...obj, presignedUrl: url });
  }

  const data: LoaderData = {
    objects,
  };
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default function CameraGalleryRoute() {
  const { objects } = useLoaderData<LoaderData>();

  const [selectedImage, setSelectedImage] = useState<ImageObject | null>(null);

  // 月別にグループ化する関数
  const groupByMonth = (objects: ImageObject[]) => {
    const grouped: Record<string, ImageObject[]> = {};

    objects.forEach((obj) => {
      const monthKey = obj?.Key?.split('/')[0] || ''; // "202506" のような形式
      grouped[monthKey] = grouped[monthKey]
        ? [...grouped[monthKey], obj]
        : [obj];
    });

    return grouped;
  };

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

  // 月の表示名を生成
  const formatMonthName = (monthKey: string) => {
    if (monthKey.length === 6) {
      const year = monthKey.substring(0, 4);
      const month = monthKey.substring(4, 6);
      return `${year}年${Number.parseInt(month)}月`;
    }
    return monthKey;
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

  const groupedImages = groupByMonth(objects);
  const sortedMonths = Object.keys(groupedImages).sort().reverse(); // 新しい月から表示

  return (
    <>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">画像ギャラリー</h1>
          <p className="text-muted-foreground">月別に整理された画像一覧</p>
        </div>

        <div className="space-y-8">
          {sortedMonths.map((monthKey) => (
            <div key={monthKey}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5" />
                <h2 className="text-2xl font-semibold">
                  {formatMonthName(monthKey)}
                </h2>
                <Badge variant="secondary">
                  {groupedImages[monthKey].length}枚
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groupedImages[monthKey].map((image, index) => (
                  <ImageDialog imageObject={selectedImage}>
                    <Card
                      key={image.Key}
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        setSelectedImage(image);
                      }}
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <img
                            src={image.presignedUrl || '/placeholder.svg'}
                            alt={`Image ${index + 1}`}
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
                  </ImageDialog>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
