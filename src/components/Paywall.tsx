import { useState } from 'react';
import { Shield, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Paywall() {
  const stripeLink = "https://buy.stripe.com/8x29ATgysdhE91VbRi9k400";

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

        <a 
          href={stripeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md active:scale-95 text-lg flex items-center justify-center no-underline"
        >
          Débloquer l'accès complet
        </a>
      </div>
    </div>
  );
}
