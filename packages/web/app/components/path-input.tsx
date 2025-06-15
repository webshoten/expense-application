import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFile } from '@/context/file-provider';
import { Button } from './ui/button';

export default function PathInput({ onUpload }: { onUpload: () => void }) {
  const { renamePath, currentId, renameFile, files } = useFile();

  return (
    <div className="w-full max-w-md p-2">
      {currentId && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row ">
            <Label className="flex items-center w-28" htmlFor="yearMonth">
              年月
            </Label>
            <Input
              className="mt-0"
              id="yearMonth"
              type="text"
              placeholder="202412"
              value={files[currentId].path}
              onChange={(e) => renamePath(currentId, e.target.value)}
              maxLength={6}
            />
          </div>

          <div className="flex flex-row">
            <Label className="flex items-center  w-28" htmlFor="fileName">
              ファイル名
            </Label>
            <Input
              id="fileName"
              type="text"
              placeholder="example.txt"
              value={files[currentId].currentName}
              onChange={(e) => renameFile(currentId, e.target.value)}
            />
          </div>

          <div className="space-y-2 w-full">
            <Button
              variant="outline"
              onClick={onUpload}
              className="flex-1 w-full"
            >
              アップロード
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
