import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Stack } from "expo-router";
import {
  ArrowLeft,
  Building2,
  Package,
  Calendar,
  User,
  MessageSquare,
  Paperclip,
  Phone,
  Mail,
} from "lucide-react-native";

// Mock data
const mockClaim = {
  id: "1",
  claimNumber: "ELE-2512-0023",
  title: "Defekt kompressor i kjøledisk",
  description:
    "Kunden rapporterer at kompressoren i kjøledisken har sluttet å fungere. Disken holder ikke lenger riktig temperatur, og varene blir ødelagt.",
  status: "in_progress",
  priority: "high",
  productName: "Kjøledisk KD-500",
  serialNumber: "SN-2024-12345",
  purchaseDate: "15. jun 2024",
  customer: {
    name: "Hotel Bristol",
    address: "Karl Johans gate 31, Oslo",
    contactPerson: "Erik Hansen",
    phone: "+47 22 82 60 00",
    email: "drift@bristol.no",
  },
  createdAt: "25. des 2024",
  assignedTo: "Ole Nordmann",
  timeline: [
    { id: "1", text: "Reklamasjon opprettet", user: "Anna Olsen", time: "25. des 10:30" },
    { id: "2", text: "Status endret til 'Pågår'", user: "Ole Nordmann", time: "25. des 11:45" },
    { id: "3", text: "Kontaktet leverandør", user: "Ole Nordmann", time: "25. des 14:20" },
  ],
};

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

export default function ClaimDetailScreen() {
  const { id } = useLocalSearchParams();
  const claim = mockClaim; // I produksjon: hent fra API

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: claim.claimNumber,
          headerStyle: { backgroundColor: "#0d9488" },
          headerTintColor: "#fff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.container}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: statusConfig[claim.status].color }]}>
              <Text style={styles.badgeText}>{statusConfig[claim.status].label}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: priorityConfig[claim.priority].color }]}>
              <Text style={styles.badgeText}>{priorityConfig[claim.priority].label}</Text>
            </View>
          </View>
          <Text style={styles.title}>{claim.title}</Text>
          <Text style={styles.date}>Opprettet {claim.createdAt}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beskrivelse</Text>
          <View style={styles.card}>
            <Text style={styles.description}>{claim.description}</Text>
          </View>
        </View>

        {/* Customer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kunde</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Building2 size={20} color="#0d9488" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Kunde</Text>
                <Text style={styles.infoValue}>{claim.customer.name}</Text>
                <Text style={styles.infoSubtext}>{claim.customer.address}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <User size={20} color="#0d9488" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Kontaktperson</Text>
                <Text style={styles.infoValue}>{claim.customer.contactPerson}</Text>
              </View>
            </View>
            <View style={styles.contactButtons}>
              <TouchableOpacity style={styles.contactButton}>
                <Phone size={18} color="#0d9488" />
                <Text style={styles.contactButtonText}>Ring</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <Mail size={18} color="#0d9488" />
                <Text style={styles.contactButtonText}>E-post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Product */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produkt</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Package size={20} color="#0d9488" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Produkt</Text>
                <Text style={styles.infoValue}>{claim.productName}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Serienummer</Text>
                <Text style={styles.detailValue}>{claim.serialNumber}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Kjøpsdato</Text>
                <Text style={styles.detailValue}>{claim.purchaseDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktivitetslogg</Text>
          <View style={styles.card}>
            {claim.timeline.map((event, index) => (
              <View
                key={event.id}
                style={[styles.timelineItem, index < claim.timeline.length - 1 && styles.timelineItemBorder]}
              >
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineText}>{event.text}</Text>
                  <Text style={styles.timelineMeta}>
                    {event.user} · {event.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <MessageSquare size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Legg til kommentar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Paperclip size={20} color="#0d9488" />
            <Text style={styles.secondaryButtonText}>Vedlegg</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  headerCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  badges: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#6b7280",
  },
  section: {
    padding: 16,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  description: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  infoSubtext: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  contactButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#f0fdfa",
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0d9488",
  },
  detailsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  timelineItem: {
    flexDirection: "row",
    paddingBottom: 16,
  },
  timelineItemBorder: {
    borderBottomWidth: 0,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0d9488",
    marginTop: 6,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineText: {
    fontSize: 14,
    color: "#374151",
  },
  timelineMeta: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0d9488",
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#0d9488",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0d9488",
  },
});
