import React from 'react';
import { Img, staticFile } from 'remotion';

export const MockPaywall: React.FC<{ frame?: number }> = () => {
    return (
         <div className="w-full h-full bg-[#FAF6ED] flex flex-col relative overflow-hidden">
             <div className="flex-1 w-full relative overflow-hidden bg-[#FAF6ED]">
                <Img 
                    src={staticFile('FINAL/4.png')}
                    className="absolute inset-0 w-full h-full object-cover origin-top"
                />
            </div>
         </div>
    );
};
