# Fase 25: Mobil Polering

**Kategori:** 📱 MOBIL-APP  
**Tid:** 3-4 timer  
**Prioritet:** 🟢 Medium  
**Avhengigheter:** Fase 24 fullført

---

## 🎯 Mål
Polere mobil-appen med offline-støtte, push-varsler og bedre UX.

---

## 📊 Forbedringer

### 1. Offline-støtte
- Cache oppdrag lokalt
- Synkroniser når online
- Vis offline-status

### 2. Push-varsler
- Nye oppdrag
- Statusendringer
- Påminnelser

### 3. UX-forbedringer
- Pull-to-refresh
- Loading states
- Error handling
- Haptic feedback

---

## 📴 Offline med MMKV

```typescript
// apps/expo/src/lib/storage.ts
import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

export const offlineCache = {
  setTasks: (tasks: Task[]) => {
    storage.set('cached_tasks', JSON.stringify(tasks))
  },
  getTasks: (): Task[] | null => {
    const data = storage.getString('cached_tasks')
    return data ? JSON.parse(data) : null
  },
  clearTasks: () => {
    storage.delete('cached_tasks')
  },
}
```

### Network-status hook
```typescript
// apps/expo/src/hooks/use-network.ts
import NetInfo from '@react-native-community/netinfo'
import { useState, useEffect } from 'react'

export function useNetwork() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? true)
    })
    return () => unsubscribe()
  }, [])

  return { isOnline }
}
```

---

## 🔔 Push-varsler

```typescript
// apps/expo/src/lib/notifications.ts
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

export async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync()
  if (status !== 'granted') return null

  const token = await Notifications.getExpoPushTokenAsync()
  
  // Send token til backend
  await api.notifications.registerDevice.mutate({
    token: token.data,
    platform: Platform.OS,
  })

  return token.data
}

// Håndter innkommende varsler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})
```

---

## ✨ UX-forbedringer

### Pull-to-refresh
```typescript
<FlatList
  data={tasks}
  refreshControl={
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={refetch}
      colors={['#0d9488']}
    />
  }
/>
```

### Loading skeleton
```typescript
export function TaskSkeleton() {
  return (
    <View className="bg-white rounded-xl p-4 mb-3">
      <View className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      <View className="h-6 w-48 bg-gray-200 rounded mt-2 animate-pulse" />
      <View className="h-4 w-32 bg-gray-200 rounded mt-2 animate-pulse" />
    </View>
  )
}
```

### Haptic feedback
```typescript
import * as Haptics from 'expo-haptics'

// Ved viktige handlinger
const handleComplete = async () => {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  // ...
}
```

---

## ✅ Verifisering

1. Slå av nett - se cached data
2. Motta push-varsel
3. Pull-to-refresh fungerer
4. Loading states vises

---

## 📦 Leveranse

- ✅ Offline-støtte med MMKV
- ✅ Push-varsler konfigurert
- ✅ Bedre loading/error states
- ✅ Haptic feedback

---

## 🎉 Mobil-app fullført!

Du har nå en komplett mobil-app med:
- Autentisering
- Oppgaveliste
- Feltregistrering (kamera, GPS, signatur)
- Offline-støtte
- Push-varsler

---

## ➡️ Neste fase
[Fase 26: Web Deployment](./fase-26-web-deployment.md)
