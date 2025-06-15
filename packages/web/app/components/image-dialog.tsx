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
import { ReactNode, useState } from 'react';

export default function ImageDialog({
  children,
  selectedImage,
}: {
  children: ReactNode;
  selectedImage: ImageObject | null;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ダイアログのタイトル</DialogTitle>
          <DialogDescription>
            これはダイアログの説明文です。オーバーレイをクリックするか、Escキーを押すとダイアログが閉じます。
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center h-fit">
          <img
            src={selectedImage?.presignedUrl}
            alt={selectedImage?.Key?.split('/').pop() || selectedImage?.Key}
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder.jpg';
            }}
            className="object-contain"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={() => setOpen(false)} variant="outline">
            キャンセル
          </Button>
          <Button>削除</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
