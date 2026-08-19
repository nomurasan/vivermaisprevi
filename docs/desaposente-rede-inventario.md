# Inventário Técnico Pré-Implementação

Data: 2026-08-19
Escopo: Evolução incremental da área **Desaposente sua Rede** (sem recriar projeto)

## 1) Framework utilizado
- Frontend: React 19 + TypeScript + Vite 6
- Estilo: Tailwind CSS 4 (via `@import "tailwindcss"`)
- Ícones: `lucide-react`
- Gráficos existentes: `recharts`
- Estado global: Context API em `src/context/AppContext.tsx`

## 2) Componentes existentes relevantes
- `src/views/DesaposenteRedeView.tsx` (área principal atual)
- `src/components/DesaposenteMessenger.tsx` (conversas)
- `src/components/Avatar.tsx`
- `src/components/PrevixAssistant.tsx`
- `src/components/ToastNotification.tsx`

## 3) Estrutura de rotas/navegação atual
- Navegação principal por estado (`currentView`) no `AppContext` + `switch` em `src/App.tsx`
- Entrada da área em `currentView = 'desaposente_rede'`
- Navegação interna da área hoje é local em `DesaposenteRedeView` via `currentStep`:
  - `landing`
  - `wizard`
  - `reward`
  - `connections`
  - `messenger`

## 4) Componentes reutilizáveis identificados
- `Avatar` para cards de pessoas e nós do grafo (detalhes)
- `DesaposenteMessenger` para Conversas & Conexões
- Padrões de card/layout/tags já consolidados na própria `DesaposenteRedeView`

## 5) Padrão visual atual
- Identidade PREVI preservada:
  - azul institucional (`#163A63`, variações)
  - turquesa (`#12B8AE`)
  - fundo claro (`#F4F7FA`)
  - cards arredondados e visual clean
- Tipografia e escala visual já coerentes com restante do sistema

## 6) Bibliotecas já instaladas
- React, React DOM, TypeScript, Vite
- Tailwind CSS
- lucide-react
- recharts
- motion
- express/dotenv (camada de servidor mock)
- Sem biblioteca de grafo dedicada instalada no momento

## 7) Estrutura atual de cadastro/perfil
- Perfil expandido em `ParticipantExpandedProfile` (`src/types/index.ts`)
- Dados atuais:
  - interesses + papéis (`roles`)
  - conhecimentos compartilháveis
  - desejos de aprendizagem
  - atividades a retomar
  - experimentações
  - preferências de conexão
  - disponibilidade
  - privacidade (booleans)
  - trajetória profissional (`trajectory`)

## 8) Forma atual de armazenamento de dados do usuário
- Em memória no estado React (`AppContext`) durante execução
- Fonte inicial vinda de mocks em `src/mock/*`
- Sem persistência real em banco nesta versão

## 9) Integração com Supabase/outra camada de dados
- Não há integração ativa com Supabase neste estado
- `src/services/api.ts` já declara camada preparada para futura API/Supabase
- Regras de afinidade em `src/services/affinityEngine.ts` (cliente/mocks)

## 10) Componentes atuais da área Desaposente sua Rede
- Tudo centralizado em `src/views/DesaposenteRedeView.tsx`
- `DesaposenteMessenger` integrado como subfluxo para mensagens
- Motor de afinidade já gera recomendações por:
  - interesses em comum
  - complementaridade aprender/ensinar
  - sobreposição de trajetória
  - localização/disponibilidade

## 11) Arquivos previstos para alteração
- `src/views/DesaposenteRedeView.tsx`
- `src/types/index.ts`
- `src/mock/interestsCatalog.ts`
- `src/services/affinityEngine.ts` (ou serviço novo de rede)
- `package.json` (apenas se biblioteca de grafo for necessária)

## 12) Novos componentes sugeridos (incrementais)
- `src/components/desaposente/ProfileNow.tsx`
- `src/components/desaposente/ProfileCompletion.tsx`
- `src/components/desaposente/RecommendedPeople.tsx`
- `src/components/desaposente/InterestGroups.tsx`
- `src/components/desaposente/NetworkGraph.tsx`
- `src/components/desaposente/GraphNodeDetails.tsx`

## 13) Tabelas existentes reaproveitáveis (conceitualmente)
Como não há banco ativo, o equivalente atual em memória/mocks:
- `usuarios` -> `Participant`
- `trajetoria_profissional` -> `FunctionalTrajectoryItem[]`
- `interesses` -> `CATALOG_INTERESTS`
- `usuario_interesses` -> `ParticipantInterestItem[]`
- `conexoes/mensagens` -> `PeerConversation` e `PeerChatMessage`

## 14) Novas tabelas potencialmente necessárias (futuro)
Somente quando houver persistência real:
- `grupos`
- `grupo_participantes`
- `usuario_interesses` com colunas explícitas de intenção
- `conexoes` estruturadas por status
- `mensagens` persistidas

## 15) Bibliotecas necessárias (avaliação)
- Candidato principal para grafo force-directed: `d3-force` (leve e compatível)
- Alternativa sem nova dependência: layout simplificado manual em SVG (menos robusto)
- Decisão proposta: `d3-force` para atender interações pedidas com menor custo

## 16) Riscos técnicos
- `DesaposenteRedeView.tsx` é grande; refatoração exige cuidado para evitar regressão
- Dados hoje são em memória; sem persistência entre sessões
- Novas regras de recomendação podem conflitar com regras legadas se não centralizadas
- Grafo com muitos nós pode afetar performance em mobile (mitigar por níveis progressivos)

## 17) Dependências/integrações encontradas
- Context global (`AppContext`) é o ponto central de leitura/escrita de perfil e conexões
- `affinityEngine` já entrega base de recomendação e pode ser estendido
- `DesaposenteMessenger` já suporta aceitação de conexão e troca de mensagens

## Plano de execução incremental
1. Reorganizar navegação interna da área para 5 seções solicitadas
2. Evoluir "Meu Perfil de Agora" com bloco Sobre mim + trajetória + interesses com intenção
3. Criar recomendação explicável com função central de motivos
4. Criar área Interesses & Grupos com filtros e chamadas de formação
5. Implementar Minha Constelação (grafo + alternativa em lista)
6. Validar responsividade, acessibilidade e TypeScript
