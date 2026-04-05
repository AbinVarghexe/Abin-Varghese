'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PreviewContextType {
  previewData: any;
  isPreviewing: boolean;
  setPreviewData: (data: any) => void;
  setIsPreviewing: (value: boolean) => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [previewData, setPreviewData] = useState<any>({});
  const [isPreviewing, setIsPreviewing] = useState(false);

  return (
    <PreviewContext.Provider value={{ previewData, isPreviewing, setPreviewData, setIsPreviewing }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const context = useContext(PreviewContext);
  if (context === undefined) {
    // Return default values if used outside provider to avoid breaking the build/runtime
    return {
      previewData: {},
      isPreviewing: false,
      setPreviewData: () => {},
      setIsPreviewing: () => {}
    };
  }
  return context;
}
