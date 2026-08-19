import React from 'react';
import { Avatar } from '../Avatar';
import { CATALOG_INTERESTS, getExpandedProfile } from '../../mock/interestsCatalog';
import { PROFILES, SYNTHETIC_PARTICIPANTS } from '../../mock/participants';
import { GroupEvent, GroupMembershipStatus, GroupMessage, InterestGroup, Participant } from '../../types';
import { getConnectionReasons } from '../../services/networkEngine';
import { ArrowLeft, Info, Plus, Send, Users } from 'lucide-react';

interface GroupConversationPageProps {
    group: InterestGroup;
    currentUser: Participant;
    membershipStatus: GroupMembershipStatus;
    messages: GroupMessage[];
    events: GroupEvent[];
    onBack: () => void;
    onJoinGroup: () => void;
    onRequestApprovalJoin: () => void;
    onSendMessage: (text: string) => void;
    onCreateEvent: () => void;
    onExpressInterestInEvent: (eventId: string) => void;
    onOpenParticipant: (participant: Participant) => void;
    onOpenConversationWithParticipant: (participant: Participant) => void;
    onOpenGroupInfo: () => void;
    joinMode: 'open' | 'approval';
}

function getPersonById(id: string): Participant | null {
    return PROFILES[id] || SYNTHETIC_PARTICIPANTS.find((p) => p.id === id) || null;
}

function getParticipantIntentLabel(group: InterestGroup, participantId: string): string {
    const profile = getExpandedProfile(participantId);
    const groupInterestIds = new Set(group.interestIds);
    const item = profile.interests.find((it) => groupInterestIds.has(it.interestId));

    if (!item) return 'Interesse no grupo';
    if (item.intents?.possoEnsinar || item.roles.includes('posso_ensinar') || item.roles.includes('posso_compartilhar')) {
        return '💡 Pode compartilhar';
    }
    if (item.intents?.queroPraticar || item.roles.includes('praticar_com_outros') || item.roles.includes('quero_praticar')) {
        return '🤝 Quer praticar';
    }
    if (item.intents?.queroAprender || item.roles.includes('quero_aprender')) {
        return '🌱 Quer aprender';
    }
    return 'Interesse no grupo';
}

function getStats(group: InterestGroup): { learn: number; practice: number; teach: number } {
    let learn = 0;
    let practice = 0;
    let teach = 0;

    group.participantIds.forEach((participantId) => {
        const profile = getExpandedProfile(participantId);
        const item = profile.interests.find((it) => group.interestIds.includes(it.interestId));
        if (!item) return;

        if (item.intents?.queroAprender || item.roles.includes('quero_aprender')) learn += 1;
        if (item.intents?.queroPraticar || item.roles.includes('quero_praticar') || item.roles.includes('praticar_com_outros')) practice += 1;
        if (item.intents?.possoEnsinar || item.roles.includes('posso_ensinar') || item.roles.includes('posso_compartilhar')) teach += 1;
    });

    return { learn, practice, teach };
}

function getCommonInterestsWithCurrentUser(currentUserId: string, participantId: string): string[] {
    const myProfile = getExpandedProfile(currentUserId);
    const otherProfile = getExpandedProfile(participantId);
    const mine = new Set(myProfile.interests.map((it) => it.interestId));
    return otherProfile.interests
        .filter((it) => mine.has(it.interestId))
        .map((it) => CATALOG_INTERESTS.find((interest) => interest.id === it.interestId)?.name || it.interestId)
        .slice(0, 4);
}

