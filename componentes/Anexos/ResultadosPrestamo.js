import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Share } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import Anuncio from "./Anuncio";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ResultadosPrestamo({ route }) {
  const navigation = useNavigation();
  const { capital, tasaInteres, periodo } = route.params;
  const [cuota, setCuota] = useState("");
  const [totalIntereses, setTotalIntereses] = useState("");
  const [totalPagado, setTotalPagado] = useState("");
  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-6921150380725872/2360831572";

  const calculandoFunc = () => {
    const capitalFloat = parseFloat(capital);
    const tasaInteresFloat = parseFloat(tasaInteres) / 100 / 12;
    const periodoFloat = parseFloat(periodo);

    const cuotaCalculada =
      (capitalFloat * tasaInteresFloat) /
      (1 - Math.pow(1 + tasaInteresFloat, -periodoFloat));

    setCuota(cuotaCalculada.toFixed(2).toString());

    const totalInteresesPagados = cuotaCalculada * periodoFloat - capitalFloat;
    const totalPagado = cuotaCalculada * periodoFloat;

    setTotalIntereses(totalInteresesPagados.toFixed(2));
    setTotalPagado(totalPagado.toFixed(2));
  };

  const shareApp = async () => {
    try {
      const result = await Share.share({
        message:
          "Descarga la app Finanzas Fácil: Simulador y optimiza tus cálculos financieros. ¡Haz clic aquí para descargarla! https://play.google.com/store/apps/details?id=com.sigleto.Herramientas_financieras",
      });
      if (result.action === Share.dismissedAction) {
        console.log("Compartir cancelado");
      }
    } catch (error) {
      console.error("Error al compartir", error);
    }
  };

  const AccesoTabla = () => {
    const data = [];
    const capitalFloat = parseFloat(capital);
    const tasaInteresFloat = parseFloat(tasaInteres) / 100 / 12;
    const periodoFloat = parseFloat(periodo);

    let saldoPendiente = capitalFloat;
    let totalInteresesPagados = 0;
    let totalPagado = 0;

    for (let i = 1; i <= periodoFloat; i++) {
      const cuotaCalculada =
        (capitalFloat * tasaInteresFloat) /
        (1 - Math.pow(1 + tasaInteresFloat, -periodoFloat));

      const interes = saldoPendiente * tasaInteresFloat;
      const amortizacion = cuotaCalculada - interes;

      totalInteresesPagados += interes;
      totalPagado += cuotaCalculada;

      data.push({
        periodo: i,
        cuota: cuotaCalculada.toFixed(2),
        interes: interes.toFixed(2),
        amortizacion: amortizacion.toFixed(2),
        saldoPendiente: saldoPendiente.toFixed(2),
      });

      saldoPendiente -= amortizacion;
    }

    setTotalIntereses(totalInteresesPagados.toFixed(2));
    setTotalPagado(totalPagado.toFixed(2));

    navigation.navigate("Tabla", { data });
  };

  useEffect(() => {
    calculandoFunc();
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={AccesoTabla} style={{ marginRight: 15 }}>
          <Text style={styles.headerButtonText}>Acceso a Tabla</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const volver = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Anuncio />
      <View style={styles.headerContainer}>
        <Text style={styles.enunciado}>Datos introducidos</Text>
        <TouchableOpacity onPress={shareApp} style={styles.shareIconContainer}>
          <MaterialCommunityIcons name="share-variant" size={30} color="blue" />
        </TouchableOpacity>
      </View>
      <Text style={styles.labelText}>
        Capital: <Text style={styles.resultText}>{capital}</Text>
      </Text>
      <Text style={styles.labelText}>
        Tasa de Interés: <Text style={styles.resultText}>{tasaInteres}%</Text>
      </Text>
      <Text style={styles.labelText}>
        Período: <Text style={styles.resultText}>{periodo} meses</Text>
      </Text>
      <Text style={styles.enunciado}>Resultados</Text>
      <Text style={styles.labelText}>
        Cuota Mensual:{" "}
        <Text style={styles.resultTextr}>{parseFloat(cuota).toFixed(2)}</Text>
      </Text>
      <Text style={styles.labelText}>
        Total Pagado de intereses:{" "}
        <Text style={styles.resultText}>
          {parseFloat(totalIntereses).toFixed(2)}
        </Text>
      </Text>
      <Text style={styles.labelText}>
        Total Pagado al final:{" "}
        <Text style={styles.resultText}>
          {parseFloat(totalPagado).toFixed(2)}
        </Text>
      </Text>

      <TouchableOpacity onPress={AccesoTabla} style={styles.touchableButton}>
        <Text style={styles.buttonText}>Consultar Tabla</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={volver} style={styles.touchableButtonV}>
        <Text style={styles.buttonTextA}>VOLVER</Text>
      </TouchableOpacity>

      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fffbde",
    marginTop: 50,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  shareIconContainer: {
    padding: 5,
  },
  input: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  touchableButton: {
    marginVertical: 20,
    backgroundColor: "#555ff7",
    paddingHorizontal: 27,
    marginTop: 40,
    borderRadius: 10,
  },
  touchableButtonV: {
    marginVertical: 10,
    backgroundColor: "#555ff7",
    paddingHorizontal: 5,
    marginTop: 15,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 24,
    color: "#f4f8f8",
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonTextA: {
    fontSize: 18,
    color: "#f4f8f8",
    textAlign: "center",
    fontWeight: "bold",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
  },
  resultTextr: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
  enunciado: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#28a745",
    textAlign: "center",
    marginLeft: "25%",
  },
  labelText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  headerButtonText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
});
