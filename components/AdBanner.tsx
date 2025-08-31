import { BottomBannerAd, TopBannerAd } from '@/utils/AdManager';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export type AdPlacement = 'top' | 'bottom';

interface AdBannerProps {
  placement?: AdPlacement;
}

export default function AdBanner({ placement = 'bottom' }: AdBannerProps) {
  // Agora os anúncios sempre são exibidos (sem verificação premium)
  return (
    <View style={[
      styles.adContainer,
      placement === 'top' ? styles.topBanner : styles.bottomBanner
    ]}>
      {placement === 'top' 
        ? <TopBannerAd showAd={true} />
        : <BottomBannerAd showAd={true} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBanner: {
    marginBottom: 10,
  },
  bottomBanner: {
    marginTop: 5,
    marginBottom: 5,
  },
});
