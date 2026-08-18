import React, { useState } from 'react';
import { Experience } from '../types';
import { useApp } from '../context/AppContext';
import {
  Bookmark,
  BookmarkCheck,
  Heart,
  HelpCircle,
  MapPin,
  Laptop,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Info,
} from 'lucide-react';
import { DIMENSIONS } from '../mock/dimensions';

interface ExperienceCardProps {
  experience: Experience;
  onOpenDetail?: (exp: Experience) => void;
  showFullDescription?: boolean;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  onOpenDetail,
  showFullDescription = false,
}) => {
  const {
    savedExperienceIds,
    toggleSaveExperience,
    interestedExperienceIds,
    showInterestInExperience,
    setSelectedExperienceForDetail,
    setPrevixContextKey,
    setIsPrevixOpen,
  } = useApp();

  const [showWhyModal, setShowWhyModal] = useState(false);

  const isSaved = savedExperienceIds.includes(experience.id);
  const hasInterest = interestedExperienceIds.includes(experience.id);
  const dimension = DIMENSIONS.find((d) => d.id === experience.dimensionId);

  const handleOpenDetail = () => {
    setSelectedExperienceForDetail(experience);
    if (onOpenDetail) onOpenDetail(experience);
  };

  const handleWhyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowWhyModal(!showWhyModal);
  };

  const handleAskPrevix = (e: React.MouseEvent) => {
    e.stopPropagation();
    const partnerKey = experience.partnerId === 'maturi' ? 'maturi' : experience.partnerId === 'easylive' ? 'easylive' : experience.dimensionId;
    setPrevixContextKey(partnerKey);
    setIsPrevixOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#D9E4EE] hover:border-[#12B8AE] shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Top Visual Image / Header Banner */}
        <div className="relative h-44 w-full bg-[#EBF3FA] overflow-hidden">
          {experience.imageUrl ? (
            <img
              src={experience.imageUrl}
              alt={experience.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#164E7A] bg-gradient-to-br from-[#EBF3FA] to-[#D9E4EE]">
              <Sparkles className="w-12 h-12 text-[#12B8AE]/60" />
            </div>
          )}

          {/* Badge overlays */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 bg-[#163A63]/90 backdrop-blur-sm text-white rounded-full text-[11px] font-bold shadow-sm">
              {experience.category}
            </span>
            {experience.badge && (
              <span className="px-2 py-0.5 bg-[#12B8AE] text-[#163A63] rounded-full text-[10px] font-extrabold shadow-sm">
                {experience.badge}
              </span>
            )}
          </div>

          {/* Price Tag Badge */}
          <div className="absolute bottom-3 right-3">
            <span
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm ${
                experience.priceType === 'Benefício PREVI'
                  ? 'bg-[#12B8AE] text-[#163A63]'
                  : experience.priceType === 'Desconto Exclusivo'
                  ? 'bg-white text-[#164E7A] border border-[#D9E4EE]'
                  : 'bg-white/90 text-[#2C3E50]'
              }`}
            >
              {experience.priceType}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          {/* Partner & Dimension Pill */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-bold text-[#164E7A] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#12B8AE]" />
              {experience.partnerName}
            </span>
            {dimension && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F4F7FA] text-[#5A6F82] border border-[#D9E4EE] font-medium">
                {dimension.name}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={handleOpenDetail}
            className="font-bold text-[#163A63] text-base leading-snug hover:text-[#0A988F] cursor-pointer transition-colors"
          >
            {experience.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#5A6F82] leading-relaxed line-clamp-2">
            {showFullDescription ? experience.fullDescription : experience.description}
          </p>

          {/* Location & Modality */}
          <div className="flex items-center gap-4 text-[11px] text-[#5A6F82] pt-1">
            <span className="flex items-center gap-1">
              <Laptop className="w-3.5 h-3.5 text-[#164E7A]" />
              {experience.modality}
            </span>
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#164E7A]" />
              {experience.location}
            </span>
          </div>

          {/* "Por que estou vendo isso?" Inline Drawer */}
          {showWhyModal && (
            <div className="p-3 bg-[#E6F7F6] rounded-xl border border-[#B4EBE6] text-xs space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0A7D76] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Por que esta experiência apareceu para você?
                </span>
                <button
                  onClick={() => setShowWhyModal(false)}
                  className="text-[#0A7D76] font-bold text-xs"
                >
                  ×
                </button>
              </div>
              <p className="text-[11px] text-[#163A63] leading-relaxed">
                {experience.recommendationReason}
              </p>
              <button
                onClick={handleAskPrevix}
                className="text-[10px] text-[#0A988F] font-bold underline block"
              >
                Tirar dúvidas com o PREVIX
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 pt-2 border-t border-[#EEF3F7] space-y-2 bg-[#FAFBFD]">
        <div className="flex items-center justify-between">
          <button
            onClick={handleWhyClick}
            className="text-[11px] font-semibold text-[#164E7A] hover:text-[#0A988F] flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Por que estou vendo isso?</span>
          </button>
          
          <button
            onClick={() => showInterestInExperience(experience)}
            className={`text-[11px] font-bold px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
              hasInterest
                ? 'text-[#0A7D76] bg-[#E6F7F6]'
                : 'text-[#5A6F82] hover:text-[#163A63]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasInterest ? 'fill-[#12B8AE] text-[#12B8AE]' : ''}`} />
            <span>{hasInterest ? 'Interesse registrado' : 'Tenho interesse'}</span>
          </button>
        </div>

        {/* Primary Row Buttons: Conhecer + Salvar */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleOpenDetail}
            className="w-full py-2 px-3 bg-white hover:bg-[#EEF3F7] text-[#163A63] font-bold text-xs rounded-lg border border-[#D9E4EE] transition-colors flex items-center justify-center gap-1"
          >
            <span>CONHECER</span>
          </button>

          <button
            onClick={() => toggleSaveExperience(experience)}
            className={`w-full py-2 px-3 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 ${
              isSaved
                ? 'bg-[#163A63] text-white'
                : 'bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-[#12B8AE]" />
                <span>SALVO NO PLANO</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>SALVAR</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
