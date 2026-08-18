import React, { useState } from 'react';
import {
  Calendar,
  Ticket,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Download,
  Share2,
  X,
  Plus,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building,
  ShieldCheck,
  Award,
  CalendarPlus,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface UserScheduleEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserScheduleEventsModal: React.FC<UserScheduleEventsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentParticipant, navigateTo, myPlan } = useApp();
  const [filterTab, setFilterTab] = useState<'todos' | 'proximos' | 'concluidos'>('proximos');
  const [selectedVoucher, setSelectedVoucher] = useState<any | null>(null);

  if (!isOpen) return null;

  const firstName = currentParticipant.name.split(' ')[0];

  // Scheduled events / ticket orders
  const SCHEDULED_EVENTS = [
    {
      id: 'EVT-8921',
      title: 'Caravana Cultural & Fotográfica: Paraty Histórica',
      partner: 'Maturi / Viagens 50+',
      dimension: 'Lazer e Cultura',
      category: 'Turismo & Fotografia',
      date: '24/10/2026',
      time: '08:30 às 17:00',
      location: 'Ponto de Encontro: Sede PREVI / Transfer Exclusivo',
      address: 'Praça XV de Novembro, 20 - Centro, Rio de Janeiro - RJ',
      format: 'Presencial',
      voucherCode: 'PRV-PARATY-8921-2026',
      status: 'confirmado',
      seats: '1 participante (Carlos)',
      priceInfo: 'Subsídio Integral PREVI (Gratuito)',
      qrCodeData: 'https://previ.com.br/validar/voucher/PRV-PARATY-8921',
      instructions: 'Leve calçado confortável para caminhadas nas ruas de pedras e câmera ou celular carregado.',
      instructor: 'Prof. Marcos Vinicius (Fotógrafo e Historiador)',
    },
    {
      id: 'EVT-4412',
      title: 'Oficina Prática de Gastronomia Mediterrânea & Culinária Afetiva',
      partner: 'Sesc / Gastronomia Ativa',
      dimension: 'Saúde Física',
      category: 'Alimentação & Saúde',
      date: '12/11/2026',
      time: '15:00 às 18:00',
      location: 'Cozinha Gourmet do Espaço Viva Bem',
      address: 'Av. Paulista, 1190 - 4º Andar, São Paulo - SP',
      format: 'Presencial',
      voucherCode: 'PRV-CULIN-4412-2026',
      status: 'confirmado',
      seats: '1 participante (Carlos)',
      priceInfo: 'Subsídio Integral PREVI (Gratuito)',
      qrCodeData: 'https://previ.com.br/validar/voucher/PRV-CULIN-4412',
      instructions: 'Aventais e todos os insumos frescos serão fornecidos no local. Degustação inclusa ao final.',
      instructor: 'Chef Heloísa Bacellar',
    },
    {
      id: 'EVT-1029',
      title: 'Mentoria Individual: Transição de Carreira & Consultoria 50+',
      partner: 'Maturi & Rede PREVI',
      dimension: 'Trabalho e Propósito',
      category: 'Mentoria & Negócios',
      date: '19/11/2026',
      time: '10:00 às 11:30',
      location: 'Sala Virtual Exclusiva (Zoom PREVI)',
      address: 'Link enviado por e-mail e disponível 15 min antes',
      format: 'Online',
      voucherCode: 'PRV-MENTOR-1029-2026',
      status: 'confirmado',
      seats: 'Sessão 1:1',
      priceInfo: 'Subsídio Integral PREVI (Gratuito)',
      qrCodeData: 'https://previ.com.br/validar/voucher/PRV-MENTOR-1029',
      instructions: 'Tenha em mãos seu resumo de trajetória profissional e temas de interesse para mentoria.',
      instructor: 'Mônica Herculano (Especialista em Carreira 50+)',
    },
    {
      id: 'EVT-0815',
      title: 'Roda de Conversa CASSI: Sono Reparador e Saúde Emocional',
      partner: 'CASSI Saúde da Família',
      dimension: 'Saúde Emocional',
      category: 'Saúde & Prevenção',
      date: '15/08/2026',
      time: '14:00 às 16:00',
      location: 'Auditório CliniCASSI',
      address: 'Rua da Quitanda, 52 - Centro, Rio de Janeiro - RJ',
      format: 'Presencial',
      voucherCode: 'PRV-CASSI-0815-2026',
      status: 'concluido',
      rating: 5,
      seats: '1 participante',
      priceInfo: 'Programa Preventivo CASSI',
      qrCodeData: 'https://previ.com.br/validar/voucher/PRV-CASSI-0815',
      instructions: 'Evento concluído com sucesso. Certificado emitido.',
      instructor: 'Dra. Beatriz Mendes (Neurologista e Médica do Sono)',
    },
    {
      id: 'EVT-0702',
      title: 'Workshop de Gestão Patrimonial e Sucessão Familiar DIFIN',
      partner: 'DIFIN PREVI',
      dimension: 'Recursos Financeiros',
      category: 'Finanças & Sucessão',
      date: '02/07/2026',
      time: '10:00 às 12:30',
      location: 'Auditório Principal PREVI & Transmissão',
      address: 'Praia de Botafogo, 501 - Rio de Janeiro - RJ',
      format: 'Híbrido',
      voucherCode: 'PRV-DIFIN-0702-2026',
      status: 'concluido',
      rating: 5,
      seats: '1 participante',
      priceInfo: 'Programa Educativo DIFIN',
      qrCodeData: 'https://previ.com.br/validar/voucher/PRV-DIFIN-0702',
      instructions: 'Evento concluído com sucesso. Material de apoio enviado.',
      instructor: 'Equipe de Planejamento Patrimonial DIFIN',
    },
  ];

  const filteredEvents = SCHEDULED_EVENTS.filter((evt) => {
    if (filterTab === 'proximos') return evt.status === 'confirmado';
    if (filterTab === 'concluidos') return evt.status === 'concluido';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1A2E]/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAFBFD] w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-[#D9E4EE] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-[#163A63] text-white p-6 sm:p-7 flex items-center justify-between border-b border-[#1E466F]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#12B8AE] text-[#163A63] flex items-center justify-center font-black shadow-xs shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-black text-[#B4EBE6] px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
                  MEU PLANO & AGENDAMENTOS
                </span>
                <span className="text-xs text-white/80">
                  {currentParticipant.retirementStatus} ({currentParticipant.planType})
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Meus Ingressos & Histórico de Agendamentos
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Scroll */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Summary / Plan Quota Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-[#D9E4EE] shadow-2xs">
            <div className="space-y-0.5 border-b sm:border-b-0 sm:border-r border-[#EEF3F7] pb-3 sm:pb-0 sm:pr-4">
              <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
                Matrícula PREVI
              </span>
              <span className="text-lg font-black text-[#163A63]">8.240.119-2</span>
              <span className="text-[11px] text-[#12B8AE] font-bold block">
                {currentParticipant.planType} • Concedido
              </span>
            </div>

            <div className="space-y-0.5 border-b sm:border-b-0 sm:border-r border-[#EEF3F7] pb-3 sm:pb-0 sm:pr-4">
              <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
                Ingressos & Agendamentos Ativos
              </span>
              <span className="text-lg font-black text-[#164E7A]">3 Confirmados</span>
              <span className="text-[11px] text-[#5A6F82] block">Próximo em 24/Out (Paraty)</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] text-[#5A6F82] uppercase font-bold block">
                Cota de Experiências 2026
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-[#27AE60]">3 de 6</span>
                <span className="text-xs text-[#5A6F82]">utilizadas</span>
              </div>
              <span className="text-[11px] text-[#5A6F82] block">3 créditos disponíveis</span>
            </div>
          </div>

          {/* Filter Sub-Tabs */}
          <div className="flex items-center justify-between border-b border-[#D9E4EE] pb-3">
            <div className="flex items-center gap-2">
              {[
                { id: 'proximos', label: 'Próximos / Confirmados (3)' },
                { id: 'concluidos', label: 'Histórico Concluído (2)' },
                { id: 'todos', label: 'Todos os Registros (5)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterTab === tab.id
                      ? 'bg-[#163A63] text-white shadow-2xs'
                      : 'bg-white text-[#5A6F82] hover:bg-[#EEF3F7] border border-[#D9E4EE]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                onClose();
                navigateTo('meu_viver_mais', 'pda');
              }}
              className="text-xs font-bold text-[#0A7D76] hover:text-[#163A63] flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Explorar Mais no PDA</span>
            </button>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {filteredEvents.map((evt) => {
              const isConfirmed = evt.status === 'confirmado';
              return (
                <div
                  key={evt.id}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-[#D9E4EE] hover:border-[#12B8AE] shadow-2xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  {/* Left Info */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#E6F7F6] text-[#0A7D76] border border-[#B4EBE6]">
                        {evt.partner}
                      </span>
                      <span className="text-[10px] font-bold text-[#5A6F82] bg-[#FAFBFD] px-2 py-0.5 rounded-md border border-[#EEF3F7]">
                        {evt.dimension}
                      </span>
                      {isConfirmed ? (
                        <span className="text-[10px] font-black text-[#27AE60] bg-green-50 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>CONFIRMADO</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#5A6F82] bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                          CONCLUÍDO (5★)
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-[#163A63]">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-[#5A6F82] mt-0.5">
                        Instrutor/Facilitador: <strong>{evt.instructor}</strong>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#163A63] pt-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#12B8AE] shrink-0" />
                        <span className="font-bold">{evt.date}</span>
                        <span className="text-[#5A6F82]">({evt.time})</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions & Ticket / Voucher Button */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-between gap-2.5 border-t md:border-t-0 md:border-l border-[#EEF3F7] pt-4 md:pt-0 md:pl-5 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-[#5A6F82] block">Voucher do Ingresso</span>
                      <span className="font-mono text-xs font-black text-[#164E7A]">
                        {evt.voucherCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => setSelectedVoucher(evt)}
                        className="flex-1 md:flex-initial px-4 py-2 bg-[#163A63] hover:bg-[#12B8AE] hover:text-[#163A63] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Ver Ingresso / Voucher</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#D9E4EE] flex items-center justify-between text-xs text-[#5A6F82]">
          <span>
            Precisa cancelar ou reagendar? Você pode alterar qualquer inscrição com até 48h de antecedência.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#EEF3F7] hover:bg-[#D9E4EE] text-[#163A63] font-bold text-xs transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* SUB-MODAL: VOUCHER / QR CODE DIGITAL */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#0A1A2E]/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#D9E4EE] overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#163A63] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#12B8AE]" />
                <span className="font-extrabold text-sm uppercase tracking-wider">
                  Ingresso Digital Vivendo Mais
                </span>
              </div>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-center">
              <div>
                <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-[#E6F7F6] text-[#0A7D76] border border-[#B4EBE6]">
                  {selectedVoucher.partner}
                </span>
                <h3 className="font-extrabold text-lg text-[#163A63] mt-2">
                  {selectedVoucher.title}
                </h3>
              </div>

              {/* Synthetic QR Code Box */}
              <div className="p-5 bg-[#FAFBFD] rounded-2xl border-2 border-dashed border-[#CAD8E6] flex flex-col items-center justify-center space-y-2">
                <div className="w-36 h-36 bg-white p-2 rounded-xl border border-[#D9E4EE] shadow-2xs flex items-center justify-center">
                  {/* Visual QR Code Pattern */}
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-1">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          (i % 2 === 0 && i % 3 !== 0) || i < 6 || i > 30 || i % 6 === 0 || i % 6 === 5
                            ? 'bg-[#163A63]'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="font-mono text-xs font-black text-[#163A63] tracking-wider">
                  {selectedVoucher.voucherCode}
                </span>
                <span className="text-[10px] text-[#27AE60] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Ingresso Válido • Titular: Carlos (Plano 1)
                </span>
              </div>

              {/* Event Details */}
              <div className="text-left bg-[#FAFBFD] p-4 rounded-xl border border-[#EEF3F7] space-y-1.5 text-xs text-[#163A63]">
                <div>
                  <strong>Data & Horário:</strong> {selectedVoucher.date} às {selectedVoucher.time}
                </div>
                <div>
                  <strong>Local / Endereço:</strong> {selectedVoucher.address}
                </div>
                <div>
                  <strong>Instruções:</strong> {selectedVoucher.instructions}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Ingresso salvo no celular / PDF gerado com sucesso!')}
                  className="flex-1 py-2.5 bg-[#163A63] hover:bg-[#1E466F] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Ingresso PDF</span>
                </button>
                <button
                  onClick={() => setSelectedVoucher(null)}
                  className="px-4 py-2.5 bg-[#EEF3F7] hover:bg-[#D9E4EE] text-[#163A63] text-xs font-bold rounded-xl"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
