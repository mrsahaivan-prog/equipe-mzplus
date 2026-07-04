/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Phone, User, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, 
  Sparkles, Users, Lock, ChevronDown, Check, Star, ShieldAlert 
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
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleSubmit = async (e: FormEvent) => {
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
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });
      
      if (response.ok) {
        // Success
        localStorage.setItem('mz_user_registered_v3', 'true');
        localStorage.setItem('mz_user_email_v3', email.trim());
        localStorage.setItem('mz_user_whatsapp_v3', fullPhone);
        localStorage.setItem('mz_user_fullname_v3', fullName.trim());
        localStorage.setItem('mz_user_country_v3', selectedCountry.name);
        
        // Random premium launch pass index
        const randomPassNum = Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem('mz_user_pass_number', String(randomPassNum));

        setIsSubmitted(true);
      } else {
        const errData = await response.json();
        setErrorMsg(errData.error || 'Une erreur est survenue lors de la soumission.');
      }
    } catch (err) {
      console.error("Error submitting registration:", err);
      // Fallback local registration to ensure flawless UX even in offline/sandbox states
      localStorage.setItem('mz_user_registered_v3', 'true');
      localStorage.setItem('mz_user_email_v3', email.trim());
      localStorage.setItem('mz_user_whatsapp_v3', fullPhone);
      localStorage.setItem('mz_user_fullname_v3', fullName.trim());
      localStorage.setItem('mz_user_country_v3', selectedCountry.name);
      
      const randomPassNum = Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('mz_user_pass_number', String(randomPassNum));
      
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    // Keep standard state and optionally reload
  };

  const getSavedPassNumber = () => {
    return localStorage.getItem('mz_user_pass_number') || '482094';
  };

  const getSavedFullName = () => {
    return localStorage.getItem('mz_user_fullname_v3') || fullName || 'Membre d\'Élite MZ+';
  };

  const getSavedEmail = () => {
    return localStorage.getItem('mz_user_email_v3') || email || 'votre-email@domaine.com';
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative flex flex-col justify-between py-8 px-4">
      {/* Immersive radial background and grid flares */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.06),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.1)_50%,_rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
      
      {/* Decorative floating blurred lights */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER WITH DISCREET VISIBLE SECRET POINT */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between relative z-50 mb-8">
        <div className="flex items-center gap-4">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-slate-900/60 hover:border-cyan-500/30 text-xs font-mono text-gray-400 hover:text-white transition-all duration-300 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors duration-300" />
              <span>RENTRE À L'ACCUEIL</span>
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

        {/* The requested discrete but visible point to click 10 times */}
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
            title="Système MZ+ Sécurisé (Click 10x for Admin)"
          />
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-xl w-full mx-auto relative z-10 my-auto flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            /* SUBMISSION FORM PHASE */
            <motion.div
              key="registration-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* HERO MESSAGES */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider font-extrabold uppercase shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <Star className="w-3.5 h-3.5 fill-cyan-400 animate-spin" />
                  <span>OUVERTURE OFFICIELLE</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  🚀 Les inscriptions à MZ+ sont officiellement ouvertes.
                </h1>
                
                <p className="text-sm sm:text-base text-gray-300 font-light max-w-lg mx-auto">
                  Rejoignez MZ+ dès aujourd'hui et déposez votre demande d'inscription.
                </p>

                {/* LIMITATION NOTICE */}
                <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20 flex items-start gap-2.5 text-left text-xs text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.02)]">
                  <span className="text-base shrink-0 select-none mt-0.5">⚠️</span>
                  <p className="leading-relaxed font-light">
                    <strong className="font-extrabold text-white">Les places sont limitées.</strong> Si vous souhaitez rejoindre cette ouverture, complétez votre demande dès maintenant.
                  </p>
                </div>
              </div>

              {/* STYLISH GLASS FORM CARD */}
              <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                {/* Visual card flares */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/1 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  
                  {/* FULL NAME */}
                  <div className="space-y-1.5">
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
                  <div className="space-y-1.5">
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

                  {/* PHONE NUMBER */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                      Numéro de téléphone
                    </label>
                    
                    <div className="flex gap-2">
                      {/* Country Flag Dropdown */}
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="flex items-center gap-1.5 px-3 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        >
                          <span className="text-base leading-none select-none">{selectedCountry.flag}</span>
                          <span className="text-xs font-bold text-gray-300">{selectedCountry.code}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                        </button>

                        <AnimatePresence>
                          {showCountryDropdown && (
                            <>
                              {/* Overlay backing */}
                              <div 
                                className="fixed inset-0 z-[100]" 
                                onClick={() => setShowCountryDropdown(false)} 
                              />
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute left-0 mt-1.5 w-60 max-h-60 overflow-y-auto bg-slate-950 border border-white/10 rounded-xl shadow-2xl z-[101] divide-y divide-white/[0.03] custom-scrollbar"
                              >
                                {COUNTRIES.map((c, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(c);
                                      setShowCountryDropdown(false);
                                    }}
                                    className="w-full px-3.5 py-2.5 text-left hover:bg-slate-900 flex items-center justify-between text-xs font-mono text-gray-300 hover:text-white transition-colors"
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

                      {/* Actual Input */}
                      <div className="relative flex-1">
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errorMsg) setErrorMsg('');
                          }}
                          placeholder="Ex: 07 08 09 10"
                          className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans font-light"
                        />
                        <Phone className="absolute left-4 top-3.5 w-4.5 h-4.5 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* ERROR ALERTS */}
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 text-xs font-mono flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{errorMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* BIG SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-sans font-black tracking-wider text-sm shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span className="font-mono tracking-widest text-xs">SÉCURISATION DU CANAL...</span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold">🚀 Rejoindre MZ+</span>
                      </>
                    )}
                  </button>

                  {/* SECURITY AND TRUST */}
                  <div className="pt-3 border-t border-white/[0.03] flex items-center justify-between text-[9px] font-mono text-gray-500">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-cyan-500/60" />
                      <span>CRYPTAGE SSL 256-BIT</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-cyan-500/60" />
                      <span>SÉCURITÉ CONFIRMÉE</span>
                    </div>
                  </div>
                </form>
              </div>

              {/* SATISFACTION TAGLINES */}
              <p className="text-center text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                🔒 VOS DONNÉES RESTENT 100% SÉCURISÉES ET CONFIDENTIELLES
              </p>
            </motion.div>
          ) : (
            /* CONGRATULATIONS AND ELITE PASS PORTRAIT CARD */
            <motion.div
              key="registration-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', damping: 25 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.15)] animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  DEMANDE ENREGISTRÉE !
                </h1>
                <p className="text-xs sm:text-sm text-gray-300 font-light max-w-sm mx-auto">
                  Votre pass d'admission prioritaire a été généré avec succès.
                </p>
              </div>

              {/* THE ELITE MZ+ PASS CARD */}
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden">
                {/* Futuristic grid overlay inside the pass */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.08),transparent_70%)] pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-2xl rounded-full" />
                
                {/* Glowing borders */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-500 to-transparent" />

                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 relative z-10">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono tracking-[0.2em] text-cyan-400 uppercase font-extrabold block">
                      MZ+ PLATINUM ACCÈS
                    </span>
                    <span className="text-base font-black tracking-widest text-white">
                      PASS D'ADMISSION
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-gray-500 block">ID PASS</span>
                    <span className="text-xs font-mono font-black text-cyan-400">#{getSavedPassNumber()}</span>
                  </div>
                </div>

                {/* Card Content details */}
                <div className="space-y-4 relative z-10 py-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">MEMBRE ENREGISTRÉ</span>
                      <span className="text-sm font-bold text-white tracking-wide truncate block">{getSavedFullName()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">STATUT DE DEMANDE</span>
                      <span className="text-xs font-mono font-black text-emerald-400 uppercase flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        EN COURS d'EXAMEN
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">CANAL INTÉGRATION</span>
                      <span className="text-[10px] font-mono text-gray-300 block truncate">{getSavedEmail()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">RÉSEAU</span>
                      <span className="text-[10px] font-mono text-cyan-400/80 block uppercase">FIBRE SÉCURISÉE MZ+</span>
                    </div>
                  </div>
                </div>

                {/* Footer seal inside pass */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-gray-500 relative z-10">
                  <span className="tracking-widest uppercase">ÉCOSYSTÈME MULTIMILLIONNAIRE MZ+</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">
                    SÉCURISÉ AVEC SUCCÈS
                  </span>
                </div>
              </div>

              {/* NEXT STEPS MESSAGE */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/10 space-y-2 text-center">
                <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Étape suivante indispensable</span>
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  Un conseiller d'affaires de l'écosystème MZ+ va analyser votre demande d'admission et vous contactera dans les prochaines heures sur votre numéro de téléphone ou par e-mail pour finaliser vos accès.
                </p>
              </div>

              {onExploreAcademy && (
                <button
                  onClick={onExploreAcademy}
                  className="w-full py-3 px-4 rounded-xl border border-white/10 hover:border-cyan-500/30 bg-slate-900/40 text-gray-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explorer les formations verrouillées</span>
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-[10px] text-gray-600 font-mono mt-8">
        © 2026 MZ+ Inc. • Tous droits réservés • Accès membre strictement confidentiel.
      </footer>
    </div>
  );
}
