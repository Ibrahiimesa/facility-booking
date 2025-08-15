import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useMyBookingsStore } from "../store/useMyBookingsStore";

export default function BookingListScreen() {
  const {
    bookings,
    loading,
    error,
    hasMore,
    fetchBookings,
    cancelBooking,
    setStatus,
    setSortDirection,
    status,
    sortDirection,
  } = useMyBookingsStore();

  useEffect(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState(null);
  const [statusItems, setStatusItems] = useState([
    { label: "All", value: null },
    { label: "Booked", value: "booked" },
    { label: "Cancelled", value: "cancelled" },
  ]);

  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [sortItems, setSortItems] = useState([
    { label: "Oldest First", value: "asc" },
    { label: "Newest First", value: "desc" },
  ]);

  const handleStatusChange = (value: any) => {
    setStatus(value);
  };

  const handleSortChange = (value: any) => {
    setSortDirection(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={statusOpen}
            value={statusValue}
            items={statusItems}
            setOpen={setStatusOpen}
            setValue={setStatusValue}
            onChangeValue={handleStatusChange}
            setItems={setStatusItems}
            placeholder="Select Status"
            listMode="FLATLIST"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={statusOpen ? 3000 : 1000}
            zIndexInverse={1000}
          />
        </View>
        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={sortOpen}
            value={sortValue}
            items={sortItems}
            setOpen={setSortOpen}
            setValue={setSortValue}
            setItems={setSortItems}
            onChangeValue={handleSortChange}
            placeholder="Sort By"
            listMode="FLATLIST"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={sortOpen ? 2000 : 1000}
            zIndexInverse={2000}
          />
        </View>
      </View>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.facilityName}>Facility #{item.facilityId}</Text>
            <Text style={styles.dateTime}>
              {item.bookingDate} | {item.startHour}:00 - {item.endHour}:00
            </Text>
            <Text
              style={[
                styles.status,
                item.status === "booked"
                  ? styles.statusBooked
                  : styles.statusCancelled,
              ]}
            >
              {item.status.toUpperCase()}
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.createdAt}>
                Created: {new Date(item.createdAt).toLocaleString()}
              </Text>

              {item.status === "booked" && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    Alert.alert(
                      "Cancel Booking",
                      "Are you sure you want to cancel this booking?",
                      [
                        { text: "No", onPress: () => {}, style: "default" },
                        {
                          text: "Yes, Cancel",
                          onPress: () => cancelBooking(item.id),
                          style: "default",
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        onEndReached={() => {
          if (hasMore && !loading) {
            fetchBookings();
          }
        }}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ marginVertical: 10 }} /> : null
        }
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    padding: 10,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
    gap: 10,
  },
  dropdownWrapper: {
    flex: 1,
    maxWidth: "48%",
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 8,
    minHeight: 40,
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  facilityName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  dateTime: {
    color: "#555",
    marginBottom: 5,
  },
  status: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  statusBooked: {
    color: "green",
  },
  statusCancelled: {
    color: "red",
  },
  createdAt: {
    fontSize: 12,
    color: "#999",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#FF7172",
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
