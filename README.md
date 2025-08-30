# Lista de Compras 🛒️

Um aplicativo de lista de compras desenvolvido com [Expo](https://expo.dev) e React Native. Perfeito para organizar suas compras com categorização de itens e histórico de listas.

## Recursos Principais

- ✨ Interface intuitiva e fácil de usar
- 📱 Design responsivo para iOS e Android
- 🌗 Suporte a tema claro e escuro
- 📂 Categorização de itens
- 📊 Histórico de listas de compras
- 💾 Persistência de dados local
- 🎯 Sistema de anúncios AdMob integrado
- 👑 Sistema Premium para remoção de anúnciosompras �️

Um aplicativo de lista de compras desenvolvido com [Expo](https://expo.dev) e React Native. Perfeito para organizar suas compras com categorização de itens e histórico de listas.

## Recursos Principais

- ✨ Interface intuitiva e fácil de usar
- 📱 Design responsivo para iOS e Android
- 🌗 Suporte a tema claro e escuro
- 📂 Categorização de itens
- 📊 Histórico de listas de compras
- 💾 Persistência de dados local

## Como Começar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o aplicativo:
   ```bash
   npx expo start
   ```

No terminal, você encontrará opções para abrir o app em:

- [Build de desenvolvimento](https://docs.expo.dev/develop/development-builds/introduction/)
- [Emulador Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Simulador iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Estrutura do Projeto

- `/app`: Telas principais (rotas do Expo Router)
- `/components`: Componentes reutilizáveis
- `/constants`: Constantes (temas, strings, anúncios, etc.)
- `/context`: Contextos React (Premium, Theme)
- `/hooks`: Hooks personalizados (useAds, useTheme, etc.)
- `/types`: Definições de tipos TypeScript
- `/utils`: Funções utilitárias (AdManager, helpers)

## Sistema de Anúncios

O aplicativo inclui um sistema completo de anúncios Google AdMob:
- **Banners**: Exibidos no topo e rodapé das telas
- **Intersticiais**: Anúncios de tela cheia em ações específicas
- **Premium**: Sistema de remoção de anúncios para usuários premium
- **Ambientes**: Diferentes IDs para desenvolvimento e produção

📄 Ver documentação completa em [`ANUNCIOS.md`](./ANUNCIOS.md)

## Desenvolvimento

O projeto utiliza:
- [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/) para navegação
- AsyncStorage para persistência de dados

## Recursos Úteis

- [Documentação do Expo](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/docs/getting-started)
- [TypeScript](https://www.typescriptlang.org/docs/)
