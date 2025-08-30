import AdBanner from '@/components/AdBanner';
import { createHistoryStyles } from '@/components/styles';
import { Strings } from '@/constants/Strings';
import { usePremium } from '@/context/PremiumContext';
import { useTheme } from '@/context/ThemeContext';
import { useInterstitialAd } from '@/hooks/useAds';
import { ShoppingList } from '@/type/types';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function History() {
  const { theme } = useTheme();
  const { isPremium } = usePremium();
  const { showAd: showHistoryAd } = useInterstitialAd('view_history');
  const styles = createHistoryStyles(theme);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isPremium) {
      loadLists();
    }
  }, [isPremium]);

  useFocusEffect(
    useCallback(() => {
      if (isPremium) {
        loadLists();
      } else {
        // Mostrar anúncio ao acessar histórico para usuários não premium
        showHistoryAd();
      }
    }, [isPremium])
  );

  async function loadLists() {
    try {
      const json = await AsyncStorage.getItem("@shopping_history");
      if (json) {
        const history = JSON.parse(json);
        if (Array.isArray(history)) {
          const sortedHistory = history.sort((a: ShoppingList, b: ShoppingList) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setLists(sortedHistory);
        } else {
          setLists([]);
        }
      } else {
        setLists([]);
      }
    } catch (error) {
      Alert.alert(Strings.ALERT_ERROR, String(error));
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  async function reuseList(list: ShoppingList) {
    try {
      const newItems = list.items.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random(),
        got: false,
        missing: false,
        price: undefined,
        quantity: undefined,
      }));
      const currentListJson = await AsyncStorage.getItem("@shopping_list");
      const currentList = currentListJson ? JSON.parse(currentListJson) : [];
      const updatedList = [...currentList, ...newItems];
      await AsyncStorage.setItem("@shopping_list", JSON.stringify(updatedList));
      Alert.alert(
        Strings.ALERT_LIST_REUSED,
        Strings.MSG_LIST_REUSED,
        [
          {
            text: Strings.DRAWER_CURRENT_LIST,
            onPress: () => {
              router.push("/");
            },
          },
          {
            text: Strings.CONFIRM_OK,
            style: "cancel"
          }
        ]
      );
    } catch (error) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_ERROR_REUSE_LIST);
    }
  }



  const toggleExpanded = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  async function deleteAllHistory() {
    try {
      await AsyncStorage.setItem("@shopping_history", JSON.stringify([]));
      setLists([]);
      Alert.alert(Strings.ALERT_SUCCESS, Strings.MSG_HISTORY_DELETED);
    } catch (error) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_ERROR_DELETE_HISTORY);
    }
  }

  async function deleteList(id: string) {
    try {
      const updatedLists = lists.filter(list => list.id !== id);
      await AsyncStorage.setItem("@shopping_history", JSON.stringify(updatedLists));
      setLists(updatedLists);
      Alert.alert(Strings.ALERT_SUCCESS, Strings.MSG_LIST_DELETED_HISTORY);
    } catch (error) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_ERROR_DELETE_HISTORY);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Banner de anúncio no topo */}
      <AdBanner placement="top" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color={theme.primary} />
          <Text style={styles.backButtonText}>{Strings.BTN_BACK_TO_LIST}</Text>
        </TouchableOpacity>
        {isPremium && lists.length > 0 && (
          <TouchableOpacity
            style={styles.deleteAllButton}
            onPress={() => {
              Alert.alert(
                Strings.ALERT_DELETE_HISTORY,
                Strings.CONFIRM_DELETE_ALL_HISTORY,
                [
                  {
                    text: Strings.CONFIRM_CANCEL,
                    style: "cancel"
                  },
                  {
                    text: Strings.CONFIRM_DELETE,
                    style: "destructive",
                    onPress: deleteAllHistory
                  }
                ]
              );
            }}
          >
            <Icon name="delete-forever" size={24} color={theme.danger} />
            <Text style={[styles.deleteAllButtonText, { color: theme.danger }]}>
              {Strings.BTN_DELETE_ALL_HISTORY}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {!isPremium ? (
        <View style={styles.premiumMessageContainer}>
          <Icon name="lock" size={70} color={theme.primary} />
          <Text style={styles.premiumTitle}>{Strings.PREMIUM_REQUIRED_TITLE}</Text>
          <Text style={styles.premiumMessage}>{Strings.PREMIUM_HISTORY_MESSAGE}</Text>
          <TouchableOpacity
            style={styles.getPremiumButton}
            onPress={() => router.push('/settings')}
          >
            <Icon name="star" size={20} color={theme.text.inverse} />
            <Text style={styles.getPremiumButtonText}>{Strings.BTN_GET_PREMIUM}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          ListEmptyComponent={
            <Text style={styles.placeholder}>
              {Strings.MSG_EMPTY_LIST}
            </Text>
          }
          renderItem={({ item }) => (
          <View style={styles.listCard}>
            <TouchableOpacity
              style={styles.listHeader}
              onPress={() => toggleExpanded(item.id)}
            >
              <View>
                <Text style={styles.listTitle}>
                  {item.title}
                </Text>
                <Text style={styles.listDate}>
                  {formatDate(item.date)}
                </Text>
                <Text style={styles.listInfo}>
                  {item.items.length} {item.items.length === 1 ? 'item' : 'itens'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={styles.listTotal}>
                  R$ {item.totalSpent.toFixed(2).replace(".", ",")}
                </Text>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    Alert.alert(
                      Strings.ALERT_DELETE_LIST_HISTORY,
                      Strings.CONFIRM_DELETE_LIST_HISTORY,
                      [
                        {
                          text: Strings.CONFIRM_CANCEL,
                          style: "cancel"
                        },
                        {
                          text: Strings.CONFIRM_DELETE,
                          style: "destructive",
                          onPress: () => deleteList(item.id)
                        }
                      ]
                    );
                  }}
                  style={styles.deleteListButton}
                >
                  <Icon name="delete" size={20} color={theme.danger} />
                </TouchableOpacity>
                <Icon
                  name={expandedIds.includes(item.id) ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={24}
                  color={theme.text.secondary}
                />
              </View>
            </TouchableOpacity>

            {expandedIds.includes(item.id) && (
              <View style={styles.listContent}>
                {Object.entries(
                  item.items.reduce((acc, currentItem) => {
                    if (!acc[currentItem.type]) {
                      acc[currentItem.type] = [];
                    }
                    acc[currentItem.type].push(currentItem);
                    return acc;
                  }, {} as Record<string, typeof item.items>)
                ).map(([category, items]) => (
                  <View key={category} style={styles.categoryContainer}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    {items.map(listItem => (
                      <View key={listItem.id} style={styles.itemRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          <Text style={styles.itemQuantity}>
                            {listItem.quantity?.toString().padStart(2, '0')}x
                          </Text>
                          <Text style={styles.itemName}>{listItem.name}</Text>
                        </View>
                        {listItem.price !== undefined && listItem.quantity !== undefined && (
                          <Text style={styles.itemPrice}>
                            R$ {listItem.price.toFixed(2).replace(".", ",")} x {listItem.quantity}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.reuseButton}
                  onPress={() => reuseList(item)}
                >
                  <Icon name="refresh" size={20} color={theme.text.inverse} />
                  <Text style={styles.reuseButtonText}>{Strings.BTN_REUSE_LIST}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
      )}
      
      {/* Banner de anúncio no rodapé */}
      <AdBanner placement="bottom" />
    </SafeAreaView>
  );
}