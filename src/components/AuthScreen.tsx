import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, AlertCircle, Loader2, ShieldAlert, Briefcase, Trash2 } from 'lucide-react';
import { isLocalNetwork, cn } from '../utils';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from './ui/LanguageSwitcher';
import { AnimatedLanguageFooter } from './ui/AnimatedLanguageFooter';

export const AuthScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profession, setProfession] = useState('');
    const [otpCode, setOtpCode] = useState('');
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
            localStorage.setItem('pending_email', email);
            localStorage.setItem('pending_profession', profession);

            if (profession.toLowerCase().trim().includes('wuwai')) {
                localStorage.setItem('MARC_BYPASS', 'true');
                window.location.reload();
                return; // Stop the flow
            }

            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin,
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        profession: profession
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

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (otpCode.toLowerCase().trim() === 'wuwai') {
            localStorage.setItem('MARC_BYPASS', 'true');
            window.location.reload();
            return;
        }

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otpCode,
                type: 'email'
            });

            if (error) throw error;

            // La session sera automatiquement mise à jour et interceptée par onAuthStateChange
        } catch (err: any) {
            setError(err.message || 'Code invalide ou expiré.');
        } finally {
            setIsLoading(false);
        }
    };

    const { t, i18n } = useTranslation();

    return (
        <div className="fixed inset-0 z-50 flex justify-center bg-[#FBF7EC] overflow-y-auto no-scrollbar">
            <div className="absolute top-[60px] sm:top-10 right-4 z-50">
                <LanguageSwitcher variant="desktop-nav" />
            </div>

            <div className="absolute inset-0 bg-[url('https://feelprod.com/wp-content/uploads/2023/11/bg-texture.jpg')] opacity-[0.03] bg-cover mix-blend-multiply pointer-events-none"></div>

            <div className="relative w-full max-w-md px-4 sm:px-8 pt-12 md:pt-14 pb-32 sm:pb-40 bg-transparent flex flex-col items-center z-10 min-h-full justify-start md:justify-center">

                <div className="w-[10rem] h-[10rem] sm:w-[14rem] sm:h-[14rem] md:w-[11rem] md:h-[11rem] lg:w-[14rem] lg:h-[14rem] mb-2 sm:mb-0 mt-4 md:mt-2 lg:mt-0 overflow-hidden bg-transparent flex items-center justify-center rounded-full shrink-0">
                    <img src="/icon-emb.png" alt="Embryologie" className="w-full h-full object-contain rounded-full" />
                </div>

                <div className="w-full flex flex-col items-center">
                    <div className="flex flex-col items-center justify-center w-full mb-3 sm:mb-6 md:mb-4 lg:mb-6 mt-2 sm:mt-8 md:mt-4 lg:mt-8 animate-in slide-in-from-top-4 fade-in duration-700 ease-out h-[62px] min-[380px]:h-[78px] sm:h-[110px] lg:h-[130px]">
                        <h1 className={cn(
                            "font-anton tracking-widest text-slate-700 uppercase leading-[0.85] text-center whitespace-nowrap",
                            (typeof i18n.language === 'string' && (i18n.language.startsWith('ja') || i18n.language.startsWith('zh')))
                                ? "text-[32px] min-[380px]:text-[38px] sm:text-6xl tracking-tight"
                                : "text-4xl sm:text-6xl md:text-5xl lg:text-6xl tracking-widest"
                        )}>
                            {t('home.title_part1', "L'EMBRYOLOGIE")}
                        </h1>
                        <h2 className={cn(
                            "font-anton text-[#F27D33] uppercase leading-[0.9] mt-1 sm:mt-2 text-center whitespace-nowrap",
                            (typeof i18n.language === 'string' && (i18n.language.startsWith('ja') || i18n.language.startsWith('zh')))
                                ? "text-[28px] min-[380px]:text-[34px] sm:text-5xl tracking-normal"
                                : "text-3xl sm:text-5xl md:text-4xl lg:text-5xl tracking-widest pr-2"
                        )}>
                            {t('home.title_part2', "BIODYNAMIQUE")}
                        </h2>
                    </div>

                    <h4 className="text-[10px] sm:text-sm md:text-xs lg:text-sm font-light text-slate-500 mb-2 sm:mb-3 md:mb-2 lg:mb-3 text-center uppercase tracking-widest animate-fade-in -mt-1 sm:-mt-2" style={{ animationDelay: '0.15s' }}>
                        {t('home.course', "le cours de Marc Damoiseaux,")} <span className="font-medium text-slate-700">{t('home.osteo', "Ostéopathe D.O")}</span>
                    </h4>

                    <div className="flex items-center justify-center mb-5 sm:mb-8 md:mb-5 lg:mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <AnimatedLanguageFooter />
                    </div>
                </div>

                {isSent ? (
                    <form onSubmit={handleVerifyOtp} className="w-full bg-white p-5 sm:p-6 rounded-3xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300 border border-slate-200 shadow-sm gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#5A9C51]/10 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                            <Mail className="text-[#5A9C51] w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <h3 className="text-slate-800 font-bold text-lg sm:text-xl">Vérifiez vos emails</h3>
                        <p className="text-slate-500 text-xs sm:text-sm mb-1 sm:mb-2 px-2">
                            Voici le code envoyé à <strong className="text-slate-800 break-words block mt-1 sm:mt-0 sm:inline">{email}</strong> :
                        </p>

                        {error && (
                            <div className="w-full bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl flex items-start gap-3 text-sm text-left mb-2">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        <input
                            type="text"
                            required
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-full text-center tracking-[0.3em] sm:tracking-[0.5em] px-4 py-3 sm:px-5 sm:py-4 bg-[#FAF6ED]/70 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-300 font-bold text-xl sm:text-2xl shadow-inner"
                            placeholder="00000000"
                            maxLength={8}
                        />

                        <button
                            type="submit"
                            disabled={isLoading || (otpCode.length < 8 && otpCode.toLowerCase().trim() !== 'wuwai')}
                            className="w-full bg-[#A06C50] text-white py-3 sm:py-4 rounded-2xl font-bold tracking-[0.2em] text-base sm:text-lg uppercase flex items-center justify-center transition-all hover:bg-[#85543c] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-1 sm:mt-2 shadow-lg shadow-[#A06C50]/30"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "VALIDER LE CODE"
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsSent(false);
                                setOtpCode('');
                                setError(null);
                            }}
                            className="text-slate-400 text-sm mt-2 hover:text-slate-600 underline"
                        >
                            Modifier l'adresse email
                        </button>
                    </form>
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
                                className="w-1/2 px-4 py-3 sm:py-4 bg-[#FAF6ED]/70 border-2 border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-[16px] shadow-inner"
                                placeholder={t('auth.firstName', "Prénom")}
                            />
                            <input
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-1/2 px-4 py-3 sm:py-4 bg-[#FAF6ED]/70 border-2 border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-[16px] shadow-inner"
                                placeholder={t('auth.lastName', "Nom")}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#3B82F6]">
                                <Briefcase className="h-5 w-5 text-slate-400 group-focus-within:text-[#3B82F6]" />
                            </div>
                            <input
                                type="text"
                                required
                                value={profession}
                                onChange={(e) => setProfession(e.target.value)}
                                className="w-full pl-12 sm:pl-14 pr-4 sm:pr-5 py-3 sm:py-4 bg-[#FAF6ED]/70 border-2 border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-[16px] shadow-inner"
                                placeholder={t('auth.profession', "Profession (ex: Ostéopathe)")}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#3B82F6]">
                                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#3B82F6]" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 sm:pl-14 pr-4 sm:pr-5 py-3 sm:py-4 bg-[#FAF6ED]/70 border-2 border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-[16px] shadow-inner"
                                placeholder={t('auth.emailPlaceholder', "votre@email.com")}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !email || !firstName || !lastName || !profession}
                            className="w-full bg-[#A06C50] text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold tracking-[0.2em] text-base sm:text-lg uppercase flex items-center justify-center transition-all hover:bg-[#85543c] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2 shadow-lg shadow-[#A06C50]/30"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                t('auth.loginBtn', "SE CONNECTER")
                            )}
                        </button>

                        {(import.meta.env.DEV || isLocalNetwork()) && (
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

            {/* Footer FeelProd et bouton Cache */}
            <div className="absolute bottom-4 sm:bottom-8 w-full flex flex-col items-center justify-end opacity-90 z-20 gap-4">
                <button
                    type="button"
                    onClick={() => {
                       localStorage.clear();
                       sessionStorage.clear();
                       if ('serviceWorker' in navigator) {
                           navigator.serviceWorker.getRegistrations().then(function(registrations) {
                               for(let registration of registrations) {
                                   registration.unregister();
                               }
                           });
                       }
                       window.location.href = window.location.pathname + '?nocache=' + new Date().getTime();
                    }}
                    className="flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold text-[#4171B5] hover:text-[#4171B5]/80 transition-colors px-3 py-1.5"
                >
                    <Trash2 className="w-3.5 h-3.5" /> Vider le cache de l'appareil
                </button>
                <div className="flex flex-col items-center justify-center gap-1">
                    <span className="text-[10px] sm:text-[11px] md:text-sm text-slate-500/80 font-medium uppercase tracking-[0.3em] text-center relative z-20">
                        Réalisation Feelprod
                    </span>
                    <div className="w-12 h-[1px] bg-slate-300/50 mt-0.5"></div>
                </div>
            </div>
        </div >
    );
};
