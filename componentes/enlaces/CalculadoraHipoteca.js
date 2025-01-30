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
import { Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

export default function CalculadoraHipotecaria() {
  const [capital, setCapital] = useState("");
  const [plazo, setPlazo] = useState("");
  const [interes, setInteres] = useState("");
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
    if (isNaN(capital) || isNaN(plazo) || isNaN(interes)) {
      setError("Por favor, ingrese valores numéricos válidos.");
      return false;
    }
    if (capital <= 0 || plazo <= 0 || interes <= 0) {
      setError("Por favor, ingrese valores positivos.");
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
            placeholder="Ej: 200000"
            autoFocus={true}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Plazo (años)</Text>
          <Input
            keyboardType="numeric"
            inputStyle={styles.inputStyle}
            onChangeText={(text) => setPlazo(text)}
            value={plazo}
            placeholder="Ej: 30"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo de interés anual (%)</Text>
          <Input
            keyboardType="numeric"
            inputStyle={styles.inputStyle}
            onChangeText={(text) => setInteres(text)}
            value={interes}
            placeholder="Ej: 2.5"
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
    backgroundColor: "#fffbde",
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
    color: "olive",
  },
  touchableButton: {
    backgroundColor: "#555ff7",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    color: "#f4f8f8",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});
