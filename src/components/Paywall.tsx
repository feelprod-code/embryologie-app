import { useState, useEffect } from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Paywall() {
  const [stripeLink, setStripeLink] = useState("https://buy.stripe.com/8x29ATgysdhE91VbRi9k400");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        const emailParam = session.user.email ? `&prefilled_email=${encodeURIComponent(session.user.email)}` : '';
        setStripeLink(`https://buy.stripe.com/8x29ATgysdhE91VbRi9k400?client_reference_id=${session.user.id}${emailParam}`);
      }
    });
  }, []);

  return (
    <div className="w-full flex-1 flex items-center justify-center p-4 bg-[#FAF6ED]">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 text-center animate-fade-in">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        
        <h2 className="text-xl sm:text-2xl font-anton text-slate-800 tracking-wide uppercase mb-2 sm:mb-4">
          Accès Premium Requis
        </h2>
        
        <p className="text-sm sm:text-base text-slate-600 mb-5 sm:mb-8 leading-relaxed font-medium">
          Abonnez-vous pour débloquer l'accès complet à toutes les vidéos d'embryologie ainsi qu'à l'assistant IA spécialisé.
        </p>

        <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8 border border-slate-100">
          <ul className="space-y-3 sm:space-y-4 text-left">
            <li className="flex items-center text-sm sm:text-base text-slate-700">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
              <span>Accès illimité à la vidéothèque</span>
            </li>
            <li className="flex items-center text-sm sm:text-base text-slate-700">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
              <span>Analyses par l'assistant IA (Claude 3.5 Sonnet)</span>
            </li>
            <li className="flex items-center text-sm sm:text-base text-slate-700">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
              <span>Paiement sécurisé (1x, ou bien en 3x/4x via Klarna / PayPal)</span>
            </li>
          </ul>
        </div>

        <a 
          href={stripeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition-all shadow-md active:scale-95 text-base sm:text-lg flex items-center justify-center no-underline"
        >
          Débloquer l'accès complet
        </a>
      </div>
    </div>
  );
}
