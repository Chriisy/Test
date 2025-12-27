import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import {
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Wifi,
  Smartphone,
} from "lucide-react-native";
import { useAuth } from "../../src/providers/auth-provider";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  const menuItems = [
    {
      id: "personal",
      title: "Personlig informasjon",
      icon: User,
      onPress: () => {},
    },
    {
      id: "notifications",
      title: "Varsler",
      icon: Bell,
      toggle: true,
      value: notifications,
      onToggle: setNotifications,
    },
    {
      id: "offline",
      title: "Offline-modus",
      icon: Wifi,
      toggle: true,
      value: offlineMode,
      onToggle: setOfflineMode,
      subtitle: "Lagre data lokalt for bruk uten internett",
    },
    {
      id: "darkmode",
      title: "Mørk modus",
      icon: Moon,
      toggle: true,
      value: darkMode,
      onToggle: setDarkMode,
    },
  ];

  const supportItems = [
    {
      id: "device",
      title: "Enhetsinformasjon",
      icon: Smartphone,
      onPress: () => {},
    },
    {
      id: "security",
      title: "Sikkerhet",
      icon: Shield,
      onPress: () => {},
    },
    {
      id: "help",
      title: "Hjelp & Support",
      icon: HelpCircle,
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* User Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0) ?? "M"}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name ?? "Myhrvoldgruppen Bruker"}</Text>
          <Text style={styles.userEmail}>{user?.email ?? "bruker@myhrvoldgruppen.no"}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>156</Text>
          <Text style={styles.statLabel}>Saker behandlet</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>42</Text>
          <Text style={styles.statLabel}>Servicebesøk</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>98%</Text>
          <Text style={styles.statLabel}>Løsningsrate</Text>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Innstillinger</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
                onPress={item.toggle ? undefined : item.onPress}
                activeOpacity={item.toggle ? 1 : 0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.iconContainer}>
                    <Icon size={20} color="#0d9488" />
                  </View>
                  <View>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    {item.subtitle && (
                      <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>
                </View>
                {item.toggle ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: "#e5e7eb", true: "#5eead4" }}
                    thumbColor={item.value ? "#0d9488" : "#fff"}
                  />
                ) : (
                  <ChevronRight size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.menuCard}>
          {supportItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, index < supportItems.length - 1 && styles.menuItemBorder]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.iconContainer}>
                    <Icon size={20} color="#0d9488" />
                  </View>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Logg ut</Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.version}>Versjon 1.0.0 (Build 1)</Text>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0d9488",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
  },
  userEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0d9488",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#f0fdfa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    color: "#1f2937",
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 16,
  },
});
