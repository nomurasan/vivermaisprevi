import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getExperiences, getPartners } from '../services/api';
import { Experience, Partner, DimensionId } from '../types';
import { ExperienceCard } from '../components/ExperienceCard';
import { DIMENSIONS } from '../mock/dimensions';
import {
  Search,
  Filter,
  Sparkles,
  Laptop,
  MapPin,
  Tag,
  Building,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

export const ExplorarView: React.FC = () => {
  const { setPrevixContextKey, setIsPrevixOpen } = useApp();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<string>('all');
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [selectedPriceType, setSelectedPriceType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    async function load() {
      const expList = await getExperiences();
      const partList = await getPartners();
      setExperiences(expList);
      setPartners(partList);
    }
    load();
  }, []);

  const filteredExperiences = experiences.filter((e) => {
    if (selectedDimension !== 'all' && e.dimensionId !== selectedDimension && e.secondaryDimensionId !== selectedDimension) {
      return false;
    }
    if (selectedModality !== 'all' && e.modality !== selectedModality) {
      return false;
    }
    if (selectedPriceType !== 'all' && e.priceType !== selectedPriceType) {
      return false;
    }
    if (selectedCategory !== 'all' && !e.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.partnerName.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleResetFilters = () => {
    setSelectedDimension('all');
    setSelectedModality('all');
    setSelectedPriceType('all');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E4EE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#164E7A]">
            CATÁLOGO DO ECOSSISTEMA
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163A63]">
            Explore Possibilidades
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6F82] max-w-xl leading-relaxed">
            Descubra cursos, mentorias, atividades culturais, encontros ao ar livre e benefícios exclusivos pensados para o seu momento de vida.
          </p>
        </div>

        {/* Partners Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {partners.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setPrevixContextKey(p.id === 'maturi' ? 'maturi' : p.id === 'easylive' ? 'easylive' : 'home');
                setIsPrevixOpen(true);
              }}
              className="px-3 py-1.5 bg-[#F4F7FA] hover:bg-[#E6F7F6] rounded-xl border border-[#D9E4EE] text-xs font-bold text-[#163A63] cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Building className="w-3.5 h-3.5 text-[#12B8AE]" />
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#D9E4EE] shadow-xs space-y-4">
        {/* Top Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#5A6F82] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, parceiro (Maturi, Easy Live...), tema ou cidade..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F7FA] border border-[#D9E4EE] rounded-xl text-xs text-[#163A63] focus:border-[#12B8AE] focus:outline-hidden focus:bg-white transition-colors"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* 1. Área da Vida */}
          <div>
            <label className="text-[11px] font-bold text-[#5A6F82] block mb-1">
              Área da Vida
            </label>
            <select
              value={selectedDimension}
              onChange={(e) => setSelectedDimension(e.target.value)}
              className="w-full p-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-lg text-xs font-semibold text-[#163A63] focus:border-[#12B8AE]"
            >
              <option value="all">Todas as 8 Áreas</option>
              {DIMENSIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Modalidade */}
          <div>
            <label className="text-[11px] font-bold text-[#5A6F82] block mb-1">
              Modalidade
            </label>
            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              className="w-full p-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-lg text-xs font-semibold text-[#163A63] focus:border-[#12B8AE]"
            >
              <option value="all">Todas as Modalidades</option>
              <option value="Online">Online</option>
              <option value="Presencial">Presencial</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>

          {/* 3. Tipo / Custo */}
          <div>
            <label className="text-[11px] font-bold text-[#5A6F82] block mb-1">
              Tipo de Acesso
            </label>
            <select
              value={selectedPriceType}
              onChange={(e) => setSelectedPriceType(e.target.value)}
              className="w-full p-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-lg text-xs font-semibold text-[#163A63] focus:border-[#12B8AE]"
            >
              <option value="all">Todos os Tipos</option>
              <option value="Benefício PREVI">Benefício PREVI</option>
              <option value="Gratuito">Gratuito</option>
              <option value="Desconto Exclusivo">Desconto Exclusivo</option>
              <option value="Pago">Pago</option>
            </select>
          </div>

          {/* 4. Categoria */}
          <div>
            <label className="text-[11px] font-bold text-[#5A6F82] block mb-1">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-[#F4F7FA] border border-[#D9E4EE] rounded-lg text-xs font-semibold text-[#163A63] focus:border-[#12B8AE]"
            >
              <option value="all">Todas as Categorias</option>
              <option value="Desenvolvimento">Desenvolvimento & Carreira</option>
              <option value="Cultura">Cultura & Arte</option>
              <option value="Movimento">Movimento & Saúde</option>
              <option value="Educação">Educação & Tecnologia</option>
              <option value="Finanças">Finanças & Legado</option>
              <option value="Viagens">Viagens & Turismo</option>
            </select>
          </div>
        </div>

        {/* Filter Stats & Reset */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#EEF3F7]">
          <span className="text-[#5A6F82] font-semibold">
            Exibindo <strong>{filteredExperiences.length}</strong> possibilidades encontradas
          </span>
          <button
            onClick={handleResetFilters}
            className="text-[#164E7A] hover:text-[#0A988F] font-bold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar Filtros</span>
          </button>
        </div>
      </div>

      {/* Experiences Grid */}
      {filteredExperiences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredExperiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-[#D9E4EE] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F4F7FA] text-[#5A6F82] flex items-center justify-center mx-auto text-lg">
            🔍
          </div>
          <h3 className="font-bold text-[#163A63] text-base">
            Nenhuma experiência encontrada com os filtros atuais
          </h3>
          <p className="text-xs text-[#5A6F82]">
            Tente remover alguns filtros ou buscar por termos mais genéricos.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#12B8AE] text-[#163A63] font-bold text-xs rounded-xl"
          >
            Ver Todas as Experiências
          </button>
        </div>
      )}
    </div>
  );
};
