import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ResultadoJubilación({ route }) {
  const navigation = useNavigation();
  const { edadActual,edadJubilacion,montoActual, tasaInteres } = route.params;
  const [resultado, setResultado] = useState(null);

  

 

    const calcularJubilacion = () => {
       
        const tiempoRestante = edadJubilacion - edadActual;
        const montoFinal = montoActual * Math.pow((1 + tasaInteres / 100), tiempoRestante);
    
        setResultado({montoFinal});
        
      };
      
     

  useEffect(() => {
    calcularJubilacion();
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={DiasJubilacion}>
          <Text style={styles.buttonText}>Cuanto falta para jubilarte</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const DiasJubilacion=()=>{navigation.navigate('DiasJubilacion')}

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={DiasJubilacion}>
          <Text style={styles.buttonText}>Cuanto falta para jubilarte</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, DiasJubilacion]);

  
  return (
    <View>
      <Text style={styles.enunciado}>Datos introducidos</Text>

    <Text style={styles.labelText}>Edad actual: <Text style={styles.resultText}>{edadActual} años</Text></Text>
    <Text style={styles.labelText}>Edad de jubilación: <Text style={styles.resultText}>{edadJubilacion} años</Text></Text>
    <Text style={styles.labelText}>Ahorros actuales: <Text style={styles.resultText}>{montoActual} </Text></Text>
    <Text style={styles.labelText}>Tasa de interés anual: <Text style={styles.resultText}>{tasaInteres} %</Text></Text>
    
      <Text style={styles.enunciado}>Resultados</Text>
    
      <Text style={styles.labelText}>
  El monto estimado para la jubilación es:{" "}
  <Text style={styles.resultTextr}>
    {resultado && resultado.montoFinal
      ? parseFloat(resultado.montoFinal).toFixed(2)
      : "No disponible"}
  </Text>
</Text>


      <TouchableOpacity
  onPress={DiasJubilacion}
  style={styles.touchableButton}
>
  <Text style={styles.buttonText}>Cuanto falta para jubilarte</Text>
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