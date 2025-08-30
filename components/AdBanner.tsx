import { usePremium } from '@/context/PremiumContext';
import { BottomBannerAd, TopBannerAd } from '@/utils/AdManager';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export type AdPlacement = 'top' | 'bottom';

interface AdBannerProps {
  placement?: AdPlacement;
}

export default function AdBanner({ placement = 'bottom' }: AdBannerProps) {
  const { isPremium } = usePremium();

  // Se for usuário premium, não mostra anúncios
  if (isPremium) {
    return null;
  }

  return (
    <View style={[
      styles.adContainer,
      placement === 'top' ? styles.topBanner : styles.bottomBanner
    ]}>
      {placement === 'top' 
        ? <TopBannerAd showAd={!isPremium} />
        : <BottomBannerAd showAd={!isPremium} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  topBanner: {
    marginBottom: 10,
  },
  bottomBanner: {
    marginTop: 10,
  },
});
