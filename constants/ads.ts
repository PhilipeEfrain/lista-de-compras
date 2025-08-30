

/*
 * CONFIGURAÇÃO DE ANÚNCIOS GOOGLE ADMOB
 * 
 * IMPORTANTE: Existem dois tipos de IDs diferentes:
 * 
 * 1. APP IDs (configurados no app.json):
 *    - Formato: ca-app-pub-XXXXX~YYYYYYY (note o ~)
 *    - Identificam o aplicativo no AdMob
 *    - Necessários para inicializar o SDK
 *    - Configurados nos plugins do app.json
 * 
 * 2. AD UNIT IDs (configurados aqui):
 *    - Formato: ca-app-pub-XXXXX/YYYYYYY (note a /)
 *    - Identificam cada anúncio específico (banner, intersticial, etc.)
 *    - Usados nos componentes de anúncio
 *    - Configurados neste arquivo
 * 
 * Para produção, você precisa:
 * 1. Criar uma conta no Google AdMob
 * 2. Criar um aplicativo e obter o APP ID
 * 3. Criar unidades de anúncio e obter os AD UNIT IDs
 * 4. Atualizar both app.json (APP IDs) e este arquivo (AD UNIT IDs)
 */

// IDs dos anúncios para diferentes ambientes
const ADS_CONFIG = {
  // Produção (só pode ser usado em APK)
  production: {
    // SUBSTITUA pelos seus IDs reais de unidades de anúncio do AdMob
    bannerId: 'ca-app-pub-8227454086945331/5444973107',
    interstitialId: 'ca-app-pub-8227454086945331/5444973107', // Você deve criar IDs diferentes para cada tipo
  },
  // Desenvolvimento e testes (IDs oficiais de teste do Google)
  development: {
    bannerId: 'ca-app-pub-3940256099942544/9214589741',
    interstitialId: 'ca-app-pub-3940256099942544/1033173712',
  }
};

// Função para detectar o ambiente
export const getEnvironment = (): 'production' | 'development' => {
  // Em desenvolvimento, sempre usar teste
  if (__DEV__) {
    return 'development';
  }
  
  // Em build de produção (quando não é desenvolvimento)
  return 'production';
};

// Configuração dos anúncios baseada no ambiente
export const ADS_IDS = ADS_CONFIG[getEnvironment()];

// Configurações gerais dos anúncios
export const ADS_SETTINGS = {
  // Tempo mínimo entre anúncios intersticiais (em segundos)
  interstitialCooldown: 30,
  // Máximo de anúncios intersticiais por sessão
  maxInterstitialsPerSession: 5,
  // Ações que podem disparar anúncios intersticiais
  interstitialTriggers: [
    'save_list',
    'share_whatsapp',
    'view_history',
    'app_background'
  ],
};

// Log para debug
console.log(`🎯 Ambiente detectado: ${getEnvironment()}`);
console.log(`📱 IDs de anúncios: ${JSON.stringify(ADS_IDS)}`);
