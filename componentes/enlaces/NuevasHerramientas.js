import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  calculateInvestment,
  calculateMonthlySavings,
  compareMortgage,
  calculateMortgagePayment,
} from "../finanzas";
import { saveSimulation } from "../almacenSimulaciones";

const palette = {
  navy: "#102A43",
  blue: "#246BFD",
  background: "#F4F7FB",
  muted: "#6B7C93",
  border: "#E1E8F0",
  green: "#16865B",
  red: "#B93845",
};

const modes = [
  { key: "comparador", label: "Hipotecas" },
  { key: "objetivo", label: "Objetivo" },
  { key: "inflacion", label: "Inversión real" },
  { key: "tabla", label: "Amortización" },
];

const initialOffers = [
  { name: "Oferta A", principal: "200000", years: "25", rate: "2.5", fees: "500", costs: "1200" },
  { name: "Oferta B", principal: "200000", years: "25", rate: "2.8", fees: "0", costs: "900" },
  { name: "Oferta C", principal: "200000", years: "25", rate: "3", fees: "300", costs: "600" },
];

function numberFromText(value) {
  const normalized = String(value)
    .trim()
    .replace(/\s/g, "")
    .replace(/[.](?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  return normalized === "" ? NaN : Number(normalized);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function Field({ label, value, onChangeText, suffix, placeholder = "0", decimal = true }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          accessibilityLabel={label}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={decimal ? "decimal-pad" : "number-pad"}
          placeholder={placeholder}
          placeholderTextColor="#A0ADBB"
          selectTextOnFocus
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

function PrimaryButton({ title, icon, onPress, secondary = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondaryButton,
        pressed && styles.pressed,
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={19}
        color={secondary ? palette.blue : "#FFFFFF"}
      />
      <Text style={[styles.buttonText, secondary && styles.secondaryButtonText]}>
        {title}
      </Text>
    </Pressable>
  );
}

function ResultLine({ label, value, highlight = false }) {
  return (
    <View style={styles.resultLine}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={[styles.resultValue, highlight && styles.highlightValue]}>{value}</Text>
    </View>
  );
}

export default function NuevasHerramientas({ route }) {
  const navigation = useNavigation();
  const [mode, setMode] = useState(route.params?.mode || "comparador");
  const [offerCount, setOfferCount] = useState(3);
  const [offers, setOffers] = useState(initialOffers);
  const [goal, setGoal] = useState({ amount: "20000", years: "5", rate: "3" });
  const [investment, setInvestment] = useState({
    initial: "5000",
    monthly: "200",
    years: "20",
    rate: "6",
    inflation: "2",
  });
  const [table, setTable] = useState({ principal: "200000", years: "25", rate: "3" });
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (route.params?.mode) {
      setMode(route.params.mode);
      setResult(null);
    }
    const saved = route.params?.simulation;
    if (!saved) return;
    setMode(saved.mode);
    if (saved.mode === "comparador" && saved.inputs) {
      setOffers((current) => [
        {
          ...current[0],
          ...saved.inputs,
          rate:
            saved.inputs.rate ??
            String(saved.inputs.annualRatePercent ?? current[0].rate),
        },
        ...current.slice(1),
      ]);
    } else if (saved.mode === "objetivo" && saved.inputs) {
      setGoal(saved.inputs);
    } else if (saved.mode === "inflacion" && saved.inputs) {
      setInvestment(saved.inputs);
    } else if (saved.mode === "tabla" && saved.inputs) {
      setTable(saved.inputs);
    }
    setResult(saved.result || null);
  }, [route.params?.mode, route.params?.simulation?.id]);

  const validNumber = (text, label, { min = 0, allowZero = false } = {}) => {
    const value = numberFromText(text);
    if (
      !Number.isFinite(value) ||
      (allowZero ? value < min : value <= min)
    ) {
      throw new RangeError(`${label}: introduce un valor ${allowZero ? "igual o superior a" : "mayor que"} ${min}.`);
    }
    return value;
  };

  const calculate = () => {
    try {
      if (mode === "comparador") {
        const calculations = offers.slice(0, offerCount).map((offer) => ({
          name: offer.name.trim() || "Hipoteca",
          inputs: {
            principal: validNumber(offer.principal, "Capital"),
            years: validNumber(offer.years, "Plazo"),
            annualRatePercent: validNumber(offer.rate, "Interés", { allowZero: true }),
            fees: validNumber(offer.fees, "Comisiones", { allowZero: true }),
            costs: validNumber(offer.costs, "Gastos", { allowZero: true }),
          },
        }));
        const compared = calculations.map((offer) => ({
          ...offer,
          ...compareMortgage(offer.inputs),
        }));
        setResult(compared);
        return;
      }

      if (mode === "objetivo") {
        const inputs = {
          amount: validNumber(goal.amount, "Meta"),
          years: validNumber(goal.years, "Plazo"),
          rate: validNumber(goal.rate, "Rentabilidad", { allowZero: true }),
        };
        setResult({
          inputs,
          monthlyContribution: calculateMonthlySavings(
            inputs.amount,
            inputs.rate,
            inputs.years
          ),
        });
        return;
      }

      if (mode === "inflacion") {
        const inputs = {
          initial: validNumber(investment.initial, "Capital inicial", { allowZero: true }),
          monthly: validNumber(investment.monthly, "Aportación mensual", { allowZero: true }),
          years: validNumber(investment.years, "Plazo"),
          rate: validNumber(investment.rate, "Rentabilidad", { allowZero: true }),
          inflation: validNumber(investment.inflation, "Inflación", { allowZero: true }),
        };
        setResult({
          inputs,
          ...calculateInvestment({
            initialCapital: inputs.initial,
            monthlyContribution: inputs.monthly,
            annualReturnPercent: inputs.rate,
            annualInflationPercent: inputs.inflation,
            years: inputs.years,
          }),
        });
        return;
      }

      const inputs = {
        principal: validNumber(table.principal, "Capital"),
        years: validNumber(table.years, "Plazo"),
        rate: validNumber(table.rate, "Interés", { allowZero: true }),
      };
      const payment = calculateMortgagePayment(
        inputs.principal,
        inputs.rate,
        inputs.years
      );
      const monthlyRate = inputs.rate / 100 / 12;
      let balance = inputs.principal;
      const rows = Array.from({ length: Math.round(inputs.years * 12) }, (_, index) => {
        const interest = balance * monthlyRate;
        const principalPaid = Math.min(balance, payment - interest);
        balance = Math.max(0, balance - principalPaid);
        return {
          month: index + 1,
          payment,
          interest,
          principalPaid,
          balance,
        };
      });
      setResult({
        inputs,
        payment,
        totalInterest: payment * rows.length - inputs.principal,
        rows,
      });
    } catch (error) {
      Alert.alert("Revisa los datos", error.message);
    }
  };

  const saveCurrentSimulation = async () => {
    if (!result) {
      Alert.alert("Sin resultados", "Calcula primero la simulación que quieres guardar.");
      return;
    }
    try {
      setBusy(true);
      const titleByMode = {
        comparador: "Comparativa de hipotecas",
        objetivo: "Objetivo de ahorro",
        inflacion: "Inversión e inflación",
        tabla: "Tabla de amortización",
      };
      const inputs =
        mode === "comparador"
          ? result[0]?.inputs
          : result.inputs;
      await saveSimulation({
        type: mode === "comparador" ? "hipoteca" : mode,
        mode,
        title: titleByMode[mode],
        inputs,
        result,
      });
      Alert.alert("Simulación guardada", "Ya puedes consultarla en Mis simulaciones.");
    } catch (error) {
      Alert.alert("No se pudo guardar", "Comprueba el espacio disponible e inténtalo de nuevo.");
      console.error("Error guardando simulación:", error);
    } finally {
      setBusy(false);
    }
  };

  const currentTitle = useMemo(
    () => modes.find((item) => item.key === mode)?.label || "Simulador",
    [mode]
  );
  const updateOffer = (index, key, value) => {
    setOffers((current) =>
      current.map((offer, offerIndex) =>
        offerIndex === index ? { ...offer, [key]: value } : offer
      )
    );
  };

  const renderMortgageForm = () => (
    <>
      {offers.slice(0, 3).map((offer, index) => (
        index < offerCount ? (
        <View key={offer.name} style={styles.offerCard}>
          <View style={styles.offerHeader}>
            <View style={styles.offerIcon}>
              <MaterialCommunityIcons name="home-city-outline" size={19} color={palette.blue} />
            </View>
            <Text style={styles.offerTitle}>{offer.name}</Text>
            {index === 0 ? <Text style={styles.recommended}>REFERENCIA</Text> : null}
          </View>
          <Field label="Capital" value={offer.principal} suffix="€" onChangeText={(value) => updateOffer(index, "principal", value)} />
          <View style={styles.fieldRow}>
            <View style={styles.halfField}>
              <Field label="Plazo" value={offer.years} suffix="años" onChangeText={(value) => updateOffer(index, "years", value)} decimal={false} />
            </View>
            <View style={styles.halfField}>
              <Field label="Interés anual" value={offer.rate} suffix="%" onChangeText={(value) => updateOffer(index, "rate", value)} />
            </View>
          </View>
          <View style={styles.fieldRow}>
            <View style={styles.halfField}>
              <Field label="Comisiones" value={offer.fees} suffix="€" onChangeText={(value) => updateOffer(index, "fees", value)} />
            </View>
            <View style={styles.halfField}>
              <Field label="Gastos" value={offer.costs} suffix="€" onChangeText={(value) => updateOffer(index, "costs", value)} />
            </View>
          </View>
        </View>
        ) : null
      ))}
    </>
  );

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
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>PLANIFICA MEJOR</Text>
          <Text style={styles.title}>{currentTitle}</Text>
          <Text style={styles.subtitle}>Simulaciones orientativas, sin conexión ni servicios de pago.</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modeSelector}>
          {modes.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => {
                setMode(item.key);
                setResult(null);
              }}
              style={({ pressed }) => [
                styles.modeChip,
                mode === item.key && styles.modeChipActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.modeText, mode === item.key && styles.modeTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.formCard}>
          {mode === "comparador" && (
            <>
              <Text style={styles.fieldLabel}>Número de ofertas</Text>
              <View style={styles.countSelector}>
                {[2, 3].map((count) => (
                  <Pressable
                    key={count}
                    onPress={() => setOfferCount(count)}
                    style={[
                      styles.countButton,
                      offerCount === count && styles.countButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.countText,
                        offerCount === count && styles.countTextActive,
                      ]}
                    >
                      {count} ofertas
                    </Text>
                  </Pressable>
                ))}
              </View>
              {renderMortgageForm()}
            </>
          )}
          {mode === "objetivo" && (
            <>
              <Field label="Cantidad objetivo" value={goal.amount} suffix="€" onChangeText={(amount) => setGoal({ ...goal, amount })} />
              <Field label="Tiempo para alcanzarla" value={goal.years} suffix="años" onChangeText={(years) => setGoal({ ...goal, years })} />
              <Field label="Rentabilidad anual estimada" value={goal.rate} suffix="%" onChangeText={(rate) => setGoal({ ...goal, rate })} />
              <Text style={styles.helper}>Aportaciones mensuales al final de cada mes. La rentabilidad es una estimación, no una garantía.</Text>
            </>
          )}
          {mode === "inflacion" && (
            <>
              <Field label="Capital inicial" value={investment.initial} suffix="€" onChangeText={(initial) => setInvestment({ ...investment, initial })} />
              <Field label="Aportación mensual" value={investment.monthly} suffix="€" onChangeText={(monthly) => setInvestment({ ...investment, monthly })} />
              <Field label="Plazo" value={investment.years} suffix="años" onChangeText={(years) => setInvestment({ ...investment, years })} />
              <View style={styles.fieldRow}>
                <View style={styles.halfField}>
                  <Field label="Rentabilidad anual" value={investment.rate} suffix="%" onChangeText={(rate) => setInvestment({ ...investment, rate })} />
                </View>
                <View style={styles.halfField}>
                  <Field label="Inflación anual" value={investment.inflation} suffix="%" onChangeText={(inflation) => setInvestment({ ...investment, inflation })} />
                </View>
              </View>
              <Text style={styles.helper}>El valor real descuenta la inflación acumulada del capital futuro estimado.</Text>
            </>
          )}
          {mode === "tabla" && (
            <>
              <Field label="Capital del préstamo" value={table.principal} suffix="€" onChangeText={(principal) => setTable({ ...table, principal })} />
              <Field label="Plazo" value={table.years} suffix="años" onChangeText={(years) => setTable({ ...table, years })} />
              <Field label="Interés anual" value={table.rate} suffix="%" onChangeText={(rate) => setTable({ ...table, rate })} />
            </>
          )}
          <PrimaryButton title="Calcular simulación" icon="calculator-variant-outline" onPress={calculate} />
        </View>

        {Array.isArray(result) && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Comparativa de ofertas</Text>
            {result.map((offer) => (
              <View key={offer.name} style={styles.resultCard}>
                <Text style={styles.resultCardTitle}>{offer.name}</Text>
                <ResultLine label="Cuota mensual" value={formatCurrency(offer.monthlyPayment)} highlight />
                <ResultLine label="Intereses" value={formatCurrency(offer.totalInterest)} />
                <ResultLine label="Coste total con gastos" value={formatCurrency(offer.totalCost)} />
              </View>
            ))}
            <Text style={styles.helper}>No se incluyen seguros, productos vinculados ni posibles cambios del tipo de interés.</Text>
          </View>
        )}

        {result && !Array.isArray(result) && mode === "objetivo" && (
          <View style={styles.resultCard}>
            <Text style={styles.resultCardTitle}>Tu aportación estimada</Text>
            <Text style={styles.bigResult}>{formatCurrency(result.monthlyContribution)}<Text style={styles.bigResultUnit}> / mes</Text></Text>
            <Text style={styles.helper}>Para alcanzar {formatCurrency(result.inputs.amount)} en {result.inputs.years} años.</Text>
          </View>
        )}

        {result && !Array.isArray(result) && mode === "inflacion" && (
          <View style={styles.resultCard}>
            <Text style={styles.resultCardTitle}>Valor estimado al final del plazo</Text>
            <ResultLine label="Capital futuro nominal" value={formatCurrency(result.futureValue)} highlight />
            <ResultLine label="Valor real de hoy" value={formatCurrency(result.realValue)} />
            <ResultLine label="Aportaciones totales" value={formatCurrency(result.totalContributions)} />
            <Text style={styles.helper}>Proyección matemática; la rentabilidad real puede variar.</Text>
          </View>
        )}

        {result && !Array.isArray(result) && mode === "tabla" && (
          <View style={styles.resultCard}>
            <Text style={styles.resultCardTitle}>Cuadro de amortización</Text>
            <ResultLine label="Cuota mensual" value={formatCurrency(result.payment)} highlight />
            <ResultLine label="Intereses totales" value={formatCurrency(result.totalInterest)} />
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeading}>Mes</Text>
              <Text style={styles.tableHeading}>Cuota</Text>
              <Text style={styles.tableHeading}>Capital pendiente</Text>
            </View>
            {result.rows.slice(0, 12).map((row) => (
              <View key={row.month} style={styles.tableRow}>
                <Text style={styles.tableCell}>{row.month}</Text>
                <Text style={styles.tableCell}>{formatCurrency(row.payment)}</Text>
                <Text style={styles.tableCell}>{formatCurrency(row.balance)}</Text>
              </View>
            ))}
            {result.rows.length > 12 ? <Text style={styles.helper}>Mostrando las primeras 12 de {result.rows.length} cuotas.</Text> : null}
          </View>
        )}

        {result ? (
          <PrimaryButton
            title={busy ? "Guardando..." : "Guardar simulación"}
            icon="bookmark-outline"
            onPress={saveCurrentSimulation}
            secondary
          />
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  content: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 34 },
  heading: { marginBottom: 17 },
  eyebrow: { color: palette.blue, fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  title: { color: palette.navy, fontSize: 25, fontWeight: "800", marginTop: 5 },
  subtitle: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 5 },
  modeSelector: { flexGrow: 0, marginBottom: 14 },
  modeChip: { paddingHorizontal: 14, paddingVertical: 9, backgroundColor: "#FFFFFF", borderColor: palette.border, borderWidth: 1, borderRadius: 18, marginRight: 7 },
  modeChipActive: { backgroundColor: palette.navy, borderColor: palette.navy },
  modeText: { color: palette.muted, fontSize: 12, fontWeight: "700" },
  modeTextActive: { color: "#FFFFFF" },
  formCard: { padding: 15, backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: palette.border },
  offerCard: { padding: 12, marginBottom: 12, borderRadius: 16, backgroundColor: "#F8FAFD", borderWidth: 1, borderColor: palette.border },
  offerHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  countSelector: { flexDirection: "row", gap: 8, marginTop: 6, marginBottom: 12 },
  countButton: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: palette.border, backgroundColor: "#FFFFFF" },
  countButtonActive: { backgroundColor: "#EAF1FF", borderColor: palette.blue },
  countText: { color: palette.muted, fontSize: 12, fontWeight: "700" },
  countTextActive: { color: palette.blue },
  offerIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#EAF1FF", alignItems: "center", justifyContent: "center", marginRight: 9 },
  offerTitle: { flex: 1, color: palette.navy, fontSize: 14, fontWeight: "800" },
  recommended: { color: palette.blue, fontSize: 9, fontWeight: "800", letterSpacing: 0.6 },
  fieldGroup: { marginBottom: 12 },
  fieldLabel: { color: palette.navy, fontSize: 12, fontWeight: "700", marginBottom: 5 },
  inputRow: { minHeight: 46, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: palette.border, borderRadius: 12, backgroundColor: "#FFFFFF", paddingHorizontal: 11 },
  input: { flex: 1, paddingVertical: 9, color: palette.navy, fontSize: 15, fontWeight: "600" },
  suffix: { color: palette.muted, fontSize: 12, fontWeight: "700", marginLeft: 8 },
  fieldRow: { flexDirection: "row", gap: 9 },
  halfField: { flex: 1 },
  helper: { color: palette.muted, fontSize: 11, lineHeight: 16, marginTop: 5 },
  button: { minHeight: 50, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, paddingHorizontal: 14, backgroundColor: palette.blue, borderRadius: 14, marginTop: 8 },
  buttonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  secondaryButton: { backgroundColor: "#EAF1FF", marginTop: 12 },
  secondaryButtonText: { color: palette.blue },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  resultsSection: { marginTop: 21 },
  sectionTitle: { color: palette.navy, fontSize: 18, fontWeight: "800", marginBottom: 10 },
  resultCard: { padding: 16, backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: palette.border, marginTop: 13 },
  resultCardTitle: { color: palette.navy, fontWeight: "800", fontSize: 15, marginBottom: 13 },
  resultLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border },
  resultLabel: { color: palette.muted, fontSize: 12, flex: 1 },
  resultValue: { color: palette.navy, fontSize: 13, fontWeight: "700", marginLeft: 8 },
  highlightValue: { color: palette.green, fontWeight: "800" },
  bigResult: { color: palette.green, fontSize: 30, fontWeight: "800", marginVertical: 5 },
  bigResultUnit: { color: palette.muted, fontSize: 14, fontWeight: "600" },
  tableHeader: { flexDirection: "row", marginTop: 15, paddingVertical: 9, backgroundColor: "#EEF4FF", borderRadius: 8 },
  tableHeading: { flex: 1, textAlign: "center", color: palette.navy, fontSize: 10, fontWeight: "800" },
  tableRow: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border },
  tableCell: { flex: 1, textAlign: "center", color: palette.navy, fontSize: 10 },
});
