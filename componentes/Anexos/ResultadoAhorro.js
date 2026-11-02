import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";
import {
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { BannerPublicidad as BannerAd } from "./Publicidad";
import Anuncio from "./Anuncio";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  calculateMonthlySavingsAtRate,
  parseFinancialNumber,
} from "../finanzas";

export default function ResultadoAhorro({ route }) {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { meta, tasaInteres, periodo, tipoInteres, unidadPeriodo } =
    route.params;
  const [ahorroNecesario, setAhorroNecesario] = useState("");
  const [chartBalances, setChartBalances] = useState([]);
  const [calculationError, setCalculationError] = useState("");
  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-6921150380725872/2360831572";
  const calcularAhorroNecesario = () => {
    try {
      const metaFloat = parseFinancialNumber(meta);
      const interest = parseFinancialNumber(tasaInteres);
      const years = parseFinancialNumber(periodo);
      const monthlyRate =
        tipoInteres === "anual"
          ? Math.pow(1 + interest / 100, 1 / 12) - 1
          : interest / 100;
      const contribution = calculateMonthlySavingsAtRate(
        metaFloat,
        monthlyRate,
        Math.round(years * 12)
      );
      let balance = 0;
      const balances = [];
      const periods = Math.round(years * 12);
      for (let month = 1; month <= periods; month += 1) {
        balance = balance * (1 + monthlyRate) + contribution;
        if (month % 12 === 0 || month === periods) balances.push(balance);
      }
      setAhorroNecesario(contribution.toFixed(2));
      setChartBalances(balances);
      setCalculationError("");
    } catch (error) {
      setAhorroNecesario("");
      setCalculationError(error.message);
    }
  };

  useEffect(() => {
    calcularAhorroNecesario();
  }, [meta, navigation, periodo, tasaInteres, tipoInteres]);

  const volver = () => {
    navigation.navigate("Home");
  };

  // Datos para el gráfico
  const intervaloEtiquetas = 5; // Mostrar una etiqueta para cada cinco períodos

  const labels = Array.from({ length: chartBalances.length }, (_, i) => {
    if ((i + 1) % intervaloEtiquetas === 0 || i === chartBalances.length - 1) {
      return (i + 1).toString();
    } else {
      return "";
    }
  });

  const data = {
    labels: labels,
    datasets: [
      {
        data: chartBalances,
      },
    ],
  };
  const shareApp = async () => {
    try {
      await Share.share({
        message:
          "Descarga la app Finanzas Fácil: Simulador y optimiza tus cálculos financieros. ¡Haz clic aquí para descargarla! https://play.google.com/store/apps/details?id=com.sigleto.Herramientas_financieras",
      });
    } catch (error) {
      console.error("Error al compartir", error);
    }
  };

  return (
    <View style={styles.container}>
      <Anuncio />

      <Text style={styles.enunciado}>Datos introducidos</Text>
      <TouchableOpacity onPress={shareApp} style={styles.shareIcon}>
        <MaterialCommunityIcons
          name="share-variant"
          size={24}
          color="#007BFF"
        />
      </TouchableOpacity>

      <Text style={styles.labelText}>
        Meta de ahorro: <Text style={styles.resultText}>{meta}</Text>
      </Text>
      <Text style={styles.labelText}>
        Tasa de Interés: <Text style={styles.resultText}>{tasaInteres} %</Text>
      </Text>
      <Text style={styles.labelText}>
        Período:{" "}
        <Text style={styles.resultText}>
          {periodo} {unidadPeriodo}
        </Text>
      </Text>
      <Text style={styles.enunciado}>Resultado</Text>
      {calculationError ? (
        <Text style={styles.errorText}>{calculationError}</Text>
      ) : null}
      <Text style={styles.labelText}>
        Ahorro necesario mensual:{" "}
        <Text style={styles.resultText}>
          {parseFloat(ahorroNecesario).toFixed(2)}
        </Text>
      </Text>
      {ahorroNecesario ? (
        <View>
          <LineChart
            data={data}
            width={width - 40}
            height={220}
            yAxisLabel="Ahorro acumulado"
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <Text style={styles.labelXAxis}>Años</Text>
        </View>
      ) : (
        <Text>No hay datos disponibles para mostrar el gráfico.</Text>
      )}
      <TouchableOpacity onPress={volver} style={styles.touchableButtonV}>
        <Text style={styles.buttonText}>VOLVER</Text>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F4F7FB",
  },
  resultText: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  enunciado: {
    marginTop: 40,
    fontSize: 25,
    fontWeight: "bold",
    color: "#28a745",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 40,
  },
  labelText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  labelXAxis: {
    alignSelf: "center",
    marginTop: 10,
  },
  errorText: {
    color: "#B93845",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 10,
  },
  touchableButtonV: {
    marginVertical: 10,
    backgroundColor: "#246BFD",
    paddingHorizontal: 20,

    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 40,
    position: "relative", // Añade esta línea
  },
  shareIcon: {
    position: "absolute", // Añade esta línea
    right: 20, // Ajusta según necesites
    top: 80, // Alinea con la parte superior
  },
});
