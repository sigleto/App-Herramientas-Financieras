import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ResultadosRentaInmediata = ({ route }) => {
  const { capital, tasaInteres, periodo } = route.params;
  const [rentaMensual, setRentaMensual] = useState(null);

  const calcularRentaMensual = () => {
    const capitalFloat = parseFloat(capital || '0');
    const tasaInteresFloat = parseFloat(tasaInteres || '0') / 100;
    const periodoFloat = parseFloat(periodo || '0');

    // Fórmula de renta inmediata mensual
    const rentaMensualCalculada = (capitalFloat * tasaInteresFloat) / (1 - Math.pow(1 + tasaInteresFloat, -periodoFloat));

    return isNaN(rentaMensualCalculada) ? 0 : rentaMensualCalculada;
  };

  useEffect(() => {
    if (capital && tasaInteres && periodo) {
      const renta = calcularRentaMensual();
      setRentaMensual(renta);
    }
  }, [capital, tasaInteres, periodo]);

  const navigation = useNavigation();
  const volver = () => {
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.enunciado}>Datos Introducidos</Text>
      <Text style={styles.labelText}>Capital Inicial: <Text style={styles.resultText}>{capital}</Text></Text>
      <Text style={styles.labelText}>Tasa de Interés: <Text style={styles.resultText}>{tasaInteres}%</Text></Text>
      <Text style={styles.labelText}>Período: <Text style={styles.resultText}>{periodo} meses</Text></Text>

      <Text style={styles.enunciado}>Resultado</Text>
      <Text style={styles.labelText}>Renta Mensual: <Text style={styles.resultText}>{rentaMensual?.toFixed(2)}</Text></Text>

      <TouchableOpacity onPress={volver} style={styles.touchableButton}>
        <Text style={styles.buttonText}>VOLVER</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

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

  buttonText: {
    fontSize: 24,
    color: '#f4f8f8',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  resultText: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    textAlign: 'center',
  },

  enunciado: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 20,
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
    textAlign: 'center',
  },

  touchableButtonV: {
    marginVertical: 10,
    backgroundColor: 'olive',
    paddingHorizontal: 5,
    marginTop: 25,
    borderRadius: 10,
    alignSelf: 'center',
  },

  buttonTextV: {
    fontSize: 25,
    color: 'white',
  },
});

export default ResultadosRentaInmediata;