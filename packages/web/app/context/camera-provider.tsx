import { createContext, ReactNode, useContext, useState } from 'react';

type CameraContextType = {
  isShowCamera: boolean;
  showCamera: (isShow: boolean) => void;
};

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export function CameraProvider({ children }: { children: ReactNode }) {
  const [isShowCamera, setIsShowCamera] = useState(false);

  const showCamera = (isShow: boolean) => {
    setIsShowCamera(isShow);
  };

  return (
    <CameraContext.Provider
      value={{
        isShowCamera,
        showCamera,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
}

export function useCamera() {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
}
