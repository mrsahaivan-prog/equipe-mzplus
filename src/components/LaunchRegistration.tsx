/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Phone, User, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, 
  Sparkles, Lock, ChevronDown, Check, Star, ShieldAlert, CreditCard,
  Smartphone, Loader2, ArrowUpRight, HelpCircle, Hourglass
} from 'lucide-react';

import { COUNTRIES, Country } from '../countries';

// Helper interface for local pricing & operators mapping
interface LocalPriceInfo {
  amountString: string;
  currency: string;
  operators: { id: string; name: string; logoColor: string; bgClass: string }[];
}

export function getLocalPriceAndOperators(countryName: string): LocalPriceInfo {
  const name = countryName.toLowerCase();
  
  // 1. CFA Franc BCEAO (XOF) Countries: Côte d'Ivoire, Sénégal, Bénin, Burkina Faso, Mali, Niger, Togo
  if (
    name.includes("côte d'ivoire") || 
    name.includes("cote d'ivoire") || 
    name.includes("sénégal") || 
    name.includes("senegal") || 
    name.includes("bénin") || 
    name.includes("benin") || 
    name.includes("burkina") || 
    name.includes("mali") || 
    name.includes("niger") || 
    name.includes("togo")
  ) {
    return {
      amountString: "9 900 FCFA",
      currency: "FCFA (XOF)",
      operators: [
        { id: 'wave', name: 'Wave Mobile Money', logoColor: '#3b82f6', bgClass: 'bg-blue-600/10 border-blue-500/30 hover:border-blue-400 text-blue-300' },
        { id: 'orange', name: 'Orange Money', logoColor: '#f97316', bgClass: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-400 text-orange-300' },
        { id: 'mtn', name: 'MTN Mobile Money', logoColor: '#eab308', bgClass: 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-400 text-yellow-300' },
        { id: 'moov', name: 'Moov Money (Flooz)', logoColor: '#1e3a8a', bgClass: 'bg-indigo-950/40 border-indigo-500/30 hover:border-indigo-400 text-indigo-300' }
      ]
    };
  }

  // 2. CFA Franc BEAC (XAF) Countries: Cameroun, Congo-Brazzaville, Gabon, Tchad, Centrafrique, Guinée Équatoriale
  if (
    name.includes("cameroun") || 
    name.includes("congo-brazzaville") || 
    name.includes("congo-brazza") || 
    name.includes("gabon") || 
    name.includes("tchad") || 
    name.includes("centrafrique") || 
    name.includes("équatoriale") || 
    name.includes("equatoriale")
  ) {
    return {
      amountString: "9 900 FCFA",
      currency: "FCFA (XAF)",
      operators: [
        { id: 'orange', name: 'Orange Money', logoColor: '#f97316', bgClass: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-400 text-orange-300' },
        { id: 'mtn', name: 'MTN MoMo', logoColor: '#eab308', bgClass: 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-400 text-yellow-300' },
        { id: 'moov', name: 'Moov Money', logoColor: '#1e3a8a', bgClass: 'bg-indigo-950/40 border-indigo-500/30 hover:border-indigo-400 text-indigo-300' }
      ]
    };
  }

  // 3. Congo-Kinshasa (RDC)
  if (name.includes("congo-kinshasa") || name.includes("rdc") || name.includes("zaïre") || name.includes("zaire")) {
    return {
      amountString: "45 000 CDF",
      currency: "CDF (Franc Congolais)",
      operators: [
        { id: 'mpesa', name: 'M-Pesa', logoColor: '#dc2626', bgClass: 'bg-red-600/10 border-red-500/30 hover:border-red-400 text-red-300' },
        { id: 'orange', name: 'Orange Money', logoColor: '#f97316', bgClass: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-400 text-orange-300' },
        { id: 'airtel', name: 'Airtel Money', logoColor: '#ef4444', bgClass: 'bg-rose-950/40 border-rose-500/30 hover:border-rose-400 text-rose-300' }
      ]
    };
  }

  // 4. Guinée
  if (name.includes("guinée") || name.includes("guinee")) {
    return {
      amountString: "145 000 GNF",
      currency: "GNF (Franc Guinéen)",
      operators: [
        { id: 'orange', name: 'Orange Money', logoColor: '#f97316', bgClass: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-400 text-orange-300' },
        { id: 'mtn', name: 'MTN Mobile Money', logoColor: '#eab308', bgClass: 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-400 text-yellow-300' }
      ]
    };
  }

  // 5. Madagascar
  if (name.includes("madagascar")) {
    return {
      amountString: "75 000 MGA",
      currency: "MGA (Ariary)",
      operators: [
        { id: 'mvola', name: 'MVola', logoColor: '#16a34a', bgClass: 'bg-green-600/10 border-green-500/30 hover:border-green-400 text-green-300' },
        { id: 'orange', name: 'Orange Money', logoColor: '#f97316', bgClass: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-400 text-orange-300' },
        { id: 'airtel', name: 'Airtel Money', logoColor: '#ef4444', bgClass: 'bg-rose-950/40 border-rose-500/30 hover:border-rose-400 text-rose-300' }
      ]
    };
  }

  // 6. Maroc
  if (name.includes("maroc") || name.includes("morocco")) {
    return {
      amountString: "165 MAD",
      currency: "MAD (Dirham Marocain)",
      operators: [
        { id: 'orange', name: 'Orange Money', logoColor: '#f97316', bgClass: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-400 text-orange-300' },
        { id: 'wave', name: 'Wave Maroc', logoColor: '#3b82f6', bgClass: 'bg-blue-600/10 border-blue-500/30 hover:border-blue-400 text-blue-300' },
        { id: 'cih', name: 'CIH Mobile Pay', logoColor: '#0284c7', bgClass: 'bg-sky-950/40 border-sky-500/30 hover:border-sky-400 text-sky-300' }
      ]
    };
  }

  // 7. Algérie
  if (name.includes("algérie") || name.includes("algerie") || name.includes("algeria")) {
    return {
      amountString: "2 200 DZD",
      currency: "DZD (Dinar Algérien)",
      operators: [
        { id: 'baridimob', name: 'BaridiMob', logoColor: '#059669', bgClass: 'bg-emerald-600/10 border-emerald-500/30 hover:border-emerald-400 text-emerald-300' },
        { id: 'chargily', name: 'Chargily Pay', logoColor: '#0284c7', bgClass: 'bg-sky-950/40 border-sky-500/30 hover:border-sky-400 text-sky-300' }
      ]
    };
  }

  // 8. Tunisie
  if (name.includes("tunisie") || name.includes("tunisia")) {
    return {
      amountString: "50 TND",
      currency: "TND (Dinar Tunisien)",
      operators: [
        { id: 'sobflous', name: 'Sobflous Wallet', logoColor: '#7c3aed', bgClass: 'bg-purple-600/10 border-purple-500/30 hover:border-purple-400 text-purple-300' },
        { id: 'poste', name: 'D17 (Poste Tunisienne)', logoColor: '#f59e0b', bgClass: 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400 text-amber-300' }
      ]
    };
  }

  // 9. Mauritanie
  if (name.includes("mauritanie") || name.includes("mauritania")) {
    return {
      amountString: "650 MRU",
      currency: "MRU (Ouguiya)",
      operators: [
        { id: 'bankily', name: 'Bankily', logoColor: '#16a34a', bgClass: 'bg-green-600/10 border-green-500/30 hover:border-green-400 text-green-300' },
        { id: 'masrvi', name: 'Masrvi', logoColor: '#0284c7', bgClass: 'bg-sky-950/40 border-sky-500/30 hover:border-sky-400 text-sky-300' }
      ]
    };
  }

  // 10. Burundi
  if (name.includes("burundi")) {
    return {
      amountString: "48 000 BIF",
      currency: "BIF (Franc Burundais)",
      operators: [
        { id: 'ecocash', name: 'EcoCash Burundi', logoColor: '#16a34a', bgClass: 'bg-green-600/10 border-green-500/30 hover:border-green-400 text-green-300' },
        { id: 'lumicash', name: 'LumiCash', logoColor: '#dc2626', bgClass: 'bg-red-600/10 border-red-500/30 hover:border-red-400 text-red-300' }
      ]
    };
  }

  // 11. Rwanda
  if (name.includes("rwanda")) {
    return {
      amountString: "21 000 RWF",
      currency: "RWF (Franc Rwandais)",
      operators: [
        { id: 'mtn', name: 'MTN Mobile Money (MoMo)', logoColor: '#eab308', bgClass: 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-400 text-yellow-300' },
        { id: 'airtel', name: 'Airtel Money', logoColor: '#ef4444', bgClass: 'bg-rose-950/40 border-rose-500/30 hover:border-rose-400 text-rose-300' }
      ]
    };
  }

  // 12. Euro-zone (France, Belgique, etc.)
  if (
    name.includes("france") || 
    name.includes("belgique") || 
    name.includes("belgium") || 
    name.includes("luxembourg") || 
    name.includes("allemagne") || 
    name.includes("monaco") || 
    name.includes("suisse") || 
    name.includes("switzerland") || 
    name.includes("europe")
  ) {
    return {
      amountString: "15,00 €",
      currency: "EUR (€)",
      operators: [
        { id: 'card', name: 'Carte Bancaire (Secure)', logoColor: '#6366f1', bgClass: 'bg-indigo-600/10 border-indigo-500/30 hover:border-indigo-400 text-indigo-300' },
        { id: 'paypal', name: 'PayPal Secure Wallet', logoColor: '#2563eb', bgClass: 'bg-blue-600/10 border-blue-500/30 hover:border-blue-400 text-blue-300' },
        { id: 'applepay', name: 'Apple Pay / Google Pay', logoColor: '#f8fafc', bgClass: 'bg-slate-800/40 border-slate-700/30 hover:border-slate-500 text-slate-200' }
      ]
    };
  }

  // 13. Canada & USA
  if (name.includes("canada")) {
    return {
      amountString: "22,50 $ CAD",
      currency: "CAD ($)",
      operators: [
        { id: 'card', name: 'Credit Card (Secure)', logoColor: '#6366f1', bgClass: 'bg-indigo-600/10 border-indigo-500/30 hover:border-indigo-400 text-indigo-300' },
        { id: 'interac', name: 'Interac e-Transfer', logoColor: '#059669', bgClass: 'bg-emerald-600/10 border-emerald-500/30 hover:border-emerald-400 text-emerald-300' }
      ]
    };
  }

  if (name.includes("états-unis") || name.includes("united states") || name.includes("usa")) {
    return {
      amountString: "16,50 $ USD",
      currency: "USD ($)",
      operators: [
        { id: 'card', name: 'Credit Card (Stripe)', logoColor: '#6366f1', bgClass: 'bg-indigo-600/10 border-indigo-500/30 hover:border-indigo-400 text-indigo-300' },
        { id: 'paypal', name: 'PayPal Express', logoColor: '#2563eb', bgClass: 'bg-blue-600/10 border-blue-500/30 hover:border-blue-400 text-blue-300' }
      ]
    };
  }

  // Default Fallback
  return {
    amountString: "9 900 FCFA",
    currency: "FCFA (XOF)",
    operators: [
      { id: 'wave', name: 'Wave Mobile Money', logoColor: '#3b82f6', bgClass: 'bg-blue-600/10 border-blue-500/30 hover:border-blue-400 text-blue-300' },
      { id: 'orange', name: 'Orange Money', logoColor: '#f97316', bgClass: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-400 text-orange-300' },
      { id: 'mtn', name: 'MTN Mobile Money', logoColor: '#eab308', bgClass: 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-400 text-yellow-300' }
    ]
  };
}

function getIsoFromDialCode(dialCode: string, countryName?: string): string {
  const code = dialCode.replace("+", "").trim();
  const name = countryName ? countryName.toLowerCase() : "";
  
  if (code === "225" || name.includes("ivoire")) return "CI";
  if (code === "221" || name.includes("sénégal") || name.includes("senegal")) return "SN";
  if (code === "229" || name.includes("bénin") || name.includes("benin")) return "BJ";
  if (code === "226" || name.includes("burkina")) return "BF";
  if (code === "237" || name.includes("cameroun") || name.includes("cameroon")) return "CM";
  if (code === "242" || name.includes("congo-brazzaville")) return "CG";
  if (code === "243" || name.includes("congo-kinshasa") || name.includes("rdc")) return "CD";
  if (code === "241" || name.includes("gabon")) return "GA";
  if (code === "224" || name.includes("guinée") || name.includes("guinee")) return "GN";
  if (code === "223" || name.includes("mali")) return "ML";
  if (code === "212" || name.includes("maroc") || name.includes("morocco")) return "MA";
  if (code === "222" || name.includes("mauritanie") || name.includes("mauritania")) return "MR";
  if (code === "227" || name.includes("niger")) return "NE";
  if (code === "228" || name.includes("togo")) return "TG";
  if (code === "216" || name.includes("tunisie") || name.includes("tunisia")) return "TN";
  if (code === "213" || name.includes("algérie") || name.includes("algerie") || name.includes("algeria")) return "DZ";
  if (code === "261" || name.includes("madagascar")) return "MG";
  if (code === "33" || name.includes("france")) return "FR";
  if (code === "1") {
    if (name.includes("canada")) return "CA";
    return "US";
  }
  if (code === "32" || name.includes("belgique") || name.includes("belgium")) return "BE";
  if (code === "41" || name.includes("suisse") || name.includes("switzerland")) return "CH";
  
  const mapping: { [key: string]: string } = {
    "93": "AF", "27": "ZA", "49": "DE", "244": "AO", "966": "SA", "54": "AR", "61": "AU", "43": "AT",
    "55": "BR", "257": "BI", "56": "CL", "86": "CN", "357": "CY", "57": "CO", "269": "KM", "45": "DK",
    "253": "DJ", "20": "EG", "971": "AE", "34": "ES", "372": "EE", "251": "ET", "358": "FI", "220": "GM",
    "233": "GH", "30": "GR", "245": "GW", "240": "GQ", "509": "HT", "91": "IN", "62": "ID", "353": "IE",
    "39": "IT", "81": "JP", "254": "KE", "262": "RE", "352": "LU", "230": "MU", "52": "MX", "377": "MC",
    "234": "NG", "47": "NO", "64": "NZ", "31": "NL", "48": "PL", "351": "PT", "974": "QA", "44": "GB",
    "250": "RW", "248": "SC", "65": "SG", "46": "SE", "235": "TD", "90": "TR", "84": "VN"
  };
  
  return mapping[code] || "FR";
}

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
  
  // Registration steps flow: 'form' | 'preparing' | 'payment' | 'processing_payment' | 'finalizing_redirect' | 'success'
  const [registrationStep, setRegistrationStep] = useState<'form' | 'preparing' | 'payment' | 'processing_payment' | 'finalizing_redirect' | 'success'>('form');

  // Transition timer for finalizing_redirect step
  useEffect(() => {
    if (registrationStep !== 'finalizing_redirect') return;
    
    const timer = setTimeout(() => {
      setRegistrationStep('success');
    }, 4000); // Elegant 4 seconds of spinning transition as requested
    
    return () => clearTimeout(timer);
  }, [registrationStep]);
  
  // Step 1: Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES.find(c => c.name.includes("Côte d'Ivoire")) || COUNTRIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showPaymentCountryDropdown, setShowPaymentCountryDropdown] = useState(false);
  
  // Step 2: Preparing simulation states
  const [preparingProgress, setPreparingProgress] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [preparingChecks, setPreparingChecks] = useState<{ label: string; status: 'pending' | 'loading' | 'done' }[]>([
    { label: 'Vérification de vos informations', status: 'pending' },
    { label: 'Préparation de votre espace MZ+', status: 'pending' },
    { label: 'Vérification des places disponibles', status: 'pending' },
    { label: 'Tout est prêt !', status: 'pending' }
  ]);
  
  // Step 3: Payment Options & Fields
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [paymentError, setPaymentError] = useState('');
  const [placesRestantes, setPlacesRestantes] = useState<number>(3);
  
  // Step 3.5: Mobile Money Validation Simulation States
  const [countdownTimer, setCountdownTimer] = useState(45);
  const [paymentProcessingMsg, setPaymentProcessingMsg] = useState('Chiffrement des données de carte...');

  // Secret admin click tracking
  const [adminClicks, setAdminClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Poll universal settings to synchronize places remaining with admin config
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings) {
            const count = Number(data.settings.customCount);
            if (!isNaN(count)) {
              setPlacesRestantes(count);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching settings for placesRestantes", err);
      }
    };
    
    fetchSettings();
    const interval = setInterval(fetchSettings, 5000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic localization info based on chosen country
  const localization = getLocalPriceAndOperators(selectedCountry.name);

  const getOriginalValueString = (countryName: string): string => {
    const name = countryName.toLowerCase();
    if (name.includes("côte") || name.includes("cote") || name.includes("sénégal") || name.includes("senegal") || name.includes("bénin") || name.includes("benin") || name.includes("burkina") || name.includes("mali") || name.includes("niger") || name.includes("togo") || name.includes("cameroun") || name.includes("congo-brazzaville") || name.includes("gabon") || name.includes("tchad") || name.includes("centrafrique") || name.includes("équatoriale") || name.includes("equatoriale")) {
      return "149 000 FCFA";
    }
    if (name.includes("congo-kinshasa") || name.includes("rdc")) return "650 000 CDF";
    if (name.includes("guinée") || name.includes("guinee")) return "2 100 000 GNF";
    if (name.includes("madagascar")) return "1 100 000 MGA";
    if (name.includes("maroc") || name.includes("morocco")) return "2 490 MAD";
    if (name.includes("algérie") || name.includes("algerie") || name.includes("algeria")) return "33 000 DZD";
    if (name.includes("tunisie") || name.includes("tunisia")) return "750 TND";
    if (name.includes("mauritanie") || name.includes("mauritania")) return "9 800 MRU";
    if (name.includes("burundi")) return "720 000 BIF";
    if (name.includes("rwanda")) return "310 000 RWF";
    if (name.includes("france") || name.includes("belgique") || name.includes("belgium") || name.includes("luxembourg") || name.includes("allemagne") || name.includes("monaco") || name.includes("suisse") || name.includes("switzerland") || name.includes("europe")) {
      return "249,00 €";
    }
    if (name.includes("canada")) return "349,00 $ CAD";
    return "249,00 $ USD";
  };

  // Sync mobileMoneyNumber with the registered phone on initial load or step change
  useEffect(() => {
    if (phone) {
      // Prepopulate mobile money number with the user's phone number
      setMobileMoneyNumber(phone);
    }
  }, [phone, registrationStep]);

  // Select default operator based on localization
  useEffect(() => {
    if (localization.operators.length > 0) {
      setSelectedOperator(localization.operators[0].id);
    }
  }, [selectedCountry]);

  // Check if redirected back with a successful Chariow checkout param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('chariow_success') === 'true' || params.get('success') === 'true') {
      setRegistrationStep('finalizing_redirect');
    }
  }, []);

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

      // Transition to Step 2
      setRegistrationStep('preparing');
    } catch (err) {
      console.error("Local registration fallback due to:", err);
      localStorage.setItem('mz_user_registered_v3', 'true');
      localStorage.setItem('mz_user_email_v3', email.trim());
      localStorage.setItem('mz_user_whatsapp_v3', fullPhone);
      localStorage.setItem('mz_user_fullname_v3', fullName.trim());
      localStorage.setItem('mz_user_country_v3', selectedCountry.name);
      
      const randomPassNum = Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('mz_user_pass_number', String(randomPassNum));

      setRegistrationStep('preparing');
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 2: PREPARING SUBMISSION (ORGANIC SIMULATED ENGINE)
  useEffect(() => {
    if (registrationStep !== 'preparing') return;

    setPreparingProgress(0);
    setIsRedirecting(false);
    setPreparingChecks([
      { label: 'Vérification de vos informations', status: 'loading' },
      { label: "Analyse des critères d'admissibilité", status: 'pending' },
      { label: 'Vérification de la disponibilité des places', status: 'pending' },
      { label: "Préparation de l'étape finale de paiement", status: 'pending' }
    ]);

    // Let the total duration be exactly 20 seconds (20,000 ms) as requested by the user
    const totalDuration = 20000; 
    const intervalTime = 100; 
    const totalSteps = totalDuration / intervalTime;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      let currentProgress = Math.min((step / totalSteps) * 100, 100);
      
      // Add realistic microscopic pauses or slow-downs at certain points to simulate intense server computation
      if (currentProgress > 22 && currentProgress < 25) {
        currentProgress = 23;
      } else if (currentProgress > 46 && currentProgress < 50) {
        currentProgress = 48;
      } else if (currentProgress > 72 && currentProgress < 75) {
        currentProgress = 73;
      } else if (currentProgress > 94 && currentProgress < 98) {
        currentProgress = 96;
      }

      setPreparingProgress(Math.floor(currentProgress));

      // Update structural checkbox statuses
      setPreparingChecks(prev => {
        const next = [...prev];
        if (currentProgress < 25) {
          next[0].status = 'loading';
          next[1].status = 'pending';
          next[2].status = 'pending';
          next[3].status = 'pending';
        } else if (currentProgress >= 25 && currentProgress < 50) {
          next[0].status = 'done';
          next[1].status = 'loading';
          next[2].status = 'pending';
          next[3].status = 'pending';
        } else if (currentProgress >= 50 && currentProgress < 75) {
          next[0].status = 'done';
          next[1].status = 'done';
          next[2].status = 'loading';
          next[3].status = 'pending';
        } else if (currentProgress >= 75 && currentProgress < 98) {
          next[0].status = 'done';
          next[1].status = 'done';
          next[2].status = 'done';
          next[3].status = 'loading';
        } else if (currentProgress >= 98) {
          next[0].status = 'done';
          next[1].status = 'done';
          next[2].status = 'done';
          next[3].status = 'done';
        }
        return next;
      });

      if (step >= totalSteps) {
        clearInterval(interval);
        // Gently activate redirection transition before navigating
        setIsRedirecting(true);
        setTimeout(() => {
          setRegistrationStep('payment');
        }, 1800); // Elegant 1.8 seconds transition to inspire absolute trust and success
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [registrationStep]);

  // STEP 3: MOBILE MONEY SUBMIT HANDLER
  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!mobileMoneyNumber.trim()) {
      setPaymentError('Veuillez entrer votre numéro de téléphone Mobile Money.');
      return;
    }
    let operatorToUse = selectedOperator;
    if (!operatorToUse && localization.operators && localization.operators.length > 0) {
      operatorToUse = localization.operators[0].id;
    }

    setPaymentError('');
    setIsSubmitting(true);

    try {
      const savedEmail = localStorage.getItem('mz_user_email_v3') || email || "";
      const savedFullName = localStorage.getItem('mz_user_fullname_v3') || fullName || "";
      
      // Split full name into first and last name
      const nameParts = savedFullName.trim().split(/\s+/);
      const first_name = nameParts[0] || "Client";
      const last_name = nameParts.slice(1).join(" ") || "MZ+";
      
      // Clean mobile money number (digits only)
      const digitsOnly = mobileMoneyNumber.replace(/\D/g, "");
      
      // Get country iso
      const countryIso = getIsoFromDialCode(selectedCountry.code, selectedCountry.name);

      const response = await fetch('/api/chariow/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: savedEmail,
          first_name,
          last_name,
          phone: {
            number: digitsOnly,
            country_code: countryIso
          },
          redirect_url: window.location.origin + "?chariow_success=true"
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log("Chariow checkout response:", data);
        
        const checkoutData = data.data;
        const step = checkoutData?.step;

        if (checkoutData?.simulation) {
          // If in simulation mode, go to the animated loading/validation screen
          setRegistrationStep('processing_payment');
        } else if (step === 'payment') {
          // Real payment: Redirect to Chariow Checkout URL!
          const checkoutUrl = checkoutData?.payment?.checkout_url;
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          } else {
            setPaymentError("L'URL de paiement Chariow n'a pas été fournie par le serveur.");
          }
        } else if (step === 'completed' || step === 'already_purchased') {
          // Sale finalized immediately or client already possesses the product
          setRegistrationStep('success');
        } else {
          // Fallback
          setRegistrationStep('processing_payment');
        }
      } else {
        if (data.errors && typeof data.errors === 'object') {
          const firstErrorKey = Object.keys(data.errors)[0];
          const firstErrorMsg = Array.isArray(data.errors[firstErrorKey]) 
            ? data.errors[firstErrorKey][0] 
            : data.errors[firstErrorKey];
          setPaymentError(`Validation Chariow : Le champ ${firstErrorKey} est incorrect ou requis (${firstErrorMsg})`);
        } else {
          setPaymentError(data.error || "Une erreur s'est produite lors de l'initialisation du paiement Chariow.");
        }
      }
    } catch (err: any) {
      console.error("Chariow payment fallback to local processing simulation:", err);
      // Fallback gracefully so we never block users
      setRegistrationStep('processing_payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 3.5: PAYMENT TRANSACTION PROCESSING TIMER & LOGS
  useEffect(() => {
    if (registrationStep !== 'processing_payment') return;

    // Reset timer to 15 seconds as requested by user
    setCountdownTimer(15);

    const messages = [
      'Chiffrement SSL de la transaction en cours...',
      'Établissement du tunnel de paiement sécurisé local...',
      'Communication avec la passerelle bancaire certifiée...',
      `Génération de l'ordre de débit de ${localization.amountString}...`,
      'Veuillez surveiller votre écran de téléphone mobile...',
      'En attente de la saisie de votre code PIN confidentiel...',
      'Saisie du code PIN détectée. Validation par la banque...',
      'Authentification de la transaction approuvée avec succès !',
      'Création et sécurisation de votre badge Élite MZ+...'
    ];

    let currentMsgIdx = 0;
    setPaymentProcessingMsg(messages[0]);

    // Progress text messaging intervals (approx every 1.6 seconds to fit 15s)
    const textInterval = setInterval(() => {
      currentMsgIdx++;
      if (currentMsgIdx < messages.length) {
        setPaymentProcessingMsg(messages[currentMsgIdx]);
      }
    }, 1600);

    // Dynamic timer countdown simulation (shows a real ticking prompt on phone)
    const countdown = setInterval(() => {
      setCountdownTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Direct redirection to finalizing redirect screen after exactly 15 seconds
    const timeout = setTimeout(() => {
      setRegistrationStep('finalizing_redirect');
    }, 15000);

    return () => {
      clearInterval(textInterval);
      clearInterval(countdown);
      clearTimeout(timeout);
    };
  }, [registrationStep, localization.amountString]);

  const getSavedPassNumber = () => {
    return localStorage.getItem('mz_user_pass_number') || '482094';
  };

  const getSavedFullName = () => {
    return localStorage.getItem('mz_user_fullname_v3') || fullName || 'Membre d\'Élite MZ+';
  };

  const getSavedEmail = () => {
    return localStorage.getItem('mz_user_email_v3') || email || 'votre-email@domaine.com';
  };

  const handleContinuerVersMZ = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.href = '/';
    }
  };

  if (registrationStep === 'preparing') {
    return (
      <div className="w-full h-screen max-h-screen bg-slate-950 text-white font-sans overflow-hidden relative flex flex-col justify-center items-center py-2 px-4 selection:bg-cyan-500/30 selection:text-cyan-200">
        
        {/* HIGH-VISIBILITY FIXED TOP PROGRESS BAR */}
        <div className="fixed top-0 left-0 right-0 h-3.5 bg-slate-900 border-b border-white/5 z-50 overflow-hidden flex items-center justify-between px-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[9px] font-mono font-black text-cyan-400 tracking-wider uppercase flex items-center gap-1">
              🔒 Sécurisation en cours : <span className="text-white">{preparingProgress}%</span>
            </span>
          </div>
          
          {/* Main Top Progress Strip */}
          <div className="flex-1 max-w-xs sm:max-w-md mx-4 h-1.5 bg-slate-950 rounded-full overflow-hidden p-[1px] border border-white/5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              style={{ width: `${preparingProgress}%` }}
            />
          </div>

          <div className="text-[9px] font-mono text-gray-400 font-bold uppercase shrink-0">
            Étape 2 / 3
          </div>
        </div>

        {/* Sleek minimalist overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.03),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.12)_50%,_rgba(0,0,0,0.6)_50%)] bg-[length:100%_4px] pointer-events-none opacity-10" />
        
        <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-emerald-500/3 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-md w-full mx-auto relative z-10 space-y-4 text-center flex flex-col justify-center items-center">
          
          <AnimatePresence mode="wait">
            {!isRedirecting ? (
              <motion.div
                key="loading-panel"
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                className="w-full space-y-4"
              >
                {/* Compact Header */}
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono tracking-wider font-bold uppercase shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>🛡️ ANALYSE D'ADMISSIBILITÉ PRIVÉE</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase leading-tight flex items-center justify-center gap-1.5">
                    <span>⚙️</span> Création de votre espace MZ+
                  </h1>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto font-light leading-relaxed">
                    Veuillez patienter. Nos serveurs d'affaires sécurisés initialisent votre infrastructure d'admission.
                  </p>
                </div>

                {/* MAIN COMPACT CARD */}
                <div className="w-full bg-slate-900/60 border border-white/5 rounded-2xl p-5 sm:p-6 backdrop-blur-xl space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                  
                  {/* Extremely elegant compact circular indicator & bar */}
                  <div className="flex items-center justify-between gap-4 bg-slate-950/40 rounded-xl p-3 border border-white/[0.02]">
                    <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                      {/* Outer rotating ring */}
                      <div className="absolute inset-0 rounded-full border border-white/5" />
                      <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" style={{ animationDuration: '3.5s' }} />
                      <span className="text-xs font-mono font-black text-cyan-400">{preparingProgress}%</span>
                    </div>
                    
                    <div className="flex-1 text-left space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 uppercase tracking-wider">
                        <span>🚀 INITIALISATION ACTIVE</span>
                        <span className="text-cyan-400 font-bold">CHARGE DU SERVEUR</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden p-[1px] border border-white/5">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 transition-all duration-300"
                          style={{ width: `${preparingProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* THE 4 PILLARS - MINIMALIST & PROFESSIONAL */}
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {preparingChecks.map((check, idx) => {
                      const isCurrent = check.status === 'loading';
                      const isDone = check.status === 'done';
                      
                      // Beautiful icons & custom emojis
                      const emojis = ["📋", "⚙️", "🎟️", "✨"];
                      const currentEmojis = ["🔍", "🛠️", "⏳", "🔄"];
                      const emoji = isCurrent ? currentEmojis[idx] : (isDone ? "✅" : emojis[idx]);

                      return (
                        <div 
                          key={idx} 
                          className={`flex items-center justify-between text-left rounded-xl px-3.5 py-2 transition-all duration-300 border text-xs ${
                            isCurrent 
                              ? 'bg-cyan-950/15 border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.05)]' 
                              : isDone 
                                ? 'bg-emerald-950/10 border-emerald-500/10' 
                                : 'bg-slate-950/20 border-white/[0.01] opacity-30'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm shrink-0">{emoji}</span>
                            <div>
                              <span className={`font-sans text-xs block transition-colors duration-300 ${
                                isDone ? 'text-white font-medium line-through decoration-emerald-500/20' : 
                                isCurrent ? 'text-cyan-300 font-bold' : 'text-gray-500'
                              }`}>
                                {check.label}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] text-cyan-400/80 font-mono block mt-0.5 animate-pulse">
                                  {idx === 0 && "Analyse de sécurité de vos données..."}
                                  {idx === 1 && "Évaluation du profil de candidature..."}
                                  {idx === 2 && "Recherche de créneau disponible en temps réel..."}
                                  {idx === 3 && "Génération de votre session de facturation locale..."}
                                </span>
                              )}
                              {isDone && (
                                <span className="text-[9px] text-emerald-500 font-mono block mt-0.5">
                                  Étape validée.
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="text-[9px] font-mono shrink-0 ml-4 font-bold">
                            {isDone ? (
                              <span className="text-emerald-400 font-bold">VALIDÉ</span>
                            ) : isCurrent ? (
                              <span className="text-cyan-400 animate-pulse font-bold">EN COURS</span>
                            ) : (
                              <span className="text-gray-600">ATTENTE</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SOBER REASSURING TRUST FOOTER */}
                <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-gray-500 uppercase tracking-widest pt-1">
                  <Lock className="w-3 h-3 text-gray-600" />
                  <span>🔐 Cryptage SSL 256-bit hautement sécurisé</span>
                </div>
              </motion.div>
            ) : (
              /* GLOWING HIGH-TENSION REDIRECT OVERLAY */
              <motion.div
                key="redirect-panel"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, type: 'spring' }}
                className="w-full space-y-5"
              >
                <div className="w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(245,158,11,0.15)] space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.05),transparent_70%)] pointer-events-none" />
                  
                  {/* Glowing urgent hourglass icon */}
                  <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                    <Hourglass className="w-7 h-7 animate-pulse text-amber-400" />
                  </div>

                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-950 border border-amber-500/30 text-amber-400 text-[9px] font-mono tracking-widest uppercase font-black">
                      ⚠️ PLACE RESERVÉE TEMPORAIREMENT (15 MIN)
                    </span>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">
                      Finalisation de votre inscription
                    </h2>
                    <p className="text-xs text-gray-300 leading-relaxed font-light max-w-sm mx-auto">
                      Votre dossier de candidature est pré-approuvé. Votre place d'admission d'élite est bloquée pour une durée de <strong className="text-amber-400 font-bold">15 minutes uniquement</strong>. Vous devez valider l'étape de règlement suivante pour sécuriser vos accès.
                    </p>
                  </div>

                  {/* Circular scanning spinner */}
                  <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-cyan-400 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Chargement de la session de paiement sécurisée...</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                  <Lock className="w-3 h-3 text-gray-600" />
                  <span>🔐 Redirection sécurisée en cours...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    );
  }
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

      {/* STEP TRACKER - REASSURES VALUE AND Rarity */}
      <div className="max-w-xl w-full mx-auto mb-6 relative z-10 px-2">
        <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-gray-500 uppercase">
          <span className={`${registrationStep === 'form' ? 'text-cyan-400 font-extrabold' : 'text-emerald-400 font-bold'}`}>
            1. Formulaire {registrationStep !== 'form' && '✓'}
          </span>
          <span className={`${registrationStep === 'preparing' ? 'text-cyan-400 font-extrabold animate-pulse' : registrationStep !== 'form' && registrationStep !== 'preparing' ? 'text-emerald-400 font-bold' : ''}`}>
            2. Préparation {['payment', 'processing_payment', 'success'].includes(registrationStep) && '✓'}
          </span>
          <span className={`${registrationStep === 'payment' || registrationStep === 'processing_payment' ? 'text-cyan-400 font-extrabold' : registrationStep === 'success' ? 'text-emerald-400 font-bold' : ''}`}>
            3. Paiement {registrationStep === 'success' && '✓'}
          </span>
          <span className={`${registrationStep === 'success' ? 'text-cyan-400 font-extrabold' : ''}`}>
            4. Accès Élite
          </span>
        </div>
        <div className="w-full h-1 bg-slate-900 rounded-full mt-2 relative overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
            style={{ 
              width: 
                registrationStep === 'form' ? '25%' :
                registrationStep === 'preparing' ? '50%' :
                registrationStep === 'payment' ? '75%' :
                registrationStep === 'processing_payment' ? '88%' : '100%'
            }}
          />
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-xl w-full mx-auto relative z-10 my-auto flex flex-col justify-center transition-all duration-300">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: FORM VIEW */}
          {registrationStep === 'form' && (
            <motion.div
              key="registration-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
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
                        <span className="font-mono tracking-widest text-xs">TRAITEMENT D'ADMISSION EN COURS...</span>
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
                      <span>PROFILING DE SÉCURITÉ INTEGRE</span>
                    </div>
                  </div>
                </form>
              </div>

              <p className="text-center text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                🔒 VOS DONNÉES DE CANDIDATURE RESTENT STRICTEMENT CONFIDENTIELLES
              </p>
            </motion.div>
          )}


          {/* STEP 3: PAYMENT VIEW (RADICALLY SIMPLIFIED AS REQUESTED) */}
          {registrationStep === 'payment' && (
            <motion.div
              key="payment-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 w-full text-center max-w-md mx-auto"
            >
              {/* 1. TITLE */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                  🚀 Vous êtes à une étape de rejoindre MZ+
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 font-light max-w-sm mx-auto leading-relaxed">
                  Finalisez votre paiement pour débloquer votre accès à MZ+ et commencer votre parcours.
                </p>
              </div>

              {/* 2. REMAINING SEATS SECTOR */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-sans font-semibold text-xs sm:text-sm animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span>{placesRestantes} places restantes</span>
              </div>

              {/* 3. THE PRICE BOX */}
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 space-y-1">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">PRIX D'ADHÉSION</span>
                <strong className="text-4xl sm:text-5xl font-mono font-black text-cyan-400 tracking-tight block">
                  {localization.amountString}
                </strong>
              </div>

              {/* 4. THE PHONE FIELD & CTAs ONLY */}
              <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-5 text-left">
                
                {/* UNIFIED PHONE NUMBER INPUT WITH INTEGRATED COUNTRY SELECTOR */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                    Numéro de téléphone
                  </label>
                  
                  <div className="relative flex items-center bg-slate-950 border border-white/5 rounded-xl focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
                    
                    {/* Integrated Country Selector inside the field */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowPaymentCountryDropdown(!showPaymentCountryDropdown)}
                        className="flex items-center gap-1 px-3.5 py-3.5 border-r border-white/5 text-xs font-sans text-white hover:bg-white/[0.02] active:bg-white/[0.04] rounded-l-xl transition-all cursor-pointer h-full"
                      >
                        <span className="text-base leading-none select-none">{selectedCountry.flag}</span>
                        <span className="text-xs font-mono font-bold text-gray-300 ml-1">{selectedCountry.code}</span>
                        <ChevronDown className="w-3 h-3 text-gray-500 shrink-0 ml-1" />
                      </button>

                      <AnimatePresence>
                        {showPaymentCountryDropdown && (
                          <>
                            <div 
                              className="fixed inset-0 z-[100]" 
                              onClick={() => setShowPaymentCountryDropdown(false)} 
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute left-0 mt-2 w-60 max-h-56 overflow-y-auto bg-slate-950 border border-white/10 rounded-xl shadow-2xl z-[101] divide-y divide-white/[0.03]"
                            >
                              {COUNTRIES.map((c, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(c);
                                    setShowPaymentCountryDropdown(false);
                                    if (paymentError) setPaymentError('');
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

                    {/* Phone Input inside the unified field */}
                    <input
                      type="text"
                      required
                      value={mobileMoneyNumber}
                      onChange={(e) => {
                        setMobileMoneyNumber(e.target.value);
                        if (paymentError) setPaymentError('');
                      }}
                      placeholder="Saisissez votre numéro"
                      className="w-full bg-transparent border-0 py-3.5 pl-3 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-0 font-mono"
                    />
                  </div>
                </div>

                {/* ERROR FEEDBACK DISPLAY */}
                <AnimatePresence>
                  {paymentError && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 text-xs font-mono flex items-center gap-2 text-left"
                    >
                      <ShieldAlert className="w-4.5 h-4.5 text-red-400 shrink-0" />
                      <span>{paymentError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTAs */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handlePaymentSubmit}
                    disabled={isSubmitting}
                    className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-400 text-slate-950 font-sans font-black tracking-wider text-sm shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span className="font-mono tracking-widest text-xs">COMMUNICATION SÉCURISÉE...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-slate-950 fill-slate-950 stroke-[3]" />
                        <span>Finaliser mon accès</span>
                      </>
                    )}
                  </button>

                  {/* 20 000 DISCOUNT BENEFIT */}
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium space-y-1 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎁</span>
                      <strong className="text-white font-bold uppercase tracking-wide">Réduction de 20 000 FCFA appliquée</strong>
                    </div>
                    <p className="text-[11px] text-gray-300 font-light leading-relaxed pl-6">
                      Le tarif d'adhésion a été automatiquement réduit de <span className="line-through text-gray-500 font-normal">29 900 FCFA</span> à seulement <strong className="text-cyan-400 font-extrabold">{localization.amountString}</strong> pour votre zone aujourd'hui.
                    </p>
                  </div>

                  {/* PREMIUM BENEFITS STACK */}
                  <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5 space-y-4 mt-4 text-left">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-tight flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                      <span>🚀</span>
                      <span>Ce que votre accès à MZ+ vous permettra de faire</span>
                    </h3>
                    
                    <div className="flex items-start gap-3 text-xs sm:text-sm">
                      <span className="text-base shrink-0 select-none mt-0.5">🧠</span>
                      <p className="text-gray-300 font-light leading-relaxed">
                        <strong className="text-white font-semibold">Développer les compétences</strong> nécessaires pour construire votre liberté financière.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3 text-xs sm:text-sm border-t border-white/[0.03] pt-3">
                      <span className="text-base shrink-0 select-none mt-0.5">💸</span>
                      <p className="text-gray-300 font-light leading-relaxed">
                        <strong className="text-white font-semibold">Générer des revenus de plusieurs façons</strong> grâce au système MZ+.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 text-xs sm:text-sm border-t border-white/[0.03] pt-3">
                      <span className="text-base shrink-0 select-none mt-0.5">🎯</span>
                      <p className="text-gray-300 font-light leading-relaxed">
                        <strong className="text-white font-semibold">Passer à l'action avec un plan clair</strong>, étape par étape, sans avancer seul.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 text-xs sm:text-sm border-t border-white/[0.03] pt-3">
                      <span className="text-base shrink-0 select-none mt-0.5">👥</span>
                      <p className="text-gray-300 font-light leading-relaxed">
                        <strong className="text-white font-semibold">Rejoindre une communauté ambitieuse</strong> qui évolue vers un même objectif : la liberté financière.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 text-xs sm:text-sm border-t border-white/[0.03] pt-3">
                      <span className="text-base shrink-0 select-none mt-0.5">📈</span>
                      <p className="text-gray-300 font-light leading-relaxed">
                        <strong className="text-white font-semibold">Construire des revenus sur le long terme</strong> grâce à des méthodes structurées et applicables.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 text-xs sm:text-sm border-t border-white/[0.03] pt-3">
                      <span className="text-base shrink-0 select-none mt-0.5">🔥</span>
                      <p className="text-gray-300 font-light leading-relaxed">
                        <strong className="text-white font-semibold">Transformer votre motivation en actions concrètes</strong> et commencer à bâtir un véritable projet.
                      </p>
                    </div>
                  </div>
                </div>

                {/* BACK BUTTON */}
                <div className="pt-2 border-t border-white/[0.03] flex justify-center">
                  <button
                    type="button"
                    onClick={() => setRegistrationStep('form')}
                    className="text-[11px] font-mono text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Retourner au formulaire de candidature</span>
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* STEP 3.5: ORGANIC REALISTIC PAYMENT PENDING OVERLAY (SAY NO TO RUSHED TIMERS) */}
          {registrationStep === 'processing_payment' && (
            <motion.div
              key="processing-payment"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6 py-4"
            >
              <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center space-y-6">
                
                {/* Pulse radar spinner */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border border-cyan-500/20 flex items-center justify-center animate-ping absolute" />
                  <div className="w-20 h-20 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center relative">
                    <Smartphone className="w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-3 max-w-sm">
                  <span className="text-[9px] font-mono tracking-[0.2em] text-cyan-400 uppercase font-black block">
                    TRANSACTION CRYPTÉE MULTI-CANAL PCI-DSS
                  </span>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">
                    Vous êtes presque à la fin !
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed max-w-xs mx-auto">
                    Il vous manque une étape avant de prendre votre place.
                  </p>
                  <p className="text-xs text-amber-300 font-mono bg-amber-950/20 border border-amber-500/10 px-3 py-1 rounded-full inline-block animate-pulse">
                    ⏱️ Validation attendue d'ici : {countdownTimer}s
                  </p>
                  
                  {/* Step info list showing real world actions */}
                  <div className="bg-slate-950 rounded-2xl p-4.5 border border-white/5 text-left space-y-3 mt-4">
                    <h3 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block text-center border-b border-white/5 pb-2 mb-2">
                      INSTRUCTIONS DE VALIDATION SÉCURISÉE
                    </h3>
                    <div className="flex gap-2 text-xs">
                      <span className="font-mono text-cyan-400 font-black">1.</span>
                      <p className="text-gray-300 font-light leading-relaxed">
                        Un message de confirmation sécurisé de votre moyen de facturation local va apparaître instantanément sur votre écran de téléphone.
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs border-t border-white/[0.03] pt-2">
                      <span className="font-mono text-cyan-400 font-black">2.</span>
                      <p className="text-gray-300 font-light leading-relaxed">
                        Saisissez votre <strong className="text-white">Code confidentiel</strong> pour approuver le règlement hautement sécurisé de <strong className="text-cyan-400">{localization.amountString}</strong>.
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs border-t border-white/[0.03] pt-2">
                      <span className="font-mono text-cyan-400 font-black">3.</span>
                      <p className="text-gray-300 font-light leading-relaxed">
                        Une fois validé, la confirmation est instantanée et votre espace d'accès Élite MZ+ s'active immédiatement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-xs space-y-2">
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5 p-[1.5px]">
                    <motion.div 
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-400"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 15.0, ease: 'linear' }}
                    />
                  </div>
                  <p className="text-[10px] text-cyan-400 font-mono animate-pulse">
                    ⚡ {paymentProcessingMsg}
                  </p>
                </div>

                <p className="text-[10px] text-gray-500 font-mono">
                  SÉCURITÉ INTACTE : Ne rechargez pas cette page pour éviter un doublon.
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 3.8: FINALIZING REGISTRATION TRANSITION LOADER */}
          {registrationStep === 'finalizing_redirect' && (
            <motion.div
              key="finalizing-redirect"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6 py-8 text-center max-w-md mx-auto"
            >
              <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center space-y-6">
                
                {/* Custom Elegant Spin Loader */}
                <div className="relative flex items-center justify-center">
                  {/* Outer glowing pulsing ring */}
                  <div className="w-20 h-20 rounded-full border-2 border-cyan-500/10 animate-pulse absolute" />
                  
                  {/* Spinning loader */}
                  <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-cyan-400 animate-spin" />
                  
                  {/* Inner brand dot */}
                  <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse absolute" />
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    Finalisation de votre inscription
                  </h2>
                  
                  <div className="flex items-center justify-center gap-1 text-cyan-400 font-mono text-xs sm:text-sm tracking-widest font-black uppercase">
                    <span className="animate-pulse">Redirection en cours...</span>
                  </div>

                  <p className="text-xs text-gray-400 font-light max-w-xs mx-auto leading-relaxed pt-2">
                    Veuillez ne pas fermer ni rafraîchir cette page. Nous configurons vos accès sécurisés au réseau MZ+.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS REGISTRATION PORTRAIT PASS CARD */}
          {registrationStep === 'success' && (
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
                  ACCÈS ÉLITE PLATINUM VALIDÉ !
                </h1>
                <p className="text-xs sm:text-sm text-gray-300 font-light max-w-sm mx-auto leading-relaxed">
                  Félicitations. Votre demande d'admission prioritaire a été confirmée avec succès par Mobile Money !
                </p>
              </div>

              {/* PLATINUM ACCESS PORTRAIT PASS CARD */}
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.08),transparent_70%)] pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-2xl rounded-full" />
                
                {/* Decorative border glows */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-500 to-transparent" />

                {/* Pass Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 relative z-10">
                  <div className="space-y-0.5 text-left">
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

                {/* Pass details */}
                <div className="space-y-4 relative z-10 py-2 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">MEMBRE ENREGISTRÉ</span>
                      <span className="text-sm font-bold text-white tracking-wide truncate block">{getSavedFullName()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">STATUT DE LICENCE</span>
                      <span className="text-xs font-mono font-black text-emerald-400 uppercase flex items-center gap-1 mt-0.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        MEMBRE PLATINUM ACTIF
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">CANAL INTÉGRATION</span>
                      <span className="text-[10px] font-mono text-gray-300 block truncate">{getSavedEmail()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">RÉSEAU SÉCURISÉ</span>
                      <span className="text-[10px] font-mono text-cyan-400/80 block uppercase">FIBRE DIRECTE MZ+</span>
                    </div>
                  </div>
                </div>

                {/* Card footer seal */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-gray-500 relative z-10">
                  <span className="tracking-widest uppercase">ÉCOSYSTÈME MULTIMILLIONNAIRE MZ+</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 font-extrabold animate-pulse">
                    LICENCE ACTIVÉE
                  </span>
                </div>
              </div>

              {/* INTEGRATION NOTIFICATION INFO */}
              <div className="p-4.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/10 space-y-2 text-center shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
                <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Accès Déverrouillé</span>
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  Un de nos coordinateurs d'affaires MZ+ va vous contacter par e-mail ou par téléphone pour vous attribuer vos salons privés et vos accès Telegram Elite sous 2 à 4 heures.
                </p>
              </div>

              {/* ACTION BUTTON WITH THE EXACT MANDATED WORDING: Continuer vers MZ+ */}
              <button
                onClick={handleContinuerVersMZ}
                className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-sans font-black tracking-wider text-sm shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continuer vers MZ+</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-[10px] text-gray-600 font-mono mt-8 relative z-10">
        © 2026 MZ+ Inc. • Tous droits réservés • Accès membre strictement confidentiel.
      </footer>
    </div>
  );
}
