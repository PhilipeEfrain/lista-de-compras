import { MaterialIcons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router/tabs';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Strings } from '@/constants/Strings';
import { PremiumProvider } from '@/context/PremiumContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { initializeAds } from '@/utils/AdManager';

function TabsNavigator() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: isDark ? '#80b3ff' : '#1976d2',
      tabBarInactiveTintColor: isDark ? '#b8b8d1' : '#666666',
      tabBarStyle: {
        backgroundColor: isDark ? '#2a2d3d' : '#ffffff',
        borderTopColor: isDark ? '#4a4f68' : '#e0e0e0',
      }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: Strings.DRAWER_CURRENT_LIST,
          tabBarLabel: "Lista",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="shopping-cart" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons
                name={isDark ? "light-mode" : "dark-mode"}
                size={24}
                color={isDark ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: Strings.HISTORY_TITLE,
          tabBarLabel: "Histórico",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons
                name={isDark ? "light-mode" : "dark-mode"}
                size={24}
                color={isDark ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="add-item"
        options={{
          title: Strings.TITLE_ADD_ITEM,
          tabBarLabel: "Adicionar Item",
          tabBarIcon: ({ size }) => (
            <MaterialIcons name="add" size={size} color="#4caf50" />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons
                name={isDark ? "light-mode" : "dark-mode"}
                size={24}
                color={isDark ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          tabBarLabel: "Configurações",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons
                name={isDark ? "light-mode" : "dark-mode"}
                size={24}
                color={isDark ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          ),
        }}
      />    
      <Tabs.Screen name="+not-found" options={{ href: null }} />
    </Tabs>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // REMOVIDO: initializeAds() para debug do crash
  // useEffect(() => {
  //   // Inicializar anúncios de forma assíncrona e segura
  //   const initAds = async () => {
  //     try {
  //       await initializeAds();
  //     } catch (error) {
  //       console.warn('Erro ao inicializar anúncios, continuando sem eles:', error);
  //     }
  //   };
  //   
  //   // Aguardar um pouco antes de inicializar anúncios
  //   const timeout = setTimeout(initAds, 2000);
  //   
  //   return () => clearTimeout(timeout);
  // }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <PremiumProvider>
        <RootLayoutNav />
      </PremiumProvider>
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { isDark } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          <View style={{ flex: 1 }}>
            <TabsNavigator />
            <StatusBar style={isDark ? "light" : "dark"} />
          </View>
        </NavigationThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
