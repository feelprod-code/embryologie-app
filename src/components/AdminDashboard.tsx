import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserX, UserCheck, Search, KeyRound, MonitorOff, ChevronRight, X, Clock, Gift, Crown, History, Trash2, Shield } from 'lucide-react';
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
            {/* MAIN LIST VIEW */}
            <div className={cn("flex-1 flex flex-col h-full min-w-0 min-h-0 bg-[#FAF6ED] transition-all duration-300", selectedProfile ? "mr-0 xl:mr-[400px]" : "mr-0")}>
                {/* TOOLBAR */}
                <div className="flex-none pt-[max(env(safe-area-inset-top),16px)] px-4 md:px-6 pb-0 border-b border-slate-200 bg-white shadow-sm z-20">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 max-w-6xl mx-auto mb-6">
                        <div>
                            <h1 className="text-3xl font-bebas tracking-wide text-slate-900 uppercase leading-none">Tour de Contrôle</h1>
                            <p className="text-slate-500 font-medium text-sm mt-1">Gestion des accès et transferts</p>
                        </div>
                        
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
                    </div>

                    {/* TIER TABS SYSTEM */}
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
                </div>

                {/* THE SYNTHETIC TABLE */}
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
            </div>

            {/* SIDE DRAWER (THE DETAILS PANEL) */}
            <div className={cn(
                "fixed top-0 lg:top-[60px] bottom-0 right-0 bg-white w-full md:w-80 lg:w-[400px] shadow-[-10px_0_40px_rgba(0,0,0,0.05)] border-l border-slate-200 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto",
                selectedProfile ? "translate-x-0" : "translate-x-full"
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
                                        <div className="flex flex-col gap-2">
                                            {selectedProfile.device_id.split(',').filter(Boolean).map((deviceId: string, index: number) => {
                                                const type = deviceId.includes('-') ? deviceId.split('-')[0] : 'Navigateur';
                                                return (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <span className="font-bold text-sm text-slate-800">Appareil {index + 1} :</span>
                                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold tracking-wider uppercase">
                                                            {type}
                                                        </span>
                                                    </div>
                                                );
                                            })}
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
