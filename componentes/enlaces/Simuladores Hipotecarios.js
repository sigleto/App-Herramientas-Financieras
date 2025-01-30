import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

export default function SimuladoresHipotecarios() {
  const navigation = useNavigation();

  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-6921150380725872/2360831572";

  const navigateToSimulator = (simulatorType) => {
    switch (simulatorType) {
      case "cuotaEstandar":
        navigation.navigate("CalculadoraHipotecaria");
        break;
      case "cuotaCarencia":
        navigation.navigate("CalculadoraCarencia");
        break;
      case "cuotaAmortizacion":
        navigation.navigate("CalculadoraAmortAnticipada");
        break;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Simuladores Hipotecarios</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToSimulator("cuotaEstandar")}
      >
        <Text style={styles.buttonText}>Cuota a pagar de un préstamo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToSimulator("cuotaCarencia")}
      >
        <Text style={styles.buttonText}>
          Cuota a pagar de un préstamo con periodo de carencia
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToSimulator("cuotaAmortizacion")}
      >
        <Text style={styles.buttonText}>
          Cuota o plazo de un préstamo si hay amortización anticipada
        </Text>
      </TouchableOpacity>

      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
