import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  addRecentTool,
  getFavorites,
  getRecentTools,
  toggleFavorite,
} from "./almacenSimulaciones";

const categories = [
  {
    title: "Financiación",
    tools: [
      { title: "Hipoteca", description: "Cuota, intereses y coste total", icon: "home-city-outline", route: "CalculadoraHipotecaria" },
      { title: "Préstamo", description: "Calcula tu cuota mensual", icon: "cash-fast", route: "Prestamo" },
      { title: "Amortización anticipada", description: "Reduce cuota o plazo", icon: "trending-down", route: "CalculadoraAmortAnticipada" },
      { title: "Periodo de carencia", description: "Simula el inicio del préstamo", icon: "pause-circle-outline", route: "CalculadoraCarencia" },
      { title: "Comparador de hipotecas", description: "Compara hasta tres ofertas", icon: "compare-horizontal", route: "NuevasHerramientas", mode: "comparador" },
    ],
  },
  {
    title: "Ahorro e inversión",
    tools: [
      { title: "Ahorro periódico", description: "Aportación para alcanzar una meta", icon: "piggy-bank-outline", route: "Ahorros" },
      { title: "Interés compuesto", description: "Proyecta el crecimiento del capital", icon: "chart-timeline-variant", route: "CalculadoraInversiones" },
      { title: "Inversión e inflación", description: "Compara capital futuro y valor real", icon: "chart-areaspline", route: "NuevasHerramientas", mode: "inflacion" },
      { title: "Rentabilidad de acciones", description: "Introduce tus datos de mercado", icon: "finance", route: "Acciones" },
    ],
  },
  {
    title: "Planificación",
    tools: [
      { title: "Jubilación", description: "Proyecta tu ahorro futuro", icon: "beach", route: "Jubilacion" },
      { title: "Rentas", description: "Estima una renta periódica", icon: "cash-multiple", route: "CalculadoraInmediata" },
      { title: "Objetivo de ahorro", description: "Aportación mensual necesaria", icon: "flag-checkered", route: "NuevasHerramientas", mode: "objetivo" },
    ],
  },
  {
    title: "Otras herramientas",
    tools: [
      { title: "Conversor de divisas", description: "Tipos de cambio de referencia", icon: "swap-horizontal", route: "Divisa" },
      { title: "Tabla de amortización", description: "Consulta el detalle de las cuotas", icon: "table-large", route: "NuevasHerramientas", mode: "tabla" },
    ],
  },
];

const allTools = categories.flatMap((category) => category.tools);
const toolId = (tool) => `${tool.route}|${tool.mode || ""}`;
const colors = {
  background: "#F4F7FB",
  navy: "#102A43",
  blue: "#246BFD",
  muted: "#6B7C93",
  border: "#E6ECF3",
};

