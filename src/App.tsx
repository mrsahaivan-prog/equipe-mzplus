/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import PlatformPreview from './components/PlatformPreview';
import AcademyView from './components/AcademyView';
import BusinessView from './components/BusinessView';
import CommunityView from './components/CommunityView';
import IntroModal from './components/IntroModal';
import WaitlistPage from './components/WaitlistPage';
import AdminPanel from './components/AdminPanel';
import LaunchRegistration from './components/LaunchRegistration';
import { isLaunchModeActive } from './utils';
import { useAppRoute } from './router';

export default function App() {
  const { route, navigate } = useAppRoute();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [waitlistSource, setWaitlistSource] = useState('general');
  const [highlightAcademy, setHighlightAcademy] = useState(false);
  const [hasHighlighted, setHasHighlighted] = useState(false);

  const handleRefreshAll = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    (window as any).openMZAdmin = () => {
      navigate('admin');
    };
    return () => {
      delete (window as any).openMZAdmin;
    };
  }, [navigate]);

  // Handle auto-scroll and highlighting for /apercu route
  useEffect(() => {
    if (route === 'preview') {
      setTimeout(() => {
        const previewElement = document.getElementById('preview-section');
        if (previewElement) {
          previewElement.scrollIntoView({ behavior: 'smooth' });
          if (!hasHighlighted) {
            setHighlightAcademy(true);
            setHasHighlighted(true);
            setTimeout(() => {
              setHighlightAcademy(false);
            }, 6000);
          }
        }
      }, 150);
    }
  }, [route, hasHighlighted]);

  const handleShowModal = () => {
    setIsModalOpen(true);
  };

  const handleShowPreview = () => {
    navigate('preview');
  };

  const handleOpenWaitlist = (source: string) => {
    setWaitlistSource(source);
    if (isLaunchModeActive()) {
      navigate('inscription');
    } else {
      navigate('waitlist');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('preview');
  };

  const handleSelectAcademy = () => {
    navigate('academy');
  };

  const handleSelectBusiness = () => {
    navigate('business');
  };

  const handleSelectCommunity = () => {
    navigate('community');
  };

  const handleBackToHome = () => {
    navigate('home');
  };

  const isLaunched = isLaunchModeActive();

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Decorative cyber grid or glowing lines */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.02),transparent_60%)] pointer-events-none" />
      
      {/* Main page content layout */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {route === 'admin' ? (
            <main key={`admin-${refreshKey}`}>
              <AdminPanel onClose={handleBackToHome} onRefreshData={handleRefreshAll} />
            </main>
          ) : route === 'inscription' ? (
            <main key={`inscription-${refreshKey}`}>
              <LaunchRegistration 
                onExploreAcademy={handleSelectAcademy}
                onExploreBusiness={handleSelectBusiness}
                onExploreCommunity={handleSelectCommunity}
                onBackToHome={handleBackToHome}
              />
            </main>
          ) : route === 'academy' ? (
            <main key={`academy-${refreshKey}`}>
              <AcademyView onBack={handleBackToHome} onJoinWaitlist={() => handleOpenWaitlist('academy')} />
            </main>
          ) : route === 'business' ? (
            <main key={`business-${refreshKey}`}>
              <BusinessView onBack={handleBackToHome} onJoinWaitlist={() => handleOpenWaitlist('business')} />
            </main>
          ) : route === 'community' ? (
            <main key={`community-${refreshKey}`}>
              <CommunityView onBack={handleBackToHome} onJoinWaitlist={() => handleOpenWaitlist('community')} />
            </main>
          ) : route === 'waitlist' ? (
            <main key={`waitlist-${refreshKey}`}>
              <WaitlistPage onBack={handleBackToHome} source={waitlistSource} />
            </main>
          ) : (
            /* HOME AND PREVIEW VIEW LAYOUT (Supports / and /accueil and /apercu) */
            <main key={`home-${refreshKey}`}>
              {/* 1. Compte à Rebours Section (Sticky top warning bar on home view to remind members of the 150 places limit - only show if pre-launch) */}
              {!isLaunched && (
                <Countdown onJoinWaitlistClick={() => handleOpenWaitlist('countdown')} />
              )}
              {isLaunched && (
                <div className="w-full bg-slate-950 border-b border-cyan-500/20 py-2.5 px-4 text-center text-xs font-mono text-cyan-400 font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 relative z-50">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>🚀 Les inscriptions à MZ+ sont officiellement ouvertes !</span>
                  <button 
                    onClick={() => navigate('inscription')}
                    className="ml-3 px-3 py-1 bg-cyan-500 text-slate-950 rounded-lg text-[10px] font-sans font-black hover:bg-cyan-400 transition-colors cursor-pointer"
                  >
                    DÉPOSER MA CANDIDATURE
                  </button>
                </div>
              )}

              {/* 2. Hero Section */}
              <Hero 
                onShowPreviewClick={handleShowPreview} 
                onJoinWaitlistClick={() => handleOpenWaitlist('hero')} 
                isLaunched={isLaunched}
              />

              {/* Decorative Divider */}
              <div className="w-full flex justify-center py-6">
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
              </div>

              {/* 3. Aperçu de la plateforme Section */}
              <PlatformPreview 
                onSelectAcademy={handleSelectAcademy} 
                onSelectBusiness={handleSelectBusiness} 
                onSelectCommunity={handleSelectCommunity}
                highlightAcademy={highlightAcademy}
              />
            </main>
          )}
        </AnimatePresence>
      </main>

      {/* Intro pop-up with fluid entry animations (Only relevant pre-launch) */}
      <AnimatePresence>
        {!isLaunched && isModalOpen && (
          <IntroModal isOpen={isModalOpen} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </div>
  );
}
