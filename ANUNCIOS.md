# 📱 Implementação de Anúncios - Listou

## 🎯 Visão Geral

Este documento descreve a implementação completa do sistema de anúncios Google AdMob no aplicativo Listou, com diferentes configurações para ambiente de produção e desenvolvimento.

## 🔧 Configuração

### IDs de Anúncios

- **Produção**: `ca-app-pub-8227454086945331/5444973107` (apenas APK)
- **Desenvolvimento**: `ca-app-pub-3940256099942544/9214589741` (testes)

### Estrutura de Arquivos

```
constants/
  ads.ts              # Configurações e IDs dos anúncios
hooks/
  useAds.ts          # Hook personalizado para gerenciar anúncios
utils/
  AdManager.tsx      # Gerenciador de anúncios e componentes
components/
  AdBanner.tsx       # Componente de banner de anúncios
```

## 🚀 Funcionalidades Implementadas

### 1. Sistema de Ambiente
- Detecção automática entre produção e desenvolvimento
- IDs de anúncios específicos para cada ambiente
- Fallback para modo mock durante desenvolvimento

### 2. Tipos de Anúncios

#### Banners
- **Top Banner**: Tamanho padrão no topo das telas
- **Bottom Banner**: Tamanho grande no rodapé das telas
- Integração com sistema Premium (oculta para usuários premium)

#### Intersticiais
- Anúncios de tela cheia
- Triggers específicos: `save_list`, `share_whatsapp`, `view_history`, `app_background`
- Sistema de cooldown (30 segundos entre anúncios)
- Limite de 5 anúncios por sessão

### 3. Hooks Personalizados

#### `useAds()`
```typescript
const { 
  shouldShowAds,     // boolean - se deve mostrar anúncios
  adStatus,          // status dos anúncios intersticiais
  showInterstitialAd,// função para mostrar intersticial
  preloadInterstitial // função para pré-carregar
} = useAds();
```

#### `useInterstitialAd(trigger)`
```typescript
const { 
  showAd,           // função específica do trigger
  shouldShowAds,    // se deve mostrar anúncios
  adStatus          // status dos anúncios
} = useInterstitialAd('save_list');
```

## 📋 Configurações de Triggers

Os anúncios intersticiais são disparados nas seguintes ações:

1. **`save_list`**: Ao salvar uma lista no histórico
2. **`share_whatsapp`**: Ao compartilhar via WhatsApp (usuários premium)
3. **`view_history`**: Ao acessar o histórico de listas
4. **`app_background`**: Quando o app vai para segundo plano

## 🛡️ Sistema Premium

- Usuários premium **não veem anúncios**
- Verificação automática via `usePremium()` hook
- Banners são ocultados completamente
- Intersticiais são ignorados

## 🔄 Gerenciamento de Estado

### Pré-carregamento
- Anúncios intersticiais são pré-carregados automaticamente
- Novo anúncio é carregado após exibição
- Status disponível em tempo real

### Cooldown e Limites
- **Cooldown**: 30 segundos entre anúncios intersticiais
- **Limite de sessão**: 5 anúncios intersticiais por sessão
- **Auto-renovação**: Contadores são resetados no início de nova sessão

## 📱 Configuração no app.json

```json
{
  "plugins": [
    [
      "react-native-google-mobile-ads",
      {
        "android_app_id": "ca-app-pub-8227454086945331~1234567890",
        "ios_app_id": "ca-app-pub-8227454086945331~1234567890",
        "delay_app_measurement_init": true,
        "optimize_initialization": true,
        "optimize_ad_loading": true
      }
    ]
  ]
}
```

## 🐛 Debug e Logs

O sistema inclui logs detalhados para debug:

```
✅ Google Mobile Ads inicializado com sucesso
🌍 Ambiente: development
🎯 Banner ID: ca-app-pub-3940256099942544/9214589741
✅ Anúncio intersticial carregado
📱 Anúncio save_list: exibido
👑 Usuário premium - anúncio ignorado
⏭️ Anúncio intersticial não pode ser exibido agora
```

## 🏗️ Uso nos Componentes

### Banner de Anúncio
```tsx
import AdBanner from '@/components/AdBanner';

// No componente
<AdBanner placement="top" />
```

### Anúncio Intersticial
```tsx
import { useInterstitialAd } from '@/hooks/useAds';

const { showAd } = useInterstitialAd('save_list');

// Ao salvar lista
const handleSave = async () => {
  await saveList();
  await showAd(); // Mostra anúncio se aplicável
};
```

## ✅ Checklist de Implementação

- [x] Configuração de IDs por ambiente
- [x] Sistema de detecção de ambiente
- [x] Componentes de banner responsivos
- [x] Sistema de anúncios intersticiais
- [x] Hooks personalizados
- [x] Integração com sistema Premium
- [x] Cooldown e limites de anúncios
- [x] Logs para debug
- [x] Configuração no app.json
- [x] Integração nas telas principais
- [x] Fallback para desenvolvimento
- [x] Pré-carregamento automático
- [x] Tratamento de erros

## 🚀 Próximos Passos

1. **Testes**: Testar em builds de desenvolvimento e produção
2. **Métricas**: Implementar analytics de performance dos anúncios
3. **A/B Testing**: Testar diferentes posicionamentos de anúncios
4. **Otimização**: Ajustar frequência baseada em dados de usuário

## 📊 Monitoramento

Para monitorar a performance dos anúncios:

```typescript
// Verificar status
const status = InterstitialAdManager.getStatus();
console.log('Status dos anúncios:', status);

// Log de métricas
console.log(`Anúncios exibidos na sessão: ${status.sessionCount}`);
console.log(`Pode exibir anúncio: ${status.canShow}`);
```
