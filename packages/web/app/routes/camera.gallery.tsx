/* eslint-disable @next/next/no-img-element */
import { getPresignedGetUrl, listAllObjects } from '@/actions/s3';
import { ThumbnailCard } from '@/components/thumbnail-card';
import { Badge } from '@/components/ui/badge';
import { useFile } from '@/context/file-provider';
import { usePageSwitch } from '@/context/page-switch-provider';
import { useGetFile } from '@/hooks/use-get-file';
import { _Object } from '@aws-sdk/client-s3';
import { LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Calendar } from 'lucide-react';
import { useEffect } from 'react';

export type ImageObject = _Object & {
  presignedUrl: string;
};
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
  const navigate = useNavigate();
  const { showCamera, showCurrent } = usePageSwitch();
  const { addFile, removeFile } = useFile();
  const { getFile } = useGetFile();

  const searchParams = new URLSearchParams(location.search);
  const deleteId = searchParams.get('deleteId');

  useEffect(() => {
    if (deleteId) {
      removeFile(deleteId);
      showCamera(true);
      showCurrent(false);
    }
  }, [deleteId]);

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

  // 月の表示名を生成
  const formatMonthName = (monthKey: string) => {
    if (monthKey.length === 6) {
      const year = monthKey.substring(0, 4);
      const month = monthKey.substring(4, 6);
      return `${year}年${Number.parseInt(month)}月`;
    }
    return monthKey;
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
                  <ThumbnailCard
                    key={index}
                    image={image}
                    onClick={async () => {
                      if (image.Key == null || image.presignedUrl == null)
                        return;
                      const filename = image.Key.split('/')[1] as
                        | string
                        | undefined;
                      if (filename == null) return;
                      const file = await getFile({
                        filename,
                        url: image.presignedUrl,
                      });
                      addFile({ newFile: file, isUploaded: true });
                      showCamera(false);
                      showCurrent(true);
                      navigate('/camera');
                    }}
                  />
                  // <ImageDialog
                  //   key={index}
                  //   selectedImage={selectedImage}
                  //   onDelete={() => {
                  //     const formData = new FormData();
                  //     formData.append('key', selectedImage?.Key ?? '');
                  //     submit(formData, { method: 'POST' });
                  //   }}
                  // >
                  //   <ThumbnailCard
                  //     image={image}
                  //     onClick={() => {
                  //       setSelectedImage(image);
                  //     }}
                  //   />
                  // </ImageDialog>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
