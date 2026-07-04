/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Lock, Mail, Phone, RefreshCw, Calendar, Users, 
  Save, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, 
  ChevronRight, Laptop, Terminal, ToggleLeft, ToggleRight, ArrowLeft, Globe, Eye
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
  onRefreshData?: () => void;
}

interface RawWaitlistEntry {
  email: string;
  whatsapp: string;
  fullName?: string;
  country_code: string;
  country_name: string;
  source: string;
  created_at: string;
}

export default function AdminPanel({ onClose, onRefreshData }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('mz_admin_auth_v3') === 'true';
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Pilot states
  const [customCount, setCustomCount] = useState(() => {
    return localStorage.getItem('mz_custom_simulated_count') || '1540';
  });
  
  const [countdownOverride, setCountdownOverride] = useState(() => {
    return localStorage.getItem('mz_admin_override_countdown') === 'true';
  });

  const [forceLaunch, setForceLaunch] = useState(() => {
    return localStorage.getItem('mz_admin_force_launch') === 'true';
  });

  const [dbEntries, setDbEntries] = useState<RawWaitlistEntry[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Auto-fetch raw db entries if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchRawEntries();
    }
  }, [isAuthenticated]);

  const fetchRawEntries = async () => {
    setIsLoadingDb(true);
    try {
      const response = await fetch('/api/waitlist');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setDbEntries(data);
        }
      }
    } catch (err) {
      console.error("Error fetching waitlist", err);
    } finally {
      setIsLoadingDb(false);
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const targetEmail = 'mr.sahaivan@gmail.com';
    const targetPassword = 'admin123.';
    
    if (email.trim().toLowerCase() === targetEmail && password === targetPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('mz_admin_auth_v3', 'true');
      setActionSuccess('Connexion réussie.');
      setTimeout(() => setActionSuccess(''), 3000);
    } else {
      setLoginError('Identifiants administrateur incorrects.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('mz_admin_auth_v3');
  };

  const saveCounterPilot = () => {
    const val = parseInt(customCount, 10);
    if (isNaN(val) || val < 0) {
      alert("Veuillez entrer un nombre valide.");
      return;
    }
    
    localStorage.setItem('mz_custom_simulated_count', val.toString());
    localStorage.setItem('mz_waitlist_total_count_v3', val.toString());
    localStorage.setItem('mz_permanent_counter_v3', val.toString());
    
    showFeedback("Compteur mis à jour avec succès !");
    if (onRefreshData) onRefreshData();
  };

  const toggleCountdownOverride = (forced: boolean) => {
    setCountdownOverride(forced);
    if (forced) {
      localStorage.setItem('mz_admin_override_countdown', 'true');
      showFeedback("Compte à rebours forcé à zéro.");
    } else {
      localStorage.removeItem('mz_admin_override_countdown');
      localStorage.removeItem('mz_custom_launch_time');
      showFeedback("Compte à rebours réinitialisé au 4 Juillet.");
    }
    if (onRefreshData) onRefreshData();
  };

  const toggleForceLaunchMode = (forced: boolean) => {
    setForceLaunch(forced);
    if (forced) {
      localStorage.setItem('mz_admin_force_launch', 'true');
      showFeedback("Mode lancement activé de force !");
    } else {
      localStorage.removeItem('mz_admin_force_launch');
      showFeedback("Mode lancement désactivé (chrono standard).");
    }
    if (onRefreshData) onRefreshData();
  };

  const setTestCountdown = (seconds: number) => {
    const targetTimestamp = Date.now() + (seconds * 1000);
    localStorage.setItem('mz_custom_launch_time', targetTimestamp.toString());
    localStorage.removeItem('mz_admin_override_countdown');
    setCountdownOverride(false);
    showFeedback(`Test lancé : fin dans ${seconds} secondes.`);
    if (onRefreshData) onRefreshData();
  };

  const clearDatabase = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir vider TOUTE la base de données locale ? Cette action est irréversible.")) {
      return;
    }
    
    try {
      const response = await fetch('/api/admin/clear-waitlist', {
        method: 'POST'
      });
      if (response.ok) {
        setDbEntries([]);
        localStorage.removeItem('mz_user_registered_v3');
        localStorage.removeItem('mz_user_email_v3');
        localStorage.removeItem('mz_user_whatsapp_v3');
        localStorage.removeItem('mz_user_fullname_v3');
        localStorage.removeItem('mz_user_rank_v3');
        localStorage.removeItem('mz_waitlist_total_count_v3');
        localStorage.removeItem('mz_permanent_counter_v3');
        localStorage.removeItem('mz_user_pass_number');
        showFeedback("Base de données et local cache vidés !");
        if (onRefreshData) onRefreshData();
      } else {
        alert("Erreur lors du nettoyage.");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur réseau.");
    }
  };

  const showFeedback = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => {
      setActionSuccess('');
    }, 4000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative flex flex-col py-8 px-4 sm:px-8 select-text">
      {/* Visual cyber mesh and radar background for absolute premium master console theme */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.02),transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.01)_50%,_rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

      {/* HEADER BAR */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between border-b border-white/5 pb-4 mb-8 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-950/40 border border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-mono tracking-widest text-red-400 font-extrabold uppercase flex items-center gap-2">
              <span>ESPACE PILOTAGE ADMIN</span>
              <span className="px-1.5 py-0.5 rounded bg-red-950 text-[8px] font-mono border border-red-500/30 text-red-400 font-bold uppercase tracking-widest">
                CONSOLE FULL-PAGE
              </span>
            </h2>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5">Contrôle confidentiel de l'écosystème et de l'état de lancement</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-slate-900/60 hover:border-cyan-500/30 text-xs font-mono text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
          <span>RETOUR À L'ACCUEIL</span>
        </button>
      </header>

      {/* CENTRAL CORE SYSTEM */}
      <main className="max-w-4xl w-full mx-auto relative z-10 flex-1 flex flex-col justify-start">
        {/* ACTION FEEDBACK FLOATER */}
        <AnimatePresence>
          {actionSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2.5 shadow-[0_0_20px_rgba(16,185,129,0.15)] max-w-xl mx-auto w-full"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!isAuthenticated ? (
          /* SECURE FULL-PAGE LOGIN BOX */
          <div className="max-w-md w-full mx-auto my-auto py-12 px-6 bg-slate-900/40 border border-red-500/10 rounded-3xl backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-red-950/30 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-mono font-black text-white uppercase tracking-widest">SÉCURITÉ ADMIN MZ+</h3>
                <p className="text-[10px] text-gray-500 font-mono">Entrez vos identifiants uniques de pilotage.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">Identifiant e-mail</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mr.sahaivan@gmail.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                  />
                  <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">Mot de passe</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                  />
                  <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-gray-500" />
                </div>
              </div>

              {loginError && (
                <p className="text-red-400 text-xs font-mono font-medium text-center">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-black tracking-widest text-xs shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ACCÉDER À LA CONSOLE</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* FULL-PAGE CONSOLE ACTIVE DASHBOARD */
          <div className="space-y-6">
            
            {/* REAL-TIME OVERVIEW METRICS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-bold block">Inscrits Réels</span>
                  <span className="text-xl font-mono font-black text-white">{dbEntries.length}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-bold block">État du Lancement</span>
                  <span className="text-xs font-mono text-cyan-400 font-extrabold flex items-center gap-1">
                    {forceLaunch ? "🔴 LIVE FORCÉ" : "⏳ COMPTE À REBOURS"}
                  </span>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-bold block">Serveur principal</span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE (3000)
                  </span>
                </div>
              </div>
            </div>

            {/* BENTO-GRID SYSTEM ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* COMPTEUR & SIMULATION BOX */}
              <div className="p-5 rounded-3xl bg-slate-900/30 border border-white/5 space-y-4">
                <h3 className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Contrôle d'Afflux d'Inscriptions</span>
                </h3>
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  Modifiez la valeur de départ simulée pour le compteur global d'inscriptions sur l'application. Cette valeur sert de socle pour crédibiliser le trafic.
                </p>

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="number"
                      value={customCount}
                      onChange={(e) => setCustomCount(e.target.value)}
                      placeholder="Ex: 1540"
                      className="w-full pl-4 pr-4 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <button
                    onClick={saveCounterPilot}
                    className="w-full py-2.5 rounded-xl bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer la valeur du compteur</span>
                  </button>
                </div>
              </div>

              {/* CRITICAL: FORCE MODE LANCEMENT TOGGLE */}
              <div className="p-5 rounded-3xl bg-slate-900/30 border border-white/5 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 animate-spin-slow" />
                    <span>Activation Forcée Mode Lancement</span>
                  </h3>
                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed mt-2">
                    Cochez cette option pour simuler l'ouverture officielle de l'Académie MZ+ (comme si nous étions après le 4 juillet à 20h00 GMT+1). La liste d'attente et le compte à rebours disparaîtront au profit du formulaire premium d'inscription.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => toggleForceLaunchMode(!forceLaunch)}
                    className={`w-full py-3.5 rounded-xl border text-xs font-mono font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      forceLaunch 
                        ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                        : 'bg-slate-950 border-white/5 text-gray-400 hover:border-cyan-500/20 hover:text-white'
                    }`}
                  >
                    {forceLaunch ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-cyan-400" />
                        <span>🔴 MODE LANCEMENT FORCÉ : ACTIF</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-gray-500" />
                        <span>⏳ STANDARD (DÉTERMINÉ PAR LA DATE RÉELLE)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* CHRONOMÈTRE DE TEST RAPIDE */}
              <div className="p-5 rounded-3xl bg-slate-900/30 border border-white/5 space-y-4 md:col-span-2">
                <h3 className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Pilotage du Compte à Rebours Standard</span>
                </h3>
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  Contrôlez ou simulez la fin imminente du compte à rebours pour vérifier la transition visuelle fluide.
                </p>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => toggleCountdownOverride(!countdownOverride)}
                    className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      countdownOverride 
                        ? 'bg-amber-950/60 border-amber-500/50 text-amber-300' 
                        : 'bg-slate-950 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{countdownOverride ? '🔓 Forcer Arrêt (Actif)' : '🔒 Forcer le chrono à 00:00:00'}</span>
                  </button>

                  <button
                    onClick={() => setTestCountdown(10)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    <span>⏱️ Simuler transition (10 sec)</span>
                  </button>

                  <button
                    onClick={() => setTestCountdown(60)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    <span>⏱️ Simuler transition (1 minute)</span>
                  </button>
                  
                  {countdownOverride || localStorage.getItem('mz_custom_launch_time') ? (
                    <button
                      onClick={() => {
                        toggleCountdownOverride(false);
                        localStorage.removeItem('mz_custom_launch_time');
                        if (onRefreshData) onRefreshData();
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-red-950 hover:bg-red-900 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-mono font-bold transition-all cursor-pointer ml-auto"
                    >
                      <span>🔄 Réinitialiser Standard</span>
                    </button>
                  ) : null}
                </div>
              </div>

            </div>

            {/* REAL DATABASE ENTRIES LISTING */}
            <div className="p-5 rounded-3xl bg-slate-900/30 border border-white/5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Inscrits Réels dans la Base de Données ({dbEntries.length})</span>
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchRawEntries}
                    disabled={isLoadingDb}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-white/5 text-gray-400 hover:text-white transition-all cursor-pointer disabled:opacity-40"
                    title="Rafraîchir"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingDb ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={clearDatabase}
                    className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-500/30 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                    title="Vider la base de données"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isLoadingDb ? (
                <div className="py-12 text-center text-xs font-mono text-gray-500">Chargement de la base de données...</div>
              ) : dbEntries.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-gray-500">Aucun utilisateur enregistré pour le moment.</div>
              ) : (
                <div className="max-h-96 overflow-y-auto divide-y divide-white/5 custom-scrollbar bg-slate-950/80 rounded-2xl border border-white/5">
                  {dbEntries.map((entry, i) => (
                    <div key={i} className="p-4 text-xs font-mono flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-white/[0.01] transition-colors">
                      <div className="space-y-1.5">
                        <div className="text-white font-bold text-sm flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-gray-600">#{dbEntries.length - i}</span>
                          {entry.fullName && (
                            <span className="text-white bg-slate-900 px-2 py-0.5 rounded border border-white/5 font-sans font-bold">
                              👤 {entry.fullName}
                            </span>
                          )}
                          <span className="text-cyan-400 text-xs font-light">{entry.email}</span>
                        </div>
                        <div className="text-gray-400 flex items-center gap-2 flex-wrap text-[10px]">
                          <span className="text-gray-300 font-bold">📞 {entry.whatsapp}</span>
                          <span>•</span>
                          <span className="text-gray-500">Pays: {entry.country_name} ({entry.country_code})</span>
                        </div>
                      </div>
                      <div className="text-right text-gray-500 text-[10px] shrink-0">
                        <div className="font-extrabold text-cyan-500/80 uppercase tracking-widest">{entry.source === 'launch_registration' ? '🎯 INSCRIPTION' : '⏳ LISTE D\'ATTENTE'}</div>
                        <div>{new Date(entry.created_at).toLocaleString('fr-FR')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FOOTER BAR */}
            <div className="flex justify-between items-center pt-4 border-t border-white/5 text-[10px] font-mono text-gray-600">
              <span>MZ+ Console v3.5 • Certifiée Hautement Sécurisée</span>
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/5 text-gray-400 hover:text-white text-xs transition-all cursor-pointer"
              >
                Déconnexion Admin
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
