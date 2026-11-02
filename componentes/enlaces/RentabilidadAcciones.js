import React, { useState } from "react";
import {
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

const colors = {
  navy: "#102A43",
  blue: "#246BFD",
  background: "#F4F7FB",
  muted: "#6B7C93",
  border: "#E1E8F0",
  green: "#16865B",
  red: "#B93845",
};

function parseValue(value) {
  const parsed = Number(String(value).trim().replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function currency(value, code) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 2,
  }).format(value);
}

function Field({ label, value, onChangeText, placeholder }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A0ADBB"
        keyboardType="decimal-pad"
      />
    </View>
  );
}

export default function RentabilidadAcciones() {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [currencyCode, setCurrencyCode] = useState("EUR");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculate = () => {
    const shares = parseValue(quantity);
    const purchase = parseValue(purchasePrice);
    const current = parseValue(currentPrice);
    if (
      !Number.isFinite(shares) ||
      !Number.isFinite(purchase) ||
      !Number.isFinite(current) ||
      shares <= 0 ||
      purchase <= 0 ||
      current <= 0
    ) {
      setError("Introduce una cantidad y precios mayores que cero.");
      setResult(null);
      return;
    }

    const invested = shares * purchase;
    const currentValue = shares * current;
    setResult({
      invested,
      currentValue,
      profit: currentValue - invested,
      percentage: ((currentValue - invested) / invested) * 100,
      asOf: new Date().toLocaleDateString("es-ES"),
    });
    setError("");
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
        <Text style={styles.eyebrow}>ANÁLISIS DE INVERSIÓN</Text>
        <Text style={styles.title}>Rentabilidad de acciones</Text>
        <Text style={styles.subtitle}>Calcula la variación de valor con precios que tú proporcionas.</Text>

        <View style={styles.notice}>
          <MaterialCommunityIcons name="information-outline" size={19} color={colors.blue} />
          <Text style={styles.noticeText}>
            No se muestran cotizaciones en tiempo real. Introduce manualmente el precio actual consultado en tu mercado de referencia.
          </Text>
        </View>

        <View style={styles.card}>
          <Field label="Símbolo (opcional)" value={symbol} onChangeText={setSymbol} placeholder="Ej. SAN, AAPL" />
          <Field label="Número de acciones" value={quantity} onChangeText={setQuantity} placeholder="Ej. 10" />
          <Field label="Precio medio de compra" value={purchasePrice} onChangeText={setPurchasePrice} placeholder="Ej. 25,50" />
          <Field label="Precio actual (introducción manual)" value={currentPrice} onChangeText={setCurrentPrice} placeholder="Ej. 28,10" />
          <Text style={styles.label}>Divisa de ambos precios</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={currencyCode}
              onValueChange={(value) => setCurrencyCode(value)}
              style={styles.picker}
            >
              <Picker.Item label="EUR · Euro" value="EUR" />
              <Picker.Item label="USD · Dólar estadounidense" value="USD" />
              <Picker.Item label="GBP · Libra esterlina" value="GBP" />
            </Picker>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={calculate}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <MaterialCommunityIcons name="chart-line" size={19} color="#FFFFFF" />
            <Text style={styles.buttonText}>Calcular rentabilidad</Text>
          </Pressable>
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        </View>

        {result ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultEyebrow}>{symbol.trim() ? symbol.trim().toUpperCase() : "RESULTADO"}</Text>
            <Text style={[styles.profit, result.profit < 0 && styles.loss]}>
              {currency(result.profit, currencyCode)}
            </Text>
            <Text style={[styles.percentage, result.profit < 0 && styles.loss]}>
              {result.percentage >= 0 ? "+" : ""}{result.percentage.toLocaleString("es-ES", { maximumFractionDigits: 2 })} %
            </Text>
            <View style={styles.divider} />
            <View style={styles.resultLine}>
              <Text style={styles.resultLabel}>Importe invertido</Text>
              <Text style={styles.resultValue}>{currency(result.invested, currencyCode)}</Text>
            </View>
            <View style={styles.resultLine}>
              <Text style={styles.resultLabel}>Valor actual</Text>
              <Text style={styles.resultValue}>{currency(result.currentValue, currencyCode)}</Text>
            </View>
            <Text style={styles.dateText}>Cálculo realizado el {result.asOf}. Precio actual introducido manualmente.</Text>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 16, paddingBottom: 36 },
  eyebrow: { color: colors.blue, fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  title: { color: colors.navy, fontSize: 25, fontWeight: "800", marginTop: 5 },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 6, marginBottom: 15 },
  notice: { flexDirection: "row", alignItems: "flex-start", gap: 9, padding: 13, marginBottom: 14, borderRadius: 14, backgroundColor: "#EAF1FF" },
  noticeText: { flex: 1, color: colors.navy, fontSize: 11, lineHeight: 16 },
  card: { padding: 16, backgroundColor: "#FFFFFF", borderColor: colors.border, borderWidth: 1, borderRadius: 20 },
  fieldGroup: { marginBottom: 13 },
  label: { color: colors.navy, fontSize: 12, fontWeight: "700", marginBottom: 6 },
  input: { height: 47, color: colors.navy, fontSize: 15, fontWeight: "600", paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 12 },
  pickerWrap: { overflow: "hidden", borderWidth: 1, borderColor: colors.border, borderRadius: 12, marginBottom: 12 },
  picker: { height: 48, color: colors.navy },
  button: { minHeight: 50, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, backgroundColor: colors.blue, borderRadius: 14, marginTop: 4 },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  error: { color: colors.red, fontSize: 12, marginTop: 10 },
  resultCard: { padding: 18, marginTop: 15, backgroundColor: "#FFFFFF", borderColor: colors.border, borderWidth: 1, borderRadius: 19 },
  resultEyebrow: { color: colors.blue, fontWeight: "800", fontSize: 10, letterSpacing: 1 },
  profit: { color: colors.green, fontWeight: "800", fontSize: 28, marginTop: 6 },
  percentage: { color: colors.green, fontSize: 15, fontWeight: "700", marginTop: 2 },
  loss: { color: colors.red },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: 13 },
  resultLine: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 7 },
  resultLabel: { color: colors.muted, fontSize: 12 },
  resultValue: { color: colors.navy, fontSize: 12, fontWeight: "700" },
  dateText: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 11 },
});
