import CustomButton from "@/src/components/button/CustomButton";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "../../auth/store/authStore";

export default function ProfileScreen() {
  const { name, email, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{name || "-"}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email || "-"}</Text>
      </View>
      <CustomButton
        title="Logout"
        onPress={() => {
          Alert.alert(
            "Confirm Logout",
            "Are you sure you want to log out?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Yes", onPress: logout },
            ],
            { cancelable: true }
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