export const GroupConversationPage: React.FC<GroupConversationPageProps> = ({
    group,
    currentUser,
    membershipStatus,
    messages,
    events,
    onBack,
    onJoinGroup,
    onRequestApprovalJoin,
    onSendMessage,
    onCreateEvent,
    onExpressInterestInEvent,
    onOpenParticipant,
    onOpenConversationWithParticipant,
    onOpenGroupInfo,
    joinMode,
}) => {
    const [draftMessage, setDraftMessage] = React.useState('');
    const [showParticipants, setShowParticipants] = React.useState(false);
    const [selectedParticipant, setSelectedParticipant] = React.useState<Participant | null>(null);

    const groupIcon = CATALOG_INTERESTS.find((i) => group.interestIds.includes(i.id))?.icon || '👥';
    const groupCategory = group.category;
    const roleStats = getStats(group);

    const members = group.participantIds
        .map(getPersonById)
        .filter(Boolean) as Participant[];

    const sendMessage = () => {
        if (!draftMessage.trim() || membershipStatus !== 'member') return;
        onSendMessage(draftMessage.trim());
        setDraftMessage('');
    };

    const currentUserCanWrite = membershipStatus === 'member';

    return (
        <div className="bg-white rounded-2xl border border-[#D9E4EE] overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-[#EEF3F7] flex items-center justify-between gap-3">
                <button
                    onClick={onBack}
                    className="p-2 rounded-xl border border-[#D9E4EE] text-[#163A63]"
                    aria-label="Voltar para interesses e grupos"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>

                <button onClick={onOpenGroupInfo} className="flex-1 text-left">
                    <p className="text-sm font-extrabold text-[#163A63]">{group.name}</p>
                    <p className="text-[11px] text-[#5A6F82]">{group.participantIds.length} participantes</p>
                </button>

                <button
                    onClick={onOpenGroupInfo}
                    className="p-2 rounded-xl border border-[#D9E4EE] text-[#163A63]"
                    aria-label="Informacoes do grupo"
                >
                    <Info className="w-4 h-4" />
                </button>
            </div>

            {membershipStatus !== 'member' ? (
                <div className="p-5 sm:p-6 space-y-5 bg-[#FAFBFD]">
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-[#5A6F82] uppercase">{group.name.toUpperCase()}</p>
                        <p className="text-sm text-[#163A63] font-bold">{groupIcon} {groupCategory}</p>
                        <p className="text-xs text-[#5A6F82]">{group.participantIds.length} participantes</p>
                        <p className="text-sm text-[#2C3E50]">{group.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl border border-[#D9E4EE] bg-white p-3 text-center">
                            <p className="text-xs text-[#5A6F82]">Querem praticar</p>
                            <p className="text-lg font-black text-[#163A63]">{roleStats.practice}</p>
                        </div>
                        <div className="rounded-xl border border-[#D9E4EE] bg-white p-3 text-center">
                            <p className="text-xs text-[#5A6F82]">Podem ensinar</p>
                            <p className="text-lg font-black text-[#163A63]">{roleStats.teach}</p>
                        </div>
                        <div className="rounded-xl border border-[#D9E4EE] bg-white p-3 text-center">
                            <p className="text-xs text-[#5A6F82]">Querem aprender</p>
                            <p className="text-lg font-black text-[#163A63]">{roleStats.learn}</p>
                        </div>
                    </div>

                    {joinMode === 'open' ? (
                        <button
                            onClick={onJoinGroup}
                            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#163A63] text-white text-xs font-extrabold"
                        >
                            PARTICIPAR DO GRUPO
                        </button>
                    ) : (
                        <button
                            onClick={onRequestApprovalJoin}
                            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#163A63] text-white text-xs font-extrabold"
                        >
                            SOLICITAR PARTICIPACAO
                        </button>
                    )}

                    {membershipStatus === 'pending' && (
                        <p className="text-xs text-[#5A6F82]">Sua solicitacao foi enviada. Assim que aprovada, voce podera participar da conversa.</p>
                    )}
                </div>
            ) : (
                <>
                    <div className="px-4 sm:px-6 py-3 border-b border-[#EEF3F7] flex flex-wrap items-center justify-between gap-2">
                        <button
                            onClick={() => setShowParticipants(true)}
                            className="text-xs font-bold text-[#163A63] flex items-center gap-1.5"
                        >
                            <Users className="w-4 h-4 text-[#12B8AE]" />
                            {group.participantIds.length} participantes
                        </button>
                        <button
                            onClick={onCreateEvent}
                            className="px-3 py-1.5 rounded-xl border border-[#D9E4EE] text-xs font-bold text-[#163A63]"
                        >
                            Criar encontro
                        </button>
                    </div>

                    <div className="p-4 sm:p-6 space-y-4 max-h-[440px] overflow-y-auto bg-[#F9FBFC]">
                        {events.map((event) => (
                            <div key={event.id} className="rounded-2xl border border-[#B4EBE6] bg-[#F8FFFE] p-3">
                                <p className="text-xs font-extrabold text-[#163A63]">🎸 {event.title.toUpperCase()}</p>
                                <p className="text-xs text-[#2C3E50] mt-1">{event.date}</p>
                                <p className="text-xs text-[#2C3E50]">{event.location}</p>
                                <p className="text-xs text-[#5A6F82] mt-1">{event.interestedUserIds.length} interessados</p>
                                <button
                                    onClick={() => onExpressInterestInEvent(event.id)}
                                    className="mt-2 px-3 py-1.5 rounded-xl bg-[#163A63] text-white text-xs font-bold"
                                >
                                    Quero participar
                                </button>
                            </div>
                        ))}

                        {messages.map((message) => {
                            const author = getPersonById(message.userId);
                            if (!author) return null;
                            return (
                                <article key={message.id} className="rounded-2xl border border-[#D9E4EE] bg-white p-3 space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <Avatar src={author.avatarUrl} name={author.name} size="sm" />
                                            <div>
                                                <p className="text-xs font-bold text-[#163A63]">{author.name.split(' ')[0]}</p>
                                                <p className="text-[11px] text-[#5A6F82]">{message.createdAt}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#2C3E50]">{message.message}</p>
                                </article>
                            );
                        })}
                    </div>

                    <div className="px-4 sm:px-6 py-3 border-t border-[#EEF3F7] bg-white">
                        <div className="flex items-center gap-2">
                            <button
                                className="p-2 rounded-xl border border-[#D9E4EE] text-[#163A63]"
                                aria-label="Anexar"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                            <input
                                value={draftMessage}
                                onChange={(e) => setDraftMessage(e.target.value)}
                                placeholder="Escreva uma mensagem..."
                                className="flex-1 rounded-xl border border-[#D9E4EE] px-3 py-2 text-xs"
                                disabled={!currentUserCanWrite}
                            />
                            <button
                                onClick={sendMessage}
                                className="px-3 py-2 rounded-xl bg-[#12B8AE] text-[#163A63] text-xs font-extrabold"
                                disabled={!currentUserCanWrite}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        {!currentUserCanWrite && (
                            <p className="text-[11px] text-[#5A6F82] mt-2">Participe do grupo para enviar mensagens.</p>
                        )}
                    </div>
                </>
            )}

            {showParticipants && (
                <div className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-[#D9E4EE] w-full max-w-2xl max-h-[80vh] overflow-hidden">
                        <div className="px-4 py-3 border-b border-[#EEF3F7] flex items-center justify-between">
                            <h3 className="text-sm font-extrabold text-[#163A63]">Participantes</h3>
                            <button onClick={() => setShowParticipants(false)} className="text-xs text-[#5A6F82] font-bold">Fechar</button>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[58vh] overflow-y-auto">
                            {members.map((participant) => (
                                <button
                                    key={participant.id}
                                    onClick={() => setSelectedParticipant(participant)}
                                    className="text-left rounded-xl border border-[#D9E4EE] p-3 hover:bg-[#F8FAFC]"
                                >
                                    <p className="text-xs font-bold text-[#163A63]">{participant.name}</p>
                                    <p className="text-[11px] text-[#5A6F82]">{getParticipantIntentLabel(group, participant.id)}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedParticipant && (
                        <div className="fixed inset-0 z-[60] bg-black/45 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl border border-[#D9E4EE] w-full max-w-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-extrabold text-[#163A63]">Resumo do perfil</h4>
                                    <button onClick={() => setSelectedParticipant(null)} className="text-xs text-[#5A6F82] font-bold">Fechar</button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Avatar src={selectedParticipant.avatarUrl} name={selectedParticipant.name} size="lg" />
                                    <div>
                                        <p className="text-sm font-extrabold text-[#163A63]">{selectedParticipant.name}</p>
                                        <p className="text-xs text-[#5A6F82]">{selectedParticipant.city}/{selectedParticipant.state}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-[#2C3E50]">{getParticipantIntentLabel(group, selectedParticipant.id)}</p>
                                <p className="text-xs text-[#5A6F82]">
                                    Interesses em comum: {getCommonInterestsWithCurrentUser(currentUser.id, selectedParticipant.id).join(', ') || 'Sem destaque no momento'}
                                </p>
                                <div className="rounded-xl border border-[#EEF3F7] bg-[#F8FAFC] p-2 space-y-1">
                                    <p className="text-[11px] font-bold text-[#163A63]">Razoes de afinidade</p>
                                    {getConnectionReasons(currentUser, selectedParticipant).slice(0, 3).map((reason, index) => (
                                        <p key={`${reason.code}_${index}`} className="text-[11px] text-[#2C3E50]">- {reason.message}</p>
                                    ))}
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => onOpenParticipant(selectedParticipant)} className="rounded-xl border border-[#D9E4EE] py-2 text-xs font-bold text-[#163A63]">Ver perfil</button>
                                    <button onClick={() => onOpenConversationWithParticipant(selectedParticipant)} className="rounded-xl bg-[#163A63] py-2 text-xs font-bold text-white">Conectar</button>
                                    <button onClick={() => onOpenConversationWithParticipant(selectedParticipant)} className="rounded-xl bg-[#12B8AE] py-2 text-xs font-bold text-[#163A63]">Conversar</button>
                                </div>
                                <p className="text-[11px] text-[#5A6F82]">
                                    A conversa individual continua sujeita ao consentimento de conexao para proteger a privacidade.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
