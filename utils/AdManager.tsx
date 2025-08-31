import { shouldShowAds } from '@/constants/config';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// VERSÃO MOCK - SEM GOOGLE MOBILE ADS
// Aguardando aprovação do AdMob - usando apenas placeholders visuais

// Inicialização mock (não faz nada)
export const initializeAds = async (): Promise<void> => {
  console.log('🎭 AdManager: Modo mock ativo - aguardando aprovação do AdMob');
  return Promise.resolve();
};

// Tipos para propriedades dos componentes
interface BannerAdProps {
  size?: 'BANNER' | 'LARGE_BANNER';
  placement?: 'top' | 'bottom';
}

interface AdComponentProps {
  showAd?: boolean;
}

// Mock do componente de banner
const MockBannerAd: React.FC<BannerAdProps> = ({ size = 'BANNER', placement = 'top' }) => {
  const height = size === 'LARGE_BANNER' ? 100 : 50;
  
  return (
    <View style={[styles.mockBanner, { height }]}>
      <Text style={styles.mockText}>
        {placement === 'top' ? '📢 Espaço Publicitário Superior' : '📢 Espaço Publicitário Inferior'}
      </Text>
      <Text style={styles.mockSubtext}>
        Aguardando aprovação do Google AdMob
      </Text>
    </View>
  );
};

// Para anúncios de banner no topo
export const TopBannerAd: React.FC<AdComponentProps> = ({ showAd = true }) => {
  if (!showAd || !shouldShowAds()) return null;
  
  return <MockBannerAd size="BANNER" placement="top" />;
};

// Para anúncios de banner no rodapé
export const BottomBannerAd: React.FC<AdComponentProps> = ({ showAd = true }) => {
  if (!showAd || !shouldShowAds()) return null;
  
  return <MockBannerAd size="LARGE_BANNER" placement="bottom" />;
};

// Para anúncios intersticiais (mock)
export class InterstitialAdManager {
  static async preload(): Promise<void> {
    console.log('🎭 InterstitialAd: Simulando pré-carregamento');
    return Promise.resolve();
  }

  static async show(): Promise<boolean> {
    console.log('🎭 InterstitialAd: Simulando exibição de anúncio intersticial');
    // Simular um pequeno delay como se fosse um anúncio real
    await new Promise(resolve => setTimeout(resolve, 100));
    return true;
  }

  static getStatus() {
    return {
      isLoaded: true,
      isLoading: false,
      sessionCount: 0,
      canShow: true,
      isAdsAvailable: false, // Mock sempre false
    };
  }
}

const styles = StyleSheet.create({
  mockBanner: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  mockText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    textAlign: 'center',
  },
  mockSubtext: {
    fontSize: 11,
    color: '#adb5bd',
    textAlign: 'center',
    marginTop: 2,
  },
});
