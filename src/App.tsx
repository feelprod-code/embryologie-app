import React, { useState, useEffect, useTransition } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Layers, Droplet, Heart, Brain, Baby, CircleDot, Waves, ArrowRightLeft, Clock, GitCommitHorizontal, Sparkles, Stethoscope, HeartHandshake, Eye, Home as HomeIcon, Video, Shield, LogOut, X } from 'lucide-react';
import { detailedStages as detailedStagesFr, type StageDataV2, type EmbryoLayer } from './data/embryologie';
import { detailedStages as detailedStagesEn } from './data/embryologie_en';
import { detailedStages as detailedStagesEs } from './data/embryologie_es';
import { detailedStages as detailedStagesIt } from './data/embryologie_it';
import { detailedStages as detailedStagesDe } from './data/embryologie_de';
import { detailedStages as detailedStagesZh } from './data/embryologie_zh';
import { detailedStages as detailedStagesJa } from './data/embryologie_ja';
import { Mermaid } from './components/Mermaid';
import { ChatBot } from './components/ChatBot';
import { Home } from './components/Home';
import { VideoLibraryList } from './components/VideoLibraryList';
import { VideoPlayerPage } from './components/VideoPlayerPage';
import { AuthScreen } from './components/AuthScreen';
import { Paywall } from './components/Paywall';
import { AdminDashboard } from './components/AdminDashboard';
import { supabase } from './lib/supabase';
import { type VideoCourse } from './data/videoCourses';
import { cn, isLocalNetwork } from './utils';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/ui/LanguageSwitcher';
import { DesktopMenu } from './components/DesktopMenu';
import { FullscreenProvider } from './contexts/FullscreenContext';
import { OrientationLock } from './components/OrientationLock';
import { SuccessOverlay } from './components/SuccessOverlay';


const iconMap: Record<string, React.ReactNode> = {
  "j-0": <CircleDot size={20} className="text-blue-400" />,
  "j-1": <Droplet size={20} className="text-purple-400" />,
  "j-1-4": <Layers size={20} className="text-indigo-400" />,
  "j-5-8": <ArrowRightLeft size={20} className="text-rose-400" />,
  "j-7-14": <CircleDot size={20} className="text-pink-400" />,
  "j-14-21": <Waves size={20} className="text-red-400" />,
  "j-21-22": <Activity size={20} className="text-purple-400" />,
  "j-22-28": <Heart size={20} className="text-orange-400" />,
  "j-28": <Layers size={20} className="text-yellow-400" />,
  "j-45": <Brain size={20} className="text-primary" />,
  "maturation-12ans": <Baby size={20} className="text-cyan-400" />,
};

