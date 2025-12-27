import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Search, Filter, ChevronRight } from "lucide-react-native";

// Mock data
const mockClaims = [
  {
    id: "1",
    claimNumber: "ELE-2512-0023",
    title: "Defekt kompressor i kjøledisk",
    customer: "Hotel Bristol",
    status: "new",
    priority: "high",
    createdAt: "25. des 2024",
  },
  {
    id: "2",
    claimNumber: "UBE-2512-0022",
    title: "Rustdannelse på frontrute",
    customer: "Kantina AS",
    status: "in_progress",
    priority: "medium",
    createdAt: "24. des 2024",
  },
  {
    id: "3",
    claimNumber: "RAT-2512-0021",
    title: "Termostat viser feil temperatur",
    customer: "Restaurant Fjord",
    status: "pending_supplier",
    priority: "low",
    createdAt: "23. des 2024",
  },
  {
    id: "4",
    claimNumber: "ELE-2512-0020",
    title: "Motor lager unormal lyd",
    customer: "Scandic Hotel Oslo",
    status: "resolved",
    priority: "urgent",
    createdAt: "22. des 2024",
  },
  {
    id: "5",
    claimNumber: "ELE-2512-0019",
    title: "Isenhet produserer ikke is",
    customer: "Thon Hotel Bergen",
    status: "closed",
    priority: "medium",
    createdAt: "21. des 2024",
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: "Ny", color: "#3b82f6" },
  in_progress: { label: "Pågår", color: "#f59e0b" },
  pending_supplier: { label: "Venter", color: "#f97316" },
  resolved: { label: "Løst", color: "#22c55e" },
  closed: { label: "Lukket", color: "#6b7280" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Lav", color: "#6b7280" },
  medium: { label: "Medium", color: "#3b82f6" },
  high: { label: "Høy", color: "#f97316" },
  urgent: { label: "Haster", color: "#ef4444" },
};

export default function ClaimsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = [
    { id: "all", label: "Alle" },
    { id: "new", label: "Nye" },
    { id: "in_progress", label: "Pågår" },
    { id: "pending_supplier", label: "Venter" },
  ];

  const filteredClaims = mockClaims.filter((claim) => {
    const matchesSearch =
      claim.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.customer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === "all" || claim.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const renderClaimItem = ({ item }: { item: (typeof mockClaims)[0] }) => (
    <TouchableOpacity
      style={styles.claimCard}
      onPress={() => router.push(`/claims/${item.id}`)}
    >
      <View style={styles.claimHeader}>
        <Text style={styles.claimNumber}>{item.claimNumber}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: priorityConfig[item.priority].color }]}>
          <Text style={styles.priorityText}>{priorityConfig[item.priority].label}</Text>
        </View>
      </View>
      <Text style={styles.claimTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.claimCustomer}>{item.customer}</Text>
      <View style={styles.claimFooter}>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig[item.status].color + "20" }]}>
          <View style={[styles.statusDot, { backgroundColor: statusConfig[item.status].color }]} />
          <Text style={[styles.statusText, { color: statusConfig[item.status].color }]}>
            {statusConfig[item.status].label}
          </Text>
        </View>
        <Text style={styles.claimDate}>{item.createdAt}</Text>
      </View>
      <View style={styles.chevron}>
        <ChevronRight size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Søk etter reklamasjoner..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[styles.filterChip, selectedFilter === filter.id && styles.filterChipActive]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text
              style={[styles.filterText, selectedFilter === filter.id && styles.filterTextActive]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Claims List */}
      <FlatList
        data={filteredClaims}
        renderItem={renderClaimItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Ingen reklamasjoner</Text>
            <Text style={styles.emptySubtitle}>Prøv å endre søkekriteriene</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#1f2937",
  },
  filtersContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  filterChipActive: {
    backgroundColor: "#0d9488",
  },
  filterText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
  },
  listContainer: {
    padding: 16,
  },
  claimCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: "relative",
  },
  claimHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  claimNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0d9488",
    fontFamily: "monospace",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
  claimTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 4,
  },
  claimCustomer: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  claimFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  claimDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  chevron: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -10,
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
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f97316",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: "#fff",
    lineHeight: 32,
  },
});
