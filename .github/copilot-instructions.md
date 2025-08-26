# Instruções para o GitHub Copilot

## Visão Geral do Projeto
Este é um aplicativo de Lista de Compras desenvolvido com React Native e Expo. O aplicativo permite aos usuários criar e gerenciar listas de compras, com recursos de categorização, histórico e análise de gastos.

## Estrutura do Projeto
- `/app`: Contém as telas principais do aplicativo (rotas do Expo Router)
- `/components`: Componentes reutilizáveis
- `/constants`: Constantes do aplicativo (temas, strings, etc.)
- `/context`: Contextos React (ThemeContext, etc.)
- `/hooks`: Hooks personalizados
- `/types`: Definições de tipos TypeScript
- `/utils`: Funções utilitárias

## Convenções de Código

### Nomenclatura
- Componentes: PascalCase (ex: `CategoryPicker.tsx`)
- Arquivos de utilitários: camelCase (ex: `themeUtils.ts`)
- Constantes: UPPER_SNAKE_CASE (ex: `APP_TITLE`)
- Tipos/Interfaces: PascalCase com prefixo I para interfaces (ex: `ITheme`)

### Padrões de Estado
- Use hooks do React para gerenciamento de estado
- Prefira `useState` para estado local
- Use `useContext` para estado global (tema)
- Use `AsyncStorage` para persistência de dados

### Estilização
- Defina estilos usando `StyleSheet.create`
- Use o tema atual através do hook `useTheme`
- Mantenha consistência com as cores do tema
- Evite cores hardcoded, use as do tema

### Strings
- Todas as strings devem estar em `/constants/Strings.ts`
- Use constantes para todas as mensagens visíveis ao usuário
- Mantenha as strings organizadas por categoria

## Componentes Principais

### Lista de Compras
- Mantenha a lógica de CRUD de itens em `index.tsx`
- Use modais para interações complexas
- Implemente validações apropriadas

### Histórico
- Mantenha a funcionalidade de histórico em `history.tsx`
- Implemente ordenação por data mais recente
- Permita reutilização de listas antigas

### Temas
- Mantenha consistência com o sistema de temas
- Use cores apropriadas para modo claro/escuro
- Garanta bom contraste em ambos os temas

## Persistência de Dados
- Use `@shopping_list` para a lista atual
- Use `@shopping_history` para o histórico
- Mantenha a estrutura de dados consistente

## Tratamento de Erros
- Sempre use try/catch com AsyncStorage
- Forneça feedback visual para erros
- Use as mensagens de erro definidas em Strings.ts

## Performance
- Evite re-renders desnecessários
- Use `useMemo` e `useCallback` quando apropriado
- Otimize listas longas com `FlatList`

## Acessibilidade
- Mantenha bom contraste de cores
- Use tamanhos de fonte adequados
- Forneça feedback tátil quando apropriado

## Ao Fazer Alterações
1. Mantenha a consistência com o código existente
2. Atualize o CHANGELOG.md
3. Teste em ambos os temas (claro/escuro)
4. Verifique a persistência dos dados
5. Garanta que as mensagens ao usuário sejam claras
6. Mantenha a responsividade da interface

## Recursos e Dependências
- React Native
- Expo
- AsyncStorage para persistência
- React Navigation para roteamento
- React Native Vector Icons para ícones
- React Native Charts Kit para gráficos
