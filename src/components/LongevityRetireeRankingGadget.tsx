import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SYNTHETIC_PARTICIPANTS } from '../mock/participants';
import { Participant } from '../types';
import { formatPercentage } from '../utils/formatters';
import {
  Trophy,
  Award,
  Sparkles,
  Heart,
  Share2,
  Download,
  ThumbsUp,
  PartyPopper,
  CheckCircle2,
  Star,
  Flame,
  Medal,
  Users,
  Compass,
  MessageCircle,
  RotateCcw,
} from 'lucide-react';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
}

export const LongevityRetireeRankingGadget: React.FC = () => {
  const { currentParticipant } = useApp();

  // Create a sorted list of top retirees with best scores
  // Ensure we include high scoring synthetic retirees and current participant
  const allCandidates: (Participant & { applauseCount: number; titleHonor: string })[] = [
    {
      ...currentParticipant,
      name: currentParticipant.name,
      applauseCount: 198,
      titleHonor: 'Mestre da Longevidade Autônoma',
    },
    ...SYNTHETIC_PARTICIPANTS.filter((p) => p.id !== currentParticipant.id).map((p, idx) => {
      const titles = [
        'Embaixador de Hábitos Saudáveis',
        'Mestre do Propósito & Mentoria',
        'Referência em Convivência & Família',
        'Inspiração em Lazer & Novas Descobertas',
        'Líder de Redes & Solidariedade',
        'Guardião da Vitalidade & Movimento',
        'Pioneiro da Desaposentação Ativa',
        'Mestre da Serenidade & Autocuidado',
      ];
      return {
        ...p,
        applauseCount: 120 + ((idx * 37) % 210),
        titleHonor: titles[idx % titles.length],
      };
    }),
  ];

  // Sort descending by IBPL score, then applause
  const rankedRetirees = allCandidates.sort((a, b) => {
    if (b.ibpl !== a.ibpl) return b.ibpl - a.ibpl;
    return b.applauseCount - a.applauseCount;
  }).slice(0, 10);

  // Selected retiree for the Celebration & Recognition Gadget
  const [selectedRetiree, setSelectedRetiree] = useState<Participant & { applauseCount: number; titleHonor: string }>(
    rankedRetirees[0] || allCandidates[0]
  );

  // Local applause counter state map
  const [applauseMap, setApplauseMap] = useState<Record<string, number>>({
    [selectedRetiree.id]: selectedRetiree.applauseCount,
  });

  // Confetti particles state
  const [confettiActive, setConfettiActive] = useState(false);
  const [confettiList, setConfettiList] = useState<ConfettiParticle[]>([]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [userComment, setUserComment] = useState('');
  const [commentsList, setCommentsList] = useState<Array<{ id: string; sender: string; text: string; time: string }>>([
    { id: '1', sender: 'Carlos Silveira', text: 'Parabéns pela dedicação diária e equilíbrio!', time: 'Hoje às 10:14' },
    { id: '2', sender: 'Marina Toledo', text: 'Grande inspiração para nossa transição!', time: 'Hoje às 09:30' },
    { id: '3', sender: 'Roberto Drummond', text: 'A longevidade se constrói com amigos e alegria!', time: 'Ontem às 18:05' },
  ]);

  const currentApplause = applauseMap[selectedRetiree.id] ?? selectedRetiree.applauseCount;

  // Trigger fun applause + confetti animation
  const handleApplaud = () => {
    setApplauseMap((prev) => ({
      ...prev,
      [selectedRetiree.id]: (prev[selectedRetiree.id] ?? selectedRetiree.applauseCount) + 1,
    }));

    // Generate 35 lively colorful confetti particles
    const colors = ['#12B8AE', '#163A63', '#F59E0B', '#EC4899', '#3B82F6', '#10B981', '#8B5CF6'];
    const particles: ConfettiParticle[] = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        id: Math.random(),
        x: Math.random() * 100, // percentage
        y: Math.random() * 40,
        size: 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        delay: Math.random() * 0.2,
      });
    }

    setConfettiList(particles);
    setConfettiActive(true);

    setTimeout(() => {
      setConfettiActive(false);
    }, 1800);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    setCommentsList([
      {
        id: Date.now().toString(),
        sender: currentParticipant.name,
        text: userComment.trim(),
        time: 'Agora mesmo',
      },
      ...commentsList,
    ]);
    setUserComment('');
    handleApplaud();
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#163A63] via-[#1E466F] to-[#164E7A] text-white p-7 sm:p-9 rounded-3xl shadow-sm space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12B8AE]/20 border border-[#12B8AE]/40 rounded-full text-[#B4EBE6] text-xs font-black uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-[#12B8AE]" />
          <span>RECONHECIMENTO & INSPIRAÇÃO DA COMUNIDADE PREVI</span>
        </div>

        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Hall dos Mestres da Longevidade PREVI
          </h2>
          <p className="text-xs sm:text-sm text-[#B4EBE6] leading-relaxed">
            Aqui celebramos os associados que transformaram o cuidado com o bem-estar em um estilo de vida ativo e inspirador. Conheça as maiores pontuações no <strong>IBPL Demonstrativo</strong>, envie seus aplausos e reconheça nossos colegas com o <strong>Gadget de Celebração</strong>!
          </p>
        </div>
      </div>

      {/* Podium dos Top 3 Mestres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* 2º Lugar - Prata */}
        {rankedRetirees[1] && (
          <div
            onClick={() => setSelectedRetiree(rankedRetirees[1])}
            className={`p-6 bg-white rounded-3xl border transition-all cursor-pointer flex flex-col items-center text-center space-y-3 relative ${
              selectedRetiree.id === rankedRetirees[1].id
                ? 'border-[#12B8AE] ring-4 ring-[#12B8AE]/20 shadow-md'
                : 'border-[#D9E4EE] hover:border-[#CAD8E6] shadow-xs'
            }`}
          >
            <div className="absolute -top-4 bg-slate-300 text-slate-800 font-black px-4 py-1 rounded-full text-xs shadow-xs border border-white flex items-center gap-1">
              <Medal className="w-3.5 h-3.5 text-slate-600" />
              <span>2º LUGAR</span>
            </div>

            <div className="relative mt-2">
              <img
                src={rankedRetirees[1].avatarUrl}
                alt={rankedRetirees[1].name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-4 border-slate-300 shadow-sm"
              />
              <span className="absolute bottom-0 right-0 bg-slate-700 text-white font-black text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                2
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-[#163A63]">{rankedRetirees[1].name}</h3>
              <p className="text-[11px] text-[#5A6F82]">
                {rankedRetirees[1].age} anos • {rankedRetirees[1].city}/{rankedRetirees[1].state}
              </p>
              <span className="inline-block text-[10px] font-bold text-[#164E7A] bg-[#EBF3FA] px-2.5 py-0.5 rounded-full mt-1">
                {rankedRetirees[1].titleHonor}
              </span>
            </div>

            <div className="w-full py-2 bg-[#F4F7FA] rounded-2xl border border-[#EEF3F7]">
              <span className="text-2xl font-black text-[#163A63]">{formatPercentage(rankedRetirees[1].ibpl)}</span>
            </div>

            <span className="text-[11px] text-[#12B8AE] font-bold">
              👏 {applauseMap[rankedRetirees[1].id] ?? rankedRetirees[1].applauseCount} aplausos recebidos
            </span>
          </div>
        )}

        {/* 1º Lugar - Ouro (Centro / Maior destaque) */}
        {rankedRetirees[0] && (
          <div
            onClick={() => setSelectedRetiree(rankedRetirees[0])}
            className={`p-7 bg-gradient-to-b from-[#FFFDF5] to-white rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center text-center space-y-4 relative md:-translate-y-2 ${
              selectedRetiree.id === rankedRetirees[0].id
                ? 'border-amber-400 ring-4 ring-amber-400/20 shadow-lg'
                : 'border-amber-300 shadow-md'
            }`}
          >
            <div className="absolute -top-5 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-black px-5 py-1.5 rounded-full text-xs shadow-md border-2 border-white flex items-center gap-1.5 tracking-wider">
              <Trophy className="w-4 h-4 text-white animate-bounce" />
              <span>1º LUGAR • CAMPEÃO DE LONGEVIDADE</span>
            </div>

            <div className="relative mt-2">
              <img
                src={rankedRetirees[0].avatarUrl}
                alt={rankedRetirees[0].name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow-md"
              />
              <span className="absolute bottom-0 right-0 bg-amber-500 text-white font-black text-xs w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                👑
              </span>
            </div>

            <div>
              <h3 className="font-black text-base text-[#163A63]">{rankedRetirees[0].name}</h3>
              <p className="text-xs text-[#5A6F82]">
                {rankedRetirees[0].age} anos • {rankedRetirees[0].city}/{rankedRetirees[0].state} ({rankedRetirees[0].planType})
              </p>
              <span className="inline-block text-[11px] font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full mt-1.5">
                🌟 {rankedRetirees[0].titleHonor}
              </span>
            </div>

            <div className="w-full py-3 bg-gradient-to-r from-amber-50 to-[#FFF9E6] rounded-2xl border border-amber-200">
              <span className="text-3xl font-black text-amber-900">{formatPercentage(rankedRetirees[0].ibpl)}</span>
              <p className="text-[10px] font-bold text-[#0A7D76] mt-0.5">8 Dimensões em Plenitude</p>
            </div>

            <span className="text-xs text-amber-700 font-extrabold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{applauseMap[rankedRetirees[0].id] ?? rankedRetirees[0].applauseCount} aplausos recebidos</span>
            </span>
          </div>
        )}

        {/* 3º Lugar - Bronze */}
        {rankedRetirees[2] && (
          <div
            onClick={() => setSelectedRetiree(rankedRetirees[2])}
            className={`p-6 bg-white rounded-3xl border transition-all cursor-pointer flex flex-col items-center text-center space-y-3 relative ${
              selectedRetiree.id === rankedRetirees[2].id
                ? 'border-[#12B8AE] ring-4 ring-[#12B8AE]/20 shadow-md'
                : 'border-[#D9E4EE] hover:border-[#CAD8E6] shadow-xs'
            }`}
          >
            <div className="absolute -top-4 bg-amber-700 text-white font-black px-4 py-1 rounded-full text-xs shadow-xs border border-white flex items-center gap-1">
              <Medal className="w-3.5 h-3.5 text-amber-200" />
              <span>3º LUGAR</span>
            </div>

            <div className="relative mt-2">
              <img
                src={rankedRetirees[2].avatarUrl}
                alt={rankedRetirees[2].name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-700/60 shadow-sm"
              />
              <span className="absolute bottom-0 right-0 bg-amber-800 text-white font-black text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                3
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-[#163A63]">{rankedRetirees[2].name}</h3>
              <p className="text-[11px] text-[#5A6F82]">
                {rankedRetirees[2].age} anos • {rankedRetirees[2].city}/{rankedRetirees[2].state}
              </p>
              <span className="inline-block text-[10px] font-bold text-[#164E7A] bg-[#EBF3FA] px-2.5 py-0.5 rounded-full mt-1">
                {rankedRetirees[2].titleHonor}
              </span>
            </div>

            <div className="w-full py-2 bg-[#F4F7FA] rounded-2xl border border-[#EEF3F7]">
              <span className="text-2xl font-black text-[#163A63]">{formatPercentage(rankedRetirees[2].ibpl)}</span>
            </div>

            <span className="text-[11px] text-[#12B8AE] font-bold">
              👏 {applauseMap[rankedRetirees[2].id] ?? rankedRetirees[2].applauseCount} aplausos recebidos
            </span>
          </div>
        )}
      </div>

      {/* GADGET DIVERTIDO DE CELEBRAÇÃO & RECONHECIMENTO PREVI */}
      <div className="bg-gradient-to-br from-[#163A63] via-[#1A4570] to-[#0D6B65] rounded-3xl p-6 sm:p-9 text-white shadow-md relative overflow-hidden space-y-6">
        {/* Confetti Particle Layer */}
        {confettiActive && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {confettiList.map((p) => (
              <div
                key={p.id}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size * 1.5}px`,
                  backgroundColor: p.color,
                  transform: `rotate(${p.rotation}deg)`,
                  transition: 'all 1.4s cubic-bezier(0.25, 1, 0.5, 1)',
                  animation: 'bounce 1s infinite',
                }}
                className="absolute rounded-xs opacity-90 shadow-xs"
              />
            ))}
          </div>
        )}

        {/* Gadget Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#12B8AE] text-[#163A63] flex items-center justify-center shadow-md shrink-0">
              <PartyPopper className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#B4EBE6]">
                GADGET INTERATIVO PREVI
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Aplausômetro & Troféu Vivendo Mais
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#B4EBE6]">Associado selecionado:</span>
            <span className="px-3 py-1 bg-white/15 rounded-full text-xs font-bold text-white border border-white/20">
              {selectedRetiree.name}
            </span>
          </div>
        </div>

        {/* Gadget Active Card Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Selected Retiree Badge & Details */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 text-center space-y-3">
            <div className="relative inline-block">
              <img
                src={selectedRetiree.avatarUrl}
                alt={selectedRetiree.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-[#12B8AE] shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#12B8AE] text-[#163A63] p-1.5 rounded-full shadow-xs">
                <Trophy className="w-4 h-4" />
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-base text-white">{selectedRetiree.name}</h4>
              <p className="text-xs text-[#B4EBE6]">
                {selectedRetiree.city}/{selectedRetiree.state} • {selectedRetiree.planType}
              </p>
              <span className="inline-block text-[11px] font-black text-[#12B8AE] bg-white/10 px-3 py-0.5 rounded-full mt-1 border border-[#12B8AE]/30">
                {selectedRetiree.titleHonor}
              </span>
            </div>

            <div className="p-3 bg-white/10 rounded-xl">
              <span className="text-xs text-[#B4EBE6] block">Pontuação IBPL no Radar:</span>
                <span className="text-3xl font-black text-white">{formatPercentage(selectedRetiree.ibpl)}</span>
            </div>
          </div>

          {/* Center Column: Big Interactive Applause & Confetti Button */}
          <div className="lg:col-span-4 text-center space-y-4">
            <div className="space-y-1">
              <span className="text-xs text-[#B4EBE6] font-bold uppercase tracking-wider block">
                Total de Aplausos Recebidos
              </span>
              <div className="text-5xl font-black text-[#12B8AE] tracking-tight flex items-center justify-center gap-2">
                <span>{currentApplause}</span>
                <span className="text-2xl animate-pulse">👏</span>
              </div>
              <p className="text-xs text-[#B4EBE6]">
                Envie energia positiva para celebrar este exemplo de longevidade!
              </p>
            </div>

            {/* Huge Fun Action Button */}
            <button
              onClick={handleApplaud}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#12B8AE] to-[#0A988F] hover:from-[#15cfc4] hover:to-[#0cb0a5] active:scale-95 text-[#163A63] font-black text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 border-2 border-white/40 cursor-pointer"
            >
              <PartyPopper className="w-6 h-6" />
              <span>APLAUDIR COM CONFETES! 🎉</span>
            </button>

            <button
              onClick={() => setShowCertificateModal(true)}
              className="w-full py-2.5 px-4 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-[#12B8AE]" />
              <span>Gerar Diploma Digital de Mestre</span>
            </button>
          </div>

          {/* Right Column: Quick Greetings & Compliments Box */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-3">
            <span className="text-xs font-black text-[#B4EBE6] uppercase tracking-wider flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-[#12B8AE]" />
              <span>Mural de Felicitações</span>
            </span>

            {/* Messages feed */}
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1 text-xs scrollbar-thin">
              {commentsList.map((c) => (
                <div key={c.id} className="p-2.5 bg-black/20 rounded-xl border border-white/10 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-[#B4EBE6]">
                    <span className="font-bold">{c.sender}</span>
                    <span>{c.time}</span>
                  </div>
                  <p className="text-white text-[11px] leading-snug">"{c.text}"</p>
                </div>
              ))}
            </div>

            {/* Quick send form */}
            <form onSubmit={handleAddComment} className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                placeholder="Escreva um elogio carinhoso..."
                className="flex-1 px-3 py-1.5 bg-white/20 border border-white/20 rounded-xl text-xs text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#12B8AE]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#12B8AE] text-[#163A63] font-bold text-xs rounded-xl hover:bg-white transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Ranking List: Posições 4 a 10 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E4EE] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EEF3F7] pb-4">
          <div>
            <h3 className="font-black text-lg text-[#163A63]">
              Tabela Completa • Top 10 Aposentados Vivendo Mais
            </h3>
            <p className="text-xs text-[#5A6F82]">
              Clique em qualquer associado para selecioná-lo no Gadget de Reconhecimento
            </p>
          </div>

          <span className="text-xs font-bold text-[#164E7A] bg-[#F4F7FA] px-3 py-1 rounded-full border border-[#D9E4EE]">
            Atualizado com base na Pesquisa IBPL PREVI
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F7FA] text-[#163A63] font-bold border-b border-[#D9E4EE]">
              <tr>
                <th className="p-3 text-center">Posição</th>
                <th className="p-3">Associado</th>
                <th className="p-3">Idade & Cidade</th>
                <th className="p-3">Plano</th>
                <th className="p-3">Destaque de Longevidade</th>
                <th className="p-3 text-center">IBPL</th>
                <th className="p-3 text-center">Aplausos</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3F7]">
              {rankedRetirees.map((ret, idx) => {
                const isSelected = selectedRetiree.id === ret.id;
                const isCurrent = ret.id === currentParticipant.id;

                return (
                  <tr
                    key={ret.id}
                    onClick={() => setSelectedRetiree(ret)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#E6F7F6]/60 font-semibold'
                        : isCurrent
                        ? 'bg-[#FFFDF5]'
                        : 'hover:bg-[#FAFBFD]'
                    }`}
                  >
                    <td className="p-3 text-center font-black text-sm">
                      {idx === 0 ? '🥇 1º' : idx === 1 ? '🥈 2º' : idx === 2 ? '🥉 3º' : `${idx + 1}º`}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={ret.avatarUrl}
                          alt={ret.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-[#D9E4EE]"
                        />
                        <div>
                          <span className="font-bold text-[#163A63] block">
                            {ret.name} {isCurrent && '(Você!)'}
                          </span>
                          <span className="text-[10px] text-[#5A6F82]">{ret.persona}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#5A6F82]">
                      {ret.age} anos • {ret.city}/{ret.state}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-[#F4F7FA] text-[#164E7A] rounded-md text-[10px] font-bold border border-[#D9E4EE]">
                        {ret.planType}
                      </span>
                    </td>
                    <td className="p-3 text-[#163A63] font-semibold">
                      {ret.titleHonor}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 bg-[#E6F7F6] text-[#0A7D76] rounded-full font-black text-xs border border-[#B4EBE6]">
                        {formatPercentage(ret.ibpl)}
                      </span>
                    </td>
                    <td className="p-3 text-center text-[#12B8AE] font-black">
                      👏 {applauseMap[ret.id] ?? ret.applauseCount}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRetiree(ret);
                          handleApplaud();
                        }}
                        className="px-3 py-1 bg-[#163A63] hover:bg-[#12B8AE] text-white hover:text-[#163A63] font-bold rounded-lg transition-colors text-[11px]"
                      >
                        Aplaudir 👏
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Diploma Digital de Mestre da Longevidade */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-9 max-w-xl w-full border-4 border-amber-300 shadow-2xl space-y-6 relative animate-in fade-in">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-[#5A6F82] hover:text-[#163A63] font-bold text-base p-1"
            >
              ✕
            </button>

            {/* Diploma Visual Certificate */}
            <div className="p-6 bg-gradient-to-b from-[#FFFDF5] to-[#FFF9E6] rounded-2xl border-2 border-dashed border-amber-400 text-center space-y-4 relative">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8 text-amber-500" />
                <span className="text-xs font-black uppercase tracking-widest text-amber-800">
                  PREVI • VIVENDO MAIS
                </span>
                <Trophy className="w-8 h-8 text-amber-500" />
              </div>

              <h2 className="text-2xl font-black text-[#163A63] tracking-tight">
                CERTIFICADO DE MESTRE DA LONGEVIDADE
              </h2>

              <p className="text-xs text-[#5A6F82] max-w-md mx-auto leading-relaxed">
                Conferido com orgulho e honra pela comunidade PREVI ao estimado associado:
              </p>

              <div className="py-2 border-y border-amber-300/80">
                <h3 className="text-xl sm:text-2xl font-extrabold text-amber-900">
                  {selectedRetiree.name}
                </h3>
                <span className="text-xs font-bold text-[#0A7D76]">
                  {selectedRetiree.titleHonor}
                </span>
              </div>

              <p className="text-xs text-[#2C3E50] leading-relaxed max-w-md mx-auto">
                Em reconhecimento ao seu brilhante resultado de <strong>{formatPercentage(selectedRetiree.ibpl)} no IBPL</strong> e por servir como farol de vitalidade, propósito e convivência para toda a nossa rede.
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-amber-200 text-[10px] text-[#5A6F82]">
                <div>
                  <span className="block font-bold text-[#163A63]">PREVIX & Diretoria PREVI</span>
                  <span>Programa Vivendo Mais</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xs border-2 border-white shadow-xs">
                  ★ SELO ★
                </div>
                <div>
                  <span className="block font-bold text-[#163A63]">Emissão Oficial</span>
                  <span>{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  alert('Certificado Digital pronto para compartilhamento!');
                  setShowCertificateModal(false);
                }}
                className="flex-1 py-3 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartilhar Certificado</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-5 py-3 bg-[#F4F7FA] text-[#5A6F82] font-bold rounded-xl text-xs hover:bg-[#EEF3F7]"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
