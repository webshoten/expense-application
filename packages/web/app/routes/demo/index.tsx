// app/routes/upload-page.tsx
import { getPresignedPutUrl } from '@/actions/s3';
import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useSubmit } from '@remix-run/react';
import { ChangeEvent, useRef, useState } from 'react';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const fileName = formData.get('fileName') as string;
  const fileType = formData.get('fileType') as string;
  if (!fileName || !fileType) {
    return {
      success: true,
      url: null,
      message: 'ファイルがありません',
      status: 400,
    };
  }
  const url = await getPresignedPutUrl({ fileName, fileType });
  return { success: true, url, status: 200 };
}

export default function Index() {
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  const [file, setFile] = useState<File | null>(null);
  const actionData = useActionData<typeof action>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      // フォームをプログラム的に送信
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        submit(formData, { method: 'POST' });
      }
    }
  };

  const handleUpload = async () => {
    if (!actionData || !file || !actionData?.url) return;

    try {
      const response = await fetch(actionData?.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (response.ok) {
        alert('アップロード成功!');
      } else {
        throw new Error('アップロード失敗');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('アップロード中にエラーが発生しました');
    }
  };

  return (
    <div>
      <h1>ファイルアップロード</h1>
      <Form method="post" ref={formRef}>
        <input type="file" onChange={handleFileChange} required />
        <input type="hidden" name="fileName" value={file?.name || ''} />
        <input type="hidden" name="fileType" value={file?.type || ''} />
      </Form>

      {actionData?.url && (
        <div>
          <p>準備ができました！</p>
          <button onClick={handleUpload}>ファイルをアップロード</button>
        </div>
      )}
    </div>
  );
}
