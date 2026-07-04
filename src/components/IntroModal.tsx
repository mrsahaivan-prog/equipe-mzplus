/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IntroModal({ isOpen, onClose }: IntroModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop blur & overlay animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      {/* Modal Card Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/15 bg-slate-950 p-6 md:p-8 text-center shadow-[0_0_50px_rgba(6,182,212,0.1)] z-10"
      >
        {/* Subtle decorative glowing background inside card */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/5 blur-[50px] rounded-full pointer-events-none" />

        {/* Dynamic Top Illustration */}
        <div className="relative mx-auto mb-6 w-12 h-12 flex items-center justify-center rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
        </div>

        {/* Description Body */}
        <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed text-center font-sans font-light mb-6">
          <p className="text-white text-base md:text-lg font-black tracking-tight">
            Ce que vous allez découvrir n'est qu'un <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">très léger aperçu</span> de MZ+.
          </p>
          <p className="text-gray-400 text-xs md:text-sm">
            Nous avons volontairement choisi de ne montrer qu'une infime partie de la plateforme afin de vous donner une idée de ce qui vous attend.
          </p>
          <p className="text-cyan-300/80 text-xs font-mono tracking-wide uppercase">
            ✨ Le meilleur reste encore à découvrir.
          </p>
        </div>

        {/* Call to action button */}
        <button
          onClick={onClose}
          className="group relative w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-sans font-bold tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Découvrir l'aperçu</span>
          <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
