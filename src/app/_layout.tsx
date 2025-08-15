import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';

import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../features/auth/store/authStore";

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, loading, loadToken } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    if (!loading) {
      const inAuthGroup = (segments[0] as string) === "(auth)";

      if (!token && !inAuthGroup) {
        router.replace("/(auth)/login");
      }
      if (token && inAuthGroup) {
        router.replace("/(tabs)/facility-list");
      }
    }
  }, [segments, token, loading]);

  return <>{children}</>;
}

// export default function RootLayout() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <AuthGuard>
//         <Stack screenOptions={{ 
//           headerShown: false,
//           animation: 'slide_from_right'
//         }} />
//       </AuthGuard>
//     </QueryClientProvider>
//   );
// }

export default function RootLayout() {
  const { token, loading, loadToken } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && isReady) {
      const inAuthGroup = (segments[0] as string) === "(auth)";

      if (!token && !inAuthGroup) {
        router.replace("/(auth)/login");
      }
      if (token && inAuthGroup) {
        router.replace("/(tabs)/facility-list");
      }
    }
  }, [segments, token, loading, isReady, router]);

  return (
     <SafeAreaView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack 
          screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_right'
          }}
        />
      </QueryClientProvider>
    </SafeAreaView>
  );
}