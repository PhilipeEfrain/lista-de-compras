import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type PremiumContextType = {
  isPremium: boolean;
  setPremium: (value: boolean) => Promise<void>;
};

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState<boolean>(false);

  useEffect(() => {
    // Carregar o status premium ao iniciar
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    try {
      const storedPremium = await AsyncStorage.getItem('@premium_status');
      if (storedPremium !== null) {
        setIsPremium(JSON.parse(storedPremium));
      }
    } catch (error) {
      console.error('Erro ao carregar o status premium:', error);
    }
  };

  const setPremium = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('@premium_status', JSON.stringify(value));
      setIsPremium(value);
    } catch (error) {
      console.error('Erro ao salvar o status premium:', error);
    }
  };

  return (
    <PremiumContext.Provider value={{ isPremium, setPremium }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium deve ser usado dentro de um PremiumProvider');
  }
  return context;
}
