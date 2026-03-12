import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserX, UserCheck, ShieldOff, Search, KeyRound } from 'lucide-react';
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
};

export function AdminDashboard() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
        const { error } = await supabase
            .from('profiles')
            .update({ is_active: !currentStatus })
            .eq('id', id);

        if (error) {
            alert('Erreur lors de la mise à jour : ' + error.message);
        } else {
            fetchProfiles();
        }
    };

    const resetDevice = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir réinitialiser l\'appareil de cet utilisateur ? Il pourra se connecter sur un nouvel ordinateur.')) {
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({ device_id: null })
            .eq('id', id);

        if (error) {
            alert('Erreur lors de la réinitialisation : ' + error.message);
        } else {
            fetchProfiles();
        }
    };

    const filteredProfiles = profiles.filter(p =>
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                <div>
                    <h1 className="text-3xl font-bebas tracking-wide text-slate-900 uppercase">Gestion des élèves</h1>
                    <p className="text-slate-500 font-medium">Administration du CRM et des accès.</p>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm font-medium"
                        placeholder="Rechercher un élève..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-24">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Élève
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Statut d'Accès
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Empreinte
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                                        <div className="flex justify-center mb-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                        </div>
                                        Chargement des élèves...
                                    </td>
                                </tr>
                            ) : filteredProfiles.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                                        Aucun élève trouvé.
                                    </td>
                                </tr>
                            ) : (
                                filteredProfiles.map((profile) => (
                                    <tr key={profile.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase shrink-0">
                                                    {profile.first_name?.[0] || ''}{profile.last_name?.[0] || ''}
                                                    {!profile.first_name && !profile.last_name && profile.email?.[0]}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-slate-900">
                                                        {profile.first_name || profile.last_name ? `${profile.first_name || ''} ${profile.last_name || ''}` : <span className="italic text-slate-400">Nom inconnu</span>}
                                                    </div>
                                                    <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
                                                        <span>{profile.email}</span>
                                                        {profile.profession && (
                                                            <>
                                                                <span className="text-slate-300">•</span>
                                                                <span className="text-slate-500 italic">{profile.profession}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={cn(
                                                "px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border",
                                                profile.is_active
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : "bg-red-50 text-red-700 border-red-200"
                                            )}>
                                                {profile.is_active ? '✅ Accès Autorisé' : '🚫 Accès Bloqué'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {profile.device_id ? (
                                                <div className="flex items-center text-sm text-slate-600 font-medium">
                                                    <KeyRound size={14} className="mr-1.5 text-amber-500" />
                                                    <span className="truncate w-24" title={profile.device_id}>
                                                        {profile.device_id.includes('-') && profile.device_id.split('-').length > 4 ?
                                                            (profile.device_id.split('-').length === 5 ? profile.device_id.split('-')[0] : `${profile.device_id.split('-')[0]}-${profile.device_id.split('-')[1]}`)
                                                            : profile.device_id}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">Aucun appareil lié</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => toggleStatus(profile.id, profile.is_active)}
                                                    className={cn(
                                                        "flex items-center px-3 py-1.5 rounded-lg border transition-colors text-xs font-bold",
                                                        profile.is_active
                                                            ? "bg-white border-red-200 text-red-600 hover:bg-red-50"
                                                            : "bg-white border-green-200 text-green-600 hover:bg-green-50"
                                                    )}
                                                    title={profile.is_active ? "Bloquer l'accès" : "Autoriser l'accès"}
                                                >
                                                    {profile.is_active ? <UserX size={14} className="mr-1.5" /> : <UserCheck size={14} className="mr-1.5" />}
                                                    {profile.is_active ? 'Bloquer' : 'Activer'}
                                                </button>

                                                <button
                                                    onClick={() => resetDevice(profile.id)}
                                                    disabled={!profile.device_id}
                                                    className={cn(
                                                        "flex items-center px-3 py-1.5 rounded-lg border transition-colors text-xs font-bold",
                                                        !profile.device_id
                                                            ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-50"
                                                            : "bg-white border-amber-200 text-amber-600 hover:bg-amber-50"
                                                    )}
                                                    title="Permettre de se connecter sur un nouvel appareil"
                                                >
                                                    <ShieldOff size={14} className="mr-1.5" />
                                                    Reset
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden flex flex-col divide-y divide-slate-100">
                    {loading ? (
                        <div className="px-6 py-12 text-center text-slate-500 font-medium">
                            <div className="flex justify-center mb-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                            Chargement des élèves...
                        </div>
                    ) : filteredProfiles.length === 0 ? (
                        <div className="px-6 py-12 text-center text-slate-500 font-medium">
                            Aucun élève trouvé.
                        </div>
                    ) : (
                        filteredProfiles.map((profile) => (
                            <div key={profile.id} className="p-4 flex flex-col gap-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center">
                                        <div className="h-[42px] w-[42px] rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase shrink-0">
                                            {profile.first_name?.[0] || ''}{profile.last_name?.[0] || ''}
                                            {!profile.first_name && !profile.last_name && profile.email?.[0]}
                                        </div>
                                        <div className="ml-3 overflow-hidden">
                                            <div className="text-sm font-bold text-slate-900 truncate">
                                                {profile.first_name || profile.last_name ? `${profile.first_name || ''} ${profile.last_name || ''}` : <span className="italic text-slate-400">Nom inconnu</span>}
                                            </div>
                                            <div className="text-xs text-slate-500 font-medium truncate">{profile.email}</div>
                                            {profile.profession && (
                                                <div className="text-xs text-slate-400 italic truncate">{profile.profession}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={cn(
                                        "px-2.5 py-1 inline-flex text-[11px] leading-4 font-bold rounded-full border",
                                        profile.is_active
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-red-50 text-red-700 border-red-200"
                                    )}>
                                        {profile.is_active ? '✅ Actif' : '🚫 Bloqué'}
                                    </span>
                                    {profile.device_id ? (
                                        <div className="flex items-center text-[11px] text-slate-600 font-medium px-2.5 py-1 bg-slate-50 rounded-full border border-slate-200">
                                            <KeyRound size={12} className="mr-1 text-amber-500" />
                                            <span className="truncate max-w-[80px]" title={profile.device_id}>
                                                {profile.device_id.includes('-') && profile.device_id.split('-').length > 4 ?
                                                    (profile.device_id.split('-').length === 5 ? profile.device_id.split('-')[0] : `${profile.device_id.split('-')[0]}-${profile.device_id.split('-')[1]}`)
                                                    : profile.device_id}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[11px] px-2.5 py-1 bg-slate-50 text-slate-400 italic rounded-full border border-slate-200">Sans appareil</span>
                                    )}
                                </div>

                                <div className="flex flex-row justify-stretch gap-2 mt-1">
                                    <button
                                        onClick={() => toggleStatus(profile.id, profile.is_active)}
                                        className={cn(
                                            "flex-1 flex justify-center items-center px-3 py-2 rounded-[10px] border transition-colors text-xs font-bold",
                                            profile.is_active
                                                ? "bg-white border-red-200 text-red-600 hover:bg-red-50"
                                                : "bg-white border-green-200 text-green-600 hover:bg-green-50"
                                        )}
                                    >
                                        {profile.is_active ? <UserX size={14} className="mr-1.5" /> : <UserCheck size={14} className="mr-1.5" />}
                                        {profile.is_active ? 'Bloquer' : 'Activer'}
                                    </button>

                                    <button
                                        onClick={() => resetDevice(profile.id)}
                                        disabled={!profile.device_id}
                                        className={cn(
                                            "flex-1 flex justify-center items-center px-3 py-2 rounded-[10px] border transition-colors text-xs font-bold",
                                            !profile.device_id
                                                ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-50"
                                                : "bg-white border-amber-200 text-amber-600 hover:bg-amber-50"
                                        )}
                                    >
                                        <ShieldOff size={14} className="mr-1.5" />
                                        Reset Appareil
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
