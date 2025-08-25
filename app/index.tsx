import { pickerStyles } from "@/components/pickerStyles";
import { styles } from "@/components/styles";
import { CATEGORIES } from "@/constants/categories";
import { colorsGraphic } from "@/constants/Colors";
import { Strings } from "@/constants/Strings";
import { Item } from "@/type/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Button,
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
  const [title] = useState(Strings.APP_TITLE);
  const [newItem, setNewItem] = useState("");
  const [selectedType, setSelectedType] = useState(CATEGORIES[0]);
  const [items, setItems] = useState<Item[]>([]);
  const [showCharts, setShowCharts] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [quantityInput, setQuantityInput] = useState("");

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

      const allItemsGot = updated.length > 0 && updated.every(item => item.got);
      if (allItemsGot) {
        const totalSpent = updated.reduce((acc, item) => {
          if (item.got && item.price && item.quantity) {
            return acc + (item.price * item.quantity);
          }
          return acc;
        }, 0);

        const completedList = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          items: updated,
          totalSpent
        };

        const historyJson = await AsyncStorage.getItem("@shopping_history");
        const history = historyJson ? JSON.parse(historyJson) : [];

        const updatedHistory = [...history, completedList];
        await AsyncStorage.setItem("@shopping_history", JSON.stringify(updatedHistory));
        setItems([]);
        await AsyncStorage.setItem("@shopping_list", JSON.stringify([]));

        Alert.alert(
          "Lista Concluída!",
          "Todos os itens foram comprados. A lista foi movida para o histórico.",
          [
            {
              text: "Ver Histórico",
              onPress: () => router.push("history" as any),
            },
            {
              text: "OK",
              style: "cancel"
            }
          ]
        );
      }
    } catch {
      Alert.alert("Erro ao salvar lista");
    }
  }

  function addItem() {
    if (!newItem.trim()) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_TYPE_ITEM_NAME);
      return;
    }
    const newEntry: Item = {
      id: Date.now().toString(),
      name: newItem.trim(),
      type: selectedType,
      got: false,
      missing: false,
    };
    const updated = [...items, newEntry];
    setItems(updated);
    saveItems(updated);
    setNewItem("");
  }

  function openGotModal(id: string) {
    setCurrentItemId(id);
    setModalVisible(true);
  }

  function confirmGot() {
    if (!currentItemId) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_NO_ITEM_SELECTED);
      return;
    }

    if (!priceInput || !quantityInput) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_FILL_PRICE_QUANTITY);
      return;
    }

    const price = parseFloat(priceInput.replace(",", "."));
    const quantity = parseInt(quantityInput, 10);

    if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
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
          quantity: undefined,
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
          <Text
            style={[
              styles.itemName,
              item.got && styles.itemGot,
              !item.got && item.missing && styles.itemMissing,
            ]}
          >
            {item.name}
          </Text>

          {item.price !== undefined && item.quantity !== undefined && (
            <Text style={styles.itemPriceQuantity}>
              {"  "}R$ {item.price.toFixed(2).replace(".", ",")} x{" "}
              {item.quantity} = R${" "}
              {(item.price * item.quantity).toFixed(2).replace(".", ",")}
            </Text>
          )}
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() => openGotModal(item.id)}
            style={[styles.btn, item.got && styles.btnGot]}
          >
            <Icon
              name="check"
              size={24}
              color={item.got ? "#2e7d32" : "#333"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleMissing(item.id)}
            style={[styles.btn, item.missing && styles.btnMissing]}
          >
            <Icon
              name="close"
              size={24}
              color={item.missing ? "#c62828" : "#333"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => deleteItem(item.id)}
            style={styles.btn}
          >
            <Icon name="delete" size={24} color="red" />
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

  function getPieChartData() {
    const countByCategory: Record<string, number> = {};

    items.forEach((item) => {
      countByCategory[item.type] = (countByCategory[item.type] || 0) + 1;
    });

    return Object.entries(countByCategory).map(([key, value], i) => ({
      name: key,
      population: value,
      color: colorsGraphic[i % colorsGraphic.length],
      legendFontColor: "#333",
      legendFontSize: 14,
    }));
  }

  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          placeholder={Strings.INPUT_ITEM_NAME}
          value={newItem}
          onChangeText={setNewItem}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={addItem}
        />

        <View style={styles.pickerContainer}>
          <PickerDropdown
            selectedValue={selectedType}
            onValueChange={setSelectedType}
            options={CATEGORIES}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title={Strings.BTN_ADD_ITEM} onPress={addItem} />
        </View>
      </View>

      <View style={styles.headerButtons}>
        {items.length > 0 && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.deleteButton}
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
              <Icon name="delete" size={20} color="#fff" />
              <Text style={styles.deleteButtonText}>{Strings.BTN_DELETE_LIST}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={async () => {
                try {
                  const listToSave = {
                    id: Date.now().toString(),
                    date: new Date().toISOString(),
                    items: items,
                    totalSpent: totalExpense
                  };

                  const historyJson = await AsyncStorage.getItem("@shopping_history");
                  const history = historyJson ? JSON.parse(historyJson) : [];
                  const updatedHistory = [...history, listToSave];
                  await AsyncStorage.setItem("@shopping_history", JSON.stringify(updatedHistory));

                  // Limpa a lista atual
                  setItems([]);
                  await AsyncStorage.setItem("@shopping_list", JSON.stringify([]));

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
                  Alert.alert("Erro ao salvar lista no histórico");
                }
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
        )}
        <Text style={styles.total}>
          Total gasto: R$ {totalExpense.toFixed(2).replace(".", ",")}
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem(item)}
        ListFooterComponent={() => {
          const missingItems = items.filter(item => item.missing);

          return (
            <View style={{ padding: 10 }}>
              {missingItems.length > 0 && (
                <TouchableOpacity
                  style={styles.missingListButton}
                  onPress={() => {
                    const updatedList = missingItems.map(item => ({
                      ...item,
                      missing: false,
                      got: false,
                      price: undefined,
                      quantity: undefined
                    }));

                    // Atualiza a lista apenas com os itens que estavam faltando
                    setItems(updatedList);
                    saveItems(updatedList);
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
                    <View style={styles.chartsContainer}>
                      <Text style={styles.chartTitle}>{Strings.CHART_SPENDING_BY_CATEGORY}</Text>
                      <BarChart
                        data={getBarChartData()}
                        width={screenWidth - 40}
                        height={220}
                        yAxisLabel="R$ "
                        yAxisSuffix=""
                        chartConfig={{
                          backgroundGradientFrom: "#fff",
                          backgroundGradientTo: "#fff",
                          decimalPlaces: 2,
                          color: (opacity) => `rgba(25, 118, 210, ${opacity})`,
                          labelColor: () => "#333",
                          style: { borderRadius: 16 },
                          propsForDots: { r: "6", strokeWidth: "2", stroke: "#1976d2" },
                        }}
                        verticalLabelRotation={30}
                        style={{ borderRadius: 16, marginVertical: 10 }}
                        fromZero
                        showValuesOnTopOfBars
                      />

                      <Text style={styles.chartTitle}>{Strings.CHART_ITEMS_BY_CATEGORY}</Text>
                      <PieChart
                        data={getPieChartData()}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
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

      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ marginBottom: 8 }}>{Strings.INPUT_ITEM_PRICE}:</Text>
            <TextInput
              value={priceInput}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9,]/g, "");
                setPriceInput(clean);
              }}
              keyboardType="numeric"
              placeholder="Ex: 12,50"
              style={styles.modalInput}
              returnKeyType="done"
            />

            <Text style={{ marginBottom: 8 }}>Quantidade:</Text>
            <TextInput
              value={quantityInput}
              onChangeText={setQuantityInput}
              keyboardType="numeric"
              placeholder="Ex: 2"
              style={styles.modalInput}
              returnKeyType="done"
            />

            <View style={styles.modalButtons}>
              <Button title="Confirmar" onPress={confirmGot} />
              <Button
                title="Cancelar"
                color="red"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
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

  return (
    <View style={pickerStyles.container}>
      <TouchableOpacity
        style={pickerStyles.selected}
        onPress={toggleOpen}
        activeOpacity={0.7}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={pickerStyles.selectedText}>{selectedValue}</Text>
          <Icon
            name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={20}
            color="#555"
            style={{ marginLeft: 6 }}
          />
        </View>
      </TouchableOpacity>
      {open && (
        <Modal
          transparent
          animationType="fade"
          visible={open}
          onRequestClose={toggleOpen}
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={toggleOpen}>
            <View
              style={[
                pickerStyles.absoluteOptions,
                { alignSelf: "center", marginTop: 100 },
              ]}
            >
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
                    <Text style={pickerStyles.optionText}>{opt}</Text>
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




