import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface FullscreenContextType {
  isVideoFullscreen: boolean;
  setIsVideoFullscreen: (value: boolean) => void;
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

export const FullscreenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);

  return (
    <FullscreenContext.Provider value={{ isVideoFullscreen, setIsVideoFullscreen }}>
      {children}
    </FullscreenContext.Provider>
  );
};

export const useFullscreen = () => {
  const context = useContext(FullscreenContext);
  if (context === undefined) {
    throw new Error('useFullscreen must be used within a FullscreenProvider');
  }
  return context;
};
