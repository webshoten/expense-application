/* eslint-disable @next/next/no-img-element */
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFile } from '@/context/file-provider';
import { Edit, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const PreviousImageForm = ({
  onUpload,
  onAI,
}: {
  onUpload: (currentId: string) => void;
  onAI: (currentId: string, action: 'ファイル名を生成') => void;
}) => {
  const { renamePath, currentId, renameFile, files, getFilePreviews } =
    useFile();

  const handleAction = (action: 'ファイル名を生成') => {
    if (!currentId) return;
    console.log(action);
    onAI(currentId, action);
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border shadow-lg">
        {currentId && (
          <img
            src={getFilePreviews(currentId) || '/placeholder.svg'}
            alt="撮影した写真"
            className="h-auto w-full object-contain"
          />
        )}
      </div>
      <div className="space-y-2">
        <div className="w-full max-w-md p-2">
          {currentId && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-1">
                <Label
                  className="w-[20%] flex items-center "
                  htmlFor="yearMonth"
                >
                  年月
                </Label>
                <Input
                  className="w-[80%] mt-0"
                  id="yearMonth"
                  type="text"
                  placeholder="202412"
                  value={files[currentId].path}
                  onChange={(e) => renamePath(currentId, e.target.value)}
                  maxLength={6}
                />
              </div>

              <div className="flex flex-row gap-1">
                <Label className="w-[20%] flex items-center" htmlFor="fileName">
                  ファイル名
                </Label>
                <Input
                  id="fileName"
                  type="text"
                  className="w-[60%]"
                  placeholder="example.txt"
                  value={files[currentId].currentName}
                  onChange={(e) => renameFile(currentId, e.target.value)}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      disabled={
                        files[currentId]?.isUploaded === false ||
                        files[currentId]?.isUploaded == null
                      }
                      variant="outline"
                      className="w-[20%]"
                    >
                      AI使用 <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>操作を選択</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleAction('ファイル名を生成')}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      ファイル名を生成
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => {
                    onUpload(currentId);
                  }}
                  className="flex-1 w-full"
                >
                  アップロード
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
