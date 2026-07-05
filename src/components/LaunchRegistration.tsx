/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Phone, User, ShieldCheck, 
  Lock, ChevronDown, Check, Star, ShieldAlert,
  Loader2, ArrowLeft
} from 'lucide-react';

import { COUNTRIES, Country } from '../countries';

interface LaunchRegistrationProps {
  onAdminClick?: () => void;
  onExploreAcademy?: () => void;
  onExploreBusiness?: () => void;
  onExploreCommunity?: () => void;
  onBackToHome?: () => void;
}

export default function LaunchRegistration({ 
  onAdminClick, 
  onExploreAcademy, 
  onExploreBusiness, 
  onExploreCommunity,
  onBackToHome
}: LaunchRegistrationProps) {
  
  // Step 1: Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES.find(c => c.name.includes("Côte d'Ivoire")) || COUNTRIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // Secret admin click tracking
  const [adminClicks, setAdminClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleSecretDotClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 2500) {
      const nextClicks = adminClicks + 1;
      setAdminClicks(nextClicks);
      if (nextClicks >= 10) {
        if (onAdminClick) {
          onAdminClick();
        } else {
          (window as any).openMZAdmin?.();
        }
        setAdminClicks(0);
      }
    } else {
      setAdminClicks(1);
    }
    setLastClickTime(now);
  };

  // STEP 1 Form Submission
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Veuillez entrer votre nom complet.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMsg('Veuillez entrer une adresse e-mail valide.');
      return;
    }
    if (!phone || phone.length < 5) {
      setErrorMsg('Veuillez entrer un numéro de téléphone valide.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const cleanPhone = phone.replace(/\s+/g, '');
    const fullPhone = `${selectedCountry.code}${cleanPhone}`;

    const submissionData = {
      fullName: fullName.trim(),
      email: email.trim(),
      whatsapp: fullPhone,
      country_code: selectedCountry.code,
      country_name: selectedCountry.name,
      source: 'launch_registration',
      created_at: new Date().toISOString()
    };

    try {
      // Post registration details to backend
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      
      // Save local cookies/storage
      localStorage.setItem('mz_user_registered_v3', 'true');
      localStorage.setItem('mz_user_email_v3', email.trim());
      localStorage.setItem('mz_user_whatsapp_v3', fullPhone);
      localStorage.setItem('mz_user_fullname_v3', fullName.trim());
      localStorage.setItem('mz_user_country_v3', selectedCountry.name);
      
      const randomPassNum = Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('mz_user_pass_number', String(randomPassNum));

      // Direct redirection immediately on success with zero intermediate pages
      window.location.href = "https://mzplus.mychariow.shop/prd_4e7cof60";
    } catch (err) {
      console.error("Local registration fallback due to:", err);
      localStorage.setItem('mz_user_registered_v3', 'true');
      localStorage.setItem('mz_user_email_v3', email.trim());
      localStorage.setItem('mz_user_whatsapp_v3', fullPhone);
      localStorage.setItem('mz_user_fullname_v3', fullName.trim());
      localStorage.setItem('mz_user_country_v3', selectedCountry.name);
      
      const randomPassNum = Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('mz_user_pass_number', String(randomPassNum));

      // Direct redirection immediately on fallback with zero intermediate pages
      window.location.href = "https://mzplus.mychariow.shop/prd_4e7cof60";
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative flex flex-col justify-between py-8 px-4 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Heavy Cyberpunk Aesthetic overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.06),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.15)_50%,_rgba(0,0,0,0.55)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
      
      {/* Decorative floating lights */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between relative z-50 mb-8">
        <div className="flex items-center gap-4">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-slate-900/60 hover:border-cyan-500/30 text-xs font-mono text-gray-400 hover:text-white transition-all duration-300 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors duration-300" />
              <span>RETOURNER À L'ACCUEIL</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-[0.25em] text-white bg-gradient-to-r from-white via-gray-200 to-cyan-400 bg-clip-text text-transparent">
              MZ<span className="text-cyan-400">+</span>
            </span>
            <span className="text-[9px] font-mono border border-cyan-500/30 text-cyan-400 px-1.5 py-0.5 rounded-full bg-cyan-950/20 uppercase tracking-widest font-black">
              LIVE
            </span>
          </div>
        </div>

        {/* System security status indicator */}
        <div className="flex items-center gap-3">
          {onExploreAcademy && (
            <button 
              onClick={onExploreAcademy}
              className="text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors duration-300"
            >
              Découvrir les Modules
            </button>
          )}
          <div 
            onClick={handleSecretDotClick}
            className="w-2.5 h-2.5 rounded-full bg-cyan-500/60 hover:bg-cyan-400/90 border border-cyan-400/30 cursor-pointer transition-all duration-300 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.6)]"
            title="Système MZ+ Sécurisé"
          />
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-xl w-full mx-auto relative z-10 my-auto flex flex-col justify-center transition-all duration-300">
        <div className="space-y-6">
          {/* BRAND GREETING */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider font-extrabold uppercase shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <Star className="w-3.5 h-3.5 fill-cyan-400 animate-spin" />
              <span>OUVERTURE OFFICIELLE</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight uppercase">
              🚀 Demande de Candidature MZ<span className="text-cyan-400">+</span>
            </h1>
            
            <p className="text-sm sm:text-base text-gray-300 font-light max-w-lg mx-auto">
              Rejoignez l'écosystème d'affaires conçu pour propulser les futurs leaders de cette génération.
            </p>

            {/* LIMITATION CONSTRAINTS BAR */}
            <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20 flex items-start gap-2.5 text-left text-xs text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.02)]">
              <span className="text-base shrink-0 select-none mt-0.5">⚠️</span>
              <p className="leading-relaxed font-light">
                <strong className="font-extrabold text-white">Attention : Places Limitées.</strong> Notre écosystème n'accepte qu'un nombre restreint de membres d'élite pour préserver l'accès direct aux opportunités d'affaires.
              </p>
            </div>
          </div>

          {/* GLASS FORM CARD */}
          <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/1 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <form onSubmit={handleFormSubmit} className="space-y-5 relative z-10">
              
              {/* FULL NAME */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                  Nom complet
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Ex: Jean Dupont"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans font-light"
                  />
                  <User className="absolute left-4 top-3.5 w-4.5 h-4.5 text-gray-500" />
                </div>
              </div>

              {/* EMAIL ADDRESS */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Ex: jean.dupont@gmail.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans font-light"
                  />
                  <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-gray-500" />
                </div>
              </div>

              {/* PHONE NUMBER / WHATSAPP WITH DROPDOWN */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                  Numéro WhatsApp (Pour le suivi d'accès)
                </label>
                
                <div className="flex gap-2">
                  {/* Country Flag Selector */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center gap-1.5 px-3 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
                    >
                      <span className="text-base leading-none select-none">{selectedCountry.flag}</span>
                      <span className="text-xs font-bold text-gray-300">{selectedCountry.code}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    </button>

                    <AnimatePresence>
                      {showCountryDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-[100]" 
                            onClick={() => setShowCountryDropdown(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute left-0 mt-1.5 w-60 max-h-60 overflow-y-auto bg-slate-950 border border-white/10 rounded-xl shadow-2xl z-[101] divide-y divide-white/[0.03]"
                          >
                            {COUNTRIES.map((c, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(c);
                                  setShowCountryDropdown(false);
                                }}
                                className="w-full px-3.5 py-2.5 text-left hover:bg-slate-900 flex items-center justify-between text-xs font-mono text-gray-300 hover:text-white transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="text-base leading-none">{c.flag}</span>
                                  <span className="truncate">{c.name}</span>
                                </div>
                                <span className="text-cyan-400 font-bold ml-2">{c.code}</span>
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Code input */}
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="Ex: 06 12 34 56"
                      className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans font-light"
                    />
                    <Phone className="absolute left-4 top-3.5 w-4.5 h-4.5 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* ERROR MSG */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 text-xs font-mono flex items-center gap-2 text-left"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-sans font-black tracking-wider text-sm shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono tracking-widest text-xs">TRAITEMENT EN COURS...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 Soumettre ma candidature</span>
                  </>
                )}
              </button>

              {/* SECURITY REASSURANCES */}
              <div className="pt-3 border-t border-white/[0.03] flex items-center justify-between text-[9px] font-mono text-gray-500">
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-cyan-500/60" />
                  <span>CONNEXION SÉCURISÉE SSL 256-BIT</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-500/60" />
                  <span>PROFILING DE SÉCURITÉ INTÈGRE</span>
                </div>
              </div>
            </form>
          </div>

          <p className="text-center text-[10px] text-gray-500 font-mono tracking-widest uppercase">
            🔒 VOS DONNÉES DE CANDIDATURE RESTENT STRICTEMENT CONFIDENTIELLES
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-[10px] text-gray-600 font-mono mt-8 relative z-10">
        © 2026 MZ+ Inc. • Tous droits réservés • Accès membre strictement confidentiel.
      </footer>
    </div>
  );
}
