import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DevBypass: React.FC = () => {
  return (
    <>
      <button
        onClick={async () => {
          try {
            // Trick local storage 
            localStorage.setItem('DEV_BYPASS_AUTH', 'true');
            window.location.reload();
          } catch (e) {
            console.error(e);
          }
        }}
        className="w-[90%] max-w-xs mt-6 mx-auto bg-orange-500/20 text-orange-600 border border-orange-500/40 py-3 rounded-xl font-bold tracking-wide flex items-center justify-center transition-all hover:bg-orange-500/30"
      >
        <ShieldAlert className="w-5 h-5 mr-2" />
        Force Admin (DEV)
      </button>
    </>
  );
};
