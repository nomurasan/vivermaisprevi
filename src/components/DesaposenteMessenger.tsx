import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';
import { PeerConversation, PeerChatMessage } from '../types';
import { EXPERIENCES } from '../mock/experiences';
import {
  MessageSquare,
  Search,
  Send,
  HeartHandshake,
  Shield,
  Sparkles,
  Users,
  CheckCircle2,
  Check,
  CheckCheck,
  Smile,
  Mic,
  Calendar,
  Compass,
  ArrowLeft,
  Share2,
  Clock,
  ChevronRight,
  Info,
  RotateCcw,
} from 'lucide-react';

interface DesaposenteMessengerProps {
  onBackToDiscovery?: () => void;
}

export const DesaposenteMessenger: React.FC<DesaposenteMessengerProps> = ({
  onBackToDiscovery,
}) => {
  const {
    currentParticipant,
    peerConversations,
    activePeerConversationId,
    setActivePeerConversationId,
    sendPeerMessage,
    restartPeerConversation,
    acceptReconnectionRequest,
    setSelectedExperienceForDetail,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'connected' | 'pending'>('all');
  const [inputText, setInputText] = useState('');
  const [showExperiencePicker, setShowExperiencePicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const prevMsgCountRef = useRef<number>(0);

  // Active selected conversation
  const activeConversation =
    peerConversations.find((c) => c.id === activePeerConversationId) ||
    peerConversations[0] ||
    null;

  // When switching conversation or resetting, keep/scroll the chat container at top.
  // When a new message is sent/received in the current conversation, scroll to the bottom.
  useEffect(() => {
    if (!activeConversation) return;

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
    prevMsgCountRef.current = activeConversation.messages.length;
  }, [activePeerConversationId]);

  useEffect(() => {
    if (!activeConversation) return;

    const currentLength = activeConversation.messages.length;
    // If messages increased during the same active conversation, scroll down
    if (currentLength > prevMsgCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMsgCountRef.current = currentLength;
  }, [activeConversation?.messages]);

  // Filter conversations
  const filteredConversations = peerConversations.filter((c) => {
    const matchesSearch =
      c.peer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.sharedInterests.some((int) => int.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.trajectoryOverlap && c.trajectoryOverlap.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterTab === 'connected') return c.status === 'connected';
    if (filterTab === 'pending') return c.status === 'pending_sent' || c.status === 'pending_received';
    return true;
  });

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeConversation) return;
    sendPeerMessage(activeConversation.id, inputText.trim());
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleSendExperienceInvite = (expId: string) => {
    const exp = EXPERIENCES.find((e) => e.id === expId);
    if (!exp || !activeConversation) return;
    sendPeerMessage(
      activeConversation.id,
      `Convidei você para conhecermos a experiência: "${exp.title}" da ${exp.partnerName}. O que acha de participarmos juntos?`,
      { id: exp.id, title: exp.title }
    );
    setShowExperiencePicker(false);
  };

  const handleSendAudioSimulation = () => {
    if (!activeConversation) return;
    setIsRecordingAudio(true);
    setTimeout(() => {
      setIsRecordingAudio(false);
      sendPeerMessage(activeConversation.id, '🎙️ Mensagem de áudio (0:18)');
    }, 1500);
  };

  const quickEmojis = ['👋', '🎸', '☕', '😊', '👏', '💡', '✨', '📸', '🌿'];

  // Smart icebreakers based on current peer
  const icebreakers = activeConversation
    ? [
        `Olá ${activeConversation.peer.name.split(' ')[0]}! Que alegria nos reencontrarmos por aqui na PREVI.`,
        activeConversation.sharedInterests[0]
          ? `Vi que você tem interesse em ${activeConversation.sharedInterests[0]}. Como tem sido sua prática?`
          : 'Como você está aproveitando sua rotina hoje?',
        'O que acha de combinarmos uma conversa ou atividade juntos em breve?',
      ]
    : [];

  return (
    <div className="bg-white rounded-3xl border border-[#D9E4EE] shadow-sm overflow-hidden flex flex-col md:flex-row h-[740px] animate-in fade-in">
      {/* ============================================================
          1. COLUNA ESQUERDA: LISTA DE CONVERSAS E SOLICITAÇÕES
         ============================================================ */}
      <div className="w-full md:w-80 lg:w-96 border-r border-[#D9E4EE] flex flex-col bg-[#F9FBFC]">
        {/* Header da Barra Lateral */}
        <div className="p-4 border-b border-[#D9E4EE] space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E6F7F6] text-[#0A988F] flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="font-extrabold text-[#163A63] text-base">
                Mensagens & Conexões
              </h2>
            </div>
            {onBackToDiscovery && (
              <button
                onClick={onBackToDiscovery}
                className="text-xs font-bold text-[#164E7A] hover:underline flex items-center gap-1"
                title="Voltar para a busca de afinidades"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explorar</span>
              </button>
            )}
          </div>

          {/* Campo de Busca */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8FA3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por colega, hobby ou local..."
              className="w-full pl-9 pr-3 py-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-xl text-xs text-[#163A63] focus:outline-hidden focus:border-[#12B8AE]"
            />
          </div>

          {/* Abas de Filtro */}
          <div className="flex items-center gap-1 p-1 bg-[#EEF3F7] rounded-xl">
            <button
              onClick={() => setFilterTab('all')}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                filterTab === 'all'
                  ? 'bg-white text-[#163A63] shadow-xs'
                  : 'text-[#5A6F82] hover:text-[#163A63]'
              }`}
            >
              Todas ({peerConversations.length})
            </button>
            <button
              onClick={() => setFilterTab('connected')}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                filterTab === 'connected'
                  ? 'bg-white text-[#163A63] shadow-xs'
                  : 'text-[#5A6F82] hover:text-[#163A63]'
              }`}
            >
              Conectados ({peerConversations.filter((c) => c.status === 'connected').length})
            </button>
            <button
              onClick={() => setFilterTab('pending')}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                filterTab === 'pending'
                  ? 'bg-white text-[#163A63] shadow-xs'
                  : 'text-[#5A6F82] hover:text-[#163A63]'
              }`}
            >
              Pendentes ({peerConversations.filter((c) => c.status !== 'connected').length})
            </button>
          </div>
        </div>

        {/* Lista Rolável de Contatos / Conversas */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#EEF3F7]">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF3F7] text-[#8FA3B8] flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-[#163A63]">Nenhuma conversa encontrada</p>
              <p className="text-[11px] text-[#5A6F82]">
                Explore a rede de afinidades para solicitar reconexão segura com colegas e novos amigos.
              </p>
              {onBackToDiscovery && (
                <button
                  onClick={onBackToDiscovery}
                  className="px-4 py-2 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] font-bold text-xs rounded-xl transition-all"
                >
                  Descobrir Conexões
                </button>
              )}
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = activeConversation?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActivePeerConversationId(conv.id);
                    if (messagesContainerRef.current) {
                      messagesContainerRef.current.scrollTop = 0;
                    }
                  }}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                    isSelected
                      ? 'bg-white border-l-4 border-[#12B8AE] shadow-xs'
                      : 'hover:bg-white/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar
                      src={conv.peer.avatarUrl}
                      name={conv.peer.name}
                      size="md"
                    />
                    {conv.isOnline && (
                      <span
                        className="w-3 h-3 bg-[#10B981] border-2 border-white rounded-full absolute -bottom-0.5 -right-0.5"
                        title="Online agora"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-bold truncate ${
                          isSelected ? 'text-[#163A63]' : 'text-[#2C3E50]'
                        }`}
                      >
                        {conv.peer.name}
                      </h4>
                      <span className="text-[10px] text-[#8FA3B8] whitespace-nowrap ml-1">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#0A988F] font-semibold truncate mt-0.5">
                      {conv.trajectoryOverlap || conv.sharedInterests.join(', ')}
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[11px] text-[#5A6F82] truncate max-w-[170px]">
                        {conv.lastMessage || 'Nenhuma mensagem recente'}
                      </p>

                      {conv.status === 'pending_received' ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#FEF3C7] text-[#92400E] rounded-md border border-[#FDE68A]">
                          Pendente
                        </span>
                      ) : conv.status === 'pending_sent' ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#E6F7F6] text-[#0A988F] rounded-md">
                          Enviado
                        </span>
                      ) : conv.unreadCount > 0 ? (
                        <span className="w-4 h-4 bg-[#12B8AE] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Rodapé informativo de Privacidade */}
        <div className="p-3 bg-white border-t border-[#D9E4EE] text-[10px] text-[#5A6F82] flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[#12B8AE] shrink-0" />
          <span>Conversas protegidas com consentimento duplo PREVI.</span>
        </div>
      </div>

      {/* ============================================================
          2. COLUNA DIREITA: JANELA ATIVA DE MENSAGENS (MESSENGER)
         ============================================================ */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-[#FFFFFF]">
          {/* Header do Chat Ativo */}
          <div className="px-6 py-3.5 border-b border-[#D9E4EE] flex items-center justify-between bg-white shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar
                  src={activeConversation.peer.avatarUrl}
                  name={activeConversation.peer.name}
                  size="lg"
                />
                {activeConversation.isOnline && (
                  <span className="w-3 h-3 bg-[#10B981] border-2 border-white rounded-full absolute -bottom-0.5 -right-0.5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[#163A63] text-sm sm:text-base leading-tight">
                    {activeConversation.peer.name}
                  </h3>
                  <span className="text-[10px] bg-[#E6F7F6] text-[#0A988F] px-2 py-0.5 rounded-full font-bold border border-[#B4EBE6]">
                    {activeConversation.peer.retirementStatus}
                  </span>
                </div>
                <p className="text-[11px] text-[#5A6F82] flex items-center gap-1.5 mt-0.5">
                  <span>{activeConversation.peer.city}/{activeConversation.peer.state}</span>
                  <span>•</span>
                  <span className="text-[#0A7D76] font-medium">
                    {activeConversation.trajectoryOverlap || 'Colega PREVI'}
                  </span>
                </p>
              </div>
            </div>

            {/* Ações Rápidas no Header */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (activeConversation) {
                    restartPeerConversation(activeConversation.id);
                    if (messagesContainerRef.current) {
                      messagesContainerRef.current.scrollTop = 0;
                    }
                  }
                }}
                className="px-3 py-1.5 bg-[#F4F7FA] hover:bg-[#EEF3F7] text-[#163A63] rounded-xl text-xs font-bold border border-[#D9E4EE] transition-all flex items-center gap-1.5"
                title="Reiniciar conversa do topo com esta pessoa"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#0A7D76]" />
                <span className="hidden sm:inline">Reiniciar Conversa</span>
              </button>

              <button
                onClick={() => setShowExperiencePicker((prev) => !prev)}
                className="px-3 py-1.5 bg-[#E6F7F6] hover:bg-[#D0F2EF] text-[#0A7D76] rounded-xl text-xs font-bold border border-[#B4EBE6] transition-all flex items-center gap-1.5"
                title="Convidar colega para uma experiência do catálogo PREVI"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#12B8AE]" />
                <span className="hidden sm:inline">Convidar para Experiência</span>
              </button>
            </div>
          </div>

          {/* Banner de Segurança & LGPD */}
          <div className="bg-[#F4F7FA] border-b border-[#D9E4EE] px-4 py-2 flex items-center justify-between text-[11px] text-[#5A6F82]">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#12B8AE] shrink-0" />
              <span>
                <strong>Canal Seguro PREVI:</strong> Contato com consentimento mútuo. Seus dados cadastrais e financeiros permanecem estritamente confidenciais.
              </span>
            </div>
          </div>

          {/* Notificação caso seja solicitação recebida pendente */}
          {activeConversation.status === 'pending_received' && (
            <div className="m-4 p-4 bg-[#FEF3C7] rounded-2xl border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#92400E]">
                  Solicitação de Reconexão Recebida
                </h4>
                <p className="text-[11px] text-[#92400E]/80">
                  {activeConversation.peer.name} quer se reconectar com você para conversar e praticar interesses mútuos.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => acceptReconnectionRequest(activeConversation.id, activeConversation.peer.id)}
                  className="px-4 py-2 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Aceitar Reconexão</span>
                </button>
              </div>
            </div>
          )}

          {/* Modal / Popover Seletor de Experiências para Convidar */}
          {showExperiencePicker && (
            <div className="m-4 p-4 bg-[#F8FAFC] rounded-2xl border border-[#12B8AE] shadow-md space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#12B8AE]" />
                  <h4 className="text-xs font-extrabold text-[#163A63]">
                    Escolha uma experiência para convidar {activeConversation.peer.name.split(' ')[0]}:
                  </h4>
                </div>
                <button
                  onClick={() => setShowExperiencePicker(false)}
                  className="text-xs text-[#5A6F82] hover:text-[#163A63] font-bold"
                >
                  Fechar ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {EXPERIENCES.slice(0, 4).map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3 bg-white rounded-xl border border-[#D9E4EE] hover:border-[#12B8AE] transition-all flex items-center justify-between gap-2 text-left"
                  >
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold uppercase text-[#12B8AE]">
                        {exp.partnerName}
                      </span>
                      <h5 className="text-xs font-bold text-[#163A63] truncate">
                        {exp.title}
                      </h5>
                      <span className="text-[10px] text-[#5A6F82]">
                        {exp.modality} • {exp.priceType}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSendExperienceInvite(exp.id)}
                      className="px-2.5 py-1.5 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] text-[10px] font-extrabold rounded-lg shrink-0 transition-all"
                    >
                      Convidar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feed de Mensagens Rolável */}
          <div
            ref={messagesContainerRef}
            className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F8FAFC]/50"
          >
            {/* Divisor de Início de Conversa Segura */}
            <div className="text-center space-y-2 py-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#D9E4EE] rounded-full text-[10px] font-bold text-[#164E7A] shadow-2xs">
                <HeartHandshake className="w-3.5 h-3.5 text-[#12B8AE]" />
                <span>Início da reconexão por afinidade mútua</span>
              </div>

              {activeConversation.sharedInterests.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1">
                  <span className="text-[10px] text-[#5A6F82]">Interesses em comum:</span>
                  {activeConversation.sharedInterests.map((interest) => (
                    <span
                      key={interest}
                      className="text-[10px] font-bold px-2 py-0.5 bg-[#E6F7F6] text-[#0A988F] rounded-md border border-[#B4EBE6]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Mensagens */}
            {activeConversation.messages.map((msg) => {
              const isMe = msg.senderId === 'user' || msg.senderId === currentParticipant.id;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start items-end'}`}
                >
                  {!isMe && (
                    <Avatar
                      src={activeConversation.peer.avatarUrl}
                      name={activeConversation.peer.name}
                      size="sm"
                      className="mb-1"
                    />
                  )}

                  <div className={`max-w-[80%] sm:max-w-[70%] space-y-1.5`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-[#163A63] text-white rounded-br-xs'
                          : 'bg-white text-[#163A63] border border-[#D9E4EE] rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Card de Experiência anexada se houver */}
                      {msg.attachedExperienceTitle && (
                        <div
                          onClick={() => {
                            const exp = EXPERIENCES.find((e) => e.id === msg.attachedExperienceId);
                            if (exp) setSelectedExperienceForDetail(exp);
                          }}
                          className={`mt-2.5 p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                            isMe
                              ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                              : 'bg-[#F4F7FA] border-[#D9E4EE] hover:border-[#12B8AE] text-[#163A63]'
                          }`}
                        >
                          <div className="min-w-0">
                            <span className="text-[9px] font-bold uppercase tracking-wider block opacity-80">
                              Experiência Recomendada
                            </span>
                            <h5 className="font-extrabold text-xs truncate">
                              {msg.attachedExperienceTitle}
                            </h5>
                          </div>
                          <span className="text-[10px] underline shrink-0 font-bold">
                            Ver detalhes →
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex items-center gap-1 text-[10px] text-[#8FA3B8] px-1 ${
                        isMe ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMe && (
                        <CheckCheck className="w-3.5 h-3.5 text-[#12B8AE]" />
                      )}
                    </div>
                  </div>

                  {isMe && (
                    <Avatar
                      src={currentParticipant.avatarUrl}
                      name={currentParticipant.name}
                      size="sm"
                      className="mb-1"
                    />
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quebra-Gelo Inteligente (Sugestões de Mensagem) */}
          {activeConversation.messages.length <= 3 && (
            <div className="px-4 py-2 bg-white border-t border-[#EEF3F7] flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-bold text-[#164E7A] whitespace-nowrap flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#12B8AE]" />
                Sugestões:
              </span>
              {icebreakers.map((tip, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(tip)}
                  className="text-[11px] px-3 py-1 bg-[#F4F7FA] hover:bg-[#E6F7F6] text-[#163A63] hover:text-[#0A7D76] rounded-full border border-[#D9E4EE] whitespace-nowrap transition-colors"
                >
                  "{tip.length > 40 ? tip.substring(0, 40) + '...' : tip}"
                </button>
              ))}
            </div>
          )}

          {/* Seletor Rápido de Emojis */}
          {showEmojiPicker && (
            <div className="px-4 py-2 bg-[#F4F7FA] border-t border-[#D9E4EE] flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#5A6F82]">Reações:</span>
              <div className="flex items-center gap-1.5">
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setInputText((prev) => prev + ' ' + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="p-1 text-base hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Compositor de Mensagem (Input + Ações) */}
          <div className="p-4 bg-white border-t border-[#D9E4EE]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="p-2.5 text-[#5A6F82] hover:text-[#163A63] hover:bg-[#F4F7FA] rounded-xl transition-colors"
                title="Inserir emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleSendAudioSimulation}
                disabled={isRecordingAudio}
                className={`p-2.5 rounded-xl transition-all ${
                  isRecordingAudio
                    ? 'bg-[#EF4444] text-white animate-pulse'
                    : 'text-[#5A6F82] hover:text-[#163A63] hover:bg-[#F4F7FA]'
                }`}
                title="Gravar mensagem de voz"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Escreva uma mensagem segura para ${activeConversation.peer.name.split(' ')[0]}...`}
                className="flex-1 px-4 py-3 bg-[#F4F7FA] border border-[#D9E4EE] rounded-2xl text-xs sm:text-sm text-[#163A63] focus:outline-hidden focus:border-[#12B8AE] focus:bg-white transition-all"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`p-3 rounded-2xl font-bold transition-all flex items-center justify-center ${
                  inputText.trim()
                    ? 'bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white shadow-md transform hover:scale-105'
                    : 'bg-[#EEF3F7] text-[#8FA3B8] cursor-not-allowed'
                }`}
                title="Enviar mensagem"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-[#F8FAFC]">
          <div className="w-16 h-16 rounded-3xl bg-[#E6F7F6] text-[#0A988F] flex items-center justify-center">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-[#163A63]">
              Nenhuma conversa selecionada
            </h3>
            <p className="text-xs text-[#5A6F82] max-w-sm">
              Selecione um contato na lista à esquerda ou explore novos colegas com afinidades em comum.
            </p>
          </div>
          {onBackToDiscovery && (
            <button
              onClick={onBackToDiscovery}
              className="px-6 py-3 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              Explorar Pessoas Recomendadas
            </button>
          )}
        </div>
      )}
    </div>
  );
};
