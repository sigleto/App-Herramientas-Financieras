import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import Anuncio from "./Anuncio";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ResultadoHipoteca({ route }) {
  const navigation = useNavigation();
  const { capital, plazo, interes } = route.params;
  const [cuotaMensual, setCuotaMensual] = useState(0);
  const [totalIntereses, setTotalIntereses] = useState(0);
  const [totalPagado, setTotalPagado] = useState(0);
  const [amortizacion, setAmortizacion] = useState([]);

  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-6921150380725872/2360831572";

  useEffect(() => {
    calcularCuota();
  }, []);

  const calcularCuota = () => {
    const capitalInicial = parseFloat(capital);
    const plazoMeses = parseInt(plazo) * 12;
    const tasaInteresMensual = parseFloat(interes) / 100 / 12;

    const cuota =
      (capitalInicial *
        tasaInteresMensual *
        Math.pow(1 + tasaInteresMensual, plazoMeses)) /
      (Math.pow(1 + tasaInteresMensual, plazoMeses) - 1);

    setCuotaMensual(cuota.toFixed(2));
    setTotalPagado((cuota * plazoMeses).toFixed(2));
    setTotalIntereses((cuota * plazoMeses - capitalInicial).toFixed(2));

    // Calcular la amortización completa
    let saldo = capitalInicial;
    const amortizacionArray = [];
    for (let i = 0; i < plazoMeses; i++) {
      const interesMensual = saldo * tasaInteresMensual;
      const capitalMensual = cuota - interesMensual;
      saldo -= capitalMensual;
      amortizacionArray.push({
        periodo: i + 1,
        cuota: cuota.toFixed(2),
        interes: interesMensual.toFixed(2),
        amortizacion: capitalMensual.toFixed(2),
        saldoPendiente: saldo.toFixed(2),
      });
    }
    setAmortizacion(amortizacionArray);
  };

  const volver = () => {
    navigation.goBack();
  };

  const verTablaAmortizacion = () => {
    navigation.navigate("Tabla", { data: amortizacion });
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message:
          "Descarga la app Simulador Hipotecario y optimiza tus cálculos financieros. ¡Haz clic aquí para descargarla! [URL de tu app]",
      });
    } catch (error) {
      console.error("Error al compartir", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Anuncio />
      <TouchableOpacity onPress={shareApp} style={styles.shareIcon}>
        <MaterialCommunityIcons
          name="share-variant"
          size={24}
          color="#007BFF"
        />
      </TouchableOpacity>

      <Text style={styles.title}>Resultado del Cálculo</Text>

      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Cuota mensual: {cuotaMensual}€</Text>
        <Text style={styles.resultText}>
          Total intereses: {totalIntereses}€
        </Text>
        <Text style={styles.resultText}>Total a pagar: {totalPagado}€</Text>
      </View>

      <TouchableOpacity
        onPress={verTablaAmortizacion}
        style={styles.touchableButton}
      >
        <Text style={styles.buttonText}>Ver Tabla de Amortización</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={volver} style={styles.touchableButtonV}>
        <Text style={styles.buttonTextA}>VOLVER</Text>
      </TouchableOpacity>

      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#fffbde",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#28a745",
  },
  resultContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  touchableButton: {
    backgroundColor: "#555ff7",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 50,
  },
  buttonText: {
    fontSize: 18,
    color: "#f4f8f8",
    fontWeight: "bold",
  },
  buttonTextA: {
    fontSize: 18,
    color: "#f4f8f8",
    textAlign: "center",
    fontWeight: "bold",
  },
  shareIcon: {
    position: "absolute",
    right: 20,
    top: 10,
  },
  touchableButtonV: {
    marginVertical: 10,
    backgroundColor: "#555ff7",
    paddingHorizontal: 5,
    marginTop: 15,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
    marginBottom: 50,
  },
});
