import { StyleSheet } from "react-native";

export const pickerStyles = StyleSheet.create({
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