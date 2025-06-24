// app/contexts/file.context.tsx
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
  addFile: (newFile: File) => void;
  renameFile: (id: string, newName: string) => void;
  renamePath: (id: string, newPath: string) => void;
  getFilePreviews: (id: string) => string | undefined;
  setCurrentId: (id: string | null) => void;
  currentId: string | null;
  isUploaded: (id: string) => void;
  updateUrl: ({ currentId, url }: { currentId: string; url: string }) => void;
};

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<Record<string, FileInfo>>({});
  const [id, setId] = useState<string | null>(null);

  const setCurrentId = (id: string | null) => {
    setId(id);
  };

  const yyyymm = new Date().toISOString().slice(0, 7).replace(/-/, '');

  // ファイルを追加
  const addFile = (newFile: File) => {
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
          isUploaded: false,
          url: null,
        },
      };
    });
    setId(id);
  };

  const updateUrl = ({
    currentId,
    url,
  }: {
    currentId: string;
    url: string;
  }) => {
    setFiles((prev) => {
      return {
        ...prev,
        [currentId]: { ...prev[currentId], url },
      };
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
        renameFile,
        getFilePreviews,
        renamePath,
        setCurrentId,
        currentId: id,
        isUploaded,
        updateUrl,
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
