import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import FacilityDetailScreen from "@/src/features/facilities/screens/FacilityDetailScreen";
import { useDetailFacilitiesStore } from "@/src/features/facilities/store/useDetailFacilities";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function DetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();

  const { facilities, loading, error, fetchDetailFacilities } =
    useDetailFacilitiesStore();

  useEffect(() => {
    fetchDetailFacilities(params.id as unknown as number);
  }, [fetchDetailFacilities, params.id]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading facility details...</Text>
      </View>
    );
  }

  if (!facilities) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Facility not found</Text>
      </View>
    );
  }

  return <FacilityDetailScreen facility={facilities} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  error: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  notFound: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
