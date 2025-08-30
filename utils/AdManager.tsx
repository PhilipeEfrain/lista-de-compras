import { ADS_IDS, ADS_SETTINGS, getEnvironment } from '@/constants/ads';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Tipos para Google Mobile Ads
interface GoogleMobileAdsModule {
  default: () => {
    initialize: () => Promise<void>;
  };
  BannerAd: React.ComponentType<any>;
  BannerAdSize: {
    BANNER: string;
    LARGE_BANNER: string;
  };
  InterstitialAd: {
    createForAdRequest: (unitId: string) => any;
  };
  AdEventType: {
    LOADED: string;
    ERROR: string;
    CLOSED: string;
  };
}

// Variáveis para Google Mobile Ads
let GoogleMobileAdsModule: GoogleMobileAdsModule | null = null;
let isAdsAvailable = false;

// Tentar importar Google Mobile Ads
try {
  GoogleMobileAdsModule = require('react-native-google-mobile-ads') as GoogleMobileAdsModule;
  isAdsAvailable = true;
  console.log('📱 Google Mobile Ads módulo carregado');
} catch (error) {
  console.warn('⚠️ Google Mobile Ads não disponível, usando modo mock');
  isAdsAvailable = false;
}

// Inicialização do Google Mobile Ads
let isInitialized = false;

export const initializeAds = async (): Promise<void> => {
  if (isInitialized) return;
  
  console.log(`🚀 Inicializando anúncios - Ambiente: ${getEnvironment()}`);
  
  if (!isAdsAvailable || !GoogleMobileAdsModule) {
    console.log('📝 Modo mock ativado - Google Mobile Ads não disponível');
    isInitialized = true;
    return;
  }
  
  try {
    // Verificação adicional para builds nativos
    const MobileAds = GoogleMobileAdsModule.default;
    if (!MobileAds || typeof MobileAds !== 'function') {
      console.warn('⚠️ Google Mobile Ads não inicializável - usando modo mock');
      isInitialized = true;
      isAdsAvailable = false;
      return;
    }
    
    await MobileAds().initialize();
    
    isInitialized = true;
    console.log('✅ Google Mobile Ads inicializado com sucesso');
    console.log(`🌍 Ambiente: ${getEnvironment()}`);
    console.log(`🎯 Banner ID: ${ADS_IDS.bannerId}`);
    
    // Pré-carregar anúncio intersticial
    setTimeout(() => {
      InterstitialAdManager.preload();
    }, 1000);
    
  } catch (error) {
    console.error('❌ Erro ao inicializar Google Mobile Ads:', error);
    // Fallback para modo mock sem falhar
    console.log('🔄 Ativando modo mock como fallback');
    isInitialized = true;
    isAdsAvailable = false;
  }
};

// Tipos para propriedades dos componentes
interface BannerAdProps {
  size?: 'BANNER' | 'LARGE_BANNER';
  placement?: 'top' | 'bottom';
}

interface AdComponentProps {
  showAd?: boolean;
}

// Mock do componente de banner para desenvolvimento sem ads
const MockBannerAd: React.FC<BannerAdProps> = ({ size = 'BANNER', placement = 'top' }) => {
  const height = size === 'LARGE_BANNER' ? 100 : 50;
  
  return (
    <View style={[styles.mockBanner, { height }]}>
      <Text style={styles.mockText}>{placement === 'top' ? 'Banner Superior' : 'Banner Inferior'}</Text>
      <Text style={styles.mockSubtext}>Anúncio simulado (Desenvolvimento)</Text>
    </View>
  );
};

// Componente de Banner real
const RealBannerAd: React.FC<BannerAdProps> = ({ size = 'BANNER', placement = 'top' }) => {
  const [adLoaded, setAdLoaded] = useState<boolean>(false);
  const [adError, setAdError] = useState<boolean>(false);

  // Se o módulo não estiver disponível, usar mock
  if (!isAdsAvailable || !GoogleMobileAdsModule) {
    const height = size === 'LARGE_BANNER' ? 100 : 50;
    return (
      <View style={[styles.mockBanner, { height }]}>
        <Text style={styles.mockText}>Anúncio não disponível</Text>
        <Text style={styles.mockSubtext}>Módulo Google Ads não carregado</Text>
      </View>
    );
  }

  try {
    const { BannerAd, BannerAdSize } = GoogleMobileAdsModule;
    
    // Verificação adicional de segurança
    if (!BannerAd || !BannerAdSize) {
      throw new Error('Componentes BannerAd não disponíveis');
    }
    
    const adSize = size === 'LARGE_BANNER' ? BannerAdSize.LARGE_BANNER : BannerAdSize.BANNER;

    return (
      <View style={styles.bannerContainer}>
        <BannerAd
          unitId={ADS_IDS.bannerId}
          size={adSize}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdLoaded={() => {
            setAdLoaded(true);
            setAdError(false);
            console.log(`✅ Banner ${placement} carregado`);
          }}
          onAdFailedToLoad={(error: any) => {
            setAdError(true);
            console.error(`❌ Erro ao carregar banner ${placement}:`, error);
          }}
        />
        
        {/* Fallback visual enquanto carrega ou em caso de erro */}
        {(!adLoaded || adError) && (
          <View style={[styles.mockBanner, { height: size === 'LARGE_BANNER' ? 100 : 50 }]}>
            <Text style={styles.mockText}>
              {adError ? 'Erro ao carregar anúncio' : 'Carregando anúncio...'}
            </Text>
          </View>
        )}
      </View>
    );
  } catch (error) {
    console.error('❌ Erro ao criar BannerAd:', error);
    const height = size === 'LARGE_BANNER' ? 100 : 50;
    return (
      <View style={[styles.mockBanner, { height }]}>
        <Text style={styles.mockText}>Erro no anúncio</Text>
        <Text style={styles.mockSubtext}>Fallback ativo</Text>
      </View>
    );
  }
};

