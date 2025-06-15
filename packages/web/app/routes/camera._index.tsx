/* eslint-disable @next/next/no-img-element */
import { getPresignedPutUrl } from '@/actions/s3';
import { CaptureCamera } from '@/components/capture-camera';
import PathInput from '@/components/path-input';
import { useFile } from '@/context/file-provider';
import { usePageSwitch } from '@/context/page-switch-provider';
import { ActionFunctionArgs } from '@remix-run/node';
import { useActionData, useSubmit } from '@remix-run/react';
import { Camera } from 'lucide-react';
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
  const actionData = useActionData<typeof action>();
  const { files, addFile, getFilePreviews, currentId } = useFile();
  const { isShowCamera, showCamera, isShowPrevious } = usePageSwitch();

  useEffect(() => {
    if (actionData?.success !== true) return;
    if (!actionData || !actionData?.url) return;
    if (!currentId) return;
    if (Object.keys(files).length === 0) return;

    (async () => {
      try {
        const response = await fetch(actionData?.url, {
          method: 'PUT',
          body: files[currentId].file,
          headers: {
            'Content-Type': files[currentId].file.type,
          },
        });

        if (response.ok) {
          console.log('成功');
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
  };

  const handleUpload = async (id: string) => {
    if (Object.keys(files).length === 0 || files[id] == null) return;
    if (files[id].path == null || files[id].currentName == null) return;
    const formData = new FormData();
    formData.append('key', `${files[id].path}/${files[id].currentName}`);
    formData.append('fileType', files[id].file.type);
    submit(formData, { method: 'POST' });
  };

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            {isShowPrevious ? (
              <span>直近の写真</span>
            ) : (
              <span>カメラアプリ</span>
            )}
          </h1>
          <p className="mt-2 text-gray-600">写真を撮影してみましょう</p>
        </div>

        {currentId && files[currentId] && isShowPrevious ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border shadow-lg">
              <img
                src={getFilePreviews(currentId) || '/placeholder.svg'}
                alt="撮影した写真"
                className="h-auto w-full object-contain"
              />
            </div>
            <div className="space-y-2">
              <PathInput onUpload={() => handleUpload(currentId)} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="rounded-full bg-gray-100 p-8">
              <Camera className="h-16 w-16 text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {isShowCamera && (
        <CaptureCamera
          onCapture={handleCapture}
          onClose={() => showCamera(false)}
        />
      )}
    </main>
  );
}
