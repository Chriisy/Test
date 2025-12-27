import { Tabs } from "expo-router";
import { Home, AlertTriangle, Calendar, User } from "lucide-react-native";
import { View, StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0d9488",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e5e7eb",
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: "#0d9488",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Hjem",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: "Myhrvoldgruppen",
        }}
      />
      <Tabs.Screen
        name="claims"
        options={{
          title: "Reklamasjoner",
          tabBarIcon: ({ color, size }) => <AlertTriangle size={size} color={color} />,
          headerTitle: "Reklamasjoner",
        }}
      />
      <Tabs.Screen
        name="service"
        options={{
          title: "Service",
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          headerTitle: "Servicebesøk",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: "Min profil",
        }}
      />
    </Tabs>
  );
}
