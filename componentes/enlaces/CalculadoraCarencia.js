import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Input } from "../Entrada";
import { useNavigation } from "@react-navigation/native";
import {
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { BannerPublicidad as BannerAd } from "../Anexos/Publicidad";
import { parseFinancialNumber } from "../finanzas";

export default function CalculadoraCarencia() {
  const [capital, setCapital] = useState("200000");
  const [plazo, setPlazo] = useState("25");
  const [interes, setInteres] = useState("3");
  const [carencia, setCarencia] = useState("1");
  const navigation = useNavigation();

  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-6921150380725872/2360831572";

  const calcularCuotaConCarencia = () => {
    if (!capital || !plazo || !interes || !carencia) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const principal = parseFinancialNumber(capital);
    const years = parseFinancialNumber(plazo);
    const rate = parseFinancialNumber(interes);
    const graceYears = parseFinancialNumber(carencia);
    if (
      !Number.isFinite(principal) ||
      !Number.isInteger(years) ||
      !Number.isFinite(rate) ||
      !Number.isInteger(graceYears) ||
      principal <= 0 ||
      years <= 0 ||
      years > 100 ||
      rate < 0 ||
      rate > 100 ||
      graceYears <= 0 ||
      graceYears >= years
    ) {
      alert("El capital debe ser positivo, la carencia menor que el plazo, el plazo máximo 100 años y el interés entre 0 % y 100 %.");
      return;
    }

    navigation.navigate("ResultadoCarencia", {
      capital,
      plazo,
      interes,
      carencia,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>
          Cálculo de Cuota con Período de Carencia
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Capital del préstamo (€)</Text>
          <Input
            keyboardType="numeric"
            inputStyle={styles.inputStyle}
            onChangeText={(text) => setCapital(text)}
            value={capital}
            autoFocus={true}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Plazo total (años)</Text>
          <Input
            keyboardType="numeric"
            inputStyle={styles.inputStyle}
            onChangeText={(text) => setPlazo(text)}
            value={plazo}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo de interés anual (%)</Text>
          <Input
            keyboardType="numeric"
            inputStyle={styles.inputStyle}
            onChangeText={(text) => setInteres(text)}
            value={interes}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Período de carencia (años)</Text>
          <Input
            keyboardType="numeric"
            inputStyle={styles.inputStyle}
            onChangeText={(text) => setCarencia(text)}
            value={carencia}
          />
        </View>

        <TouchableOpacity
          onPress={calcularCuotaConCarencia}
          style={styles.touchableButton}
        >
          <Text style={styles.buttonText}>Calcular Cuota</Text>
        </TouchableOpacity>
      </ScrollView>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F4F7FB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  inputStyle: {
    fontSize: 18,
    color: "#102A43",
  },
  touchableButton: {
    backgroundColor: "#246BFD",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
