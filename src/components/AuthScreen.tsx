
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, CheckCircle, AlertCircle, Loader2, ShieldAlert } from 'lucide-react';

export const AuthScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [profession, setProfession] = useState('');
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
            // Save data locally so we can restore it or update the profile once the user actually clicks the link
            localStorage.setItem('pending_first_name', firstName);
            localStorage.setItem('pending_last_name', lastName);
            localStorage.setItem('pending_address', address);
            localStorage.setItem('pending_profession', profession);
            localStorage.setItem('pending_email', email);

            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin,
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        address,
                        profession
                    }
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF6ED] overflow-hidden">
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
                        Créez votre accès ou connectez-vous.
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
                    <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">

                        {error && (
                            <div className="w-full bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl flex items-start gap-3 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <input
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-1/2 px-5 py-4 bg-white/70 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-base shadow-inner"
                                placeholder="Prénom"
                                autoComplete="given-name"
                            />
                            <input
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-1/2 px-5 py-4 bg-white/70 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-base shadow-inner"
                                placeholder="Nom"
                                autoComplete="family-name"
                            />
                        </div>

                        <div className="flex gap-4">
                            <input
                                type="text"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-1/2 px-5 py-4 bg-white/70 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-base shadow-inner"
                                placeholder="Adresse / Ville"
                                autoComplete="address-line1"
                            />
                            <input
                                type="text"
                                required
                                value={profession}
                                onChange={(e) => setProfession(e.target.value)}
                                className="w-1/2 px-5 py-4 bg-white/70 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-base shadow-inner"
                                placeholder="Profession"
                                autoComplete="organization-title"
                            />
                        </div>

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
                                autoComplete="email"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !email || !firstName || !lastName}
                            className="w-full bg-[#A06C50] text-white py-4 rounded-2xl font-bold tracking-[0.2em] text-lg uppercase flex items-center justify-center transition-all hover:bg-[#85543c] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2 shadow-lg shadow-[#A06C50]/30"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "ACCÈS"
                            )}
                        </button>

                        {import.meta.env.DEV && (
                            <button
                                type="button"
                                onClick={() => {
                                    localStorage.setItem('DEV_BYPASS_AUTH', 'true');
                                    window.location.reload();
                                }}
                                className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 mt-4"
                            >
                                <ShieldAlert className="w-5 h-5 mr-2" />
                                DEV: Forcer l'accès Admin
                            </button>
                        )}
                    </form>
                )}
            </div>

            {/* Footer FeelProd */}
            <div className="absolute bottom-6 w-full flex flex-col items-center justify-end opacity-90 z-0">
                <span className="text-[10px] sm:text-[11px] md:text-sm text-slate-500/80 font-medium uppercase tracking-[0.3em] text-center relative z-20 mb-1">
                    Réalisation Feelprod
                </span>
                <div className="w-12 h-[1px] bg-slate-300/50 mt-1"></div>
            </div>
        </div >
    );
};
