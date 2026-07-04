/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Users, Clock, ArrowLeft, Shield, AlertTriangle } from 'lucide-react';

import { COUNTRIES, Country } from '../countries';

interface WaitlistMember {
  rank: number;
  email: string;
  phone: string;
  country: string;
  flag: string;
  time: string;
  isUser?: boolean;
}

function getRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (isNaN(diffMs) || diffMs < 0) return "À l'instant";
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "À l'instant";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `il y a ${diffMin} min`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `il y a ${diffHour} h`;
    const diffDays = Math.floor(diffHour / 24);
    return `il y a ${diffDays} j`;
  } catch (e) {
    return "À l'instant";
  }
}

const getSimulatedCount = (): number => {
  // 1. Check if admin custom simulated count is set
  const adminCustom = localStorage.getItem('mz_custom_simulated_count');
  if (adminCustom) {
    const parsedAdmin = parseInt(adminCustom, 10);
    if (!isNaN(parsedAdmin)) {
      return parsedAdmin;
    }
  }

  const now = Date.now();
  const startTime = new Date("2026-07-03T23:00:00Z").getTime();
  const launchTime = new Date("2026-07-04T20:00:00Z").getTime();
  
  let baseCount = 200;
  if (now > startTime) {
    if (now >= launchTime) {
      const postElapsed = Math.floor((now - launchTime) / 1000);
      baseCount = 1750 + Math.floor(postElapsed / 1200);
    } else {
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const totalSeconds = Math.floor((launchTime - startTime) / 1000);
      const pct = elapsedSeconds / totalSeconds;
      const baseVal = 200 + 1300 * Math.pow(pct, 1.2); // Start at 200, grow to 1500+
      const liveTicks = Math.floor(elapsedSeconds / 80);
      baseCount = Math.floor(baseVal + liveTicks);
    }
  }

  const finalCount = Math.max(200, Math.min(1800, baseCount));

  // 2. Ensure it never drops back by storing max seen in localStorage
  try {
    const savedMax = localStorage.getItem('mz_permanent_counter_v3');
    if (savedMax) {
      const parsedMax = parseInt(savedMax, 10);
      if (!isNaN(parsedMax) && parsedMax > finalCount) {
        return parsedMax;
      }
    }
    localStorage.setItem('mz_permanent_counter_v3', finalCount.toString());
  } catch (e) {
    // Ignore sandbox write errors
  }

  return finalCount;
};

