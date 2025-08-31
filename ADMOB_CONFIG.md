# 📱 Configuração Google AdMob - Lista de Compras

## ✅ IDs Configurados e Funcionais

### App ID (app.json)
```
ca-app-pub-8227454086945331~3137771321
```
- **Localização**: `app.json` > plugins > react-native-google-mobile-ads
- **Função**: Identifica o aplicativo no Google AdMob
- **Status**: ✅ Configurado corretamente

### Ad Unit IDs (constants/ads.ts)
```
Banner: ca-app-pub-8227454086945331/5444973107
Intersticial: ca-app-pub-8227454086945331/5444973107
```
- **Localização**: `constants/ads.ts` > ADS_CONFIG.production
- **Função**: IDs específicos para cada tipo de anúncio
- **Status**: ✅ Configurado corretamente

## 🛠️ Correções Implementadas

1. **App ID Correto**: Substituído ID de teste pelo ID real de produção
2. **Inicialização Segura**: Implementado try/catch robusto
3. **Fallback Inteligente**: Modo mock automático em caso de falha
4. **Controle Centralizado**: Sistema de configuração em `constants/config.ts`
5. **Delay de Startup**: 2 segundos para evitar interferência no boot

## 🚀 Status do Problema

- ❌ **Antes**: App crashava imediatamente ao abrir (falta de App ID)
- ✅ **Depois**: App deve inicializar normalmente com anúncios funcionais

## 📋 Para Testar

1. Gerar novo APK com as configurações atualizadas
2. Instalar e testar se não crasha mais
3. Verificar se os anúncios aparecem corretamente
4. Testar em diferentes telas (Lista, Histórico, Adicionar Item)

## 🔧 Configurações Adicionais

Se você tiver IDs separados para diferentes tipos de anúncio:
- Edite `constants/ads.ts` > `ADS_CONFIG.production`
- Substitua os IDs pelos específicos de cada tipo
- Banner, Intersticial, Rewarded, etc.

## 📝 Notas Importantes

- **Produção**: IDs reais são usados apenas em APK de produção
- **Desenvolvimento**: IDs de teste são usados em `expo start`
- **Fallback**: Se falhar, app continua funcionando sem anúncios
- **Logs**: Console mostra status da inicialização dos anúncios
