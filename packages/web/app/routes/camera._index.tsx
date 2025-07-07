/* eslint-disable @next/next/no-img-element */
import { deleteObject, getPresignedPutUrl } from '@/actions/s3';
import { CameraAppLayout } from '@/components/camera-app-layout';
import { CaptureCamera } from '@/components/capture-camera';
import { CurrentImageLayout } from '@/components/current-image-layout';
import { useFile } from '@/context/file-provider';
import { usePageSwitch } from '@/context/page-switch-provider';
import { analyzeInvoiceClient } from '@/graphql/analize-invoice-client';
import { getS3PresignedUrlClient } from '@/graphql/get-s3-presigned-url-client';
import { usePutFile } from '@/hooks/use-put-file';
import { useToast } from '@/hooks/use-toast';
import { ActionFunctionArgs } from '@remix-run/node';
import { useActionData, useNavigate, useSubmit } from '@remix-run/react';
import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const actionType = formData.get('actionType') as 'upload' | 'delete';

  try {
    if (actionType === 'upload') {
      const newKey = formData.get('newKey') as string;
      const oldKey = formData.get('oldKey') as string;
      const fileType = formData.get('fileType') as string;
      if (!newKey || !oldKey || !fileType) {
        return {
          success: false,
          message: 'ファイルがありません',
          status: 400,
        };
      }
      const url = await getPresignedPutUrl({ newKey, oldKey, fileType });
      return { success: true, url, actionType, status: 200 };
    }
    if (actionType === 'delete') {
      const key = formData.get('key') as string;
      await deleteObject({ key });
      return { success: true, actionType, status: 200 };
    }
  } catch (error) {
    return {
      success: false,
      message: 'その他のエラー',
      status: 400,
    };
  }
}

export default function Index() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const { toast } = useToast();
  const actionData = useActionData<typeof action>();
  const { files, addFile, currentId, isUploaded, setUrl, renameFile } =
    useFile();
  const { isShowCamera, showCamera, isShowCurrent, showCurrent } =
    usePageSwitch();
  const { analyzeInvoice } = analyzeInvoiceClient();
  const { getS3PresignedUrl } = getS3PresignedUrlClient();
  const { putFile } = usePutFile();

  useEffect(() => {
    if (actionData?.success !== true) return;
    if (!actionData) return;
    if (!currentId) return;
    if (Object.keys(files).length === 0) return;

    (async () => {
      if (actionData.actionType === 'upload') {
        try {
          /** ファイルアップロード */
          await putFile({
            file: files[currentId].file,
            type: files[currentId].file.type,
            url: actionData?.url,
          });

          /** ファイルUrl取得 */
          const response = await getS3PresignedUrl({
            key: files[currentId].path + '/' + files[currentId].currentName,
          });

          if (!response.error && response?.data?.getS3PresignedUrl?.url) {
            setUrl({ url: response?.data?.getS3PresignedUrl?.url, currentId });
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
      }

      if (actionData.actionType === 'delete') {
        navigate(`/camera/gallery?deleteId=${currentId}`);
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
    })();
  }, [actionData]);

  const handleCapture = (imageFile: File) => {
    //ファイルをcontextに追加
    addFile({ newFile: imageFile });
    showCamera(false);
    showCurrent(true);
  };

  const handleUpload = async (currentId: string) => {
    if (Object.keys(files).length === 0 || files[currentId] == null) return;
    if (files[currentId].path == null || files[currentId].currentName == null)
      return;

    const formData = new FormData();
    formData.append(
      'oldKey',
      `${files[currentId].path}/${files[currentId].originalName}`,
    );
    formData.append(
      'newKey',
      `${files[currentId].path}/${files[currentId].currentName}`,
    );
    formData.append('fileType', files[currentId].file.type);
    isUploaded(currentId);

    /** actionへ */
    formData.append('actionType', 'upload');
    submit(formData, { method: 'POST' });
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

  const handleDelete = (key: string) => {
    const formData = new FormData();
    formData.append('key', key);

    /** actionへ */
    formData.append('actionType', 'delete');
    submit(formData, { method: 'POST' });
  };

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      {isShowCurrent ? (
        <CurrentImageLayout
          onUpload={handleUpload}
          onAI={handleAI}
          onDelete={handleDelete}
        />
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
