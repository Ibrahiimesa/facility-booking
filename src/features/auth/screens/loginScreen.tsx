import CustomButton from "@/src/components/button/CustomButton";
import Spacer from "@/src/components/Spacer";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import AuthInput from "../components/authInput";
import { useAuthStore } from "../store/authStore";
import { loginSchema } from "../validation/loginSchema";

type FormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
   const { login, loading } = useAuthStore();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await login(data.email, data.password);
      router.replace("/(tabs)/facility-list");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#ffecd2", "#fcb69f"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.logoText}>Booking</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.title}>Sign in Your Account</Text>
        <AuthInput
          placeholder="Enter Your Email"
          iconName="mail-outline"
          onChangeText={(text) => setValue("email", text)}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <Spacer height={8} />
        <AuthInput
          placeholder="Enter Your Password"
          iconName="lock-closed-outline"
          secureTextEntry
          onChangeText={(text) => setValue("password", text)}
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}
        <Spacer height={16} />
        <CustomButton title={loading ? "Signing In..." : "Sign In"} onPress={handleSubmit(onSubmit)} />
        <Spacer height={8} />
        <View style={styles.signupRow}>
          <Text>Don’t have an account? </Text>
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.signupText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: { alignItems: "center", paddingTop: 60, paddingBottom: 60 },
  logoText: { fontSize: 28, fontWeight: "bold", color: "#333" },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    marginTop: -20,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
  },

  error: { color: "red", fontSize: 12, marginBottom: 4 },
  signupRow: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  signupText: { color: "#f7931e", fontWeight: "600" },
});
