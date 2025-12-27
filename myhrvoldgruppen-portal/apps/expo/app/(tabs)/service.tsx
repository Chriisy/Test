import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { MapPin, Clock, User, CheckCircle, AlertCircle } from "lucide-react-native";

// Mock data
const mockVisits = [
  {
    id: "1",
    customer: "Scandic Hotel Oslo",
    address: "Holbergs gate 30, Oslo",
    time: "09:00",
    duration: "2 timer",
    technician: "Ole Hansen",
    type: "Kvartalsservice",
    status: "scheduled",
  },
  {
    id: "2",
    customer: "Coop Mega Sentrum",
    address: "Storgata 15, Oslo",
    time: "13:00",
    duration: "1.5 timer",
    technician: "Kari Olsen",
    type: "Årlig inspeksjon",
    status: "scheduled",
  },
  {
    id: "3",
    customer: "Hotel Bristol",
    address: "Karl Johans gate 31, Oslo",
    time: "11:00",
    duration: "1 time",
    technician: "Ole Hansen",
    type: "Akutt service",
    status: "in_progress",
  },
];

const daysOfWeek = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  scheduled: { label: "Planlagt", color: "#3b82f6", icon: Clock },
  in_progress: { label: "Pågår", color: "#f59e0b", icon: AlertCircle },
  completed: { label: "Fullført", color: "#22c55e", icon: CheckCircle },
};

export default function ServiceScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate week days
  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Week Calendar */}
      <View style={styles.calendarContainer}>
        <View style={styles.weekRow}>
          {weekDays.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayColumn,
                isSelected(date) && styles.daySelected,
                isToday(date) && !isSelected(date) && styles.dayToday,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text
                style={[styles.dayName, isSelected(date) && styles.dayNameSelected]}
              >
                {daysOfWeek[index]}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelected(date) && styles.dayNumberSelected,
                  isToday(date) && !isSelected(date) && styles.dayNumberToday,
                ]}
              >
                {date.getDate()}
              </Text>
              {/* Visit indicator */}
              <View style={[styles.visitIndicator, isSelected(date) && styles.visitIndicatorSelected]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Selected Date Header */}
      <View style={styles.dateHeader}>
        <Text style={styles.dateTitle}>
          {selectedDate.toLocaleDateString("nb-NO", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </Text>
        <Text style={styles.visitCount}>{mockVisits.length} besøk</Text>
      </View>

      {/* Visits List */}
      <View style={styles.visitsList}>
        {mockVisits.map((visit) => {
          const StatusIcon = statusConfig[visit.status].icon;
          return (
            <TouchableOpacity key={visit.id} style={styles.visitCard}>
              <View style={styles.visitTime}>
                <Text style={styles.timeText}>{visit.time}</Text>
                <Text style={styles.durationText}>{visit.duration}</Text>
              </View>

              <View style={styles.visitContent}>
                <View style={styles.visitHeader}>
                  <Text style={styles.visitCustomer}>{visit.customer}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusConfig[visit.status].color + "20" },
                    ]}
                  >
                    <StatusIcon size={12} color={statusConfig[visit.status].color} />
                    <Text style={[styles.statusText, { color: statusConfig[visit.status].color }]}>
                      {statusConfig[visit.status].label}
                    </Text>
                  </View>
                </View>

                <Text style={styles.visitType}>{visit.type}</Text>

                <View style={styles.visitDetails}>
                  <View style={styles.detailRow}>
                    <MapPin size={14} color="#6b7280" />
                    <Text style={styles.detailText}>{visit.address}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <User size={14} color="#6b7280" />
                    <Text style={styles.detailText}>{visit.technician}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Empty State */}
      {mockVisits.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Ingen besøk</Text>
          <Text style={styles.emptySubtitle}>
            Det er ingen planlagte besøk for denne dagen
          </Text>
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  calendarContainer: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dayColumn: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  daySelected: {
    backgroundColor: "#0d9488",
  },
  dayToday: {
    backgroundColor: "#f3f4f6",
  },
  dayName: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  dayNameSelected: {
    color: "#fff",
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  dayNumberSelected: {
    color: "#fff",
  },
  dayNumberToday: {
    color: "#0d9488",
  },
  visitIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0d9488",
    marginTop: 4,
  },
  visitIndicatorSelected: {
    backgroundColor: "#fff",
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    textTransform: "capitalize",
  },
  visitCount: {
    fontSize: 14,
    color: "#6b7280",
  },
  visitsList: {
    paddingHorizontal: 16,
  },
  visitCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  visitTime: {
    width: 70,
    backgroundColor: "#0d9488",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  durationText: {
    fontSize: 11,
    color: "#99f6e4",
    marginTop: 2,
  },
  visitContent: {
    flex: 1,
    padding: 12,
  },
  visitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  visitCustomer: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  visitType: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  visitDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: "#6b7280",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
    textAlign: "center",
  },
});
