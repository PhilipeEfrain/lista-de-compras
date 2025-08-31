/**
 * Configurações gerais do aplicativo
 */

export const APP_CONFIG = {
  // Controle de anúncios
  ADS_ENABLED: true, // Habilitado agora que temos o App ID correto
  
  // Configurações de debug
  DEBUG_MODE: __DEV__,
  
  // Outras configurações
  APP_VERSION: '2.0.2',
  
  // Configurações de funcionalidades
  FEATURES: {
    HISTORY: true,
    CATEGORIES: true,
    ANALYTICS: true,
    SHARING: true,
  }
};

// Função para verificar se os anúncios devem estar habilitados
export const shouldShowAds = (): boolean => {
  // Em desenvolvimento, nunca mostrar anúncios
  if (__DEV__) {
    return false;
  }
  
  // Em produção, verificar a configuração
  return APP_CONFIG.ADS_ENABLED;
};

// Log de configuração
console.log('📱 Configurações da aplicação:', {
  adsEnabled: APP_CONFIG.ADS_ENABLED,
  debugMode: APP_CONFIG.DEBUG_MODE,
  shouldShowAds: shouldShowAds(),
  environment: __DEV__ ? 'development' : 'production'
});
