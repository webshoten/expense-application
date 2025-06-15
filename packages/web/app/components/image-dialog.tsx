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
import DeleteImageDialog from './delete-image-dialog';

export default function ImageDialog({
  children,
  selectedImage,
  onDelete,
}: {
  children: ReactNode;
  selectedImage: ImageObject | null;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>写真の詳細</DialogTitle>
          <DialogDescription>写真の詳細</DialogDescription>
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
        <div className="flex justify-around space-x-2 ">
          <Button
            className="flex-1"
            onClick={() => setOpen(false)}
            variant="outline"
          >
            キャンセル
          </Button>

          <DeleteImageDialog
            onDelete={() => {
              setOpen(false);
              onDelete();
            }}
          >
            <Button className="flex-1">削除</Button>
          </DeleteImageDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
