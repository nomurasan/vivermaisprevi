import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROFILES } from '../mock/participants';
import {
  Sparkles,
  Users,
  ChevronDown,
  Compass,
  Layers,
  Shield,
  Activity,
  HeartHandshake,
  MessageSquareQuote,
  Menu,
  X,
  Type,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    navigateTo,
    activeProfileId,
    switchProfile,
    currentParticipant,
    fontSizeLarge,
    setFontSizeLarge,
    setIsFeedbackModalOpen,
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'INÍCIO' },
    { id: 'programa', label: 'O PROGRAMA' },
    { id: 'como_funciona', label: 'COMO FUNCIONA' },
    { id: 'meu_viver_mais', label: 'MEU VIVER MAIS' },
    { id: 'explorar', label: 'EXPLORAR' },
    { id: 'inteligencia', label: 'INTELIGÊNCIA DE LONGEVIDADE' },
    { id: 'privacidade', label: 'PRIVACIDADE' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      {/* Top Institutional Bar (White with PREVI branding) */}
      <div className="bg-white border-b border-[#D9E4EE] px-4 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo PREVI + Viver Mais */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigateTo('home')}>
            <div className="flex items-center gap-2">
              {/* PREVI SVG Emblem */}
              <div className="w-10 h-10 rounded-lg bg-[#163A63] flex items-center justify-center text-white font-black tracking-wider text-sm shadow-sm">
                PREVI
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-[#164E7A] font-bold block">
                  Caixa de Previdência
                </span>
                <span className="text-lg font-bold text-[#163A63] tracking-tight flex items-center gap-1.5">
                  Viver Mais <span className="text-[#12B8AE] font-black">•</span>
                  <span className="text-[11px] font-medium text-[#164E7A] px-2 py-0.5 bg-[#E6F7F6] rounded-full border border-[#B4EBE6]">
                    Protótipo V1
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Top Controls: Profile Switcher & Accessibility */}
          <div className="flex items-center gap-3">
            {/* Accessibility: Font size toggle */}
            <button
              onClick={() => setFontSizeLarge((prev) => !prev)}
              title="Alternar tamanho da fonte para melhor leitura (50+)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
                fontSizeLarge
                  ? 'bg-[#163A63] text-white border-[#163A63]'
                  : 'bg-white text-[#164E7A] border-[#D9E4EE] hover:bg-[#F4F7FA]'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Acessibilidade {fontSizeLarge ? 'A+' : 'A'}</span>
            </button>

            {/* Protótipo Feedback CTA */}
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#EEF3F7] hover:bg-[#D9E4EE] text-[#163A63] rounded text-xs font-bold transition-all border border-[#D9E4EE]"
            >
              <MessageSquareQuote className="w-3.5 h-3.5 text-[#12B8AE]" />
              <span>Avaliar Protótipo</span>
            </button>

            {/* Demonstrative Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F7FA] hover:bg-[#EEF3F7] rounded-lg border border-[#D9E4EE] text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#164E7A] text-white flex items-center justify-center font-bold text-xs">
                  {currentParticipant.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <span className="text-[10px] text-[#5A6F82] font-semibold block uppercase tracking-wider">
                    Perfil Demonstrativo
                  </span>
                  <span className="text-xs font-bold text-[#163A63] block truncate max-w-[120px]">
                    {currentParticipant.name.split(' ')[0]} ({currentParticipant.age}a)
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#5A6F82]" />
              </button>

              {/* Profile Selector Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#D9E4EE] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-[#D9E4EE]">
                    <p className="text-xs font-bold text-[#163A63]">Escolha um perfil demonstrativo:</p>
                    <p className="text-[11px] text-[#5A6F82]">
                      Atualiza scores, radar e recomendações
                    </p>
                  </div>
                  {Object.values(PROFILES).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        switchProfile(p.id);
                        setIsProfileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[#F4F7FA] transition-colors ${
                        activeProfileId === p.id ? 'bg-[#E6F7F6] border-l-4 border-[#12B8AE]' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#164E7A] text-white flex items-center justify-center font-bold text-xs">
                        {p.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#163A63] truncate">{p.name.split(' ')[0]}</p>
                          <span className="text-[10px] font-semibold text-[#12B8AE] bg-white px-1.5 py-0.5 rounded border border-[#B4EBE6]">
                            IBPL {p.ibpl}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5A6F82] truncate">
                          {p.age} anos • {p.city} • {p.retirementStatus}
                        </p>
                      </div>
                    </button>
                  ))}
                  <div className="px-4 pt-2 border-t border-[#D9E4EE] text-[10px] text-[#5A6F82]">
                    * Perfis sintéticos para demonstração de regras.
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#163A63] hover:bg-[#F4F7FA] rounded-md"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (PREVI Institutional Dark Blue #163A63) */}
      <div className="bg-[#163A63] text-white px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id as any)}
                  className={`px-4 py-3.5 text-xs font-bold tracking-wider transition-all relative ${
                    isActive
                      ? 'text-[#12B8AE] bg-[#1E466F]'
                      : 'text-white/90 hover:text-white hover:bg-[#1E466F]/60'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#12B8AE]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Turquesa CTA Button */}
          <div className="hidden lg:block py-2">
            <button
              onClick={() => navigateTo('meu_viver_mais')}
              className="px-5 py-2.5 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white font-extrabold text-xs tracking-wider uppercase rounded-md shadow-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>ENTRAR NO MEU VIVER MAIS</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[#1E466F] space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigateTo(item.id as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-bold tracking-wide rounded ${
                  currentView === item.id
                    ? 'bg-[#1E466F] text-[#12B8AE]'
                    : 'text-white/90 hover:bg-[#1E466F]/50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 px-2">
              <button
                onClick={() => {
                  navigateTo('meu_viver_mais');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-[#12B8AE] text-[#163A63] font-bold text-xs uppercase tracking-wider rounded text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                ENTRAR NO MEU VIVER MAIS
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
