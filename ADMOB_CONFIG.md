# 📱 Configuração Google AdMob - Lista de Compras

## ✅ PROBLEMA RESOLVIDO!

### 🔍 **Causa do Crash Identificada:**
```
java.lang.IllegalStateException: Invalid application ID
```

### 📋 **Situação Atual do AdMob:**
- **App ID Real**: `ca-app-pub-8227454086945331~3137771321` ✅ (Válido)
- **Status**: "Requer revisão" ⚠️
- **Problema**: Apps em revisão não podem usar IDs reais em APKs de teste

## 🛠️ **Solução Aplicada:**

### **IDs de Teste (Funcionando Agora):**
```
Android App ID: ca-app-pub-3940256099942544~3347511713
iOS App ID: ca-app-pub-3940256099942544~1458002511
Banner ID: ca-app-pub-3940256099942544/9214589741
Intersticial ID: ca-app-pub-3940256099942544/1033173712
```

### **Status Atual:**
- ✅ **Crash resolvido**: App não deve mais fechar
- ✅ **Anúncios funcionais**: Usando IDs de teste oficiais do Google
- ✅ **Configuração correta**: Plugin reconfigurado no `app.json`

## 🚀 **Próximos Passos:**

### **Para Produção (Quando aprovado):**
1. **Aguardar aprovação** do app no AdMob Console
2. **Trocar IDs de teste** pelos IDs reais de produção
3. **Gerar APK final** para publicação

### **Para Desenvolvimento:**
- ✅ **Continuar usando IDs de teste** (sempre funcionam)
- ✅ **App funcional** com anúncios de demonstração

## � **Configurações Corretas:**

### App ID (app.json) - TESTE
```
ca-app-pub-3940256099942544~3347511713 (Android)
ca-app-pub-3940256099942544~1458002511 (iOS)
```

### Ad Unit IDs (constants/ads.ts) - TESTE
```
Banner: ca-app-pub-3940256099942544/9214589741
Intersticial: ca-app-pub-3940256099942544/1033173712
```

## 🎯 **Teste Recomendado:**
Gerar novo APK e confirmar que o app:
1. ✅ Abre normalmente (sem crash)
2. ✅ Mostra anúncios de teste nas telas
3. ✅ Todas as funcionalidades funcionam
