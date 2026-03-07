import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const AuthScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    // In development, you can point this to localhost
                    // In production, point it to your vercel app
                    emailRedirectTo: window.location.origin,
                }
            });

            if (error) throw error;

            setIsSent(true);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de la connexion.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://feelprod.com/wp-content/uploads/2023/11/bg-texture.jpg')] opacity-[0.03] bg-cover mix-blend-multiply pointer-events-none"></div>

            <div className="relative w-full max-w-md p-8 bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl sm:rounded-[2rem] flex flex-col items-center">

                <div className="w-16 h-16 bg-[#1D1D1B] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    {/* You can replace this with your actual logo */}
                    <div className="w-8 h-8 rounded-full border-4 border-white/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                </div>

                <h1 className="text-3xl font-bebas tracking-wide text-slate-800 mb-2">Accès Embryologie</h1>
                <p className="text-slate-500 text-center text-sm mb-8">
                    Entrez votre adresse e-mail pour recevoir votre lien de connexion sécurisé.
                </p>

                {isSent ? (
                    <div className="w-full bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                            <CheckCircle className="text-emerald-500 w-6 h-6" />
                        </div>
                        <h3 className="text-emerald-800 font-semibold mb-1">Lien envoyé !</h3>
                        <p className="text-emerald-600 text-sm">
                            Vérifiez votre boîte de réception <strong>{email}</strong> et cliquez sur le lien magique pour vous connecter.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">

                        {error && (
                            <div className="w-full bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl flex items-start gap-3 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1D1D1B]/20 focus:border-[#1D1D1B] transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full bg-[#1D1D1B] text-white py-4 rounded-2xl font-bold tracking-wide flex items-center justify-center transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Recevoir mon lien d'accès"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