function ToolCard({ tool, favorite, onOpen, onFavorite }) {
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir ${tool.title}`}
        onPress={onOpen}
        style={({ pressed }) => [styles.cardMain, pressed && styles.pressed]}
      >
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name={tool.icon} size={23} color={colors.blue} />
        </View>
        <Text style={styles.cardTitle}>{tool.title}</Text>
        <Text style={styles.cardDescription}>{tool.description}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={favorite ? `Quitar ${tool.title} de favoritos` : `Añadir ${tool.title} a favoritos`}
        hitSlop={8}
        onPress={onFavorite}
        style={styles.favoriteButton}
      >
        <MaterialCommunityIcons
          name={favorite ? "heart" : "heart-outline"}
          size={20}
          color={favorite ? "#E65B6B" : "#91A0B2"}
        />
      </Pressable>
    </View>
  );
}

export default function Home() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const [savedFavorites, savedRecent] = await Promise.all([
        getFavorites(),
        getRecentTools(),
      ]);
      setFavorites(savedFavorites);
      setRecent(savedRecent);
    } catch (error) {
      console.error("No se pudieron cargar favoritos y herramientas recientes:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  useEffect(() => {
    StatusBar.setBarStyle("dark-content");
  }, []);

  const openTool = async (tool) => {
    const id = toolId(tool);
    try {
      await addRecentTool(id);
    } catch (error) {
      console.error("No se pudo guardar la herramienta reciente:", error);
    }
    setRecent([id, ...recent.filter((route) => route !== id)].slice(0, 5));
    navigation.navigate("Herramientas", {
      screen: tool.route,
      params: tool.mode ? { mode: tool.mode } : undefined,
    });
  };

  const updateFavorite = async (route) => {
    try {
      setFavorites(await toggleFavorite(route));
    } catch (error) {
      console.error("No se pudo actualizar favoritos:", error);
    }
  };

  const getTool = (id) => allTools.find((tool) => toolId(tool) === id);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.eyebrow}>FINANZAS FÁCIL</Text>
            <Text style={styles.greeting}>Tus finanzas, más claras.</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir menú"
            onPress={() => {
              const parent = navigation.getParent();
              if (parent?.openDrawer) parent.openDrawer();
            }}
            style={styles.menuButton}
          >
            <MaterialCommunityIcons name="menu" size={23} color={colors.navy} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroText}>
            <Text style={styles.heroEyebrow}>DECIDE CON CONFIANZA</Text>
            <Text style={styles.heroTitle}>Pequeños cálculos.{`\n`}Grandes decisiones.</Text>
            <Text style={styles.heroDescription}>
              Simula, compara y planifica desde un solo lugar.
            </Text>
          </View>
          <MaterialCommunityIcons name="finance" size={44} color="#A9C6FF" />
          <Pressable
            onPress={() => openTool({ route: "NuevasHerramientas", mode: "comparador" })}
            style={({ pressed }) => [styles.heroButton, pressed && styles.pressed]}
          >
            <Text style={styles.heroButtonText}>Comparar hipotecas</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.quickLinks}>
          <Pressable
            style={({ pressed }) => [styles.quickLink, pressed && styles.pressed]}
            onPress={() => navigation.navigate("Herramientas", { screen: "SimulacionesGuardadas" })}
          >
            <MaterialCommunityIcons name="bookmark-multiple-outline" size={20} color={colors.blue} />
            <Text style={styles.quickLinkText}>Mis simulaciones guardadas</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.muted} />
          </Pressable>
        </View>

        {favorites.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tus favoritas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {favorites.map((route) => {
                const tool = getTool(route);
                return tool ? (
                  <Pressable
                    key={route}
                    onPress={() => openTool(tool)}
                    style={({ pressed }) => [styles.favoriteChip, pressed && styles.pressed]}
                  >
                    <MaterialCommunityIcons name={tool.icon} size={17} color={colors.blue} />
                    <Text style={styles.favoriteChipText}>{tool.title}</Text>
                  </Pressable>
                ) : null;
              })}
            </ScrollView>
          </View>
        )}

        {recent.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recientes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recent.map((route) => {
                const tool = getTool(route);
                return tool ? (
                  <Pressable
                    key={route}
                    onPress={() => openTool(tool)}
                    style={({ pressed }) => [styles.recentChip, pressed && styles.pressed]}
                  >
                    <MaterialCommunityIcons name="history" size={16} color={colors.muted} />
                    <Text style={styles.recentChipText}>{tool.title}</Text>
                  </Pressable>
                ) : null;
              })}
            </ScrollView>
          </View>
        )}

        {categories.map((category) => (
          <View key={category.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{category.title}</Text>
              <Text style={styles.toolCount}>{category.tools.length} herramientas</Text>
            </View>
            <View style={styles.grid}>
              {category.tools.map((tool) => (
                <ToolCard
                  key={`${tool.route}-${tool.title}`}
                  tool={tool}
                  favorite={favorites.includes(toolId(tool))}
                  onOpen={() => openTool(tool)}
                  onFavorite={() => updateFavorite(toolId(tool))}
                />
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.disclaimer}>
          Las simulaciones son orientativas y no constituyen asesoramiento financiero.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 36 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  eyebrow: { color: colors.blue, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  greeting: { marginTop: 5, color: colors.navy, fontSize: 22, fontWeight: "800" },
  menuButton: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.border },
  hero: { minHeight: 220, padding: 21, borderRadius: 25, backgroundColor: colors.navy, overflow: "hidden", marginBottom: 16 },
  heroText: { maxWidth: "86%" },
  heroEyebrow: { color: "#A9C6FF", fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  heroTitle: { marginTop: 8, color: "#FFFFFF", fontSize: 24, lineHeight: 30, fontWeight: "800" },
  heroDescription: { marginTop: 7, color: "#D6E2F0", fontSize: 13, lineHeight: 19 },
  heroButton: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 11, paddingHorizontal: 14, marginTop: 15, borderRadius: 12, backgroundColor: colors.blue },
  heroButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  quickLinks: { marginBottom: 7 },
  quickLink: { flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: "#FFFFFF", paddingHorizontal: 14, paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  quickLinkText: { flex: 1, color: colors.navy, fontSize: 14, fontWeight: "700" },
  section: { marginTop: 21 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 11 },
  sectionTitle: { color: colors.navy, fontSize: 18, fontWeight: "800", marginBottom: 11 },
  toolCount: { color: colors.muted, fontSize: 11, marginBottom: 11 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 11 },
  card: { width: "48.5%", minHeight: 145, backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  cardMain: { flex: 1, padding: 13, paddingBottom: 25 },
  iconBox: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#EEF4FF", alignItems: "center", justifyContent: "center", marginBottom: 10 },
  cardTitle: { color: colors.navy, fontSize: 13, lineHeight: 17, fontWeight: "800" },
  cardDescription: { color: colors.muted, fontSize: 11, lineHeight: 15, marginTop: 4 },
  favoriteButton: { position: "absolute", right: 10, top: 10, padding: 3 },
  favoriteChip: { flexDirection: "row", gap: 7, alignItems: "center", backgroundColor: "#FFFFFF", borderColor: colors.border, borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 9, marginRight: 8 },
  favoriteChipText: { color: colors.navy, fontWeight: "700", fontSize: 12 },
  recentChip: { flexDirection: "row", gap: 6, alignItems: "center", backgroundColor: "#EAF0F7", borderRadius: 18, paddingHorizontal: 11, paddingVertical: 8, marginRight: 8 },
  recentChipText: { color: colors.navy, fontWeight: "600", fontSize: 12 },
  disclaimer: { marginTop: 24, color: "#8492A6", fontSize: 11, lineHeight: 16, textAlign: "center" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },
});
