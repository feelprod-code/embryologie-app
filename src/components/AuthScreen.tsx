import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, AlertCircle, Loader2, ShieldAlert, Briefcase, MapPin, Trash2 } from 'lucide-react';
import { isLocalNetwork, cn } from '../utils';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from './ui/LanguageSwitcher';
import { AnimatedLanguageFooter } from './ui/AnimatedLanguageFooter';

export const AuthScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profession, setProfession] = useState('');
    const [location, setLocation] = useState('');
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
            localStorage.setItem('pending_location', location);
            localStorage.setItem('pending_address', location);

            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin,
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        profession: profession,
                        location: location,
                        address: location
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
        <div className="fixed inset-0 z-50 flex justify-center bg-[#FBF7EC] overflow-hidden select-none">
            <div className="absolute top-3 sm:top-5 right-3 sm:right-4 z-50">
                <LanguageSwitcher variant="desktop-nav" />
            </div>

            <div className="absolute inset-0 bg-[url('https://feelprod.com/wp-content/uploads/2023/11/bg-texture.jpg')] opacity-[0.03] bg-cover mix-blend-multiply pointer-events-none"></div>

            <div className="relative w-full max-w-sm sm:max-w-md px-4 sm:px-6 py-3 sm:py-6 bg-transparent flex flex-col items-center justify-between z-10 h-[100dvh] max-h-[100dvh]">

                {/* Header: Logo + Titles */}
                <div className="w-full flex flex-col items-center shrink-0">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 overflow-hidden bg-transparent flex items-center justify-center rounded-full shrink-0 shadow-sm mt-1 sm:mt-2">
                        <img src="/icon-emb.png" alt="Embryologie" className="w-full h-full object-contain rounded-full" />
                    </div>

                    <div className="w-full flex flex-col items-center mt-1 sm:mt-2">
                        <div className="flex flex-col items-center justify-center w-full animate-in slide-in-from-top-4 fade-in duration-700 ease-out">
                            <h1 className={cn(
                                "font-anton tracking-widest text-slate-700 uppercase leading-[0.85] text-center whitespace-nowrap",
                                (typeof i18n.language === 'string' && (i18n.language.startsWith('ja') || i18n.language.startsWith('zh')))
                                    ? "text-[24px] sm:text-4xl tracking-tight"
                                    : "text-2xl sm:text-4xl md:text-5xl tracking-widest"
                            )}>
                                {t('home.title_part1', "L'EMBRYOLOGIE")}
                            </h1>
                            <h2 className={cn(
                                "font-anton text-[#F27D33] uppercase leading-[0.9] mt-0.5 sm:mt-1 text-center whitespace-nowrap",
                                (typeof i18n.language === 'string' && (i18n.language.startsWith('ja') || i18n.language.startsWith('zh')))
                                    ? "text-[20px] sm:text-3xl tracking-normal"
                                    : "text-xl sm:text-3xl md:text-4xl tracking-widest"
                            )}>
                                {t('home.title_part2', "BIODYNAMIQUE")}
                            </h2>
                        </div>

                        <h4 className="text-[9px] sm:text-xs font-light text-slate-500 mt-1 text-center uppercase tracking-widest animate-fade-in" style={{ animationDelay: '0.15s' }}>
                            {t('home.course', "le cours de Marc Damoiseaux,")} <span className="font-medium text-slate-700">{t('home.osteo', "Ostéopathe D.O")}</span>
                        </h4>

                        <div className="flex items-center justify-center mt-1 animate-fade-in scale-90 sm:scale-100" style={{ animationDelay: '0.3s' }}>
                            <AnimatedLanguageFooter />
                        </div>
                    </div>
                </div>

                {/* Form Body */}
                <div className="w-full max-w-sm my-auto flex flex-col justify-center shrink">
                    {isSent ? (
                        <form onSubmit={handleVerifyOtp} className="w-full bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300 border border-slate-200 shadow-sm gap-2.5 sm:gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#5A9C51]/10 rounded-full flex items-center justify-center">
                                <Mail className="text-[#5A9C51] w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <h3 className="text-slate-800 font-bold text-base sm:text-lg">{t('auth.verifyEmails', "Vérifiez vos emails")}</h3>
                            <p className="text-slate-500 text-[11px] sm:text-xs px-2">
                                {t('auth.codeSentTo', "Voici le code envoyé à")} <strong className="text-slate-800 break-words block mt-0.5 sm:inline">{email}</strong> :
                            </p>

                            {error && (
                                <div className="w-full bg-red-50 border border-red-200 text-red-600 p-2 sm:p-2.5 rounded-xl flex items-start gap-2 text-xs text-left">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <input
                                type="text"
                                required
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                className="w-full text-center tracking-[0.25em] sm:tracking-[0.4em] px-3 py-2 sm:px-4 sm:py-2.5 bg-[#FAF6ED]/70 border-2 border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-300 font-bold text-lg sm:text-xl shadow-inner"
                                placeholder="00000000"
                                maxLength={8}
                            />

                            <button
                                type="submit"
                                disabled={isLoading || otpCode.length < 8}
                                className="w-full bg-[#A06C50] text-white py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold tracking-[0.15em] text-xs sm:text-sm uppercase flex items-center justify-center transition-all hover:bg-[#85543c] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-[#A06C50]/20"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    t('auth.validateCode', "VALIDER LE CODE")
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsSent(false);
                                    setOtpCode('');
                                    setError(null);
                                }}
                                className="text-slate-400 text-xs mt-1 hover:text-slate-600 underline"
                            >
                                {t('auth.changeEmail', "Modifier l'adresse email")}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="w-full flex flex-col gap-2 sm:gap-2.5">

                            {error && (
                                <div className="w-full bg-red-50 border border-red-200 text-red-600 p-2 rounded-xl flex items-start gap-2 text-xs">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="flex gap-2 sm:gap-2.5">
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-1/2 px-3 py-2 sm:py-2.5 bg-[#FAF6ED]/70 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-xs sm:text-sm shadow-inner"
                                    placeholder={t('auth.firstName', "Prénom")}
                                />
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-1/2 px-3 py-2 sm:py-2.5 bg-[#FAF6ED]/70 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-xs sm:text-sm shadow-inner"
                                    placeholder={t('auth.lastName', "Nom")}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#3B82F6]">
                                    <Briefcase className="h-4 w-4 text-slate-400 group-focus-within:text-[#3B82F6]" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={profession}
                                    onChange={(e) => setProfession(e.target.value)}
                                    className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 bg-[#FAF6ED]/70 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-xs sm:text-sm shadow-inner"
                                    placeholder={t('auth.profession', "Profession (ex: Ostéopathe)")}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#3B82F6]">
                                    <MapPin className="h-4 w-4 text-slate-400 group-focus-within:text-[#3B82F6]" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 bg-[#FAF6ED]/70 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-xs sm:text-sm shadow-inner"
                                    placeholder={t('auth.address', t('auth.location', "Adresse (ex: Ville, Code postal...)"))}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#3B82F6]">
                                    <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-[#3B82F6]" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 bg-[#FAF6ED]/70 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-xs sm:text-sm shadow-inner"
                                    placeholder={t('auth.emailPlaceholder', "votre@email.com")}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !email || !firstName || !lastName || !profession || !location}
                                className="w-full bg-[#A06C50] text-white py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold tracking-[0.15em] text-xs sm:text-sm uppercase flex items-center justify-center transition-all hover:bg-[#85543c] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-1 shadow-md shadow-[#A06C50]/25"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
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
                                    className="w-full flex items-center justify-center py-1.5 px-3 rounded-lg text-[10px] sm:text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-all mt-1 opacity-90 hover:opacity-100"
                                >
                                    <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                                    {t('auth.devBypass', "DEV: Forcer l'accès Admin")}
                                </button>
                            )}
                        </form>
                    )}
                </div>

                {/* Footer FeelProd et bouton Cache */}
                <div className="w-full flex flex-col items-center justify-end opacity-90 z-20 gap-1.5 shrink-0 pb-1">
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
                        className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#4171B5] hover:text-[#4171B5]/80 transition-colors px-2 py-0.5"
                    >
                        <Trash2 className="w-3 h-3" /> {t('auth.clearCache', "Vider le cache de l'appareil")}
                    </button>
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-[9px] sm:text-[10px] text-slate-500/80 font-medium uppercase tracking-[0.25em] text-center relative z-20">
                            {t('auth.realisation', "Réalisation Feelprod")}
                        </span>
                        <div className="w-8 h-[1px] bg-slate-300/50 mt-0.5"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};
