import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserX, UserCheck, Search, KeyRound, MonitorOff, ChevronRight, X, Clock, Gift, Crown, History, Trash2, Shield, BarChart2, Users, ArrowUpRight, Globe, TrendingUp, Settings, MapPin, FileText, Mail, Printer, DollarSign, Wallet, Share2, Send, Sparkles, Lock, CreditCard, Calendar, CheckCircle2, Receipt } from 'lucide-react';
import { cn } from '../utils';
import { openInvoiceWindow, openEmailForInvoice, shareInvoice, openWhatsAppForInvoice, openSmsForInvoice, openDamoiseauxSummaryWindow, openMarcTransferSheetWindow, openEmailForMarcTransfer, shareMarcTransferSheet, openPaymentsListingWindow, type PartnerSale, type PaymentListingItem } from '../utils/exportInvoicePdf';

type Profile = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    profession?: string;
    location?: string;
    address?: string;
    device_id: string | null;
    is_active: boolean;
    created_at: string;
    access_tier?: 'legacy' | 'premium' | 'free' | 'trial' | null;
    is_premium?: boolean;
    expires_at?: string | null;
    stripe_payment_id?: string | null;
};

type FilterType = 'ALL' | 'ACTIVE' | 'EXPIRED' | 'TRIAL';
type TierFilterType = 'ALL' | 'LEGACY' | 'PREMIUM' | 'FREE' | 'TRIAL' | 'STANDARD' | 'ADMIN';

const ADMIN_EMAILS = [
    'guillaumephilippe1968@gmail.com',
    'guillaumephilippe@me.com',
    'marc@damoiseaux.be',
    'vip@feelprod.com'
];

export const getEffectiveTier = (p: Profile): 'ADMIN' | 'PREMIUM' | 'LEGACY' | 'FREE' | 'TRIAL' | 'STANDARD' => {
    if (ADMIN_EMAILS.includes(p.email?.toLowerCase() || '')) return 'ADMIN';
    if (p.access_tier?.toUpperCase() === 'PREMIUM' || p.stripe_payment_id) return 'PREMIUM';
    if (p.access_tier?.toUpperCase() === 'TRIAL') return 'TRIAL';
    if (p.access_tier?.toUpperCase() === 'FREE') return 'FREE';
    if (p.access_tier?.toUpperCase() === 'LEGACY') return 'LEGACY';
    if (p.is_premium) return 'LEGACY'; // Élèves actifs / transférés
    return 'STANDARD';
};

