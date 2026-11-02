import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { BannerPublicidad as BannerAd } from "./Publicidad";
import Anuncio from "./Anuncio";
import {
  calculateMortgagePayment,
  parseFinancialNumber,
} from "../finanzas";

export default function ResultadoCarencia({ route }) {
  const navigation = useNavigation();
  const { capital, plazo, interes, carencia } = route.params;

  const [cuotaCarencia, setCuotaCarencia] = useState(0);
  const [cuotaNormal, setCuotaNormal] = useState(0);
  const [amortizacion, setAmortizacion] = useState([]);

  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-6921150380725872/2360831572";
  useEffect(() => {
    calcularResultados();
  }, []);

  const calcularResultados = () => {
    const capitalInicial = parseFinancialNumber(capital);
    const plazoTotalMeses = parseFinancialNumber(plazo) * 12;
    const periodoCarenciaMeses = parseFinancialNumber(carencia) * 12;
    const tasaAnual = parseFinancialNumber(interes);
    const tasaInteresMensual = tasaAnual / 100 / 12;

    // Cuota durante el período de carencia (solo intereses)
    const cuotaIntereses = capitalInicial * tasaInteresMensual;

    // Plazo restante después del período de carencia
    const plazoRestanteMeses = plazoTotalMeses - periodoCarenciaMeses;

    // Cuota normal después del período de carencia
    const cuotaNormal = calculateMortgagePayment(
      capitalInicial,
      tasaAnual,
      plazoRestanteMeses / 12
    );

    setCuotaCarencia(cuotaIntereses.toFixed(2));
    setCuotaNormal(cuotaNormal.toFixed(2));

    // Calcular la amortización completa
    let saldo = capitalInicial;
    const amortizacionArray = [];
    for (let i = 0; i < plazoTotalMeses; i++) {
      if (i < periodoCarenciaMeses) {
        // Período de carencia (solo intereses)
        const interesMensual = saldo * tasaInteresMensual;
        amortizacionArray.push({
          periodo: i + 1,
          cuota: cuotaIntereses.toFixed(2),
          interes: interesMensual.toFixed(2),
          amortizacion: "0.00",
          saldoPendiente: saldo.toFixed(2),
        });
      } else {
        // Período normal (amortización + intereses)
        const interesMensual = saldo * tasaInteresMensual;
        const capitalMensual = Math.min(saldo, cuotaNormal - interesMensual);
        saldo = Math.max(0, saldo - capitalMensual);
        amortizacionArray.push({
          periodo: i + 1,
          cuota: cuotaNormal.toFixed(2),
          interes: interesMensual.toFixed(2),
          amortizacion: capitalMensual.toFixed(2),
          saldoPendiente: saldo.toFixed(2),
        });
      }
    }
    setAmortizacion(amortizacionArray);
  };

  const volver = () => {
    navigation.goBack();
  };

  const verTablaAmortizacion = () => {
    navigation.navigate("Tabla", { data: amortizacion });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resultado del Cálculo</Text>
      <Anuncio />
      <Text style={styles.resultText}>
        Cuota durante el período de carencia (solo intereses): {cuotaCarencia} €
      </Text>
      <Text style={styles.resultText}>
        Cuota después del período de carencia (normal): {cuotaNormal} €
      </Text>

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
    backgroundColor: "#F4F7FB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#28a745",
    textAlign: "center",
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  touchableButton: {
    backgroundColor: "#246BFD",
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
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  buttonTextA: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },

  touchableButtonV: {
    marginVertical: 10,
    backgroundColor: "#246BFD",
    paddingHorizontal: 5,
    marginTop: 15,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
    marginBottom: 50,
  },
});
