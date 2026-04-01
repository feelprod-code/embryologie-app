import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const CinematicTitle: React.FC<{
  text: string;
  startFrame: number;
  durationInFrames: number;
}> = ({ text, startFrame, durationInFrames }) => {
  const actualFrame = useCurrentFrame();
  const { fps: realFps } = useVideoConfig();
  const frame = actualFrame * (30 / realFps);

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 15, startFrame + durationInFrames - 15, startFrame + durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0.95, 1.05],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (frame < startFrame || frame > startFrame + durationInFrames) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-[500]"
      style={{ opacity }}
    >
      <h1
        className="text-7xl text-white font-bebas tracking-widest drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] px-12 py-6 bg-black/40 rounded-xl"
        style={{ transform: `scale(${scale})` }}
      >
        {text}
      </h1>
    </div>
  );
};
