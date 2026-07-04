/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { GraduationCap, Cpu, Users } from 'lucide-react';

interface PlatformPreviewProps {
  onSelectAcademy: () => void;
  onSelectBusiness: () => void;
  onSelectCommunity: () => void;
  highlightAcademy?: boolean;
}

export default function PlatformPreview({ onSelectAcademy, onSelectBusiness, onSelectCommunity, highlightAcademy }: PlatformPreviewProps) {
  const pillars = [
    {
      name: 'Académie MZ+',
      description: 'Développez les compétences qui vous permettront de passer à l\'action.',
      icon: GraduationCap,
      clickable: true,
      onClick: onSelectAcademy,
    },
    {
      name: 'Business',
      description: 'Trading algorithmique, investissements asymétriques et revenus passifs.',
      icon: Cpu,
      clickable: true,
      onClick: onSelectBusiness,
    },
    {
      name: 'Communauté',
      description: 'Le cercle privé des décideurs et séminaires physiques internationaux.',
      icon: Users,
      clickable: true,
      onClick: onSelectCommunity,
    }
  ];

  return (
    <section id="preview-section" className="relative py-16 px-4 max-w-5xl mx-auto flex flex-col items-center">
      {/* Subtle background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

      {/* Aligned pillars */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          const isHighlighted = pillar.name === 'Académie MZ+' && highlightAcademy;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={pillar.clickable ? pillar.onClick : undefined}
              className={`flex flex-col items-center text-center p-6 rounded-2xl border transition-all duration-300 relative ${
                isHighlighted
                  ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_50px_rgba(6,182,212,0.4)] scale-[1.05] cursor-pointer'
                  : pillar.clickable 
                    ? 'border-cyan-500/20 bg-slate-950/60 hover:border-cyan-400 hover:bg-slate-950/85 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] cursor-pointer' 
                    : 'border-white/[0.03] bg-slate-950/40 hover:border-cyan-500/10'
              }`}
            >
              {/* Bouncing Help Banner */}
              {isHighlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-[9px] font-sans font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-bounce z-20">
                  ⚡ COMMENCER ICI
                </div>
              )}

              {/* Premium Icon Container */}
              <div className={`w-14 h-14 rounded-full border flex items-center justify-center mb-4 transition-all duration-300 ${
                isHighlighted
                  ? 'bg-cyan-900/60 border-cyan-400 text-cyan-300 scale-105'
                  : pillar.clickable 
                    ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400 group-hover:scale-105' 
                    : 'bg-cyan-950/20 border-cyan-500/10 text-cyan-500/70'
              }`}>
                <Icon className="w-6 h-6 stroke-[1.5]" />
              </div>

              {/* Title / Name */}
              <h3 className="text-lg font-sans font-black tracking-tight text-white mb-2 flex items-center gap-1.5">
                {pillar.name}
                {pillar.clickable && (
                  <span className={`w-1.5 h-1.5 rounded-full bg-cyan-400 ${isHighlighted ? 'animate-ping' : 'animate-pulse'}`} />
                )}
              </h3>

              {/* Muted Description */}
              <p className="text-xs text-gray-500 max-w-[220px] leading-relaxed font-light mb-4">
                {pillar.description}
              </p>

              {/* Click Call to action or Status badge */}
              {pillar.clickable ? (
                <span className={`text-[9px] font-mono uppercase font-bold px-2.5 py-1 rounded-md border tracking-widest transition-all duration-300 ${
                  isHighlighted
                    ? 'text-slate-950 bg-cyan-400 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-950'
                }`}>
                  Accéder à l'Aperçu
                </span>
              ) : (
                <span className="text-[9px] font-mono uppercase text-gray-600 bg-white/[0.01] px-2 py-0.5 rounded border border-white/5 tracking-wider">
                  Bientôt disponible
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
