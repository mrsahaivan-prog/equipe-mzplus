/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowDown, Sparkles, Trophy } from 'lucide-react';

interface HeroProps {
  onShowPreviewClick: () => void;
  onJoinWaitlistClick: () => void;
  isLaunched?: boolean;
}

export default function Hero({ onShowPreviewClick, onJoinWaitlistClick, isLaunched = false }: HeroProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-24 pb-16 px-4 max-w-6xl mx-auto overflow-hidden">
      {/* Softened, sophisticated multi-layered ambient glow background - premium neon cyan and deep blue */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/[0.05] blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-blue-600/[0.03] blur-[130px] rounded-full pointer-events-none" />

      {/* Hero Content Container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } }
        }}
        className="text-center relative z-10 flex flex-col items-center"
      >
        {/* BRAND LOGO BADGE - Luxury Minimalist Style with Cyan Accent */}
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <div className="relative inline-flex items-center gap-1 px-8 py-3.5 rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-md shadow-[0_0_40px_rgba(6,182,212,0.08)] group hover:border-cyan-500/25 transition-all duration-300">
            {/* Ambient logo flare */}
            <div className="absolute inset-0 w-full h-full rounded-2xl bg-cyan-500/[0.02] blur-md group-hover:bg-cyan-500/[0.04] transition-all duration-300 pointer-events-none" />
            <span className="font-sans font-black text-3xl tracking-tighter text-white">
              MZ<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 inline-block align-middle ml-0.5 font-black filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">+</span>
            </span>
          </div>
        </motion.div>

        {/* SMALL INTRO BADGE - Elegant neon cyan border */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-2 bg-cyan-950/20 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6 text-[11px] md:text-xs font-mono text-cyan-400 font-bold tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isLaunched ? "LES INSCRIPTIONS SONT OUVERTES" : "ÉCOSYSTÈME PRIVÉ MULTI-CANAUX"}</span>
        </motion.div>

        {/* GRAND TITRE - High-End Typography */}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tight text-white max-w-5xl leading-[1.12] mb-10"
        >
          L'opportunité conçue pour créer les{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 filter drop-shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            futurs millionnaires
          </span>{' '}
          de cette génération.
        </motion.h1>

        {/* MAIN CALL TO ACTION - Dual Premium Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 relative justify-center w-full max-w-lg px-4"
        >
          <button
            onClick={onJoinWaitlistClick}
            className="w-full sm:w-1/2 group relative px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 text-slate-950 font-sans font-black tracking-wide text-sm shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all duration-300 hover:from-cyan-300 hover:to-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.35)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isLaunched ? "S'inscrire à MZ+" : "Rejoindre la liste d'attente"}</span>
            <ArrowDown className="w-4 h-4 text-slate-950 group-hover:translate-y-0.5 transition-transform duration-300" />
          </button>

          <button
            onClick={onShowPreviewClick}
            className="w-full sm:w-1/2 group relative px-6 py-4 rounded-xl border border-white/10 bg-slate-950/40 hover:bg-slate-900/60 hover:border-cyan-500/30 text-white font-sans font-bold tracking-wide text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Voir l'aperçu</span>
          </button>
        </motion.div>

        {/* Muted luxury badge - elegant layout */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 flex items-center justify-center gap-6"
        >
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">ÉCOSYSTÈME</span>
            <span className="text-xs font-semibold text-gray-300 mt-1">100% Hermétique</span>
          </div>
          <div className="w-[1px] h-8 bg-white/5" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">PLACES</span>
            <span className="text-xs font-semibold text-cyan-400 mt-1 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-cyan-400" /> 150 Membres
            </span>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
