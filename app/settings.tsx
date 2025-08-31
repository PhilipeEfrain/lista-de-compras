import { useTheme } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function SettingsScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style="auto" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Seção Em Desenvolvimento */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Icon name="construction" size={60} color={theme.primary} />
          <Text style={[styles.developmentTitle, { color: theme.text.primary }]}>
            Em Desenvolvimento
          </Text>
          <Text style={[styles.developmentSubtitle, { color: theme.text.secondary }]}>
            Novas configurações estão sendo desenvolvidas e estarão disponíveis em breve.
          </Text>
        </View>

        {/* Seção Sobre */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Sobre</Text>
          
          <View style={styles.aboutItem}>
            <Icon name="info" size={24} color={theme.primary} style={styles.aboutIcon} />
            <View style={styles.aboutContent}>
              <Text style={[styles.aboutLabel, { color: theme.text.primary }]}>Listou</Text>
              <Text style={[styles.aboutDescription, { color: theme.text.secondary }]}>Versão 2.0.3</Text>
            </View>
          </View>
          
          <View style={styles.aboutItem}>
            <Icon name="code" size={24} color={theme.primary} style={styles.aboutIcon} />
            <View style={styles.aboutContent}>
              <Text style={[styles.aboutLabel, { color: theme.text.primary }]}>Desenvolvido por</Text>
              <Text style={[styles.aboutDescription, { color: theme.text.secondary }]}>Philipe Gonzalez</Text>
            </View>
          </View>

          <View style={styles.aboutItem}>
            <Icon name="description" size={24} color={theme.primary} style={styles.aboutIcon} />
            <View style={styles.aboutContent}>
              <Text style={[styles.aboutLabel, { color: theme.text.primary }]}>Descrição</Text>
              <Text style={[styles.aboutDescription, { color: theme.text.secondary }]}>
                Aplicativo para criação e gerenciamento de listas de compras com histórico e análise de gastos.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  developmentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  developmentSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  aboutIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  aboutContent: {
    flex: 1,
  },
  aboutLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  aboutDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
