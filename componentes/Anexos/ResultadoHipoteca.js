import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { BannerPublicidad as BannerAd } from "./Publicidad";
import Anuncio from "./Anuncio";
import { saveSimulation } from "../almacenSimulaciones";
import {
  calculateMortgagePayment,
  parseFinancialNumber,
} from "../finanzas";

const colors = {
  navy: "#102A43",
  blue: "#246BFD",
  background: "#F4F7FB",
  muted: "#6B7C93",
  border: "#E1E8F0",
  green: "#16865B",
};

function euro(value) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ResultadoHipoteca({ route }) {
  const navigation = useNavigation();
  const { capital, plazo, interes } = route.params;
  const [results, setResults] = useState(null);
  const [saving, setSaving] = useState(false);
  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-6921150380725872/2360831572";

  useEffect(() => {
    try {
      const principal = parseFinancialNumber(capital);
      const years = parseFinancialNumber(plazo);
      const annualRatePercent = parseFinancialNumber(interes);
      const monthlyPayment = calculateMortgagePayment(
        principal,
        annualRatePercent,
        years
      );
      const periods = Math.round(years * 12);
      const monthlyRate = annualRatePercent / 100 / 12;
      let balance = principal;
      let totalInterest = 0;
      let totalPaid = 0;
      const amortization = Array.from({ length: periods }, (_, index) => {
        const interestPaid = balance * monthlyRate;
        const principalPaid = Math.min(balance, monthlyPayment - interestPaid);
        const payment = principalPaid + interestPaid;
        balance = Math.max(0, balance - principalPaid);
        totalInterest += interestPaid;
        totalPaid += payment;
        return {
          periodo: index + 1,
          cuota: payment.toFixed(2),
          interes: interestPaid.toFixed(2),
          amortizacion: principalPaid.toFixed(2),
          saldoPendiente: balance.toFixed(2),
        };
      });
      setResults({
        principal,
        years,
        annualRatePercent,
        monthlyPayment,
        totalInterest,
        totalPaid,
        amortization,
      });
    } catch (error) {
      Alert.alert("No se pudo calcular", error.message);
      navigation.goBack();
    }
  }, [capital, interes, navigation, plazo]);

  const save = async () => {
    if (!results) return;
    try {
      setSaving(true);
      await saveSimulation({
        type: "hipoteca",
        mode: "comparador",
        title: `Hipoteca · ${euro(results.principal)}`,
        inputs: {
          principal: results.principal,
          years: results.years,
          annualRatePercent: results.annualRatePercent,
          fees: 0,
          costs: 0,
        },
        result: [
          {
            name: "Hipoteca",
            monthlyPayment: results.monthlyPayment,
            totalInterest: results.totalInterest,
            totalCost: results.totalPaid,
          },
        ],
      });
      Alert.alert("Simulación guardada", "Puedes consultarla en Mis simulaciones.");
    } catch (error) {
      Alert.alert("No se pudo guardar", "Inténtalo de nuevo.");
      console.error("Error guardando hipoteca:", error);
    } finally {
      setSaving(false);
    }
  };

  const share = async () => {
    if (!results) return;
    try {
      const { Share } = require("react-native");
      await Share.share({
        message: `Simulación hipotecaria: cuota mensual ${euro(results.monthlyPayment)}, capital ${euro(results.principal)}, intereses ${euro(results.totalInterest)}.`,
      });
    } catch (error) {
      Alert.alert("No se pudo compartir", "Inténtalo de nuevo.");
      console.error("Error compartiendo simulación hipotecaria:", error);
    }
  };

  if (!results) return <View style={styles.screen} />;

  const principalShare = (results.principal / results.totalPaid) * 100;
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>RESULTADO DE TU SIMULACIÓN</Text>
          <Text style={styles.title}>Hipoteca</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Compartir simulación"
          onPress={share}
          style={({ pressed }) => [styles.shareButton, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons name="share-variant-outline" size={20} color={colors.blue} />
        </Pressable>
      </View>

      <Anuncio />

      <View style={styles.heroResult}>
        <Text style={styles.heroLabel}>CUOTA MENSUAL</Text>
        <Text style={styles.heroAmount}>{euro(results.monthlyPayment)}</Text>
        <Text style={styles.heroMeta}>
          {euro(results.principal)} · {results.years} años · {results.annualRatePercent}% TIN
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Coste del préstamo</Text>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Capital solicitado</Text>
          <Text style={styles.metricValue}>{euro(results.principal)}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Intereses totales estimados</Text>
          <Text style={styles.metricValue}>{euro(results.totalInterest)}</Text>
        </View>
        <View style={[styles.metric, styles.lastMetric]}>
          <Text style={styles.metricLabel}>Total pagado</Text>
          <Text style={[styles.metricValue, styles.totalValue]}>{euro(results.totalPaid)}</Text>
        </View>
        <View style={styles.chartTrack}>
          <View style={[styles.principalBar, { flex: principalShare }]} />
          <View style={[styles.interestBar, { flex: 100 - principalShare }]} />
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.blue }]} />
            <Text style={styles.legendText}>Capital ({principalShare.toFixed(0)} %)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#71B7A1" }]} />
            <Text style={styles.legendText}>Intereses ({(100 - principalShare).toFixed(0)} %)</Text>
          </View>
        </View>
      </View>

      <Text style={styles.note}>
        Estimación con cuota constante y tipo nominal anual fijo. No incluye comisiones, seguros ni otros gastos.
      </Text>

      <Pressable
        onPress={() => navigation.navigate("Tabla", { data: results.amortization })}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
      >
        <MaterialCommunityIcons name="table-large" size={19} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Ver tabla de amortización</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("NuevasHerramientas", { mode: "comparador" })}
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
      >
        <MaterialCommunityIcons name="compare-horizontal" size={18} color={colors.blue} />
        <Text style={styles.secondaryButtonText}>Comparar otra oferta</Text>
      </Pressable>
      <Pressable
        onPress={save}
        disabled={saving}
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
      >
        <MaterialCommunityIcons name="bookmark-outline" size={18} color={colors.blue} />
        <Text style={styles.secondaryButtonText}>
          {saving ? "Guardando..." : "Guardar simulación"}
        </Text>
      </Pressable>

      <BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 18, paddingBottom: 30 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  eyebrow: { color: colors.blue, fontWeight: "800", fontSize: 10, letterSpacing: 1.1 },
  title: { color: colors.navy, fontSize: 25, fontWeight: "800", marginTop: 4 },
  shareButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.border },
  heroResult: { padding: 20, marginTop: 8, backgroundColor: colors.navy, borderRadius: 21 },
  heroLabel: { color: "#A9C6FF", fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  heroAmount: { color: "#FFFFFF", fontSize: 32, fontWeight: "800", marginTop: 5 },
  heroMeta: { color: "#D6E2F0", fontSize: 12, marginTop: 7 },
  card: { padding: 16, marginTop: 14, backgroundColor: "#FFFFFF", borderRadius: 19, borderWidth: 1, borderColor: colors.border },
  cardTitle: { color: colors.navy, fontSize: 15, fontWeight: "800", marginBottom: 7 },
  metric: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  lastMetric: { borderBottomWidth: 0 },
  metricLabel: { flex: 1, color: colors.muted, fontSize: 12 },
  metricValue: { color: colors.navy, fontSize: 13, fontWeight: "700" },
  totalValue: { color: colors.green, fontWeight: "800" },
  chartTrack: { flexDirection: "row", height: 13, overflow: "hidden", borderRadius: 10, marginTop: 15 },
  principalBar: { backgroundColor: colors.blue },
  interestBar: { backgroundColor: "#71B7A1" },
  legend: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 8, marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: colors.muted, fontSize: 10 },
  note: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 12 },
  primaryButton: { minHeight: 50, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, backgroundColor: colors.blue, borderRadius: 14, marginTop: 16 },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
  secondaryButton: { minHeight: 46, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, backgroundColor: "#EAF1FF", borderRadius: 13, marginTop: 9 },
  secondaryButtonText: { color: colors.blue, fontWeight: "700", fontSize: 13 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
});
