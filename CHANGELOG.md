# Changelog

## [2.0.2] - 2025-08-30

### Corrigido
- Correção crítica de crashes em builds nativos
- Configuração adequada dos IDs de aplicativo Google AdMob no `app.json`
- Melhoria na inicialização defensiva do Google Mobile Ads SDK
- Tratamento robusto de erros na criação de anúncios intersticiais
- Verificações de segurança adicionais para módulos não disponíveis
- Atualização da dependência `@react-navigation/drawer` para versão mais recente

### Melhorado
- Sistema de fallback aprimorado para modo mock
- Logs mais detalhados para troubleshooting
- Validação de componentes antes da inicialização
- Gerenciamento de estado mais seguro para anúncios intersticiais

### Técnico
- Implementação de verificações de nulidade no AdManager
- Melhor separação entre modo desenvolvimento e produção
- IDs de teste corretos configurados para evitar crashes

## [2.0.1] - 2025-08-30

### Corrigido
- Correção dos IDs de aplicativo do Google AdMob no `app.json`
- Implementação de fallback robusto para desenvolvimento sem Google Mobile Ads
- Melhoria na tipagem TypeScript do sistema de anúncios
- Tratamento adequado de erros na inicialização dos anúncios
- Logs mais informativos para debug do sistema de anúncios

### Adicionado
- Documentação detalhada sobre configuração do Google AdMob (`CONFIGURACAO_ADMOB.md`)
- Sistema de detecção de ambiente mais robusto
- Validação de disponibilidade do módulo Google Mobile Ads
- Status detalhado dos anúncios intersticiais

## [2.0.0] - 2025-08-30

### Adicionado
- **Sistema completo de anúncios Google AdMob**
  - Banners superiores e inferiores nas telas principais
  - Anúncios intersticiais em ações específicas (salvar lista, compartilhar, visualizar histórico)
  - Sistema de cooldown (30 segundos entre anúncios intersticiais)
  - Limite de anúncios por sessão (máximo 5 intersticiais)
  - Pré-carregamento automático de anúncios

- **Configuração por ambiente**
  - IDs de teste para desenvolvimento (Google AdMob oficial)
  - IDs de produção configuráveis
  - Detecção automática de ambiente (`__DEV__`)
  - Fallback para modo mock durante desenvolvimento

- **Hooks personalizados para anúncios**
  - `useAds()` - Hook principal para gerenciamento de anúncios
  - `useInterstitialAd(trigger)` - Hook específico para anúncios intersticiais
  - Status em tempo real dos anúncios
  - Controle automático baseado no status Premium

- **Sistema de triggers para anúncios intersticiais**
  - `save_list` - Ao salvar lista no histórico
  - `share_whatsapp` - Ao compartilhar via WhatsApp (usuários premium)
  - `view_history` - Ao acessar o histórico
  - `app_background` - Quando app vai para segundo plano

- **Integração com sistema Premium**
  - Anúncios completamente removidos para usuários premium
  - Verificação automática do status premium
  - Mensagens promocionais para upgrade premium

- **Componentes de anúncios**
  - `AdBanner` - Componente reutilizável para banners
  - `TopBannerAd` e `BottomBannerAd` - Componentes específicos
  - Integração responsiva com o tema atual
  - Fallback visual durante carregamento

### Modificado
- Atualização da versão do aplicativo para 2.0.0
- Integração de anúncios nas telas principais (`index.tsx`, `history.tsx`)
- Melhoria na tipagem TypeScript em todos os componentes de anúncios
- Atualização do `app.json` com configurações do Google Mobile Ads
- Refatoração do sistema de inicialização de anúncios

### Adicionado - Documentação
- `ANUNCIOS.md` - Documentação completa do sistema de anúncios
- `CONFIGURACAO_ADMOB.md` - Guia detalhado para configuração do Google AdMob
- Atualização do `README.md` com informações sobre anúncios
- Logs detalhados para debug e monitoramento

### Técnico
- Configuração do plugin `react-native-google-mobile-ads` no Expo
- Sistema de gerenciamento de estado para anúncios
- Tratamento robusto de erros e fallbacks
- Otimizações de performance com pré-carregamento
- Suporte completo ao desenvolvimento em Expo Go (modo mock)

## [1.2.2] - 2025-08-28

### Modificado
- Padronizados os espaçamentos e margens de todos os elementos seguindo o box de total gasto
- Reorganizado o layout dos itens da lista com valor total em negrito na linha abaixo
- Ajustada a exibição de informações de peso para maior clareza
- Melhorada a consistência visual em toda a aplicação

## [1.2.1] - 2025-08-28

