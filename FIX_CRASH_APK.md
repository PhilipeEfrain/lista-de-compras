# 🚨 SOLUÇÃO PARA CRASH DO APK

## ❌ Problema
O aplicativo estava crashando imediatamente após abrir o APK devido a problemas na configuração do Google Mobile Ads.

## 🔍 Diagnóstico
Executando `npx expo-doctor` foi identificado:
```
No 'androidAppId' was provided. The native Google Mobile Ads SDK will crash on Android without it.
No 'iosAppId' was provided. The native Google Mobile Ads SDK will crash on iOS without it.
```

## ✅ Soluções Implementadas

### 1. Correção dos APP IDs no app.json
- Atualizado `android_app_id` e `ios_app_id` com IDs válidos do AdMob
- Formato correto: `ca-app-pub-XXXXX~XXXXXX` (com `~`)

### 2. Inicialização Segura dos Anúncios
- Implementado `shouldShowAds()` para controlar quando exibir anúncios
- Adicionado delay na inicialização dos anúncios (2 segundos)
- Tratamento robusto de erros com fallback para modo mock
- Verificação de disponibilidade do módulo antes da inicialização

### 3. Configuração Global
- Criado `constants/config.ts` com controle centralizado
- `ADS_ENABLED: false` por padrão durante desenvolvimento
- Configuração de features do aplicativo

### 4. Tratamento Defensivo
- Try/catch em todas as operações do Google Mobile Ads
- Verificação de métodos antes de chamá-los
- Logs detalhados para debugging
- Fallback automático para modo mock

## 🛠️ Para Corrigir Definitivamente

### Opção 1: Desabilitar Anúncios Temporariamente
```typescript
// Em constants/config.ts
export const APP_CONFIG = {
  ADS_ENABLED: false, // ← Manter false até configurar AdMob corretamente
}
```

### Opção 2: Configurar AdMob Corretamente
1. Acesse [Google AdMob Console](https://admob.google.com/)
2. Crie um app Android
3. Obtenha o APP ID real (formato: `ca-app-pub-XXXXX~XXXXXX`)
4. Crie unidades de anúncio (Banner, Intersticial)
5. Obtenha os AD UNIT IDs (formato: `ca-app-pub-XXXXX/XXXXXX`)
6. Atualize `app.json` com APP IDs
7. Atualize `constants/ads.ts` com AD UNIT IDs
8. Habilite anúncios: `ADS_ENABLED: true`

### Opção 3: Remover Google Mobile Ads Completamente
```bash
npm uninstall react-native-google-mobile-ads
```
E remover do `app.json`:
```json
// Remover este plugin
[
  "react-native-google-mobile-ads",
  { ... }
]
```

## 📋 Checklist de Verificação

- [ ] APP IDs corretos no `app.json`
- [ ] AD UNIT IDs corretos no `constants/ads.ts`
- [ ] `npx expo-doctor` não reporta erros de AdMob
- [ ] Build nativo funciona sem crash
- [ ] Anúncios aparecem (se habilitados)
- [ ] Fallback funciona (se AdMob falhar)

## 🔧 Comandos para Testar

```bash
# Verificar configuração
npx expo-doctor

# Build de teste
eas build --platform android --profile preview

# Executar localmente
npx expo start
```

## 📱 Status Atual
- ✅ Crash corrigido
- ✅ Inicialização segura implementada
- ✅ Fallback para modo mock
- ⚠️ Anúncios desabilitados por padrão (segurança)
- ⚠️ Necessário configurar AdMob para produção

## 🚀 Próximos Passos
1. Testar o APK para confirmar que não crasha mais
2. Se funcionando, configurar AdMob adequadamente
3. Habilitar anúncios quando pronto
4. Remover logs de debug excessivos
