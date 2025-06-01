/* eslint-disable @next/next/no-img-element */
import { getPresignedPutUrl } from '@/actions/s3';
import { CaptureCamera } from '@/components/capture-camera';
import PathInput from '@/components/path-input';
import { Button } from '@/components/ui/button';
import { useFile } from '@/context/file-provider';
import { ActionFunctionArgs } from '@remix-run/node';
import { useActionData, useNavigate, useSubmit } from '@remix-run/react';
import { Camera, ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const fileName = formData.get('fileName') as string;
  const fileType = formData.get('fileType') as string;
  if (!fileName || !fileType) {
    return {
      success: false,
      url: null,
      message: 'ファイルがありません',
      status: 400,
    };
  }
  const url = await getPresignedPutUrl({ fileName, fileType });
  return { success: true, url, status: 200 };
}

export default function Index() {
  const [showCamera, setShowCamera] = useState(false);
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const { files, addFile, getFilePreviews, currentId } = useFile();

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
    setShowCamera(false);
  };

  const handleDelete = () => {};

  const handleUpload = async (id: string) => {
    if (Object.keys(files).length === 0 || files[id] == null) return;
    const formData = new FormData();
    formData.append('fileName', files[id].currentName);
    formData.append('fileType', files[id].file.type);
    submit(formData, { method: 'POST' });
  };

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">カメラアプリ</h1>
          <p className="mt-2 text-gray-600">写真を撮影してみましょう</p>
        </div>

        {currentId && files[currentId] && getFilePreviews(currentId) ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border shadow-lg">
              <img
                src={getFilePreviews(currentId) || '/placeholder.svg'}
                alt="撮影した写真"
                className="h-auto w-full object-contain"
              />
            </div>
            <div className="space-y-2">
              <PathInput />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex-1"
              >
                削除
              </Button>

              <Button
                variant="outline"
                onClick={() => handleUpload(currentId)}
                className="flex-1"
              >
                アップロード
              </Button>

              <Button onClick={() => setShowCamera(true)} className="flex-1">
                <Camera className="mr-2 h-4 w-4" />
                もう一度撮影
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="rounded-full bg-gray-100 p-8">
              <Camera className="h-16 w-16 text-gray-400" />
            </div>
            <div className="flex w-full gap-2">
              <Button
                size="lg"
                onClick={() => setShowCamera(true)}
                className="flex-1 h-12 flex items-center justify-center"
              >
                <Camera className="mr-2 h-5 w-5" />
                カメラを起動
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 flex items-center justify-center"
                onClick={() => navigate('/camera/gallery')}
              >
                <ImageIcon className="mr-2 h-5 w-5" />
                ギャラリー
              </Button>
            </div>
          </div>
        )}
      </div>

      {showCamera && (
        <CaptureCamera
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </main>
  );
}
