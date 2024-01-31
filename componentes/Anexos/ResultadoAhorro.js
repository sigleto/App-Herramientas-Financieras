import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ResultadoAhorro({ route }) {
  const navigation = useNavigation();
  const { meta, tasaInteres, periodo, tipoInteres, unidadPeriodo } = route.params;
  const [ahorroNecesario, setAhorroNecesario] = useState('');

  const calcularAhorroNecesario = () => {
    const metaFloat = parseFloat(meta);
    const tasaInteresFloat = parseFloat(tasaInteres) / 100; // Tasa de interés anual
    const periodoFloat = parseFloat(periodo) * (unidadPeriodo === 'años' ? 12 : 1); // Ajustar según la unidad de período

    const tasaInteresMensual = tipoInteres === 'anual' ? Math.pow(1 + tasaInteresFloat, 1 / 12) - 1 : tasaInteresFloat;

    const ahorroNecesarioCalculado =
      metaFloat /
      ((Math.pow(1 + tasaInteresMensual, periodoFloat) - 1) / tasaInteresMensual);

    setAhorroNecesario(ahorroNecesarioCalculado.toFixed(2).toString());
  };

  useEffect(() => {
    calcularAhorroNecesario();
  }, [navigation]);

  const volver = () => {
    navigation.navigate('Home');
  };

  return (
    <View>
      <Text style={styles.enunciado}>Datos introducidos</Text>
      <Text style={styles.labelText}>Meta de ahorro: <Text style={styles.resultText}>{meta}</Text></Text>
      <Text style={styles.labelText}>Tasa de Interés: <Text style={styles.resultText}>{tasaInteres} %</Text></Text>
      <Text style={styles.labelText}>Período: <Text style={styles.resultText}>{periodo} {unidadPeriodo}</Text></Text>
      <Text style={styles.enunciado}>Resultado</Text>
      <Text style={styles.labelText}>Ahorro necesario mensual: <Text style={styles.resultText}>{parseFloat(ahorroNecesario).toFixed(2)}</Text></Text>
      <TouchableOpacity
        onPress={volver}
        style={styles.touchableButtonV}
      >
        <Text style={styles.buttonText}>VOLVER</Text>
      </TouchableOpacity>
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
    marginTop: -21,
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
  touchableButtonV: {
    marginVertical: 10,
    backgroundColor: '#555ff7',
    paddingHorizontal:5,
    marginTop: 100,
    borderRadius: 10,
    alignSelf: 'center',
  },
});