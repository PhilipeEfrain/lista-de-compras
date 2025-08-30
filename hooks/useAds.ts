import { ADS_SETTINGS } from '@/constants/ads';
import { usePremium } from '@/context/PremiumContext';
import { InterstitialAdManager } from '@/utils/AdManager';
import { useEffect, useState } from 'react';

export type AdTrigger = 'save_list' | 'share_whatsapp' | 'view_history' | 'app_background';

export const useAds = () => {
  const { isPremium } = usePremium();
  const [adStatus, setAdStatus] = useState({
    isLoaded: false,
    isLoading: false,
    sessionCount: 0,
    canShow: false,
  });

  // Atualizar status dos anúncios periodicamente
  useEffect(() => {
    const updateStatus = () => {
      setAdStatus(InterstitialAdManager.getStatus());
    };

    const interval = setInterval(updateStatus, 5000); // Atualizar a cada 5 segundos
    updateStatus(); // Atualizar imediatamente

    return () => clearInterval(interval);
  }, []);

  /**
   * Exibe um anúncio intersticial se as condições permitirem
   * @param trigger - Ação que disparou o anúncio
   * @returns Promise<boolean> - true se o anúncio foi exibido
   */
  const showInterstitialAd = async (trigger: AdTrigger): Promise<boolean> => {
    // Usuários premium não veem anúncios
    if (isPremium) {
      console.log('👑 Usuário premium - anúncio ignorado');
      return false;
    }

    // Verificar se a ação pode disparar anúncios
    if (!ADS_SETTINGS.interstitialTriggers.includes(trigger)) {
      console.log(`⏭️ Trigger '${trigger}' não configurado para anúncios`);
      return false;
    }

    try {
      const shown = await InterstitialAdManager.show();
      console.log(`📱 Anúncio ${trigger}: ${shown ? 'exibido' : 'não exibido'}`);
      return shown;
    } catch (error) {
      console.error(`❌ Erro ao exibir anúncio ${trigger}:`, error);
      return false;
    }
  };

  /**
   * Verifica se anúncios devem ser exibidos (não premium)
   */
  const shouldShowAds = (): boolean => {
    return !isPremium;
  };

  /**
   * Força o pré-carregamento de um anúncio intersticial
   */
  const preloadInterstitial = () => {
    if (!isPremium) {
      InterstitialAdManager.preload();
    }
  };

  return {
    // Estado
    shouldShowAds: shouldShowAds(),
    adStatus,
    
    // Métodos
    showInterstitialAd,
    preloadInterstitial,
  };
};

/**
 * Hook para mostrar anúncio intersticial com trigger específico
 * @param trigger - Trigger que será usado quando o anúncio for solicitado
 */
export const useInterstitialAd = (trigger: AdTrigger) => {
  const { showInterstitialAd, shouldShowAds, adStatus } = useAds();

  const showAd = () => showInterstitialAd(trigger);

  return {
    showAd,
    shouldShowAds,
    adStatus,
  };
};
