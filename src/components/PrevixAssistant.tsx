import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';
import { PREVIX_MENU_OPTIONS, CONTEXTUAL_PROMPTS } from '../mock/previxDialogs';
import {
  MessageSquare,
  X,
  Sparkles,
  ChevronRight,
  Bot,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Compass,
  CheckCircle2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'previx' | 'user';
  text: string;
  options?: { label: string; actionId: string }[];
  actionLink?: { label: string; view: string; tab?: string };
}

export const PrevixAssistant: React.FC = () => {
  const {
    isPrevixOpen,
    setIsPrevixOpen,
    previxContextKey,
    navigateTo,
    currentParticipant,
    recordEvent,
  } = useApp();

  const [hasShownBubble, setHasShownBubble] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize conversation when opened
  useEffect(() => {
    if (isPrevixOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'previx',
          text: `Olá, ${currentParticipant.name.split(' ')[0]}! Sou o PREVIX, seu assistente virtual no Viver Mais. 👋\n\nComo posso apoiar sua jornada hoje?`,
        },
      ]);
    }
  }, [isPrevixOpen, currentParticipant.name, messages.length]);

  // Contextual prompt check
  const contextualInfo = CONTEXTUAL_PROMPTS[previxContextKey];

  const handleSelectMenuOption = (menuId: string, label: string) => {
    recordEvent('PREVIX_INTERACTION', { menuId, label });

    // Add user message
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: label,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const menu = PREVIX_MENU_OPTIONS.find((m) => m.id === menuId);
      if (menu) {
        const botReply: ChatMessage = {
          id: `previx_${Date.now()}`,
          sender: 'previx',
          text: menu.responseMessages.join('\n\n'),
          actionLink: menu.suggestedAction
            ? {
                label: menu.suggestedAction.label,
                view: menu.suggestedAction.view || 'meu_viver_mais',
              }
            : undefined,
        };
        setMessages((prev) => [...prev, botReply]);
      }
    }, 450);
  };

  const handleContextualPromptClick = () => {
    if (!contextualInfo) return;
    recordEvent('PREVIX_INTERACTION', { type: 'contextual_prompt', key: previxContextKey });
    setIsPrevixOpen(true);

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: contextualInfo.prompt,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botReply: ChatMessage = {
        id: `previx_${Date.now()}`,
        sender: 'previx',
        text: contextualInfo.reply,
        actionLink: contextualInfo.linkView
          ? {
              label: 'Ver Possibilidades Relacionadas',
              view: contextualInfo.linkView,
            }
          : undefined,
      };
      setMessages((prev) => [...prev, botReply]);
    }, 400);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'previx',
        text: `Olá! Sou o PREVIX. Como posso ajudar você agora? Escolha um tema abaixo:`,
      },
    ]);
  };

  return (
    <>
      {/* Floating Widget (Bottom-Right) */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        {/* Floating Contextual Notification / Welcome Balloon */}
        {!isPrevixOpen && hasShownBubble && (
          <div className="mb-3 max-w-xs bg-white text-[#163A63] p-3.5 rounded-2xl shadow-xl border border-[#B4EBE6] text-xs relative animate-in fade-in slide-in-from-bottom-3">
            <button
              onClick={() => setHasShownBubble(false)}
              aria-label="Fechar dica do PREVIX"
              className="absolute -top-2 -right-2 w-5 h-5 bg-[#EEF3F7] rounded-full text-[#5A6F82] hover:text-[#163A63] flex items-center justify-center text-[10px] border border-[#D9E4EE] transition-colors"
            >
              ×
            </button>
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E6F7F6] border border-[#12B8AE]/40 flex items-center justify-center shrink-0 overflow-hidden p-0.5 shadow-2xs">
                <img
                  src="/icone_previx_maior.png"
                  alt="Assistente virtual PREVIX"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1.5 flex-1 pr-1">
                <p className="font-bold text-[#164E7A]">
                  {contextualInfo ? 'Dica do PREVIX:' : 'Me chamo PREVIX 👋'}
                </p>
                <p className="text-[11px] text-[#2C3E50] leading-snug">
                  {contextualInfo
                    ? contextualInfo.prompt
                    : 'Seu assistente de navegação, explicações e descobertas do Viver Mais.'}
                </p>
                <button
                  onClick={() => {
                    setIsPrevixOpen(true);
                    if (contextualInfo) handleContextualPromptClick();
                  }}
                  className="text-[11px] font-bold text-[#0A988F] hover:underline flex items-center gap-1 mt-1"
                >
                  <span>Conversar agora</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Trigger Button */}
        {!isPrevixOpen && (
          <button
            onClick={() => {
              setIsPrevixOpen(true);
              recordEvent('OPEN_PREVIX', { context: previxContextKey });
            }}
            aria-label="Abrir assistente PREVIX"
            title="Abrir assistente virtual PREVIX"
            className="w-14 h-14 sm:w-[70px] sm:h-[70px] rounded-full bg-gradient-to-b from-[#1E466F] to-[#163A63] hover:from-[#245484] hover:to-[#1B426D] text-white shadow-xl hover:shadow-2xl flex items-center justify-center border-2 border-[#12B8AE] transition-all duration-300 hover:scale-105 group relative p-1.5 focus:outline-none focus:ring-2 focus:ring-[#12B8AE] focus:ring-offset-2"
          >
            <div className="w-full h-full rounded-full bg-[#12B8AE]/10 flex items-center justify-center overflow-hidden p-1">
              <img
                src="/icone_previx_maior.png"
                alt="Assistente virtual PREVIX"
                className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <span
              className="absolute top-0 right-0 w-4 h-4 bg-[#12B8AE] rounded-full ring-2 ring-white shadow-sm flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </span>
          </button>
        )}

        {/* Expanded Drawer / Assistant Window */}
        {isPrevixOpen && (
          <div className="w-96 max-w-[calc(100vw-24px)] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-[#D9E4EE] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            {/* Header PREVI Dark Blue */}
            <div className="bg-[#163A63] text-white px-4 py-3 flex items-center justify-between border-b border-[#1E466F]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#1E466F]/60 border border-[#12B8AE]/60 flex items-center justify-center p-1 shadow-inner shrink-0 overflow-hidden">
                  <img
                    src="/icone_previx_maior.png"
                    alt="Assistente virtual PREVIX"
                    className="w-full h-full object-contain drop-shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-extrabold text-sm tracking-wide text-white leading-tight">PREVIX</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#12B8AE] inline-block animate-pulse" />
                    <p className="text-[11px] text-[#D9E4EE] font-medium leading-none">Assistente disponível</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Reiniciar conversa"
                  aria-label="Reiniciar conversa"
                  className="p-2 text-[#D9E4EE] hover:text-white hover:bg-[#1E466F] rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPrevixOpen(false)}
                  title="Fechar assistente PREVIX"
                  aria-label="Fechar assistente PREVIX"
                  className="p-2 text-[#D9E4EE] hover:text-white hover:bg-[#1E466F] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F4F7FA]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end items-start' : 'justify-start items-start'}`}
                >
                  {msg.sender === 'previx' && (
                    <div className="w-7 h-7 rounded-full bg-[#E6F7F6] border border-[#12B8AE]/30 flex items-center justify-center p-0.5 shrink-0 mt-0.5 overflow-hidden shadow-2xs">
                      <img
                        src="/icone_previx_maior.png"
                        alt="Assistente virtual PREVIX"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}
                  >
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-[#163A63] text-white rounded-br-none shadow-xs'
                          : 'bg-white text-[#163A63] border border-[#D9E4EE] shadow-xs rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Optional Action CTA from PREVIX */}
                    {msg.actionLink && (
                      <button
                        onClick={() => {
                          navigateTo(msg.actionLink!.view as any);
                          setIsPrevixOpen(false);
                        }}
                        className="mt-2 text-xs font-bold text-[#163A63] bg-[#E6F7F6] hover:bg-[#12B8AE] hover:text-white px-3 py-1.5 rounded-lg border border-[#B4EBE6] flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#12B8AE] group-hover:text-white" />
                        <span>{msg.actionLink.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <Avatar
                      src={currentParticipant.avatarUrl}
                      name={currentParticipant.name}
                      size="xs"
                      className="mt-0.5"
                    />
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#E6F7F6] border border-[#12B8AE]/30 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-2xs">
                    <img
                      src="/icone_previx_maior.png"
                      alt="Assistente virtual PREVIX"
                      className="w-full h-full object-contain animate-pulse"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#5A6F82] bg-white p-2.5 rounded-2xl w-20 border border-[#D9E4EE] shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#12B8AE] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[#12B8AE] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-[#12B8AE] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Menu Options (Tree Navigation) */}
            <div className="p-3 bg-white border-t border-[#D9E4EE]">
              <p className="text-[11px] font-bold text-[#5A6F82] mb-2 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#12B8AE]" />
                <span>O que você quer explorar?</span>
              </p>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {PREVIX_MENU_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectMenuOption(opt.id, opt.label)}
                    className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg bg-[#F4F7FA] hover:bg-[#E6F7F6] text-[#163A63] hover:text-[#0A7D76] font-semibold border border-[#D9E4EE] hover:border-[#B4EBE6] flex items-center justify-between transition-colors"
                  >
                    <span className="truncate">{opt.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#12B8AE] shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer Bar */}
            <div className="bg-[#EEF3F7] px-3 py-1.5 text-[10px] text-[#5A6F82] text-center border-t border-[#D9E4EE]">
              PREVIX é um guia de apoio — não realiza diagnósticos clínicos ou financeiros.
            </div>
          </div>
        )}
      </div>
    </>
  );
};
