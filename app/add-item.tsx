import AdBanner from '@/components/AdBanner';
import { CategoryPicker } from '@/components/CategoryPicker';
import { Collapsible } from '@/components/Collapsible';
import { ThemedView } from '@/components/ThemedView';
import { CATEGORIES } from '@/constants/categories';
import { Strings } from '@/constants/Strings';
import { usePremium } from '@/context/PremiumContext';
import { useTheme } from '@/context/ThemeContext';
import { Item } from '@/type/types';
import { InterstitialAdManager } from '@/utils/AdManager';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Função para gerar ID único
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

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

export default function AddItemScreen() {
  const { theme } = useTheme();
  const { isPremium } = usePremium();
  const styles = createStyles(theme);

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [quantityInput, setQuantityInput] = useState('1');
  const [priceType, setPriceType] = useState<'fixed' | 'weight'>('fixed');
  const [weightInput, setWeightInput] = useState('');
  const [priceInput, setPriceInput] = useState('');

  const resetFields = useCallback(() => {
    setItemName('');
    setQuantityInput('1');
    setPriceType('fixed');
    setWeightInput('');
    setPriceInput('');
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetFields();
    }, [resetFields])
  );

  const handleSaveItem = () => {
    if (!itemName.trim()) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_TYPE_ITEM_NAME);
      return;
    }

    const quantity = parseInt(quantityInput, 10) || 1;
    let price: number | undefined;

    if (priceInput) {
      if (priceType === 'fixed') {
        price = parseFloat(priceInput.replace(",", "."));
      } else {
        const pricePerKg = parseFloat(priceInput.replace(",", "."));
        const weightInKg = parseFloat(weightInput.replace(",", "."));
        
        if (isNaN(weightInKg) || isNaN(pricePerKg)) {
          Alert.alert(Strings.ALERT_ERROR, Strings.MSG_FILL_WEIGHT_PRICE);
          return;
        }
        
        price = pricePerKg * weightInKg;
      }
    }

    if (priceInput && isNaN(price!)) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_INVALID_VALUES);
      return;
    }

    // Mostrar anúncio intersticial quando adicionar um novo item
    if (!isPremium) {
      InterstitialAdManager.show();
    }

    const newItem: Item = {
      id: generateId(),
      name: itemName.trim(),
      type: category,
      got: price !== undefined,
      missing: false,
      price: price,
      quantity: quantity,
      ...(priceType === 'weight' && price && {
        weightInfo: {
          weight: parseFloat(weightInput.replace(",", ".")),
          pricePerKg: parseFloat(priceInput.replace(",", "."))
        }
      })
    };

    router.navigate({
      pathname: "/",
      params: { newItem: JSON.stringify(newItem) }
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {/* Banner de anúncio no topo */}
      <AdBanner placement="top" />
      
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Icon name="arrow-back" size={24} color={theme.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>{Strings.TITLE_ADD_ITEM}</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{Strings.TITLE_PRODUCT_CATEGORY}</Text>
            <CategoryPicker
              selectedValue={category}
              onValueChange={setCategory}
              options={CATEGORIES}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{Strings.TITLE_ITEM_NAME}</Text>
            <TextInput
              style={styles.input}
              value={itemName}
              onChangeText={setItemName}
              placeholder={Strings.INPUT_ITEM_NAME}
              placeholderTextColor={theme.text.secondary}
              autoCapitalize="sentences"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{Strings.TITLE_QUANTITY}</Text>
            <TextInput
              style={styles.input}
              value={quantityInput}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9]/g, "");
                setQuantityInput(clean);
              }}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor={theme.text.secondary}
            />
          </View>

          <Collapsible title={Strings.TITLE_WEIGHTED_PRODUCT}>
            <View style={styles.weightContainer}>
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>{Strings.TITLE_WEIGHTED_PRODUCT}</Text>
                <TouchableOpacity 
                  style={[styles.toggle, priceType === 'weight' && styles.toggleActive]}
                  onPress={() => setPriceType(priceType === 'fixed' ? 'weight' : 'fixed')}
                >
                  <View style={[styles.toggleHandle, priceType === 'weight' && styles.toggleHandleActive]} />
                </TouchableOpacity>
              </View>

              {priceType === 'weight' ? (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>{Strings.INPUT_ITEM_WEIGHT}</Text>
                    <TextInput
                      style={styles.input}
                      value={weightInput}
                      onChangeText={(text) => {
                        setWeightInput(formatWeight(text));
                      }}
                      keyboardType="numeric"
                      placeholder="0,000"
                      placeholderTextColor={theme.text.secondary}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>{Strings.INPUT_PRICE_PER_KG}</Text>
                    <TextInput
                      style={styles.input}
                      value={priceInput}
                      onChangeText={(text) => {
                        setPriceInput(formatPrice(text));
                      }}
                      keyboardType="numeric"
                      placeholder="0,00"
                      placeholderTextColor={theme.text.secondary}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>{Strings.INPUT_UNIT_PRICE}</Text>
                  <TextInput
                    style={styles.input}
                    value={priceInput}
                    onChangeText={(text) => {
                      setPriceInput(formatPrice(text));
                    }}
                    keyboardType="numeric"
                    placeholder="0,00"
                    placeholderTextColor={theme.text.secondary}
                  />
                </View>
              )}
            </View>
          </Collapsible>
        </ThemedView>
      </ScrollView>
      
      <View style={styles.footerContainer}>
        {/* Banner de anúncio no rodapé */}
        <AdBanner placement="bottom" />
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>{Strings.CONFIRM_CANCEL}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveItem}
          >
            <Icon name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.saveButtonText}>{Strings.BTN_ADD_ITEM}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
    marginBottom: 120,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text.primary,
  },
  placeholder: {
    width: 40,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: theme.text.primary,
  },
  input: {
    backgroundColor: theme.surface,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: theme.text.primary,
    borderWidth: 1,
    borderColor: theme.border,
  },
  weightContainer: {
    padding: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 16,
    color: theme.text.primary,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.states.disabled,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: theme.primary,
  },
  toggleHandle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.background,
  },
  toggleHandleActive: {
    transform: [{ translateX: 20 }],
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.background,
  },
  footer: {
    backgroundColor: theme.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.text.primary,
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: theme.primary,
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: theme.text.inverse,
    fontWeight: 'bold',
  },
});