// Para anúncios de banner no topo
export const TopBannerAd: React.FC<AdComponentProps> = ({ showAd = true }) => {
  if (!showAd) return null;
  
  // Em desenvolvimento, mostrar mock
  if (__DEV__ && getEnvironment() === 'development') {
    return <MockBannerAd size="BANNER" placement="top" />;
  }
  
  return <RealBannerAd size="BANNER" placement="top" />;
};

// Para anúncios de banner no rodapé
export const BottomBannerAd: React.FC<AdComponentProps> = ({ showAd = true }) => {
  if (!showAd) return null;
  
  // Em desenvolvimento, mostrar mock
  if (__DEV__ && getEnvironment() === 'development') {
    return <MockBannerAd size="LARGE_BANNER" placement="bottom" />;
  }
  
  return <RealBannerAd size="LARGE_BANNER" placement="bottom" />;
};

// Para anúncios intersticiais (tela cheia)
export class InterstitialAdManager {
  private static interstitial: any = null;
  private static isLoaded: boolean = false;
  private static isLoading: boolean = false;
  private static lastShown: number = 0;
  private static sessionCount: number = 0;

  static async preload(): Promise<void> {
    if (this.isLoading || this.isLoaded) return;
    
    // Se o módulo não estiver disponível, simular carregamento
    if (!isAdsAvailable || !GoogleMobileAdsModule) {
      console.log('🎭 Simulando carregamento de anúncio intersticial (modo mock)');
      this.isLoaded = true;
      return;
    }
    
    this.isLoading = true;
    
    try {
      const { InterstitialAd, AdEventType } = GoogleMobileAdsModule;
      
      // Verificação adicional de segurança
      if (!InterstitialAd || !AdEventType) {
        throw new Error('Componentes InterstitialAd não disponíveis');
      }
      
      this.interstitial = InterstitialAd.createForAdRequest(ADS_IDS.interstitialId);
      
      this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
        this.isLoaded = true;
        this.isLoading = false;
        console.log('✅ Anúncio intersticial carregado');
      });

      this.interstitial.addAdEventListener(AdEventType.ERROR, (error: any) => {
        this.isLoaded = false;
        this.isLoading = false;
        console.error('❌ Erro ao carregar anúncio intersticial:', error);
      });

      this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        this.isLoaded = false;
        console.log('📱 Anúncio intersticial fechado');
        // Pré-carregar o próximo
        setTimeout(() => this.preload(), 2000);
      });

      await this.interstitial.load();
    } catch (error) {
      this.isLoaded = false;
      this.isLoading = false;
      console.error('❌ Erro ao criar anúncio intersticial:', error);
      // Fallback para modo mock - não falhar
      console.log('🔄 Ativando modo mock para intersticial como fallback');
      this.isLoaded = true;
    }
  }

  static async show(): Promise<boolean> {
    // Verificar se pode mostrar anúncio
    if (!this.canShowAd()) {
      console.log('⏭️ Anúncio intersticial não pode ser exibido agora');
      return false;
    }

    // Se não estiver carregado, tentar carregar
    if (!this.isLoaded) {
      console.log('⏳ Anúncio intersticial não está carregado');
      this.preload(); // Tentar carregar para a próxima vez
      return false;
    }

    // Modo mock (sem Google Mobile Ads)
    if (!isAdsAvailable || !GoogleMobileAdsModule || !this.interstitial) {
      console.log('🎭 Simulando exibição de anúncio intersticial (modo mock)');
      this.lastShown = Date.now();
      this.sessionCount++;
      setTimeout(() => {
        console.log('🎭 Anúncio intersticial simulado fechado');
      }, 2000);
      return true;
    }

    try {
      await this.interstitial.show();
      this.lastShown = Date.now();
      this.sessionCount++;
      return true;
    } catch (error) {
      console.error('❌ Erro ao exibir anúncio intersticial:', error);
      return false;
    }
  }

  private static canShowAd(): boolean {
    const now = Date.now();
    const timeSinceLastAd = (now - this.lastShown) / 1000;
    
    // Verificar cooldown
    if (timeSinceLastAd < ADS_SETTINGS.interstitialCooldown) {
      return false;
    }
    
    // Verificar limite por sessão
    if (this.sessionCount >= ADS_SETTINGS.maxInterstitialsPerSession) {
      return false;
    }
    
    return true;
  }

  static getStatus(): {
    isLoaded: boolean;
    isLoading: boolean;
    sessionCount: number;
    canShow: boolean;
    isAdsAvailable: boolean;
  } {
    return {
      isLoaded: this.isLoaded,
      isLoading: this.isLoading,
      sessionCount: this.sessionCount,
      canShow: this.canShowAd(),
      isAdsAvailable,
    };
  }
}

const styles = StyleSheet.create({
  mockBanner: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  mockSubtext: {
    fontSize: 12,
    color: '#888',
  },
  bannerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
