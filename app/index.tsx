import { CategoryPicker } from "@/components/CategoryPicker";
import { pickerStyles } from "@/components/pickerStyles";
import { createStyles } from "@/components/styles";
import { CATEGORIES } from "@/constants/categories";
import { colorsGraphic } from "@/constants/Colors";
import { CATEGORY_ICONS } from "@/constants/icons";
import { Strings } from "@/constants/Strings";
import { useTheme } from "@/context/ThemeContext";
import { Item } from "@/type/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Home() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [title] = useState(Strings.APP_TITLE);
  const [newItem, setNewItem] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [selectedType, setSelectedType] = useState(CATEGORIES[0]);
  const [items, setItems] = useState<Item[]>([]);
  const [showCharts, setShowCharts] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [saveListModalVisible, setSaveListModalVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [quantityInput, setQuantityInput] = useState("");
  const [listTitle, setListTitle] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  async function loadItems() {
    try {
      const json = await AsyncStorage.getItem("@shopping_list");
      if (json) {
        setItems(JSON.parse(json));
      }
    } catch {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_ERROR_LOAD_LIST);
    }
  }

  async function saveItems(updated: Item[]) {
    try {
      await AsyncStorage.setItem("@shopping_list", JSON.stringify(updated));
    } catch {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_ERROR_SAVE_LIST);
    }
  }

  function addItem() {
    if (!newItem.trim()) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_TYPE_ITEM_NAME);
      return;
    }
    const quantity = newItemQuantity ? parseInt(newItemQuantity, 10) : 1;
    const newEntry: Item = {
      id: Date.now()?.toString(),
      name: newItem.trim(),
      type: selectedType,
      got: false,
      missing: false,
      quantity: quantity
    };
    const updated = [...items, newEntry];
    setItems(updated);
    saveItems(updated);
    setNewItem("");
    setNewItemQuantity("01");
  }

  function openGotModal(id: string) {
    const item = items.find(item => item.id === id);
    setCurrentItemId(id);
    if (item) {
      setQuantityInput(item.quantity?.toString().padStart(2, "0"));
    }
    setModalVisible(true);
  }

  function confirmGot() {
    if (!currentItemId) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_NO_ITEM_SELECTED);
      return;
    }

    if (!priceInput) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_FILL_PRICE_QUANTITY);
      return;
    }

    const price = parseFloat(priceInput.replace(",", "."));
    const quantity = quantityInput ? parseInt(quantityInput, 10) : 1;

    if (isNaN(price) || price <= 0) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_INVALID_VALUES);
      return;
    }

    const updated = items.map((item) =>
      item.id === currentItemId
        ? {
          ...item,
          got: true,
          missing: false,
          price,
          quantity,
        }
        : item
    );

    setItems(updated);
    saveItems(updated);

    setModalVisible(false);
    setPriceInput("");
    setQuantityInput("");
    setCurrentItemId(null);
  }

  function toggleMissing(id: string) {
    const updated = items.map((item) =>
      item.id === id
        ? {
          ...item,
          missing: !item.missing,
          got: false,
          price: undefined,
        }
        : item
    );
    setItems(updated);
    saveItems(updated);
  }

  function deleteItem(id: string) {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    saveItems(updated);
  }

  function renderGroupedList() {
    const categoriesWithItems = Array.from(
      new Set(items.map((item) => item.type))
    );

    return (
      <FlatList
        data={categoriesWithItems}
        keyExtractor={(cat) => cat}
        renderItem={({ item: cat }) => {
          const filtered = items.filter((i) => i.type === cat);
          return (
            <View>
              <Text style={styles.categoryTitle}>{cat}</Text>
              {filtered.map((item) => renderItem(item))}
            </View>
          );
        }}
      />
    );
  }

  function renderItem(item: Item) {
    return (
      <View key={item.id} style={styles.itemRow}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={styles.itemQuantity}>
              {item.quantity?.toString().padStart(2, '0') || '01'} x
            </Text>
            <Text
              style={[
                styles.itemName,
                item.got && styles.itemGot,
                !item.got && item.missing && styles.itemMissing,
              ]}
            >
              {item.name}
            </Text>
          </View>

          {item.price !== undefined && (
            <Text style={styles.itemPriceQuantity}>
              R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
            </Text>
          )}
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() => openGotModal(item.id)}
            style={styles.actionButton}
          >
            <Icon
              name="check"
              size={24}
              color={item.got ? theme.success : theme.text.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleMissing(item.id)}
            style={styles.actionButton}
          >
            <Icon
              name="close"
              size={24}
              color={item.missing ? theme.danger : theme.text.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => deleteItem(item.id)}
            style={styles.actionButton}
          >
            <Icon name="delete" size={24} color={theme.danger} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  const totalExpense = items.reduce((acc, item) => {
    if (item.got && item.price && item.quantity) {
      return acc + item.price * item.quantity;
    }
    return acc;
  }, 0);

  function getBarChartData() {
    const totalsByCategory: Record<string, number> = {};

    items.forEach((item) => {
      if (item.got && item.price && item.quantity) {
        totalsByCategory[item.type] =
          (totalsByCategory[item.type] || 0) + item.price * item.quantity;
      }
    });

    const labels = Object.keys(totalsByCategory);
    const data = labels.map((cat) => totalsByCategory[cat]);

    return {
      labels,
      datasets: [
        {
          data,
        },
      ],
    };
  }

  function getProductPriceData() {
    const itemPrices = items
      .filter(item => item.got && item.price)
      .map(item => ({
        name: item.name,
        price: item.price || 0
      }))
      .sort((a, b) => b.price - a.price)
      .slice(0, 5);

    return {
      labels: itemPrices.map(item => item.name),
      datasets: [
        {
          data: itemPrices.map(item => item.price),
        },
      ],
    };
  }

  function getPieChartData() {
    const countByCategory: Record<string, number> = {};

    items.forEach((item) => {
      countByCategory[item.type] = (countByCategory[item.type] || 0) + 1;
    });

    return Object.entries(countByCategory).map(([key, value], i) => ({
      name: key,
      population: value,
      color: colorsGraphic[i % colorsGraphic.length],
      legendFontColor: theme.text.primary,
      legendFontSize: 14,
    }));
  }

  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Modal
        transparent
        visible={addItemModalVisible}
        animationType="slide"
        onRequestClose={() => setAddItemModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{Strings.TITLE_ADD_ITEM}</Text>
              <TouchableOpacity
                onPress={() => setAddItemModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={theme.text.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>{Strings.TITLE_QUANTITY}</Text>
            <TextInput
              value={newItemQuantity}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9]/g, "");
                setNewItemQuantity(clean);
              }}
              keyboardType="numeric"
              style={[styles.quantityInput, { color: theme.text.primary }]}
              returnKeyType="done"
              placeholder="1"
              placeholderTextColor={theme.text.secondary}
            />

            <Text style={styles.inputLabel}>{Strings.TITLE_ITEM_NAME}</Text>
            <TextInput
              value={newItem}
              onChangeText={setNewItem}
              style={styles.itemNameInput}
              returnKeyType="done"
              placeholder="Digite o nome do item"
              placeholderTextColor={theme.text.secondary}
              autoCapitalize="sentences"
            />

            <Text style={styles.inputLabel}>{Strings.TITLE_PRODUCT_CATEGORY}</Text>
            <View style={{ marginBottom: 15 }}>
              <CategoryPicker
                selectedValue={selectedType}
                onValueChange={setSelectedType}
                options={CATEGORIES}
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { marginTop: 10, justifyContent: 'center' }]}
              onPress={() => {
                addItem();
                setAddItemModalVisible(false);
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>{Strings.BTN_ADD_ITEM}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {items.length > 0 && (
        <View style={styles.headerButtons}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setListTitle("");
                setSaveListModalVisible(true);
              }}
            >
              <Icon name="save" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>{Strings.BTN_SAVE_LIST}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => router.push("history" as any)}
            >
              <Icon name="history" size={20} color="#fff" />
              <Text style={styles.historyButtonText}>Histórico</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.total}>
              Total gasto: R$ {totalExpense.toFixed(2).replace(".", ",")}
            </Text>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              onPress={() => {
                Alert.alert(
                  Strings.ALERT_DELETE_LIST,
                  Strings.CONFIRM_DELETE_LIST,
                  [
                    {
                      text: Strings.CONFIRM_CANCEL,
                      style: "cancel"
                    },
                    {
                      text: Strings.CONFIRM_DELETE,
                      style: "destructive",
                      onPress: async () => {
                        try {
                          setItems([]);
                          await AsyncStorage.setItem("@shopping_list", JSON.stringify([]));
                          Alert.alert(Strings.ALERT_SUCCESS, Strings.MSG_LIST_DELETED);
                        } catch {
                          Alert.alert(Strings.ALERT_ERROR, Strings.MSG_ERROR_DELETE_LIST);
                        }
                      }
                    }
                  ]
                );
              }}
            >
              <Icon name="delete" size={24} color={theme.danger} />
              <Text style={{ color: theme.danger, fontSize: 16 }}>{Strings.BTN_CLEAR_LIST}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    

      <FlatList
        data={Array.from(new Set(items.map(item => item.type)))}
        keyExtractor={(category) => category}
        renderItem={({ item: category }) => {
          const categoryItems = items.filter(item => item.type === category);
          return (
            <View style={styles.categoryGroup}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {categoryItems.map(item => renderItem(item))}
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyStateContainer}>
            <TouchableOpacity 
              style={styles.addButtonCentered}
              onPress={() => setAddItemModalVisible(true)}
            >
              <Icon name="add" size={36} color="#fff" />
              <Text style={styles.addButtonText}>Adicionar item na lista</Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={() => {
          const missingItems = items.filter(item => item.missing);

          return (
            <View style={{ padding: 10, paddingBottom: items.length > 0 ? 80 : 10 }}>
              {missingItems.length > 0 && (
                <TouchableOpacity
                  style={styles.missingListButton}
                  onPress={() => {
                    Alert.alert(
                      "Manter apenas itens que faltam",
                      "Isso irá manter apenas os itens marcados como faltantes na lista. Deseja continuar?",
                      [
                        {
                          text: "Cancelar",
                          style: "cancel"
                        },
                        {
                          text: "Confirmar",
                          style: "destructive",
                          onPress: () => {
                            const updatedList = items.filter(item => item.missing).map(item => ({
                              ...item,
                              missing: false,
                              got: false,
                              price: undefined
                            }));
                            setItems(updatedList);
                            saveItems(updatedList);
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Text style={styles.missingListButtonText}>
                    Manter apenas itens que faltam
                  </Text>
                </TouchableOpacity>
              )}

              {items.length > 0 && (
                <>
                  <TouchableOpacity
                    style={styles.chartsButton}
                    onPress={() => setShowCharts(!showCharts)}
                  >
                    <Icon name={showCharts ? "keyboard-arrow-up" : "bar-chart"} size={24} color="#fff" />
                    <Text style={styles.chartsButtonText}>
                      {showCharts ? Strings.BTN_HIDE_CHARTS : Strings.BTN_TOGGLE_CHARTS}
                    </Text>
                  </TouchableOpacity>

                  {showCharts && (
                    <View style={[styles.chartsContainer, { backgroundColor: theme.card }]}>
                      <Text style={styles.chartTitle}>{Strings.CHART_SPENDING_BY_CATEGORY}</Text>
                      <BarChart
                        data={getBarChartData()}
                        width={screenWidth - 50}
                        height={220}
                        yAxisLabel="R$ "
                        yAxisSuffix=""
                        chartConfig={{
                          backgroundGradientFrom: theme.background,
                          backgroundGradientTo: theme.background,
                          decimalPlaces: 2,
                          color: (opacity) => theme.primary + (opacity * 255).toString(16).padStart(2, '0'),
                          labelColor: () => theme.text.primary,
                          style: { borderRadius: 16 },
                          propsForDots: { r: "6", strokeWidth: "2", stroke: theme.primary },
                        }}
                        verticalLabelRotation={45}
                        style={{ borderRadius: 16, marginVertical: 10, paddingRight: 10 }}
                        fromZero
                        showValuesOnTopOfBars
                      />

                      <Text style={styles.chartTitle}>{Strings.TITLE_TOP_5_EXPENSIVE}</Text>
                      <BarChart
                        data={getProductPriceData()}
                        width={screenWidth - 50}
                        height={220}
                        yAxisLabel="R$ "
                        yAxisSuffix=""
                        chartConfig={{
                          backgroundGradientFrom: theme.background,
                          backgroundGradientTo: theme.background,
                          decimalPlaces: 2,
                          color: (opacity) => theme.primary + (opacity * 255).toString(16).padStart(2, '0'),
                          labelColor: () => theme.text.primary,
                          style: { borderRadius: 16 },
                        }}
                        verticalLabelRotation={30}
                        style={{ borderRadius: 16, marginVertical: 10 }}
                        fromZero
                        showValuesOnTopOfBars
                      />

                      <Text style={styles.chartTitle}>{Strings.CHART_ITEMS_BY_CATEGORY}</Text>
                      <Text style={styles.chartTitle}>{Strings.TITLE_ITEMS_DISTRIBUTION}</Text>
                      <PieChart
                        data={getPieChartData()}
                        width={screenWidth - 50}
                        height={220}
                        chartConfig={{
                          color: (opacity = 1) => theme.text.primary + (opacity * 255).toString(16).padStart(2, '0'),
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="20"
                        absolute
                      />
                    </View>
                  )}
                </>
              )}
            </View>
          );
        }}
      />

      <Modal
        transparent
        visible={saveListModalVisible}
        animationType="slide"
        onRequestClose={() => setSaveListModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{Strings.TITLE_SAVE_LIST}</Text>
              <TouchableOpacity
                onPress={() => setSaveListModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={theme.text.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>{Strings.TITLE_LIST_NAME}</Text>
            <TextInput
              value={listTitle}
              onChangeText={setListTitle}
              style={[styles.modalInput, { marginBottom: 15 }]}
              placeholder={Strings.PLACEHOLDER_LIST_NAME}
              returnKeyType="done"
            />

            <TouchableOpacity
              style={[styles.saveButton, { marginTop: 10 }]}
              onPress={async () => {
                if (!listTitle.trim()) {
                  Alert.alert(Strings.ALERT_ERROR, Strings.MSG_TYPE_LIST_NAME);
                  return;
                }

                try {
                  const listToSave = {
                    id: Date.now().toString(),
                    title: listTitle.trim(),
                    date: new Date().toISOString(),
                    items: items,
                    totalSpent: totalExpense
                  };

                  const historyJson = await AsyncStorage.getItem("@shopping_history");
                  const history = historyJson ? JSON.parse(historyJson) : [];
                  const updatedHistory = [...history, listToSave];
                  await AsyncStorage.setItem("@shopping_history", JSON.stringify(updatedHistory));

                  setItems([]);
                  await AsyncStorage.setItem("@shopping_list", JSON.stringify([]));
                  setSaveListModalVisible(false);

                  Alert.alert(
                    Strings.ALERT_LIST_SAVED,
                    Strings.MSG_LIST_MOVED_HISTORY,
                    [
                      {
                        text: Strings.DRAWER_HISTORY,
                        onPress: () => router.push("history" as any),
                      },
                      {
                        text: Strings.CONFIRM_OK,
                        style: "cancel"
                      }
                    ]
                  );
                } catch {
                  Alert.alert(Strings.ALERT_ERROR, Strings.MSG_ERROR_SAVE_HISTORY);
                }
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="save" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>{Strings.BTN_SAVE_LIST}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{Strings.INPUT_ITEM_PRICE}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={theme.text.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>{Strings.INPUT_ITEM_PRICE}</Text>
            <TextInput
              value={priceInput}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9,]/g, "");
                setPriceInput(clean);
              }}
              keyboardType="numeric"
              placeholder="Ex: 12,50"
              placeholderTextColor={theme.text.secondary}
              style={styles.modalInput}
              returnKeyType="done"
            />

            <Text style={styles.inputLabel}>{Strings.TITLE_QUANTITY}</Text>
              <TextInput
              value={quantityInput}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9]/g, "");
                setQuantityInput(clean);
              }}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor={theme.text.secondary}
              style={[styles.quantityInput, { color: theme.text.primary }]}
              returnKeyType="done"
            />            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.saveButton, { flex: 1, marginRight: 8 }]}
                onPress={confirmGot}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.saveButtonText}>{Strings.CONFIRM_OK}</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.deleteButton, { flex: 1 }]}
                onPress={() => setModalVisible(false)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="close" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.deleteButtonText}>{Strings.CONFIRM_CANCEL}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {items.length > 0 && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setAddItemModalVisible(true)}
        >
          <Icon name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

function PickerDropdown({
  selectedValue,
  onValueChange,
  options,
}: {
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);

  function toggleOpen() {
    setOpen((prev) => !prev);
  }

  function getCategoryIcon(category: string) {
    return CATEGORY_ICONS[category] || "label";
  }

  return (
    <View style={pickerStyles.container}>
      <TouchableOpacity
        style={pickerStyles.selected}
        onPress={toggleOpen}
        activeOpacity={0.7}
      >
        <View style={pickerStyles.selectedLeft}>
          <View style={pickerStyles.selectedIcon}>
            <Icon
              name={getCategoryIcon(selectedValue)}
              size={22}
              color="#1976d2"
            />
          </View>
          <Text style={pickerStyles.selectedText}>{selectedValue}</Text>
        </View>
        <Icon
          name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#666"
        />
      </TouchableOpacity>
      
      {open && (
        <Modal
          transparent
          animationType="fade"
          visible={open}
          onRequestClose={toggleOpen}
        >
          <TouchableOpacity 
            style={{ 
              flex: 1, 
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
            }} 
            onPress={toggleOpen}
          >
            <View
              style={[
                pickerStyles.absoluteOptions,
                { alignSelf: "center" },
              ]}
            >
              <View style={pickerStyles.optionsHeader}>
                <Text style={pickerStyles.optionsTitle}>Selecione a Categoria</Text>
              </View>
              <ScrollView
                style={pickerStyles.optionsContainer}
                nestedScrollEnabled
              >
                {options.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      pickerStyles.option,
                      selectedValue === opt && pickerStyles.selectedOption,
                    ]}
                    onPress={() => {
                      onValueChange(opt);
                      setOpen(false);
                    }}
                  >
                    <View style={pickerStyles.optionIcon}>
                      <Icon
                        name={getCategoryIcon(opt)}
                        size={22}
                        color="#1976d2"
                      />
                    </View>
                    <Text style={pickerStyles.optionText}>{opt}</Text>
                    {selectedValue === opt && (
                      <View style={pickerStyles.optionCheck}>
                        <Icon name="check" size={22} color="#1976d2" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}




