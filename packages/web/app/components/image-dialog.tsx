/* eslint-disable @next/next/no-img-element */
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ImageObject } from '@/routes/camera.gallery';
import { ReactNode } from 'react';

export default function ImageDialog({
  children,
  selectedImage,
}: {
  children: ReactNode;
  selectedImage: ImageObject | null;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ダイアログのタイトル</DialogTitle>
          <DialogDescription>
            これはダイアログの説明文です。オーバーレイをクリックするか、Escキーを押すとダイアログが閉じます。
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center h-[200px]">
          <img
            src={selectedImage?.presignedUrl}
            alt={selectedImage?.Key?.split('/').pop() || selectedImage?.Key}
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder.jpg';
            }}
            className="object-contain "
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline">キャンセル</Button>
          <Button>保存</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