async function fetchRealWaitlist(): Promise<any[]> {
  try {
    const response = await fetch('/api/waitlist');
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Error fetching from local waitlist API:", err);
  }
  return [];
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

interface WaitlistPageProps {
  onBack: () => void;
  source?: string;
}

export default function WaitlistPage({ onBack, source = 'general' }: WaitlistPageProps) {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(() => {
    return localStorage.getItem('mz_user_registered_v3') === 'true';
  });
  const [showList, setShowList] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Base members state
  const [members, setMembers] = useState<WaitlistMember[]>([]);
  const [totalCount, setTotalCount] = useState(() => {
    const saved = localStorage.getItem('mz_waitlist_total_count_v3');
    return saved ? parseInt(saved, 10) : getSimulatedCount();
  });
  const [userRank, setUserRank] = useState<number>(() => {
    const saved = localStorage.getItem('mz_user_rank_v3');
    return saved ? parseInt(saved, 10) : getSimulatedCount() + 1;
  });

  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  // Calculate local time remaining to Saturday, July 4th, 2026, at 20:00:00 GMT
  useEffect(() => {
    const targetDate = new Date(Date.UTC(2026, 6, 4, 20, 0, 0));
    
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Automatically detect country on mount based on timezone
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        const lowerTz = tz.toLowerCase();
        let detected: Country | undefined;
        if (lowerTz.includes('douala') || lowerTz.includes('yaounde') || lowerTz.includes('cameroon')) {
          detected = COUNTRIES.find(c => c.name === "Cameroun");
        } else if (lowerTz.includes('abidjan') || lowerTz.includes('cote d') || lowerTz.includes('ivoire')) {
          detected = COUNTRIES.find(c => c.name === "Côte d'Ivoire");
        } else if (lowerTz.includes('dakar') || lowerTz.includes('senegal')) {
          detected = COUNTRIES.find(c => c.name === "Sénégal");
        } else if (lowerTz.includes('bamako') || lowerTz.includes('mali')) {
          detected = COUNTRIES.find(c => c.name === "Mali");
        } else if (lowerTz.includes('ouagadougou') || lowerTz.includes('burkina')) {
          detected = COUNTRIES.find(c => c.name === "Burkina Faso");
        } else if (lowerTz.includes('libreville') || lowerTz.includes('gabon')) {
          detected = COUNTRIES.find(c => c.name === "Gabon");
        } else if (lowerTz.includes('cotonou') || lowerTz.includes('benin')) {
          detected = COUNTRIES.find(c => c.name === "Bénin");
        } else if (lowerTz.includes('lome') || lowerTz.includes('togo')) {
          detected = COUNTRIES.find(c => c.name === "Togo");
        } else if (lowerTz.includes('conakry') || lowerTz.includes('guinee')) {
          detected = COUNTRIES.find(c => c.name === "Guinée");
        } else if (lowerTz.includes('paris') || lowerTz.includes('france')) {
          detected = COUNTRIES.find(c => c.name === "France");
        } else if (lowerTz.includes('brussels') || lowerTz.includes('belgique')) {
          detected = COUNTRIES.find(c => c.name === "Belgique");
        }

        if (detected) {
          setSelectedCountry(detected);
        }
      }
    } catch (e) {
      console.error("Timezone country detection error:", e);
    }
  }, []);

  // Generate the simulated members and append real ones from local server
  useEffect(() => {
    let active = true;

    const loadAndBuildWaitlist = async () => {
      const simulatedTotal = getSimulatedCount();
      
      const providers = ['gmail.com', 'yahoo.fr', 'outlook.com', 'hotmail.fr', 'icloud.com', 'live.fr'];
      const firstNames = ['Amadou', 'Koffi', 'Yao', 'Moussa', 'Abdoulaye', 'Seydou', 'Ousmane', 'Cheikh', 'Youssouf', 'Mamadou', 'Ibrahim', 'Marc', 'Jean', 'Pierre', 'Thomas', 'Nicolas', 'Antoine', 'Lucas', 'Sarah', 'Awa', 'Fatou', 'Aminata', 'Mariam', 'Yasmina', 'Chloé', 'Marie', 'Sophie', 'Isabelle', 'Bachir', 'Arthur'];
      const lastNames = ['Kouadio', 'Koné', 'Diallo', 'Diop', 'Sow', 'Ndiaye', 'Coulibaly', 'Traoré', 'Keita', 'Kamara', 'Bamba', 'Ouedraogo', 'Fofana', 'Touré', 'Gomez', 'Martin', 'Dubois', 'Moreau', 'Laurent', 'Lefebvre', 'Michel', 'Bernard', 'David', 'Simon', 'Soro', 'Cissé'];
      const countryPool = COUNTRIES.slice(0, 15);
      
      // 2. Fetch real entries from server
      const realEntries = await fetchRealWaitlist();
      
      if (!active) return;

      const userEmail = localStorage.getItem('mz_user_email_v3');
      const userWhatsapp = localStorage.getItem('mz_user_whatsapp_v3');
      
      const realCount = realEntries.length;
      const baseCount = simulatedTotal - realCount;
      
      const baseMembers: WaitlistMember[] = [];
      // Generate only the newest 150 simulated members for optimal DOM performance
      const startBase = Math.max(1, baseCount - 150);
      for (let i = startBase; i <= baseCount; i++) {
        const nameSeed = (i * 73) % firstNames.length;
        const lastSeed = (i * 101) % lastNames.length;
        const provSeed = (i * 13) % providers.length;
        const countrySeed = (i * 17) % countryPool.length;
        
        const country = countryPool[countrySeed];
        const fn = firstNames[nameSeed].toLowerCase();
        const ln = lastNames[lastSeed].toLowerCase();
        
        const emailStr = `${fn.slice(0, 1)}${ln.slice(0, 6)}***@${providers[provSeed]}`;
        const phoneSuffix = String((i * 12345) % 90 + 10);
        const phoneStr = `${country.code} •••••••${phoneSuffix}`;
        
        const minutesAgo = baseCount - i + 2; 
        let timeStr = "";
        if (minutesAgo < 60) {
          timeStr = `il y a ${minutesAgo} min`;
        } else {
          const hours = Math.floor(minutesAgo / 60);
          if (hours < 24) {
            timeStr = `il y a ${hours} h`;
          } else {
            timeStr = `il y a ${Math.floor(hours / 24)} j`;
          }
        }

        baseMembers.push({
          rank: i,
          email: emailStr,
          phone: phoneStr,
          country: country.name,
          flag: country.flag,
          time: timeStr
        });
      }

      const mappedRealMembers: WaitlistMember[] = realEntries.map((entry: any, index: number) => {
        const rank = baseCount + 1 + index;
        const entryEmail = entry.email || '';
        const entryWhatsapp = entry.whatsapp || '';
        
        const isUserMatch = (userEmail && entryEmail.toLowerCase() === userEmail.toLowerCase()) || 
                            (userWhatsapp && entryWhatsapp === userWhatsapp);

        if (isUserMatch && active) {
          localStorage.setItem('mz_user_rank_v3', String(rank));
          setUserRank(rank);
        }

        let emailStr = entryEmail;
        if (emailStr.includes('@')) {
          const parts = emailStr.split('@');
          emailStr = parts[0].slice(0, 2) + "***@" + parts[1];
        } else if (emailStr) {
          emailStr = emailStr.slice(0, 2) + "***";
        } else {
          emailStr = "anonyme***";
        }

        let phoneStr = "";
        const countryCode = entry.country_code || "+225";
        if (entryWhatsapp) {
          phoneStr = `${countryCode} •••••••${entryWhatsapp.slice(-2)}`;
        } else {
          phoneStr = `${countryCode} •••••••00`;
        }

        const entryCountryName = entry.country_name || "Côte d'Ivoire";
        const matchedCountry = COUNTRIES.find(c => c.name.toLowerCase() === entryCountryName.toLowerCase()) || COUNTRIES[0];
        const timeStr = entry.created_at ? getRelativeTime(entry.created_at) : "À l'instant";

        return {
          rank,
          email: emailStr,
          phone: phoneStr,
          country: matchedCountry.name,
          flag: matchedCountry.flag,
          time: timeStr,
          isUser: !!isUserMatch
        };
      });

      // Combine lists
      const combined = [...baseMembers, ...mappedRealMembers];

      // Check if user is registered but NOT matched in the real entries list
      const hasUserMatch = mappedRealMembers.some(m => m.isUser);
      if (isSubmitted && !hasUserMatch && userEmail) {
        const userCountryName = localStorage.getItem('mz_user_country_v3') || selectedCountry.name;
        const matchedCountry = COUNTRIES.find(c => c.name.toLowerCase() === userCountryName.toLowerCase()) || selectedCountry;
        
        let anonEmail = userEmail;
        if (anonEmail.includes('@')) {
          const parts = anonEmail.split('@');
          anonEmail = parts[0].slice(0, 2) + "***@" + parts[1];
        }

        const calculatedUserRank = parseInt(localStorage.getItem('mz_user_rank_v3') || String(simulatedTotal), 10);
        setUserRank(calculatedUserRank);
        
        combined.push({
          rank: calculatedUserRank,
          email: anonEmail,
          phone: userWhatsapp ? `${userWhatsapp.slice(0, 4)} •••••••${userWhatsapp.slice(-2)}` : `${selectedCountry.code} •••••••99`,
          country: matchedCountry.name,
          flag: matchedCountry.flag,
          time: "À l'instant",
          isUser: true
        });
      }

      // Sort to show highest rank first (newest at top)
      combined.sort((a, b) => b.rank - a.rank);
      setMembers(combined);
      setTotalCount(simulatedTotal);
    };

    loadAndBuildWaitlist();

    const interval = setInterval(loadAndBuildWaitlist, 10000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [isSubmitted, selectedCountry]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Veuillez entrer une adresse e-mail valide.');
      return;
    }
    if (!whatsapp || whatsapp.length < 5) {
      setErrorMsg('Veuillez entrer un numéro WhatsApp valide.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const cleanWhatsapp = whatsapp.replace(/\s+/g, '');
    const fullWhatsapp = `${selectedCountry.code}${cleanWhatsapp}`;

    const submissionData = {
      email: email.trim(),
      whatsapp: fullWhatsapp,
      country_code: selectedCountry.code,
      country_name: selectedCountry.name,
      source: source,
      created_at: new Date().toISOString()
    };

    let nextRank = Math.max(totalCount + 1, 201);

    try {
      // Primary: Register on local server API
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.list && Array.isArray(resData.list)) {
          const index = resData.list.findIndex((item: any) => item.email.toLowerCase() === email.trim().toLowerCase());
          if (index !== -1) {
            nextRank = 201 + index;
          } else {
            nextRank = 200 + resData.list.length;
          }
        }
      }
    } catch (err) {
      console.warn("Error posting to local waitlist API:", err);
    }
    
    localStorage.setItem('mz_user_registered_v3', 'true');
    localStorage.setItem('mz_user_email_v3', email.trim());
    localStorage.setItem('mz_user_whatsapp_v3', fullWhatsapp);
    localStorage.setItem('mz_user_country_v3', selectedCountry.name);
    localStorage.setItem('mz_user_flag_v3', selectedCountry.flag);
    localStorage.setItem('mz_user_rank_v3', String(nextRank));
    localStorage.setItem('mz_waitlist_total_count_v3', String(nextRank));

    setTotalCount(nextRank);
    setUserRank(nextRank);
    setIsSubmitted(true);
    setIsSubmitting(false);

    // Scroll waitlist smoothly to the top to let them see their entry
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative pb-16">
      {/* Decorative cyber grid or glowing lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.03),transparent_60%)] pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
            <span>RETOUR AU RAMP DE LANCEMENT</span>
          </button>

          <div className="font-sans font-black text-xl tracking-tighter text-white">
            MZ<span className="text-cyan-400 font-bold ml-0.5 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">+</span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 rounded-full px-3 py-1 text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>EN DIRECT</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 pt-8 md:pt-12 relative z-10">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            /* CENTERED REGISTRATION CARD */
            <motion.div
              key="register-flow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-lg mx-auto bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.05)] space-y-6 mt-4"
            >
              <div className="h-0.5 w-16 bg-cyan-400/80 rounded-full mx-auto" />

              <div className="space-y-2 text-center">
                <div className="inline-flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-500/20 rounded-full px-3 py-1 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>Lancement officiel le 4 Juillet</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-sans font-black text-white uppercase tracking-tight">
                  Prendre ma place sur la Liste d'Attente MZ+
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                  Les places prioritaires sont strictement limitées à <strong className="text-cyan-400 font-extrabold">150 membres</strong>. Entrez vos coordonnées WhatsApp pour obtenir vos accès exclusifs à la seconde du feu vert.
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="p-4 bg-slate-950/80 border border-cyan-500/15 rounded-2xl text-center space-y-2 shadow-[0_0_20px_rgba(6,182,212,0.03)]">
                <span className="text-[9px] font-mono text-cyan-400/80 font-bold uppercase tracking-wider block">
                  ⏳ OUVERTURE POUR LE PAYS : {selectedCountry.name.toUpperCase()} ({selectedCountry.launchHour.split(' (')[0]})
                </span>
                <div className="flex justify-center items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-mono font-black text-white leading-none">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[7px] font-mono text-gray-500 uppercase tracking-widest mt-1">jours</span>
                  </div>
                  <span className="text-sm font-mono text-cyan-500 font-bold mb-3 animate-pulse">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-mono font-black text-white leading-none">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[7px] font-mono text-gray-500 uppercase tracking-widest mt-1">heures</span>
                  </div>
                  <span className="text-sm font-mono text-cyan-500 font-bold mb-3 animate-pulse">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-mono font-black text-white leading-none">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[7px] font-mono text-gray-500 uppercase tracking-widest mt-1">min</span>
                  </div>
                  <span className="text-sm font-mono text-cyan-500 font-bold mb-3 animate-pulse">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-mono font-black text-cyan-400 leading-none filter drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[7px] font-mono text-cyan-400/80 uppercase tracking-widest mt-1">sec</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                    Adresse e-mail principale
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemple@email.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-light placeholder:text-gray-600"
                    />
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* Country Select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                    Pays de résidence
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCountry.name}
                      onChange={(e) => {
                        const found = COUNTRIES.find(c => c.name === e.target.value);
                        if (found) setSelectedCountry(found);
                      }}
                      className="w-full pl-11 pr-10 py-3 bg-slate-950 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all appearance-none cursor-pointer font-bold"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.name} value={country.name} className="bg-slate-950 text-white text-xs">
                          {country.flag} {country.name} ({country.code})
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-4 top-3.5 text-sm pointer-events-none">{selectedCountry.flag}</div>
                    <div className="absolute right-4 top-3.5 pointer-events-none text-[9px] text-cyan-400">▼</div>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                    Numéro WhatsApp (Sans indicatif pays)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Ex: 07080910"
                      className="w-full pl-16 pr-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono placeholder:text-gray-600"
                    />
                    <div className="absolute left-4 top-3.5 text-xs text-cyan-400 font-mono font-black pointer-events-none">
                      {selectedCountry.code}
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] text-gray-500 font-mono">
                      Format : Sans le code {selectedCountry.code}
                    </span>
                    <span className="text-[9px] text-cyan-400 font-mono font-semibold animate-pulse">
                      Lancement local : {selectedCountry.launchHour.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-red-400 text-xs font-mono font-medium">{errorMsg}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full py-4 px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-sans font-black tracking-wide text-xs shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>TRAITEMENT EN COURS...</span>
                  ) : (
                    <>
                      <span>REJOINDRE LA LISTE D'ATTENTE</span>
                      <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 pt-3 border-t border-white/5 justify-center">
                <ShieldCheck className="w-4 h-4 text-cyan-500/60" />
                <span>Confidentialité totale garantie. Aucun spam.</span>
              </div>
            </motion.div>
          ) : !showList ? (
            /* CENTERED SUCCESS INSTRUCTIONS CARD (NO CLUTTER) */
            <motion.div
              key="success-instructions"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="max-w-xl mx-auto bg-slate-900/80 border border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(245,158,11,0.06)] space-y-6 mt-4"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-950/40 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-pulse">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-6 text-left max-w-md mx-auto">
                <div className="text-center pb-2 border-b border-white/5">
                  <span className="text-[10px] font-mono text-amber-400 font-extrabold uppercase tracking-widest bg-amber-950/50 border border-amber-500/20 px-2.5 py-1 rounded">
                    ⚠️ ACCÈS À ACTIVER AU LANCEMENT
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">🔥</span>
                    <p className="text-gray-200 font-sans font-medium text-sm md:text-base leading-relaxed">
                      Plus de <strong className="text-amber-400 font-extrabold">{totalCount} personnes</strong> ont déjà rejoint la liste d'attente.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">⚠️</span>
                    <p className="text-gray-200 font-sans font-medium text-sm md:text-base leading-relaxed">
                      Seulement <strong className="text-amber-400 font-extrabold">150 personnes</strong> pourront faire partie de cette ouverture.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">⏳</span>
                    <p className="text-cyan-200 font-sans font-extrabold text-sm md:text-base leading-relaxed">
                      Le <strong className="text-white">4 juillet à {
                        COUNTRIES.find(c => c.name === (localStorage.getItem('mz_user_country_v3') || selectedCountry.name))?.launchHour || selectedCountry.launchHour
                      }</strong>, sois présent dès l'ouverture pour maximiser tes chances de faire partie des <strong className="text-cyan-400 font-black underline decoration-cyan-400/50 decoration-2 underline-offset-4">150 premiers membres</strong>.
                    </p>
                  </div>
                </div>

                {/* Localized Countdown */}
                <div className="p-4 bg-slate-950/80 border border-amber-500/20 rounded-2xl text-center space-y-2 shadow-[0_0_20px_rgba(245,158,11,0.03)]">
                  <span className="text-[9px] font-mono text-amber-400/90 font-bold uppercase tracking-wider block">
                    ⏳ OUVERTURE : {
                      (COUNTRIES.find(c => c.name === (localStorage.getItem('mz_user_country_v3') || selectedCountry.name)) || selectedCountry).name.toUpperCase()
                    } ({
                      (COUNTRIES.find(c => c.name === (localStorage.getItem('mz_user_country_v3') || selectedCountry.name)) || selectedCountry).launchHour.split(' (')[0]
                    })
                  </span>
                  <div className="flex justify-center items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-mono font-black text-white leading-none">
                        {String(timeLeft.days).padStart(2, '0')}
                      </span>
                      <span className="text-[7px] font-mono text-gray-500 uppercase tracking-widest mt-1">jours</span>
                    </div>
                    <span className="text-sm font-mono text-amber-500 font-bold mb-3 animate-pulse">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-mono font-black text-white leading-none">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </span>
                      <span className="text-[7px] font-mono text-gray-500 uppercase tracking-widest mt-1">heures</span>
                    </div>
                    <span className="text-sm font-mono text-amber-500 font-bold mb-3 animate-pulse">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-mono font-black text-white leading-none">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </span>
                      <span className="text-[7px] font-mono text-gray-500 uppercase tracking-widest mt-1">min</span>
                    </div>
                    <span className="text-sm font-mono text-amber-500 font-bold mb-3 animate-pulse">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-mono font-black text-amber-400 leading-none filter drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                      <span className="text-[7px] font-mono text-amber-400/80 uppercase tracking-widest mt-1">sec</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-col gap-4">
                <button
                  onClick={() => setShowList(true)}
                  className="group relative w-full max-w-xs mx-auto py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-sans font-black tracking-wider text-xs shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>VOIR LA LISTE D'ATTENTE</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* IMMERSIVE LIVE WAITLIST DASHBOARD VIEW */
            <motion.div
              key="queue-dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-6"
            >
              {/* Sub Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <button
                    onClick={() => setShowList(false)}
                    className="group inline-flex items-center gap-1.5 text-[10px] font-mono text-gray-400 hover:text-cyan-400 transition-colors duration-300 cursor-pointer uppercase tracking-wider font-bold mb-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                    <span>RETOUR AUX INSTRUCTIONS DE CONFIRMATION</span>
                  </button>
                  <h2 className="text-xl font-sans font-black uppercase tracking-tight text-white flex items-center gap-2">
                    La File d'Attente MZ+ <span className="text-cyan-400 animate-pulse text-sm">● LIVE</span>
                  </h2>
                </div>

                {/* Small Counter Info */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-gray-400 block uppercase tracking-wider">Statut</span>
                    <span className="text-xs font-sans font-black text-amber-400 uppercase tracking-wide bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded shadow-[0_0_15px_rgba(245,158,11,0.1)] animate-pulse">
                      À ACTIVER ⏳
                    </span>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-gray-400 block uppercase tracking-wider">Inscrits</span>
                    <span className="text-base font-mono font-black text-white">
                      {totalCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side Status */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-900/40 border border-cyan-500/10 rounded-2xl p-5 space-y-4">
                    <div className="p-4 bg-amber-950/20 rounded-xl border border-amber-500/10 text-center">
                      <span className="text-[10px] font-mono text-gray-400 block uppercase tracking-wide">
                        Statut d'inscription
                      </span>
                      <span className="text-xs font-sans font-black text-amber-400 block mt-2.5 uppercase tracking-widest bg-amber-950/60 border border-amber-500/20 px-3 py-1.5 rounded-lg animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                        ⏳ EN ATTENTE D'ACTIVATION
                      </span>
                    </div>

                    {/* Localized Countdown */}
                    <div className="p-3 bg-slate-950 border border-cyan-500/5 rounded-xl text-center space-y-1.5">
                      <span className="text-[8px] font-mono text-cyan-400/80 font-bold uppercase tracking-wider block">
                        ⏳ OUVERTURE DANS VOTRE PAYS ({
                          (COUNTRIES.find(c => c.name === (localStorage.getItem('mz_user_country_v3') || selectedCountry.name)) || selectedCountry).name.toUpperCase()
                        })
                      </span>
                      <div className="flex justify-center items-center gap-2">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-mono font-black text-white leading-none">
                            {String(timeLeft.days).padStart(2, '0')}
                          </span>
                          <span className="text-[6px] font-mono text-gray-500 uppercase mt-0.5">j</span>
                        </div>
                        <span className="text-xs font-mono text-cyan-500 font-bold mb-2 animate-pulse">:</span>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-mono font-black text-white leading-none">
                            {String(timeLeft.hours).padStart(2, '0')}
                          </span>
                          <span className="text-[6px] font-mono text-gray-500 uppercase mt-0.5">h</span>
                        </div>
                        <span className="text-xs font-mono text-cyan-500 font-bold mb-2 animate-pulse">:</span>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-mono font-black text-white leading-none">
                            {String(timeLeft.minutes).padStart(2, '0')}
                          </span>
                          <span className="text-[6px] font-mono text-gray-500 uppercase mt-0.5">m</span>
                        </div>
                        <span className="text-xs font-mono text-cyan-500 font-bold mb-2 animate-pulse">:</span>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-mono font-black text-cyan-400 leading-none filter drop-shadow-[0_0_4px_rgba(6,182,212,0.4)]">
                            {String(timeLeft.seconds).padStart(2, '0')}
                          </span>
                          <span className="text-[6px] font-mono text-cyan-400/80 uppercase mt-0.5">s</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs text-gray-200 font-light leading-relaxed">
                      <div className="flex items-start gap-2.5">
                        <span className="text-amber-500 text-sm flex-shrink-0 mt-0.5">🔥</span>
                        <p>
                          Plus de <strong className="text-amber-400 font-extrabold">{totalCount} personnes</strong> ont déjà rejoint la liste d'attente.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-amber-400 text-sm flex-shrink-0 mt-0.5">⚠️</span>
                        <p>
                          Seulement <strong className="text-amber-400 font-black">150 personnes</strong> pourront faire partie de cette ouverture.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-cyan-400 text-sm flex-shrink-0 mt-0.5">⏳</span>
                        <p>
                          Le <strong className="text-white font-semibold">4 juillet à {
                            COUNTRIES.find(c => c.name === (localStorage.getItem('mz_user_country_v3') || selectedCountry.name))?.launchHour || selectedCountry.launchHour
                          }</strong>, sois présent dès l'ouverture pour maximiser tes chances de faire partie des <strong className="text-cyan-400 font-extrabold">150 premiers membres</strong>.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if(confirm("Voulez-vous enregistrer un autre numéro ou modifier vos coordonnées ?")) {
                          localStorage.removeItem('mz_user_registered_v3');
                          localStorage.removeItem('mz_user_email_v3');
                          localStorage.removeItem('mz_user_whatsapp_v3');
                          localStorage.removeItem('mz_user_country_v3');
                          localStorage.removeItem('mz_user_flag_v3');
                          localStorage.removeItem('mz_user_rank_v3');
                          setUserRank(201);
                          setIsSubmitted(false);
                          setShowList(false);
                        }
                      }}
                      className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 border border-white/5 rounded-xl text-[10px] font-mono text-gray-500 hover:text-white transition-all cursor-pointer font-bold uppercase tracking-wider"
                    >
                      S'inscrire avec un autre numéro
                    </button>
                  </div>
                </div>

                {/* Right Side Queue Table */}
                <div className="lg:col-span-8">
                  <div className="bg-slate-900/60 border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[520px] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    {/* Table Header */}
                    <div className="p-4 bg-slate-950 border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">
                      <span>Statut & Utilisateur</span>
                      <span>Pays & Temps</span>
                    </div>

                    {/* Scrollable Members List */}
                    <div 
                      ref={scrollContainerRef}
                      className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar pr-1"
                    >
                      <AnimatePresence initial={false}>
                        {members.map((member) => (
                          <motion.div
                            key={`${member.rank}-${member.email}`}
                            initial={{ opacity: 0, y: -15, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                            className={`flex items-center justify-between p-4 text-xs transition-colors overflow-hidden ${
                              member.isUser
                                ? "bg-cyan-950/40 border-l-2 border-cyan-400 shadow-[inset_0_0_15px_rgba(6,182,212,0.08)]"
                                : "hover:bg-slate-900/20"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="min-w-[75px] flex-shrink-0">
                                {member.isUser ? (
                                  <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-[8px] font-mono font-bold text-cyan-400 uppercase tracking-wider animate-pulse">
                                    ⚡ VOUS
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-white/5 text-[8px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                                    ⚡ EN QUEUE
                                  </span>
                                )}
                              </div>
                              
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium ${member.isUser ? 'text-cyan-300 font-extrabold' : 'text-gray-200'}`}>
                                    {member.email}
                                  </span>
                                </div>
                                <div className="text-[10px] text-gray-400 flex items-center gap-1.5 font-mono">
                                  <span>{member.phone}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right space-y-0.5">
                              <div className="flex items-center gap-1.5 justify-end">
                                <span className="text-[11px]">{member.flag}</span>
                                <span className="text-[10px] text-gray-300 font-mono font-medium">{member.country}</span>
                              </div>
                              <div className="text-[9px] text-gray-500 font-mono italic">
                                {member.time}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* List Footer Warning */}
                    <div className="p-4 bg-slate-950/90 border-t border-white/5 text-[10px] text-gray-400 font-mono text-center flex items-center justify-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-500/80 animate-pulse" />
                      <span>Pression d'enregistrement maximale. Le flux de demandes s'accélère à l'approche du 4 Juillet.</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
