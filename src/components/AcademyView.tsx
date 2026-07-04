/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowLeft, Sparkles, X, Lock, Flame, Eye, BookOpen, Clock, CheckCircle, Trophy, GraduationCap, ChevronRight } from 'lucide-react';
import { isLaunchModeActive } from '../utils';

// @ts-ignore
import lessonOneImg from '../assets/images/academy_lesson_one_1783048319165.jpg';
// @ts-ignore
import lessonTwoImg from '../assets/images/academy_lesson_two_1783048332916.jpg';

interface AcademyViewProps {
  onBack: () => void;
  onJoinWaitlist?: () => void;
}

export default function AcademyView({ onBack, onJoinWaitlist }: AcademyViewProps) {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{
    id: number;
    title: string;
    module: string;
    subtitle: string;
    description: string;
    chaptersCount: string;
    lessons: string[];
    author: string;
    image: string;
  } | null>(null);

  const handleCardClick = (formation: any) => {
    setActiveVideo(formation);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeModal(true);
    }, 1500); // Elegant delay for high-impact entry
    return () => clearTimeout(timer);
  }, []);

  const formations = [
    {
      id: 1,
      title: "Comment devenir la personne capable de générer des millions",
      subtitle: "Psychologie & Mindset Financier",
      module: "MODULE 1",
      chaptersCount: "15 chapitres",
      author: "Par les Experts Fondateurs MZ+",
      image: lessonOneImg,
      description: "Tout commence dans votre esprit. Ce module vidéo d'exception vous enseigne comment reprogrammer vos habitudes quotidiennes, éliminer vos croyances limitantes et développer la vision d'affaires indispensable pour attirer et gérer des opportunités de grande envergure.",
      lessons: []
    },
    {
      id: 2,
      title: "Comment générer mon premier million avec MZ+",
      subtitle: "Plan de Route & Stratégies Clés",
      module: "MODULE 2",
      chaptersCount: "15 chapitres",
      author: "Par les Experts Fondateurs MZ+",
      image: lessonTwoImg,
      description: "Le guide d'action concret et pragmatique. Ce module vidéo exclusif vous dévoile la feuille de route pas-à-pas et les piliers d'affaires exclusifs de MZ+ qui transforment les leviers de l'écosystème en votre plus grande réussite financière.",
      lessons: []
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 relative">
      {/* Absolute Ambient light flares for futuristic luxury style */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.02] blur-[150px] rounded-full pointer-events-none" />

      {/* Elegant Back Navigation */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="group inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono text-gray-400 hover:text-cyan-400 mb-10 transition-colors duration-300 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
        <span>RETOUR AU RAMP DE LANCEMENT</span>
      </motion.button>

      {/* 👑 HEADLINE SECTION - Prominent, centered, high focus on Title */}
      <div className="mb-10 text-center relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Neon Badging */}
          <div className="inline-flex items-center gap-2 bg-cyan-950/40 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-5 text-[10px] font-mono text-cyan-400 font-extrabold tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>ACCÈS ANTICIPÉ EXCLUSIF (MEMBRES 1/150)</span>
          </div>

          {/* Majestic High-Focus Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight text-white mb-6 uppercase leading-tight">
            🎓 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 filter drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">Académie MZ+</span>
          </h1>

          {/* Slogan with high contrast container to draw complete focus */}
          <div className="relative inline-block w-full px-6 py-5 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/95 border border-cyan-500/15 shadow-[0_10px_30px_rgba(0,0,0,0.6)] max-w-2xl">
            <h2 className="text-sm sm:text-base md:text-lg font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2 uppercase tracking-wider">
              ⚡ Bon, voici ce qui va se passer :
            </h2>
            <p className="text-white text-sm sm:text-base md:text-lg font-light leading-relaxed italic relative z-10 px-4">
              “C'est ici que nous allons te former et t'accompagner pas à pas jusqu'à ta liberté financière.”
            </p>
          </div>
          
          <div className="w-40 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mt-6" />
        </motion.div>
      </div>

      {/* Grid containing the highly optimized Premium Cards - side-by-side and extremely compact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-10">
        {formations.map((formation, index) => (
          <motion.div
            key={formation.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
            onClick={() => handleCardClick(formation)}
            className="group relative rounded-2xl border border-white/[0.04] bg-gradient-to-b from-slate-900/80 to-slate-950/95 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-cyan-500/35 hover:shadow-[0_0_40px_rgba(6,182,212,0.12)] flex flex-col justify-between cursor-pointer space-y-4"
          >
            {/* Top glowing edge line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="space-y-4">
              {/* Header inside Card (Replacing big thumbnail with ultra-high contrast title & module header) */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/20 text-[10px] font-mono text-cyan-400 font-extrabold tracking-wider">
                    {formation.module}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 font-medium uppercase tracking-wider">
                    {formation.subtitle}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-red-950/60 border border-red-500/20 text-[7px] font-mono text-red-400 font-bold uppercase tracking-wider">
                    🔒 RESTREINT
                  </span>
                </div>
              </div>

              {/* Huge Focus Title */}
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-sans font-black text-white tracking-tight leading-snug group-hover:text-cyan-300 transition-colors duration-300 uppercase">
                  <span className="text-cyan-400 font-mono text-xs tracking-widest mr-2 block mb-1">{formation.module} :</span>
                  {formation.title}
                </h3>
              </div>

              {/* Premium Simulated Video Player Card Thumbnail */}
              <div className="relative aspect-[16/9] w-full bg-slate-950 rounded-xl overflow-hidden border border-white/5 group/player flex flex-col items-center justify-center">
                {/* Backdrop Image with high-end dark gradient overlays */}
                <img 
                  src={formation.image} 
                  alt={formation.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Secure overlay badging */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950/85 border border-cyan-500/20 text-[8px] font-mono text-cyan-400 font-extrabold tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>VIDÉO DE FORMATION D'ÉLITE</span>
                </div>

                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/85 border border-white/10 text-[8px] font-mono text-gray-400 uppercase tracking-widest">
                  🔒 VERROUILLÉ
                </div>

                {/* Big Glassmorphic Play Button */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-1.5">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/95 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.45)] group-hover/player:scale-110 group-hover:bg-cyan-400 transition-all duration-300">
                    <Play className="w-5 h-5 ml-0.5 fill-slate-950 stroke-slate-950" />
                  </div>
                  <span className="text-[9px] font-mono tracking-[0.15em] text-cyan-400 font-black uppercase">
                    LANCER LA VIDÉO
                  </span>
                </div>

                {/* Subtitle status row at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/95 to-transparent flex items-center justify-between text-[8px] font-mono text-gray-500 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                    <span>FLUX PRIVÉ EN DIRECT</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[7px] border border-cyan-500/20 px-1 rounded text-cyan-400 bg-cyan-950/30 font-extrabold uppercase">15 CHAPITRES CLÉS</span>
                  </div>
                </div>
              </div>

              {/* Brief details description */}
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                {formation.description}
              </p>

              {/* Course Syllabus section replaced with 15-chapters details label */}
              <div className="space-y-1.5 pt-3 border-t border-white/5">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold block">
                  FORMAT DE L'ACADÉMIE :
                </span>
                <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/10 text-[11px] text-cyan-300 leading-relaxed font-light">
                  📚 Ce module d'exception contient au total <strong className="text-white font-extrabold">15 chapitres d'élite</strong> de cours vidéo complets, de plans de route pragmatiques et de guides d'exécutions avancés accessibles dès le lancement officiel.
                </div>
              </div>
            </div>

            {/* Bottom course footer */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
              <span className="uppercase tracking-wider text-[8px] text-cyan-500/80 font-bold flex items-center gap-1">
                <Eye className="w-3 h-3 text-cyan-400/80" /> MZ+ LEADER ACADEMY
              </span>
              <button className="px-2.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-[8px] font-mono text-cyan-400 font-bold hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500 transition-all duration-300 flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                <Lock className="w-2.5 h-2.5" />
                <span>DÉVERROUILLER</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Discrete bottom reassurance note */}
      <div className="text-center relative z-10 max-w-xl mx-auto py-5 border-t border-white/5 space-y-2">
        <div className="flex justify-center gap-2 text-cyan-400 text-xs font-mono font-bold">
          <Trophy className="w-4 h-4 text-cyan-400" />
          <span>MZ+ LEADER ACADEMY</span>
        </div>
        <p className="text-xs text-gray-500 font-sans tracking-wide leading-relaxed font-light">
          Déverrouillez ces secrets dès le lancement du 4 Juillet. Rejoignez la liste d'attente dès aujourd'hui pour obtenir votre accès membre instantané.
        </p>
      </div>

      {/* Course Detail / Join Modal Overlay */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={() => setActiveVideo(null)}
            />

            {/* Masterclass Content Presentation Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-slate-950 border border-cyan-500/25 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_60px_rgba(6,182,212,0.25)] z-10 flex flex-col overflow-hidden"
            >
              {/* Radiant light bars */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer z-30"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Big Header Lock icon */}
              <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <Lock className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>

              {/* Module Header */}
              <span className="text-[10px] font-mono text-cyan-400 tracking-[0.2em] uppercase font-black block mb-2">
                {activeVideo.module} • {activeVideo.subtitle}
              </span>

              {/* Big Course Title */}
              <h3 className="text-xl md:text-2xl font-sans font-black text-white tracking-tight leading-snug mb-4">
                {activeVideo.title}
              </h3>

              {/* Sincere desire text */}
              <div className="space-y-4 text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 text-left font-light">
                <p className="font-medium text-white text-center">
                  Le contenu complet de ce cours de haut niveau vous sera entièrement ouvert au moment du lancement.
                </p>
                
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/10 flex items-start gap-2.5 text-cyan-300 font-sans text-left">
                  <span className="text-base shrink-0 mt-0.5">💡</span>
                  <span className="text-xs sm:text-sm leading-relaxed">
                    Ce programme a été conçu par des experts financiers pour propulser l'ensemble des <strong className="text-white font-extrabold underline decoration-cyan-500/50">150 membres fondateurs</strong> vers le succès.
                  </span>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-3 border border-white/5">
                  <span className="text-[10px] font-mono text-gray-400 block mb-1 uppercase font-bold">Inclus dans ce module :</span>
                  <p className="text-xs text-gray-300 leading-normal flex items-center gap-1.5 font-light">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> 15 chapitres d'élite de formation vidéo + exercices d'application pratiques.
                  </p>
                </div>
              </div>

              {/* Call to action button */}
              <button
                onClick={() => {
                  setActiveVideo(null);
                  onJoinWaitlist?.();
                }}
                className="group w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-sans font-black tracking-wider text-xs shadow-lg hover:scale-[1.01] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isLaunchModeActive() ? "🚀 REJOINDRE MZ+" : "🚀 REJOINDRE LA LISTE D'ATTENTE MZ+"}</span>
              </button>
            </motion.div>
          </div>
        )}

        {/* Dynamic Welcome invitation Card popup */}
        {showWelcomeModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowWelcomeModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 150 }}
              className="relative w-full max-w-lg bg-slate-950 border border-cyan-500/25 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_60px_rgba(6,182,212,0.25)] z-10 overflow-hidden"
            >
              {/* Decorative gold lines */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/[0.03] blur-[70px] rounded-full pointer-events-none" />

              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <Flame className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <h2 className="text-[9px] font-mono tracking-[0.2em] text-cyan-400 uppercase font-bold mb-3">
                💎 BIENVENUE DANS L'ACADÉMIE PRIVÉE
              </h2>

              <p className="text-xl sm:text-2xl font-sans font-black text-white leading-snug tracking-tight mb-6">
                "C’est ici que nous allons te former et t’accompagner pas à pas jusqu’à ta liberté financière."
              </p>

              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-sans font-black tracking-wider text-xs shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:scale-[1.01] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                DÉCOUVRIR LE PROGRAMME DE FORMATION
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
