/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Flame, Users, ArrowRight } from 'lucide-react';
import { CountdownTime } from '../types';

interface CountdownProps {
  onJoinWaitlistClick: () => void;
}

export default function Countdown({ onJoinWaitlistClick }: CountdownProps) {
  // Target: Saturday, July 4th, 2026, at 20:00:00 GMT
  const targetDate = new Date(Date.UTC(2026, 6, 4, 20, 0, 0));

  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  const [adminClicks, setAdminClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleAdminSecretClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 2500) {
      const nextClicks = adminClicks + 1;
      setAdminClicks(nextClicks);
      if (nextClicks >= 10) {
        if (typeof (window as any).openMZAdmin === 'function') {
          (window as any).openMZAdmin();
        }
        setAdminClicks(0);
      }
    } else {
      setAdminClicks(1);
    }
    setLastClickTime(now);
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Admin overrides
      const isForced = localStorage.getItem('mz_admin_override_countdown') === 'true';
      if (isForced) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isCompleted: true,
        });
        return;
      }

      const customTimeStr = localStorage.getItem('mz_custom_launch_time');
      const targetTimeMs = customTimeStr ? parseInt(customTimeStr, 10) : targetDate.getTime();
      const difference = targetTimeMs - Date.now();
      
      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isCompleted: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isCompleted: false,
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNum = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="w-full bg-slate-950/95 border-b border-cyan-500/20 backdrop-blur-md relative z-50 py-3 sm:py-4 px-4">
      {/* Delicate premium cyan neon line glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
        
        {/* Info label & Target Date + 150 limit warning */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center md:text-left">
          <div className="flex p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
              <span className="text-xs font-mono tracking-widest text-cyan-400 font-extrabold flex items-center gap-1.5">
                LANCEMENT OFFICIEL MZ+
                <span 
                  onClick={handleAdminSecretClick}
                  className="w-2 h-2 rounded-full bg-cyan-500/80 hover:bg-cyan-400 border border-cyan-400/30 transition-all cursor-pointer inline-block animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                  title="Node Status"
                />
              </span>
              <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/30 text-[10px] font-mono text-red-400 font-bold tracking-wider animate-pulse flex items-center gap-1">
                <Users className="w-3 h-3" /> LIMITÉ À 150 PLACES
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans mt-1">
              Ouverture des accès : <span className="text-white font-semibold underline decoration-cyan-500/50">Samedi 4 Juillet à 20h00 (GMT)</span>
            </p>
          </div>
        </div>

        {/* Highlighted, High-contrast Countdown Cards with Neon Cyan glow */}
        <div className="flex items-center gap-2 sm:gap-3 bg-black/80 px-4 py-2.5 rounded-2xl border border-cyan-500/30 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]">
          
          {/* Day */}
          <div className="flex flex-col items-center">
            <div 
              className="bg-slate-900 px-3.5 py-2 rounded-xl border border-cyan-500/20 flex items-center justify-center min-w-[56px] sm:min-w-[64px] shadow-[0_0_15px_rgba(6,182,212,0.05)] select-none"
            >
              <span className="text-xl sm:text-2xl md:text-3xl font-mono font-black text-white tracking-tight">
                {formatNum(timeLeft.days)}
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase text-gray-400 mt-1.5 font-bold tracking-wider">Jours</span>
          </div>

          <span className="text-cyan-500 font-mono font-bold text-xl sm:text-2xl animate-pulse mb-5">:</span>

          {/* Hour */}
          <div className="flex flex-col items-center">
            <div className="bg-slate-900 px-3.5 py-2 rounded-xl border border-cyan-500/20 flex items-center justify-center min-w-[56px] sm:min-w-[64px] shadow-[0_0_15px_rgba(6,182,212,0.05)]">
              <span className="text-xl sm:text-2xl md:text-3xl font-mono font-black text-white tracking-tight">
                {formatNum(timeLeft.hours)}
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase text-gray-400 mt-1.5 font-bold tracking-wider">Heures</span>
          </div>

          <span className="text-cyan-500 font-mono font-bold text-xl sm:text-2xl animate-pulse mb-5">:</span>

          {/* Minute */}
          <div className="flex flex-col items-center">
            <div className="bg-slate-900 px-3.5 py-2 rounded-xl border border-cyan-500/20 flex items-center justify-center min-w-[56px] sm:min-w-[64px] shadow-[0_0_15px_rgba(6,182,212,0.05)]">
              <span className="text-xl sm:text-2xl md:text-3xl font-mono font-black text-white tracking-tight">
                {formatNum(timeLeft.minutes)}
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase text-gray-400 mt-1.5 font-bold tracking-wider">Min</span>
          </div>

          <span className="text-cyan-500 font-mono font-bold text-xl sm:text-2xl animate-pulse mb-5">:</span>

          {/* Second */}
          <div className="flex flex-col items-center">
            <div className="bg-cyan-950/60 px-3.5 py-2 rounded-xl border border-cyan-500/50 flex items-center justify-center min-w-[56px] sm:min-w-[64px] shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <span className="text-xl sm:text-2xl md:text-3xl font-mono font-black text-cyan-400 tracking-tight filter drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                {formatNum(timeLeft.seconds)}
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase text-cyan-400 mt-1.5 font-black tracking-wider">Sec</span>
          </div>

        </div>

      </div>
    </div>
  );
}
