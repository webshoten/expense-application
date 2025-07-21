// app/contexts/file.context.tsx
import { useGetFile } from '@/hooks/use-get-file';
import { yyyymm } from '@/lib/date';
import { asyncReduce } from '@/lib/utils';
import { ImageObject } from '@/routes/camera.gallery';
import { createContext, ReactNode, useContext, useState } from 'react';

// ファイル情報の型定義
type FileInfo = {
  file: File; // 元のFileオブジェクト
  originalName: string; // 元のファイル名
  currentName: string; // 現在のファイル名（変更可能）
  path: string; // ファイルパス
  url: string | null;
  lastModified: number; // 最終更新日時
  isUploaded: boolean;
};

type FileContextType = {
  files: Record<string, FileInfo>;
  addFile: ({
    newFile,
    isUploaded,
    url,
  }: {
    newFile: File;
    isUploaded?: boolean;
    url?: string;
  }) => void;
  addFiles: ({
    images,
    isUploaded,
  }: {
    images: ImageObject[];
    isUploaded: boolean;
  }) => Promise<void>;
  removeFile: (currentId: string) => void;
  renameFile: (id: string, newName: string) => FileInfo;
  renamePath: (id: string, newPath: string) => FileInfo;
  getFilePreviews: (id: string) => string | undefined;
  setCurrentId: (id: string | null) => void;
  currentId: string | null;
  isUploaded: (id: string) => void;
  setUrl: ({ currentId, url }: { currentId: string; url: string }) => void;
};

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<Record<string, FileInfo>>({});
  const [id, setId] = useState<string | null>(null);
  const { getFile } = useGetFile();

  const setCurrentId = (id: string | null) => {
    setId(id);
  };

  const addFiles = async ({
    images,
    isUploaded,
  }: {
    images: ImageObject[];
    isUploaded: boolean;
  }) => {
    const result = await asyncReduce(
      images,
      async (acc, image) => {
        const id = generateFileId();
        const file = await getFile({
          filename: image.Key ?? '',
          url: image.presignedUrl,
        });
        const filename = image?.Key?.split('/')[1] as string | undefined;
        const path = image?.Key?.split('/')[0] as string | undefined;
        acc[id] = {
          file,
          originalName: filename ?? '',
          currentName: filename ?? '',
          path: path ?? '',
          lastModified: image.LastModified
            ? new Date(image.LastModified).getTime()
            : new Date().getTime(),
          isUploaded: isUploaded,
          url: image.presignedUrl,
        };
        return acc;
      },
      {} as Record<string, FileInfo>,
    );
    setFiles(result);
  };

  const addFile = ({
    newFile,
    isUploaded,
    url,
  }: {
    newFile: File;
    isUploaded?: boolean;
    url?: string;
  }) => {
    const id = generateFileId();
    setFiles((prev) => {
      return {
        ...prev,
        [id]: {
          file: newFile,
          originalName: newFile.name,
          currentName: newFile.name,
          path: yyyymm,
          lastModified: newFile.lastModified,
          isUploaded: isUploaded ?? false,
          url: url ?? null,
        },
      };
    });
    setId(id);
  };

  const setUrl = ({ currentId, url }: { currentId: string; url: string }) => {
    setFiles((prev) => {
      return {
        ...prev,
        [currentId]: { ...prev[currentId], url },
      };
    });
  };

  const removeFile = (currentId: string) => {
    setFiles((prevFiles) => {
      const { [currentId]: _, ...rest } = prevFiles; //キーを削除
      return rest;
    });
  };

  // ファイル名を変更
  const renameFile = (id: string, newName: string) => {
    setFiles((prev) => {
      return {
        ...prev,
        [id]: {
          ...prev[id],
          currentName: newName,
        },
      };
    });

    return {
      ...files[id],
      currentName: newName,
    } as FileInfo;
  };

  const renamePath = (id: string, newPath: string) => {
    setFiles((prev) => {
      return {
        ...prev,
        [id]: {
          ...prev[id],
          path: newPath,
        },
      };
    });

    return {
      ...files[id],
      path: newPath,
    } as FileInfo;
  };

  // ファイルプレビュー情報を取得
  const getFilePreviews = (id: string) => {
    if (!files[id]) return;
    return URL.createObjectURL(files[id].file);
  };

  const isUploaded = (id: string) => {
    if (!files[id]) return;
    setFiles((prev) => {
      return {
        ...prev,
        [id]: {
          ...prev[id],
          isUploaded: true,
        },
      };
    });
  };

  return (
    <FileContext.Provider
      value={{
        files,
        addFile,
        addFiles,
        renameFile,
        removeFile,
        getFilePreviews,
        renamePath,
        setCurrentId,
        currentId: id,
        isUploaded,
        setUrl,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}

// ファイルIDを生成するヘルパー関数
function generateFileId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useFile() {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFile must be used within a FileProvider');
  }
  return context;
}

/**
 * ファイル名（ currentName）に一致する最初のキーを返す
 * @param record Record<string, FileInfo>
 * @param fileName 検索対象のファイル名
 * @returns 一致したキー（見つからなければ `undefined`）
 */
export function findFirstKeyByFileName(
  record: Record<string, FileInfo>,
  fileName: string,
): string | undefined {
  for (const [key, fileInfo] of Object.entries(record)) {
    if (fileInfo.originalName === fileName) {
      return key; // 最初に一致したキーを返す
    }
  }
  return undefined;
}
