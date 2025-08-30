import { StyleSheet, Text, View } from 'react-native';

// Mock do componente de banner para desenvolvimento
const MockBannerAd = ({ size = 'BANNER', placement = 'top' }) => {
  const height = size === 'LARGE_BANNER' ? 100 : 50;
  
  return (
    <View style={[styles.mockBanner, { height }]}>
      <Text style={styles.mockText}>{placement === 'top' ? 'Banner Superior' : 'Banner Inferior'}</Text>
      <Text style={styles.mockSubtext}>Anúncio simulado (Desenvolvimento)</Text>
    </View>
  );
};

// Para anúncios de banner no topo
export const TopBannerAd = ({ showAd = true }) => {
  if (!showAd) return null;
  
  return <MockBannerAd size="BANNER" placement="top" />;
};

// Para anúncios de banner no rodapé
export const BottomBannerAd = ({ showAd = true }) => {
  if (!showAd) return null;
  
  return <MockBannerAd size="LARGE_BANNER" placement="bottom" />;
};

// Para anúncios intersticiais (tela cheia)
export class InterstitialAdManager {
  static isLoaded = false;
  static isLoading = false;

  static preload() {
    // Simular carregamento de anúncio
    console.log('Simulando carregamento de anúncio intersticial...');
    setTimeout(() => {
      this.isLoaded = true;
      this.isLoading = false;
      console.log('Anúncio intersticial carregado (simulação)');
    }, 1000);
  }

  static show() {
    // Simular exibição de anúncio
    console.log('Exibindo anúncio intersticial (simulação)');
    this.isLoaded = false;
    setTimeout(() => {
      console.log('Anúncio intersticial fechado (simulação)');
      this.preload();
    }, 2000);
  }
}

// Inicializar carregamento de anúncios
export const initializeAds = () => {
  console.log('Inicializando anúncios (modo de desenvolvimento)');
  InterstitialAdManager.preload();
};

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
  }
});
