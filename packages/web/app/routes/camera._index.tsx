/* eslint-disable @next/next/no-img-element */
import { CameraAppLayout } from '@/components/camera-app-layout';
import { CaptureCamera } from '@/components/capture-camera';
import { CurrentImageLayout } from '@/components/current-image-layout';
import { useFile } from '@/context/file-provider';
import { usePageSwitch } from '@/context/page-switch-provider';
import { analyzeInvoiceClient } from '@/graphql/analize-invoice-client';
import { deleteS3Client } from '@/graphql/delete-s3-client';
import { getS3PresignedUrlsClient } from '@/graphql/get-s3-presigned-urls-client';
import { usePutFile } from '@/hooks/use-put-file';
import { useToast } from '@/hooks/use-toast';
import { yyyymm } from '@/lib/date';
import { CheckCircle } from 'lucide-react';

export default function Index() {
  const { toast } = useToast();
  const { files, addFile, currentId, renameFile, removeFile } = useFile();
  const { isShowCamera, showCamera, isShowCurrent, showCurrent } =
    usePageSwitch();
  const { analyzeInvoice } = analyzeInvoiceClient();
  const { getS3PresignedUrls } = getS3PresignedUrlsClient();
  const { deleteS3 } = deleteS3Client();
  const { putFile } = usePutFile();

  const handleCapture = async (imageFile: File) => {
    const { data } = await getS3PresignedUrls({
      key: `${yyyymm}/${imageFile.name}`,
      fileType: imageFile.type,
    });
    if (data?.getS3PresignedUrls.putUrl == null) return;
    /** ファイルアップロード */
    await putFile({
      file: imageFile,
      type: imageFile.type,
      url: data?.getS3PresignedUrls.putUrl,
    });
    //ファイルをcontextに追加
    addFile({ newFile: imageFile, isUploaded: true });
    showCamera(false);
    showCurrent(true);
  };

  const handleAI = async (currentId: string, action: 'ファイル名を生成') => {
    if (files[currentId].url == null) return;

    if (action === 'ファイル名を生成') {
      const result = await analyzeInvoice({
        imageUrl: files[currentId].url,
      });
      renameFile(
        currentId,
        result.data?.analyzeInvoice.yyyymmdd +
          '_' +
          result.data?.analyzeInvoice.company +
          '_' +
          result.data?.analyzeInvoice.amount +
          '.jpg',
      );
      toast({
        title: '成功しました！',
        description: '操作が正常に完了しました。',
        variant: 'default',
        action: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        ),
      });
    }
  };

  const handleDelete = async (key: string) => {
    if (currentId == null) return;
    await deleteS3({ key });
    removeFile(currentId);
    showCurrent(false);
  };

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      {isShowCurrent ? (
        <CurrentImageLayout onAI={handleAI} onDelete={handleDelete} />
      ) : (
        <CameraAppLayout />
      )}

      {isShowCamera && (
        <CaptureCamera
          onCapture={handleCapture}
          onClose={() => showCamera(false)}
        />
      )}
    </main>
  );
}
