/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight,
  Sparkles, 
  Lock, 
  ShieldCheck, 
  ChevronRight, 
  Wallet, 
  TrendingUp, 
  PieChart, 
  LineChart, 
  Users, 
  Gift, 
  CheckCircle2,
  Mail
} from 'lucide-react';
import { isLaunchModeActive } from '../utils';

interface BusinessViewProps {
  onBack: () => void;
  onJoinWaitlist?: () => void;
}

export default function BusinessView({ onBack, onJoinWaitlist }: BusinessViewProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 2500); // Elegant delay allowing the dashboard background to load smoothly first
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmitWaitlist = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 relative overflow-hidden bg-slate-950 text-white selection:bg-cyan-500 selection:text-black">
      {/* ------------------------------------------------------------- */}
      {/* 1. DECORATIVE BACKGROUNDS (CYBER GRIDS AND LIGHT GLOWS) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-900/[0.08] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/[0.06] blur-[120px] rounded-full pointer-events-none" />

      {/* ------------------------------------------------------------- */}
      {/* 2. TOP DASHBOARD MINI HEADER (REMAIN SECURE AND INTEGRATED) */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4 mb-8 border-b border-white/5 pb-5 relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="group inline-flex items-center gap-2.5 text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors duration-300 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
          <span>RETOUR AU RAMP DE LANCEMENT</span>
        </motion.button>

        <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/20 border border-cyan-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400/90">BUSINESS : HAUTE VALEUR</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.02] border border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>ACCÈS ANTICIPÉ EXCLUSIF</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. PREMIUM VOLUNTARILY BLURRED "LOCKED" DASHBOARD BACKGROUND */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 opacity-[0.82] filter blur-[3px] pointer-events-none select-none transition-all duration-1000 relative">
        {/* Real-looking Premium Side Navigation Menu */}
        <div className="lg:col-span-3 space-y-4 hidden lg:block">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-cyan-500/10 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-cyan-400">MZ+ PARTENAIRE PRO</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-11 bg-gradient-to-r from-cyan-950/40 to-slate-900/40 rounded-xl border border-cyan-500/15 flex items-center px-4 text-cyan-400">
              <span className="text-sm mr-3">📊</span>
              <span className="text-xs font-mono font-bold">Tableau de bord</span>
            </div>
            <div className="h-11 bg-slate-900/40 rounded-xl border border-white/5 flex items-center px-4 text-gray-400">
              <span className="text-sm mr-3">💰</span>
              <span className="text-xs font-mono">Retrait Mobile Money</span>
            </div>
            <div className="h-11 bg-slate-900/40 rounded-xl border border-white/5 flex items-center px-4 text-gray-400">
              <span className="text-sm mr-3">🏆</span>
              <span className="text-xs font-mono">Mes Récompenses</span>
            </div>
            <div className="h-11 bg-slate-900/40 rounded-xl border border-white/5 flex items-center px-4 text-gray-400">
              <span className="text-sm mr-3">📈</span>
              <span className="text-xs font-mono">Statistiques Live</span>
            </div>
            <div className="h-11 bg-slate-900/40 rounded-xl border border-white/5 flex items-center px-4 text-gray-400">
              <span className="text-sm mr-3">👥</span>
              <span className="text-xs font-mono">Filleuls & Réseau</span>
            </div>
          </div>
        </div>

        {/* Mock Central Financial Dashboard Canvas */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Row Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-slate-900 to-cyan-950/20 rounded-2xl border border-cyan-500/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Solde de tes Gains</span>
                <span className="text-sm">💰</span>
              </div>
              <div className="text-2xl font-black font-sans text-cyan-400 tracking-tight">3 420,50 $</div>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span>✦ Prêt pour Retrait Mobile Money</span>
              </div>
            </div>
            <div className="p-5 bg-slate-900/40 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Commissions Actives</span>
                <span className="text-sm">⚡</span>
              </div>
              <div className="text-2xl font-black font-sans text-white tracking-tight">40,00 %</div>
              <div className="text-[10px] font-mono text-gray-500">Niveau d'affilié Élite activé</div>
            </div>
            <div className="p-5 bg-slate-900/40 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Gains Bonus Estimés</span>
                <span className="text-sm">🏆</span>
              </div>
              <div className="text-2xl font-black font-sans text-purple-400 tracking-tight">+1 200,00 $</div>
              <div className="text-[10px] font-mono text-purple-400/80">Bonus fin de mois attendu</div>
            </div>
          </div>

          {/* Big Mock Graph Container */}
          <div className="p-6 bg-slate-900/40 rounded-3xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-300 font-bold">Progression de vos Commissions ($)</span>
              <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/10">JUIN & JUILLET</div>
            </div>
            <div className="h-36 bg-slate-950/50 rounded-2xl flex items-end p-4 gap-3">
              {[35, 45, 60, 40, 75, 90, 80, 110, 130, 120, 150].map((h, idx) => (
                <div key={idx} className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 transition-all rounded-t-md relative group" style={{ height: `${h}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-[8px] px-1 rounded border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">+{h*15}$</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Commissions List with Mobile Money withdrawals */}
          <div className="p-6 bg-slate-900/40 rounded-3xl border border-white/5 space-y-3">
            <span className="text-xs font-mono text-gray-300 font-bold block mb-2">Historique Récent des Commissions & Retraits</span>
            {[
              { label: "Commission d'affiliation direct (Pack Or)", amount: "+150,00 $", info: "Retiré via Orange Money", status: "Succès" },
              { label: "Commission récurrente d'abonnement", amount: "+85,00 $", info: "Retiré via Wave", status: "Succès" },
              { label: "Bonus de recommandation de niveau 2", amount: "+50,00 $", info: "Retiré via MTN MoMo", status: "Succès" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-950/30 border border-cyan-500/10 flex items-center justify-center text-sm">💰</div>
                  <div>
                    <div className="text-xs font-sans font-bold text-white">{item.label}</div>
                    <div className="text-[10px] font-mono text-gray-400">{item.info}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-cyan-400">{item.amount}</div>
                  <div className="text-[9px] font-mono text-emerald-400">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. DYNAMIC INTERACTIVE WIZARD OVERLAY FOR CREATING CURIOSITY */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, type: 'spring', damping: 25 }}
            className="absolute inset-x-0 top-1/4 sm:top-1/3 md:top-28 z-40 flex items-center justify-center px-4"
          >
            <div className="w-full max-w-xl">
              
              {/* Header Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 bg-slate-950 border border-cyan-500/35 rounded-full px-4 py-1.5 text-[10px] font-mono text-cyan-400 font-extrabold tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md">
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>TERMINAL PRIVÉ — VERSION DE LANCEMENT</span>
                </div>
              </div>

              {/* Interactive Steps Frame */}
              <AnimatePresence mode="wait">
                
                {/* STEP 1 */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="bg-slate-950/90 border border-cyan-500/25 rounded-2xl p-6 md:p-8 text-center shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-lg relative overflow-hidden"
                  >
                    {/* Visual Accent */}
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                    
                    <div className="mb-6 flex justify-center">
                      <div className="w-14 h-14 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                        💼
                      </div>
                    </div>

                    <p className="text-gray-200 text-sm md:text-base leading-relaxed font-light mb-8 max-w-md mx-auto">
                      C'est ici que vous allez appliquer toutes les stratégies et méthodes que nous allons vous transmettre afin de générer vos revenus.
                    </p>

                    {/* Progress Indicators */}
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div className="flex gap-1.5">
                        <span className="w-6 h-1.5 rounded-full bg-cyan-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      </div>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white text-slate-950 font-sans font-black text-xs hover:bg-cyan-400 transition-all duration-300 cursor-pointer"
                      >
                        <span>Suivant</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="bg-slate-950/90 border border-cyan-500/25 rounded-2xl p-6 md:p-8 text-center shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-lg relative overflow-hidden"
                  >
                    {/* Visual Accent */}
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                    
                    <div className="mb-6 flex justify-center">
                      <div className="w-14 h-14 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                        🎯
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light mb-8 max-w-md mx-auto">
                      Vous n'aurez qu'à appliquer les méthodes qui vous seront enseignées.
                      <br /><br />
                      Nous vous guiderons étape par étape afin de vous permettre de progresser et d'obtenir des résultats le plus rapidement possible.
                    </p>

                    {/* Progress Indicators */}
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="text-xs font-mono text-gray-500 hover:text-white transition-colors cursor-pointer"
                      >
                        Précédent
                      </button>

                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
                        <span className="w-6 h-1.5 rounded-full bg-cyan-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      </div>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white text-slate-950 font-sans font-black text-xs hover:bg-cyan-400 transition-all duration-300 cursor-pointer"
                      >
                        <span>Suivant</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="bg-slate-950/90 border border-cyan-500/25 rounded-2xl p-6 md:p-8 text-center shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-lg relative overflow-hidden"
                  >
                    {/* Visual Accent */}
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                    
                    <div className="mb-6 flex justify-center">
                      <div className="w-14 h-14 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                        💸
                      </div>
                    </div>

                    <div className="text-gray-300 text-sm md:text-base leading-relaxed font-light mb-8 max-w-md mx-auto space-y-4">
                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3 text-left">
                        <span className="text-xl">💳</span>
                        <p className="text-xs sm:text-sm text-gray-200">
                          Vous pourrez retirer directement vos gains sur votre <strong className="text-cyan-400 font-extrabold">Mobile Money</strong>, en toute simplicité.
                        </p>
                      </div>
                      
                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3 text-left">
                        <span className="text-xl">🎁</span>
                        <p className="text-xs sm:text-sm text-gray-200">
                          Selon votre activité sur la plateforme, vous pourrez également bénéficier de <strong className="text-cyan-400 font-extrabold">récompenses mensuelles</strong>.
                        </p>
                      </div>
                    </div>

                    {/* Progress Indicators */}
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="text-xs font-mono text-gray-500 hover:text-white transition-colors cursor-pointer"
                      >
                        Précédent
                      </button>

                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/30" />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
                        <span className="w-6 h-1.5 rounded-full bg-cyan-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      </div>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white text-slate-950 font-sans font-black text-xs hover:bg-cyan-400 transition-all duration-300 cursor-pointer"
                      >
                        <span>Suivant</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4 */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="bg-slate-950/95 border border-cyan-500/35 rounded-2xl p-6 md:p-8 text-center shadow-[0_0_60px_rgba(6,182,212,0.3)] backdrop-blur-lg relative overflow-hidden"
                  >
                    {/* Ambient glowing lines in step 4 to highlight waitlist action */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-cyan-300 to-blue-500" />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/[0.06] blur-[50px] rounded-full pointer-events-none" />

                    <div className="mb-5 flex justify-center">
                      <div className="w-14 h-14 rounded-full bg-cyan-950/50 border border-cyan-400/40 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(6,182,212,0.25)] animate-pulse">
                        🚀
                      </div>
                    </div>

                    <h2 className="text-xl md:text-2xl font-sans font-black text-white tracking-tight leading-tight mb-2 uppercase">
                      Et ce n'est qu'un aperçu...
                    </h2>

                    <p className="text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4 font-black">
                      Le meilleur reste encore à découvrir.
                    </p>

                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light mb-6 max-w-sm mx-auto">
                      Le jour du lancement, vous découvrirez l'intégralité de Business MZ+ et pourrez commencer votre parcours.
                    </p>

                    {/* Interactive waitlist trigger */}
                    <div className="mb-6 max-w-sm mx-auto">
                      <button
                        onClick={onJoinWaitlist}
                        className="group w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-sans font-black tracking-wide text-xs shadow-lg hover:scale-[1.01] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>{isLaunchModeActive() ? "🚀 Rejoindre MZ+" : "🚀 Rejoindre la liste d'attente"}</span>
                      </button>
                    </div>

                    {/* Progress Indicators */}
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="text-xs font-mono text-gray-500 hover:text-white transition-colors cursor-pointer"
                      >
                        Précédent
                      </button>

                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/30" />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/30" />
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
                        <span className="w-6 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      </div>

                      <button
                        type="button"
                        onClick={onBack}
                        className="text-xs font-mono text-cyan-400 hover:text-white transition-colors cursor-pointer font-bold"
                      >
                        Launchpad
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* 5. CURIOSITY TRIGGER FOOTNOTE */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute bottom-8 inset-x-0 text-center z-10 opacity-30">
        <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
          {isLaunchModeActive() ? "🔒 ACCÈS MEMBRE ACTIF — INSCRIPTIONS OUVERTES" : "🔒 ACCÈS RESTREINT — LANCEMENT LE 4 JUILLET À 20H00 GMT+1"}
        </p>
      </div>

    </div>
  );
}
