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

export default function CalculadoraAmortAnticipada() {
  const [capitalPendiente, setCapitalPendiente] = useState("150000");
  const [plazoRestante, setPlazoRestante] = useState("240");
  const [interes, setInteres] = useState("3");
  const [amortizacionAnticipada, setAmortizacionAnticipada] = useState("10000");
  const navigation = useNavigation();

  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-6921150380725872/2360831572";

  const calcularAmortizacionAnticipada = () => {
    if (
      !capitalPendiente ||
      !plazoRestante ||
      !interes ||
      !amortizacionAnticipada
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const balance = parseFinancialNumber(capitalPendiente);
    const months = parseFinancialNumber(plazoRestante);
    const rate = parseFinancialNumber(interes);
    const extraPayment = parseFinancialNumber(amortizacionAnticipada);
    if (
      !Number.isFinite(balance) ||
      !Number.isInteger(months) ||
      !Number.isFinite(rate) ||
      !Number.isFinite(extraPayment) ||
      balance <= 0 ||
      months <= 0 ||
      months > 1200 ||
      rate < 0 ||
      rate > 100 ||
      extraPayment <= 0 ||
      extraPayment >= balance
    ) {
      alert("El capital y la amortización deben ser positivos; la amortización debe ser menor que el capital, el plazo entre 1 y 1200 meses y el interés entre 0 % y 100 %.");
      return;
    }

    navigation.navigate("ResultadoAmortAnticipada", {
      capitalPendiente,
      plazoRestante,
      interes,
      amortizacionAnticipada,
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
        <Text style={styles.title}>Amortización Anticipada</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Capital pendiente (€)</Text>
          <Input
            keyboardType="numeric"
            inputStyle={styles.inputStyle}
            onChangeText={(text) => setCapitalPendiente(text)}
            value={capitalPendiente}
            autoFocus={true}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Plazo restante (meses)</Text>
          <Input
            keyboardType="numeric"
            inputStyle={styles.inputStyle}
            onChangeText={(text) => setPlazoRestante(text)}
            value={plazoRestante}
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
          <Text style={styles.label}>Importe a amortizar (€)</Text>
          <Input
            keyboardType="numeric"
            inputStyle={styles.inputStyle}
            onChangeText={(text) => setAmortizacionAnticipada(text)}
            value={amortizacionAnticipada}
          />
        </View>

        <TouchableOpacity
          onPress={calcularAmortizacionAnticipada}
          style={styles.touchableButton}
        >
          <Text style={styles.buttonText}>Calcular Amortización</Text>
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
