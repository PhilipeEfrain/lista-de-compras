# Changelog

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
