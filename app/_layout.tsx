import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Strings } from '@/constants/Strings';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Drawer>
            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: Strings.DRAWER_CURRENT_LIST,
                title: Strings.APP_TITLE
              }}
            />
            <Drawer.Screen
              name="history"
              options={{
                drawerLabel: Strings.DRAWER_HISTORY,
                title: Strings.HISTORY_TITLE
              }}
            />
            <Drawer.Screen name="+not-found" options={{ drawerItemStyle: { display: 'none' } }} />
          </Drawer>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