export function AdminDashboard() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [tierFilter, setTierFilter] = useState<TierFilterType>('ALL');
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'payments' | 'compta'>(() => {
        if (typeof window !== 'undefined') {
            const p = new URLSearchParams(window.location.search);
            const t = p.get('tab');
            if (t === 'payments' || t === 'analytics' || t === 'compta' || t === 'users') return t;
        }
        return 'users';
    });
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
    const [paymentMonthFilter, setPaymentMonthFilter] = useState<string>('ALL');

    const MONTHS_LIST = [
        { key: 'ALL', label: 'Toutes les dates (2026)' },
        { key: '2026-12', label: 'Décembre 2026' },
        { key: '2026-11', label: 'Novembre 2026' },
        { key: '2026-10', label: 'Octobre 2026' },
        { key: '2026-09', label: 'Septembre 2026' },
        { key: '2026-08', label: 'Août 2026' },
        { key: '2026-07', label: 'Juillet 2026' },
        { key: '2026-06', label: 'Juin 2026' },
        { key: '2026-05', label: 'Mai 2026' },
        { key: '2026-04', label: 'Avril 2026' },
        { key: '2026-03', label: 'Mars 2026' },
        { key: '2026-02', label: 'Février 2026' },
        { key: '2026-01', label: 'Janvier 2026' }
    ];

    const [sentInvoiceEmails, setSentInvoiceEmails] = useState<Record<string, string>>(() => {
        try {
            const saved = localStorage.getItem('feelprod_sent_invoice_emails');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });
    const [shareMenuOrderId, setShareMenuOrderId] = useState<string | null>(null);
    const [emailNotification, setEmailNotification] = useState<{ name: string; email: string; time: string } | null>(null);

    const handleSendInvoiceEmail = (orderId: string, invoiceData: any) => {
        openEmailForInvoice(invoiceData);
        const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const updated = { ...sentInvoiceEmails, [orderId]: timeStr };
        setSentInvoiceEmails(updated);
        try {
            localStorage.setItem('feelprod_sent_invoice_emails', JSON.stringify(updated));
        } catch {}
        setEmailNotification({
            name: `${invoiceData.firstName || ''} ${invoiceData.lastName || ''}`.trim() || invoiceData.email,
            email: invoiceData.email,
            time: timeStr
        });
        setTimeout(() => setEmailNotification(null), 6000);
    };

    const [gaData, setGaData] = useState<{ dimension: string; activeUsers: number; pageViews: number }[] | null>(null);
    const [topCountries, setTopCountries] = useState<{ country: string; activeUsers: number }[] | null>(null);
    const [topConcepts, setTopConcepts] = useState<{ pagePath: string; pageViews: number }[] | null>(null);
    const [isLoadingGa, setIsLoadingGa] = useState<boolean>(false);
    const [gaError, setGaError] = useState<string | null>(null);

    // Calculate metrics
    const totalUsers = profiles.length;
    // Clients ayant réellement réglé sur Stripe (400 €) = 2 (Gilles Ducret & Karl Massou)
    const paidStripeUsers = profiles.filter(p => !ADMIN_EMAILS.includes(p.email?.toLowerCase() || '') && (!!p.stripe_payment_id || p.access_tier === 'premium')).length;
    // Transferts historiques (anciens élèves de Marc réactivés en accès libre)
    const legacyUsers = profiles.filter(p => !ADMIN_EMAILS.includes(p.email?.toLowerCase() || '') && p.access_tier === 'legacy').length;
    // Inscrits Gratuits Découverte (sans paiement Stripe)
    const standardUsers = profiles.filter(p => !ADMIN_EMAILS.includes(p.email?.toLowerCase() || '') && !p.stripe_payment_id && p.access_tier !== 'premium' && p.access_tier !== 'legacy').length;
    const trialUsers = profiles.filter(p => getEffectiveTier(p) === 'TRIAL').length;
    const freeUsers = profiles.filter(p => getEffectiveTier(p) === 'FREE').length;
    const conversionRate = totalUsers > 0 ? Math.round((paidStripeUsers / totalUsers) * 100) : 0;

    // Mode de déduction des frais pour le bilan Marc Damoiseaux (Par défaut : stripe_only, FeelProd offre 100% des frais Cloudflare / hébergement)
    const [feeMode, setFeeMode] = useState<'stripe_and_platform' | 'stripe_only'>('stripe_only');

    // Partner & Accounting Sales (Marc Damoiseaux 50% / FeelProd 50%)
    const partnerSales: PartnerSale[] = profiles
        .filter(p => !ADMIN_EMAILS.includes(p.email?.toLowerCase() || ''))
        .filter(p => !!p.stripe_payment_id || p.access_tier === 'premium')
        .map(p => ({
            date: p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR') : '19/06/2026',
            name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.email,
            email: p.email,
            profession: p.profession,
            location: p.address || p.location,
            stripePaymentId: p.stripe_payment_id || 'Stripe Checkout',
            amount: 400.00
        }));

    const totalBrut = partnerSales.reduce((acc, s) => acc + s.amount, 0);
    const stripeFeePerSale = 6.25; // 1.5% + 0.25€ par tx 400€
    const platformFeeRate = feeMode === 'stripe_and_platform' ? 0.05 : 0; // 5% frais techniques, hébergement vidéo R2 FeelProd
    const totalStripeFees = partnerSales.length * stripeFeePerSale;
    const totalPlatformFees = totalBrut * platformFeeRate;
    const totalFeesDeducted = totalStripeFees + totalPlatformFees;
    const totalNet = totalBrut - totalFeesDeducted;
    const partMarc = totalNet / 2;
    const partFeelProd = totalNet / 2;

    // Structured paid orders for the "Paiements déjà effectués" tab
    const paidOrders = profiles
        .filter(p => !ADMIN_EMAILS.includes(p.email?.toLowerCase() || ''))
        .filter(p => !!p.stripe_payment_id || p.access_tier === 'premium')
        .map(p => {
            const dateObj = p.created_at ? new Date(p.created_at) : new Date('2026-06-19');
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const monthKey = `${year}-${month}`;
            const monthLabel = dateObj.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
            return {
                id: p.id,
                profile: p,
                date: dateObj.toLocaleDateString('fr-FR'),
                dateTime: dateObj.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                monthKey,
                monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
                name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.email,
                email: p.email,
                profession: p.profession,
                location: p.address || p.location,
                stripePaymentId: p.stripe_payment_id || 'Stripe Checkout',
                amount: 400.00
            };
        })
        .sort((a, b) => {
            const dateA = a.profile.created_at ? new Date(a.profile.created_at).getTime() : 0;
            const dateB = b.profile.created_at ? new Date(b.profile.created_at).getTime() : 0;
            return dateB - dateA;
        });

    const filteredPaidOrders = paymentMonthFilter === 'ALL'
        ? paidOrders
        : paidOrders.filter(o => o.monthKey === paymentMonthFilter);

    const filteredTotalBrut = filteredPaidOrders.reduce((acc, o) => acc + o.amount, 0);
    const filteredTotalStripeFees = filteredPaidOrders.length * stripeFeePerSale;
    const filteredTotalNet = filteredTotalBrut - filteredTotalStripeFees;
    const selectedMonthObj = MONTHS_LIST.find(m => m.key === paymentMonthFilter);
    const selectedMonthLabel = selectedMonthObj ? selectedMonthObj.label : paymentMonthFilter;

    useEffect(() => {
        if (activeTab === 'analytics') {
            const fetchGaData = async () => {
                setIsLoadingGa(true);
                setGaError(null);
                try {
                    let data: any = null;
                    try {
                        const res = await fetch(`/api/analytics?timeframe=${timeframe}`);
                        if (res.ok) {
                            const ct = res.headers.get('content-type') || '';
                            if (ct.includes('application/json')) {
                                data = await res.json();
                            }
                        }
                    } catch {
                        data = null;
                    }

                    // Fallback to production live endpoint if local relative API returned HTML or failed
                    if (!data || data.error || !data.rows || data.rows.length === 0) {
                        try {
                            const fallbackRes = await fetch(`https://app.feelprod.com/api/analytics?timeframe=${timeframe}`);
                            if (fallbackRes.ok) {
                                data = await fallbackRes.json();
                            }
                        } catch (err) {
                            console.warn("Analytics fallback fetch failed:", err);
                        }
                    }

                    if (!data || data.error) {
                        throw new Error(data?.error || 'Données analytics indisponibles');
                    }
                    setGaData(data.rows || []);
                    setTopCountries(data.topCountries || []);
                    setTopConcepts(data.topConcepts || []);
                } catch (err: any) {
                    console.error('Error fetching GA data:', err);
                    setGaError(err.message || 'Error fetching analytics');
                    setGaData(null);
                    setTopCountries(null);
                    setTopConcepts(null);
                } finally {
                    setIsLoadingGa(false);
                }
            };
            fetchGaData();
        }
    }, [activeTab, timeframe]);


    const getChartData = (): { label: string; pv: number; uv: number }[] => {
        if (gaData && gaData.length > 0) {
            return gaData.map(item => {
                let label = item.dimension;
                if (timeframe === 'week' || timeframe === 'month') {
                    if (item.dimension.length === 8) {
                        const day = item.dimension.substring(6, 8);
                        const month = item.dimension.substring(4, 6);
                        label = `${day}/${month}`;
                    }
                } else if (timeframe === 'year') {
                    if (item.dimension.length === 6) {
                        const monthStr = item.dimension.substring(4, 6);
                        const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
                        const mIdx = parseInt(monthStr, 10) - 1;
                        label = (mIdx >= 0 && mIdx < 12) ? months[mIdx] : item.dimension;
                    }
                }
                return {
                    label,
                    pv: item.pageViews,
                    uv: item.activeUsers
                };
            });
        }

        // Return real dates initialized to 0 (no mock fallback/estimation data)
        const fallbackData: { label: string; pv: number; uv: number }[] = [];
        const now = new Date();
        if (timeframe === 'week') {
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                fallbackData.push({ label: `${day}/${month}`, pv: 0, uv: 0 });
            }
            return fallbackData;
        } else if (timeframe === 'month') {
            for (let i = 29; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                fallbackData.push({ label: `${day}/${month}`, pv: 0, uv: 0 });
            }
            return fallbackData;
        } else {
            // year
            const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                fallbackData.push({ label: months[d.getMonth()], pv: 0, uv: 0 });
            }
            return fallbackData;
        }
    };

    const formatValue = (val: number): string => {
        if (val >= 1000000) {
            return `${(val / 1000000).toFixed(1)}M`;
        }
        if (val >= 1000) {
            return `${(val / 1000).toFixed(1)}k`;
        }
        return val.toString();
    };

    const getChartCoordinates = () => {
        const chartData = getChartData();
        const maxVal = Math.max(
            10,
            ...chartData.map(d => d.pv),
            ...chartData.map(d => d.uv)
        );

        let startX = 40;
        let endX = 560;
        if (timeframe === 'week') {
            startX = 50;
            endX = 530;
        } else if (timeframe === 'year') {
            startX = 100;
            endX = 500;
        }

        const count = chartData.length;
        const pointsPv = chartData.map((pt, idx) => {
            const x = count > 1 ? startX + idx * ((endX - startX) / (count - 1)) : startX;
            const y = 220 - (pt.pv / maxVal) * 180;
            return { x, y, val: pt.pv, label: pt.label };
        });

        const pointsUv = chartData.map((pt, idx) => {
            const x = count > 1 ? startX + idx * ((endX - startX) / (count - 1)) : startX;
            const y = 220 - (pt.uv / maxVal) * 180;
            return { x, y, val: pt.uv, label: pt.label };
        });

        const pvPolylineString = pointsPv.map(p => `${p.x},${p.y}`).join(' ');
        const uvPolylineString = pointsUv.map(p => `${p.x},${p.y}`).join(' ');

        const pvAreaString = pointsPv.length > 0 
            ? `M ${pointsPv[0].x},220 ` + pointsPv.map(p => `L ${p.x},${p.y}`).join(' ') + ` L ${pointsPv[pointsPv.length - 1].x},220 Z`
            : '';
        const uvAreaString = pointsUv.length > 0 
            ? `M ${pointsUv[0].x},220 ` + pointsUv.map(p => `L ${p.x},${p.y}`).join(' ') + ` L ${pointsUv[pointsUv.length - 1].x},220 Z`
            : '';

        return { pointsPv, pointsUv, pvPolylineString, uvPolylineString, pvAreaString, uvAreaString, maxVal };
    };

    const { pointsPv, pointsUv, pvPolylineString, uvPolylineString, pvAreaString, uvAreaString, maxVal: chartMaxVal } = getChartCoordinates();




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
        return profiles.filter(p => getEffectiveTier(p) === tier).length;
    };

    // Derived filtered profiles
    let filteredProfiles = profiles.filter(p =>
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filter === 'ACTIVE') {
        filteredProfiles = filteredProfiles.filter(p => p.is_active && !isExpired(p.expires_at));
    } else if (filter === 'EXPIRED') {
        filteredProfiles = filteredProfiles.filter(p => !p.is_active || isExpired(p.expires_at));
    } else if (filter === 'TRIAL') {
        filteredProfiles = filteredProfiles.filter(p => getEffectiveTier(p) === 'TRIAL');
    }

    if (tierFilter !== 'ALL') {
        filteredProfiles = filteredProfiles.filter(p => getEffectiveTier(p) === tierFilter);
    }

    const isPaidUser = (p: Profile | null | undefined): boolean => {
        if (!p) return false;
        return !ADMIN_EMAILS.includes(p.email?.toLowerCase() || '') && (
            p.access_tier === 'premium' || 
            p.is_premium === true || 
            !!p.stripe_payment_id
        );
    };

    const getProfileLocation = (p: Profile | null | undefined): string => {
        if (!p) return '';
        const raw = (p.address || p.location || '').trim();
        if (!raw) return '';
        if (raw.toLowerCase().includes('mansar')) {
            return '29 rue François Mansart, 83100 Toulon';
        }
        return raw;
    };

    const renderTierBadge = (profile: Profile) => {
        const tier = getEffectiveTier(profile);
        switch (tier) {
            case 'ADMIN':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-purple-50 border border-purple-200 text-purple-700"><Shield size={12}/> Admin</span>;
            case 'PREMIUM':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 border border-amber-300 text-amber-900 shadow-2xs" title={profile.stripe_payment_id ? `Payé sur Stripe (${profile.stripe_payment_id})` : 'Payant 400 €'}>
                        <span>⭐</span> Payé Stripe (400 €)
                    </span>
                );
            case 'LEGACY':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 border border-amber-200 text-amber-800" title="Ancien élève transféré sans paiement"><History size={12}/> Transfert Marc (Gratuit)</span>;
            case 'FREE':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700"><Gift size={12}/> Accès Offert</span>;
            case 'TRIAL':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 border border-blue-200 text-blue-700"><Clock size={12}/> Essai 24h</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 border border-slate-200 text-slate-500">Gratuit Découverte</span>;
        }
    };

    const renderStatusBadge = (profile: Profile) => {
        const expired = isExpired(profile.expires_at);
        if (!profile.is_active) {
            return <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"/><span className="text-xs font-medium text-slate-600">Verrouillé</span></div>;
        }
        if (expired) {
            return <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-400"/><span className="text-xs font-medium text-slate-600">Expiré</span></div>;
        }
        if (profile.access_tier === 'trial' && profile.expires_at) {
            return <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"/><span className="text-xs font-medium text-slate-600">En cours d'essai</span></div>;
        }
        return <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"/><span className="text-xs font-medium text-slate-700">Actif</span></div>;
    };

    return (
        <div className="w-full h-full animate-fade-in relative z-10 flex bg-slate-50 overflow-hidden min-h-0 admin-scope font-sans">
            {/* MAIN VIEW */}
            <div className={cn("flex-1 flex flex-col h-full min-w-0 min-h-0 bg-[#FAF6ED] transition-all duration-300", (selectedProfile && activeTab === 'users') ? "mr-0 xl:mr-[400px]" : "mr-0")}>
                {/* TOOLBAR */}
                <div className="flex-none pt-[max(env(safe-area-inset-top),12px)] px-3 sm:px-4 md:px-6 pb-2 sm:pb-0 border-b border-slate-200 bg-white shadow-sm z-20">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-6 max-w-6xl mx-auto mb-3 sm:mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 leading-tight">Tour de contrôle</h1>
                                    <p className="text-slate-500 font-normal text-xs sm:text-sm mt-0.5">Gestion des accès et statistiques</p>
                                </div>
                                {activeTab === 'payments' && (
                                    <button
                                        onClick={() => openPaymentsListingWindow(filteredPaidOrders, selectedMonthLabel)}
                                        className="sm:hidden px-3 py-1.5 bg-[#0F172A] text-white hover:bg-[#1E293B] font-medium text-[11px] rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer touch-manipulation"
                                        title="Imprimer ou enregistrer le listing en PDF A4"
                                    >
                                        <Printer size={13} className="text-emerald-400" />
                                        <span>Relevé A4</span>
                                    </button>
                                )}
                                {activeTab === 'compta' && (
                                    <button
                                        onClick={() => openMarcTransferSheetWindow(partnerSales, feeMode)}
                                        className="sm:hidden px-3 py-1.5 bg-blue-700 text-white hover:bg-blue-800 font-medium text-[11px] rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer touch-manipulation"
                                        title="Fiche Virement Marc"
                                    >
                                        <FileText size={13} className="text-amber-300" />
                                        <span>Virement</span>
                                    </button>
                                )}
                            </div>
                            
                            {/* VIEW TOGGLE */}
                            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 shadow-inner overflow-x-auto no-scrollbar max-w-full -mx-1 px-1">
                                <button 
                                    onClick={() => setActiveTab('users')} 
                                    className={cn(
                                        "px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap", 
                                        activeTab === 'users' ? "bg-white shadow text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    👥 Élèves
                                </button>
                                <button 
                                    onClick={() => setActiveTab('payments')} 
                                    className={cn(
                                        "px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap", 
                                        activeTab === 'payments' ? "bg-white shadow text-emerald-800 font-semibold" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    <CreditCard size={13} className={activeTab === 'payments' ? "text-emerald-600" : "text-slate-400"} />
                                    <span className="hidden sm:inline">Paiements déjà effectués</span>
                                    <span className="sm:hidden">Paiements</span>
                                    <span className="ml-0.5 sm:ml-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-semibold">
                                        {paidStripeUsers}
                                    </span>
                                </button>
                                <button 
                                    onClick={() => setActiveTab('compta')} 
                                    className={cn(
                                        "px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap", 
                                        activeTab === 'compta' ? "bg-white shadow text-blue-900 font-semibold" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    <span className="hidden sm:inline">💰 Bilan Damoiseaux (50%)</span>
                                    <span className="sm:hidden">💰 Bilan Marc</span>
                                </button>
                                <button 
                                    onClick={() => setActiveTab('analytics')} 
                                    className={cn(
                                        "px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap", 
                                        activeTab === 'analytics' ? "bg-white shadow text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    📊 Trafic
                                </button>
                            </div>
                        </div>

                        {activeTab === 'payments' && (
                            <div className="hidden sm:flex items-center gap-3">
                                <button
                                    onClick={() => openPaymentsListingWindow(filteredPaidOrders, selectedMonthLabel)}
                                    className="px-4 py-2 bg-[#0F172A] text-white hover:bg-[#1E293B] font-medium text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                                    title="Imprimer ou enregistrer le listing en PDF A4"
                                >
                                    <Printer size={14} className="text-emerald-400" />
                                    <span>Imprimer Listing (PDF)</span>
                                </button>
                            </div>
                        )}

                        {activeTab === 'compta' && (
                            <div className="hidden sm:flex items-center gap-3">
                                <button
                                    onClick={() => openDamoiseauxSummaryWindow(partnerSales)}
                                    className="px-4 py-2 bg-[#0F172A] text-white hover:bg-[#1E293B] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <Printer size={14} className="text-amber-400" />
                                    <span>Imprimer Bilan Marc Damoiseaux (PDF)</span>
                                </button>
                            </div>
                        )}
                        
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
                                { id: 'PREMIUM', label: 'Payés Stripe (400€)', icon: '👑' },
                                { id: 'LEGACY', label: 'Transferts Marc', icon: '📜' },
                                { id: 'STANDARD', label: 'Gratuits Découverte', icon: '⚪' },
                                { id: 'FREE', label: 'Offerts', icon: '🎁' },
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
                {activeTab === 'users' && (
                    /* THE SYNTHETIC TABLE */
                    <div className="flex-1 overflow-y-auto w-full max-w-6xl mx-auto px-4 md:px-6 py-6 pb-[120px] will-change-scroll">
                        <div className="bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden relative">
                            {loading ? (
                                <div className="p-12 text-center text-slate-400">Chargement des données...</div>
                            ) : filteredProfiles.length === 0 ? (
                                <div className="p-12 text-center text-slate-400">Aucun résultat.</div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {filteredProfiles.map((p) => {
                                        const paid = isPaidUser(p);
                                        const location = getProfileLocation(p);
                                        const isSelected = selectedProfile?.id === p.id;
                                        return (
                                            <div 
                                                key={p.id} 
                                                onClick={() => setSelectedProfile(p)}
                                                className={cn(
                                                    "cursor-pointer hover:bg-slate-50/80 transition-colors",
                                                    isSelected && "bg-slate-50/90"
                                                )}
                                            >
                                                {/* 1. VUE MOBILE (iPhone 17 Pro Max 440px - Tout est 100% visible, zéro coupure) */}
                                                <div className={cn(
                                                    "md:hidden p-3.5 space-y-2 relative border-b border-slate-100",
                                                    isSelected && "border-l-4 border-l-primary bg-slate-50"
                                                )}>
                                                    {/* Ligne 1 : Nom + Étoile Payé + Statut */}
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                                            <span className="font-semibold text-slate-900 text-sm">
                                                                {p.first_name || p.last_name ? `${p.first_name || ''} ${p.last_name || ''}` : <span className="italic">Inconnu</span>}
                                                            </span>
                                                            {paid && (
                                                                <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.2 rounded-md text-[10px] font-semibold" title="Client Payé Stripe (400€)">
                                                                    <span>⭐</span> Payé
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            {renderStatusBadge(p)}
                                                            <ChevronRight size={16} className={cn("text-slate-300", isSelected && "text-primary")} />
                                                        </div>
                                                    </div>

                                                    {/* Ligne 2 : Profession (Entièrement visible, sans coupure de Kinésithérapeute) */}
                                                    {p.profession && (
                                                        <div className="pt-0.5">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50/80 text-blue-900 text-xs font-medium border border-blue-200/60 leading-normal">
                                                                {p.profession}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Ligne 3 : E-mail & Date */}
                                                    <div className="flex items-center justify-between text-xs text-slate-500 gap-2">
                                                        <span className="truncate text-slate-600">{p.email}</span>
                                                        <span className="text-[11px] text-slate-400 shrink-0">
                                                            {new Date(p.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: '2-digit' })}
                                                        </span>
                                                    </div>

                                                    {/* Ligne 4 : Ville & Adresse (ex: 29 rue François Mansart, 83100 Toulon) */}
                                                    {location && (
                                                        <div className="text-xs text-slate-700 bg-[#FAF8F5] border border-[#EFE9DE] px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                                                            <MapPin size={12} className="text-[#F27D33] shrink-0" />
                                                            <span className="font-medium text-[11.5px] leading-tight">{location}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* 2. VUE DESKTOP (Tableau synthétique harmonieux) */}
                                                <div className={cn(
                                                    "hidden md:flex items-center justify-between p-4 px-6 border-b border-slate-100 relative",
                                                    isSelected && "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary"
                                                )}>
                                                    <div className="flex items-center gap-4 w-[45%]">
                                                        <div className="relative h-10 w-10 shrink-0 rounded-full bg-slate-100 text-slate-600 font-semibold items-center justify-center text-sm uppercase flex">
                                                            {p.first_name?.[0] || ''}{p.last_name?.[0] || ''}
                                                            {!p.first_name && !p.last_name && p.email?.[0]}
                                                            {paid && (
                                                                <span className="absolute -top-1 -right-1 text-xs" title="Payé Stripe (400€)">⭐</span>
                                                            )}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5 flex-wrap">
                                                                <span>{p.first_name || p.last_name ? `${p.first_name || ''} ${p.last_name || ''}` : <span className="italic">Inconnu</span>}</span>
                                                                {paid && (
                                                                    <span className="text-amber-700 text-[10px] font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-flex items-center gap-0.5">
                                                                        ⭐ Payé
                                                                    </span>
                                                                )}
                                                                {location && (
                                                                    <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 border border-slate-200/60">
                                                                        <MapPin size={9} className="text-[#F27D33]" />
                                                                        {location}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-slate-500 font-normal flex items-center gap-1.5 mt-0.5 flex-wrap">
                                                                <span className="text-slate-600">{p.email}</span>
                                                                {p.profession && (
                                                                    <>
                                                                        <span className="opacity-40">•</span>
                                                                        <span className="text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded font-medium text-[11px] border border-blue-100">{p.profession}</span>
                                                                    </>
                                                                )}
                                                                <span className="opacity-40">•</span>
                                                                <span className="text-[10.5px] text-slate-400">{new Date(p.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="w-[25%] flex items-center">
                                                        {renderTierBadge(p)}
                                                    </div>

                                                    <div className="w-[20%] flex items-center justify-start">
                                                        {renderStatusBadge(p)}
                                                    </div>

                                                    <div className="w-[10%] flex justify-end">
                                                        <ChevronRight size={18} className={cn("text-slate-300 group-hover:text-primary transition-colors", isSelected && "text-primary")} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    /* THE ANALYTICS VIEW */
                    <div className="flex-1 overflow-y-auto w-full max-w-6xl mx-auto px-4 md:px-6 py-6 pb-[120px] will-change-scroll space-y-6">
                        {/* METRICS CARDS */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-medium text-slate-500 block">Total Inscrits</span>
                                    <span className="text-3xl font-semibold text-slate-900 font-mono block mt-1">{totalUsers}</span>
                                </div>
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <Users size={22} />
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-medium text-emerald-700 block">Clients Stripe (400€)</span>
                                    <span className="text-3xl font-semibold text-emerald-600 font-mono block mt-1">{paidStripeUsers}</span>
                                </div>
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Crown size={22} />
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-medium text-slate-500 block">Inscrits Découverte</span>
                                    <span className="text-3xl font-semibold text-slate-800 font-mono block mt-1">
                                        {standardUsers}
                                        {legacyUsers > 0 && (
                                            <span className="text-xs font-sans font-medium text-amber-600 ml-2">
                                                (+{legacyUsers} libre)
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                                    <Users size={22} />
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-medium text-slate-500 block">Taux Conversion</span>
                                    <span className="text-3xl font-semibold text-slate-900 font-mono block mt-1">
                                        {conversionRate}%
                                        <span className="text-xs font-sans font-normal text-slate-400 ml-2">
                                            ({paidStripeUsers} / {totalUsers})
                                        </span>
                                    </span>
                                </div>
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                    <TrendingUp size={22} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* MOCK VISITS CHART */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] lg:col-span-2 space-y-4">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-800 text-base">
                                                    {timeframe === 'week' ? 'Trafic Hebdomadaire' : timeframe === 'month' ? 'Trafic Mensuel' : 'Trafic Annuel'}
                                                </h3>
                                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full flex items-center gap-1 shadow-sm">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                    Direct Google Analytics
                                                </span>
                                            </div>
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

                                    {/* DYNAMIC SVG LINE CHART */}
                                    <div className="w-full h-64 pt-4 relative">
                                        {isLoadingGa && (
                                            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-xl">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
                                                    <span className="text-[10px] font-bold text-slate-500">Chargement de Google Analytics...</span>
                                                </div>
                                            </div>
                                        )}
                                        <svg className="w-full h-full" viewBox="0 0 600 240">
                                            {/* Grid */}
                                            <line x1="40" y1="40" x2="570" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                                            <line x1="40" y1="100" x2="570" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                                            <line x1="40" y1="160" x2="570" y2="160" stroke="#f1f5f9" strokeWidth="1" />
                                            <line x1="40" y1="220" x2="570" y2="220" stroke="#e2e8f0" strokeWidth="1.5" />

                                            {/* Left Y-axis labels dynamically calculated */}
                                            <text x="5" y="44" fill="#94a3b8" fontSize="9" fontWeight="bold">{formatValue(chartMaxVal)}</text>
                                            <text x="5" y="104" fill="#94a3b8" fontSize="9" fontWeight="bold">{formatValue(Math.round(chartMaxVal * 2 / 3))}</text>
                                            <text x="5" y="164" fill="#94a3b8" fontSize="9" fontWeight="bold">{formatValue(Math.round(chartMaxVal * 1 / 3))}</text>
                                            <text x="20" y="224" fill="#94a3b8" fontSize="9" fontWeight="bold">0</text>

                                            {/* Area under lines */}
                                            {pvAreaString && (
                                                <path d={pvAreaString} fill="url(#indigoGrad)" opacity="0.04" />
                                            )}
                                            {uvAreaString && (
                                                <path d={uvAreaString} fill="url(#tealGrad)" opacity="0.04" />
                                            )}

                                            {/* Page Views Path (Indigo) */}
                                            {pvPolylineString && (
                                                <polyline
                                                    points={pvPolylineString}
                                                    fill="none"
                                                    stroke="#6366f1"
                                                    strokeWidth="3.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            )}

                                            {/* Unique Visits Path (Teal) */}
                                            {uvPolylineString && (
                                                <polyline
                                                    points={uvPolylineString}
                                                    fill="none"
                                                    stroke="#14b8a6"
                                                    strokeWidth="3.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            )}

                                            {/* Dots & Labels for Page Views (Indigo) */}
                                            {pointsPv.map((pt, idx) => (
                                                <g key={`pv-pt-${idx}`}>
                                                    <circle cx={pt.x} cy={pt.y} r={timeframe === 'month' && pointsPv.length > 15 ? "2" : "3.5"} fill="#6366f1" stroke="#ffffff" strokeWidth="1" />
                                                    {(timeframe !== 'month' || pointsPv.length <= 15 || idx % 3 === 0) && (
                                                        <text x={pt.x} y={pt.y - 7} fill="#4f46e5" fontSize="8" fontWeight="bold" textAnchor="middle">
                                                            {formatValue(pt.val)}
                                                        </text>
                                                    )}
                                                </g>
                                            ))}

                                            {/* Dots & Labels for Unique Visits (Teal) */}
                                            {pointsUv.map((pt, idx) => (
                                                <g key={`uv-pt-${idx}`}>
                                                    <circle cx={pt.x} cy={pt.y} r={timeframe === 'month' && pointsUv.length > 15 ? "2" : "3.5"} fill="#14b8a6" stroke="#ffffff" strokeWidth="1" />
                                                    {(timeframe !== 'month' || pointsUv.length <= 15 || idx % 3 === 0) && (
                                                        <text x={pt.x} y={pt.y + 11} fill="#0d9488" fontSize="8" fontWeight="bold" textAnchor="middle">
                                                            {formatValue(pt.val)}
                                                        </text>
                                                    )}
                                                </g>
                                            ))}

                                            {/* X-axis labels */}
                                            {pointsPv.map((pt, idx) => {
                                                if (timeframe === 'month' && pointsPv.length > 15 && idx % 4 !== 0) {
                                                    return null;
                                                }
                                                return (
                                                    <text key={`x-lbl-${idx}`} x={pt.x} y="235" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
                                                        {pt.label}
                                                    </text>
                                                );
                                            })}

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
                                    {/* PAYS VISITEURS */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] space-y-4">
                                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5"><Globe size={16} className="text-teal-600"/> Pays Visiteurs</h4>
                                        <div className="space-y-3">
                                            {topCountries && topCountries.length > 0 ? (
                                                topCountries.map((item, idx) => {
                                                    const totalAcc = topCountries.reduce((acc, curr) => acc + curr.activeUsers, 0);
                                                    const percent = totalAcc > 0 ? Math.round((item.activeUsers / totalAcc) * 100) : 0;
                                                    return (
                                                        <div key={idx} className="space-y-1">
                                                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                                                <span>{item.country}</span>
                                                                <span>{item.activeUsers} ({percent}%)</span>
                                                            </div>
                                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${percent}%` }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-xs font-semibold text-slate-400 py-4 text-center">Aucune donnée géographique</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* CONCEPTS PLUS LUS */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] space-y-4">
                                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">📖 Concepts les plus consultés</h4>
                                        <div className="space-y-3 text-xs font-bold text-slate-700">
                                            {topConcepts && topConcepts.length > 0 ? (
                                                topConcepts.map((item, idx) => {
                                                    let name = item.pagePath;
                                                    if (name === '/') {
                                                        name = 'Page d\'accueil';
                                                    } else if (name.startsWith('/concept/')) {
                                                        const cleanSlug = name.replace('/concept/', '');
                                                        name = cleanSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                                                    }
                                                    return (
                                                        <div key={idx} className="flex justify-between items-center">
                                                            <span className="truncate max-w-[200px]">{idx + 1}. {name}</span>
                                                            <span className="text-slate-400 font-bold shrink-0">{item.pageViews} vues</span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-xs font-semibold text-slate-400 py-4 text-center">Aucun concept visité</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                )}

                {/* TAB: PAIEMENTS DÉJÀ EFFECTUÉS */}
                {activeTab === 'payments' && (
                    <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 min-h-0 bg-[#FAF6ED] pb-[140px]">
                        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                            {/* Header Banner */}
                            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-900" />
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium mb-1.5 sm:mb-2">
                                            <Receipt size={12} className="text-emerald-600" />
                                            <span>Registre des Règlements Encaissés (Stripe)</span>
                                        </div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight font-sans">
                                            Paiements déjà effectués
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1 max-w-2xl leading-relaxed">
                                            Listing chronologique et comptable des inscriptions réglées par carte bancaire. Filtrez par mois pour vérifier qui a payé, à quelle date, le montant perçu et le total encaissé.
                                        </p>
                                    </div>
                                    <div className="hidden sm:flex flex-wrap items-center gap-2.5 shrink-0">
                                        <button
                                            onClick={() => openPaymentsListingWindow(filteredPaidOrders, selectedMonthLabel)}
                                            className="px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                                            title="Imprimer ou enregistrer le listing en PDF A4"
                                        >
                                            <Printer size={15} className="text-emerald-400" />
                                            <span>Imprimer Relevé A4</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Month Filter Bar */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 mt-4 sm:mt-6">
                                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                        <Calendar size={16} className="text-emerald-600 shrink-0" />
                                        <label className="text-xs font-medium text-slate-600 shrink-0">Période :</label>
                                        <div className="relative flex-1 sm:w-64">
                                            <select
                                                value={paymentMonthFilter}
                                                onChange={(e) => setPaymentMonthFilter(e.target.value)}
                                                className="w-full appearance-none bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs cursor-pointer"
                                            >
                                                {MONTHS_LIST.map(m => {
                                                    const count = m.key === 'ALL' 
                                                        ? paidOrders.length 
                                                        : paidOrders.filter(o => o.monthKey === m.key).length;
                                                    return (
                                                        <option key={m.key} value={m.key}>
                                                            {m.label} ({count} {count > 1 ? 'règlements' : 'règlement'})
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <ChevronRight size={14} className="rotate-90 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                                        </div>
                                    </div>

                                    {/* Quick Pills */}
                                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pt-1 sm:pt-0 -mx-1 px-1">
                                        <button
                                            onClick={() => setPaymentMonthFilter('ALL')}
                                            className={cn(
                                                "px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                                                paymentMonthFilter === 'ALL' ? "bg-emerald-700 text-white shadow-xs" : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/70"
                                            )}
                                        >
                                            Tous ({paidOrders.length})
                                        </button>
                                        <button
                                            onClick={() => setPaymentMonthFilter('2026-09')}
                                            className={cn(
                                                "px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                                                paymentMonthFilter === '2026-09' ? "bg-emerald-700 text-white shadow-xs" : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/70"
                                            )}
                                        >
                                            Sept. 2026
                                        </button>
                                        <button
                                            onClick={() => setPaymentMonthFilter('2026-06')}
                                            className={cn(
                                                "px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                                                paymentMonthFilter === '2026-06' ? "bg-emerald-700 text-white shadow-xs" : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/70"
                                            )}
                                        >
                                            Juin 2026
                                        </button>
                                        <button
                                            onClick={() => setPaymentMonthFilter('2026-12')}
                                            className={cn(
                                                "px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                                                paymentMonthFilter === '2026-12' ? "bg-emerald-700 text-white shadow-xs" : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/70"
                                            )}
                                        >
                                            Déc. 2026
                                        </button>
                                    </div>
                                </div>

                                {/* KPI Summary Cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mt-4 sm:mt-6">
                                    <div className="bg-[#FAF8F5] border border-[#EFE9DE] rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                        <p className="text-xs font-medium text-slate-500">Règlements</p>
                                        <p className="text-xl sm:text-2xl font-mono font-semibold text-slate-900 mt-0.5 sm:mt-1">{filteredPaidOrders.length}</p>
                                        <p className="text-[11px] text-emerald-600 font-medium mt-0.5 sm:mt-1 truncate">
                                            {paymentMonthFilter === 'ALL' ? 'Sur l\'année 2026' : selectedMonthLabel}
                                        </p>
                                    </div>
                                    <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                        <p className="text-xs font-medium text-emerald-800">Total Brut</p>
                                        <p className="text-xl sm:text-2xl font-mono font-semibold text-emerald-700 mt-0.5 sm:mt-1">{filteredTotalBrut.toFixed(2)} €</p>
                                        <p className="text-[11px] text-emerald-700/80 font-normal mt-0.5 sm:mt-1">400,00 € / praticien</p>
                                    </div>
                                    <div className="bg-[#FAF8F5] border border-[#EFE9DE] rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                        <p className="text-xs font-medium text-slate-500">Frais Stripe</p>
                                        <p className="text-xl sm:text-2xl font-mono font-semibold text-red-600 mt-0.5 sm:mt-1">-{filteredTotalStripeFees.toFixed(2)} €</p>
                                        <p className="text-[11px] text-slate-500 font-normal mt-0.5 sm:mt-1">~1,5% + 0,25 €</p>
                                    </div>
                                    <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                        <p className="text-xs font-medium text-blue-800">Net Trésorerie</p>
                                        <p className="text-xl sm:text-2xl font-mono font-semibold text-blue-700 mt-0.5 sm:mt-1">{filteredTotalNet.toFixed(2)} €</p>
                                        <p className="text-[11px] text-blue-700/80 font-normal mt-0.5 sm:mt-1">Avant rétrocession</p>
                                    </div>
                                </div>
                            </div>

                            {/* Toast Notification Envoi Email Réussi */}
                            {emailNotification && (
                                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <div className="min-w-0 text-xs">
                                            <div className="font-semibold truncate">Email de facturation prêt & adressé à {emailNotification.name}</div>
                                            <div className="text-[11px] text-emerald-700 font-mono truncate">{emailNotification.email} • Envoi initialisé à {emailNotification.time}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setEmailNotification(null)}
                                        className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer shrink-0"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Listing Table Card */}
                            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                                <div className="p-4 sm:p-5 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                                    <div>
                                        <h3 className="font-semibold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                                            <span>Listing des Règlements</span>
                                            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                                {selectedMonthLabel}
                                            </span>
                                        </h3>
                                        <p className="text-xs text-slate-500 font-normal mt-0.5">
                                            Détail des praticiens ayant payé, horodatage, montants et justificatifs officiels
                                        </p>
                                    </div>
                                    <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full self-start sm:self-auto">
                                        {filteredPaidOrders.length} {filteredPaidOrders.length > 1 ? 'règlements' : 'règlement'}
                                    </span>
                                </div>

                                {filteredPaidOrders.length === 0 ? (
                                    <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center shadow-inner">
                                            <Calendar size={28} />
                                        </div>
                                        <h4 className="font-semibold text-slate-800 text-sm sm:text-base">Aucun paiement enregistré pour {selectedMonthLabel}</h4>
                                        <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                                            Il n'y a pas eu d'encaissement Stripe sur cette période. Le total pour ce mois est actuellement de <strong className="text-slate-700 font-semibold">0,00 €</strong>.<br />
                                            Dès qu'un praticien effectuera son règlement, son nom, son email, sa date exacte et sa facture PDF apparaîtront automatiquement ici.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* 1. VUE MOBILE (iPhone 17 Pro Max 440px) */}
                                        <div className="md:hidden divide-y divide-slate-100">
                                            {filteredPaidOrders.map((o) => (
                                                <div key={o.id} className="p-3.5 space-y-2.5 hover:bg-slate-50/60 transition-colors">
                                                    {/* Header: Nom + Badge + Montant */}
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                <h4 className="font-semibold text-slate-900 text-sm">{o.name}</h4>
                                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-200">
                                                                    <CheckCircle2 size={10} className="text-emerald-600" />
                                                                    Payé
                                                                </span>
                                                            </div>
                                                            <div className="text-[11px] text-slate-500 truncate mt-0.5">{o.email}</div>
                                                            <div className="text-[10.5px] text-slate-400 mt-0.5">
                                                                {o.profession || 'Praticien'} {o.location ? `• ${o.location}` : ''}
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <div className="font-mono font-semibold text-emerald-700 text-base">
                                                                +{o.amount.toFixed(2)} €
                                                            </div>
                                                            <div className="text-[10px] font-mono text-red-500">
                                                                Frais: -6,25 €
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Date & Réf Stripe */}
                                                    <div className="flex items-center justify-between text-[11px] bg-slate-50 rounded-xl p-2 px-2.5 border border-slate-100">
                                                        <div className="flex items-center gap-1.5 text-slate-600 font-normal">
                                                            <Clock size={12} className="text-slate-400 shrink-0" />
                                                            <span>{o.dateTime}</span>
                                                        </div>
                                                        <div className="font-mono text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 max-w-[150px] truncate">
                                                            {o.stripePaymentId}
                                                        </div>
                                                    </div>

                                                    {/* Actions Facture : PDF, Email tracé, Partager WhatsApp / SMS */}
                                                    <div className="space-y-1.5 pt-0.5">
                                                        <div className="grid grid-cols-2 gap-1.5">
                                                            <button
                                                                onClick={() => openInvoiceWindow({
                                                                    firstName: o.profile.first_name,
                                                                    lastName: o.profile.last_name,
                                                                    email: o.email,
                                                                    profession: o.profession,
                                                                    address: o.profile.address,
                                                                    location: o.location,
                                                                    stripePaymentId: o.stripePaymentId,
                                                                    createdAt: o.profile.created_at
                                                                })}
                                                                className="py-2 px-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-xs shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95 transition-all"
                                                                title="Voir et imprimer la facture officielle FeelProd"
                                                            >
                                                                <FileText size={13} className="text-amber-600 shrink-0" />
                                                                <span>Facture PDF</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleSendInvoiceEmail(o.id, {
                                                                    firstName: o.profile.first_name,
                                                                    lastName: o.profile.last_name,
                                                                    email: o.email,
                                                                    profession: o.profession,
                                                                    address: o.profile.address,
                                                                    location: o.location,
                                                                    stripePaymentId: o.stripePaymentId,
                                                                    createdAt: o.profile.created_at
                                                                })}
                                                                className={cn(
                                                                    "py-2 px-2 border font-medium rounded-xl text-xs shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95 transition-all",
                                                                    sentInvoiceEmails[o.id]
                                                                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                                                        : "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800"
                                                                )}
                                                                title="Envoyer la facture par email à l'apprenant"
                                                            >
                                                                {sentInvoiceEmails[o.id] ? (
                                                                    <>
                                                                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                                                                        <span className="truncate font-semibold">✓ Envoyé ({sentInvoiceEmails[o.id]})</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Mail size={13} className="text-blue-600 shrink-0" />
                                                                        <span>Envoyer Email</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>

                                                        {/* Options de Partage directes : WhatsApp & SMS */}
                                                        <div className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                                                            <span className="text-[10.5px] font-medium text-slate-500 shrink-0">Partager :</span>
                                                            <div className="flex items-center gap-1.5 shrink-0">
                                                                <button
                                                                    onClick={() => openWhatsAppForInvoice({
                                                                        firstName: o.profile.first_name,
                                                                        lastName: o.profile.last_name,
                                                                        email: o.email,
                                                                        profession: o.profession,
                                                                        address: o.profile.address,
                                                                        location: o.location,
                                                                        stripePaymentId: o.stripePaymentId,
                                                                        createdAt: o.profile.created_at
                                                                    })}
                                                                    className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-700 font-medium rounded-lg border border-slate-200 hover:border-emerald-300 text-[10.5px] transition-all flex items-center gap-1 cursor-pointer"
                                                                    title="Ouvrir WhatsApp dans un nouvel onglet"
                                                                >
                                                                    <span>💬 WhatsApp</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => openSmsForInvoice({
                                                                        firstName: o.profile.first_name,
                                                                        lastName: o.profile.last_name,
                                                                        email: o.email,
                                                                        profession: o.profession,
                                                                        address: o.profile.address,
                                                                        location: o.location,
                                                                        stripePaymentId: o.stripePaymentId,
                                                                        createdAt: o.profile.created_at
                                                                    })}
                                                                    className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-200 text-[10.5px] transition-all flex items-center gap-1 cursor-pointer"
                                                                    title="Partager par SMS"
                                                                >
                                                                    <span>📱 SMS</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Mobile Total Bar */}
                                            <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex items-center justify-between text-xs">
                                                <div>
                                                    <span className="font-semibold text-slate-700 text-xs">Total ({selectedMonthLabel})</span>
                                                    <div className="text-[11px] text-slate-500 mt-0.5">Net : {filteredTotalNet.toFixed(2)} €</div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-mono font-semibold text-emerald-700 text-base">+{filteredTotalBrut.toFixed(2)} €</span>
                                                    <div className="text-[10px] font-mono text-red-500">Frais: -{filteredTotalStripeFees.toFixed(2)} €</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 2. VUE DESKTOP (Tableau classique) */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500">
                                                        <th className="py-3 px-4 font-semibold">Date & Heure</th>
                                                        <th className="py-3 px-4 font-semibold">Praticien / Acheteur</th>
                                                        <th className="py-3 px-4 text-center font-semibold">Réf. Stripe</th>
                                                        <th className="py-3 px-4 text-right font-semibold">Frais Stripe</th>
                                                        <th className="py-3 px-4 text-right font-semibold">Montant Encaissé</th>
                                                        <th className="py-3 px-4 text-right font-semibold">Actions Facture</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 text-xs">
                                                    {filteredPaidOrders.map((o) => (
                                                        <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                                                            <td className="py-4 px-4 font-mono text-slate-600 whitespace-nowrap">
                                                                <div className="font-medium text-slate-900">{o.date}</div>
                                                                <div className="text-[11px] text-slate-400">{o.dateTime.split(' ')[1] || ''}</div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="font-semibold text-slate-900 text-sm">{o.name}</div>
                                                                <div className="text-xs text-slate-500">{o.email}</div>
                                                                <div className="text-[11px] text-slate-400 mt-0.5">
                                                                    {o.profession || 'Praticien'} {o.location ? `• ${o.location}` : ''}
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4 text-center whitespace-nowrap">
                                                                <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                                                                    {o.stripePaymentId}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-4 text-right font-mono text-red-600 whitespace-nowrap">
                                                                -6,25 €
                                                            </td>
                                                            <td className="py-4 px-4 text-right whitespace-nowrap">
                                                                <span className="font-mono font-semibold text-emerald-700 text-base">
                                                                    +{o.amount.toFixed(2)} €
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-4 text-right whitespace-nowrap">
                                                                <div className="flex items-center justify-end gap-1.5">
                                                                    <button
                                                                        onClick={() => openInvoiceWindow({
                                                                            firstName: o.profile.first_name,
                                                                            lastName: o.profile.last_name,
                                                                            email: o.email,
                                                                            profession: o.profession,
                                                                            address: o.profile.address,
                                                                            location: o.location,
                                                                            stripePaymentId: o.stripePaymentId,
                                                                            createdAt: o.profile.created_at
                                                                        })}
                                                                        className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg text-xs transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                                                                        title="Voir et imprimer la facture officielle FeelProd"
                                                                    >
                                                                        <FileText size={13} className="text-amber-600" />
                                                                        <span>Facture PDF</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleSendInvoiceEmail(o.id, {
                                                                            firstName: o.profile.first_name,
                                                                            lastName: o.profile.last_name,
                                                                            email: o.email,
                                                                            profession: o.profession,
                                                                            address: o.profile.address,
                                                                            location: o.location,
                                                                            stripePaymentId: o.stripePaymentId,
                                                                            createdAt: o.profile.created_at
                                                                        })}
                                                                        className={cn(
                                                                            "px-2.5 py-1.5 border font-medium rounded-lg text-xs transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer",
                                                                            sentInvoiceEmails[o.id]
                                                                                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                                                                : "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                                                                        )}
                                                                        title="Envoyer la facture par email à l'apprenant"
                                                                    >
                                                                        {sentInvoiceEmails[o.id] ? (
                                                                            <>
                                                                                <CheckCircle2 size={13} className="text-emerald-600" />
                                                                                <span className="font-semibold">✓ Envoyé ({sentInvoiceEmails[o.id]})</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Mail size={13} />
                                                                                <span>Email</span>
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openWhatsAppForInvoice({
                                                                            firstName: o.profile.first_name,
                                                                            lastName: o.profile.last_name,
                                                                            email: o.email,
                                                                            profession: o.profession,
                                                                            address: o.profile.address,
                                                                            location: o.location,
                                                                            stripePaymentId: o.stripePaymentId,
                                                                            createdAt: o.profile.created_at
                                                                        })}
                                                                        className="px-2 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                                                                        title="Partager sur WhatsApp"
                                                                    >
                                                                        <span>💬 WhatsApp</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openSmsForInvoice({
                                                                            firstName: o.profile.first_name,
                                                                            lastName: o.profile.last_name,
                                                                            email: o.email,
                                                                            profession: o.profession,
                                                                            address: o.profile.address,
                                                                            location: o.location,
                                                                            stripePaymentId: o.stripePaymentId,
                                                                            createdAt: o.profile.created_at
                                                                        })}
                                                                        className="px-2 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                                                                        title="Partager par SMS"
                                                                    >
                                                                        <span>📱 SMS</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                {/* Table Footer with Total */}
                                                <tfoot>
                                                    <tr className="bg-slate-50 font-medium border-t-2 border-slate-200 text-slate-900">
                                                        <td colSpan={3} className="py-4 px-4 text-xs font-semibold text-slate-700">
                                                            Total ({selectedMonthLabel}) — {filteredPaidOrders.length} {filteredPaidOrders.length > 1 ? 'règlements' : 'règlement'}
                                                        </td>
                                                        <td className="py-4 px-4 text-right font-mono text-red-600">
                                                            -{filteredTotalStripeFees.toFixed(2)} €
                                                        </td>
                                                        <td className="py-4 px-4 text-right font-mono text-lg font-semibold text-emerald-700">
                                                            {filteredTotalBrut.toFixed(2)} €
                                                        </td>
                                                        <td className="py-4 px-4 text-right text-xs text-slate-500 font-normal">
                                                            Net : {filteredTotalNet.toFixed(2)} €
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Explanatory Info Card */}
                            <div className="bg-[#FAF8F5] border border-[#EFE9DE] rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-xs text-slate-600 space-y-2">
                                <p className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-emerald-600" />
                                    <span>Garantie de Rapprochement Bancaire & Justificatifs Fiscaux</span>
                                </p>
                                <p>
                                    • <strong>Journal des Ventes :</strong> Chaque règlement listé ci-dessus est adossé à un identifiant unique Stripe Checkout (`pi_...`) et à une facture officielle FeelProd acquittée avec TVA et mentions légales.
                                </p>
                                <p>
                                    • <strong>Vérification par Mois :</strong> Vous pouvez sélectionner n'importe quel mois de l'année 2026 (par exemple <em>Décembre 2026</em>) pour connaître le nombre d'apprenants ayant réglé, le montant brut total et le net bancaire correspondant.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'compta' && (
                    <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 min-h-0 bg-[#FAF6ED] pb-[140px]">
                        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                            {/* Header Banner */}
                            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-900 via-slate-900 to-amber-500" />
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-medium mb-1.5 sm:mb-2">
                                            <span>🤝 Protocole d'Édition & Reversement Co-Auteur (50/50)</span>
                                        </div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight font-sans">
                                            Bilan Partenariat — Marc DAMOISEAUX
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1 max-w-2xl leading-relaxed">
                                            Suivi transparent en temps réel des inscriptions réglées sur Stripe Checkout. Les recettes brutes perçues (400,00 € par élève) sont contractuellement réparties à parts égales (50% FeelProd / 50% Marc Damoiseaux).
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                                        <button
                                            onClick={() => openMarcTransferSheetWindow(partnerSales, feeMode)}
                                            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
                                            title="Générer la Fiche d'Ordre de Virement certifiée pour Marc"
                                        >
                                            <FileText size={14} className="text-amber-300" />
                                            <span>Virement PDF</span>
                                        </button>
                                        <button
                                            onClick={() => openEmailForMarcTransfer(partnerSales, feeMode)}
                                            className="px-4 py-2.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 font-medium text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
                                            title="Préparer l'email officiel avec le décompte pour marc@damoiseaux.be"
                                        >
                                            <Mail size={14} className="text-blue-600" />
                                            <span>Email Marc</span>
                                        </button>
                                    </div>
                                </div>

                                {/* KPI Cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mt-4 sm:mt-6">
                                    <div className="bg-[#FAF8F5] border border-[#EFE9DE] rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                        <p className="text-xs font-medium text-slate-500">Ventes Réglées</p>
                                        <p className="text-xl sm:text-2xl font-mono font-semibold text-slate-900 mt-0.5 sm:mt-1">{partnerSales.length}</p>
                                        <p className="text-[11px] text-emerald-600 font-medium mt-0.5 sm:mt-1 truncate">✓ 100% encaissé Stripe</p>
                                    </div>
                                    <div className="bg-[#FAF8F5] border border-[#EFE9DE] rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                        <p className="text-xs font-medium text-slate-500">Total Encaissé</p>
                                        <p className="text-xl sm:text-2xl font-mono font-semibold text-slate-900 mt-0.5 sm:mt-1">{totalBrut.toFixed(2)} €</p>
                                        <p className="text-[11px] text-slate-500 font-normal mt-0.5 sm:mt-1">400,00 € / praticien</p>
                                    </div>
                                    <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                        <p className="text-xs font-medium text-blue-700">Part Marc (50%)</p>
                                        <p className="text-xl sm:text-2xl font-mono font-semibold text-blue-700 mt-0.5 sm:mt-1">{partMarc.toFixed(2)} €</p>
                                        <p className="text-[11px] text-blue-600 font-medium mt-0.5 sm:mt-1 truncate">50% net reversé</p>
                                    </div>
                                    <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                        <p className="text-xs font-medium text-amber-800">Part FeelProd</p>
                                        <p className="text-xl sm:text-2xl font-mono font-semibold text-amber-800 mt-0.5 sm:mt-1">{partFeelProd.toFixed(2)} €</p>
                                        <p className="text-[11px] text-amber-700 font-medium mt-0.5 sm:mt-1 truncate">50% chiffre d'affaires</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sales Table Card */}
                            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                                <div className="p-4 sm:p-5 md:p-6 border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-sm sm:text-base text-slate-900">Détail des Enregistrements & Part Co-Auteur (50/50)</h3>
                                        <p className="text-xs text-slate-500 font-normal mt-0.5">Quote-part nette de 200,00 € par inscription intégrée à l'ordre de virement bancaire</p>
                                    </div>
                                    <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                                        {partnerSales.length} {partnerSales.length > 1 ? 'transactions' : 'transaction'}
                                    </span>
                                </div>

                                {/* 1. VUE MOBILE (iPhone 17 Pro Max 440px) */}
                                <div className="md:hidden divide-y divide-slate-100">
                                    {partnerSales.map((s, idx) => {
                                        return (
                                            <div key={idx} className="p-3.5 space-y-2.5 hover:bg-slate-50/60 transition-colors">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="font-semibold text-slate-900 text-sm">{s.name}</h4>
                                                        <div className="text-[11px] text-slate-500 truncate mt-0.5">{s.email}</div>
                                                        <div className="text-[10.5px] text-slate-400 mt-0.5">
                                                            {s.profession || 'Praticien'} • {s.location || 'France'}
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <div className="font-mono font-medium text-slate-700 text-sm">
                                                            {s.amount.toFixed(2)} €
                                                        </div>
                                                        <div className="font-mono font-semibold text-blue-700 text-xs mt-0.5">
                                                            Marc : {(s.amount / 2).toFixed(2)} €
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-[11px] bg-slate-50 rounded-xl p-2 px-2.5 border border-slate-100">
                                                    <div className="text-slate-600 font-normal">
                                                        {s.date}
                                                    </div>
                                                    <div className="font-mono text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded max-w-[150px] truncate">
                                                        {s.stripePaymentId ? s.stripePaymentId.slice(0, 14) + '...' : 'Stripe'}
                                                    </div>
                                                </div>

                                                {/* Statut virement clair et épuré */}
                                                <div className="flex items-center justify-between bg-emerald-50/70 rounded-xl p-2.5 px-3 border border-emerald-200/80 text-xs text-emerald-900 font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                                                        <span>Quote-part Marc intégrée</span>
                                                    </span>
                                                    <span className="font-mono font-semibold text-emerald-800">
                                                        +{(s.amount / 2).toFixed(2)} €
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* 2. VUE DESKTOP (Tableau classique) */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500">
                                                <th className="py-3 px-4 font-semibold">Date de Règlement</th>
                                                <th className="py-3 px-4 font-semibold">Praticien / Acheteur</th>
                                                <th className="py-3 px-4 text-center font-semibold">Réf. Stripe</th>
                                                <th className="py-3 px-4 text-right font-semibold">Montant Encaissé</th>
                                                <th className="py-3 px-4 text-right font-semibold">Part Marc (50%)</th>
                                                <th className="py-3 px-4 text-right font-semibold">Statut Virement Marc</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs">
                                            {partnerSales.map((s, idx) => {
                                                return (
                                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="py-4 px-4 whitespace-nowrap font-normal text-slate-600">
                                                            {s.date}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="font-semibold text-slate-900 text-sm">{s.name}</div>
                                                            <div className="text-slate-500 text-xs">{s.profession || 'Praticien'} • {s.location || 'France'}</div>
                                                            <div className="text-slate-400 font-mono text-[11px] mt-0.5">{s.email}</div>
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            <span className="inline-block font-mono text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-md">
                                                                {s.stripePaymentId ? s.stripePaymentId.slice(0, 14) + '...' : 'Stripe'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-right font-mono font-medium text-slate-800 text-sm">
                                                            {s.amount.toFixed(2)} €
                                                        </td>
                                                        <td className="py-4 px-4 text-right font-mono font-semibold text-blue-700 text-sm">
                                                            {(s.amount / 2).toFixed(2)} €
                                                        </td>
                                                        <td className="py-4 px-4 text-right whitespace-nowrap">
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                                                                <CheckCircle2 size={13} className="text-emerald-600" />
                                                                ✓ Inclus au virement (+{(s.amount / 2).toFixed(2)} €)
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Explanatory Info Card */}
                            <div className="bg-[#FAF8F5] border border-[#EFE9DE] rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-xs text-slate-600 space-y-2">
                                <p className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-2">
                                    <span>💡</span> Note Comptable & Reversement Co-Auteur
                                </p>
                                <p>
                                    • <strong>Encaissement Stripe :</strong> Les règlements des élèves sont collectés via Stripe Checkout et crédités sur le compte bancaire professionnel LCL de Guillaume Philippe (Masseur-Kinésithérapeute D.E. • Enseigne FEELPROD).
                                </p>
                                <p>
                                    • <strong>Virement à Marc Damoiseaux :</strong> Le virement de la part co-auteur (393,75 € pour les 2 ventes actuelles, après déduction des frais Stripe et hébergement vidéo Cloudflare 100% offert par FeelProd) est à effectuer directement vers le compte bancaire de Marc Damoiseaux (Ostéopathe D.O.). La fiche d'ordre de virement PDF certifiée générée ci-dessus fait office de justificatif contractuel officiel.
                                </p>
                            </div>
                        </div>
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
                                        <span className="text-slate-500">Adresse</span>
                                        <span className="font-medium text-slate-800 inline-flex items-center gap-1">
                                            {(getProfileLocation(selectedProfile) || selectedProfile.location || selectedProfile.address) && <MapPin size={13} className="text-[#F27D33]" />}
                                            {getProfileLocation(selectedProfile) || selectedProfile.address || selectedProfile.location || '-'}
                                        </span>
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
                                                <option value="STANDARD">⚪ Gratuit Découverte (Non Payé)</option>
                                                <option value="PREMIUM">👑 Payé Stripe (Plein Tarif 400 €)</option>
                                                <option value="LEGACY">📜 Transfert Ancien Élève (Marc - Gratuit)</option>
                                                <option value="FREE">🎁 Accès Offert (Cadeau)</option>
                                                <option value="TRIAL">⏱️ Essai 24h</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <ChevronRight size={16} className="rotate-90" />
                                            </div>
                                        </div>

                                        {/* BOUTON RAPIDE 1-CLIC : RÉOUVRIR L'ACCÈS LIBRE (ANCIEN ÉLÈVE MARC) */}
                                        {getEffectiveTier(selectedProfile) === 'STANDARD' && (
                                            <button 
                                                type="button"
                                                onClick={() => updateTier(selectedProfile.id, 'LEGACY')}
                                                className="w-full mt-2 py-2.5 px-3 rounded-xl font-bold text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
                                            >
                                                <Sparkles size={14} className="text-amber-600" />
                                                🔓 Réouvrir en Accès Libre (Ancien Élève)
                                            </button>
                                        )}

                                        {getEffectiveTier(selectedProfile) === 'LEGACY' && (
                                            <button 
                                                type="button"
                                                onClick={() => updateTier(selectedProfile.id, 'STANDARD')}
                                                className="w-full mt-2 py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
                                            >
                                                <Lock size={14} className="text-slate-500" />
                                                🔒 Repasser en Gratuit Découverte (Verrouiller)
                                            </button>
                                        )}
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
                            
                            {/* Facturation Stripe & Facture Officielle */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2 flex items-center gap-2">
                                    <Crown size={14} /> Facturation & Règlement
                                </h3>
                                <p className="text-xs text-indigo-900/70 mb-3 leading-relaxed">
                                    Identifiant de transaction Stripe lié à ce compte. Vous pouvez imprimer ou télécharger la facture officielle FeelProd.
                                </p>
                                <div className="bg-white border text-sm border-slate-200 rounded-xl p-3 mb-3 text-slate-700 max-h-32 overflow-y-auto break-all font-mono text-[10px]">
                                    {selectedProfile.stripe_payment_id || "Aucun paiement Stripe enregistré en base."}
                                </div>
                                <button
                                    onClick={() => openInvoiceWindow({
                                        firstName: selectedProfile.first_name,
                                        lastName: selectedProfile.last_name,
                                        email: selectedProfile.email,
                                        profession: selectedProfile.profession,
                                        address: selectedProfile.address,
                                        location: selectedProfile.location,
                                        stripePaymentId: selectedProfile.stripe_payment_id,
                                        createdAt: selectedProfile.created_at
                                    })}
                                    className="w-full py-2.5 mb-2 rounded-xl text-slate-800 bg-white border border-slate-300 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <FileText size={16} className="text-amber-600" /> 📄 Générer la Facture FeelProd (PDF)
                                </button>
                                <button
                                    onClick={() => shareInvoice({
                                        firstName: selectedProfile.first_name,
                                        lastName: selectedProfile.last_name,
                                        email: selectedProfile.email,
                                        profession: selectedProfile.profession,
                                        address: selectedProfile.address,
                                        location: selectedProfile.location,
                                        stripePaymentId: selectedProfile.stripe_payment_id,
                                        createdAt: selectedProfile.created_at
                                    })}
                                    className="w-full py-2.5 mb-2 rounded-xl text-emerald-800 bg-emerald-50 border border-emerald-200 font-bold text-sm hover:bg-emerald-100 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Share2 size={16} className="text-emerald-600" /> 📲 Partager la Facture (AirDrop, WhatsApp)
                                </button>
                                <button
                                    onClick={() => openEmailForInvoice({
                                        firstName: selectedProfile.first_name,
                                        lastName: selectedProfile.last_name,
                                        email: selectedProfile.email,
                                        profession: selectedProfile.profession,
                                        address: selectedProfile.address,
                                        location: selectedProfile.location,
                                        stripePaymentId: selectedProfile.stripe_payment_id,
                                        createdAt: selectedProfile.created_at
                                    })}
                                    className="w-full py-2.5 mb-2 rounded-xl text-blue-800 bg-blue-50 border border-blue-200 font-bold text-sm hover:bg-blue-100 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Mail size={16} className="text-blue-600" /> 📧 Préparer l'envoi par Email
                                </button>
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
