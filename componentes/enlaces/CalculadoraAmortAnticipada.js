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

export default function CalculadoraAmortAnticipada() {
  const [capitalPendiente, setCapitalPendiente] = useState("");
  const [plazoRestante, setPlazoRestante] = useState("");
  const [interes, setInteres] = useState("");
  const [amortizacionAnticipada, setAmortizacionAnticipada] = useState("");
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
    backgroundColor: "#fffbde",
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
});
