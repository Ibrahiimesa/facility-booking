import CustomButton from "@/src/components/button/CustomButton";
import Spacer from "@/src/components/Spacer";
import { Facility } from "@/src/types/Types";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { TimeSlot, useAvailabilityStore } from "../store/useAvailabilityStore";
import { useBookingStore } from "../store/useBookingStore";

const { width } = Dimensions.get("window");

interface FacilityDetailScreenProps {
  facility: Facility;
}

export function FacilityDetailScreen({ facility }: FacilityDetailScreenProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const {
    availability,
    loading: availabilityLoading,
    error: availabilityError,
    selectedTimeSlots,
    fetchAvailability,
    toggleTimeSlot,
    clearSelectedSlots,
    reset,
  } = useAvailabilityStore();

  const {
    bookFacility,
    loading: bookingLoading,
    error: bookingError,
    success,
    reset: resetBooking,
  } = useBookingStore();

  useEffect(() => {
    return () => {
      reset();
      resetBooking();
    };
  }, [reset, resetBooking]);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      clearSelectedSlots();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateForApi = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const handleCheckAvailability = async () => {
    const dateString = formatDateForApi(selectedDate);
    await fetchAvailability(facility.id, dateString);
  };

  const handleTimeSlotPress = (timeSlot: TimeSlot) => {
    if (!timeSlot.available) return;
    toggleTimeSlot(timeSlot);
  };

  const handleBookSelected = async () => {
    if (selectedTimeSlots.length === 0) {
      Alert.alert(
        "No Time Slots",
        "Please select at least one time slot to book."
      );
      return;
    }

    const dateString = formatDateForApi(selectedDate);
    const firstSlot = selectedTimeSlots[0]; // If you allow multiple, you could loop here

    await bookFacility({
      facilityId: facility.id,
      bookingDate: dateString,
      startHour: firstSlot.hour,
      notes: "",
    });
  };

  useEffect(() => {
    if (success) {
      setSnackbarVisible(true); 
      clearSelectedSlots();
      resetBooking();
    }
  }, [success]);

  return (
    <ScrollView style={styles.container}>
      {/* Header Image with Back Button */}
      <View style={styles.imageContainer}>
        {facility.images?.[0] && (
          <Image
            source={{ uri: facility.images[0].filePath }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Facility Info */}
      <View style={styles.content}>
        <Text style={styles.name}>{facility.name}</Text>
        <Text style={styles.description}>{facility.description}</Text>

        <View style={styles.capacityContainer}>
          <Ionicons name="people" size={20} color="#666" />
          <Text style={styles.capacity}>
            Capacity: {facility.maxCapacity} people
          </Text>
        </View>

        {/* Date Selection */}
        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Select Date</Text>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={20} color="#0f5132" />
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            <Ionicons name="chevron-down" size={20} color="#0f5132" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Check Availability Button */}
        <CustomButton
          title="Check Availability"
          onPress={handleCheckAvailability}
        />

        {availabilityError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{availabilityError}</Text>
          </View>
        )}

        <Spacer height={20} />

        {availability && (
          <View style={styles.availabilitySection}>
            <View style={styles.availabilityHeader}>
              <Text style={styles.sectionTitle}>
                Available Time Slots - {availability.dayName}
              </Text>
              {availability.fullyBooked && (
                <View style={styles.fullyBookedBadge}>
                  <Text style={styles.fullyBookedText}>Fully Booked</Text>
                </View>
              )}
            </View>

            <View style={styles.timeSlotsGrid}>
              {availability.timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.hour}
                  style={[
                    styles.timeSlotGrid,
                    !slot.available && styles.timeSlotUnavailable,
                    selectedTimeSlots.some((s) => s.hour === slot.hour) &&
                      styles.timeSlotSelected,
                  ]}
                  onPress={() => handleTimeSlotPress(slot)}
                  disabled={!slot.available}
                >
                  <Text
                    style={[
                      styles.timeSlotGridText,
                      !slot.available && styles.timeSlotTextUnavailable,
                      selectedTimeSlots.some((s) => s.hour === slot.hour) &&
                        styles.timeSlotTextSelected,
                    ]}
                  >
                    {slot.startTime} - {slot.endTime}
                  </Text>
                  {!slot.available && (
                    <View style={styles.unavailableOverlay}>
                      <Text style={styles.unavailableText}>Full</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {selectedTimeSlots.length > 0 && (
              <View style={styles.bookingActions}>
                <Text style={styles.selectedSlotsText}>
                  Selected: {selectedTimeSlots[0].startTime} -{" "}
                  {selectedTimeSlots[0].endTime}
                </Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={clearSelectedSlots}
                  >
                    <Text style={styles.clearButtonText}>Clear</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={handleBookSelected}
                    disabled={bookingLoading}
                  >
                    <Text style={styles.bookButtonText}>
                      {bookingLoading ? "Booking..." : "Book This Slot"}
                    </Text>
                  </TouchableOpacity>

                 
                </View>
                 {bookingError && (
                    <Text style={{ color: "red", marginTop: 8 }}>
                      {bookingError}
                    </Text>
                  )}
              </View>
            )}
          </View>
        )}

        {/* Additional Images */}
        {facility.images && facility.images.length > 1 && (
          <View style={styles.gallerySection}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {facility.images.slice(1).map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.filePath }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        Booking Confirmed — Your booking was successful!
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
    height: 300,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 16,
  },
  capacityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  capacity: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
    fontWeight: "500",
  },
  dateSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  checkButton: {
    backgroundColor: "#0f5132",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  checkButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  gallerySection: {
    marginTop: 8,
  },
  galleryImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
    textAlign: "center",
  },
  availabilitySection: {
    marginBottom: 24,
  },
  availabilityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  fullyBookedBadge: {
    backgroundColor: "#ffcdd2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fullyBookedText: {
    color: "#c62828",
    fontSize: 12,
    fontWeight: "500",
  },
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  timeSlotGrid: {
    width: "47%", // 2 columns with gap
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  timeSlotGridText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  unavailableOverlay: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#ffcdd2",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
  },
  timeSlotSelected: {
    backgroundColor: "#e8f5e8",
    borderColor: "#0f5132",
  },
  timeSlotUnavailable: {
    backgroundColor: "#f5f5f5",
    opacity: 0.6,
  },
  timeSlotText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  timeSlotTextSelected: {
    color: "#0f5132",
  },
  timeSlotTextUnavailable: {
    color: "#999",
  },
  capacityText: {
    fontSize: 14,
    color: "#666",
  },
  unavailableBadge: {
    backgroundColor: "#ffcdd2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  unavailableText: {
    color: "#c62828",
    fontSize: 12,
    fontWeight: "500",
  },
  bookingActions: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  selectedSlotsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  bookButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#0f5132",
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FacilityDetailScreen;
