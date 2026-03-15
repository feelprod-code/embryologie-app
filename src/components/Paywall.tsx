import React, { useState } from 'react';
import { Shield, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Paywall() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      console.log("Appel au backend pour créer une session Checkout...");
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
           priceId: 'price_1TBKsE2ahjCLnYridMlbbePk',
           successUrl: window.location.origin + '?success=true',
           cancelUrl: window.location.origin + '?canceled=true',
        }
      });
      
      if (error) {
         console.error("Erreur du backend:", error);
         setIsLoading(false);
         return;
      }

      if (data?.url) {
        window.location.href = data.url; // Redirection directe vers Stripe
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Erreur de connexion Stripe:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center p-4 bg-[#FAF6ED]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center animate-fade-in">
        <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles size={32} />
        </div>
        
        <h2 className="text-2xl font-anton text-slate-800 tracking-wide uppercase mb-4">
          Accès Premium Requis
        </h2>
        
        <p className="text-slate-600 mb-8 leading-relaxed font-medium">
          Abonnez-vous pour débloquer l'accès complet à toutes les vidéos d'embryologie ainsi qu'à l'assistant IA spécialisé.
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
          <ul className="space-y-4 text-left">
            <li className="flex items-center text-slate-700">
              <Shield className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span>Accès illimité à la vidéothèque</span>
            </li>
            <li className="flex items-center text-slate-700">
              <Shield className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span>Analyses par l'assistant IA (Claude 3.5 Sonnet)</span>
            </li>
            <li className="flex items-center text-slate-700">
              <Shield className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span>Paiement sécurisé via Stripe</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md active:scale-95 text-lg flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Chargement...
            </>
          ) : (
            "Débloquer l'accès complet"
          )}
        </button>
      </div>
    </div>
  );
}
