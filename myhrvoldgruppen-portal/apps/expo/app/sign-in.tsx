import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../src/providers/auth-provider";

export default function SignInScreen() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!token.trim()) {
      setError("Vennligst skriv inn din API-token");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signIn(token.trim());
      router.replace("/");
    } catch {
      setError("Ugyldig token. Prøv igjen.");
      setLoading(false);
    }
  };

  const openWebPortal = () => {
    Linking.openURL(
      process.env.EXPO_PUBLIC_WEB_URL || "https://your-app.replit.app"
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Myhrvoldgruppen</Text>
        <Text style={styles.subtitle}>Mobil Portal</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.instructions}>
          Logg inn på web-portalen for å hente din API-token
        </Text>

        <TouchableOpacity style={styles.linkButton} onPress={openWebPortal}>
          <Text style={styles.linkButtonText}>Åpne web-portalen</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Lim inn API-token"
          value={token}
          onChangeText={setToken}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Logg inn</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d9488",
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#99f6e4",
    marginTop: 8,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructions: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 16,
  },
  linkButton: {
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  linkButtonText: {
    color: "#0369a1",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  error: {
    color: "#ef4444",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#f97316",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
