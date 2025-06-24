/* eslint-disable @next/next/no-img-element */
import { getPresignedPutUrl } from '@/actions/s3';
import { CameraAppLayout } from '@/components/camera-app-layout';
import { CaptureCamera } from '@/components/capture-camera';
import { PreviousImageLayout } from '@/components/previous-image-layout';
import { useFile } from '@/context/file-provider';
import { usePageSwitch } from '@/context/page-switch-provider';
import { analyzeInvoiceClient } from '@/graphql/analize-invoice-client';
import { getS3PresignedUrlClient } from '@/graphql/get-s3-presigned-url-client';
import { useToast } from '@/hooks/use-toast';
import { ActionFunctionArgs } from '@remix-run/node';
import { useActionData, useSubmit } from '@remix-run/react';
import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const key = formData.get('key') as string;
  const fileType = formData.get('fileType') as string;
  if (!key || !fileType) {
    return {
      success: false,
      url: null,
      message: 'ファイルがありません',
      status: 400,
    };
  }
  const url = await getPresignedPutUrl({ key, fileType });

  return { success: true, url, status: 200 };
}

export default function Index() {
  const submit = useSubmit();
  const { toast } = useToast();
  const actionData = useActionData<typeof action>();
  const { files, addFile, currentId, isUploaded, updateUrl, renameFile } =
    useFile();
  const { isShowCamera, showCamera, isShowPrevious, showPrevious } =
    usePageSwitch();
  const { analyzeInvoice } = analyzeInvoiceClient();
  const { getS3PresignedUrl } = getS3PresignedUrlClient();

  useEffect(() => {
    if (actionData?.success !== true) return;
    if (!actionData || !actionData?.url) return;
    if (!currentId) return;
    if (Object.keys(files).length === 0) return;

    (async () => {
      try {
        await fetch(actionData?.url, {
          method: 'PUT',
          body: files[currentId].file,
          headers: {
            'Content-Type': files[currentId].file.type,
          },
        });

        const response = await getS3PresignedUrl({
          key: files[currentId].path + '/' + files[currentId].currentName,
        });

        if (!response.error && response?.data?.getS3PresignedUrl?.url) {
          console.log('成功');
          updateUrl({ url: response?.data?.getS3PresignedUrl?.url, currentId });
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
        } else {
          throw new Error('失敗');
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    })();
  }, [actionData]);

  const handleCapture = (imageFile: File) => {
    //ファイルをcontextに追加
    addFile(imageFile);
    showCamera(false);
    showPrevious(true);
  };

  const handleUpload = async (currentId: string) => {
    if (Object.keys(files).length === 0 || files[currentId] == null) return;
    if (files[currentId].path == null || files[currentId].currentName == null)
      return;

    isUploaded(currentId);

    const formData = new FormData();
    formData.append(
      'key',
      `${files[currentId].path}/${files[currentId].currentName}`,
    );
    formData.append('fileType', files[currentId].file.type);
    submit(formData, { method: 'POST' });
  };

  const handleAI = async (currentId: string, action: 'ファイル名を生成') => {
    if (files[currentId].url == null) return;
    const result = await analyzeInvoice({
      imageUrl: files[currentId].url,
    });
    renameFile(
      currentId,
      result.data?.analyzeInvoice.yyyymmdd +
        '_' +
        result.data?.analyzeInvoice.company +
        '_' +
        result.data?.analyzeInvoice.amount,
    );
  };

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      {isShowPrevious ? (
        <PreviousImageLayout onUpload={handleUpload} onAI={handleAI} />
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
