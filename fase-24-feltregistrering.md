# Fase 24: Feltregistrering

**Kategori:** 📱 MOBIL-APP  
**Tid:** 6-8 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 23 fullført

---

## 🎯 Mål
Bygge feltregistrering med kamera, GPS og digital signatur for teknikere.

---

## 📊 Funksjoner

### 1. Kamera
- Ta bilder av skader/utstyr
- Galleri-tilgang
- Komprimering før opplasting

### 2. GPS
- Automatisk lokasjon
- Verifisering av at tekniker er på stedet

### 3. Digital signatur
- Kundens signatur på skjerm
- Lagres som base64

### 4. Skjemaer
- Servicebesøk-rapport
- Transportskade-registrering
- Installasjons-godkjenning

---

## 📸 Kamera-modul

```typescript
// apps/expo/src/components/camera-capture.tsx
import { useState } from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Camera, X, Plus } from 'lucide-react-native'

interface CameraCaptureProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function CameraCapture({ images, onImagesChange, maxImages = 5 }: CameraCaptureProps) {
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      alert('Vi trenger tilgang til kameraet')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    })

    if (!result.canceled && result.assets[0]) {
      onImagesChange([...images, result.assets[0].uri])
    }
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <View>
      <Text className="font-medium mb-2">Bilder ({images.length}/{maxImages})</Text>
      <View className="flex-row flex-wrap gap-2">
        {images.map((uri, index) => (
          <View key={index} className="relative">
            <Image source={{ uri }} className="w-20 h-20 rounded-lg" />
            <TouchableOpacity
              onPress={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
            >
              <X size={12} color="white" />
            </TouchableOpacity>
          </View>
        ))}
        {images.length < maxImages && (
          <TouchableOpacity
            onPress={takePhoto}
            className="w-20 h-20 rounded-lg bg-gray-100 items-center justify-center border-2 border-dashed border-gray-300"
          >
            <Camera size={24} color="#64748b" />
            <Text className="text-xs text-gray-500 mt-1">Ta bilde</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
```

---

## 📍 GPS-modul

```typescript
// apps/expo/src/hooks/use-location.ts
import { useState, useEffect } from 'react'
import * as Location from 'expo-location'

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setError('Lokasjon ikke tillatt')
      return
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    })
    setLocation(loc)
    return loc
  }

  return { location, error, getLocation }
}
```

---

## ✍️ Digital signatur

```typescript
// apps/expo/src/components/signature-pad.tsx
import { useRef } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import SignatureScreen from 'react-native-signature-canvas'

interface SignaturePadProps {
  onSave: (signature: string) => void
}

export function SignaturePad({ onSave }: SignaturePadProps) {
  const signatureRef = useRef<SignatureScreen>(null)

  const handleClear = () => signatureRef.current?.clearSignature()
  
  const handleSave = () => {
    signatureRef.current?.readSignature()
  }

  return (
    <View className="bg-white rounded-xl overflow-hidden">
      <Text className="p-4 font-medium border-b">Kundens signatur</Text>
      <View className="h-48">
        <SignatureScreen
          ref={signatureRef}
          onOK={onSave}
          webStyle={`.m-signature-pad { box-shadow: none; border: none; }`}
        />
      </View>
      <View className="flex-row p-4 gap-2 border-t">
        <TouchableOpacity onPress={handleClear} className="flex-1 py-2 bg-gray-100 rounded-lg">
          <Text className="text-center">Tøm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} className="flex-1 py-2 bg-teal-600 rounded-lg">
          <Text className="text-center text-white">Lagre</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
```

---

## 📝 Komplett registreringsskjema

```typescript
// apps/expo/app/(auth)/complete-visit/[id].tsx
export default function CompleteVisitScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { getLocation } = useLocation()
  
  const [form, setForm] = useState({
    workPerformed: '',
    partsUsed: '',
    technicianNotes: '',
    images: [] as string[],
    signature: '',
    latitude: null as number | null,
    longitude: null as number | null,
  })

  const completeVisit = api.visits.complete.useMutation({
    onSuccess: () => router.push('/tasks'),
  })

  const handleSubmit = async () => {
    const loc = await getLocation()
    completeVisit.mutate({
      visitId: parseInt(id as string),
      ...form,
      latitude: loc?.coords.latitude,
      longitude: loc?.coords.longitude,
    })
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-xl font-bold mb-4">Fullfør besøk</Text>
      
      <TextInput
        label="Utført arbeid"
        multiline
        value={form.workPerformed}
        onChangeText={(v) => setForm({...form, workPerformed: v})}
      />

      <TextInput
        label="Deler brukt"
        value={form.partsUsed}
        onChangeText={(v) => setForm({...form, partsUsed: v})}
      />

      <CameraCapture
        images={form.images}
        onImagesChange={(images) => setForm({...form, images})}
      />

      <SignaturePad
        onSave={(sig) => setForm({...form, signature: sig})}
      />

      <Button onPress={handleSubmit} className="mt-4">
        Fullfør og send
      </Button>
    </ScrollView>
  )
}
```

---

## ✅ Verifisering

1. Ta bilder med kamera
2. Hent GPS-lokasjon
3. Signer på skjerm
4. Send komplett rapport

---

## 📦 Leveranse

- ✅ Kamera-opplasting
- ✅ GPS-lokasjon
- ✅ Digital signatur
- ✅ Komplett registreringsskjema

---

## ➡️ Neste fase
[Fase 25: Mobil Polering](./fase-25-mobil-polering.md)
