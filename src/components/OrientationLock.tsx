import React, { useEffect, useState } from 'react';
import { useFullscreen } from '../contexts/FullscreenContext';
import { Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const OrientationLock: React.FC = () => {
    const { isVideoFullscreen } = useFullscreen();
    const [isLandscape, setIsLandscape] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const checkDeviceAndOrientation = () => {
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            setIsMobile(isTouchDevice && (userAgentMobile || window.innerWidth < 1024));
            
            // Check orientation via matchMedia or window dimensions
            const landscapeQuery = window.matchMedia('(orientation: landscape)');
            // Fallback for some browsers that don't update matchMedia reliably
            const landscapeDims = window.innerWidth > window.innerHeight;
            
            setIsLandscape(landscapeQuery.matches || landscapeDims);
        };

        checkDeviceAndOrientation();

        const handleResize = () => {
            // Slight delay to allow dimensions to update during rotation
            setTimeout(checkDeviceAndOrientation, 100);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    // Do not show on desktop, or if it's portrait, or if a video is in fullscreen
    if (!isMobile || !isLandscape || isVideoFullscreen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#FAF6ED] p-6 text-center">
            <div className="flex justify-center mb-8 relative">
                <Smartphone className="w-24 h-24 text-[#4171B5] -rotate-90" strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                    <Smartphone className="w-24 h-24 text-[#5A9C51]" strokeWidth={1.5} />
                </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold font-anton text-[#F27D33] tracking-wider uppercase mb-6 drop-shadow-sm">
                {t('common.orientationLockTitle', 'Mode Portrait Requis')}
            </h2>
            
            <p className="text-[#333333] font-inter text-lg max-w-md mx-auto leading-relaxed">
                {t('common.orientationLockMessage', "Pour une expérience optimale, veuillez pivoter votre appareil et utiliser l'application verticalement.")}
            </p>
        </div>
    );
};
