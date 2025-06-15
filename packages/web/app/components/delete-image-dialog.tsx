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
import { ReactNode, useState } from 'react';

export default function DeleteImageDialog({
  children,
  onDelete,
}: {
  children: ReactNode;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>削除確定</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center h-fit"></div>
        <div className="flex justify-around space-x-2 ">
          <Button
            className="flex-1"
            onClick={() => setOpen(false)}
            variant="outline"
          >
            キャンセル
          </Button>
          <Button className="flex-1" onClick={onDelete}>
            確定
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
