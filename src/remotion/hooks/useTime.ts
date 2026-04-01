import { useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * Returns a framerate-agnostic frame number for interpolations.
 * It maps the current physical 60fps frame to the original 30fps timing math.
 * Example: At 60fps, actual frame 30 -> returns 15.
 */
export const useFrame30 = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    return frame * (30 / fps);
};

/**
 * Recalculates `durationInFrames` or timing offsets dynamically based on the current FPS.
 * Example: `fpsS(30)` at 60fps -> returns 60.
 */
export const fpsS = (framesAt30fps: number, currentFps: number) => {
    return Math.round(framesAt30fps * (currentFps / 30));
};
