import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserX, UserCheck, Search, KeyRound, MonitorOff, ChevronRight, X, Clock, Gift, Crown, History, Trash2, Shield, BarChart2, Users, ArrowUpRight, Globe, TrendingUp, Settings } from 'lucide-react';
import { cn } from '../utils';

type Profile = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    profession?: string;
    device_id: string | null;
    is_active: boolean;
    created_at: string;
    access_tier?: 'legacy' | 'premium' | 'free' | 'trial' | null;
    expires_at?: string | null;
    stripe_payment_id?: string | null;
};

type FilterType = 'ALL' | 'ACTIVE' | 'EXPIRED' | 'TRIAL';
type TierFilterType = 'ALL' | 'LEGACY' | 'PREMIUM' | 'FREE' | 'TRIAL' | 'STANDARD' | 'ADMIN';

const ADMIN_EMAILS = [
    'guillaumephilippe1968@gmail.com',
    'marc@damoiseaux.be',
    'vip@feelprod.com'
];

export function AdminDashboard() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [tierFilter, setTierFilter] = useState<TierFilterType>('ALL');
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [activeTab, setActiveTab] = useState<'users' | 'analytics'>('users');
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
    const [lookerStudioUrl, setLookerStudioUrl] = useState<string>(() => {
        return typeof window !== 'undefined' ? localStorage.getItem('looker_studio_url') || '' : '';
    });
    const [isEditingUrl, setIsEditingUrl] = useState(false);
    const [tempUrl, setTempUrl] = useState(lookerStudioUrl);

    // Calculate metrics
    const totalUsers = profiles.length;
    const premiumUsers = profiles.filter(p => p.access_tier === 'premium' || p.access_tier === 'legacy').length;
    const trialUsers = profiles.filter(p => p.access_tier === 'trial').length;
    const freeUsers = profiles.filter(p => p.access_tier === 'free').length;
    const conversionRate = totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0;

    const handleSaveLookerUrl = () => {
        localStorage.setItem('looker_studio_url', tempUrl);
        setLookerStudioUrl(tempUrl);
        setIsEditingUrl(false);
    };


    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching profiles:', error);
        } else {
            setProfiles(data || []);
        }
        setLoading(false);
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            alert("Action impossible : vous utilisez le bouton 'DEV' (sans vraie connexion).");
            return;
        }

        const { data, error } = await supabase
            .from('profiles')
            .update({ is_active: !currentStatus })
            .eq('id', id)
            .select();

        if (error) {
            alert('Erreur lors de la mise à jour : ' + error.message);
        } else if (!data || data.length === 0) {
            alert('Mise à jour refusée par la base de données. Vous n\'avez pas les droits administrateur (erreur RLS).');
        } else {
            fetchProfiles();
            if (selectedProfile && selectedProfile.id === id) {
                setSelectedProfile({ ...selectedProfile, is_active: !currentStatus });
            }
        }
    };

    const resetDevice = async (id: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            alert("Action impossible : vous n'êtes pas authentifié.");
            return;
        }

        if (!confirm('Êtes-vous sûr de vouloir réinitialiser les appareils de cet élève ?')) return;
        
        const { data, error } = await supabase
            .from('profiles')
            .update({ device_id: null })
            .eq('id', id)
            .select();

        if (error) {
            alert('Erreur lors de la réinitialisation : ' + error.message);
        } else if (!data || data.length === 0) {
            alert('Réinitialisation refusée (erreur RLS).');
        } else {
            fetchProfiles();
            if (selectedProfile && selectedProfile.id === id) {
                setSelectedProfile({ ...selectedProfile, device_id: null });
            }
        }
    };

    const deleteUser = async (id: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            alert("Action impossible : vous n'êtes pas authentifié.");
            return;
        }

        if (!confirm('ATTENTION : Êtes-vous sûr de vouloir EFFACER TOTALEMENT cet élève ? \nSon e-mail sera purgé et il devra recréer un compte de zéro.')) return;
        
        const { error } = await supabase.rpc('admin_delete_user', { target_user_id: id });

        if (error) {
            alert('Erreur lors de la suppression : ' + error.message);
        } else {
            alert('Le profil a été effacé avec succès. L\'utilisateur n\'existe plus.');
            setSelectedProfile(null);
            fetchProfiles();
        }
    };

    const updateTier = async (id: string, newTier: TierFilterType | 'NONE') => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return alert("Action impossible : non authentifié.");
        
        const tierValue = newTier === 'NONE' || newTier === 'STANDARD' ? null : newTier.toLowerCase();
        const isPremiumValue = tierValue !== null;
        const updateData: any = { access_tier: tierValue, is_premium: isPremiumValue };

        if (newTier === 'TRIAL') {
            const tomorrow = new Date();
            tomorrow.setHours(tomorrow.getHours() + 24);
            updateData.trial_ends_at = tomorrow.toISOString();
        } else {
            updateData.trial_ends_at = null;
        }
        
        const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', id);

        if (error) {
            alert('Erreur lors de la mise à jour : ' + error.message);
        } else {
            fetchProfiles();
            if (selectedProfile && selectedProfile.id === id) {
                setSelectedProfile({ ...selectedProfile, ...updateData });
            }
        }
    };

    const refundPayment = async (id: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return alert("Action impossible : non authentifié.");
        
        if (!confirm('ATTENTION : Êtes-vous sûr de vouloir annuler ce paiement ? \nLe client sera remboursé directement sur son système bancaire (PayPal, CB, Apple Pay). Cette action est irréversible.')) return;
        
        const { data, error } = await supabase.functions.invoke('admin-stripe-refund', {
            body: { userId: id }
        });

        if (error || data?.error) {
            alert('Erreur lors du remboursement : ' + (data?.error || error?.message || 'Erreur inconnue'));
        } else {
            alert('💳 Remboursement effectué avec succès. L\'accès premium a été retiré.');
            fetchProfiles();
            // Refraîchir la vue de profil pour cacher l'ID
            if (selectedProfile && selectedProfile.id === id) {
                 setSelectedProfile({ ...selectedProfile, stripe_payment_id: null, is_premium: false } as any);
            }
        }
    };

    const isExpired = (expires_at?: string | null) => {
        if (!expires_at) return false;
        return new Date(expires_at) < new Date();
    };

    const getTierCount = (tier: TierFilterType) => {
        if (tier === 'ALL') return profiles.length;
        if (tier === 'ADMIN') return profiles.filter(p => ADMIN_EMAILS.includes(p.email?.toLowerCase() || '')).length;
        
        // Pour les autres filtres, on exclut systématiquement les administrateurs
        const nonAdminProfiles = profiles.filter(p => !ADMIN_EMAILS.includes(p.email?.toLowerCase() || ''));
        if (tier === 'STANDARD') return nonAdminProfiles.filter(p => !p.access_tier).length;
        return nonAdminProfiles.filter(p => p.access_tier?.toUpperCase() === tier).length;
    };

    // Derived filtered profiles
    let filteredProfiles = profiles.filter(p =>
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filter === 'ACTIVE') {
        filteredProfiles = filteredProfiles.filter(p => p.is_active && !isExpired(p.expires_at));
    } else if (filter === 'EXPIRED') {
        filteredProfiles = filteredProfiles.filter(p => !p.is_active || isExpired(p.expires_at));
    } else if (filter === 'TRIAL') {
        filteredProfiles = filteredProfiles.filter(p => p.access_tier === 'trial');
    }

    if (tierFilter !== 'ALL') {
        filteredProfiles = filteredProfiles.filter(p => {
            const isAdmin = ADMIN_EMAILS.includes(p.email?.toLowerCase() || '');
            if (tierFilter === 'ADMIN') return isAdmin;
            
            // Si le filtre n'est ni ALL ni ADMIN, on exclut d'office les administrateurs
            if (isAdmin) return false;

            if (tierFilter === 'STANDARD') return !p.access_tier; // Pas de tier défini = standard
            return p.access_tier?.toUpperCase() === tierFilter;
        });
    }

    const renderTierBadge = (profile: Profile) => {
        if (ADMIN_EMAILS.includes(profile.email?.toLowerCase() || '')) {
            return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-purple-50 border border-purple-200 text-purple-700"><Shield size={12}/> Admin</span>;
        }

        switch (profile.access_tier) {
            case 'premium': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700"><Crown size={12}/> Plein Tarif</span>;
            case 'legacy': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 border border-amber-200 text-amber-700"><History size={12}/> Transfert</span>;
            case 'free': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-pink-50 border border-pink-200 text-pink-700"><Gift size={12}/> Cadeau</span>;
            case 'trial': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 border border-blue-200 text-blue-700"><Clock size={12}/> Essai 24h</span>;
            default: return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 border border-slate-200 text-slate-500">Standard</span>;
        }
    };

    const renderStatusBadge = (profile: Profile) => {
        const expired = isExpired(profile.expires_at);
        if (!profile.is_active) {
            return <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"/><span className="text-sm font-semibold text-slate-700">Verrouillé</span></div>;
        }
        if (expired) {
            return <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-400"/><span className="text-sm font-semibold text-slate-700">Expiré</span></div>;
        }
        if (profile.access_tier === 'trial' && profile.expires_at) {
            return <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"/><span className="text-sm font-semibold text-slate-700">En cours d'essai</span></div>;
        }
        return <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500"/><span className="text-sm font-semibold text-slate-700">Actif</span></div>;
    };

    return (
        <div className="w-full h-full animate-fade-in relative z-10 flex bg-slate-50 overflow-hidden min-h-0">
            {/* MAIN VIEW */}
            <div className={cn("flex-1 flex flex-col h-full min-w-0 min-h-0 bg-[#FAF6ED] transition-all duration-300", (selectedProfile && activeTab === 'users') ? "mr-0 xl:mr-[400px]" : "mr-0")}>
                {/* TOOLBAR */}
                <div className="flex-none pt-[max(env(safe-area-inset-top),16px)] px-4 md:px-6 pb-0 border-b border-slate-200 bg-white shadow-sm z-20">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 max-w-6xl mx-auto mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                            <div>
                                <h1 className="text-3xl font-bebas tracking-wide text-slate-900 uppercase leading-none">Tour de Contrôle</h1>
                                <p className="text-slate-500 font-medium text-sm mt-1">Gestion des accès et statistiques</p>
                            </div>
                            
                            {/* VIEW TOGGLE */}
                            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 shadow-inner max-w-xs">
                                <button 
                                    onClick={() => setActiveTab('users')} 
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer", 
                                        activeTab === 'users' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    👥 Élèves
                                </button>
                                <button 
                                    onClick={() => setActiveTab('analytics')} 
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer", 
                                        activeTab === 'analytics' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    📊 Trafic & Audience
                                </button>
                            </div>
                        </div>
                        
                        {activeTab === 'users' && (
                            <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3 w-full lg:w-auto">
                                <div className="flex bg-slate-100 p-1 rounded-xl w-full xl:w-auto overflow-x-auto no-scrollbar hidden md:flex">
                                    <button onClick={() => setFilter('ALL')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex-1 text-center", filter === 'ALL' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700")}>Vue globale</button>
                                    <button onClick={() => setFilter('ACTIVE')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex-1 text-center", filter === 'ACTIVE' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700")}>🟢 Actifs</button>
                                    <button onClick={() => setFilter('EXPIRED')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex-1 text-center", filter === 'EXPIRED' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700")}>🔴 Bloqués</button>
                                </div>

                                <div className="relative w-full xl:w-64 shrink-0">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                                        placeholder="Chercher un nom ou e-mail..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* TIER TABS SYSTEM - Only visible when managing users */}
                    {activeTab === 'users' && (
                        <div className="flex overflow-x-auto overflow-y-hidden touch-pan-x no-scrollbar max-w-6xl mx-auto gap-6 border-transparent -mx-4 px-4 md:-mx-6 md:px-6 snap-x snap-mandatory">
                            {[
                                { id: 'ALL', label: 'Tous', icon: '🌟' },
                                { id: 'STANDARD', label: 'Standards', icon: '⚪' },
                                { id: 'PREMIUM', label: 'Premiums', icon: '👑' },
                                { id: 'LEGACY', label: 'Mise à jour', icon: '📜' },
                                { id: 'FREE', label: 'Cadeaux', icon: '🎁' },
                                { id: 'TRIAL', label: 'Essais 24h', icon: '⏱️' },
                                { id: 'ADMIN', label: 'Admin', icon: '🛡️' }
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTierFilter(t.id as TierFilterType)}
                                    className={cn(
                                        "pb-3 text-sm font-bold whitespace-nowrap transition-colors relative flex items-center snap-start",
                                        tierFilter === t.id ? "text-primary" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    <span className="mr-1.5">{t.icon}</span>
                                    {t.label} 
                                    <span className={cn(
                                        "ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold",
                                        tierFilter === t.id ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"
                                    )}>
                                        {getTierCount(t.id as TierFilterType)}
                                    </span>
                                    {tierFilter === t.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform translate-y-[2px]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* CONTENT AREA */}
                {activeTab === 'users' ? (
                    /* THE SYNTHETIC TABLE */
                    <div className="flex-1 overflow-y-auto w-full max-w-6xl mx-auto px-4 md:px-6 py-6 pb-[120px] will-change-scroll">
                        <div className="bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden relative">
                            {loading ? (
                                <div className="p-12 text-center text-slate-400">Chargement des données...</div>
                            ) : filteredProfiles.length === 0 ? (
                                <div className="p-12 text-center text-slate-400">Aucun résultat.</div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {filteredProfiles.map((p) => (
                                        <div 
                                            key={p.id} 
                                            onClick={() => setSelectedProfile(p)}
                                            className={cn(
                                                "group flex items-center justify-between p-4 px-6 cursor-pointer hover:bg-slate-50 transition-colors",
                                                selectedProfile?.id === p.id && "bg-slate-50 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary"
                                            )}
                                        >
                                            <div className="flex items-center gap-4 w-[50%] md:w-[40%]">
                                                <div className="hidden md:flex h-10 w-10 shrink-0 rounded-full bg-slate-100 text-slate-500 font-bold items-center justify-center text-sm uppercase">
                                                    {p.first_name?.[0] || ''}{p.last_name?.[0] || ''}
                                                    {!p.first_name && !p.last_name && p.email?.[0]}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="font-bold text-slate-900 text-sm truncate">{p.first_name || p.last_name ? `${p.first_name || ''} ${p.last_name || ''}` : <span className="italic">Inconnu</span>}</div>
                                                    <div className="text-xs text-slate-500 font-medium truncate">
                                                        {p.email} <span className="opacity-50 mx-1">•</span> <span className="text-[10px] uppercase tracking-wide">{new Date(p.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="hidden md:flex w-[25%]">
                                                {renderTierBadge(p)}
                                            </div>

                                            <div className="w-[30%] md:w-[25%] flex justify-end md:justify-start">
                                                {renderStatusBadge(p)}
                                            </div>

                                            <div className="w-[10%] flex justify-end">
                                                <ChevronRight size={18} className={cn("text-slate-300 group-hover:text-primary transition-colors", selectedProfile?.id === p.id && "text-primary")} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* THE ANALYTICS VIEW */
                    <div className="flex-1 overflow-y-auto w-full max-w-6xl mx-auto px-4 md:px-6 py-6 pb-[120px] will-change-scroll space-y-6">
                        {/* METRICS CARDS */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Inscrits</span>
                                    <span className="text-3xl font-bold text-slate-800 font-bebas block mt-1">{totalUsers}</span>
                                </div>
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl animate-pulse">
                                    <Users size={22} />
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Membres Premium</span>
                                    <span className="text-3xl font-bold text-slate-800 font-bebas block mt-1">{premiumUsers}</span>
                                </div>
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Crown size={22} />
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Essais Actifs</span>
                                    <span className="text-3xl font-bold text-slate-800 font-bebas block mt-1">{trialUsers}</span>
                                </div>
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                    <Clock size={22} />
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Taux Conversion</span>
                                    <span className="text-3xl font-bold text-slate-800 font-bebas block mt-1">
                                        {conversionRate}%
                                        <span className="text-xs font-sans font-bold text-slate-400 ml-2">
                                            ({premiumUsers} / {totalUsers})
                                        </span>
                                    </span>
                                </div>
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                    <TrendingUp size={22} />
                                </div>
                            </div>
                        </div>

                        {/* LOOKER STUDIO IFRAME OR MOCK DASHBOARD */}
                        {lookerStudioUrl ? (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.03)] overflow-hidden p-4 space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <div className="flex items-center gap-2">
                                        <BarChart2 className="text-indigo-600" size={20} />
                                        <h3 className="font-bold text-slate-800 text-sm">Tableau de bord Google Analytics en direct</h3>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setTempUrl(lookerStudioUrl);
                                            setIsEditingUrl(true);
                                        }}
                                        className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        <Settings size={14} /> Configurer
                                    </button>
                                </div>

                                {isEditingUrl ? (
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 space-y-3">
                                        <label className="text-xs font-bold text-slate-600 block">Lien d'intégration Looker Studio / Analytics</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm font-mono text-xs focus:outline-none"
                                            value={tempUrl}
                                            onChange={(e) => setTempUrl(e.target.value)}
                                            placeholder="Ex: https://lookerstudio.google.com/embed/reporting/..."
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={handleSaveLookerUrl} className="px-4 py-1.5 bg-[#1c2e4a] text-white rounded-lg text-xs font-bold cursor-pointer">Enregistrer</button>
                                            <button onClick={() => setIsEditingUrl(false)} className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer">Annuler</button>
                                        </div>
                                    </div>
                                ) : null}

                                <div className="relative w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50">
                                    <iframe
                                        src={lookerStudioUrl}
                                        className="w-full h-[600px] border-0 bg-white"
                                        allowFullScreen
                                        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* MOCK VISITS CHART */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] lg:col-span-2 space-y-4">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-base">
                                                {timeframe === 'week' ? 'Trafic Hebdomadaire' : timeframe === 'month' ? 'Trafic Mensuel' : 'Trafic Annuel'} (Estimation)
                                            </h3>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">Visites sur le site public embryologie.techniquesdoucestissulaires.fr</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {/* TIMEFRAME SELECTOR */}
                                            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50 shadow-inner">
                                                <button 
                                                    onClick={() => setTimeframe('week')}
                                                    className={cn(
                                                        "px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer",
                                                        timeframe === 'week' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
                                                    )}
                                                >
                                                    Semaine
                                                </button>
                                                <button 
                                                    onClick={() => setTimeframe('month')}
                                                    className={cn(
                                                        "px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer",
                                                        timeframe === 'month' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
                                                    )}
                                                >
                                                    Mois
                                                </button>
                                                <button 
                                                    onClick={() => setTimeframe('year')}
                                                    className={cn(
                                                        "px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer",
                                                        timeframe === 'year' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
                                                    )}
                                                >
                                                    Année
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] font-bold">
                                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"/><span className="text-slate-600">Pages vues</span></div>
                                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-teal-500"/><span className="text-slate-600">Visiteurs uniques</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* MOCK SVG LINE CHART */}
                                    <div className="w-full h-64 pt-4 relative">
                                        <svg className="w-full h-full" viewBox="0 0 600 240">
                                            {/* Grid */}
                                            <line x1="40" y1="40" x2="570" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                                            <line x1="40" y1="100" x2="570" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                                            <line x1="40" y1="160" x2="570" y2="160" stroke="#f1f5f9" strokeWidth="1" />
                                            <line x1="40" y1="220" x2="570" y2="220" stroke="#e2e8f0" strokeWidth="1.5" />

                                            {/* Left Y-axis labels */}
                                            {timeframe === 'week' ? (
                                                <>
                                                    <text x="10" y="44" fill="#94a3b8" fontSize="9" fontWeight="bold">250</text>
                                                    <text x="10" y="104" fill="#94a3b8" fontSize="9" fontWeight="bold">150</text>
                                                    <text x="10" y="164" fill="#94a3b8" fontSize="9" fontWeight="bold">75</text>
                                                    <text x="20" y="224" fill="#94a3b8" fontSize="9" fontWeight="bold">0</text>
                                                </>
                                            ) : timeframe === 'month' ? (
                                                <>
                                                    <text x="5" y="44" fill="#94a3b8" fontSize="9" fontWeight="bold">4000</text>
                                                    <text x="5" y="104" fill="#94a3b8" fontSize="9" fontWeight="bold">2500</text>
                                                    <text x="5" y="164" fill="#94a3b8" fontSize="9" fontWeight="bold">1200</text>
                                                    <text x="20" y="224" fill="#94a3b8" fontSize="9" fontWeight="bold">0</text>
                                                </>
                                            ) : (
                                                <>
                                                    <text x="5" y="44" fill="#94a3b8" fontSize="9" fontWeight="bold">40k</text>
                                                    <text x="5" y="104" fill="#94a3b8" fontSize="9" fontWeight="bold">25k</text>
                                                    <text x="5" y="164" fill="#94a3b8" fontSize="9" fontWeight="bold">12k</text>
                                                    <text x="20" y="224" fill="#94a3b8" fontSize="9" fontWeight="bold">0</text>
                                                </>
                                            )}

                                            {/* Area under lines */}
                                            {timeframe === 'week' && (
                                                <>
                                                    <path 
                                                        d="M 50,220 L 50,120 L 130,95 L 210,70 L 290,45 L 370,62 L 450,112 L 530,100 L 530,220 Z" 
                                                        fill="url(#indigoGrad)" 
                                                        opacity="0.04"
                                                    />
                                                    <path 
                                                        d="M 50,220 L 50,148 L 130,130 L 210,103 L 290,76 L 370,94 L 450,139 L 530,121 L 530,220 Z" 
                                                        fill="url(#tealGrad)" 
                                                        opacity="0.04"
                                                    />

                                                    {/* Page Views Path (Indigo) */}
                                                    <polyline
                                                        points="50,120 130,95 210,70 290,45 370,62 450,112 530,100"
                                                        fill="none"
                                                        stroke="#6366f1"
                                                        strokeWidth="3.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />

                                                    {/* Unique Visits Path (Teal) */}
                                                    <polyline
                                                        points="50,148 130,130 210,103 290,76 370,94 450,139 530,121"
                                                        fill="none"
                                                        stroke="#14b8a6"
                                                        strokeWidth="3.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />

                                                    {/* Dots & Labels for Page Views (Indigo) */}
                                                    {[
                                                        { x: 50, y: 120, val: 120 },
                                                        { x: 130, y: 95, val: 150 },
                                                        { x: 210, y: 70, val: 180 },
                                                        { x: 290, y: 45, val: 210 },
                                                        { x: 370, y: 62, val: 190 },
                                                        { x: 450, y: 112, val: 130 },
                                                        { x: 530, y: 100, val: 145 }
                                                    ].map((pt, idx) => (
                                                        <g key={`pv-${idx}`}>
                                                            <circle cx={pt.x} cy={pt.y} r="4" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
                                                            <text x={pt.x} y={pt.y - 10} fill="#4f46e5" fontSize="10" fontWeight="bold" textAnchor="middle">{pt.val}</text>
                                                        </g>
                                                    ))}

                                                    {/* Dots & Labels for Unique Visits (Teal) */}
                                                    {[
                                                        { x: 50, y: 148, val: 40 },
                                                        { x: 130, y: 130, val: 50 },
                                                        { x: 210, y: 103, val: 65 },
                                                        { x: 290, y: 76, val: 80 },
                                                        { x: 370, y: 94, val: 70 },
                                                        { x: 450, y: 139, val: 45 },
                                                        { x: 530, y: 121, val: 55 }
                                                    ].map((pt, idx) => (
                                                        <g key={`uv-${idx}`}>
                                                            <circle cx={pt.x} cy={pt.y} r="4" fill="#14b8a6" stroke="#ffffff" strokeWidth="1.5" />
                                                            <text x={pt.x} y={pt.y + 15} fill="#0d9488" fontSize="10" fontWeight="bold" textAnchor="middle">{pt.val}</text>
                                                        </g>
                                                    ))}

                                                    {/* X-axis labels */}
                                                    <text x="50" y="235" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Lun</text>
                                                    <text x="130" y="235" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Mar</text>
                                                    <text x="210" y="235" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Mer</text>
                                                    <text x="290" y="235" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Jeu</text>
                                                    <text x="370" y="235" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Ven</text>
                                                    <text x="450" y="235" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Sam</text>
                                                    <text x="530" y="235" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Dim</text>
                                                </>
                                            )}

                                            {timeframe === 'month' && (
                                                <>
                                                    <path 
                                                        d="M 40,220 L 40,166 L 88,154 L 136,134 L 184,112 L 232,94 L 280,121 L 328,148 L 376,170 L 424,107 L 472,89 L 520,67 L 568,80 L 568,220 Z" 
                                                        fill="url(#indigoGrad)" 
                                                        opacity="0.04"
                                                    />
                                                    <path 
                                                        d="M 40,220 L 40,200 L 88,195 L 136,186 L 184,179 L 232,170 L 280,181 L 328,193 L 376,202 L 424,175 L 472,168 L 520,159 L 568,166 L 568,220 Z" 
                                                        fill="url(#tealGrad)" 
                                                        opacity="0.04"
                                                    />

                                                    {/* Page Views Path (Indigo) */}
                                                    <polyline
                                                        points="40,166 88,154 136,134 184,112 232,94 280,121 328,148 376,170 424,107 472,89 520,67 568,80"
                                                        fill="none"
                                                        stroke="#6366f1"
                                                        strokeWidth="3.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />

                                                    {/* Unique Visits Path (Teal) */}
                                                    <polyline
                                                        points="40,200 88,195 136,186 184,179 232,170 280,181 328,193 376,202 424,175 472,168 520,159 568,166"
                                                        fill="none"
                                                        stroke="#14b8a6"
                                                        strokeWidth="3.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />

                                                    {/* Dots & Labels for Page Views (Indigo) */}
                                                    {[
                                                        { x: 40, y: 166, val: '1.2k' },
                                                        { x: 88, y: 154, val: '1.4k' },
                                                        { x: 136, y: 134, val: '1.9k' },
                                                        { x: 184, y: 112, val: '2.4k' },
                                                        { x: 232, y: 94, val: '2.8k' },
                                                        { x: 280, y: 121, val: '2.2k' },
                                                        { x: 328, y: 148, val: '1.6k' },
                                                        { x: 376, y: 170, val: '1.1k' },
                                                        { x: 424, y: 107, val: '2.5k' },
                                                        { x: 472, y: 89, val: '2.9k' },
                                                        { x: 520, y: 67, val: '3.4k' },
                                                        { x: 568, y: 80, val: '3.1k' }
                                                    ].map((pt, idx) => (
                                                        <g key={`pv-mo-${idx}`}>
                                                            <circle cx={pt.x} cy={pt.y} r="3" fill="#6366f1" stroke="#ffffff" strokeWidth="1" />
                                                            <text x={pt.x} y={pt.y - 7} fill="#4f46e5" fontSize="8" fontWeight="bold" textAnchor="middle">{pt.val}</text>
                                                        </g>
                                                    ))}

                                                    {/* Dots & Labels for Unique Visits (Teal) */}
                                                    {[
                                                        { x: 40, y: 200, val: '450' },
                                                        { x: 88, y: 195, val: '550' },
                                                        { x: 136, y: 186, val: '750' },
                                                        { x: 184, y: 179, val: '900' },
                                                        { x: 232, y: 170, val: '1.1k' },
                                                        { x: 280, y: 181, val: '850' },
                                                        { x: 328, y: 193, val: '600' },
                                                        { x: 376, y: 202, val: '400' },
                                                        { x: 424, y: 175, val: '1k' },
                                                        { x: 472, y: 168, val: '1.1k' },
                                                        { x: 520, y: 159, val: '1.3k' },
                                                        { x: 568, y: 166, val: '1.2k' }
                                                    ].map((pt, idx) => (
                                                        <g key={`uv-mo-${idx}`}>
                                                            <circle cx={pt.x} cy={pt.y} r="3" fill="#14b8a6" stroke="#ffffff" strokeWidth="1" />
                                                            <text x={pt.x} y={pt.y + 11} fill="#0d9488" fontSize="8" fontWeight="bold" textAnchor="middle">{pt.val}</text>
                                                        </g>
                                                    ))}

                                                    {/* X-axis labels */}
                                                    <text x="40" y="235" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">Jan</text>
                                                    <text x="88" y="235" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">Fév</text>
                                                    <text x="136" y="235" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">Mar</text>
                                                    <text x="184" y="235" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">Avr</text>
                                                    <text x="232" y="235" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">Mai</text>
                                                    <text x="280" y="235" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">Juin</text>
                                                    <text x="328" y="235" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">Juil</text>
                                                    <text x="376" y="235" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">Août</text>
                                                    <text x="424" y="235" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">Sep</text>
                                                    <text x="472" y="235" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">Oct</text>
                                                    <text x="520" y="235" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">Nov</text>
                                                    <text x="568" y="235" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">Déc</text>
                                                </>
                                            )}

                                            {timeframe === 'year' && (
                                                <>
                                                    <path 
                                                        d="M 100,220 L 100,145 L 300,100 L 500,60 L 500,220 Z" 
                                                        fill="url(#indigoGrad)" 
                                                        opacity="0.04"
                                                    />
                                                    <path 
                                                        d="M 100,220 L 100,190 L 300,170 L 500,150 L 500,220 Z" 
                                                        fill="url(#tealGrad)" 
                                                        opacity="0.04"
                                                    />

                                                    {/* Page Views Path (Indigo) */}
                                                    <polyline
                                                        points="100,145 300,100 500,60"
                                                        fill="none"
                                                        stroke="#6366f1"
                                                        strokeWidth="3.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />

                                                    {/* Unique Visits Path (Teal) */}
                                                    <polyline
                                                        points="100,190 300,170 500,150"
                                                        fill="none"
                                                        stroke="#14b8a6"
                                                        strokeWidth="3.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />

                                                    {/* Dots & Labels for Page Views (Indigo) */}
                                                    {[
                                                        { x: 100, y: 145, val: '15k' },
                                                        { x: 300, y: 100, val: '24k' },
                                                        { x: 500, y: 60, val: '32k' }
                                                    ].map((pt, idx) => (
                                                        <g key={`pv-yr-${idx}`}>
                                                            <circle cx={pt.x} cy={pt.y} r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                                                            <text x={pt.x} y={pt.y - 12} fill="#4f46e5" fontSize="11" fontWeight="bold" textAnchor="middle">{pt.val}</text>
                                                        </g>
                                                    ))}

                                                    {/* Dots & Labels for Unique Visits (Teal) */}
                                                    {[
                                                        { x: 100, y: 190, val: '6k' },
                                                        { x: 300, y: 170, val: '10k' },
                                                        { x: 500, y: 150, val: '14k' }
                                                    ].map((pt, idx) => (
                                                        <g key={`uv-yr-${idx}`}>
                                                            <circle cx={pt.x} cy={pt.y} r="5" fill="#14b8a6" stroke="#ffffff" strokeWidth="2" />
                                                            <text x={pt.x} y={pt.y + 16} fill="#0d9488" fontSize="11" fontWeight="bold" textAnchor="middle">{pt.val}</text>
                                                        </g>
                                                    ))}

                                                    {/* X-axis labels */}
                                                    <text x="100" y="235" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">2024</text>
                                                    <text x="300" y="235" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">2025</text>
                                                    <text x="500" y="235" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">2026</text>
                                                </>
                                            )}

                                            {/* Gradients */}
                                            <defs>
                                                <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#6366f1" />
                                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                                </linearGradient>
                                                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#14b8a6" />
                                                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>

                                {/* SIDE PANEL: COUNTRY & SOURCE */}
                                <div className="space-y-6">
                                    {/* MOCK TOP VIEWS */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] space-y-4">
                                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5"><Globe size={16} className="text-teal-600"/> Pays Visiteurs</h4>
                                        <div className="space-y-3">
                                            {[
                                                { country: 'France', percent: 78 },
                                                { country: 'Belgique', percent: 12 },
                                                { country: 'Suisse', percent: 6 },
                                                { country: 'Canada', percent: 3 },
                                                { country: 'Allemagne', percent: 1 }
                                            ].map((item, idx) => (
                                                <div key={idx} className="space-y-1">
                                                    <div className="flex justify-between text-xs font-bold text-slate-700">
                                                        <span>{item.country}</span>
                                                        <span>{item.percent}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${item.percent}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CONCEPTS PLUS LUS */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] space-y-4">
                                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">📖 Concepts les plus consultés</h4>
                                        <div className="space-y-3 text-xs font-bold text-slate-700">
                                            <div className="flex justify-between"><span>1. Ligne médiane (fr)</span><span className="text-slate-400">312 vues</span></div>
                                            <div className="flex justify-between"><span>2. Fulgurance (fr)</span><span className="text-slate-400">240 vues</span></div>
                                            <div className="flex justify-between"><span>3. Biodynamic Embryology (en)</span><span className="text-slate-400">195 vues</span></div>
                                            <div className="flex justify-between"><span>4. Point d'immobilité (fr)</span><span className="text-slate-400">140 vues</span></div>
                                            <div className="flex justify-between"><span>5. Generalités (es)</span><span className="text-slate-400">92 vues</span></div>
                                        </div>
                                    </div>
                                </div>

                                {/* INTEGRATE LOOKER STUDIO SETUP CARD */}
                                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(28,46,74,0.15)] lg:col-span-3 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white/10 text-indigo-300 rounded-xl">
                                            <BarChart2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">Afficher vos vrais graphiques Google Analytics ici</h4>
                                            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                                                Vous pouvez incruster vos vrais graphiques Google Analytics (via l'outil gratuit Google Looker Studio) directement dans cette application. Suivez simplement les étapes suivantes pour coller votre lien :
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 pt-2 font-medium">
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="font-bold text-indigo-400 block mb-1">Étape 1</span>
                                            Allez sur <a href="https://lookerstudio.google.com/" target="_blank" rel="noreferrer" className="text-white underline">Looker Studio</a> et créez un rapport connecté à votre compte *Embryologie TDT*.
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="font-bold text-indigo-400 block mb-1">Étape 2</span>
                                            Cliquez sur **Partager** &rarr; **Intégrer le rapport**. Cochez "Activer l'intégration" et choisissez "Intégrer l'URL".
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="font-bold text-indigo-400 block mb-1">Étape 3</span>
                                            Copiez l'URL fournie (ex: *https://lookerstudio.google.com/embed/...*) et collez-la ci-dessous :
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <input
                                            type="text"
                                            className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/20 text-xs font-mono"
                                            placeholder="Coller l'URL d'intégration (https://lookerstudio.google.com/embed/...)"
                                            value={tempUrl}
                                            onChange={(e) => setTempUrl(e.target.value)}
                                        />
                                        <button 
                                            onClick={handleSaveLookerUrl}
                                            className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 transition-colors text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                                        >
                                            <ArrowUpRight size={14} /> Brancher le rapport
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* SIDE DRAWER (THE DETAILS PANEL) */}
            <div className={cn(
                "fixed top-0 lg:top-[60px] bottom-0 right-0 bg-white w-full md:w-80 lg:w-[400px] shadow-[-10px_0_40px_rgba(0,0,0,0.05)] border-l border-slate-200 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto",
                (selectedProfile && activeTab === 'users') ? "translate-x-0" : "translate-x-full"
            )}>
                {selectedProfile && (
                    <div className="flex flex-col h-full">
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {selectedProfile.first_name || selectedProfile.last_name ? `${selectedProfile.first_name} ${selectedProfile.last_name}` : 'Utilisateur Inconnu'}
                                </h2>
                                <p className="text-sm text-slate-500 font-medium mt-1">{selectedProfile.email}</p>
                            </div>
                            <button onClick={() => setSelectedProfile(null)} className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Drawer Body */}
                        <div className="p-6 pb-32 lg:pb-12 space-y-8 flex-1">
                            
                            {/* Identité Section */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Identité</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Profession</span>
                                        <span className="font-medium text-slate-800">{selectedProfile.profession || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Inscrit le</span>
                                        <span className="font-medium text-slate-800">{new Date(selectedProfile.created_at).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Accès Section */}
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Abonnement & Accès</h3>
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-500">Modifier l'offre associée</label>
                                        <div className="relative">
                                            <select 
                                                value={selectedProfile.access_tier ? selectedProfile.access_tier.toUpperCase() : 'STANDARD'}
                                                onChange={(e) => updateTier(selectedProfile.id, e.target.value as TierFilterType)}
                                                className="w-full appearance-none bg-white border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                                            >
                                                <option value="STANDARD">⚪ Standard (Gratuit)</option>
                                                <option value="PREMIUM">👑 Plein Tarif (Premium)</option>
                                                <option value="LEGACY">📜 Mise à jour (Réduit)</option>
                                                <option value="FREE">🎁 Accès Offert (Cadeau)</option>
                                                <option value="TRIAL">⏱️ Essai 24h</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <ChevronRight size={16} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 mt-2">
                                        <span className="text-xs font-bold text-slate-500">Statut de connexion</span>
                                        {renderStatusBadge(selectedProfile)}
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4 pt-4 border-t border-slate-200">
                                    <button 
                                        onClick={() => toggleStatus(selectedProfile.id, selectedProfile.is_active)}
                                        className={cn(
                                            "w-full py-2.5 rounded-xl font-bold text-sm transition-all border flex items-center justify-center gap-2",
                                            selectedProfile.is_active 
                                                ? "bg-white text-red-600 border-red-200 hover:bg-red-50" 
                                                : "bg-[#1c2e4a] text-white border-transparent hover:bg-[#1c2e4a]/90"
                                        )}
                                    >
                                        {selectedProfile.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                                        {selectedProfile.is_active ? "Bloquer le compte" : "Déverrouiller le compte"}
                                    </button>
                                </div>
                            </div>

                            {/* Appareils Section */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                    <MonitorOff size={14} /> Sécurité des Appareils
                                </h3>
                                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                                    Empreintes des appareils utilisés par ce navigateur. Réinitialisez si l'élève a changé d'ordinateur ou de téléphone.
                                </p>
                                <div className="bg-white border border-slate-200 rounded-xl p-3 mb-3 text-slate-700 max-h-32 overflow-y-auto">
                                    {selectedProfile.device_id ? (
                                        <div className="flex flex-wrap gap-2">
                                            {Array.from(new Set(
                                                selectedProfile.device_id.split(',').filter(Boolean).map((deviceId: string) => 
                                                    deviceId.includes('-') ? deviceId.split('-')[0] : 'Navigateur'
                                                )
                                            )).map((type: string, index: number) => (
                                                <span key={index} className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-lg text-xs font-semibold tracking-wide">
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-slate-500">Aucun appareil enregistré.</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => resetDevice(selectedProfile.id)}
                                    disabled={!selectedProfile.device_id}
                                    className="w-full py-2.5 rounded-xl text-amber-600 border border-amber-200 bg-amber-50 font-bold text-sm hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-8"
                                >
                                    Effacer les Empreintes
                                </button>
                            </div>

                            {/* Suppression Totale */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#B91C1C] mb-2 flex items-center gap-2">
                                    <Trash2 size={14} /> Suppression de Contact
                                </h3>
                                <p className="text-xs text-[#B91C1C]/80 mb-3 leading-relaxed">
                                    Efface totalement ce profil de la base de données. L'élève pourra ainsi s'inscrire à nouveau normalement avec cette même adresse e-mail.
                                </p>
                                <button
                                    onClick={() => deleteUser(selectedProfile.id)}
                                    className="w-full py-2.5 rounded-xl text-white bg-[#B91C1C] font-bold text-sm hover:bg-[#991B1B] transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} /> Effacer Totalement le Contact
                                </button>
                            </div>
                            
                            {/* Facturation Stripe */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2 flex items-center gap-2">
                                    <Crown size={14} /> Paiement & Remboursement
                                </h3>
                                <p className="text-xs text-indigo-900/70 mb-3 leading-relaxed">
                                    Identifiant de transaction Stripe unique lié à ce compte. Utilisé pour lancer un remboursement automatique.
                                </p>
                                <div className="bg-white border text-sm border-slate-200 rounded-xl p-3 mb-3 text-slate-700 max-h-32 overflow-y-auto break-all font-mono text-[10px]">
                                    {selectedProfile.stripe_payment_id || "Aucun paiement Stripe enregistré en base."}
                                </div>
                                <button
                                    onClick={() => refundPayment(selectedProfile.id)}
                                    disabled={!selectedProfile.stripe_payment_id}
                                    className="w-full py-2.5 rounded-xl text-white bg-indigo-600 font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    💳 Envoyer un Remboursement Stripe
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
