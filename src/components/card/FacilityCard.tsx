import { Facility } from "@/src/types/Types";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface FacilityCardProps {
  facility: Facility;
}

export default function FacilityCard({ facility }: FacilityCardProps) {
  return (
    <View style={styles.card}>
      {facility.images?.[0] && (
        <Image
          source={{ uri: facility.images[0].filePath }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{facility.name}</Text>
        <Text style={styles.desc}>{facility.description}</Text>
        <Text style={styles.meta}>Capacity: {facility.maxCapacity}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 150,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: "#888",
  },
});
