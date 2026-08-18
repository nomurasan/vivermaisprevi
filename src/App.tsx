/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PrevixAssistant } from './components/PrevixAssistant';
import { ExperienceDetailModal } from './components/ExperienceDetailModal';
import { ExperienceFeedbackModal } from './components/ExperienceFeedbackModal';
import { PrototypeFeedbackModal } from './components/PrototypeFeedbackModal';
import { ToastNotification } from './components/ToastNotification';

import { HomeView } from './views/HomeView';
import { OnboardingView } from './views/OnboardingView';
import { MeuViverMaisView } from './views/MeuViverMaisView';
import { ExplorarView } from './views/ExplorarView';
import { MeuPlanoView } from './views/MeuPlanoView';
import { InteligenciaView } from './views/InteligenciaView';
import { ProgramView } from './views/ProgramView';
import { HowItWorksView } from './views/HowItWorksView';
import { PrivacyView } from './views/PrivacyView';
import { DesaposenteRedeView } from './views/DesaposenteRedeView';

import { MessageSquareQuote, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, fontSizeLarge, setIsFeedbackModalOpen } = useApp();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'onboarding':
        return <OnboardingView />;
      case 'meu_viver_mais':
        return <MeuViverMaisView />;
      case 'desaposente_rede':
        return <DesaposenteRedeView />;
      case 'explorar':
        return <ExplorarView />;
      case 'meu_plano':
        return <MeuPlanoView />;
      case 'inteligencia':
        return <InteligenciaView />;
      case 'programa':
        return <ProgramView />;
      case 'como_funciona':
        return <HowItWorksView />;
      case 'privacidade':
        return <PrivacyView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F4F7FA] text-[#163A63] font-sans antialiased selection:bg-[#12B8AE]/30 ${
        fontSizeLarge ? 'text-lg leading-relaxed' : 'text-sm'
      }`}
    >
      {/* Top Fixed Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full">{renderCurrentView()}</main>

      {/* Persistent Prototype Feedback Floating Pill (Bottom Left) */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={() => setIsFeedbackModalOpen(true)}
          className="px-4 py-2.5 bg-[#163A63] hover:bg-[#1E466F] text-[#12B8AE] hover:text-white rounded-full shadow-lg border border-[#12B8AE]/40 text-xs font-black tracking-wide flex items-center gap-2 transition-all hover:scale-105"
        >
          <MessageSquareQuote className="w-4 h-4 text-[#12B8AE]" />
          <span>CONTE O QUE ACHOU</span>
        </button>
      </div>

      {/* Floating PREVIX Assistant (Bottom Right) */}
      <PrevixAssistant />

      {/* Global Modals */}
      <ExperienceDetailModal />
      <ExperienceFeedbackModal />
      <PrototypeFeedbackModal />
      <ToastNotification />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
