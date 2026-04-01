import React from 'react';
import { Img, staticFile } from 'remotion';

export const MockAppDiscovery: React.FC<{ frame: number }> = ({ frame }) => {
    // Le composant s'affiche à partir de la frame absolue 500 (donc frame relative 0 correspond à 500)
    // Frame absolue 516 -> frame relative 16 -> 1.png
    // Frame absolue 627 -> frame relative 127 -> 2.png
    // Frame absolue 694 -> frame relative 194 -> 4.png
    
    let currentImage = 'FINAL/1.png'; // On commence avec la 1 avant 516 par défaut
    if (frame >= 194) {
         currentImage = 'FINAL/4.png';
    } else if (frame >= 127) {
         currentImage = 'FINAL/2.png';
    } else if (frame >= 16) {
         currentImage = 'FINAL/1.png';
    } else {
         currentImage = 'FINAL/1.png';
    }

    return (
        <div className="w-full h-full bg-[#FAF6ED] flex flex-col relative overflow-hidden">
            <Img 
                src={staticFile(currentImage)}
                className="absolute inset-0 w-full h-full object-cover"
            />
        </div>
    );
};
