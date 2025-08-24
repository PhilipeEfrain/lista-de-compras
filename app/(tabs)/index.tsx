import { colorsGraphic } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabBar, TabView } from "react-native-tab-view";
import Icon from "react-native-vector-icons/MaterialIcons";
import { CATEGORIES } from "../../constants/categories";
import { Item } from "../../type/types";



export default function Home() {
  const [title] = useState("Minha Lista de Compras");
  const [newItem, setNewItem] = useState("");
  const [selectedType, setSelectedType] = useState(CATEGORIES[0]);
  const [items, setItems] = useState<Item[]>([]);

  const [index, setIndex] = useState(0);

  const routes = [{ key: "geral", title: "Geral" }].concat(
    Array.from(new Set(items.map((i) => i.type))).map((cat) => ({
      key: cat,
      title: cat,
    }))
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [quantityInput, setQuantityInput] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const json = await AsyncStorage.getItem("@shopping_list");
      if (json) {
        setItems(JSON.parse(json));
      }
    } catch {
      Alert.alert("Erro ao carregar lista");
    }
  }

  async function saveItems(updated: Item[]) {
    try {
      await AsyncStorage.setItem("@shopping_list", JSON.stringify(updated));
    } catch {
      Alert.alert("Erro ao salvar lista");
    }
  }

  function addItem() {
    if (!newItem.trim()) {
      Alert.alert("Digite o nome do item");
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
      Alert.alert("Erro", "Item não selecionado para confirmação.");
      return;
    }

    if (!priceInput || !quantityInput) {
      Alert.alert("Preencha preço e quantidade");
      return;
    }

    const price = parseFloat(priceInput.replace(",", "."));
    const quantity = parseInt(quantityInput, 10);

    if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
      Alert.alert("Valores inválidos");
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

  function renderScene({ route }: { route: { key: string } }) {
    if (route.key === "geral") return renderGroupedList();

    const filtered = items.filter((item) => item.type === route.key);
    return (
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem(item)}
      />
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
      <Text style={styles.title}>{title}</Text>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Adicionar item"
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
          <Button title="Adicionar" onPress={addItem} />
        </View>
      </View>

      <Text style={styles.total}>
        Total gasto: R$ {totalExpense.toFixed(2).replace(".", ",")}
      </Text>

      <ScrollView style={{ flex: 1 }}>
        {/* TabView sem flex: 1 */}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={(props: any) => (
            <TabBar
              {...props}
              scrollEnabled={true}
              indicatorStyle={{ backgroundColor: "blue" }}
              style={{ backgroundColor: "#fff" }}
              activeColor="#1976d2"
              inactiveColor="#888"
              labelStyle={{ fontWeight: "bold", fontSize: 16 }}
            />
          )}
        // Remova o style flex:1 para o TabView aqui
        />
        {/* Gráfico de barras */}
        {items.length > 0 && (
          <>
            <Text style={styles.chartTitle}>Categoria mais cara</Text>
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
          </>
        )}

        {/* Gráfico de pizza */}
        {items.length > 0 && (
          <>
            <Text style={styles.chartTitle}>Itens por categoria</Text>
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
          </>
        )}
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ marginBottom: 8 }}>Preço unitário (R$):</Text>
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

const pickerStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#797979",
    borderRadius: 5,
    backgroundColor: "#fff",
    width: 130,
  },
  selected: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  selectedText: {
    fontSize: 14,
  },
  absoluteOptions: {
    position: "absolute",
    top: 48,
    left: 10,
    right: 10,
    zIndex: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#797979",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  optionsContainer: {
    maxHeight: 150,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  selectedOption: {
    backgroundColor: "#cce5ff",
  },
  optionText: {
    fontSize: 14,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
    flexWrap: "wrap",
  },
  input: {
    flex: 2,
    minWidth: 120,
    borderWidth: 1,
    borderColor: "#797979",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  pickerContainer: {
    flex: 1,
    minWidth: 90,
  },
  buttonContainer: {
    flexBasis: "100%",
    marginTop: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  itemName: { flex: 1, fontSize: 16, textTransform: "capitalize" },
  itemGot: {
    textDecorationLine: "line-through",
    color: "#4caf50",
    fontWeight: "bold",
  },
  itemMissing: {
    color: "#f44336",
    fontWeight: "bold",
    textDecorationLine: "line-through",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: "#eee",
  },
  btnGot: {
    backgroundColor: "#c8e6c9",
  },
  btnMissing: {
    backgroundColor: "#ffcdd2",
  },
  btnText: {
    fontWeight: "bold",
    color: "#333",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#797979",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
    color: "#333",
  },
  itemPriceQuantity: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
    marginRight: 8,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    color: "#1976d2",
  },
});
