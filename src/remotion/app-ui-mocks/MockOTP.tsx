import React from 'react';
import { interpolate, spring, useVideoConfig, Img, staticFile } from 'remotion';
import { CursorPointer } from './CursorPointer';

// Typing effect Hook
const useTyping = (text: string, startFrame: number, frame: number, speed: number = 3) => {
    if (frame < startFrame) return "";
    const length = Math.floor((frame - startFrame) / speed);
    return text.substring(0, length);
};

export const MockOTP: React.FC<{ frame: number }> = ({ frame }) => {
    const { fps } = useVideoConfig();
    const rawOtp = "00618789"; // 8 chars, typed at speed 5
    const otpTyped = useTyping(rawOtp, 10, frame, 5);

    // Pointer reaches button and clicks exactly at frame 98 (absolute 398)
    const cursorMove = spring({ frame: Math.max(0, frame - 78), fps, config: { damping: 15 }});
    const cursorX = interpolate(cursorMove, [0, 1], [70, 50]);
    const cursorY = interpolate(cursorMove, [0, 1], [50, 80]);

    const cursorClick = spring({ frame: Math.max(0, frame - 98), fps, config: { damping: 15, stiffness: 200 }});
    const cursorScale = interpolate(cursorClick, [0, 0.5, 1], [1, 0.8, 1]);

    return (
        <div className="w-full h-full relative overflow-hidden bg-white">
            {/* Background Image restored */}
            <Img src={staticFile('FINAL/3.png')} className="absolute inset-0 w-full h-full object-cover" />

            {/* OTP Typed Overlay masking the static zeroes */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[93%] h-[64px] bg-[#F7F6F3] rounded-2xl flex justify-center items-center z-10" 
                 style={{ top: '68.1%' }}>
                <div className="tracking-[0.85em] text-slate-600 font-bold text-[30px] ml-4 relative flex items-center h-10">
                    {otpTyped}
                    {frame >= 10 && frame < 50 && <span className="absolute right-[-15px] animate-pulse border-r-[3px] border-slate-800 h-8"></span>}
                </div>
            </div>

            {/* Hover Button Effect (Marron foncé) appearing precisely at frame 98 */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[93%] h-[64px] bg-[#8B5E45] rounded-[24px] flex justify-center items-center z-10" 
                 style={{ 
                     top: '77%', 
                     opacity: frame >= 98 ? 1 : 0 
                 }}>
                <span className="text-white font-bold tracking-[0.15em] text-[20px] uppercase drop-shadow-sm">VALIDER LE CODE</span>
            </div>

            {/* Cursor */}
            {frame >= 50 && (
                <div className="absolute z-50 pointer-events-none origin-top-left" style={{ left: `${cursorX}%`, top: `${cursorY}%`, transform: `scale(${cursorScale}) translateX(-50%) translateY(-50%)` }}>
                    <CursorPointer size={30} />
                </div>
            )}
        </div>
    );
};
