import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { router } from "expo-router";
import { AlertTriangle, FileText, Users, Wrench, ChevronRight } from "lucide-react-native";

// Mock data
const stats = {
  activeClaims: 23,
  activeAgreements: 117,
  totalCustomers: 207,
  activePartners: 47,
};

const recentClaims = [
  { id: "1", claimNumber: "ELE-2512-0023", customer: "Hotel Bristol", status: "new" },
  { id: "2", claimNumber: "UBE-2512-0022", customer: "Kantina AS", status: "in_progress" },
  { id: "3", claimNumber: "RAT-2512-0021", customer: "Restaurant Fjord", status: "pending_supplier" },
];

const todayVisits = [
  { id: "1", customer: "Coop Mega Sentrum", time: "09:00", type: "Kvartalsservice" },
  { id: "2", customer: "Scandic Hotel", time: "13:00", type: "Akutt" },
];

const statusColors: Record<string, string> = {
  new: "#3b82f6",
  in_progress: "#f59e0b",
  pending_supplier: "#f97316",
  resolved: "#22c55e",
  closed: "#6b7280",
};

const statusLabels: Record<string, string> = {
  new: "Ny",
  in_progress: "Pågår",
  pending_supplier: "Venter",
  resolved: "Løst",
  closed: "Lukket",
};

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simuler oppdatering
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0d9488" />
      }
    >
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: "#fef3c7" }]}>
          <AlertTriangle size={24} color="#f59e0b" />
          <Text style={styles.statValue}>{stats.activeClaims}</Text>
          <Text style={styles.statLabel}>Aktive saker</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#d1fae5" }]}>
          <FileText size={24} color="#10b981" />
          <Text style={styles.statValue}>{stats.activeAgreements}</Text>
          <Text style={styles.statLabel}>Avtaler</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#dbeafe" }]}>
          <Users size={24} color="#3b82f6" />
          <Text style={styles.statValue}>{stats.totalCustomers}</Text>
          <Text style={styles.statLabel}>Kunder</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#f3e8ff" }]}>
          <Wrench size={24} color="#8b5cf6" />
          <Text style={styles.statValue}>{stats.activePartners}</Text>
          <Text style={styles.statLabel}>Partnere</Text>
        </View>
      </View>

      {/* Recent Claims */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Siste reklamasjoner</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/claims")}>
            <Text style={styles.seeAll}>Se alle</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {recentClaims.map((claim, index) => (
            <TouchableOpacity
              key={claim.id}
              style={[styles.listItem, index < recentClaims.length - 1 && styles.listItemBorder]}
              onPress={() => router.push(`/claims/${claim.id}`)}
            >
              <View style={styles.listItemContent}>
                <Text style={styles.claimNumber}>{claim.claimNumber}</Text>
                <Text style={styles.claimCustomer}>{claim.customer}</Text>
              </View>
              <View style={styles.listItemRight}>
                <View style={[styles.statusBadge, { backgroundColor: statusColors[claim.status] }]}>
                  <Text style={styles.statusText}>{statusLabels[claim.status]}</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Today's Visits */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dagens servicebesøk</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/service")}>
            <Text style={styles.seeAll}>Se alle</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {todayVisits.length > 0 ? (
            todayVisits.map((visit, index) => (
              <View
                key={visit.id}
                style={[styles.listItem, index < todayVisits.length - 1 && styles.listItemBorder]}
              >
                <View style={styles.timeContainer}>
                  <Text style={styles.visitTime}>{visit.time}</Text>
                </View>
                <View style={styles.listItemContent}>
                  <Text style={styles.visitCustomer}>{visit.customer}</Text>
                  <Text style={styles.visitType}>{visit.type}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Ingen besøk i dag</Text>
            </View>
          )}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hurtighandlinger</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <AlertTriangle size={24} color="#0d9488" />
            <Text style={styles.actionText}>Ny reklamasjon</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <FileText size={24} color="#0d9488" />
            <Text style={styles.actionText}>Skann produkt</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 12,
  },
  statCard: {
    width: "47%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  seeAll: {
    fontSize: 14,
    color: "#0d9488",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  listItemContent: {
    flex: 1,
  },
  listItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  claimNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0d9488",
    fontFamily: "monospace",
  },
  claimCustomer: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  timeContainer: {
    width: 50,
    marginRight: 12,
  },
  visitTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0d9488",
  },
  visitCustomer: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  visitType: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  actionText: {
    fontSize: 12,
    color: "#1f2937",
    marginTop: 8,
    fontWeight: "500",
  },
});
