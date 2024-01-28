import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ResultadoInversiones({ route }) {
  const navigation = useNavigation();
  const { principal,rate,time,contributions } = route.params;
  const [result, setResult] = useState(null);
  

  const calculateInvestment = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100; // Convertir la tasa a decimal
    const t = parseFloat(time);
    const c = parseFloat(contributions);

    if (!p || isNaN(p) || !r || isNaN(r) || !t || isNaN(t)) {
      setResult('Ingrese valores válidos');
      return;
    }

    let futureValue = 0;

    if (!c || isNaN(c)) {
      // Si no se proporcionan contribuciones o no son un número válido, calcular sin contribuciones.
      futureValue = p * Math.pow(1 + r, t);
    } else {
      futureValue = p * Math.pow(1 + r, t) + c * ((Math.pow(1 + r, t) - 1) / r);
    }

    setResult(futureValue.toFixed(2));
  };

  
  useEffect(() => {
    calculateInvestment();
    
  }, [navigation]);

  

  
  return (
    <View>
      <Text style={styles.enunciado}>Datos introducidos</Text>
    <Text style={styles.labelText}>Capital: <Text style={styles.resultText}>{principal}</Text></Text>
    <Text style={styles.labelText}>Tasa de Interés: <Text style={styles.resultText}>{rate}%</Text></Text>
    <Text style={styles.labelText}>Período: <Text style={styles.resultText}>{time} años</Text></Text>
    <Text style={styles.labelText}>Contribuciones anuales: <Text style={styles.resultText}>{contributions} </Text></Text>
    <Text style={styles.enunciado}>Resultado</Text>
    <Text style={styles.labelText}>Valor futuro: <Text style={styles.resultTextr}>{parseFloat(result).toFixed(2)}</Text></Text>
    
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
});