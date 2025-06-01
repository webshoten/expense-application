import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFile } from '@/context/file-provider';

export default function PathInput() {
  const { renamePath, currentId, renameFile, files } = useFile();

  return (
    <Card className="w-full max-w-md p-2">
      {currentId && (
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="yearMonth">年月 (yyyymm)</Label>
            <Input
              id="yearMonth"
              type="text"
              placeholder="202412"
              value={files[currentId].path}
              onChange={(e) => renamePath(currentId, e.target.value)}
              maxLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileName">ファイル名</Label>
            <Input
              id="fileName"
              type="text"
              placeholder="example.txt"
              value={files[currentId].currentName}
              onChange={(e) => renameFile(currentId, e.target.value)}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
