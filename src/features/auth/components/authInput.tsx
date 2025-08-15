import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface AuthInputProps {
  placeholder: string;
  iconName: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
}

export default function AuthInput({
  placeholder,
  iconName,
  secureTextEntry = false,
  onChangeText,
}: AuthInputProps) {
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  return (
    <View style={styles.inputWrapper}>
      <Ionicons name={iconName} size={20} color="#2f4f4f" style={styles.icon} />

      <TextInput
        placeholder={placeholder}
        secureTextEntry={hidePassword}
        onChangeText={onChangeText}
        style={styles.input}
      />

      {secureTextEntry && (
        <Pressable onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#aaa"
            style={styles.iconRight}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  icon: { marginRight: 6 },
  iconRight: { marginLeft: 6 },
  input: { flex: 1, paddingVertical: 10 },
});
