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

export default function CalculadoraHipotecaria() {
  const [capital, setCapital] = useState("200000");
  const [plazo, setPlazo] = useState("25");
  const [interes, setInteres] = useState("3");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-6921150380725872/2360831572";
  const validarEntradas = () => {
    if (!capital || !plazo || !interes) {
      setError("Por favor, complete todos los campos.");
      return false;
    }
    const capitalNumber = parseFinancialNumber(capital);
    const plazoNumber = parseFinancialNumber(plazo);
    const interesNumber = parseFinancialNumber(interes);
    if (
      !Number.isFinite(capitalNumber) ||
      !Number.isFinite(plazoNumber) ||
      !Number.isFinite(interesNumber)
    ) {
      setError("Por favor, ingrese valores numéricos válidos.");
      return false;
    }
    if (
      capitalNumber <= 0 ||
      plazoNumber <= 0 ||
      plazoNumber > 100 ||
      interesNumber < 0 ||
      interesNumber > 100
    ) {
      setError("El capital y plazo deben ser positivos; el plazo máximo es 100 años y el interés debe estar entre 0 % y 100 %.");
      return false;
    }
    setError("");
    return true;
  };

  const calcularCuota = () => {
    if (!validarEntradas()) return;

    navigation.navigate("ResultadoHipoteca", {
      capital,
      plazo,
      interes,
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
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Capital del préstamo (€)</Text>
          <Input
            keyboardType="numeric"
            inputStyle={styles.inputStyle}
            onChangeText={(text) => setCapital(text)}
            value={capital}
            placeholder="Ej: 200.000"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Plazo (años)</Text>
          <Input
            keyboardType="numeric"
            inputStyle={styles.inputStyle}
            onChangeText={(text) => setPlazo(text)}
            value={plazo}
            placeholder="Ej: 25"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo de interés anual (%)</Text>
          <Input
            keyboardType="numeric"
            inputStyle={styles.inputStyle}
            onChangeText={(text) => setInteres(text)}
            value={interes}
            placeholder="Ej: 2,5"
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={calcularCuota}
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
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});
