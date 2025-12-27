# Fase 22: Mobil Navigasjon

**Kategori:** 📱 MOBIL-APP  
**Tid:** 4-5 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 21 fullført

---

## 🎯 Mål
Bygge Expo Router-basert navigasjon med tab bar og stack navigasjon.

---

## 📊 Navigasjonsstruktur

```
(auth)/                  # Beskyttet gruppe
├── (tabs)/              # Tab-navigasjon
│   ├── index.tsx        # Hjem/Dashboard
│   ├── tasks.tsx        # Mine oppdrag
│   ├── scan.tsx         # Skann/Registrer
│   └── profile.tsx      # Profil
├── claim/[id].tsx       # Reklamasjon detaljer
├── task/[id].tsx        # Oppdrag detaljer
└── _layout.tsx
```

---

## 📄 Tab-layout

```typescript
// apps/expo/app/(auth)/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { Home, ClipboardList, Camera, User } from 'lucide-react-native'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0d9488',
        tabBarInactiveTintColor: '#64748b',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hjem',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Oppdrag',
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Registrer',
          tabBarIcon: ({ color, size }) => <Camera color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
```

---

## 📱 Hjem-skjerm

```typescript
// apps/expo/app/(auth)/(tabs)/index.tsx
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { api } from '@/lib/api'

export default function HomeScreen() {
  const { user } = useAuth()
  const { data: stats } = api.dashboard.getMobileStats.useQuery()

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-teal-600 p-6 pt-12">
        <Text className="text-white text-lg">God morgen,</Text>
        <Text className="text-white text-2xl font-bold">{user?.firstName}</Text>
      </View>

      {/* Quick stats */}
      <View className="p-4 -mt-4">
        <View className="bg-white rounded-xl p-4 shadow-sm flex-row justify-around">
          <View className="items-center">
            <Text className="text-2xl font-bold text-teal-600">{stats?.todayTasks || 0}</Text>
            <Text className="text-gray-600 text-sm">I dag</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-orange-500">{stats?.pendingTasks || 0}</Text>
            <Text className="text-gray-600 text-sm">Ventende</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">{stats?.completedThisWeek || 0}</Text>
            <Text className="text-gray-600 text-sm">Fullført</Text>
          </View>
        </View>
      </View>

      {/* Quick actions */}
      <View className="p-4">
        <Text className="text-lg font-semibold mb-3">Hurtigvalg</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity className="flex-1 bg-white p-4 rounded-xl items-center">
            <Camera size={24} color="#0d9488" />
            <Text className="mt-2 text-sm">Registrer skade</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-white p-4 rounded-xl items-center">
            <ClipboardList size={24} color="#0d9488" />
            <Text className="mt-2 text-sm">Fullfør besøk</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
```

---

## ✅ Verifisering

1. Tab-bar vises nederst
2. Alle 4 tabs navigerer korrekt
3. Stack-navigasjon til detaljer fungerer
4. Tilbake-knapp fungerer

---

## 📦 Leveranse

- ✅ Tab-navigasjon med 4 faner
- ✅ Stack-navigasjon for detaljer
- ✅ Hjem-skjerm med stats
- ✅ NativeWind styling

---

## ➡️ Neste fase
[Fase 23: Mine Oppdrag](./fase-23-mine-oppdrag.md)
