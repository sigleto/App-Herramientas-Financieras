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
  calculateEarlyRepayment,
  parseFinancialNumber,
} from "../finanzas";

export default function ResultadoAmortAnticipada({ route }) {
  const navigation = useNavigation();
  const { capitalPendiente, plazoRestante, interes, amortizacionAnticipada } =
    route.params;
  const [resultadoReduccionCuota, setResultadoReduccionCuota] = useState(null);
  const [resultadoReduccionPlazo, setResultadoReduccionPlazo] = useState(null);
  const [amortizacionReduccionCuota, setAmortizacionReduccionCuota] = useState(
    []
  );
  const [amortizacionReduccionPlazo, setAmortizacionReduccionPlazo] = useState(
    []
  );

  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-6921150380725872/2360831572";

  useEffect(() => {
    calcularResultados();
  }, []);

  const calcularResultados = () => {
    const calculation = calculateEarlyRepayment({
      principal: parseFinancialNumber(capitalPendiente),
      annualRatePercent: parseFinancialNumber(interes),
      months: parseFinancialNumber(plazoRestante),
      extraPayment: parseFinancialNumber(amortizacionAnticipada),
    });
    setResultadoReduccionCuota({
      nuevaCuota: calculation.reducedPayment.monthlyPayment.toFixed(2),
      reduccionCuota: calculation.reducedPayment.monthlySavings.toFixed(2),
      ahorroTotal: calculation.reducedPayment.interestSaved.toFixed(2),
    });
    setAmortizacionReduccionCuota(calculation.reducedPayment.rows);
    setResultadoReduccionPlazo({
      nuevoPlazoCuotas: calculation.reducedTerm.months,
      reduccionPlazo: calculation.reducedTerm.monthsSaved,
      ultimaCuota: calculation.reducedTerm.lastPayment.toFixed(2),
      ahorroTotal: calculation.reducedTerm.interestSaved.toFixed(2),
    });
    setAmortizacionReduccionPlazo(calculation.reducedTerm.rows);
  };

  const volver = () => {
    navigation.goBack();
  };

  const verTablaReduccionCuota = () => {
    navigation.navigate("TablaAmortCuota", {
      data: amortizacionReduccionCuota,
    });
  };

  const verTablaReduccionPlazo = () => {
    navigation.navigate("TablaAmortPlazo", {
      data: amortizacionReduccionPlazo,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resultado de la Amortización Anticipada</Text>
      <Anuncio />

      <View style={styles.resultSection}>
        <Text style={styles.subtitle}>Reducción de Cuota:</Text>
        <Text style={styles.resultText}>
          Nueva cuota mensual: {resultadoReduccionCuota?.nuevaCuota} €
        </Text>
        <Text style={styles.resultText}>
          Reducción de cuota: {resultadoReduccionCuota?.reduccionCuota} €
        </Text>
        <Text style={styles.resultText}>
          Ahorro total: {resultadoReduccionCuota?.ahorroTotal} €
        </Text>
        <TouchableOpacity
          onPress={verTablaReduccionCuota}
          style={styles.touchableButton}
        >
          <Text style={styles.buttonText}>Ver Tabla de Amortización</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultSection}>
        <Text style={styles.subtitle}>Reducción de Plazo:</Text>
        <Text style={styles.resultText}>
          Nuevo plazo: {resultadoReduccionPlazo?.nuevoPlazoCuotas} meses
        </Text>
        <Text style={styles.resultText}>
          Reducción del plazo: {resultadoReduccionPlazo?.reduccionPlazo} meses
        </Text>
        <Text style={styles.resultText}>
          Última cuota: {resultadoReduccionPlazo?.ultimaCuota} €
        </Text>
        <Text style={styles.resultText}>
          Ahorro total: {resultadoReduccionPlazo?.ahorroTotal} €
        </Text>
        <TouchableOpacity
          onPress={verTablaReduccionPlazo}
          style={styles.touchableButton}
        >
          <Text style={styles.buttonText}>Ver Tabla de Amortización</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={volver}
        style={styles.touchableButtonTablasAmortizacionV}
      >
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
    backgroundColor: "#F4F7FB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#28a745",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  resultSection: {
    marginBottom: 20,
    width: "100%",
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  touchableButton: {
    backgroundColor: "#246BFD",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
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
