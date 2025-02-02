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
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import Anuncio from "./Anuncio";

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
    const capital = parseFloat(capitalPendiente);
    const plazo = parseInt(plazoRestante);
    const tasaInteres = parseFloat(interes) / 100 / 12;
    const amortizacion = parseFloat(amortizacionAnticipada);

    // Cálculo para reducción de cuota
    const nuevoCapital = capital - amortizacion;
    const nuevaCuota =
      (nuevoCapital * tasaInteres * Math.pow(1 + tasaInteres, plazo)) /
      (Math.pow(1 + tasaInteres, plazo) - 1);
    const cuotaOriginal =
      (capital * tasaInteres * Math.pow(1 + tasaInteres, plazo)) /
      (Math.pow(1 + tasaInteres, plazo) - 1);

    setResultadoReduccionCuota({
      nuevaCuota: nuevaCuota.toFixed(2),
      reduccionCuota: (cuotaOriginal - nuevaCuota).toFixed(2),
      ahorroTotal: (
        cuotaOriginal * plazo -
        capital -
        (nuevaCuota * plazo - nuevoCapital)
      ).toFixed(2),
    });

    // Calcular la amortización para reducción de cuota
    let saldoReduccionCuota = nuevoCapital;
    const amortizacionArrayReduccionCuota = [];
    for (let i = 0; i < plazo; i++) {
      const interesMensual = saldoReduccionCuota * tasaInteres;
      const capitalMensual = nuevaCuota - interesMensual;
      saldoReduccionCuota -= capitalMensual;
      amortizacionArrayReduccionCuota.push({
        periodo: i + 1,
        cuota: nuevaCuota.toFixed(2),
        interes: interesMensual.toFixed(2),
        amortizacion: capitalMensual.toFixed(2),
        saldoPendiente: saldoReduccionCuota.toFixed(2),
      });
    }
    setAmortizacionReduccionCuota(amortizacionArrayReduccionCuota);

    // Cálculo para reducción de plazo
    let nuevoPlazoParcial =
      Math.log(cuotaOriginal / (cuotaOriginal - nuevoCapital * tasaInteres)) /
      Math.log(1 + tasaInteres);
    let nuevoPlazoCuotas = Math.floor(nuevoPlazoParcial);
    let ultimaCuota =
      nuevoCapital * Math.pow(1 + tasaInteres, nuevoPlazoParcial) -
      (cuotaOriginal * (Math.pow(1 + tasaInteres, nuevoPlazoParcial) - 1)) /
        tasaInteres;

    setResultadoReduccionPlazo({
      nuevoPlazoCuotas,
      reduccionPlazo: plazo - nuevoPlazoCuotas,
      ultimaCuota: ultimaCuota.toFixed(2),
      ahorroTotal: (
        cuotaOriginal * plazo -
        capital -
        (cuotaOriginal * nuevoPlazoCuotas - nuevoCapital)
      ).toFixed(2),
    });

    // Calcular la amortización para reducción de plazo
    let saldoReduccionPlazo = capital;
    const amortizacionArrayReduccionPlazo = [];
    for (let i = 0; i < nuevoPlazoCuotas; i++) {
      const interesMensual = saldoReduccionPlazo * tasaInteres;
      const capitalMensual = cuotaOriginal - interesMensual;
      saldoReduccionPlazo -= capitalMensual;
      amortizacionArrayReduccionPlazo.push({
        periodo: i + 1,
        cuota: cuotaOriginal.toFixed(2),
        interes: interesMensual.toFixed(2),
        amortizacion: capitalMensual.toFixed(2),
        saldoPendiente: saldoReduccionPlazo.toFixed(2),
      });
    }
    setAmortizacionReduccionPlazo(amortizacionArrayReduccionPlazo);
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
    backgroundColor: "#fffbde",
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
    backgroundColor: "#555ff7",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
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
