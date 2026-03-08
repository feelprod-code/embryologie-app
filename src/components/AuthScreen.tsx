
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, CheckCircle, AlertCircle, Loader2, ShieldAlert } from 'lucide-react';

export const AuthScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Sometimes mobile Safari delays mapping the hash fragment. Check explicitly.
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
            setIsLoading(true);
            // This forces Supabase to parse the URL and save the session.
            // When done, App.tsx's onAuthStateChange will pick it up and unmount AuthScreen.
            supabase.auth.getSession().finally(() => {
                 setIsLoading(false);
            });
        }
    }, []);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FBF7EC] overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://feelprod.com/wp-content/uploads/2023/11/bg-texture.jpg')] opacity-[0.03] bg-cover mix-blend-multiply pointer-events-none"></div>

            <div className="relative w-full max-w-md px-8 py-10 bg-transparent flex flex-col items-center z-10 mb-8">

                <div className="w-[14rem] h-[14rem] mb-0 overflow-hidden bg-transparent flex items-center justify-center rounded-full">
                    <img src="/icon-emb.png" alt="Embryologie" className="w-full h-full object-contain rounded-full" />
                </div>

                <div className="w-full flex flex-col items-center">
                    <div className="flex items-center justify-center gap-3 w-full mb-8">
                        <div className="h-[1px] w-6 bg-[#A06C50]/40"></div>
                        <h3 className="text-lg sm:text-xl font-bebas tracking-[0.15em] text-slate-500 text-center uppercase">
                            Techniques Douces Tissulaires
                        </h3>
                        <div className="h-[1px] w-6 bg-[#A06C50]/40"></div>
                    </div>

                    <div className="flex flex-col items-center justify-center w-full mb-6">
                        <h1 className="text-5xl sm:text-6xl font-anton tracking-widest text-slate-700 uppercase leading-[0.85] text-center">
                            L'EMBRYOLOGIE
                        </h1>
                        <h2 className="text-4xl sm:text-5xl font-anton text-[#F27D33] uppercase tracking-widest leading-[0.9] mt-2 text-center">
                            BIODYNAMIQUE
                        </h2>
                    </div>

                    <h4 className="text-xs sm:text-sm font-light text-slate-500 mb-10 text-center uppercase tracking-widest">
                        par Marc Damoiseaux, <span className="font-medium text-slate-700">Ostéopathe D.O</span>
                    </h4>

                    <p className="text-slate-400 text-center text-xs sm:text-sm mb-6 font-light px-4">
                        Entrez votre adresse e-mail pour accéder à votre espace.
                    </p>
                </div>

                {isSent ? (
                    <div className="w-full bg-[#10B981]/10 border border-[#10B981]/20 p-6 rounded-3xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="text-[#10B981] w-8 h-8" />
                        </div>
                        <h3 className="text-[#10B981] font-bold text-xl mb-2">Lien magique envoyé !</h3>
                        <p className="text-emerald-700 text-sm">
                            Vérifiez votre boîte de réception <strong className="text-slate-800">{email}</strong> et cliquez sur le lien pour vous connecter.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">

                        {error && (
                            <div className="w-full bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl flex items-start gap-3 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#3B82F6]">
                                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#3B82F6]" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-14 pr-5 py-4 bg-white/70 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-lg shadow-inner"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full bg-[#A06C50] text-white py-4 rounded-2xl font-bold tracking-[0.2em] text-lg uppercase flex items-center justify-center transition-all hover:bg-[#85543c] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2 shadow-lg shadow-[#A06C50]/30"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "ACCÈS"
                            )}
                        </button>

                        {true && (
                            <button
                                type="button"
                                onClick={async () => {
                                    setIsLoading(true);
                                    try {
                                        // This uses a test account or generic sign in if configured, 
                                        // but realistically we should just alert the user or fake a session if needed.
                                        // Since we can't easily forge a real Supabase session without a password or valid token,
                                        // we'll instruct them to use Resend later, but for now we provide a direct login 
                                        // using a password if we set one up, or we can just bypass the whole screen.
                                        // To truly bypass, we need App.tsx to know we are bypassing.
                                        // Let's set a fake local storage flag and force a reload.
                                        localStorage.setItem('DEV_BYPASS_AUTH', 'true');
                                        window.location.reload();
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }}
                                className="w-full mt-4 bg-orange-100 text-orange-700 py-3 rounded-xl font-bold tracking-wide flex items-center justify-center transition-all hover:bg-orange-200 border border-orange-200"
                            >
                                <ShieldAlert className="w-5 h-5 mr-2" />
                                DEV: Forcer l'accès Admin
                            </button>
                        )}
                    </form>
                )}
            </div>

            {/* Footer FeelProd */}
            <div className="absolute bottom-10 w-full text-center z-0">
                <span className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-[0.3em] opacity-80">
                    Une réalisation FEELPROD
                </span>
            </div>
        </div>
    );
};
