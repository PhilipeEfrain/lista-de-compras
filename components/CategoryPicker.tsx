import { CATEGORY_ICONS } from "@/constants/icons";
import { Theme } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface CategoryPickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: string[];
}

export function CategoryPicker({ selectedValue, onValueChange, options }: CategoryPickerProps) {
  const { theme } = useTheme();
  const styles = createCategoryPickerStyles(theme);
  const [open, setOpen] = useState(false);

  function toggleOpen() {
    setOpen((prev) => !prev);
  }

  function getCategoryIcon(category: string) {
    const icons: { [key: string]: string } = CATEGORY_ICONS
    return icons[category] || "label";
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selected}
        onPress={toggleOpen}
        activeOpacity={0.7}
      >
        <View style={styles.selectedLeft}>
          <View style={styles.selectedIcon}>
            <Icon
              name={getCategoryIcon(selectedValue)}
              size={22}
              color={theme.primary}
            />
          </View>
          <Text style={styles.selectedText}>{selectedValue}</Text>
        </View>
        <Icon
          name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color={theme.text.secondary}
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
            style={styles.overlay} 
            onPress={toggleOpen}
          >
            <View style={[styles.absoluteOptions, { alignSelf: "center" }]}>
              <View style={styles.optionsHeader}>
                <Text style={styles.optionsTitle}>Selecione a Categoria</Text>
              </View>
              <ScrollView
                style={styles.optionsContainer}
                nestedScrollEnabled
              >
                {options.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.option,
                      selectedValue === opt && styles.selectedOption,
                    ]}
                    onPress={() => {
                      onValueChange(opt);
                      setOpen(false);
                    }}
                  >
                    <View style={styles.optionIcon}>
                      <Icon
                        name={getCategoryIcon(opt)}
                        size={22}
                        color={theme.primary}
                      />
                    </View>
                    <Text style={styles.optionText}>{opt}</Text>
                    {selectedValue === opt && (
                      <View style={styles.optionCheck}>
                        <Icon name="check" size={22} color={theme.primary} />
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

const createCategoryPickerStyles = (theme: Theme) => StyleSheet.create({
  container: {
    width: "100%",
  },
  selected: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: theme.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectedIcon: {
    marginRight: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedText: {
    fontSize: 16,
    color: theme.text.primary,
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  absoluteOptions: {
    width: "80%",
    maxHeight: 400,
    backgroundColor: theme.modal,
    borderRadius: 12,
    elevation: 8,
    shadowColor: theme.shadow.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.shadow.opacity,
    shadowRadius: 8,
  },
  optionsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text.primary,
    textAlign: "center",
  },
  optionsContainer: {
    maxHeight: 350,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: theme.surface,
  },
  optionIcon: {
    marginRight: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 16,
    color: theme.text.primary,
    flex: 1,
  },
  optionCheck: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
