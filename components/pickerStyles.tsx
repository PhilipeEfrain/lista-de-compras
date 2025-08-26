import { StyleSheet } from "react-native";

export const pickerStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#797979",
    borderRadius: 5,
    backgroundColor: "#fff",
    width: "100%",
  },
  selected: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectedIcon: {
    marginRight: 8,
  },
  selectedText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  absoluteOptions: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "90%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  optionsHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  optionsContainer: {
    maxHeight: 300,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#f5f5f5",
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  optionCheck: {
    marginLeft: 8,
  },
});