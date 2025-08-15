import FacilityCard from "@/src/components/card/FacilityCard";
import { useFacilitiesStore } from "@/src/features/facilities/store/useFacilitiesStore";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function FacilitiesListScreen() {
  const { facilities, loading, error, fetchFacilities } = useFacilitiesStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const handleSearch = () => {
    fetchFacilities(search);
  };

  console.log(facilities);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search facilities..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" />
      ) : facilities.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No results found
        </Text>
      ) : (
        <FlatList
          data={facilities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Link href={`/detail/${item.id}`} push asChild >
              <TouchableOpacity activeOpacity={1} style={styles.card}>
                <FacilityCard facility={item} />
              </TouchableOpacity>
            </Link>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  error: { color: "red" },
  card: {
   padding: 10
  },
  image: { width: "100%", height: 150 },
  info: { padding: 10 },
  name: { fontSize: 16, fontWeight: "bold" },
  desc: { color: "#666", marginVertical: 4 },
  meta: { color: "#0f5132", fontWeight: "500" },
});
