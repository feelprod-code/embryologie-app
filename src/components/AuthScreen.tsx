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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FBF7EC] overflow-hidden select-none">
            <div className="absolute top-3.5 promax:top-4 sm:top-6 md:top-8 right-3.5 promax:right-4 sm:right-6 md:right-8 z-50">
                <LanguageSwitcher variant="desktop-nav" />
            </div>

            <div className="absolute inset-0 bg-[url('https://feelprod.com/wp-content/uploads/2023/11/bg-texture.jpg')] opacity-[0.03] bg-cover mix-blend-multiply pointer-events-none"></div>

            <div className="relative w-full max-w-[390px] promax:max-w-[416px] sm:max-w-[580px] md:max-w-[640px] lg:max-w-[480px] ipad-13:max-w-[740px] px-4 promax:px-5 sm:px-8 py-3 xs:py-5 promax:py-6 sm:py-8 md:py-10 lg:py-5 ipad-13:py-12 bg-transparent flex flex-col items-center justify-between z-10 h-[100dvh] max-h-[860px] sm:max-h-[1000px] md:max-h-[1080px] lg:max-h-[760px] ipad-13:max-h-[1220px] my-auto">

                {/* Header: Logo + Titles */}
                <div className="w-full flex flex-col items-center shrink-0">
                    <div className="w-24 h-24 xs:w-32 xs:h-32 promax:w-[8.5rem] promax:h-[8.5rem] promax-tall:w-[10rem] promax-tall:h-[10rem] sm:w-48 sm:h-48 md:w-52 md:h-52 lg:w-32 lg:h-32 ipad-13:w-60 ipad-13:h-60 overflow-hidden bg-transparent flex items-center justify-center rounded-full shrink-0 shadow-sm">
                        <img src="/icon-emb.png" alt="Embryologie" className="w-full h-full object-contain rounded-full" />
                    </div>

                    <div className="w-full flex flex-col items-center mt-2 xs:mt-2.5 promax:mt-3 sm:mt-4 md:mt-5 lg:mt-2.5 ipad-13:mt-6">
                        <div className="flex flex-col items-center justify-center w-full animate-in slide-in-from-top-4 fade-in duration-700 ease-out">
                            <h1 className={cn(
                                "font-anton text-slate-700 uppercase leading-[0.86] text-center whitespace-nowrap",
                                (typeof i18n.language === 'string' && (i18n.language.startsWith('ja') || i18n.language.startsWith('zh')))
                                    ? "text-[28px] xs:text-[34px] promax:text-[38px] sm:text-5xl md:text-6xl lg:text-[42px] ipad-13:text-7xl tracking-tight"
                                    : "text-[36px] xs:text-[42px] promax:text-[48px] sm:text-[66px] md:text-[72px] lg:text-[52px] ipad-13:text-[84px] tracking-widest"
                            )}>
                                {t('home.title_part1', "L'EMBRYOLOGIE")}
                            </h1>
                            <h2 className={cn(
                                "font-anton text-[#F27D33] uppercase leading-[0.9] mt-1 sm:mt-1.5 text-center whitespace-nowrap",
                                (typeof i18n.language === 'string' && (i18n.language.startsWith('ja') || i18n.language.startsWith('zh')))
                                    ? "text-[24px] xs:text-[28px] promax:text-[32px] sm:text-4xl md:text-5xl lg:text-[34px] ipad-13:text-6xl tracking-normal"
                                    : "text-[28px] xs:text-[33px] promax:text-[37px] sm:text-[50px] md:text-[55px] lg:text-[40px] ipad-13:text-[64px] tracking-widest"
                            )}>
                                {t('home.title_part2', "BIODYNAMIQUE")}
                            </h2>
                        </div>

                        <h4 className="text-[11px] xs:text-xs promax:text-[13px] sm:text-[16px] md:text-[17px] lg:text-[13px] ipad-13:text-[20px] font-normal text-slate-500 mt-2 sm:mt-3 lg:mt-2 ipad-13:mt-4 text-center uppercase tracking-[0.14em] sm:tracking-[0.18em] animate-fade-in" style={{ animationDelay: '0.15s' }}>
                            {t('home.course', "le cours de Marc Damoiseaux,")} <span className="font-semibold text-slate-700">{t('home.osteo', "Ostéopathe D.O")}</span>
                        </h4>

                        <div className="flex items-center justify-center mt-1.5 sm:mt-2.5 lg:mt-1.5 ipad-13:mt-3.5 animate-fade-in w-full" style={{ animationDelay: '0.3s' }}>
                            <AnimatedLanguageFooter />
                        </div>
                    </div>
                </div>

                {/* Form Body */}
                <div className="w-full max-w-[390px] promax:max-w-[406px] sm:max-w-[540px] md:max-w-[600px] lg:max-w-[440px] ipad-13:max-w-[680px] my-auto flex flex-col justify-center shrink">
                    {isSent ? (
                        <form onSubmit={handleVerifyOtp} className="w-full bg-white p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300 border border-slate-200 shadow-sm gap-3 sm:gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#5A9C51]/10 rounded-full flex items-center justify-center">
                                <Mail className="text-[#5A9C51] w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-slate-800 font-bold text-lg sm:text-xl md:text-2xl">{t('auth.verifyEmails', "Vérifiez vos emails")}</h3>
                            <p className="text-slate-500 text-xs sm:text-sm md:text-base px-2">
                                {t('auth.codeSentTo', "Voici le code envoyé à")} <strong className="text-slate-800 break-words block mt-0.5 sm:inline">{email}</strong> :
                            </p>

                            {error && (
                                <div className="w-full bg-red-50 border border-red-200 text-red-600 p-2.5 sm:p-3 rounded-xl flex items-start gap-2 text-xs sm:text-sm text-left">
                                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <input
                                type="text"
                                required
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                className="w-full text-center tracking-[0.25em] sm:tracking-[0.4em] px-4 py-3 sm:py-4 bg-[#FAF6ED]/80 border-2 border-slate-200/80 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-300 font-bold text-xl sm:text-2xl shadow-inner"
                                placeholder="00000000"
                                maxLength={8}
                            />

                            <button
                                type="submit"
                                disabled={isLoading || otpCode.length < 8}
                                className="w-full bg-[#A06C50] text-white py-3.5 sm:py-4 md:py-4.5 rounded-xl sm:rounded-2xl font-bold tracking-[0.15em] text-sm sm:text-base md:text-lg uppercase flex items-center justify-center transition-all hover:bg-[#85543c] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-[#A06C50]/20"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
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
                                className="text-slate-400 text-xs sm:text-sm mt-1 hover:text-slate-600 underline"
                            >
                                {t('auth.changeEmail', "Modifier l'adresse email")}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="w-full flex flex-col gap-2.5 xs:gap-3 promax:gap-3.5 sm:gap-4 md:gap-4 lg:gap-2.5 ipad-13:gap-5">

                            {error && (
                                <div className="w-full bg-red-50 border border-red-200 text-red-600 p-2.5 sm:p-3 rounded-xl flex items-start gap-2 text-xs sm:text-sm">
                                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="flex gap-2.5 xs:gap-3 sm:gap-4 md:gap-4">
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-1/2 px-3.5 xs:px-4 sm:px-5 ipad-13:px-6 py-2.5 xs:py-3 promax:py-3.5 promax-tall:py-4 sm:py-4 md:py-[18px] lg:py-3 ipad-13:py-5 bg-white/60 border border-slate-200/90 rounded-xl xs:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-[15px] xs:text-[16px] sm:text-[18px] md:text-[19px] lg:text-[15px] ipad-13:text-[21px] shadow-inner"
                                    placeholder={t('auth.firstName', "Prénom")}
                                />
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-1/2 px-3.5 xs:px-4 sm:px-5 ipad-13:px-6 py-2.5 xs:py-3 promax:py-3.5 promax-tall:py-4 sm:py-4 md:py-[18px] lg:py-3 ipad-13:py-5 bg-white/60 border border-slate-200/90 rounded-xl xs:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-[15px] xs:text-[16px] sm:text-[18px] md:text-[19px] lg:text-[15px] ipad-13:text-[21px] shadow-inner"
                                    placeholder={t('auth.lastName', "Nom")}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 xs:pl-4 sm:pl-5 ipad-13:pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-[#3B82F6]">
                                    <Briefcase className="h-4 w-4 xs:h-[18px] xs:w-[18px] sm:h-5 sm:w-5 md:h-[22px] md:w-[22px] lg:h-[18px] lg:w-[18px] ipad-13:h-6 ipad-13:w-6 text-slate-400 group-focus-within:text-[#3B82F6]" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={profession}
                                    onChange={(e) => setProfession(e.target.value)}
                                    className="w-full pl-10 xs:pl-11 sm:pl-12 md:pl-14 lg:pl-11 ipad-13:pl-16 pr-3.5 xs:pr-4 sm:pr-5 py-2.5 xs:py-3 promax:py-3.5 promax-tall:py-4 sm:py-4 md:py-[18px] lg:py-3 ipad-13:py-5 bg-white/60 border border-slate-200/90 rounded-xl xs:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-[15px] xs:text-[16px] sm:text-[18px] md:text-[19px] lg:text-[15px] ipad-13:text-[21px] shadow-inner"
                                    placeholder={t('auth.profession', "Profession (ex: Ostéopathe)")}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 xs:pl-4 sm:pl-5 ipad-13:pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-[#3B82F6]">
                                    <MapPin className="h-4 w-4 xs:h-[18px] xs:w-[18px] sm:h-5 sm:w-5 md:h-[22px] md:w-[22px] lg:h-[18px] lg:w-[18px] ipad-13:h-6 ipad-13:w-6 text-slate-400 group-focus-within:text-[#3B82F6]" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-10 xs:pl-11 sm:pl-12 md:pl-14 lg:pl-11 ipad-13:pl-16 pr-3.5 xs:pr-4 sm:pr-5 py-2.5 xs:py-3 promax:py-3.5 promax-tall:py-4 sm:py-4 md:py-[18px] lg:py-3 ipad-13:py-5 bg-white/60 border border-slate-200/90 rounded-xl xs:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-[15px] xs:text-[16px] sm:text-[18px] md:text-[19px] lg:text-[15px] ipad-13:text-[21px] shadow-inner"
                                    placeholder={t('auth.address', t('auth.location', "Adresse (ex: Ville, Code postal...)"))}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 xs:pl-4 sm:pl-5 ipad-13:pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-[#3B82F6]">
                                    <Mail className="h-4 w-4 xs:h-[18px] xs:w-[18px] sm:h-5 sm:w-5 md:h-[22px] md:w-[22px] lg:h-[18px] lg:w-[18px] ipad-13:h-6 ipad-13:w-6 text-slate-400 group-focus-within:text-[#3B82F6]" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 xs:pl-11 sm:pl-12 md:pl-14 lg:pl-11 ipad-13:pl-16 pr-3.5 xs:pr-4 sm:pr-5 py-2.5 xs:py-3 promax:py-3.5 promax-tall:py-4 sm:py-4 md:py-[18px] lg:py-3 ipad-13:py-5 bg-white/60 border border-slate-200/90 rounded-xl xs:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-[15px] xs:text-[16px] sm:text-[18px] md:text-[19px] lg:text-[15px] ipad-13:text-[21px] shadow-inner"
                                    placeholder={t('auth.emailPlaceholder', "votre@email.com")}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !email || !firstName || !lastName || !profession || !location}
                                className="w-full bg-[#A06C50] text-white py-3 xs:py-3.5 promax:py-4 promax-tall:py-4 sm:py-[18px] md:py-5 lg:py-3.5 ipad-13:py-[22px] rounded-xl xs:rounded-2xl font-bold tracking-[0.18em] text-sm xs:text-[15px] promax:text-base sm:text-[18px] md:text-[19px] lg:text-[15px] ipad-13:text-[21px] uppercase flex items-center justify-center transition-all hover:bg-[#85543c] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-1 sm:mt-1.5 shadow-md shadow-[#A06C50]/25"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    t('auth.loginBtn', "SE CONNECTER")
                                )}
                            </button>

                            {/* Bouton visible UNIQUEMENT sur l'URL Développeur privée de Guillaume (?dev=true ou ?admin=dev) */}
                            {typeof window !== 'undefined' && (
                                window.location.search.includes('dev') ||
                                window.location.search.includes('admin') ||
                                window.location.hash.includes('dev') ||
                                window.location.pathname.startsWith('/dev')
                            ) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        localStorage.setItem('DEV_BYPASS_AUTH', 'true');
                                        localStorage.setItem('DEV_ADMIN_BYPASS', 'true');
                                        window.location.href = '/?admin=dev';
                                    }}
                                    className="w-full flex items-center justify-center py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#8C4E33] to-[#EA580C] hover:brightness-105 transition-all mt-1.5 shadow-sm cursor-pointer border border-amber-400"
                                >
                                    <ShieldAlert className="w-4 h-4 mr-1.5 shrink-0" />
                                    <span>⚡ Accès Développeur Direct (Guillaume)</span>
                                </button>
                            )}
                        </form>
                    )}
                </div>

                {/* Footer FeelProd et bouton Cache */}
                <div className="w-full flex flex-col items-center justify-end opacity-90 z-20 gap-1.5 sm:gap-2 shrink-0 pb-1">
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
                        className="flex items-center justify-center gap-1.5 text-[11px] xs:text-xs promax:text-[13px] sm:text-[15px] md:text-base lg:text-xs ipad-13:text-lg font-bold text-[#4171B5] hover:text-[#4171B5]/80 transition-colors px-2 py-0.5"
                    >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 ipad-13:w-5 ipad-13:h-5" /> {t('auth.clearCache', "Vider le cache de l'appareil")}
                    </button>
                    <div className="flex flex-col items-center justify-center">
                        <span 
                            onClick={() => {
                                const now = Date.now();
                                (window as any).__fpClicks = ((window as any).__fpClicks || []).filter((t: number) => now - t < 1500);
                                (window as any).__fpClicks.push(now);
                                if ((window as any).__fpClicks.length >= 3) {
                                    localStorage.setItem('DEV_BYPASS_AUTH', 'true');
                                    localStorage.setItem('DEV_ADMIN_BYPASS', 'true');
                                    window.location.href = '/?admin=dev';
                                }
                            }}
                            className="text-[10px] xs:text-[11px] sm:text-xs md:text-[13px] lg:text-[10px] ipad-13:text-sm text-slate-500/80 font-medium uppercase tracking-[0.25em] text-center relative z-20 cursor-default select-none"
                            title=""
                        >
                            Réalisation FeelProd
                        </span>
                        <div className="w-10 sm:w-12 h-[1px] bg-slate-300/60 mt-1"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};
