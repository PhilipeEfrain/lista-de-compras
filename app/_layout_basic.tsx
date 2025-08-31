import { MaterialIcons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router/tabs';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Strings } from '@/constants/Strings';

// Layout básico para debug - SEM contexts que podem causar crash
function TabsNavigator() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#1976d2',
      tabBarInactiveTintColor: '#666666',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopColor: '#e0e0e0',
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

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationThemeProvider value={DefaultTheme}>
          <View style={{ flex: 1 }}>
            <TabsNavigator />
            <StatusBar style="dark" />
          </View>
        </NavigationThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
