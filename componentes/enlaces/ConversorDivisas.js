import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const currencies = [
  ["EUR", "Euro"],
  ["USD", "Dólar estadounidense"],
  ["GBP", "Libra esterlina"],
  ["JPY", "Yen japonés"],
  ["CHF", "Franco suizo"],
  ["AUD", "Dólar australiano"],
  ["CAD", "Dólar canadiense"],
  ["NZD", "Dólar neozelandés"],
  ["CNY", "Yuan chino"],
  ["SEK", "Corona sueca"],
  ["NOK", "Corona noruega"],
  ["DKK", "Corona danesa"],
  ["PLN", "Złoty polaco"],
  ["CZK", "Corona checa"],
  ["HUF", "Florín húngaro"],
  ["RON", "Leu rumano"],
  ["TRY", "Lira turca"],
  ["BRL", "Real brasileño"],
  ["MXN", "Peso mexicano"],
  ["ZAR", "Rand sudafricano"],
  ["KRW", "Won surcoreano"],
  ["INR", "Rupia india"],
  ["IDR", "Rupia indonesia"],
  ["ILS", "Nuevo séquel israelí"],
  ["THB", "Baht tailandés"],
  ["PHP", "Peso filipino"],
  ["SGD", "Dólar singapurense"],
  ["HKD", "Dólar de Hong Kong"],
].map(([code, name]) => ({ code, name }));

const colors = {
  navy: "#102A43",
  blue: "#246BFD",
  background: "#F4F7FB",
  muted: "#6B7C93",
  border: "#E1E8F0",
  green: "#16865B",
  red: "#B93845",
};

function parseAmount(value) {
  const parsed = Number(String(value).trim().replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function formatAmount(amount, currency) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function CurrencyPicker({ label, value, onValueChange }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {currencies.map((currency) => (
            <Picker.Item
              key={currency.code}
              label={`${currency.code} · ${currency.name}`}
              value={currency.code}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

export default function ConversorDivisas() {
  const [origin, setOrigin] = useState("USD");
  const [destination, setDestination] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearQuote = (setter) => (currency) => {
    setter(currency);
    setQuote(null);
    setResult(null);
    setError("");
  };

  const getRate = async () => {
    const parsedAmount = parseAmount(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Introduce una cantidad mayor que cero.");
      return;
    }
    if (origin === destination) {
      setQuote({ rate: 1, date: new Date().toISOString().slice(0, 10), source: "Paridad" });
      setResult(parsedAmount);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    try {
      const url = `https://api.frankfurter.dev/v1/latest?base=${encodeURIComponent(origin)}&symbols=${encodeURIComponent(destination)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`El servicio respondió con el código ${response.status}.`);
      }
      const data = await response.json();
      const rate = data?.rates?.[destination];
      if (!Number.isFinite(rate) || typeof data?.date !== "string") {
        throw new Error("No hay una cotización disponible para este par de monedas.");
      }
      setQuote({ rate, date: data.date, source: "Frankfurter (referencia del BCE)" });
      setResult(parsedAmount * rate);
    } catch (requestError) {
      setError(
        requestError.message ||
          "No se pudo consultar el tipo de cambio. Comprueba tu conexión e inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>CAMBIO DE MONEDA</Text>
        <Text style={styles.title}>Conversor de divisas</Text>
        <Text style={styles.subtitle}>Consulta gratuita de tipos de referencia y calcula tu conversión.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Cantidad a convertir</Text>
          <View style={styles.amountInputWrap}>
            <TextInput
              accessibilityLabel="Cantidad a convertir"
              style={styles.amountInput}
              value={amount}
              onChangeText={(value) => {
                setAmount(value);
                setResult(null);
              }}
              keyboardType="decimal-pad"
              placeholder="Ej. 100,00"
              placeholderTextColor="#A0ADBB"
            />
            <Text style={styles.amountUnit}>{origin}</Text>
          </View>

          <CurrencyPicker label="De" value={origin} onValueChange={clearQuote(setOrigin)} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Intercambiar monedas"
            onPress={() => {
              setOrigin(destination);
              setDestination(origin);
              setQuote(null);
              setResult(null);
              setError("");
            }}
            style={({ pressed }) => [styles.swapButton, pressed && styles.pressed]}
          >
            <MaterialCommunityIcons name="swap-vertical" size={21} color={colors.blue} />
          </Pressable>
          <CurrencyPicker
            label="A"
            value={destination}
            onValueChange={clearQuote(setDestination)}
          />

          <Pressable
            accessibilityRole="button"
            onPress={getRate}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.pressed,
              loading && styles.disabledButton,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="currency-exchange" size={19} color="#FFFFFF" />
                <Text style={styles.buttonText}>Consultar y convertir</Text>
              </>
            )}
          </Pressable>
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        </View>

        {quote && result !== null ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultEyebrow}>RESULTADO ESTIMADO</Text>
            <Text style={styles.resultValue}>{formatAmount(result, destination)}</Text>
            <Text style={styles.rateText}>
              1 {origin} = {new Intl.NumberFormat("es-ES", { maximumFractionDigits: 6 }).format(quote.rate)} {destination}
            </Text>
            <View style={styles.dateRow}>
              <MaterialCommunityIcons name="clock-outline" size={15} color={colors.muted} />
              <Text style={styles.dateText}>Cotización del {quote.date} · {quote.source}</Text>
            </View>
            <Text style={styles.disclaimer}>Tipo de referencia, no necesariamente el aplicado por bancos o casas de cambio. No incluye comisiones.</Text>
          </View>
        ) : null}
        <Text style={styles.footer}>Los tipos de cambio se consultan en línea. El resto de calculadoras funciona sin conexión.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 16, paddingBottom: 36 },
  eyebrow: { color: colors.blue, fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  title: { color: colors.navy, fontSize: 25, fontWeight: "800", marginTop: 5 },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 6, marginBottom: 18 },
  card: { padding: 16, borderRadius: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.border },
  label: { color: colors.navy, fontSize: 12, fontWeight: "700", marginBottom: 6 },
  amountInputWrap: { flexDirection: "row", alignItems: "center", borderColor: colors.border, borderWidth: 1, borderRadius: 13, paddingHorizontal: 12, marginBottom: 16 },
  amountInput: { flex: 1, minHeight: 48, color: colors.navy, fontSize: 18, fontWeight: "700" },
  amountUnit: { color: colors.muted, fontWeight: "800", fontSize: 13 },
  fieldGroup: { marginBottom: 12 },
  pickerWrap: { overflow: "hidden", borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: "#FFFFFF" },
  picker: { height: 48, color: colors.navy },
  swapButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: -7, marginBottom: 5, borderRadius: 13, backgroundColor: "#EAF1FF" },
  button: { minHeight: 50, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.blue, borderRadius: 14, marginTop: 6 },
  buttonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  disabledButton: { opacity: 0.65 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  error: { color: colors.red, fontSize: 12, lineHeight: 17, marginTop: 12 },
  resultCard: { padding: 18, marginTop: 15, backgroundColor: "#FFFFFF", borderRadius: 19, borderWidth: 1, borderColor: colors.border },
  resultEyebrow: { color: colors.blue, fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  resultValue: { color: colors.green, fontSize: 27, fontWeight: "800", marginTop: 8 },
  rateText: { color: colors.navy, fontSize: 13, fontWeight: "700", marginTop: 5 },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 13 },
  dateText: { color: colors.muted, fontSize: 10, flex: 1 },
  disclaimer: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 10 },
  footer: { color: colors.muted, fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 17 },
});
