import { createContext, ReactNode, useContext, useState } from 'react';

type PageSwitchContextType = {
  isShowCamera: boolean;
  isShowCurrent: boolean;
  showCamera: (isShow: boolean) => void;
  showCurrent: (isShow: boolean) => void;
};

const PageSwitchContext = createContext<PageSwitchContextType | undefined>(
  undefined,
);

export function PageSwitchProvider({ children }: { children: ReactNode }) {
  const [isShowCamera, setIsShowCamera] = useState(false);
  const [isShowCurrent, setIsShowCurrent] = useState(false);

  const showCamera = (isShow: boolean) => {
    setIsShowCamera(isShow);
  };

  const showCurrent = (isShow: boolean) => {
    setIsShowCurrent(isShow);
  };

  return (
    <PageSwitchContext.Provider
      value={{
        isShowCamera,
        isShowCurrent,
        showCamera,
        showCurrent,
      }}
    >
      {children}
    </PageSwitchContext.Provider>
  );
}

export function usePageSwitch() {
  const context = useContext(PageSwitchContext);
  if (context === undefined) {
    throw new Error('usePageSwitch must be used within a PageSwitchProvider');
  }
  return context;
}
