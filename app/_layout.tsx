import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/MaterialIcons";

import { Strings } from '@/constants/Strings';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

function DrawerContent() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: Strings.DRAWER_CURRENT_LIST,
          title: Strings.APP_TITLE,
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              style={{ marginRight: 15 }}
            >
              <Icon
                name={isDark ? "light-mode" : "dark-mode"}
                size={24}
                color={isDark ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen
        name="history"
        options={{
          drawerLabel: Strings.DRAWER_HISTORY,
          title: Strings.HISTORY_TITLE,
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              style={{ marginRight: 15 }}
            >
              <Icon
                name={isDark ? "light-mode" : "dark-mode"}
                size={24}
                color={isDark ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen name="+not-found" options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer>
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
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { isDark } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          <DrawerContent />
          <StatusBar style={isDark ? "light" : "dark"} />
        </NavigationThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
