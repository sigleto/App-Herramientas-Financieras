import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

export function Input({
  style,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  ...inputProps
}) {
  return (
    <View style={[styles.container, containerStyle, style]}>
      <TextInput
        {...inputProps}
        style={[styles.input, inputContainerStyle, inputStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  input: {
    minHeight: 46,
    color: "#102A43",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E1E8F0",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
});
