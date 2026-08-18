import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bookmark,
  BookmarkCheck,
  Heart,
  MapPin,
  Laptop,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Shield,
  Building,
} from 'lucide-react';
import { DIMENSIONS } from '../mock/dimensions';

export const ExperienceDetailModal: React.FC = () => {
  const {
    selectedExperienceForDetail,
    setSelectedExperienceForDetail,
    savedExperienceIds,
    toggleSaveExperience,
    interestedExperienceIds,
    showInterestInExperience,
    setPrevixContextKey,
    setIsPrevixOpen,
  } = useApp();

  if (!selectedExperienceForDetail) return null;

  const exp = selectedExperienceForDetail;
  const isSaved = savedExperienceIds.includes(exp.id);
  const hasInterest = interestedExperienceIds.includes(exp.id);
  const dimension = DIMENSIONS.find((d) => d.id === exp.dimensionId);

  const handleAskPrevix = () => {
    const key = exp.partnerId === 'maturi' ? 'maturi' : exp.partnerId === 'easylive' ? 'easylive' : exp.dimensionId;
    setPrevixContextKey(key);
    setIsPrevixOpen(true);
    setSelectedExperienceForDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-[#D9E4EE] overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        {/* Modal Header Banner */}
        <div className="relative h-56 w-full bg-[#163A63] overflow-hidden shrink-0">
          {exp.imageUrl && (
            <img
              src={exp.imageUrl}
              alt={exp.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#163A63] via-[#163A63]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setSelectedExperienceForDetail(null)}
            className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Partner & Category in Banner */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#12B8AE] text-[#163A63] font-black text-xs rounded-full">
                {exp.partnerName}
              </span>
              <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                {exp.category}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight leading-tight">
              {exp.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key Attributes Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#F4F7FA] rounded-2xl border border-[#D9E4EE] text-xs">
            <div>
              <span className="text-[#5A6F82] font-semibold block text-[11px]">Modalidade</span>
              <span className="font-bold text-[#163A63] flex items-center gap-1 mt-0.5">
                <Laptop className="w-3.5 h-3.5 text-[#12B8AE]" />
                {exp.modality}
              </span>
            </div>
            <div>
              <span className="text-[#5A6F82] font-semibold block text-[11px]">Localização</span>
              <span className="font-bold text-[#163A63] flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#12B8AE]" />
                {exp.location}
              </span>
            </div>
            <div>
              <span className="text-[#5A6F82] font-semibold block text-[11px]">Condição</span>
              <span className="font-bold text-[#0A7D76] bg-[#E6F7F6] px-2 py-0.5 rounded text-[11px] inline-block mt-0.5 border border-[#B4EBE6]">
                {exp.priceType}
              </span>
            </div>
          </div>

          {/* Full Detailed Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#164E7A]">
              Sobre esta experiência
            </h4>
            <p className="text-xs text-[#2C3E50] leading-relaxed">
              {exp.fullDescription}
            </p>
            {exp.priceDetail && (
              <p className="text-xs font-semibold text-[#0A7D76] bg-[#E6F7F6] p-2.5 rounded-xl border border-[#B4EBE6]">
                ℹ️ {exp.priceDetail}
              </p>
            )}
          </div>

          {exp.videoEmbedUrl && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#164E7A]">
                Vídeo da experiência
              </h4>
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#D9E4EE] bg-black">
                <iframe
                  src={exp.videoEmbedUrl}
                  title={`Vídeo ${exp.title}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Why This For You (Algorithmic / Human Connection) */}
          <div className="p-4 bg-[#EBF3FA] rounded-2xl border border-[#CAD8E6] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#164E7A]">
              <Sparkles className="w-4 h-4 text-[#12B8AE]" />
              <span>Por que esta oportunidade foi sugerida para você?</span>
            </div>
            <p className="text-xs text-[#163A63] leading-relaxed">
              {exp.recommendationReason}
            </p>
            <p className="text-[11px] text-[#5A6F82] italic">
              "{exp.whyThisForYou}"
            </p>
          </div>

          {/* Partner Credibility */}
          <div className="p-4 bg-white rounded-2xl border border-[#D9E4EE] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#163A63] text-white flex items-center justify-center font-bold text-xs">
                <Building className="w-5 h-5 text-[#12B8AE]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#163A63] flex items-center gap-1.5">
                  <span>Parceiro: {exp.partnerName}</span>
                  <span className="text-[10px] text-[#0A7D76] bg-[#E6F7F6] px-1.5 py-0.2 rounded font-semibold">
                    Avaliação {exp.rating} ★
                  </span>
                </p>
                <p className="text-[11px] text-[#5A6F82]">
                  Curadoria do ecossistema de longevidade PREVI
                </p>
              </div>
            </div>
            <button
              onClick={handleAskPrevix}
              className="text-xs font-bold text-[#164E7A] hover:text-[#0A988F] underline"
            >
              Falar com o PREVIX
            </button>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 px-6 bg-[#FAFBFD] border-t border-[#D9E4EE] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => showInterestInExperience(exp)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border ${hasInterest
                ? 'bg-[#E6F7F6] text-[#0A7D76] border-[#B4EBE6]'
                : 'bg-white text-[#5A6F82] border-[#D9E4EE] hover:bg-[#F4F7FA]'
              }`}
          >
            <Heart className={`w-4 h-4 ${hasInterest ? 'fill-[#12B8AE] text-[#12B8AE]' : ''}`} />
            <span>{hasInterest ? 'Interesse Registrado' : 'Tenho Interesse'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedExperienceForDetail(null)}
              className="px-4 py-2.5 bg-white hover:bg-[#EEF3F7] text-[#5A6F82] rounded-xl text-xs font-semibold border border-[#D9E4EE]"
            >
              Fechar
            </button>

            <button
              onClick={() => toggleSaveExperience(exp)}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-sm ${isSaved
                  ? 'bg-[#163A63] text-white'
                  : 'bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white'
                }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-[#12B8AE]" />
                  <span>Salvo no Meu Plano</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Adicionar ao Meu Plano</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