### Adicionado
- Campo de filtro entre o box de valor total e a lista de compras
- Sistema de acordeão (accordion) para categorias, permitindo expandir ou colapsar cada categoria
- Indicador visual do número de itens por categoria

### Modificado
- Melhorada a organização visual das categorias com ícones e contadores
- Integração do filtro de busca com a lista de itens para pesquisa mais rápida
- Refatoração do código para melhor manutenção e tipagem TypeScript

### Corrigido
- Melhorado o sistema de compartilhamento via WhatsApp usando o formato universal (https://wa.me)
- Tratamento de tipos TypeScript em funções de redução e inicialização

## [1.2.0] - 2025-08-26

### Adicionado
- Instruções para o GitHub Copilot em `.github/copilot/instructions.md`
- Nova navegação baseada em Tabs (`app/(tabs)/index.tsx`, refatoração de `_layout.tsx`)
- Suporte aprimorado ao compartilhamento via WhatsApp
- Novos estilos e componentes para exibição de estatísticas e gráficos simplificados

### Modificado
- Refatoração de `app/index.tsx` para simplificar lógica, melhorar integração com WhatsApp e remover dependências de gráficos nativos
- Refatoração de `app/history.tsx` para usar novo sistema de estilos e simplificação de código
- Atualização de `components/styles.tsx` com novos estilos para estatísticas e histórico
- Ajustes em `constants/Strings.ts` para melhor suporte a internacionalização e mensagens de compartilhamento
- Ajustes em `constants/theme.ts` para simplificação e padronização de cores

### Removido
- Dependências e código de gráficos nativos substituídos por visualização customizada

### Corrigido
- Pequenas correções de layout e navegação
- Melhorias na experiência de compartilhamento e feedback visual

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2025-08-26

### Modificado
- Simplificação da entrada de quantidade
  - Removida a regra de formatação com zero à esquerda
  - Quantidade padrão é 1 quando não preenchida
  - Input de quantidade com tamanho e estilo otimizados
  - Melhor experiência de digitação para o usuário

- Melhorias no tema escuro
  - Cores em tons pastéis para melhor contraste
  - Ajuste nas cores dos inputs para seguir o tema
  - Correção nas cores dos placeholders
  - Melhor legibilidade dos textos

- Ajustes de interface
  - Redução do espaçamento entre botões de ação
  - Simplificação da exibição do valor total
  - Correção do posicionamento do botão de adicionar item
  - Melhoria no layout dos inputs

### Corrigido
- Erro de duplicação do botão de adicionar item
- Posicionamento incorreto do botão central na tela vazia
- Problemas de cor no tema escuro nos inputs
- Quebra de layout com textos muito longos

## [1.0.0] - 2025-08-25

### Adicionado
- Sistema de tema claro/escuro
  - Contexto de tema com provider
  - Suporte a cores personalizadas para cada tema
  - Adaptação de todos os componentes para suportar temas
  - Cores pastéis no tema escuro para melhor contraste

- Sistema de Categorias
  - Picker personalizado para seleção de categorias
  - Ícones específicos para cada categoria
  - Agrupamento de itens por categoria

- Interface do Usuário
  - Modal para adicionar novos itens
  - Modal para confirmar preço e quantidade
  - Botão de adicionar item adaptável (centralizado quando lista vazia)
  - Indicadores visuais para itens obtidos/faltantes

- Funcionalidades de Lista
  - Adição de itens com nome e categoria
  - Marcação de itens como obtidos (com preço e quantidade)
  - Marcação de itens como faltantes
  - Cálculo automático do total gasto
  - Opção de manter apenas itens faltantes
  - Salvamento automático de alterações

- Histórico de Listas
  - Salvamento de listas completas
  - Visualização de listas antigas
  - Reutilização de listas antigas
  - Título personalizado para cada lista
  - Data e valor total por lista
  - Organização por categorias no histórico
  - Opção de apagar listas individualmente
  - Opção de apagar todo o histórico

- Visualização de Dados
  - Gráfico de gastos por categoria
  - Gráfico dos 5 produtos mais caros
  - Gráfico de pizza para distribuição de itens
  - Adaptação dos gráficos ao tema atual

### Melhorado
- Experiência do usuário
  - Feedback visual para todas as ações
  - Confirmações antes de ações destrutivas
  - Navegação intuitiva entre telas
  - Animações suaves nos modais
  - Layout responsivo e adaptável

### Corrigido
- Ajuste no tamanho dos gráficos para não ultrapassar a tela
- Correção nas cores do tema escuro para melhor legibilidade
- Ajuste no espaçamento e alinhamento dos elementos
- Tratamento adequado de erros com mensagens amigáveis

### Segurança
- Validação de dados antes do salvamento
- Tratamento de erros no armazenamento local
- Proteção contra ações acidentais do usuário
