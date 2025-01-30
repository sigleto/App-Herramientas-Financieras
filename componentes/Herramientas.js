import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const Herramientas = () => {
  const navigation = useNavigation();
  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-6921150380725872/2360831572";

  const navigateToHerramientas = (ruta) => {
    navigation.navigate(ruta);
  };

  const opciones = [
    {
      nombre: "CALCULADORA DE PRÉSTAMOS",
      ruta: "Prestamo",
      icon: "calculator",
    },
    {
      nombre: "CALCULADORA DE AHORROS",
      ruta: "Ahorros",
      icon: "piggy-bank",
    },
    {
      nombre: "CALCULADORA DE INVERSIONES",
      ruta: "CalculadoraInversiones",
      icon: "chart-line",
    },
    {
      nombre: "CONVERSOR DE DIVISAS",
      ruta: "Divisa",
      icon: "currency-usd",
    },
    {
      nombre: "COTIZACIÓN DE ACCIONES NY",
      ruta: "Acciones",
      icon: "finance",
    },
    {
      nombre: "RENDIMIENTO PARA LA JUBILACIÓN",
      ruta: "Jubilacion",
      icon: "cash-multiple",
    },
    {
      nombre: "CALCULADORA DE RENTA INMEDIATA",
      ruta: "CalculadoraInmediata",
      icon: "cash-multiple",
    },
    {
      nombre: "SIMULADORES HIPOTECARIOS",
      ruta: "SimuladoresHipotecarios",
      icon: "cash-multiple",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.tituloOrg}>Herramientas Financieras</Text>
        </View>

        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          style={styles.bannerAd}
        />

        <View style={styles.organismos}>
          {opciones.map((opcion) => (
            <TouchableOpacity
              key={opcion.ruta}
              style={styles.opcion}
              onPress={() => navigateToHerramientas(opcion.ruta)}
            >
              <MaterialCommunityIcons
                name={opcion.icon}
                size={24}
                color="#fff"
                style={styles.opcionIcon}
              />
              <Text style={styles.opcionTexto}>{opcion.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  tituloOrg: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  bannerAd: {
    marginBottom: 20,
    alignSelf: "center",
  },
  organismos: {
    paddingHorizontal: 20,
  },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  opcionIcon: {
    marginRight: 15,
  },
  opcionTexto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
    flexWrap: "wrap",
  },
});

export default Herramientas;
