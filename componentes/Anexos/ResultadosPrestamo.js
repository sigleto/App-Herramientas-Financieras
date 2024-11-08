import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Anuncio from './Anuncio'

export default function ResultadosPrestamo({ route }) {
  const navigation = useNavigation();
  const { capital, tasaInteres, periodo } = route.params;
  const [cuota, setCuota] = useState("");
  const [totalIntereses, setTotalIntereses] = useState("");
  const [totalPagado, setTotalPagado] = useState("");
  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-6921150380725872/2360831572';
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

  useEffect(() => {
    calculandoFunc();
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={AccesoTabla}>
          <Text style={styles.buttonText}>Acceso a Tabla</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={AccesoTabla}>
          <Text style={styles.buttonText}>Acceso a Tabla</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, AccesoTabla]);

  const volver=()=>{navigation.navigate('Home')}

  return (
    <View>
      <Anuncio/>
      <Text style={styles.enunciado}>Datos introducidos</Text>
    <Text style={styles.labelText}>Capital: <Text style={styles.resultText}>{capital}</Text></Text>
    <Text style={styles.labelText}>Tasa de Interés: <Text style={styles.resultText}>{tasaInteres}%</Text></Text>
    <Text style={styles.labelText}>Período: <Text style={styles.resultText}>{periodo} meses</Text></Text>
    <Text style={styles.enunciado}>Resultados</Text>
    <Text style={styles.labelText}>Cuota Mensual: <Text style={styles.resultTextr}>{parseFloat(cuota).toFixed(2)}</Text></Text>
    <Text style={styles.labelText}>Total Pagado de intereses: <Text style={styles.resultText}>{parseFloat(totalIntereses).toFixed(2)}</Text></Text>
    <Text style={styles.labelText}>Total Pagado al final: <Text style={styles.resultText}>{parseFloat(totalPagado).toFixed(2)}</Text></Text>

      <TouchableOpacity
  onPress={AccesoTabla}
  style={styles.touchableButton}
>
  <Text style={styles.buttonText}>Consultar Tabla</Text>
</TouchableOpacity>

 <TouchableOpacity
  onPress={volver}
  style={styles.touchableButtonV}
>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fffbde',
  },

  input: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },

  touchableButton: {
    marginVertical: 20,
    backgroundColor: '#555ff7',
    paddingHorizontal: 27,
    marginTop: 40,
    borderRadius: 10,
  },
  touchableButtonV: {
    marginVertical: 10,
    backgroundColor: '#555ff7',
    paddingHorizontal:5,
    marginTop: 15,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom:60,
  },

  buttonText: {
    fontSize: 24,
    color: '#f4f8f8',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonTextA: {
    fontSize: 18,
    color: '#f4f8f8',
    textAlign: 'center',
    fontWeight: 'bold',
    
  },

  resultText: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    fontWeight: 'bold',
    textAlign:'center'
  },
  resultTextr: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    fontWeight: 'bold',
    textAlign:'center'
  },

  enunciado: {
    marginTop: 40,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom:40,
  },

  label: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#28a745',
  },
  labelText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign:'center'
   
  },
});