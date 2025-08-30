# 🆔 Como Configurar IDs do Google AdMob

## 📋 Tipos de IDs Necessários

### 1. APP IDs (IDs do Aplicativo)
- **Localização**: `app.json` → plugins → react-native-google-mobile-ads
- **Formato**: `ca-app-pub-XXXXX~YYYYYYY` (com ~)
- **Função**: Identificam seu aplicativo no AdMob
- **Necessário para**: Inicializar o SDK do Google Mobile Ads

### 2. AD UNIT IDs (IDs das Unidades de Anúncio)
- **Localização**: `constants/ads.ts`
- **Formato**: `ca-app-pub-XXXXX/YYYYYYY` (com /)
- **Função**: Identificam cada anúncio específico
- **Tipos**: Banner, Intersticial, Rewarded, etc.

## 🏗️ Como Obter os IDs Reais

### Passo 1: Criar Conta no Google AdMob
1. Acesse [https://admob.google.com](https://admob.google.com)
2. Faça login com sua conta Google
3. Complete o processo de cadastro

### Passo 2: Criar Aplicativo
1. No dashboard do AdMob, clique em "Apps"
2. Clique em "Add app"
3. Escolha "Add your app manually" se ainda não está publicado
4. Preencha as informações:
   - Nome do app: "Listou"
   - Plataforma: Android e/ou iOS
   - Categoria: Shopping

### Passo 3: Obter APP ID
1. Após criar o app, você verá o **App ID**
2. Formato: `ca-app-pub-1234567890~0987654321`
3. **Este ID vai no app.json**

### Passo 4: Criar Unidades de Anúncio
1. Dentro do seu app no AdMob, clique em "Ad units"
2. Clique em "Add ad unit"
3. Escolha o tipo:
   - **Banner** para anúncios no topo/rodapé
   - **Interstitial** para anúncios de tela cheia
4. Configure as opções
5. Obtenha os **Ad unit IDs**

## ⚙️ Configuração no Projeto

### 1. Atualizar app.json
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "android_app_id": "ca-app-pub-SEU_ID_AQUI~APP_ID_ANDROID",
          "ios_app_id": "ca-app-pub-SEU_ID_AQUI~APP_ID_IOS"
        }
      ]
    ]
  }
}
```

### 2. Atualizar constants/ads.ts
```typescript
const ADS_CONFIG = {
  production: {
    bannerId: 'ca-app-pub-SEU_ID_AQUI/BANNER_UNIT_ID',
    interstitialId: 'ca-app-pub-SEU_ID_AQUI/INTERSTITIAL_UNIT_ID',
  }
};
```

## 🧪 IDs de Teste (Atuais)

### APP IDs de Teste (no app.json)
- **Android**: `ca-app-pub-3940256099942544~3347511713`
- **iOS**: `ca-app-pub-3940256099942544~1458002511`

### AD UNIT IDs de Teste (no ads.ts)
- **Banner**: `ca-app-pub-3940256099942544/9214589741`
- **Intersticial**: `ca-app-pub-3940256099942544/1033173712`

## ⚠️ Avisos Importantes

### 1. IDs de Teste vs Produção
- **Desenvolvimento**: Use sempre IDs de teste
- **Produção**: Use seus IDs reais do AdMob
- **Nunca misture**: IDs de teste em produção ou vice-versa

### 2. Builds Necessários
- **Expo Go**: Não suporta anúncios nativos (sempre modo mock)
- **Development Build**: Suporta anúncios de teste
- **Production Build**: Usa anúncios reais

### 3. Processo de Aprovação
1. Configure com IDs de teste
2. Teste completamente
3. Substitua por IDs reais
4. Faça build de produção
5. Publique na loja
6. Aguarde aprovação do AdMob (pode levar dias)

## 🚀 Próximos Passos

1. **Agora (Desenvolvimento)**:
   - ✅ IDs de teste configurados
   - ✅ Modo mock funcionando
   - ✅ Sistema pronto para testes

2. **Antes da Produção**:
   - 📝 Criar conta AdMob
   - 📝 Obter APP IDs reais
   - 📝 Criar unidades de anúncio
   - 📝 Atualizar configurações
   - 📝 Fazer build de produção
   - 📝 Testar em dispositivo real

## 🔧 Comandos Úteis

```bash
# Limpar cache e reinstalar
expo r -c

# Build de desenvolvimento
eas build --platform android --profile development

# Build de produção
eas build --platform android --profile production
```

## 📞 Suporte

Se você tiver dúvidas sobre:
- Criação da conta AdMob
- Configuração de unidades de anúncio
- Processo de aprovação

Consulte a [documentação oficial do Google AdMob](https://developers.google.com/admob).
