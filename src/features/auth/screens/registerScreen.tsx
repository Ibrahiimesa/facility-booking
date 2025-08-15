import Spacer from "@/src/components/Spacer";
import CustomButton from "@/src/components/button/CustomButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import AuthInput from "../components/authInput";
import { useAuthStore } from "../store/authStore";
import { registerSchema } from "../validation/registerSchema";

type FormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { register, loading } = useAuthStore();
  const { handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await register(data.name, data.email, data.password);
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
        <Text style={styles.title}>Create An Account</Text>
        <AuthInput
          placeholder="Enter Your Name"
          iconName="person-outline"
          onChangeText={(text) => setValue("name", text)}
        />
        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

        <Spacer height={8} />
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
        <CustomButton title={loading ? "Loading..." : "Sign Up"} onPress={handleSubmit(onSubmit)} />
        <Spacer height={8} />
        <View style={styles.signupRow}>
          <Text>Already have an account? </Text>
          <Pressable 
            onPress={() => {
              router.back();
            }}
          >
            <Text style={styles.signupText}>Sign In</Text>
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
