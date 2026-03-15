import { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

export function SuccessOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.location.search.includes('success=true')) {
      setIsVisible(true);
      
      // Clean URL to prevent showing it again on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
      
      setTimeout(() => {
        setIsVisible(false);
      }, 3500);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-anton text-slate-800 tracking-wide uppercase mb-4">
          Paiement Réussi !
        </h2>
        <p className="text-slate-600 mb-6 leading-relaxed font-medium">
          Merci pour votre abonnement à Embryologie Biodynamique.
        </p>
        <div className="flex items-center justify-center space-x-2 text-primary font-medium">
          <Loader2 className="animate-spin w-5 h-5" />
          <span>Déblocage de votre accès...</span>
        </div>
      </div>
    </div>
  );
}
