/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  X, 
  Lock, 
  Flame, 
  ShieldCheck, 
  Users, 
  MessageSquare, 
  Compass, 
  MapPin, 
  TrendingUp 
} from 'lucide-react';
import { isLaunchModeActive } from '../utils';

interface CommunityViewProps {
  onBack: () => void;
  onJoinWaitlist?: () => void;
}

export default function CommunityView({ onBack, onJoinWaitlist }: CommunityViewProps) {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [activeChannel, setActiveChannel] = useState<{
    id: number;
    title: string;
    description: string;
    emoji: string;
    metrics: string;
    bullets: string[];
  } | null>(null);

  useEffect(() => {
    // Elegant delay of exactly 2500ms to allow the user to view the interface first
    const timer = setTimeout(() => {
      setShowWelcomeModal(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const communitySections = [
    {
      id: 1,
      title: "Cercle Privé de Discussion",
      description: "Notre canal d'entraide cryptographique et d'analyse financière.",
      emoji: "💬",
      metrics: "Activité : H24 & 7j/7",
      bullets: [
        "Échanges quotidiens en direct avec les experts et les fondateurs.",
        "Analyse technique et partages d'opportunités asymétriques en direct.",
        "Soutien indéfectible d'une communauté soudée et orientée résultats."
      ]
    },
    {
      id: 2,
      title: "Salons Stratégiques & Richesse",
      description: "L'endroit où les plans de liberté financière prennent vie pas à pas.",
      emoji: "🧠",
      metrics: "Focus : Mindset & Croissance",
      bullets: [
        "Partage d'objectifs, de routines à haute valeur et d'idées de business.",
        "Suivi rigoureux et émulation collective pour ne jamais baisser les bras.",
        "Conseils actionnables sur la gestion d'actifs et de patrimoine."
      ]
    },
    {
      id: 3,
      title: "Évènements & Séminaires",
      description: "Rencontres physiques exclusives et séminaires internationaux d'élite.",
      emoji: "🌍",
      metrics: "Fréquence : Trimestrielle",
      bullets: [
        "Accès prioritaire aux Masterminds privés organisés dans des cadres prestigieux.",
        "Création d'un réseau solide d'entrepreneurs et investisseurs motivés.",
        "Sessions de networking intenses pour sceller des partenariats d'affaires."
      ]
    }
  ];

  return (
    <div className="w-full min-h-screen py-12 px-4 relative overflow-hidden bg-slate-950 text-white selection:bg-cyan-500 selection:text-black">
      {/* Immersive cybernetic deep navy grid & light glow background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-cyan-900/[0.06] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-blue-950/[0.04] blur-[130px] rounded-full pointer-events-none" />

      {/* Top dashboard mini header */}
      <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-4 mb-14 border-b border-white/5 pb-6 relative z-10">
        {/* Elegant Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="group inline-flex items-center gap-2.5 text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors duration-300 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
          <span>RETOUR AU RAMP DE LANCEMENT</span>
        </motion.button>

        {/* Real-time Pro Dashboard Status Tags */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/20 border border-cyan-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400/90">COMMUNAUTÉ : 100% ONLINE</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.02] border border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>ACCOMPAGNEMENT ACTIF</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* High-Impact "Action" Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Community Badge */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-500/35 rounded-full px-4 py-1.5 mb-5 text-[10px] font-mono text-cyan-400 font-black tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>LE CERCLE DES DÉCIDEURS MZ+</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight mb-4 leading-none uppercase">
              👥 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">NOTRE FORCE EST COLLECTIVE</span>
            </h1>

            <div className="bg-cyan-950/20 border border-cyan-500/10 px-5 py-2.5 rounded-xl mb-4 shadow-[0_0_30px_rgba(6,182,212,0.03)] inline-block">
              <p className="text-xs sm:text-sm font-mono tracking-widest text-cyan-400 uppercase font-black">
                🤝 REJOINS UN GROUPE SOUDÉ VERS LE MÊME BUT
              </p>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm max-w-lg font-light leading-relaxed mt-2">
              Chaque membre de MZ+ participe activement à la réussite de l'autre. Explore nos canaux horizontaux exclusifs ci-dessous.
            </p>
          </motion.div>
        </div>

        {/* Dynamic Horizontal Small Minimal Circles Row for Community */}
        <div className="flex flex-row flex-wrap items-start justify-center gap-6 sm:gap-10 py-10">
          
          {communitySections.map((section, index) => {
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.15, type: 'spring', damping: 20 }}
                onClick={() => setActiveChannel(section)}
                className="group flex flex-col items-center cursor-pointer select-none"
              >
                {/* Small circular container represented by an emoji */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center relative transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] shadow-lg">
                  {/* Decorative rotating dashed border on hover */}
                  <div className="absolute inset-1 rounded-full border border-dashed border-cyan-500/[0.08] group-hover:border-cyan-400/30 transition-colors pointer-events-none" />
                  
                  {/* Glowing halo in hover */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Micro padlock indicator */}
                  <div className="absolute -top-1.5 -right-1.5 bg-slate-950 border border-red-500/30 text-red-400 w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-mono font-bold shadow-md">
                    <Lock className="w-2.5 h-2.5" />
                  </div>

                  {/* EMOJI representing the community node */}
                  <span className="text-3xl sm:text-4xl transition-transform duration-300 group-hover:scale-110">
                    {section.emoji}
                  </span>
                </div>

                {/* Minimalist aligned details */}
                <div className="mt-4 text-center max-w-[160px] sm:max-w-[200px]">
                  <h3 className="text-xs font-mono font-extrabold text-cyan-400 uppercase tracking-wider mb-1">
                    {section.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-light leading-snug">
                    {section.description}
                  </p>
                </div>
              </motion.div>
            );
          })}

        </div>

        {/* Dashboard visual stats decoration */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto py-6 border-t border-white/5 text-center font-mono">
          <div className="p-3 bg-white/[0.01] rounded-xl border border-white/5">
            <div className="text-[10px] text-gray-500 mb-1">MEMBRES VISÉS</div>
            <div className="text-xs font-bold text-white">150 MAX</div>
          </div>
          <div className="p-3 bg-white/[0.01] rounded-xl border border-white/5">
            <div className="text-[10px] text-gray-500 mb-1">SUPPORT & ENTRAIDE</div>
            <div className="text-xs font-bold text-cyan-400">ACTIF H24</div>
          </div>
          <div className="p-3 bg-white/[0.01] rounded-xl border border-white/5">
            <div className="text-[10px] text-gray-500 mb-1">COACHING SESSIONS</div>
            <div className="text-xs font-bold text-white">PLANIFIÉES</div>
          </div>
          <div className="p-3 bg-white/[0.01] rounded-xl border border-white/5">
            <div className="text-[10px] text-gray-500 mb-1">COMMUNAUTÉ</div>
            <div className="text-xs font-bold text-cyan-400">PRIVÉE MZ+</div>
          </div>
        </div>

        {/* Footnote */}
        <div className="text-center mt-8 max-w-md mx-auto py-4">
          <p className="text-[11px] text-gray-500 font-sans tracking-wide leading-relaxed font-light">
            {isLaunchModeActive() 
              ? "✨ Vos liens d'accès aux salons de discussion Telegram et Discord s'initialiseront une fois votre inscription validée."
              : "✨ Vos liens d'accès aux salons de discussion Telegram et Discord s'initialiseront une fois la liste d'attente rejointe."}
          </p>
        </div>

      </div>

      {/* High-End Immersive Informative Modal Overlay */}
      <AnimatePresence>
        {activeChannel && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/92 backdrop-blur-md"
              onClick={() => setActiveChannel(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-slate-950 border border-cyan-500/25 rounded-2xl p-6 md:p-8 text-center shadow-[0_0_50px_rgba(6,182,212,0.25)] z-10 flex flex-col overflow-hidden"
            >
              {/* Decorative premium elements */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={() => setActiveChannel(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mx-auto mb-5 w-12 h-12 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                {activeChannel.emoji}
              </div>

              <h3 className="text-xl md:text-2xl font-sans font-black text-white tracking-tight leading-tight mb-1">
                🔒 Canal réservé aux membres
              </h3>
              
              <p className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-black mb-4">
                💎 MZ+ CERCLE : {activeChannel.title}
              </p>

              <div className="space-y-4 text-gray-300 text-xs md:text-sm leading-relaxed mb-6 text-left font-light">
                <p className="font-normal text-gray-200">
                  L'accès à la communauté <strong className="text-cyan-400 font-extrabold">{activeChannel.title}</strong> est un outil indispensable pour ne jamais rester seul face à tes objectifs de liberté.
                </p>

                {/* Details list */}
                <div className="space-y-2 py-2 border-y border-white/5 my-4">
                  {activeChannel.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-xs text-gray-300">
                      <span className="text-cyan-400 text-xs mt-0.5">✦</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/10 flex items-start gap-2.5 text-cyan-300 font-sans font-normal">
                  <span className="text-sm shrink-0">💡</span>
                  <span>
                    La force du réseau réside dans l'entraide : tu seras formé, accompagné et guidé pas à pas par des entrepreneurs déjà libres.
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  setActiveChannel(null);
                  onJoinWaitlist?.();
                }}
                className="group w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-sans font-black tracking-wide shadow-lg hover:scale-[1.01] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <span>{isLaunchModeActive() ? "🚀 Rejoindre MZ+" : "🚀 Rejoindre la liste d'attente"}</span>
              </button>
            </motion.div>
          </div>
        )}

        {/* Delayed Welcome Modal with the exact copy requested */}
        {showWelcomeModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
              onClick={() => setShowWelcomeModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 150 }}
              className="relative w-full max-w-lg bg-slate-950/95 border border-cyan-500/25 rounded-2xl p-6 md:p-8 text-center shadow-[0_0_60px_rgba(6,182,212,0.2)] z-10 overflow-hidden"
            >
              {/* Decorative premium elements */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/[0.03] blur-[70px] rounded-full pointer-events-none" />

              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <h2 className="text-[9px] font-mono tracking-[0.2em] text-cyan-400 uppercase font-bold mb-3">
                👥 BIENVENUE DANS LA COMMUNAUTÉ MZ+
              </h2>

              <p className="text-sm sm:text-base md:text-lg font-sans font-medium text-white leading-relaxed mb-6">
                "Ici, vous ne serez pas seul.<br/><br/>Vous rejoignez une communauté de personnes motivées, toutes animées par un même objectif : <strong className="text-cyan-400 font-black">la richesse</strong>.<br/><br/>Vous serez accompagné, conseillé et guidé tout au long de votre parcours."
              </p>

              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-sans font-black tracking-wider text-xs shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:scale-[1.01] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                REJOINDRE LE CERCLE D'ENTRAIDE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
