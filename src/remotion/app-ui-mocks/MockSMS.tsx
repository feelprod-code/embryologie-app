import React from 'react';
import { interpolate, spring, useVideoConfig, Img, staticFile } from 'remotion';
import { CursorPointer } from './CursorPointer';

export const MockSMS: React.FC<{ frame: number, clickTarget?: 'image' | 'notification', bgImage?: string }> = ({ frame, clickTarget = 'image', bgImage = 'FINAL/1.png' }) => {
    const { fps } = useVideoConfig();

    // Cursor target coordinates based on clickTarget
    const targetX = clickTarget === 'notification' ? -180 : 180;
    const targetY = clickTarget === 'notification' ? 120 : 350; 
    const movingStartFrame = clickTarget === 'notification' ? 15 : 60;
    const clickFrameDelta = clickTarget === 'notification' ? 40 : 97;

    // After click animation (slide up the email inside the phone)
    const emailSlideUp = spring({
        frame: Math.max(0, frame - (clickFrameDelta + 45)), // Delay increased for longer wait
        fps,
        config: { damping: 14 }
    });
    const emailY = interpolate(emailSlideUp, [0, 1], [800, 0]);

    // Cursor moves towards the target
    const cursorMove = spring({ frame: Math.max(0, frame - movingStartFrame), fps, config: { damping: 12 }});
    // Pointeur venant du bas
    const cursorX = interpolate(cursorMove, [0, 1], [300, targetX]);
    const cursorY = interpolate(cursorMove, [0, 1], [600, targetY]); 

    // Effet de clic
    const cursorClick = spring({ frame: Math.max(0, frame - clickFrameDelta), fps, config: { damping: 15, stiffness: 200 }});
    const cursorScale = interpolate(cursorClick, [0, 0.5, 1], [1, 0.8, 1]);

    // Ripple effect (onde au clic)
    const rippleScale = interpolate(spring({ frame: Math.max(0, frame - clickFrameDelta), fps, config: { damping: 12 } }), [0, 1], [0.5, 2]);
    const rippleOpacity = interpolate(spring({ frame: Math.max(0, frame - clickFrameDelta), fps, config: { damping: 12 } }), [0, 1], [1, 0]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-start relative overflow-visible bg-transparent">
            {/* Wrapper inside the device that clips the phone content */}
            <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[24px]">
                
                {clickTarget === 'notification' ? (
                    <>
                        {/* Écran d'attente d'email minimaliste avec avion en papier */}
                        <div className="absolute inset-0 w-full h-full bg-white overflow-hidden flex flex-col items-center justify-center gap-6">
                            <div 
                                style={{
                                    transform: `translateY(${Math.sin(frame / 12) * -8}px) rotate(${Math.sin(frame / 25) * 6 - 5}deg)`
                                }}
                            >
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 2L11 13" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span className="text-slate-700 font-bold text-[22px] tracking-wide" style={{ opacity: Math.sin(frame / 10) * 0.3 + 0.7 }}>
                                En attente de l'email...
                            </span>
                        </div>
                        
                        {/* L'image de l'email arrive tel l'ouverture d'une App iOS (scale up + slide up) */}
                        <div className="absolute inset-0 w-full h-full bg-white z-[25] origin-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.4)]" 
                             style={{ 
                                 transform: `translateY(${emailY}px) scale(${interpolate(emailSlideUp, [0, 1], [0.85, 1])})`,
                                 opacity: interpolate(emailSlideUp, [0, 0.4, 1], [0, 1, 1]),
                                 borderRadius: interpolate(emailSlideUp, [0, 1], [40, 24]) + 'px'
                             }}>
                            <Img src={staticFile(bgImage)} className="w-full h-full object-cover rounded-[inherit]" />
                        </div>
                    </>
                ) : (
                    <>
                        {/* Background restored to the original App Screenshot */}
                        <Img src={staticFile(bgImage)} className="absolute inset-0 w-full h-full object-cover" />
                    </>
                )}
            </div>



            {/* Ripple effect on click */}
            {frame >= clickFrameDelta && (
                <div 
                    className="absolute rounded-full bg-slate-300 pointer-events-none z-40"
                    style={{
                        left: targetX,
                        top: targetY,
                        width: 40,
                        height: 40,
                        marginLeft: -20,
                        marginTop: -20,
                        transform: `scale(${rippleScale})`,
                        opacity: rippleOpacity
                    }}
                />
            )}

            {/* Cursor */}
            <div className="absolute z-50 pointer-events-none origin-top-left" style={{ left: cursorX, top: cursorY, transform: `scale(${cursorScale})` }}>
                <CursorPointer size={30} />
            </div>
        </div>
    );
};
