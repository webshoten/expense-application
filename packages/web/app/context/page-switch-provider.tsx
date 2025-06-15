import { createContext, ReactNode, useContext, useState } from 'react';

type PageSwitchContextType = {
  isShowCamera: boolean;
  isShowPrevious: boolean;
  showCamera: (isShow: boolean) => void;
  showPrevious: (isShow: boolean) => void;
};

const PageSwitchContext = createContext<PageSwitchContextType | undefined>(
  undefined,
);

export function PageSwitchProvider({ children }: { children: ReactNode }) {
  const [isShowCamera, setIsShowCamera] = useState(false);
  const [isShowPrevious, setIsShowPrevious] = useState(false);

  const showCamera = (isShow: boolean) => {
    setIsShowCamera(isShow);
  };

  const showPrevious = (isShow: boolean) => {
    setIsShowPrevious(isShow);
  };

  return (
    <PageSwitchContext.Provider
      value={{
        isShowCamera,
        isShowPrevious,
        showCamera,
        showPrevious,
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
