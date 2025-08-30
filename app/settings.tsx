import { usePremium } from "@/context/PremiumContext";
import { useTheme } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { isPremium, setPremium } = usePremium();
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePremium = async () => {
    setIsLoading(true);
    try {
      // Em um app real, aqui você implementaria a lógica de pagamento
      // com integração de um gateway de pagamento ou loja de aplicativos
      
      // Simulação da alteração de status premium
      await setPremium(!isPremium);
      
      if (!isPremium) {
        Alert.alert(
          "Versão Premium Ativada",
          "Parabéns! Você ativou a versão premium do Listou. Agora você pode usar o aplicativo sem anúncios.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Versão Premium Desativada",
          "Você desativou a versão premium. Os anúncios voltarão a ser exibidos.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao alterar o status premium. Tente novamente mais tarde.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <View style={settingsStyles.section}>
          <Text style={settingsStyles.sectionTitle}>Versão Premium</Text>
          
          <View style={settingsStyles.settingItem}>
            <View style={settingsStyles.settingContent}>
              <Icon name="workspace-premium" size={24} color={theme.primary} style={{ marginRight: 16 }} />
              <View style={{ flex: 1 }}>
                <Text style={settingsStyles.settingLabel}>Remover Anúncios</Text>
                <Text style={settingsStyles.settingDescription}>
                  Ative a versão premium para usar o app sem anúncios
                </Text>
              </View>
              <Switch
                value={isPremium}
                onValueChange={handleTogglePremium}
                disabled={isLoading}
                trackColor={{ false: "#767577", true: "#4caf50" }}
                thumbColor={isPremium ? "#ffffff" : "#f4f3f4"}
              />
            </View>
          </View>
          
          {!isPremium && (
            <TouchableOpacity 
              style={settingsStyles.premiumButton}
              onPress={handleTogglePremium}
              disabled={isLoading}
            >
              <Icon name="shopping-cart" size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={settingsStyles.premiumButtonText}>Comprar Versão Premium</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={settingsStyles.section}>
          <Text style={settingsStyles.sectionTitle}>Sobre</Text>
          
          <View style={settingsStyles.settingItem}>
            <View style={settingsStyles.settingContent}>
              <Icon name="info" size={24} color={theme.primary} style={{ marginRight: 16 }} />
              <View>
                <Text style={settingsStyles.settingLabel}>Listou</Text>
                <Text style={settingsStyles.settingDescription}>Versão 1.1.0</Text>
              </View>
            </View>
          </View>
          
          <View style={settingsStyles.settingItem}>
            <View style={settingsStyles.settingContent}>
              <Icon name="code" size={24} color={theme.primary} style={{ marginRight: 16 }} />
              <View>
                <Text style={settingsStyles.settingLabel}>Desenvolvido por</Text>
                <Text style={settingsStyles.settingDescription}>Philipe Gonzalez</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const settingsStyles = StyleSheet.create({
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333333",
  },
  settingItem: {
    marginBottom: 12,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  settingDescription: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  premiumButton: {
    backgroundColor: "#4caf50",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  premiumButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
