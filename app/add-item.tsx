import { CategoryPicker } from '@/components/CategoryPicker';
import { Collapsible } from '@/components/Collapsible';
import { ThemedView } from '@/components/ThemedView';
import { CATEGORIES } from '@/constants/categories';
import { Strings } from '@/constants/Strings';
import { useTheme } from '@/context/ThemeContext';
import { Item } from '@/type/types';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Função para gerar ID único
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export default function AddItemScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [quantity, setQuantity] = useState('1');
  const [isWeighted, setIsWeighted] = useState(false);
  const [weight, setWeight] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [price, setPrice] = useState('');

  const handleSaveItem = () => {
    if (!itemName.trim()) {
      Alert.alert(Strings.ALERT_ERROR, Strings.MSG_TYPE_ITEM_NAME);
      return;
    }

    const quantityNum = parseFloat(quantity) || 1;
    let priceNum = 0;

    if (isWeighted) {
      const weightNum = parseFloat(weight);
      const pricePerKgNum = parseFloat(pricePerKg);
      
      if (isNaN(weightNum) || isNaN(pricePerKgNum)) {
        Alert.alert(Strings.ALERT_ERROR, Strings.MSG_INVALID_VALUES);
        return;
      }
      
      priceNum = weightNum * pricePerKgNum;
    } else if (price) {
      priceNum = parseFloat(price);
      
      if (isNaN(priceNum)) {
        Alert.alert(Strings.ALERT_ERROR, Strings.MSG_INVALID_VALUES);
        return;
      }
    }

    const newItem: Item = {
      id: generateId(),
      name: itemName.trim(),
      type: category,
      got: false,
      missing: true,
      price: priceNum > 0 ? priceNum : undefined,
      quantity: quantityNum,
      ...(isWeighted && {
        weightInfo: {
          weight: parseFloat(weight),
          pricePerKg: parseFloat(pricePerKg)
        }
      })
    };

    // Aqui você adicionaria este item à sua lista em um contexto real
    // Para fins de demonstração, vamos apenas navegar de volta com o item
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
            <Text style={styles.label}>{Strings.TITLE_PRODUCT_CATEGORY}</Text>
            <CategoryPicker
              selectedValue={category}
              onValueChange={setCategory}
              options={CATEGORIES}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{Strings.TITLE_QUANTITY}</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor={theme.text.secondary}
            />
          </View>

          <Collapsible title="Produto por peso/kg">
            <View style={styles.weightContainer}>
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Produto vendido por peso</Text>
                <TouchableOpacity 
                  style={[styles.toggle, isWeighted && styles.toggleActive]}
                  onPress={() => setIsWeighted(!isWeighted)}
                >
                  <View style={[styles.toggleHandle, isWeighted && styles.toggleHandleActive]} />
                </TouchableOpacity>
              </View>

              {isWeighted ? (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Peso (kg)</Text>
                    <TextInput
                      style={styles.input}
                      value={weight}
                      onChangeText={setWeight}
                      keyboardType="numeric"
                      placeholder="0.5"
                      placeholderTextColor={theme.text.secondary}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Preço por kg</Text>
                    <TextInput
                      style={styles.input}
                      value={pricePerKg}
                      onChangeText={setPricePerKg}
                      keyboardType="numeric"
                      placeholder="9.90"
                      placeholderTextColor={theme.text.secondary}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Preço unitário</Text>
                  <TextInput
                    style={styles.input}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor={theme.text.secondary}
                  />
                </View>
              )}
            </View>
          </Collapsible>
        </ThemedView>
      </ScrollView>
      
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
          <Text style={styles.saveButtonText}>{Strings.BTN_ADD_ITEM}</Text>
        </TouchableOpacity>
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
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Adicionar espaço para o botão no final
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: theme.text.inverse,
    fontWeight: 'bold',
  },
});