// --- Missing Icon Fallback ---
function Activity({ className, size }: { className?: string; size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

const layerColors: Record<EmbryoLayer, string> = {
  "L'Ectoderme": "bg-[#5A9C51]/10 text-[#5A9C51] border-[#5A9C51]/40",
  "L'Endoderme": "bg-[#4171B5]/10 text-[#4171B5] border-[#4171B5]/40",
  "Le Mésoderme": "bg-[#F27D33]/10 text-[#F27D33] border-[#F27D33]/40",
  "L'Oeil": "bg-[#F2B729]/10 text-[#F2B729] border-[#F2B729]/40",
  "Global": "bg-[#EAE4D3] text-slate-700 border-slate-200",
  "N/A": "bg-transparent text-slate-400 border-transparent",
};

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'iPad';
  if (/iPhone/i.test(ua)) return 'iPhone';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'Mac';
  if (/Android/i.test(ua)) {
    return /Mobile|mini/i.test(ua) ? 'Android (Téléphone)' : 'Android (Tablette)';
  }
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Navigateur';
};

const getDeviceId = () => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    const rawId = uuidv4();
    const os = getDeviceType();
    // Maintain old IDs but new ones will look like Mac-abcdef-1234
    deviceId = `${os}-${rawId}`;
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

const ADMIN_EMAILS = [
  'guillaumephilippe1968@gmail.com',
  'marc@damoiseaux.be'
];
function App() {
  const { t, i18n } = useTranslation();

  const [session, setSession] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);


  const handleLogout = async () => {
    localStorage.removeItem('DEV_BYPASS_AUTH');
    localStorage.removeItem('VIP_BYPASS');

    // Remove device from 3-device limit list
    if (session?.user?.id && !session.user.id.includes('bypass')) {
      try {
        const localDeviceId = getDeviceId();
        const { data } = await supabase
          .from('profiles')
          .select('device_id')
          .eq('id', session.user.id)
          .single();
        
        if (data?.device_id) {
          const deviceIds = data.device_id.split(',').filter(Boolean);
          const newDeviceIds = deviceIds.filter((id: string) => 
            id !== localDeviceId &&
            !(localDeviceId.includes('-') && id === localDeviceId.substring(localDeviceId.indexOf('-') + 1)) &&
            !(id.includes('-') && localDeviceId === id.substring(id.indexOf('-') + 1))
          );
          
          if (newDeviceIds.length !== deviceIds.length) {
            await supabase
              .from('profiles')
              .update({ device_id: newDeviceIds.join(',') })
              .eq('id', session.user.id);
          }
        }
      } catch (err) {
        console.error("Error removing device on logout:", err);
      }
    }

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
    setSession(null);
    setIsAdmin(false);
    setIsPremium(false);
    window.location.reload();
  };

  useEffect(() => {
    let mounted = true;

    // AUTO-ENABLE DEV BYPASS FOR LOCAL NETWORK TESTING (e.g. iPhone)
    if (isLocalNetwork()) {
      localStorage.setItem('DEV_BYPASS_AUTH', 'true');
    }



    // DEV BYPASS LOGIC (Only in local development)
    if ((import.meta.env.DEV || isLocalNetwork()) && localStorage.getItem('DEV_BYPASS_AUTH') === 'true') {
      setSession({ user: { id: 'dev-bypass', email: 'guillaumephilippe1968@gmail.com' } });
      setIsAdmin(true);
      setIsPremium(true);
      setIsInitializing(false);
      return;
    }

    const checkProfileDevice = async (currentSession: any, isExplicitSignIn: boolean = false) => {


      // DEV BYPASS: If local dev AND bypass is enabled, don't check device ID
      if ((import.meta.env.DEV || isLocalNetwork()) && localStorage.getItem('DEV_BYPASS_AUTH') === 'true') {
        if (mounted) {
          setSession(currentSession);
          setIsInitializing(false);
        }
        return;
      }

      if (!currentSession?.user) {
        if (mounted) {
          setSession(null);
          setIsInitializing(false);
        }
        return;
      }

      const localDeviceId = getDeviceId();
      let retries = 5;
      let profile = null;

      // Retry fetching profile in case the Supabase trigger takes a moment
      while (retries > 0 && !profile) {
        const { data, error } = await supabase
          .from('profiles')
          .select('device_id, is_active, first_name, last_name, profession, email, is_premium')
          .eq('id', currentSession.user.id)
          .single();

        if (data) {
          profile = data;
        } else {
          if (error && error.code !== 'PGRST116') { // PGRST116 is not found
            console.warn("Retrying profile fetch due to error:", error.message);
          }
          retries--;
          await new Promise(res => setTimeout(res, 500));
        }
      }

      if (profile) {
        if (!profile.is_active) {
          alert(t('auth.account_inactive', 'Votre compte est désactivé. Veuillez contacter le support.'));
          await supabase.auth.signOut();
          if (mounted) {
            setSession(null);
            setIsInitializing(false);
          }
          return;
        }

        if (profile.is_premium) {
          setIsPremium(true);
        } else {
          setIsPremium(false);
        }

        if (!profile.first_name || !profile.last_name || !profile.profession) {
          // Attempt to rescue names from localStorage if they got lost during OTP auth
          const pendingFirstName = localStorage.getItem('pending_first_name') || 'Élève';
          const pendingLastName = localStorage.getItem('pending_last_name') || 'Test';
          const pendingProfession = localStorage.getItem('pending_profession') || 'Non renseignée';

          console.log("Profile missing details. Rescuing with:", { pendingFirstName, pendingLastName, pendingProfession });

          const { error: updateError } = await supabase.from('profiles').update({
            first_name: pendingFirstName,
            last_name: pendingLastName,
            profession: pendingProfession
          }).eq('id', currentSession.user.id);

          if (!updateError) {
            // Update local profile object so the rest of the app sees the rescued data
            profile.first_name = pendingFirstName;
            profile.last_name = pendingLastName;
            profile.profession = pendingProfession;
          } else {
             console.error("Failed to rescue profile details:", updateError);
          }

          // Clean up to prevent stale data for other users on same device
          localStorage.removeItem('pending_first_name');
          localStorage.removeItem('pending_last_name');
          localStorage.removeItem('pending_profession');
          localStorage.removeItem('pending_email');
        }

        if (!profile.device_id) {
          // Bind new device
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ device_id: localDeviceId })
            .eq('id', currentSession.user.id);

          if (updateError) {
            console.error("Failed to bind device:", updateError);
          }
        } else {
          // Si le profil a déjà un ou plusieurs appareils enregistrés
          const dbDevicesStr = profile.device_id;
          const deviceIds = dbDevicesStr.split(',').filter(Boolean);
          
          // La base de données peut encore contenir plusieurs IDs si l'utilisateur y était avant la mise à jour
          // On vérifie si l'appareil actuel est parmi eux
          const isMatch = deviceIds.some((dbDevice: string) => 
            dbDevice === localDeviceId ||
            (localDeviceId.includes('-') && dbDevice === localDeviceId.substring(localDeviceId.indexOf('-') + 1)) ||
            (dbDevice.includes('-') && localDeviceId === dbDevice.substring(dbDevice.indexOf('-') + 1))
          );

          const isAdminUser =
            (currentSession?.user?.email && ADMIN_EMAILS.includes(currentSession.user.email.toLowerCase())) ||
            (profile.email && ADMIN_EMAILS.includes(profile.email.toLowerCase()));

          const MAX_DEVICES = isAdminUser ? 3 : 1;

          if (!isMatch) {
            if (deviceIds.length < MAX_DEVICES) {
              // Il reste de la place, on ajoute l'appareil
              deviceIds.push(localDeviceId);
              await supabase.from('profiles').update({ device_id: deviceIds.join(',') }).eq('id', currentSession.user.id);
              console.log(`Device added. Total: ${deviceIds.length}/${MAX_DEVICES}`);
            } else if (isExplicitSignIn) {
              // Plus de place, mais c'est une connexion manuelle => on vole la session (Émigration)
              if (isAdminUser) {
                // Pour l'admin plein à craquer (3 dev), on retire le plus vieux et on met le nouveau
                deviceIds.shift();
                deviceIds.push(localDeviceId);
                await supabase.from('profiles').update({ device_id: deviceIds.join(',') }).eq('id', currentSession.user.id);
              } else {
                // Pour un élève (1 dev max), le nouvel appareil écrase tout
                await supabase.from('profiles').update({ device_id: localDeviceId }).eq('id', currentSession.user.id);
              }
              console.log("Émigration réussie sur le nouvel appareil.");
            } else {
              // Plus de place, et ce n'est PAS une nouvelle connexion (vieil appareil ouvert en arrière-plan) => on déconnecte
              alert("Vous avez été déconnecté car votre compte est utilisé sur un autre appareil. Veuillez vous reconnecter.");
              await supabase.auth.signOut();
              if (mounted) {
                setSession(null);
                setIsInitializing(false);
              }
              return; // Fin du processus de login
            }
          } else if (deviceIds.length > MAX_DEVICES) {
            // Un appareil valide se connecte, mais la base contient trop de vieux appareils (changement de politique de 2 à 1)
            // On nettoie la base pour ne garder que le sien (ou les derniers pour l'admin)
            if (!isAdminUser) {
              await supabase.from('profiles').update({ device_id: localDeviceId }).eq('id', currentSession.user.id);
            }
          }
        }

        // Extra check for admin using profile email (fixes Apple Hide My Email if Apple email is linked to real email in profile)
        if (profile.email && ADMIN_EMAILS.includes(profile.email.toLowerCase())) {
          setIsAdmin(true);
        }
      } else {
        // Trigger failed or profile not found
        console.error("Profile not found after retries. Proceeding without device check.");
      }

      if (mounted) {
        setSession(currentSession);
        setIsInitializing(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      checkProfileDevice(session, false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'SIGNED_OUT') {
        localStorage.removeItem('DEV_BYPASS_AUTH');

        if (mounted) setSession(null);
        setIsAdmin(false);
        setIsPremium(false);
      } else {
        if (import.meta.env.DEV && localStorage.getItem('DEV_BYPASS_AUTH') === 'true') {
          setIsAdmin(true);
          setIsPremium(true);
        } else if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        if (_event === 'SIGNED_IN') {
          if (mounted) setIsInitializing(true);
          checkProfileDevice(session, true);
        }
      }
    });

    let profileSubscription: any = null;

    if (session?.user?.id) {
       profileSubscription = supabase
        .channel('public:profiles')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${session.user.id}`
          },
          async (payload) => {
             if (payload.new.is_premium !== undefined) {
               setIsPremium(payload.new.is_premium);
             }

             const newDeviceIdsStr = payload.new.device_id || "";
             const deviceIds = newDeviceIdsStr.split(',').filter(Boolean);
             const localDeviceId = getDeviceId();
             
             // Check if our local device is STILL in the authorized list
             const isStillAuthorized = deviceIds.some((dbDevice: string) => 
                  dbDevice === localDeviceId ||
                  (localDeviceId.includes('-') && dbDevice === localDeviceId.substring(localDeviceId.indexOf('-') + 1)) ||
                  (dbDevice.includes('-') && localDeviceId === dbDevice.substring(dbDevice.indexOf('-') + 1))
             );

             if (!isStillAuthorized && !isAdmin) {
                 alert(t('auth.device_removed', "Votre appareil a été déconnecté car votre session a été révoquée."));
                 await supabase.auth.signOut();
                 if (mounted) {
                     setSession(null);
                 }
             }
          }
        )
        .subscribe();
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (profileSubscription) {
          supabase.removeChannel(profileSubscription);
      }
    };
  }, [t, isAdmin, session?.user?.id]);

  const detailedStages = i18n.language.startsWith('en')
    ? detailedStagesEn
    : i18n.language.startsWith('es')
      ? detailedStagesEs
      : i18n.language.startsWith('it')
        ? detailedStagesIt
        : i18n.language.startsWith('de')
          ? detailedStagesDe
          : i18n.language.startsWith('zh')
            ? detailedStagesZh
            : i18n.language.startsWith('ja')
              ? detailedStagesJa
              : detailedStagesFr;

  const [activeStageId, setActiveStageId] = useState<string>(detailedStages[0].id);
  const [playingVideoIdx, setPlayingVideoIdx] = useState<number | null>(null);

  type View = 'home' | 'timeline' | 'embryo-ai' | 'video-library' | 'video-player' | 'admin' | 'admin-users' | 'admin-prompts';
  const [currentView, setCurrentView] = useState<View>('home');
  const [activeVideo, setActiveVideo] = useState<VideoCourse | null>(null);
  const [optimisticView, setOptimisticView] = useState<View | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  const handleViewChange = (view: View) => {
    if (currentView === view) return;
    setOptimisticView(view);
    startTransition(() => {
      setCurrentView(view);
    });
  };

  const activeNav = optimisticView || currentView;

  const activeStage = detailedStages.find(s => s.id === activeStageId) as StageDataV2 || detailedStages[0];
  // Use original index for timeline visual order
  const getOriginalIndex = (id: string) => detailedStages.findIndex(s => s.id === id);
  const activeIndex = getOriginalIndex(activeStageId);

  if (isInitializing) {
    return <div className="h-[100dvh] w-full flex items-center justify-center bg-[#FAF6ED]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div></div>;
  }

  if (!session) {
    return <AuthScreen />;
  }

  const forcePaywall = new URLSearchParams(window.location.search).get('paywall') === 'true';

  return (
    <FullscreenProvider>
      <OrientationLock disabled={activeNav === 'video-player'} />
      <SuccessOverlay />

      {forcePaywall && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => window.location.href = window.location.pathname}></div>
          <div className="relative w-full max-w-md z-10 animate-fade-in-up">
            <button 
              onClick={() => window.location.href = window.location.pathname} 
              className="absolute -top-4 -right-2 sm:-top-5 sm:-right-5 z-20 w-12 h-12 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-xl border border-slate-100 touch-manipulation cursor-pointer select-none"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            <div className="overflow-hidden rounded-3xl shadow-2xl bg-white">
              <Paywall />
            </div>
          </div>
        </div>
      )}

      <div className={cn("flex flex-col items-center h-[100dvh] w-full max-w-full relative bg-[#FAF6ED] text-slate-800 overflow-hidden", isPending && "transition-all duration-300")}>
        {/* Cinematic Background Gradients (Global) */}
      {activeNav !== 'video-player' && (
        <>
          <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#FAF6ED_0%,_#FAF6ED_60%)] pointer-events-none z-0"></div>
          <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#FAF6ED]/50 to-[#FAF6ED] pointer-events-none z-0"></div>
        </>
      )}

      {/* New Fixed Desktop Navigation */}
      <DesktopMenu currentView={currentView} setCurrentView={setCurrentView} isAdmin={isAdmin} onLogout={handleLogout} />

      {/* iOS-Style Bottom Tab Bar for Mobile - FIXED OUTSIDE SCROLL */}
      {(
        <nav
          className={cn(
            "fixed bottom-0 z-50 w-full bg-[#FAF6ED]/95 backdrop-blur-xl border-t border-slate-200 lg:hidden shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.1)] overscroll-none grid",
            window.self !== window.top ? "pb-[40px]" : "pb-[env(safe-area-inset-bottom,16px)]",
            isAdmin ? "grid-cols-7" : "grid-cols-6"
          )}
        >
          <button
            onClick={() => handleViewChange('home')}
            onTouchStart={(e) => { e.preventDefault(); handleViewChange('home'); }}
            className={cn(
              "flex flex-col items-center justify-start pt-3 pb-2 gap-1 transition-colors cursor-pointer touch-manipulation md:active:scale-95 group overflow-hidden w-full",
              activeNav === 'home' ? "text-slate-800" : "text-slate-600 hover:text-slate-800"
            )}
          >
            <div className={cn("h-[24px] flex items-center justify-center transition-transform duration-200", activeNav === 'home' ? "scale-105" : "group-hover:scale-105")}>
              <HomeIcon size={24} />
            </div>
            <span className={cn("mt-auto text-[10px] tracking-wide transition-all whitespace-nowrap truncate w-full text-center px-0.5", activeNav === 'home' ? "font-medium" : "font-normal")}>{t('nav.home')}</span>
          </button>

          <button
            onClick={() => handleViewChange('timeline')}
            onTouchStart={(e) => { e.preventDefault(); handleViewChange('timeline'); }}
            className={cn(
              "flex flex-col items-center justify-start pt-3 pb-2 gap-1 transition-colors cursor-pointer touch-manipulation md:active:scale-95 group overflow-hidden w-full",
              activeNav === 'timeline' ? "text-slate-800" : "text-slate-600 hover:text-slate-800"
            )}
          >
            <div className={cn("h-[24px] flex items-center justify-center transition-transform duration-200", activeNav === 'timeline' ? "scale-105" : "group-hover:scale-105")}>
              <Clock size={24} />
            </div>
            <span className={cn("mt-auto text-[10px] tracking-wide transition-all whitespace-nowrap truncate w-full text-center px-0.5", activeNav === 'timeline' ? "font-medium" : "font-normal")}>{t('nav.timeline')}</span>
          </button>

          <button
            onClick={() => handleViewChange('video-library')}
            onTouchStart={(e) => { e.preventDefault(); handleViewChange('video-library'); }}
            className={cn(
              "flex flex-col items-center justify-start pt-3 pb-2 gap-1 transition-colors cursor-pointer touch-manipulation md:active:scale-95 group overflow-hidden w-full",
              activeNav === 'video-library' || activeNav === 'video-player' ? "text-slate-800" : "text-slate-600 hover:text-slate-800"
            )}
          >
            <div className={cn("h-[24px] flex items-center justify-center transition-transform duration-200", activeNav === 'video-library' || activeNav === 'video-player' ? "scale-105" : "group-hover:scale-105")}>
              <Video size={24} />
            </div>
            <span className={cn("mt-auto text-[10px] tracking-wide transition-all whitespace-nowrap truncate w-full text-center px-0.5", activeNav === 'video-library' || activeNav === 'video-player' ? "font-medium" : "font-normal")}>{t('nav.videos')}</span>
          </button>

          <button
            onClick={() => handleViewChange('embryo-ai')}
            onTouchStart={(e) => { e.preventDefault(); handleViewChange('embryo-ai'); }}
            className={cn(
              "flex flex-col items-center justify-start pt-3 pb-2 gap-1 transition-colors cursor-pointer touch-manipulation md:active:scale-95 group overflow-hidden w-full",
              activeNav === 'embryo-ai' ? "text-slate-800" : "text-slate-600 hover:text-slate-800"
            )}
          >
            <div className={cn("h-[24px] flex items-center justify-center transition-transform duration-200", activeNav === 'embryo-ai' ? "scale-105" : "group-hover:scale-105")}>
              <Brain size={24} />
            </div>
            <span className={cn("mt-auto text-[10px] tracking-wide transition-all whitespace-nowrap truncate w-full text-center px-0.5", activeNav === 'embryo-ai' ? "font-medium" : "font-normal")}>{t('nav.ai_assistant')}</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => handleViewChange('admin')}
              onTouchStart={(e) => { e.preventDefault(); handleViewChange('admin'); }}
              className={cn(
                "flex flex-col items-center justify-start pt-3 pb-2 gap-1 transition-colors cursor-pointer touch-manipulation md:active:scale-95 group overflow-hidden w-full",
                activeNav === 'admin' ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <div className={cn("h-[24px] flex items-center justify-center transition-transform duration-200", activeNav === 'admin' ? "scale-105" : "group-hover:scale-105")}>
                <Shield size={24} />
              </div>
              <span className={cn("mt-auto text-[10px] tracking-wide transition-all whitespace-nowrap truncate w-full text-center px-0.5", activeNav === 'admin' ? "font-medium" : "font-normal")}>Admin</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            onTouchStart={(e) => { e.preventDefault(); handleLogout(); }}
            className="flex flex-col items-center justify-start pt-3 pb-2 gap-1 transition-colors cursor-pointer touch-manipulation md:active:scale-95 group overflow-hidden text-slate-600 hover:text-red-500 w-full"
          >
            <div className="h-[24px] flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <LogOut size={24} className="text-red-400 group-hover:text-red-500" />
            </div>
            <span className="mt-auto text-[10px] tracking-wide transition-all font-normal whitespace-nowrap truncate w-full text-center px-0.5 text-red-500">Quitter</span>
          </button>

          {/* Mobile bottom nav Language Switcher */}
          <LanguageSwitcher variant="bottom-nav" />
        </nav>
      )}

      <div className={cn(
        "flex-1 w-full min-h-0 flex flex-col items-center overflow-x-hidden relative z-10 overscroll-none no-scrollbar md:mt-[60px]",
        currentView === 'video-player' || currentView === 'embryo-ai' || currentView === 'admin' || currentView === 'home' ? "overflow-y-hidden" : "overflow-y-auto"
      )} id="main-scroll-canvas" style={{ WebkitOverflowScrolling: 'touch' }}>

        {/* Mobile Top App Bar (Supprimé) */}
        {/* Desktop Top Navigation Bar (Supprimé) */}
        {/*
        <nav className="sticky top-0 z-50 w-full h-[60px] bg-[#FAF6ED] border-b border-slate-200 hidden md:flex items-center justify-center gap-4 px-6 shadow-sm">
          <button
            onClick={() => setCurrentView('home')}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide transition-all",
              currentView === 'home'
                ? "bg-[#F27D33] text-white shadow-md"
                : "bg-transparent text-slate-600 hover:bg-[#EAE4D3] hover:text-slate-900"
            )}
          >
            {t('nav.home', 'Accueil')}
          </button>

          <button
            onClick={() => setCurrentView('timeline')}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide transition-all",
              currentView === 'timeline'
                ? "bg-[#F27D33] text-white shadow-md"
                : "bg-transparent text-slate-600 hover:bg-[#EAE4D3] hover:text-slate-900"
            )}
          >
            {t('nav.timeline')}
          </button>

          <button
            onClick={() => setCurrentView('video-library')}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide transition-all",
              currentView === 'video-library'
                ? "bg-[#F27D33] text-white shadow-md"
                : "bg-transparent text-slate-600 hover:bg-[#EAE4D3] hover:text-slate-900"
            )}
          >
            {t('nav.videos')}
          </button>

          <button
            onClick={() => setCurrentView('embryo-ai')}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-xl font-bebas text-lg tracking-wide transition-all",
              currentView === 'embryo-ai'
                ? "bg-[#F27D33] text-white shadow-md"
                : "bg-transparent text-slate-600 hover:bg-[#EAE4D3] hover:text-slate-900"
            )}
          >
            {t('nav.ai_assistant', 'Assistant IA')}
          </button>

          <div className="flex-1"></div>

          <LanguageSwitcher variant="desktop-nav" />
        </nav>
        */}

        <div className={cn(
          "flex flex-col items-center w-full flex-1 min-h-0",
          currentView === 'home' || currentView === 'video-player' || currentView === 'embryo-ai' || currentView === 'admin'
            ? "p-0"
            : "px-2 sm:px-6 lg:px-8 w-full pb-[90px] md:pb-8",
          currentView === 'home' || currentView === 'admin' ? "overflow-hidden h-[100dvh] md:h-full" : "",
          currentView === 'video-player' ? "pt-0 pb-[90px] md:pb-2 overflow-hidden h-[100dvh] md:h-full" : "pt-0"
        )}>

          {/* Desktop Top Navigation Bar */}

          {currentView === 'admin' && isAdmin && (
            <AdminDashboard />
          )}

          {currentView === 'home' && (
            <div className="w-full flex-1 flex items-stretch justify-center">
              <Home />
            </div>
          )}

          {currentView === 'embryo-ai' && (
            <div className="w-full relative h-[calc(100vh-69px)] flex flex-col items-center md:items-stretch md:justify-start py-0 px-0 sm:px-4 md:px-0 pt-0">
              {(!isPremium && !isAdmin) ? (
                <Paywall />
              ) : (
                <ChatBot
                  isAdmin={isAdmin}
                  onNavigateToVideo={(video) => {
                    setActiveVideo(video);
                    setCurrentView('video-player');
                  }}
                />
              )}
            </div>
          )}



          {currentView === 'video-library' && (
            <div className="w-full flex flex-col items-center animate-fade-in relative z-10 mx-auto">
              <div className="w-full relative">
                <VideoLibraryList
                  hasFullAccess={isPremium || isAdmin}
                  onSelectVideo={(video) => {
                    setActiveVideo(video);
                    setCurrentView('video-player');
                  }}
                  onLockedVideoClick={() => setShowPaywallModal(true)}
                />
                
                {/* Paywall Overlay */}
                {showPaywallModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                        onClick={() => setShowPaywallModal(false)}
                    ></div>
                    <div className="relative w-full max-w-md z-10 animate-fade-in-up">
                      <button 
                        onClick={() => setShowPaywallModal(false)} 
                        className="absolute -top-4 -right-2 sm:-top-5 sm:-right-5 z-20 w-12 h-12 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-xl border border-slate-100 transition-colors touch-manipulation cursor-pointer select-none"
                      >
                        <X size={20} strokeWidth={2.5} />
                      </button>
                      <div className="overflow-hidden rounded-3xl shadow-2xl">
                        <Paywall />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'video-player' && activeVideo && (
            <div className="w-full animate-fade-in h-full">
              <VideoPlayerPage
                course={activeVideo}
                onSelectVideo={setActiveVideo}
                hasFullAccess={isPremium || isAdmin}
                onLockedVideoClick={() => setShowPaywallModal(true)}
              />
            </div>
          )}

          {currentView === 'timeline' && (
            <div className="w-full max-w-5xl flex flex-col animate-fade-in relative z-10 mx-auto">

              {/* STICKY HEADER CONTAINER FOR TIMELINE */}
              <div className="sticky top-0 z-40 w-full bg-[#FAF6ED] pt-4 flex flex-col items-center pb-4 border-b border-transparent md:border-slate-100">
                {/* TIMELINE BADGE */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-1 relative w-full text-center pb-1 md:pb-0">
                  <div className="inline-flex items-center justify-center px-4 sm:px-8 md:px-8 py-2 sm:py-3 md:py-2 rounded-full mb-0 whitespace-nowrap max-w-[95vw] lg:max-w-full overflow-hidden">
                    <span className="font-bebas font-normal text-xl min-[380px]:text-2xl sm:text-3xl md:text-2xl lg:text-xl uppercase tracking-widest truncate leading-none md:leading-[1.1] pt-1 md:pt-0 drop-shadow-sm text-slate-800">
                      {t('app.developmental_movement')}
                    </span>
                  </div>
                </div>

                {/* MOBILE TIMELINE NAVIGATION (Horizontal chip selection) */}
                <div className="-mx-2 w-[calc(100%+16px)] sm:-mx-6 sm:w-[calc(100%+48px)] lg:hidden overflow-x-auto no-scrollbar pb-2 pt-2 mt-1 border-t border-slate-100 snap-x">
                  <div className="flex flex-nowrap items-stretch gap-2 w-max after:content-[''] after:w-2 before:content-[''] before:w-2 sm:before:w-6 sm:after:w-6">
                    {/* The padding pseudo-elements provide the start/end spacing inside the scrolling container instead of relying on parent margins, ensuring chips perfectly touch the screen edges on scroll */}
                    {detailedStages.map((stage) => {
                      const isActive = stage.id === activeStageId;
                      const idx = getOriginalIndex(stage.id);
                      const isPast = idx < activeIndex;

                      return (
                        <button
                          key={stage.id}
                          onClick={() => setActiveStageId(stage.id)}
                          onTouchStart={(e) => { e.preventDefault(); setActiveStageId(stage.id); }}
                          className={cn(
                            "relative flex flex-col items-center justify-center py-2.5 px-2 md:px-3 rounded-xl min-w-[110px] sm:min-w-[130px] md:min-w-[120px] shrink-0 snap-center transition-all duration-300",
                            isActive
                              ? "bg-slate-900 text-white scale-100"
                              : isPast
                                ? "bg-white text-slate-500 opacity-80"
                                : "bg-white text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {isActive && (
                            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 rounded-full animate-in zoom-in"></div>
                          )}
                          <span className={cn(
                            "font-bebas text-lg sm:text-xl md:text-base tracking-wider leading-none mb-1 whitespace-nowrap",
                            isActive ? "text-white" : "text-slate-800"
                          )}>
                            {stage.dayLabel}
                          </span>
                          <span className={cn(
                            "text-[10px] uppercase font-bold truncate w-full px-2 opacity-80 text-center",
                            isActive ? "text-slate-300" : "text-slate-500"
                          )}>
                            {stage.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-12 lg:gap-10">

                {/* TIMELINE NAVIGATION (Vertical Left Column - Desktop Only) */}
                <div className="hidden lg:block lg:col-span-4 relative max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar border-b-0 border-slate-200 mb-0 sticky top-[90px] z-10 bg-transparent p-0 self-start">
                  {/* Removed vertical lateral bar as requested */}
                  <div className="space-y-6 relative pb-10 mt-6">
                    {detailedStages.map((stage) => {
                      const isActive = stage.id === activeStageId;
                      const idx = getOriginalIndex(stage.id);
                      const isPast = idx < activeIndex;

                      return (
                        <button
                          key={stage.id}
                          onClick={() => setActiveStageId(stage.id)}
                          className={cn(
                            "w-full text-left flex items-start group relative transition-all duration-300",
                            isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                          )}
                        >
                          {/* Timeline Dot */}
                          <div className={cn(
                            "relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 flex-shrink-0 shadow-sm bg-white",
                            isActive ? "border-primary glow-blue scale-110" :
                              isPast ? "border-slate-300" : "border-slate-200"
                          )}>
                            {iconMap[stage.id] || <CircleDot size={20} className={isActive ? "text-primary" : "text-slate-400"} />}
                          </div>

                          {/* Content */}
                          <div className={cn(
                            "ml-6 pt-1 transition-all duration-300 flex-1",
                            isActive ? "translate-x-2" : ""
                          )}>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock size={14} className={isActive ? "text-primary" : "text-slate-400"} />
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {stage.dayLabel}
                              </span>
                            </div>
                            <h3 className={cn(
                              "text-sm lg:text-base transition-colors leading-tight mb-1 font-bebas tracking-wide",
                              isActive ? "text-slate-950 text-base lg:text-lg" : "text-slate-700"
                            )}>
                              {stage.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                              {stage.period}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STAGE DETAILS (Right Column) */}
                <div className="lg:col-span-8">
                  {activeStage ? (
                    <div className="bg-[#FAF6ED] rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden animate-fade-in flex flex-col h-full">
                      {/* Background Color Hint (Subtle for light theme) */}
                      <div className={cn(
                        "absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.04] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 transition-colors duration-1000 pointer-events-none",
                        activeStage.themeColor.replace('900', '500') // Use a lighter version of the color for the hint
                      )}></div>

                      <div className="relative z-10 p-8 md:p-14 flex-1">
                        <div className="flex flex-row flex-nowrap items-center w-full overflow-x-auto no-scrollbar gap-2 mb-4 md:mb-6">
                          <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest bg-[#EAE4D3]/80 px-2.5 py-1 rounded-md whitespace-nowrap">
                            {activeStage.dayLabel}
                          </span>
                          <span className="text-slate-300 flex-shrink-0">•</span>
                          <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest whitespace-nowrap">
                            {activeStage.period}
                          </span>
                        </div>

                        <h2 className="text-lg md:text-xl lg:text-xl xl:text-2xl font-anton text-dark mb-2 md:mb-4 leading-tight tracking-wide uppercase break-words hyphens-auto">
                          {activeStage.title}
                        </h2>

                        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl mb-6 md:mb-10 font-medium border-l-4 border-slate-300 pl-4 md:pl-6">
                          {activeStage.generalDescription}
                        </p>

                        <div className="space-y-6 md:space-y-8">
                          <h3 className="flex items-center text-base md:text-lg text-dark font-bebas tracking-wide mb-6 md:mb-8 uppercase">
                            <Heart className="mr-3 text-primary animate-pulse-slow shrink-0" size={20} />
                            {t('app.timeline_processes')}
                          </h3>

                          <div className="grid gap-5">
                            {activeStage.events
                              .map((event, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => {
                                      if ((event as any).videoUrl) setPlayingVideoIdx(playingVideoIdx === idx ? null : idx);
                                  }}
                                  className={cn(
                                      "group relative flex flex-col sm:flex-row items-start sm:items-center bg-white rounded-[1.2rem] p-4 border transition-all duration-300",
                                      (event as any).videoUrl ? "cursor-pointer border-slate-300 hover:border-slate-400 shadow-sm hover:shadow-md" : "border-slate-200 hover:bg-slate-50 hover:shadow-md hover:border-slate-300"
                                  )}
                                >
                                  {/* Order Indicator (if exists) */}
                                  {event.order && (
                                    <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-[#FAF6ED] border-2 border-slate-200 shadow-sm flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-primary group-hover:border-primary transition-colors z-10 font-anton">
                                      {event.order}
                                    </div>
                                  )}

                                  <div className="w-full sm:w-40 lg:w-48 mb-4 sm:mb-0 sm:pr-4 flex-shrink-0">
                                    {event.layer !== 'N/A' && (
                                    <span className={cn(
                                      "inline-flex items-center justify-center px-4 py-1.5 rounded-[1.2rem] text-xs font-bold border uppercase tracking-wider whitespace-nowrap",
                                      layerColors[event.layer]
                                    )}>
                                      {(() => {
                                        const l = event.layer;
                                        const lang = i18n.language || 'fr';
                                        const map: Record<string, Record<string, string>> = {
                                          "L'Ectoderme": { en: "Ectoderm", es: "Ectodermo", de: "Ektoderm", it: "Ectoderma", ja: "外胚葉", zh: "外胚层" },
                                          "Le Mésoderme": { en: "Mesoderm", es: "Mesodermo", de: "Mesoderm", it: "Mesoderma", ja: "中胚葉", zh: "中胚层" },
                                          "L'Endoderme": { en: "Endoderm", es: "Endodermo", de: "Endoderm", it: "Endoderma", ja: "内胚葉", zh: "内胚层" },
                                          "L'Oeil": { en: "Eye", es: "Ojo", de: "Auge", it: "Occhio", ja: "目", zh: "眼" },
                                          "Général": { en: "General", es: "General", de: "Allgemein", it: "Generale", ja: "一般", zh: "概括" },
                                        };
                                        return map[l]?.[lang] || l;
                                      })()}
                                    </span>
                                    )}
                                  </div>

                                  {/* Content */}
                                  <div className="w-full flex-1 flex flex-col min-w-0">
                                    <div className="flex items-center justify-between w-full mb-1">
                                        <h4 className="text-dark font-bold text-lg md:text-xl font-sans">
                                          {event.movement}
                                        </h4>
                                        {(event as any).videoUrl && (
                                            <div className="text-xs bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-1.5 font-bold tracking-widest uppercase shadow-sm">
                                                <Video size={14} strokeWidth={2.5} /> 
                                                {playingVideoIdx === idx ? 'Fermer' : 'Vidéo'}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                                      {event.description}
                                    </p>

                                    {(event as any).videoUrl && playingVideoIdx === idx && (
                                      <div className="w-full mt-6 rounded-2xl overflow-hidden bg-black aspect-video relative shadow-inner">
                                        <iframe
                                          src={(event as any).videoUrl}
                                          className="absolute inset-0 w-full h-full border-0"
                                          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                          allowFullScreen
                                        ></iframe>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>

                          {/* MERMAID CHART INSERTION */}
                          {activeStage.mermaidCode && (
                            <div className="mt-16 pt-10 border-t border-slate-200 animate-fade-in">
                              <h3 className="flex items-center text-2xl text-dark font-bebas tracking-wide mb-8 uppercase">
                                <GitCommitHorizontal className="mr-3 text-primary" size={28} />
                                {t('app.timeline_cine_dynamic')}
                              </h3>
                              <div className="bg-white p-2 sm:p-8 rounded-3xl border border-slate-200 shadow-inner overflow-x-auto w-full">
                                <div className="min-w-fit w-full flex justify-center mx-auto [&>svg]:max-w-none sm:[&>svg]:max-w-full [&>svg]:h-auto flex-col items-center gap-8">
                                  {Array.isArray(activeStage.mermaidCode) ? (
                                    activeStage.mermaidCode.map((code, idx) => (
                                      <Mermaid key={idx} chart={code} />
                                    ))
                                  ) : (
                                    <Mermaid chart={activeStage.mermaidCode} />
                                  )}
                                </div>
                              </div>
                            </div>


                          )}

                          {/* PRACTICAL INTEGRATION SECTION */}
                          {activeStage.practicalIntegration && (
                            <div className="mt-16 pt-10 border-t border-slate-200 animate-fade-in">
                              <h3 className="flex items-center text-2xl text-dark font-bebas tracking-wide mb-8 uppercase">
                                <Sparkles className="mr-3 text-primary" size={28} />
                                {t('app.timeline_practical')}
                              </h3>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Fulcrums & Palpation */}
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                                  <div>
                                    <h4 className="flex items-center text-slate-800 font-semibold text-base mb-3 uppercase tracking-wide">
                                      <Eye size={20} className="mr-2 text-primary" /> {t('app.timeline_fulcrums')}
                                    </h4>
                                    <p className="text-slate-600 text-base leading-relaxed font-medium">{activeStage.practicalIntegration.fulcrums}</p>
                                  </div>
                                  <div>
                                    <h4 className="flex items-center text-slate-800 font-semibold text-base mb-3 uppercase tracking-wide">
                                      <Stethoscope size={20} className="mr-2 text-primary" />
                                      {t('app.timeline_palpation')}
                                    </h4>
                                    <p className="text-slate-600 text-base leading-relaxed font-medium">{activeStage.practicalIntegration.generalPalpation}</p>
                                  </div>
                                  <div>
                                    <h4 className="flex items-center text-slate-800 font-semibold text-base mb-3 uppercase tracking-wide">
                                      <HeartHandshake size={20} className="mr-2 text-primary" />
                                      {t('app.timeline_therapist_posture')}
                                    </h4>
                                    <p className="text-slate-600 text-base leading-relaxed font-medium">{activeStage.practicalIntegration.therapistPosture}</p>
                                  </div>
                                </div>

                                <div className="space-y-6">
                                  {/* Psychosomatic */}
                                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                    <h4 className="flex items-center text-slate-800 font-semibold text-base mb-3 uppercase tracking-wide">
                                      <Brain size={20} className="mr-2 text-primary" /> {t('app.timeline_psychosomatic')}
                                    </h4>
                                    <p className="text-slate-600 text-base leading-relaxed font-medium">{activeStage.practicalIntegration.psychosomatic}</p>
                                  </div>

                                  {/* Layer Perceptions (if any) */}
                                  {activeStage.practicalIntegration.layerPerceptions && activeStage.practicalIntegration.layerPerceptions.length > 0 && (
                                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                      <h4 className="text-slate-800 font-semibold text-base mb-5 uppercase tracking-wide">{t('app.timeline_layer_perceptions')}</h4>
                                      <div className="space-y-5">
                                        {activeStage.practicalIntegration.layerPerceptions.map((lp, idx) => (
                                          <div key={idx} className="flex flex-col">
                                            <span className={cn("text-xs font-bold px-3 py-1 rounded-lg w-max mb-2 uppercase tracking-wide border", layerColors[lp.layer])}>{lp.layer}</span>
                                            <p className="text-slate-600 text-sm font-medium leading-relaxed">{lp.perception}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#FAF6ED] rounded-3xl border border-slate-200 shadow-sm p-16 flex items-center justify-center h-full">
                      <p className="text-slate-400 font-medium text-lg">{t('app.timeline_no_data')}</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Added spacer to clear tab bar on mobile/tablet */}
              <div className="h-24 lg:h-0 w-full shrink-0"></div>
            </div>
          )}
        </div>
      </div>
      </div>
    </FullscreenProvider>
  );
}

export default App;
