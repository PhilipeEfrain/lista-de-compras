import { Strings } from '@/constants/Strings';
import { ShoppingList } from '@/type/types';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function History() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadLists();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLists();
    }, [])
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
              router.push("/(tabs)" as any);
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

  function renderListDetails() {
    if (!selectedList) return null;

    const itemsByCategory = selectedList.items.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {} as Record<string, typeof selectedList.items>);

    return (
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Lista do dia {formatDate(selectedList.date)}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTotal}>
              Total gasto: R$ {selectedList.totalSpent.toFixed(2).replace(".", ",")}
            </Text>

            <FlatList
              data={Object.entries(itemsByCategory)}
              keyExtractor={([category]) => category}
              renderItem={({ item: [category, items] }) => (
                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  {items.map(item => (
                    <View key={item.id} style={styles.itemRow}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {item.price !== undefined && item.quantity !== undefined && (
                        <Text style={styles.itemPrice}>
                          R$ {item.price.toFixed(2).replace(".", ",")} x {item.quantity}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            />

            <TouchableOpacity
              style={styles.reuseButton}
              onPress={() => {
                reuseList(selectedList);
                setModalVisible(false);
              }}
            >
              <Text style={styles.reuseButtonText}>{Strings.BTN_SAVE_LIST}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
          <TouchableOpacity
            style={styles.listCard}
            onPress={() => {
              setSelectedList(item);
              setModalVisible(true);
            }}
          >
            <View>
              <Text style={styles.listDate}>
                {formatDate(item.date)}
              </Text>
              <Text style={styles.listInfo}>
                {item.items.length} {item.items.length === 1 ? 'item' : 'itens'}
              </Text>
            </View>
            <Text style={styles.listTotal}>
              R$ {item.totalSpent.toFixed(2).replace(".", ",")}
            </Text>
          </TouchableOpacity>
        )}
      />

      {renderListDetails()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  listCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  listInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  placeholder: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 20,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  reuseButton: {
    backgroundColor: '#1976d2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  reuseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
