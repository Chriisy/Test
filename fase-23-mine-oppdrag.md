# Fase 23: Mine Oppdrag

**Kategori:** 📱 MOBIL-APP  
**Tid:** 5-6 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 22 fullført

---

## 🎯 Mål
Bygge oppgaveliste for teknikere med serviceoppdrag, installasjoner og reklamasjoner.

---

## 📊 Funksjoner

- Liste over dagens oppdrag
- Filtrer: I dag, Denne uken, Alle
- Oppdragstyper: Service, Installasjon, Reklamasjon
- Adresse med navigasjon (Google/Apple Maps)
- Status-oppdatering
- Fullfør oppdrag med signatur

---

## 📄 Oppgaveliste

```typescript
// apps/expo/app/(auth)/(tabs)/tasks.tsx
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { api } from '@/lib/api'
import { useRouter } from 'expo-router'
import { MapPin, Clock, ChevronRight } from 'lucide-react-native'

export default function TasksScreen() {
  const router = useRouter()
  const [filter, setFilter] = useState<'today' | 'week' | 'all'>('today')
  const { data: tasks, isLoading } = api.tasks.getMyTasks.useQuery({ filter })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-teal-100 text-teal-700'
      case 'installation': return 'bg-blue-100 text-blue-700'
      case 'claim': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b">
        <Text className="text-xl font-bold">Mine oppdrag</Text>
        {/* Filter-knapper */}
        <View className="flex-row gap-2 mt-3">
          {['today', 'week', 'all'].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f as typeof filter)}
              className={`px-4 py-2 rounded-full ${
                filter === f ? 'bg-teal-600' : 'bg-gray-100'
              }`}
            >
              <Text className={filter === f ? 'text-white' : 'text-gray-700'}>
                {f === 'today' ? 'I dag' : f === 'week' ? 'Denne uken' : 'Alle'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Liste */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="p-4"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/task/${item.id}`)}
            className="bg-white rounded-xl p-4 mb-3 shadow-sm"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <View className={`px-2 py-1 rounded ${getTypeColor(item.type)}`}>
                    <Text className="text-xs font-medium">{item.type}</Text>
                  </View>
                  {item.priority === 'urgent' && (
                    <View className="bg-red-100 px-2 py-1 rounded">
                      <Text className="text-xs text-red-700">Haster</Text>
                    </View>
                  )}
                </View>
                <Text className="font-semibold mt-2">{item.customerName}</Text>
                <View className="flex-row items-center mt-1">
                  <MapPin size={14} color="#64748b" />
                  <Text className="text-gray-600 text-sm ml-1">{item.address}</Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <Clock size={14} color="#64748b" />
                  <Text className="text-gray-600 text-sm ml-1">{item.scheduledTime}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
```

---

## 📍 Åpne i kart

```typescript
// apps/expo/src/lib/maps.ts
import { Linking, Platform } from 'react-native'

export function openInMaps(address: string, lat?: number, lng?: number) {
  const destination = lat && lng 
    ? `${lat},${lng}` 
    : encodeURIComponent(address)
  
  const url = Platform.select({
    ios: `maps://app?daddr=${destination}`,
    android: `google.navigation:q=${destination}`,
  })

  if (url) Linking.openURL(url)
}
```

---

## ✅ Verifisering

1. Oppgaveliste viser oppdrag
2. Filtrering fungerer
3. Navigasjon til detaljer
4. Åpne i kart fungerer

---

## 📦 Leveranse

- ✅ Oppgaveliste med filtrering
- ✅ Oppdragstyper visuelt
- ✅ Kart-integrasjon
- ✅ Oppdragsdetaljer

---

## ➡️ Neste fase
[Fase 24: Feltregistrering](./fase-24-feltregistrering.md)
