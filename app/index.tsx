import AdBanner from "@/components/AdBanner";
import { CategoryPicker } from "@/components/CategoryPicker";
import { pickerStyles } from "@/components/pickerStyles";
import { createStyles } from "@/components/styles";
import { CATEGORIES } from "@/constants/categories";
import { CATEGORY_ICONS } from "@/constants/icons";
import { Strings } from "@/constants/Strings";
import { useTheme } from "@/context/ThemeContext";
import { Item } from "@/type/types";
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatPrice = (value: string): string => {
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";
  const price = (parseInt(numericValue) / 100).toFixed(2);
  return price.replace(".", ",");
};

const formatWeight = (value: string): string => {
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";
  const weight = (parseInt(numericValue) / 1000).toFixed(3);
  return weight.replace(".", ",");
};

export default function Home() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const params = useLocalSearchParams();
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
  const [filter, setFilter] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [priceType, setPriceType] = useState<'fixed' | 'weight'>('fixed');
  const [weightInput, setWeightInput] = useState("");
  const [newItemPriceInput, setNewItemPriceInput] = useState("");

  useEffect(() => {
    loadItems();

    // Processa item da tela de adição de itens (se existir)
    if (params.newItem) {
      try {
        const newItemFromParams = JSON.parse(params.newItem as string) as Item;
        if (newItemFromParams) {
          const updatedItems = [...items, newItemFromParams];
          setItems(updatedItems);
          saveItems(updatedItems);
        }
      } catch (error) {
        console.error("Erro ao processar novo item:", error);
      }
    }
  }, [params.newItem]);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  async function loadItems() {
    try {
      const json = await AsyncStorage.getItem("@shopping_list");
      if (json) {
        const loadedItems = JSON.parse(json);
        setItems(loadedItems);

        const categories = Array.from(new Set(loadedItems.map((item: Item) => item.type))) as string[];
        const initialExpanded = categories.reduce<Record<string, boolean>>((acc, category) => {
          acc[category] = true;
          return acc;
        }, {});
        setExpandedCategories(initialExpanded);
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
    const trimmedName = newItem.trim();
    if (!trimmedName) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_TYPE_ITEM_NAME);
      return;
    }
    const normalized = (str: string) => str.replace(/\s+/g, '').toLowerCase();
    if (items.some(item => normalized(item.name) === normalized(trimmedName))) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_ITEM_ALREADY_EXISTS);
      return;
    }
    const quantity = newItemQuantity ? parseInt(newItemQuantity, 10) : 1;

    const newEntry: Item = {
      id: Date.now()?.toString(),
      name: trimmedName,
      type: selectedType,
      got: false,
      missing: false,
      quantity: quantity
    };

    if (newItemPriceInput) {
      const price = parseFloat(newItemPriceInput.replace(",", "."));
      if (!isNaN(price)) {
        newEntry.price = price;
        newEntry.got = true;
      }
    }

    const updated = [...items, newEntry];
    setItems(updated);
    saveItems(updated);
    setNewItem("");
    setNewItemQuantity("");
    setNewItemPriceInput("");
  }

  function openGotModal(id: string) {
    const item = items.find(item => item.id === id);
    setCurrentItemId(id);
    if (item) {
      setQuantityInput(item.quantity?.toString().padStart(2, "0") || "01");

      if (item.price !== undefined) {
        if (item.weightInfo) {
          setPriceType('weight');
          setPriceInput(formatPrice(item.weightInfo.pricePerKg.toString().replace(".", ",")));
          setWeightInput(formatWeight(item.weightInfo.weight.toString().replace(".", ",")));
        } else {
          setPriceType('fixed');
          setPriceInput(formatPrice(item.price.toString().replace(".", ",")));
          setWeightInput("");
        }
      } else {
        setPriceType('fixed');
        setPriceInput("");
        setWeightInput("");
      }
    }
    setModalVisible(true);
  }

  function confirmGot() {
    if (!currentItemId) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_NO_ITEM_SELECTED);
      return;
    }

    // Não requer mais preço para o modo fixo
    if (priceType === 'weight' && (!priceInput || !weightInput)) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_FILL_WEIGHT_PRICE);
      return;
    }

    let price: number | undefined;

    if (priceInput) {
      if (priceType === 'fixed') {
        price = parseFloat(priceInput.replace(",", "."));
      } else {
        const pricePerKg = parseFloat(priceInput.replace(",", "."));
        const weightInKg = parseFloat(weightInput.replace(",", "."));
        price = pricePerKg * weightInKg;
      }
    }

    const quantity = quantityInput ? parseInt(quantityInput, 10) : 1;

    if (priceInput && isNaN(price!)) {
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
          weightInfo: priceType === 'weight' && price ? {
            pricePerKg: parseFloat(priceInput.replace(",", ".")),
            weight: parseFloat(weightInput.replace(",", "."))
          } : undefined
        }
        : item
    );

    setItems(updated);
    saveItems(updated);

    setModalVisible(false);
    setPriceInput("");
    setQuantityInput("");
    setWeightInput("");
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

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase()) ||
    item.type.toLowerCase().includes(filter.toLowerCase())
  );

  const filteredCategories = Array.from(
    new Set(filteredItems.map(item => item.type))
  );

  function renderItem(item: Item) {
    return (
      <View key={item.id} style={[
        {
          flexDirection: 'column',
          borderBottomWidth: 1,
          borderBottomColor: theme.border + '40',
          marginHorizontal: 0,
          borderRadius: 10,
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginBottom: 4,
          backgroundColor: theme.background + '40',
        }
      ]}>
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
          {/* Informações do item (quantidade e nome) */}
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

          {/* Botões de ação */}
          <TouchableOpacity
            onPress={() => openGotModal(item.id)}
            style={styles.actionButton}
          >
            <MaterialIcons
              name="check"
              size={24}
              color={item.got ? theme.success : theme.text.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleMissing(item.id)}
            style={styles.actionButton}
          >
            <MaterialIcons
              name="close"
              size={24}
              color={item.missing ? theme.danger : theme.text.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => deleteItem(item.id)}
            style={styles.actionButton}
          >
            <MaterialIcons name="delete" size={24} color={theme.danger} />
          </TouchableOpacity>
        </View>

        {/* Segunda linha: valor total em negrito */}
        {item.price !== undefined && (
          <Text style={{
            fontSize: 12,
            fontWeight: "bold",
            color: theme.text.primary,
            marginTop: 1
          }}>
            {Strings.TITLE_TOTAL}: R$ {(item.price * (item.quantity || 1)).toFixed(2).replace(".", ",")}
            {item.weightInfo && ` (${item.weightInfo.weight.toFixed(3).replace(".", ",")} kg)`}
          </Text>
        )}
      </View>
    );
  }

  const totalExpense = items.reduce((acc, item) => {
    if (item.got && item.price && item.quantity) {
      return acc + item.price * item.quantity;
    }
    return acc;
  }, 0);

  function generateWhatsAppText(): string {
    const categoriesMap = items.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {} as Record<string, Item[]>);

    let text = `${Strings.WHATSAPP_LIST_TITLE}\n\n`;

    Object.entries(categoriesMap).forEach(([category, categoryItems]) => {
      text += `*${category}*\n`;
      categoryItems.forEach(item => {
        const status = item.got ? "✅" : item.missing ? "❌" : "⭕";
        const quantity = item.quantity?.toString().padStart(2, "0") || "01";
        let priceInfo = "";

        if (item.price) {
          priceInfo = ` - R$ ${(item.price * (item.quantity || 1)).toFixed(2).replace(".", ",")}`;

          // Adiciona informação de peso se disponível
          if (item.weightInfo) {
            priceInfo += ` (${item.weightInfo.weight.toFixed(3).replace(".", ",")}kg x R$${item.weightInfo.pricePerKg.toFixed(2).replace(".", ",")})`;
          }
        }

        text += `${status} ${quantity}x ${item.name}${priceInfo}\n`;
      });
      text += "\n";
    });

    if (totalExpense > 0) {
      text += `${Strings.WHATSAPP_TOTAL_TITLE}: *R$ ${totalExpense.toFixed(2).replace(".", ",")}*`;
    }

    return text;
  }

  // Função para mostrar anúncios intersticiais foi substituída pelos hooks useInterstitialAd

  async function handleShareWhatsApp() {
    try {
      const text = generateWhatsAppText();
      const encodedText = encodeURIComponent(text);
      
      // Tentar URLs específicas do WhatsApp primeiro
      const whatsappUrls = [
        `whatsapp://send?text=${encodedText}`, // URL nativa do WhatsApp
        `https://wa.me/?text=${encodedText}`,   // URL web do WhatsApp
      ];

      let opened = false;
      
      for (const url of whatsappUrls) {
        try {
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
            opened = true;
            break;
          }
        } catch (urlError) {
          console.log(`Erro ao tentar URL: ${url}`, urlError);
          continue;
        }
      }

      // Se não conseguiu abrir o WhatsApp, oferecer compartilhamento geral
      if (!opened) {
        Alert.alert(
          "WhatsApp não disponível",
          "Não foi possível abrir o WhatsApp. Deseja compartilhar por outro aplicativo?",
          [
            {
              text: "Cancelar",
              style: "cancel"
            },
            {
              text: "Compartilhar",
              onPress: async () => {
                try {
                  await Share.share({
                    message: text,
                    title: "Lista de Compras - Listou"
                  });
                } catch (shareError) {
                  console.error("Erro ao compartilhar:", shareError);
                  Alert.alert("Erro", "Não foi possível compartilhar a lista.");
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      Alert.alert("Erro", "Erro ao tentar compartilhar a lista.");
    }
  }

  return (
    <SafeAreaView style={[styles.container, { paddingHorizontal: 15 }]}>
      {/* Banner de anúncio no topo */}
      <AdBanner placement="top" />
      
      <View style={styles.headerContainer}>
        <View style={styles.actionButtons}>
          {items.length > 0 ? (
            <>
              <TouchableOpacity
                style={[{
                  backgroundColor: '#4caf50', // Verde
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 12,
                  borderRadius: 10,
                  gap: 6,
                  flex: 1,
                  marginRight: 8
                }]}
                onPress={handleShareWhatsApp}
              >
                <MaterialIcons name="share" size={18} color="#fff" />
                <Text style={styles.historyButtonText}>{Strings.BTN_SHARE_WHATSAPP}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[{
                  backgroundColor: theme.primary, // Azul
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 12,
                  borderRadius: 10,
                  gap: 6,
                  flex: 1,
                  marginHorizontal: 4
                }]}
                onPress={() => {
                  setSaveListModalVisible(true);
                }}
              >
                <MaterialIcons name="save" size={18} color="#fff" />
                <Text style={styles.saveButtonText}>{Strings.BTN_SAVE_LIST}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteButton, { flex: 1, marginLeft: 8 }]}
                onPress={() => {
                  Alert.alert(
                    Strings.ALERT_DELETE_LIST,
                    Strings.MSG_DELETE_CONFIRMATION,
                    [
                      {
                        text: Strings.CONFIRM_CANCEL,
                        style: "cancel"
                      },
                      {
                        text: Strings.CONFIRM_OK,
                        style: "destructive",
                        onPress: () => {
                          setItems([]);
                          saveItems([]);
                        }
                      }
                    ]
                  );
                }}
              >
                <MaterialIcons name="delete" size={18} color="#fff" />
                <Text style={styles.deleteButtonText}>{Strings.BTN_CLEAR}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={{ flex: 3 }} />
          )}
        </View>
      </View>

      {items.length > 0 && (
        <View style={{
          marginTop: 5,
          marginBottom: 5,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.surface,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.border,
            padding: 8,
            paddingHorizontal: 15,
            height: 56,
          }}>
            <MaterialIcons name="search" size={20} color={theme.text.secondary} />
            <TextInput
              value={filter}
              onChangeText={setFilter}
              placeholder={Strings.INPUT_FILTER_PLACEHOLDER}
              placeholderTextColor={theme.text.secondary}
              style={{
                flex: 1,
                color: theme.text.primary,
                paddingHorizontal: 8,
                paddingVertical: 4,
                fontSize: 16,
                height: 40,
              }}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {filter.length > 0 && (
              <TouchableOpacity
                onPress={() => setFilter('')}
                style={{
                  padding: 8,
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MaterialIcons name="close" size={20} color={theme.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => {
            const categoryItems = filteredItems.filter((item: Item) => item.type === category);
            const isExpanded = expandedCategories[category] !== false;

            return (
              <View key={category} style={[styles.categoryGroup, {
                marginBottom: 10,
                backgroundColor: 'transparent',
                borderRadius: 8,
                padding: 0,
                paddingBottom: isExpanded ? 6 : 0,
                elevation: 0,
                shadowOpacity: 0,
              }]}>
                <TouchableOpacity
                  onPress={() => toggleCategory(category)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    backgroundColor: theme.card,
                    borderRadius: 10,
                    marginBottom: isExpanded ? 8 : 0,
                    marginTop: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: theme.primary,
                    elevation: 2,
                    shadowColor: theme.shadow.color,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <MaterialIcons
                      name={isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-right"}
                      size={24}
                      color={theme.text.primary}
                    />
                    <Text style={[styles.categoryTitle, {
                      marginLeft: 10,
                      flex: 1,
                      paddingBottom: 0,
                      marginBottom: 0,
                      borderBottomWidth: 0
                    }]}>
                      {category} ({categoryItems.length})
                    </Text>
                  </View>
                  <MaterialIcons
                    name={(CATEGORY_ICONS[category] || "label") as any}
                    size={22}
                    color={theme.primary}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={{
                    marginTop: 4,
                    backgroundColor: theme.surface + '60',
                    borderRadius: 10,
                    paddingTop: 8,
                    paddingBottom: 8
                  }}>
                    {categoryItems.map(item => renderItem(item))}
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyStateContainer}>
            <TouchableOpacity
              style={styles.addButtonCentered}
              onPress={() => router.push('/add-item')}
            >
              <MaterialIcons name="add" size={36} color="#fff" />
              <Text style={styles.addButtonText}>{Strings.BTN_ADD_ITEM}</Text>
            </TouchableOpacity>
          </View>
        )}

        {items.length > 0 && (
          <View style={{ padding: 10, paddingBottom: 10 }}>
            {items.filter(item => item.missing).length > 0 && (
              <TouchableOpacity
                style={styles.missingListButton}
                onPress={() => {
                  Alert.alert(
                    Strings.TITLE_KEEP_MISSING,
                    Strings.MSG_KEEP_MISSING_ITEMS,
                    [
                      {
                        text: Strings.CONFIRM_CANCEL,
                        style: "cancel"
                      },
                      {
                        text: Strings.CONFIRM_CONFIRM,
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
                  {Strings.TITLE_KEEP_MISSING}
                </Text>
              </TouchableOpacity>
            )}

            {items.length > 0 && (
              <>
                <TouchableOpacity
                  style={styles.chartsButton}
                  onPress={() => setShowCharts(!showCharts)}
                >
                  <MaterialIcons name={showCharts ? "keyboard-arrow-up" : "bar-chart"} size={24} color="#fff" />
                  <Text style={styles.chartsButtonText}>
                    {showCharts ? Strings.BTN_HIDE_CHARTS : Strings.BTN_TOGGLE_CHARTS}
                  </Text>
                </TouchableOpacity>

                {showCharts && (
                  <View style={[styles.chartsContainer, { backgroundColor: theme.card }]}>
                    <Text style={styles.chartTitle}>{Strings.CHART_PRODUCTS_BY_VALUE}</Text>
                    <View style={styles.statisticsList}>
                      {items
                        .filter(item => item.got && item.price)
                        .sort((a, b) => (b.price || 0) - (a.price || 0))
                        .map((item, index) => (
                          <View key={item.id} style={styles.statisticsItem}>
                            <View style={styles.statisticsRank}>
                              <Text style={styles.statisticsRankText}>#{index + 1}</Text>
                            </View>
                            <View style={styles.statisticsContent}>
                              <Text style={styles.statisticsTitle}>{item.name}</Text>
                              <Text style={styles.statisticsValue}>
                                R$ {item.price?.toFixed(2).replace(".", ",")}
                              </Text>
                            </View>
                          </View>
                        ))}
                    </View>

                    <Text style={[styles.chartTitle, { marginTop: 20 }]}>{Strings.CHART_ITEMS_BY_CATEGORY}</Text>
                    <View style={styles.statisticsList}>
                      {Object.entries(
                        items.reduce((acc, item) => {
                          acc[item.type] = (acc[item.type] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, count], index) => (
                          <View key={category} style={styles.statisticsItem}>
                            <View style={[styles.statisticsRank, { backgroundColor: theme.primary }]}>
                              <MaterialIcons
                                name={(CATEGORY_ICONS[category] || "label") as any}
                                size={20}
                                color={theme.text.inverse}
                              />
                            </View>
                            <View style={styles.statisticsContent}>
                              <Text style={styles.statisticsTitle}>{category}</Text>
                              <Text style={styles.statisticsValue}>
                                {count} {count === 1 ? 'item' : 'itens'}
                              </Text>
                            </View>
                          </View>
                        ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>

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
                <MaterialIcons name="close" size={24} color={theme.text.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>{Strings.TITLE_PRODUCT_CATEGORY}</Text>
            <View style={{ marginBottom: 15 }}>
              <CategoryPicker
                selectedValue={selectedType}
                onValueChange={setSelectedType}
                options={CATEGORIES}
              />
            </View>

            <Text style={styles.inputLabel}>{Strings.TITLE_ITEM_NAME}</Text>
            <TextInput
              value={newItem}
              onChangeText={setNewItem}
              style={styles.itemNameInput}
              returnKeyType="done"
              placeholder={Strings.MSG_TYPE_ITEM_NAME}
              placeholderTextColor={theme.text.secondary}
              autoCapitalize="sentences"
            />

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

            <Text style={styles.inputLabel}>{Strings.INPUT_UNIT_PRICE}</Text>
            <TextInput
              value={newItemPriceInput}
              onChangeText={(text) => {
                setNewItemPriceInput(formatPrice(text));
              }}
              keyboardType="numeric"
              placeholder="0,00"
              placeholderTextColor={theme.text.secondary}
              style={[styles.modalInput, { textAlign: 'right' }]}
              returnKeyType="done"
            />

            <TouchableOpacity
              style={[styles.saveButton, { marginTop: 10, justifyContent: 'center' }]}
              onPress={() => {
                addItem();
                setAddItemModalVisible(false);
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>{Strings.BTN_ADD_ITEM}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                <MaterialIcons name="close" size={24} color={theme.text.primary} />
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
                      }
                    ]
                  );
                } catch (error) {
                  Alert.alert(Strings.ALERT_ERROR, Strings.MSG_ERROR_SAVE_LIST);
                }
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="save" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>{Strings.CONFIRM_OK}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{Strings.INPUT_ITEM_PRICE}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={theme.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Opções de tipo de preço */}
            <View style={{ flexDirection: 'row', marginBottom: 15, marginTop: 5 }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 20,
                  opacity: priceType === 'fixed' ? 1 : 0.6
                }}
                onPress={() => setPriceType('fixed')}
              >
                <MaterialIcons
                  name={priceType === 'fixed' ? 'radio-button-checked' : 'radio-button-unchecked'}
                  size={20}
                  color={theme.primary}
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: theme.text.primary, fontSize: 16 }}>
                  {Strings.TITLE_FIXED_PRICE}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  opacity: priceType === 'weight' ? 1 : 0.6
                }}
                onPress={() => setPriceType('weight')}
              >
                <MaterialIcons
                  name={priceType === 'weight' ? 'radio-button-checked' : 'radio-button-unchecked'}
                  size={20}
                  color={theme.primary}
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: theme.text.primary, fontSize: 16 }}>
                  {Strings.TITLE_PRICE_PER_KG}
                </Text>
              </TouchableOpacity>
            </View>

            {priceType === 'fixed' ? (
              <>
                <Text style={styles.inputLabel}>{Strings.INPUT_ITEM_PRICE}</Text>
                <TextInput
                  value={priceInput}
                  onChangeText={(text) => {
                    setPriceInput(formatPrice(text));
                  }}
                  keyboardType="numeric"
                  placeholder="0,00"
                  placeholderTextColor={theme.text.secondary}
                  style={[styles.modalInput, { textAlign: 'right' }]}
                  returnKeyType="done"
                />
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>{Strings.INPUT_PRICE_PER_KG}</Text>
                <TextInput
                  value={priceInput}
                  onChangeText={(text) => {
                    setPriceInput(formatPrice(text));
                  }}
                  keyboardType="numeric"
                  placeholder="0,00"
                  placeholderTextColor={theme.text.secondary}
                  style={[styles.modalInput, { textAlign: 'right' }]}
                  returnKeyType="done"
                />

                <Text style={styles.inputLabel}>{Strings.INPUT_ITEM_WEIGHT}</Text>
                <TextInput
                  value={weightInput}
                  onChangeText={(text) => {
                    setWeightInput(formatWeight(text));
                  }}
                  keyboardType="numeric"
                  placeholder="0,000"
                  placeholderTextColor={theme.text.secondary}
                  style={[styles.modalInput, { textAlign: 'right' }]}
                  returnKeyType="done"
                />

                {(priceInput && weightInput) ? (
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 8,
                    marginBottom: 10,
                    backgroundColor: theme.surface + '60',
                    padding: 8,
                    borderRadius: 4
                  }}>
                    <MaterialIcons name="calculate" size={20} color={theme.success} style={{ marginRight: 8 }} />
                    <Text style={{ color: theme.text.primary, fontWeight: '500' }}>
                      {Strings.TITLE_TOTAL}: R$ {(
                        parseFloat(priceInput.replace(',', '.')) *
                        parseFloat(weightInput.replace(',', '.'))
                      ).toFixed(2).replace('.', ',')}
                    </Text>
                  </View>
                ) : null}
              </>
            )}

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
              style={[styles.quantityInput, { color: theme.text.primary, textAlign: 'right' }]}
              returnKeyType="done"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.saveButton, { flex: 1, marginRight: 8 }]}
                onPress={confirmGot}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="check" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.saveButtonText}>{Strings.CONFIRM_OK}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteButton, { flex: 1 }]}
                onPress={() => setModalVisible(false)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="close" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.deleteButtonText}>{Strings.CONFIRM_CANCEL}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Banner de anúncio no rodapé */}
      <AdBanner placement="bottom" />
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
            <MaterialIcons
              name={getCategoryIcon(selectedValue) as any}
              size={22}
              color="#1976d2"
            />
          </View>
          <Text style={pickerStyles.selectedText}>{selectedValue}</Text>
        </View>
        <MaterialIcons
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
                <Text style={pickerStyles.optionsTitle}>{Strings.TITLE_PRODUCT_CATEGORY}</Text>
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
                      <MaterialIcons
                        name={getCategoryIcon(opt) as any}
                        size={22}
                        color="#1976d2"
                      />
                    </View>
                    <Text style={pickerStyles.optionText}>{opt}</Text>
                    {selectedValue === opt && (
                      <View style={pickerStyles.optionCheck}>
                        <MaterialIcons name="check" size={22} color="#1976d2" />
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
