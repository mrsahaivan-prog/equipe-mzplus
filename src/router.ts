/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

export type AppRoute = 'home' | 'preview' | 'academy' | 'business' | 'community' | 'waitlist' | 'inscription' | 'admin';

const PATH_MAP: Record<string, AppRoute> = {
  '/': 'home',
  '/accueil': 'home',
  '/apercu': 'preview',
  '/academie': 'academy',
  '/business': 'business',
  '/communaute': 'community',
  '/liste-attente': 'waitlist',
  '/inscription': 'inscription',
  '/admin': 'admin',
};

const ROUTE_MAP: Record<AppRoute, string> = {
  home: '/accueil',
  preview: '/apercu',
  academy: '/academie',
  business: '/business',
  community: '/communaute',
  waitlist: '/liste-attente',
  inscription: '/inscription',
  admin: '/admin',
};

const TITLE_MAP: Record<AppRoute, string> = {
  home: "MZ+ | L'Opportunité de cette Génération",
  preview: "Aperçu de la Plateforme | MZ+",
  academy: "Académie MZ+ | Formation & Modules Élite",
  business: "Business MZ+ | Stratégies & Écosystème",
  community: "Communauté MZ+ | Salons Privés & Réseautage",
  waitlist: "Rejoindre la Liste d'Attente | MZ+",
  inscription: "Inscription Officielle | MZ+ Académie",
  admin: "Console Administrateur | MZ+",
};

const DESC_MAP: Record<AppRoute, string> = {
  home: "Découvrez l'écosystème MZ+. Accompagnement, académie de haut niveau, et stratégies d'affaires exclusives pour propulser votre réussite.",
  preview: "Découvrez en exclusivité un aperçu des modules d'affaires, de l'académie de formation et de nos salons de discussion privés.",
  academy: "Explorez notre académie de formation premium : des modules intensifs et pratiques pour maîtriser l'économie moderne.",
  business: "Découvrez les piliers de notre écosystème d'affaires conçu pour générer de la croissance durable et du réseautage élite.",
  community: "Rejoignez une communauté francophone soudée : salons d'échange privés Telegram & Discord et sessions de coaching hebdomadaires.",
  waitlist: "Rejoignez la liste d'attente prioritaire de l'écosystème MZ+ avant la fermeture définitive des accès.",
  inscription: "Inscrivez-vous officiellement à l'écosystème MZ+ et déposez votre demande d'admission prioritaire.",
  admin: "Console de pilotage administrateur sécurisée pour l'écosystème MZ+.",
};

export function getRouteFromPath(path: string): AppRoute {
  let normalized = path;
  if (normalized !== '/' && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return PATH_MAP[normalized] || 'home';
}

/**
 * Navigates to a specific route, updating history and document states.
 */
export function navigateTo(route: AppRoute) {
  const path = ROUTE_MAP[route];
  window.history.pushState(null, '', path);
  window.dispatchEvent(new Event('routechange'));
  
  // Smoothly scroll to top on page transition
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}

/**
 * Hook to listen to and synchronize the active route.
 */
export function useAppRoute() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    return getRouteFromPath(window.location.pathname);
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const activeRoute = getRouteFromPath(window.location.pathname);
      setCurrentRoute(activeRoute);
      
      // Update page title
      document.title = TITLE_MAP[activeRoute] || "MZ+";
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', DESC_MAP[activeRoute] || "");
    };

    // Initial setup
    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('routechange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('routechange', handleLocationChange);
    };
  }, []);

  return {
    route: currentRoute,
    navigate: navigateTo,
  };
}
