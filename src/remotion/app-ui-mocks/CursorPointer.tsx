import React from 'react';

export const CursorPointer: React.FC<{ size?: number, color?: string }> = ({ size = 24, color = "black" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.4))" }}>
      <path d="M5.5 3.2L13.8 22.9L16.3 15.6L23.8 18.2L5.5 3.2Z" fill="white" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
);
