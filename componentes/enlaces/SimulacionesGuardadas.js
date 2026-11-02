import React, { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  deleteSimulation,
  getSimulations,
} from "../almacenSimulaciones";

const colors = {
  navy: "#102A43",
  blue: "#246BFD",
  muted: "#6B7C93",
  border: "#E1E8F0",
  background: "#F4F7FB",
  green: "#16865B",
  red: "#B93845",
};

function euro(value) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function getSummary(simulation) {
  if (simulation.mode === "comparador" && Array.isArray(simulation.result)) {
    const cheapest = [...simulation.result].sort((a, b) => a.totalCost - b.totalCost)[0];
    return cheapest
      ? `Menor coste: ${cheapest.name} · ${euro(cheapest.totalCost)}`
      : "Comparativa guardada";
  }
  if (simulation.mode === "objetivo") {
    return `${euro(simulation.result.monthlyContribution)} al mes`;
  }
  if (simulation.mode === "inflacion") {
    return `Valor real estimado: ${euro(simulation.result.realValue)}`;
  }
  if (simulation.mode === "tabla") {
    return `Cuota mensual: ${euro(simulation.result.payment)}`;
  }
  return "Simulación guardada";
}

export default function SimulacionesGuardadas() {
  const navigation = useNavigation();
  const [simulations, setSimulations] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loadError, setLoadError] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setSimulations(await getSimulations());
      setLoadError(false);
    } catch (error) {
      setLoadError(true);
      console.error("Error leyendo simulaciones:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const remove = (simulation) => {
    Alert.alert(
      "Eliminar simulación",
      `¿Quieres eliminar «${simulation.title}»?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSimulation(simulation.id);
              setSelectedIds((ids) => ids.filter((id) => id !== simulation.id));
              refresh();
            } catch (error) {
              Alert.alert("No se pudo eliminar", "Inténtalo de nuevo.");
              console.error("Error eliminando simulación:", error);
            }
          },
        },
      ]
    );
  };

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
      return;
    }
    if (selectedIds.length === 3) {
      Alert.alert("Máximo de comparaciones", "Puedes comparar hasta tres simulaciones guardadas.");
      return;
    }
    setSelectedIds([...selectedIds, id]);
  };

  const compareRows = selectedIds
    .map((id) => simulations.find((simulation) => simulation.id === id))
    .filter((simulation) => simulation?.mode === "comparador")
    .flatMap((simulation) =>
      (Array.isArray(simulation.result) ? simulation.result : []).map((offer) => ({
        ...offer,
        savedTitle: simulation.title,
      }))
    )
    .sort((a, b) => a.totalCost - b.totalCost);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>EN ESTE DISPOSITIVO</Text>
      <Text style={styles.title}>Mis simulaciones</Text>
      <Text style={styles.subtitle}>Tus cálculos se guardan localmente y no se envían a ningún servidor.</Text>

      {loadError ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No se pudieron cargar las simulaciones</Text>
          <Pressable onPress={refresh} style={styles.retryButton}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : simulations.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons name="bookmark-outline" size={27} color={colors.blue} />
          </View>
          <Text style={styles.emptyTitle}>Aún no tienes simulaciones</Text>
          <Text style={styles.emptyText}>Calcula una hipoteca, inversión u objetivo y pulsa «Guardar simulación».</Text>
        </View>
      ) : (
        <>
          {simulations.some((simulation) => simulation.mode === "comparador") ? (
            <View style={styles.compareHeader}>
              <Text style={styles.compareTitle}>Comparar hipotecas guardadas</Text>
              <Text style={styles.compareHint}>Selecciona hasta 3 comparativas.</Text>
              {compareRows.length > 0 ? (
                <View style={styles.compareCard}>
                  {compareRows.map((offer, index) => (
                    <View key={`${offer.savedTitle}-${offer.name}-${index}`} style={styles.compareRow}>
                      <View style={styles.rank}>
                        <Text style={styles.rankText}>{index + 1}</Text>
                      </View>
                      <View style={styles.compareName}>
                        <Text style={styles.offerName}>{offer.name}</Text>
                        <Text style={styles.compareMeta}>{offer.savedTitle}</Text>
                      </View>
                      <Text style={styles.compareAmount}>{euro(offer.totalCost)}</Text>
                    </View>
                  ))}
                  <Text style={styles.cheapestNote}>Ordenadas por coste total estimado más bajo.</Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {simulations.map((simulation) => {
            const selected = selectedIds.includes(simulation.id);
            return (
              <View key={simulation.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.cardIcon}>
                    <MaterialCommunityIcons
                      name={simulation.mode === "comparador" ? "home-city-outline" : "chart-box-outline"}
                      size={21}
                      color={colors.blue}
                    />
                  </View>
                  <View style={styles.cardHeading}>
                    <Text style={styles.cardTitle}>{simulation.title}</Text>
                    <Text style={styles.cardDate}>
                      {new Date(simulation.savedAt).toLocaleDateString("es-ES")}
                    </Text>
                  </View>
                  {simulation.mode === "comparador" ? (
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected }}
                      onPress={() => toggleSelection(simulation.id)}
                      style={[styles.selectButton, selected && styles.selectedButton]}
                    >
                      <MaterialCommunityIcons
                        name={selected ? "check" : "plus"}
                        size={18}
                        color={selected ? "#FFFFFF" : colors.blue}
                      />
                    </Pressable>
                  ) : null}
                </View>
                <Text style={styles.summary}>{getSummary(simulation)}</Text>
                <View style={styles.actions}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate("NuevasHerramientas", {
                        mode: simulation.mode,
                        simulation,
                      })
                    }
                    style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                  >
                    <MaterialCommunityIcons name="restore" size={17} color={colors.blue} />
                    <Text style={styles.actionText}>Recuperar</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => remove(simulation)}
                    style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                  >
                    <MaterialCommunityIcons name="delete-outline" size={17} color={colors.red} />
                    <Text style={[styles.actionText, { color: colors.red }]}>Eliminar</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 36 },
  eyebrow: { color: colors.blue, fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  title: { color: colors.navy, fontSize: 26, fontWeight: "800", marginTop: 5 },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 6, marginBottom: 18 },
  emptyCard: { alignItems: "center", padding: 24, marginTop: 14, backgroundColor: "#FFFFFF", borderRadius: 19, borderWidth: 1, borderColor: colors.border },
  emptyIcon: { width: 52, height: 52, alignItems: "center", justifyContent: "center", borderRadius: 17, backgroundColor: "#EAF1FF", marginBottom: 12 },
  emptyTitle: { color: colors.navy, fontSize: 16, fontWeight: "800", textAlign: "center" },
  emptyText: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 7 },
  retryButton: { backgroundColor: colors.blue, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, marginTop: 14 },
  retryText: { color: "#FFFFFF", fontWeight: "700" },
  compareHeader: { marginBottom: 14 },
  compareTitle: { color: colors.navy, fontSize: 17, fontWeight: "800" },
  compareHint: { color: colors.muted, fontSize: 12, marginTop: 3 },
  compareCard: { padding: 13, marginTop: 10, borderRadius: 17, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.border },
  compareRow: { flexDirection: "row", alignItems: "center", paddingVertical: 9, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rank: { width: 25, height: 25, alignItems: "center", justifyContent: "center", backgroundColor: "#EAF1FF", borderRadius: 8, marginRight: 8 },
  rankText: { color: colors.blue, fontWeight: "800", fontSize: 11 },
  compareName: { flex: 1 },
  offerName: { color: colors.navy, fontWeight: "700", fontSize: 12 },
  compareMeta: { color: colors.muted, fontSize: 10, marginTop: 2 },
  compareAmount: { color: colors.green, fontWeight: "800", fontSize: 12 },
  cheapestNote: { color: colors.muted, fontSize: 10, marginTop: 9 },
  card: { padding: 15, marginTop: 11, borderRadius: 18, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.border },
  cardTop: { flexDirection: "row", alignItems: "center" },
  cardIcon: { width: 40, height: 40, justifyContent: "center", alignItems: "center", backgroundColor: "#EAF1FF", borderRadius: 13, marginRight: 10 },
  cardHeading: { flex: 1 },
  cardTitle: { color: colors.navy, fontSize: 14, fontWeight: "800" },
  cardDate: { color: colors.muted, fontSize: 11, marginTop: 3 },
  selectButton: { width: 32, height: 32, alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1, borderColor: colors.blue },
  selectedButton: { backgroundColor: colors.blue },
  summary: { color: colors.green, fontSize: 13, fontWeight: "700", marginTop: 13 },
  actions: { flexDirection: "row", gap: 16, marginTop: 14, paddingTop: 11, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  actionButton: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 4 },
  actionText: { color: colors.blue, fontSize: 12, fontWeight: "700" },
  pressed: { opacity: 0.65 },
});
