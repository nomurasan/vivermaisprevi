import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/Avatar';
import { DesaposenteMessenger } from '../components/DesaposenteMessenger';
import { ProfileCompletion } from '../components/desaposente/ProfileCompletion';
import { NetworkGraph } from '../components/desaposente/NetworkGraph';
import {
  buildConstellationData,
  getConnectionReasons,
  getGroupSuggestionsWithoutGroup,
  getInterestClusters,
  getRecommendedPeople,
  NETWORK_GROUPS,
} from '../services/networkEngine';
import { CATALOG_INTERESTS, getExpandedProfile } from '../mock/interestsCatalog';
import { PROFILES, SYNTHETIC_PARTICIPANTS } from '../mock/participants';
import { Participant, ParticipantInterestItem, VisibilityLevel } from '../types';
import {
  Compass,
  Users,
  Layers,
  MessageSquare,
  Orbit,
  CheckCircle2,
  Plus,
  Search,
  Shield,
} from 'lucide-react';

type RedeTab =
  | 'perfil_agora'
  | 'pessoas_recomendadas'
  | 'interesses_grupos'
  | 'conversas_conexoes'
  | 'minha_constelacao';

const TAB_ITEMS: { id: RedeTab; label: string; icon: React.ReactNode }[] = [
  { id: 'perfil_agora', label: 'Meu Perfil de Agora', icon: <Compass className="w-3.5 h-3.5" /> },
  { id: 'pessoas_recomendadas', label: 'Pessoas Recomendadas', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'interesses_grupos', label: 'Interesses & Grupos', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'conversas_conexoes', label: 'Conversas & Conexoes', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { id: 'minha_constelacao', label: 'Minha Constelacao', icon: <Orbit className="w-3.5 h-3.5" /> },
];

const VISIBILITY_LABEL: Record<VisibilityLevel, string> = {
  private: 'So eu',
  connections: 'Minhas conexoes',
  community: 'Comunidade',
};

const INTENT_OPTIONS = [
  { id: 'queroAprender', label: 'Quero aprender', role: 'quero_aprender' as const },
  { id: 'queroPraticar', label: 'Quero praticar junto', role: 'praticar_com_outros' as const },
  { id: 'possoEnsinar', label: 'Posso ensinar / compartilhar', role: 'posso_ensinar' as const },
  { id: 'apenasInteresse', label: 'Apenas gosto / tenho interesse', role: 'conversar' as const },
];

const EXPERIENCE_LEVELS = [
  { id: 'iniciante', label: 'Estou comecando' },
  { id: 'intermediario', label: 'Tenho alguma experiencia' },
  { id: 'avancado', label: 'Tenho bastante experiencia' },
] as const;

const GROUP_CATEGORY_FILTERS = [
  'Todos',
  'Musica',
  'Artes',
  'Gastronomia',
  'Esportes',
  'Natureza',
  'Tecnologia',
  'Viagens',
  'Aprendizagem',
  'Voluntariado',
  'Bem-estar',
];

export const DesaposenteRedeView: React.FC = () => {
  const {
    currentParticipant,
    expandedProfile,
    updateExpandedProfile,
    saveInterestItem,
    setActivePeerConversationId,
    sendReconnectionRequest,
    peerConversations,
  } = useApp();

  const [activeTab, setActiveTab] = useState<RedeTab>('perfil_agora');
  const [searchPeople, setSearchPeople] = useState('');
  const [selectedInterestId, setSelectedInterestId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [graphDepth, setGraphDepth] = useState<1 | 2 | 3>(1);
  const [showListAlternative, setShowListAlternative] = useState(false);
  const [graphSearch, setGraphSearch] = useState('');
  const [customInterestName, setCustomInterestName] = useState('');

  const [groupCategory, setGroupCategory] = useState('Todos');
  const [groupIntentFilter, setGroupIntentFilter] = useState<'todos' | 'aprender' | 'praticar' | 'ensinar' | 'conhecer'>('todos');
  const [groupFormatFilter, setGroupFormatFilter] = useState<'todos' | 'presencial' | 'online' | 'ambos'>('todos');
  const [groupLocationFilter, setGroupLocationFilter] = useState<'cidade' | 'regiao' | 'brasil'>('cidade');

  const [newTrajectory, setNewTrajectory] = useState({
    organization: 'Banco do Brasil',
    unitName: '',
    role: '',
    city: currentParticipant.city,
    state: currentParticipant.state,
    startYear: 2000,
    endYear: 2005,
    projectHighlights: '',
  });

  const selectedInterest = selectedInterestId
    ? CATALOG_INTERESTS.find((i) => i.id === selectedInterestId)
    : null;

  const recommended = useMemo(() => {
    const list = getRecommendedPeople(currentParticipant.id, 18);
    if (!searchPeople.trim()) return list;
    const q = searchPeople.toLowerCase();
    return list.filter((item) => {
      return (
        item.participant.name.toLowerCase().includes(q) ||
        item.commonInterests.join(' ').toLowerCase().includes(q) ||
        item.reasons.some((r) => r.message.toLowerCase().includes(q))
      );
    });
  }, [currentParticipant.id, searchPeople]);

  const interestClusters = useMemo(() => getInterestClusters(currentParticipant.id), [currentParticipant.id]);

  const filteredClusters = useMemo(() => {
    return interestClusters.filter((cluster) => {
      const group = cluster.relatedGroup;
      const byCategory = groupCategory === 'Todos' || group?.category === groupCategory;
      if (!byCategory) return false;

      if (groupIntentFilter === 'aprender' && cluster.learnCount <= 0) return false;
      if (groupIntentFilter === 'praticar' && cluster.practiceCount <= 0) return false;
      if (groupIntentFilter === 'ensinar' && cluster.teachCount <= 0) return false;
      if (groupIntentFilter === 'conhecer' && cluster.total <= 0) return false;

      if (groupFormatFilter !== 'todos' && group && group.modality !== groupFormatFilter) return false;

      if (groupLocationFilter === 'cidade' && group && group.cityScope !== 'local') return false;
      if (groupLocationFilter === 'regiao' && group && group.cityScope === 'national') return false;

      return true;
    });
  }, [groupFormatFilter, groupIntentFilter, groupCategory, groupLocationFilter, interestClusters]);

  const profileCompletion = useMemo(() => {
    const checks = [
      !!expandedProfile.profileNow?.shortBio,
      expandedProfile.trajectory.length > 0,
      !!expandedProfile.profileNow?.currentCity,
      expandedProfile.interests.length > 0,
      expandedProfile.interests.some((it) => it.intents?.queroAprender),
      expandedProfile.interests.some((it) => it.intents?.possoEnsinar),
      !!expandedProfile.profileNow?.inPersonAvailability || !!expandedProfile.profileNow?.onlineAvailability,
      expandedProfile.connectionPreferences.length > 0,
    ];

    const done = checks.filter(Boolean).length;
    const total = checks.length;
    const percentage = Math.round((done / total) * 100);
    return {
      percentage,
      remainingCount: total - done,
    };
  }, [expandedProfile]);

  const constellation = useMemo(
    () => buildConstellationData(currentParticipant.id, graphDepth),
    [currentParticipant.id, graphDepth]
  );

  const focusedConstellation = useMemo(() => {
    if (!selectedNodeId) return constellation;

    const neighborIds = new Set<string>([selectedNodeId]);
    constellation.edges.forEach((edge) => {
      if (edge.source === selectedNodeId) neighborIds.add(edge.target);
      if (edge.target === selectedNodeId) neighborIds.add(edge.source);
    });

    const nodes = constellation.nodes.filter((node) => neighborIds.has(node.id));
    const edges = constellation.edges.filter(
      (edge) => neighborIds.has(edge.source) && neighborIds.has(edge.target)
    );

    return { nodes, edges };
  }, [constellation, selectedNodeId]);

  const selectedNode = selectedNodeId
    ? constellation.nodes.find((node) => node.id === selectedNodeId)
    : null;

  const selectedPerson = selectedNode?.type === 'pessoa'
    ? getPersonFromNode(selectedNode.id)
    : null;

  const selectedPersonReasons = selectedPerson
    ? getConnectionReasons(currentParticipant, selectedPerson)
    : [];

  const selectedInterestPeople = useMemo(() => {
    if (!selectedNode || selectedNode.type !== 'interesse') return null;
    const interestId = selectedNode.id.replace('i_', '');
    const people = SYNTHETIC_PARTICIPANTS.filter((person) => {
      const profile = getExpandedProfile(person.id);
      return profile.interests.some((it) => it.interestId === interestId);
    }).slice(0, 12);

    const learners = people.filter((person) => {
      const item = getExpandedProfile(person.id).interests.find((it) => it.interestId === interestId);
      return !!item?.intents?.queroAprender || item?.roles.includes('quero_aprender');
    });

    const practitioners = people.filter((person) => {
      const item = getExpandedProfile(person.id).interests.find((it) => it.interestId === interestId);
      return !!item?.intents?.queroPraticar || item?.roles.includes('praticar_com_outros') || item?.roles.includes('quero_praticar');
    });

    const teachers = people.filter((person) => {
      const item = getExpandedProfile(person.id).interests.find((it) => it.interestId === interestId);
      return !!item?.intents?.possoEnsinar || item?.roles.includes('posso_ensinar') || item?.roles.includes('posso_compartilhar');
    });

    const relatedGroups = NETWORK_GROUPS.filter((group) => group.interestIds.includes(interestId));

    return {
      learners,
      practitioners,
      teachers,
      relatedGroups,
    };
  }, [selectedNode]);

  const selectedUnitColleagues = useMemo(() => {
    if (!selectedNode || selectedNode.type !== 'unidade') return [];
    const unitName = selectedNode.label.toLowerCase();
    const myTrajectory = expandedProfile.trajectory.find(
      (item) => item.unitName.toLowerCase() === unitName
    );

    if (!myTrajectory) return [];

    return recommended
      .map((rec) => {
        const profile = getExpandedProfile(rec.participant.id);
        const overlap = profile.trajectory.find(
          (item) => item.unitName.toLowerCase() === unitName
        );
        if (!overlap) return null;

        const overlapStart = Math.max(myTrajectory.startYear, overlap.startYear);
        const overlapEnd = Math.min(myTrajectory.endYear, overlap.endYear);
        const hasOverlap = overlapStart <= overlapEnd;

        return {
          participant: rec.participant,
          hasOverlap,
          overlapText: hasOverlap ? `${overlapStart}-${overlapEnd}` : 'Sem sobreposicao de periodo',
        };
      })
      .filter(Boolean)
      .slice(0, 8) as Array<{ participant: Participant; hasOverlap: boolean; overlapText: string }>;
  }, [selectedNode, expandedProfile.trajectory, recommended]);

  const unreadCount = peerConversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  const updateFieldVisibility = (field: 'about' | 'trajectory' | 'interests' | 'knowledge' | 'learning' | 'availability', value: VisibilityLevel) => {
    updateExpandedProfile((prev) => ({
      ...prev,
      fieldVisibility: {
        about: prev.fieldVisibility?.about || 'community',
        trajectory: prev.fieldVisibility?.trajectory || 'connections',
        interests: prev.fieldVisibility?.interests || 'community',
        knowledge: prev.fieldVisibility?.knowledge || 'connections',
        learning: prev.fieldVisibility?.learning || 'connections',
        availability: prev.fieldVisibility?.availability || 'connections',
        [field]: value,
      },
    }));
  };

  const updateProfileNow = (patch: Partial<NonNullable<typeof expandedProfile.profileNow>>) => {
    updateExpandedProfile((prev) => ({
      ...prev,
      profileNow: {
        shortBio: prev.profileNow?.shortBio || '',
        currentCity: prev.profileNow?.currentCity || currentParticipant.city,
        region: prev.profileNow?.region || currentParticipant.region,
        inPersonAvailability: prev.profileNow?.inPersonAvailability ?? true,
        onlineAvailability: prev.profileNow?.onlineAvailability ?? true,
        travelAvailability: prev.profileNow?.travelAvailability ?? false,
        openToMeetPeople: prev.profileNow?.openToMeetPeople ?? true,
        ...patch,
      },
    }));
  };

  const handleInterestToggle = (interestId: string) => {
    const existing = expandedProfile.interests.find((it) => it.interestId === interestId);
    if (!existing) {
      saveInterestItem({
        interestId,
        roles: ['quero_praticar'],
        intents: {
          queroAprender: false,
          queroPraticar: true,
          possoEnsinar: false,
          apenasInteresse: false,
        },
        experienceLevel: 'iniciante',
        visibility: 'community',
      });
    }
    setSelectedInterestId(interestId);
  };

  const handleInterestIntentChange = (
    interestId: string,
    field: 'queroAprender' | 'queroPraticar' | 'possoEnsinar' | 'apenasInteresse',
    value: boolean
  ) => {
    const current = expandedProfile.interests.find((it) => it.interestId === interestId);
    const intents = {
      queroAprender: current?.intents?.queroAprender || false,
      queroPraticar: current?.intents?.queroPraticar || false,
      possoEnsinar: current?.intents?.possoEnsinar || false,
      apenasInteresse: current?.intents?.apenasInteresse || false,
      [field]: value,
    };

    const roles = intentsToRoles(intents);

    saveInterestItem({
      interestId,
      customName: current?.customName,
      roles,
      intents,
      experienceLevel: current?.experienceLevel || 'iniciante',
      visibility: current?.visibility || 'community',
    });
  };

  const handleInterestExperienceChange = (
    interestId: string,
    experienceLevel: ParticipantInterestItem['experienceLevel']
  ) => {
    const current = expandedProfile.interests.find((it) => it.interestId === interestId);
    if (!current) return;

    saveInterestItem({
      ...current,
      experienceLevel,
    });
  };

  const addTrajectoryItem = () => {
    if (!newTrajectory.unitName.trim() || !newTrajectory.role.trim()) return;
    updateExpandedProfile((prev) => ({
      ...prev,
      trajectory: [
        ...prev.trajectory,
        {
          id: `traj_${Date.now()}`,
          participantId: prev.participantId,
          organization: newTrajectory.organization,
          unitName: newTrajectory.unitName,
          role: newTrajectory.role,
          city: newTrajectory.city,
          state: newTrajectory.state,
          startYear: newTrajectory.startYear,
          endYear: newTrajectory.endYear,
          projectHighlights: newTrajectory.projectHighlights,
        },
      ],
    }));

    setNewTrajectory((prev) => ({
      ...prev,
      unitName: '',
      role: '',
      projectHighlights: '',
    }));
  };

  const startConversation = (participant: Participant) => {
    sendReconnectionRequest(participant);
    setActivePeerConversationId(`conv_${participant.id}`);
    setActiveTab('conversas_conexoes');
  };

  const addCustomInterest = () => {
    const value = customInterestName.trim();
    if (!value) return;
    saveInterestItem({
      interestId: `custom_${Date.now()}`,
      customName: value,
      roles: ['conversar'],
      intents: {
        queroAprender: false,
        queroPraticar: false,
        possoEnsinar: false,
        apenasInteresse: true,
      },
      experienceLevel: 'iniciante',
      visibility: 'community',
    });
    setCustomInterestName('');
  };

  const handleGraphSearch = () => {
    const q = graphSearch.trim().toLowerCase();
    if (!q) return;
    const found = constellation.nodes.find((node) => node.label.toLowerCase().includes(q));
    if (found) setSelectedNodeId(found.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-7">
      <section className="bg-gradient-to-br from-[#163A63] via-[#1E466F] to-[#164E7A] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#12B8AE]/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl space-y-4">
          <span className="inline-flex px-3 py-1 rounded-full border border-[#12B8AE]/50 bg-[#12B8AE]/20 text-[#B4EBE6] text-xs font-bold">
            REDE VIVA DE CONEXOES
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">DESAPOSENTE SUA REDE</h1>
          <p className="text-sm sm:text-base text-[#D9E4EE]">
            Pessoas, historias, interesses e novas experiencias esperando para se conectar com voce.
          </p>
          <p className="text-xs sm:text-sm text-[#D9E4EE]/95">
            Conte um pouco mais sobre quem voce e hoje. Quanto mais voce compartilha seus interesses, conhecimentos e experiencias, melhores serao as conexoes que o Vivendo Mais PREVI podera encontrar para voce.
          </p>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-[#D9E4EE] p-2 flex flex-wrap gap-2">
        {TAB_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                active
                  ? 'bg-[#163A63] text-white shadow-xs'
                  : 'text-[#5A6F82] hover:bg-[#F4F7FA] hover:text-[#163A63]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.id === 'conversas_conexoes' && unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#12B8AE] text-[#163A63] font-black">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </section>

      {activeTab === 'perfil_agora' && (
        <section className="space-y-6 animate-in fade-in">
          <ProfileCompletion
            percentage={profileCompletion.percentage}
            remainingCount={profileCompletion.remainingCount}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D9E4EE] p-5 space-y-5">
              <div>
                <h2 className="text-lg font-extrabold text-[#163A63]">Meu Perfil de Agora</h2>
                <p className="text-xs text-[#5A6F82] mt-1">
                  Nao estamos apenas atualizando seu cadastro. Estamos ajudando sua rede a descobrir quem voce e hoje.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-xs font-bold text-[#163A63] space-y-1">
                  Breve apresentacao
                  <textarea
                    value={expandedProfile.profileNow?.shortBio || ''}
                    onChange={(e) => updateProfileNow({ shortBio: e.target.value })}
                    className="w-full min-h-20 rounded-xl border border-[#D9E4EE] p-2 text-xs text-[#2C3E50]"
                    placeholder="Conte quem voce e hoje"
                  />
                </label>
                <label className="text-xs font-bold text-[#163A63] space-y-1">
                  Cidade atual
                  <input
                    value={expandedProfile.profileNow?.currentCity || currentParticipant.city}
                    onChange={(e) => updateProfileNow({ currentCity: e.target.value })}
                    className="w-full rounded-xl border border-[#D9E4EE] p-2 text-xs"
                  />
                </label>
                <label className="text-xs font-bold text-[#163A63] space-y-1">
                  Regiao
                  <input
                    value={expandedProfile.profileNow?.region || currentParticipant.region}
                    onChange={(e) => updateProfileNow({ region: e.target.value })}
                    className="w-full rounded-xl border border-[#D9E4EE] p-2 text-xs"
                  />
                </label>
                <div className="text-xs font-bold text-[#163A63] space-y-2">
                  Disponibilidade
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-[#2C3E50]">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!expandedProfile.profileNow?.inPersonAvailability}
                        onChange={(e) => updateProfileNow({ inPersonAvailability: e.target.checked })}
                      />
                      Presencial
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!expandedProfile.profileNow?.onlineAvailability}
                        onChange={(e) => updateProfileNow({ onlineAvailability: e.target.checked })}
                      />
                      On-line
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!expandedProfile.profileNow?.travelAvailability}
                        onChange={(e) => updateProfileNow({ travelAvailability: e.target.checked })}
                      />
                      Viagens
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!expandedProfile.profileNow?.openToMeetPeople}
                        onChange={(e) => updateProfileNow({ openToMeetPeople: e.target.checked })}
                      />
                      Conhecer pessoas
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EEF3F7] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#163A63]">Trajetoria profissional</h3>
                  <span className="text-[11px] text-[#5A6F82]">Dados institucionais + complementacao</span>
                </div>

                <div className="space-y-2">
                  {expandedProfile.trajectory.map((item) => (
                    <article key={item.id} className="rounded-xl border border-[#D9E4EE] p-3 bg-[#FAFBFD]">
                      <p className="text-[11px] text-[#12B8AE] font-bold uppercase">{item.organization}</p>
                      <p className="text-xs font-bold text-[#163A63]">{item.unitName}</p>
                      <p className="text-[11px] text-[#5A6F82]">{item.role} - {item.city}/{item.state} - {item.startYear}-{item.endYear}</p>
                      {item.projectHighlights && <p className="text-[11px] text-[#2C3E50] mt-1">Projeto relevante: {item.projectHighlights}</p>}
                    </article>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    value={newTrajectory.organization}
                    onChange={(e) => setNewTrajectory((prev) => ({ ...prev, organization: e.target.value }))}
                    placeholder="Empresa (ex.: Banco do Brasil)"
                    className="rounded-xl border border-[#D9E4EE] p-2 text-xs"
                  />
                  <input
                    value={newTrajectory.unitName}
                    onChange={(e) => setNewTrajectory((prev) => ({ ...prev, unitName: e.target.value }))}
                    placeholder="Unidade / diretoria / departamento"
                    className="rounded-xl border border-[#D9E4EE] p-2 text-xs"
                  />
                  <input
                    value={newTrajectory.role}
                    onChange={(e) => setNewTrajectory((prev) => ({ ...prev, role: e.target.value }))}
                    placeholder="Funcao exercida"
                    className="rounded-xl border border-[#D9E4EE] p-2 text-xs"
                  />
                  <input
                    value={newTrajectory.projectHighlights}
                    onChange={(e) => setNewTrajectory((prev) => ({ ...prev, projectHighlights: e.target.value }))}
                    placeholder="Projeto relevante"
                    className="rounded-xl border border-[#D9E4EE] p-2 text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={newTrajectory.startYear}
                      onChange={(e) => setNewTrajectory((prev) => ({ ...prev, startYear: Number(e.target.value) }))}
                      className="rounded-xl border border-[#D9E4EE] p-2 text-xs"
                      aria-label="Ano inicio"
                    />
                    <input
                      type="number"
                      value={newTrajectory.endYear}
                      onChange={(e) => setNewTrajectory((prev) => ({ ...prev, endYear: Number(e.target.value) }))}
                      className="rounded-xl border border-[#D9E4EE] p-2 text-xs"
                      aria-label="Ano termino"
                    />
                  </div>
                  <button
                    onClick={addTrajectoryItem}
                    className="rounded-xl bg-[#163A63] text-white text-xs font-bold px-3 py-2 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar trajeto
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EEF3F7] space-y-3">
                <h3 className="text-sm font-extrabold text-[#163A63]">
                  O que voce gosta de fazer, gostaria de aprender ou poderia compartilhar com outras pessoas?
                </h3>

                <div className="flex flex-wrap gap-2">
                  {CATALOG_INTERESTS.slice(0, 24).map((interest) => {
                    const active = expandedProfile.interests.some((i) => i.interestId === interest.id);
                    return (
                      <button
                        key={interest.id}
                        onClick={() => handleInterestToggle(interest.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                          active
                            ? 'bg-[#E6F7F6] text-[#163A63] border-[#12B8AE]'
                            : 'bg-white text-[#5A6F82] border-[#D9E4EE] hover:border-[#12B8AE]'
                        }`}
                      >
                        {interest.icon} {interest.name}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    value={customInterestName}
                    onChange={(e) => setCustomInterestName(e.target.value)}
                    placeholder="Outro interesse"
                    className="flex-1 rounded-xl border border-[#D9E4EE] p-2 text-xs"
                  />
                  <button
                    onClick={addCustomInterest}
                    className="rounded-xl border border-[#D9E4EE] px-3 py-2 text-xs font-bold text-[#163A63]"
                  >
                    Adicionar outro interesse
                  </button>
                </div>

                {selectedInterest && (
                  <div className="rounded-2xl border border-[#B4EBE6] bg-[#F8FFFE] p-4 space-y-3">
                    <p className="text-sm font-extrabold text-[#163A63]">Como esse interesse faz parte da sua vida? ({selectedInterest.name})</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {INTENT_OPTIONS.map((option) => {
                        const current = expandedProfile.interests.find((it) => it.interestId === selectedInterest.id);
                        const checked = !!current?.intents?.[option.id as keyof NonNullable<ParticipantInterestItem['intents']>];
                        return (
                          <label key={option.id} className="text-xs text-[#2C3E50] rounded-xl border border-[#D9E4EE] p-2 flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => handleInterestIntentChange(selectedInterest.id, option.id as any, e.target.checked)}
                            />
                            {option.label}
                          </label>
                        );
                      })}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[#163A63]">Qual e sua experiencia? (opcional)</p>
                      <div className="flex flex-wrap gap-2">
                        {EXPERIENCE_LEVELS.map((level) => {
                          const current = expandedProfile.interests.find((it) => it.interestId === selectedInterest.id);
                          const active = current?.experienceLevel === level.id;
                          return (
                            <button
                              key={level.id}
                              onClick={() => handleInterestExperienceChange(selectedInterest.id, level.id)}
                              className={`px-3 py-1.5 text-xs rounded-full border ${
                                active
                                  ? 'bg-[#163A63] text-white border-[#163A63]'
                                  : 'bg-white text-[#5A6F82] border-[#D9E4EE]'
                              }`}
                            >
                              {level.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#D9E4EE] p-4 space-y-3">
                <h3 className="text-sm font-extrabold text-[#163A63] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#12B8AE]" />
                  Quem pode ver esta informacao?
                </h3>
                {([
                  ['about', 'Sobre mim'],
                  ['trajectory', 'Trajetoria'],
                  ['interests', 'Interesses'],
                  ['knowledge', 'Conhecimentos'],
                  ['learning', 'Quero aprender'],
                  ['availability', 'Disponibilidade'],
                ] as const).map(([field, label]) => (
                  <div key={field} className="space-y-1">
                    <p className="text-[11px] font-bold text-[#5A6F82]">{label}</p>
                    <div className="flex gap-1">
                      {(['private', 'connections', 'community'] as VisibilityLevel[]).map((level) => {
                        const current = expandedProfile.fieldVisibility?.[field] || 'connections';
                        const active = current === level;
                        return (
                          <button
                            key={level}
                            onClick={() => updateFieldVisibility(field, level)}
                            className={`px-2 py-1 rounded-lg text-[10px] border ${
                              active
                                ? 'bg-[#163A63] text-white border-[#163A63]'
                                : 'bg-white text-[#5A6F82] border-[#D9E4EE]'
                            }`}
                          >
                            {VISIBILITY_LABEL[level]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-[#D9E4EE] p-4 space-y-2">
                <h3 className="text-sm font-extrabold text-[#163A63]">PREVIX (estrutura pronta)</h3>
                <ul className="text-xs text-[#5A6F82] space-y-2">
                  <li>Encontramos tres pessoas que trabalharam com voce na mesma unidade.</li>
                  <li>Ha cinco participantes em Brasilia interessados em aprender violao.</li>
                  <li>Voce quer aprender marcenaria e encontramos duas pessoas proximas que podem compartilhar essa experiencia.</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      )}

      {activeTab === 'pessoas_recomendadas' && (
        <section className="space-y-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#D9E4EE] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#163A63]">Pessoas Recomendadas</h2>
              <p className="text-xs text-[#5A6F82]">Recomendacoes explicaveis por afinidade, complementaridade e trajetoria.</p>
            </div>
            <label className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#8FA3B8] absolute left-3 top-2.5" />
              <input
                value={searchPeople}
                onChange={(e) => setSearchPeople(e.target.value)}
                placeholder="Buscar por pessoa, interesse ou motivo"
                className="w-full rounded-xl border border-[#D9E4EE] pl-9 pr-3 py-2 text-xs"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recommended.map((item) => {
              const profile = getExpandedProfile(item.participant.id);
              const canShowAge = profile.privacy.showName;
              const topReason = item.reasons.slice(0, 4);
              return (
                <article key={item.participant.id} className="bg-white rounded-2xl border border-[#D9E4EE] p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={item.participant.avatarUrl} name={item.participant.name} size="lg" />
                    <div>
                      <h3 className="text-sm font-extrabold text-[#163A63]">{item.participant.name}</h3>
                      <p className="text-xs text-[#5A6F82]">
                        {canShowAge ? `${item.participant.age} anos - ` : ''}
                        {item.participant.city}
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#2C3E50] space-y-1">
                    {item.commonInterests.length > 0 && <p><strong>Interesses em comum:</strong> {item.commonInterests.slice(0, 3).join(', ')}</p>}
                    {item.professionalRelation && <p><strong>Relacao profissional:</strong> {item.professionalRelation}</p>}
                    {item.commonGroups.length > 0 && <p><strong>Grupos em comum:</strong> {item.commonGroups.map((g) => g.name).join(', ')}</p>}
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] border border-[#EEF3F7] p-3 space-y-1">
                    <p className="text-[11px] font-bold text-[#163A63]">Por que recomendamos esta pessoa?</p>
                    {topReason.map((reason, index) => (
                      <p key={`${reason.code}_${index}`} className="text-[11px] text-[#2C3E50] flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#12B8AE] shrink-0 mt-0.5" />
                        {reason.message}
                      </p>
                    ))}
                  </div>

                  <button
                    onClick={() => startConversation(item.participant)}
                    className="w-full py-2 rounded-xl bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] font-extrabold text-xs transition-all"
                  >
                    Conectar e conversar
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'interesses_grupos' && (
        <section className="space-y-5 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#D9E4EE] p-5 space-y-2">
            <h2 className="text-lg font-extrabold text-[#163A63]">Encontre sua turma</h2>
            <p className="text-xs text-[#5A6F82]">
              Descubra pessoas que compartilham seus interesses. Participe de um grupo, troque experiencias ou ajude a criar uma nova roda.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#D9E4EE] p-4 grid grid-cols-1 xl:grid-cols-4 gap-3">
            <div>
              <p className="text-[11px] font-bold text-[#5A6F82] mb-1">Categorias</p>
              <select value={groupCategory} onChange={(e) => setGroupCategory(e.target.value)} className="w-full rounded-xl border border-[#D9E4EE] p-2 text-xs">
                {GROUP_CATEGORY_FILTERS.map((cat) => <option key={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#5A6F82] mb-1">Quero</p>
              <select value={groupIntentFilter} onChange={(e) => setGroupIntentFilter(e.target.value as any)} className="w-full rounded-xl border border-[#D9E4EE] p-2 text-xs">
                <option value="todos">Todos</option>
                <option value="aprender">Aprender</option>
                <option value="praticar">Praticar</option>
                <option value="ensinar">Ensinar / compartilhar</option>
                <option value="conhecer">Conhecer pessoas</option>
              </select>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#5A6F82] mb-1">Formato</p>
              <select value={groupFormatFilter} onChange={(e) => setGroupFormatFilter(e.target.value as any)} className="w-full rounded-xl border border-[#D9E4EE] p-2 text-xs">
                <option value="todos">Tanto faz</option>
                <option value="presencial">Presencial</option>
                <option value="online">On-line</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#5A6F82] mb-1">Localizacao</p>
              <select value={groupLocationFilter} onChange={(e) => setGroupLocationFilter(e.target.value as any)} className="w-full rounded-xl border border-[#D9E4EE] p-2 text-xs">
                <option value="cidade">Minha cidade</option>
                <option value="regiao">Minha regiao</option>
                <option value="brasil">Todo o Brasil</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredClusters.map((cluster) => (
              <article key={cluster.interestId} className="bg-white rounded-2xl border border-[#D9E4EE] p-4 space-y-2">
                <h3 className="text-sm font-extrabold text-[#163A63]">{cluster.interestName}</h3>
                <p className="text-xs text-[#5A6F82]">{cluster.total} pessoas interessadas</p>
                <div className="text-[11px] text-[#2C3E50] space-y-1">
                  <p>{cluster.learnCount} querem aprender</p>
                  <p>{cluster.practiceCount} querem praticar</p>
                  <p>{cluster.teachCount} podem ensinar</p>
                </div>
                {cluster.relatedGroup ? (
                  <div className="rounded-xl border border-[#B4EBE6] bg-[#F8FFFE] p-2">
                    <p className="text-[11px] font-bold text-[#163A63]">Grupo relacionado: {cluster.relatedGroup.name}</p>
                    <p className="text-[11px] text-[#5A6F82]">{cluster.relatedGroup.participantIds.length} participantes</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-2 text-[11px] text-[#92400E]">
                    Sem grupo relacionado no momento.
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSearchPeople(cluster.interestName);
                      setActiveTab('pessoas_recomendadas');
                    }}
                    className="flex-1 rounded-xl border border-[#D9E4EE] text-xs px-3 py-2 text-[#163A63] font-bold"
                  >
                    Ver pessoas
                  </button>
                  <button
                    onClick={() => setActiveTab('conversas_conexoes')}
                    className="flex-1 rounded-xl bg-[#12B8AE] text-xs px-3 py-2 text-[#163A63] font-bold"
                  >
                    Ver grupo
                  </button>
                </div>
              </article>
            ))}
          </div>

          {getGroupSuggestionsWithoutGroup(12).slice(0, 3).map((suggestion) => (
            <div key={suggestion.interestId} className="bg-white rounded-2xl border border-[#FDE68A] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#163A63]">Tem turma querendo aparecer!</h3>
                <p className="text-xs text-[#5A6F82]">Encontramos {suggestion.total} pessoas interessadas em {suggestion.interestName}.</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-[#163A63] text-white text-xs font-bold">Sugerir criacao de grupo</button>
            </div>
          ))}

          <div className="bg-white rounded-2xl border border-[#D9E4EE] p-4">
            <p className="text-xs text-[#5A6F82]">Grupos disponiveis nesta versao demonstrativa: {NETWORK_GROUPS.length}</p>
          </div>
        </section>
      )}

      {activeTab === 'conversas_conexoes' && (
        <section className="space-y-3 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#D9E4EE] p-4">
            <h2 className="text-lg font-extrabold text-[#163A63]">Conversas & Conexoes</h2>
            <p className="text-xs text-[#5A6F82]">
              Inicie conversa a partir de pessoas recomendadas, interesses ou grupos, com consentimento e privacidade.
            </p>
          </div>
          <DesaposenteMessenger onBackToDiscovery={() => setActiveTab('pessoas_recomendadas')} />
        </section>
      )}

      {activeTab === 'minha_constelacao' && (
        <section className="space-y-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#D9E4EE] p-5 space-y-2">
            <h2 className="text-lg font-extrabold text-[#163A63]">Minha Constelacao</h2>
            <p className="text-xs text-[#5A6F82]">Veja como pessoas, historias, interesses e experiencias se conectam ao seu redor.</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#D9E4EE] p-3 flex flex-wrap items-center gap-2">
            {([
              ['Minha Rede', 1],
              ['Pessoas', 1],
              ['Antigos Colegas', 2],
              ['Interesses', 2],
              ['Quero Aprender', 2],
              ['Posso Ensinar', 2],
              ['Grupos', 3],
              ['Todos', 3],
            ] as const).map(([label, depth]) => (
              <button
                key={label}
                onClick={() => setGraphDepth(depth as 1 | 2 | 3)}
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  graphDepth === depth ? 'bg-[#163A63] text-white border-[#163A63]' : 'bg-white border-[#D9E4EE] text-[#5A6F82]'
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setGraphDepth((d) => (d < 3 ? ((d + 1) as 1 | 2 | 3) : d))}
              className="ml-auto px-3 py-1.5 rounded-full text-xs border border-[#12B8AE] text-[#163A63] bg-[#E6F7F6]"
            >
              Explorar mais conexoes
            </button>
            <button
              onClick={() => setShowListAlternative((prev) => !prev)}
              className="px-3 py-1.5 rounded-full text-xs border border-[#D9E4EE] text-[#163A63]"
            >
              {showListAlternative ? 'Ver grafo' : 'Alternativa em lista'}
            </button>
            <div className="w-full sm:w-auto sm:ml-auto flex gap-2">
              <input
                value={graphSearch}
                onChange={(e) => setGraphSearch(e.target.value)}
                placeholder="Buscar pessoa, interesse, grupo, unidade ou cidade"
                className="rounded-xl border border-[#D9E4EE] px-3 py-1.5 text-xs w-full sm:w-80"
              />
              <button
                onClick={handleGraphSearch}
                className="rounded-xl bg-[#163A63] text-white px-3 py-1.5 text-xs font-bold"
              >
                Buscar
              </button>
            </div>
          </div>

          {!showListAlternative ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
              <div className="xl:col-span-3">
                <NetworkGraph
                  nodes={focusedConstellation.nodes}
                  edges={focusedConstellation.edges}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={setSelectedNodeId}
                />
              </div>

              <aside className="bg-white rounded-2xl border border-[#D9E4EE] p-4 space-y-3">
                <h3 className="text-sm font-extrabold text-[#163A63]">Detalhes do no</h3>
                {!selectedNode && (
                  <p className="text-xs text-[#5A6F82]">Clique em uma pessoa, interesse, grupo, unidade ou cidade para destacar conexoes.</p>
                )}
                {selectedNode && (
                  <>
                    <div className="rounded-xl bg-[#F8FAFC] border border-[#EEF3F7] p-3">
                      <p className="text-[11px] text-[#5A6F82] uppercase font-bold">Tipo</p>
                      <p className="text-sm font-extrabold text-[#163A63]">{selectedNode.type}</p>
                      <p className="text-xs text-[#2C3E50]">{selectedNode.label}</p>
                    </div>

                    {selectedNode.type === 'interesse' && (
                      <div className="text-xs text-[#2C3E50] space-y-2">
                        <p>🌱 aprender</p>
                        <p>🤝 praticar</p>
                        <p>💡 ensinar</p>
                        {selectedInterestPeople && (
                          <>
                            <p className="font-bold text-[#163A63] pt-1">Foco por interesse:</p>
                            <p>{selectedInterestPeople.learners.length} querem aprender</p>
                            <p>{selectedInterestPeople.practitioners.length} querem praticar</p>
                            <p>{selectedInterestPeople.teachers.length} podem ensinar</p>
                            <p>{selectedInterestPeople.relatedGroups.length} grupo(s) relacionado(s)</p>
                          </>
                        )}
                      </div>
                    )}

                    {selectedNode.type === 'unidade' && (
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-[#163A63]">Antigos colegas nesta unidade</p>
                        {selectedUnitColleagues.length === 0 && (
                          <p className="text-[11px] text-[#5A6F82]">Sem colegas mapeados para esta unidade no recorte atual.</p>
                        )}
                        {selectedUnitColleagues.map((entry) => (
                          <div key={entry.participant.id} className="rounded-xl border border-[#D9E4EE] p-2">
                            <p className="text-[11px] font-bold text-[#163A63]">{entry.participant.name}</p>
                            <p className="text-[11px] text-[#5A6F82]">Periodo em comum: {entry.overlapText}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedPerson && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-extrabold text-[#163A63]">{selectedPerson.name}</h4>
                        <p className="text-[11px] text-[#5A6F82]">Voces possuem {selectedPersonReasons.length} ponto(s) de conexao.</p>
                        <div className="space-y-1">
                          {selectedPersonReasons.slice(0, 4).map((reason, idx) => (
                            <p key={`${reason.code}_${idx}`} className="text-[11px] text-[#2C3E50]">- {reason.message}</p>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 gap-2 pt-1">
                          <button className="rounded-xl border border-[#D9E4EE] text-xs py-2 font-bold text-[#163A63]">Ver perfil</button>
                          <button onClick={() => startConversation(selectedPerson)} className="rounded-xl bg-[#163A63] text-white text-xs py-2 font-bold">Conectar</button>
                          <button onClick={() => startConversation(selectedPerson)} className="rounded-xl bg-[#12B8AE] text-[#163A63] text-xs py-2 font-bold">Conversar</button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </aside>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#D9E4EE] p-4 space-y-2">
              <h3 className="text-sm font-extrabold text-[#163A63]">Visualizacao alternativa em lista</h3>
              <p className="text-xs text-[#5A6F82]">Navegue pela rede sem usar o grafo interativo.</p>
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
                {constellation.nodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="w-full text-left rounded-xl border border-[#D9E4EE] p-2 hover:bg-[#F8FAFC]"
                  >
                    <p className="text-[11px] text-[#5A6F82] uppercase">{node.type}</p>
                    <p className="text-xs font-bold text-[#163A63]">{node.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

function intentsToRoles(intents: {
  queroAprender: boolean;
  queroPraticar: boolean;
  possoEnsinar: boolean;
  apenasInteresse: boolean;
}) {
  const roles: ParticipantInterestItem['roles'] = [];
  if (intents.queroAprender) roles.push('quero_aprender');
  if (intents.queroPraticar) roles.push('praticar_com_outros');
  if (intents.possoEnsinar) roles.push('posso_ensinar');
  if (intents.apenasInteresse) roles.push('conversar');
  if (roles.length === 0) roles.push('quero_praticar');
  return roles;
}

function getPersonFromNode(nodeId: string): Participant | null {
  if (!nodeId.startsWith('p_')) return null;
  const participantId = nodeId.replace('p_', '');
  const fromProfiles = PROFILES[participantId];
  if (fromProfiles) return fromProfiles;
  const fromSynthetic = SYNTHETIC_PARTICIPANTS.find((person) => person.id === participantId);
  return fromSynthetic || null;
}
