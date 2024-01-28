import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import Anuncio from '../Anexos/Anuncio';

const CalculadoraInversiones = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [contributions, setContributions] = useState('');
  const [result, setResult] = useState(null);

  const navigation = useNavigation();

  const calcularCuota = () => {   
    navigation.navigate("ResultadoInversiones", {
      principal:principal,
      rate:rate,
      time:time,
      contributions:contributions
      
    });
  };
  
  

  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Calculadora de Inversiones</Text>
      <Anuncio/>
      <TextInput
        style={styles.input}
        placeholder="Principal"
        keyboardType="numeric"
        value={principal}
        onChangeText={(text) => setPrincipal(text)}
        textAlign="center"  // Centra el texto
        fontSize={20}       // Ajusta el tamaño de la fuent
      />

      <TextInput
        style={styles.input}
        placeholder="Tasa de Interés (%)"
        keyboardType="numeric"
        value={rate}
        onChangeText={(text) => setRate(text)}
        textAlign="center"  // Centra el texto
        fontSize={20}       // Ajusta el tamaño de la fuent
      />

      <TextInput
        style={styles.input}
        placeholder="Tiempo (años)"
        keyboardType="numeric"
        value={time}
        onChangeText={(text) => setTime(text)}
        textAlign="center"  // Centra el texto
        fontSize={20}       // Ajusta el tamaño de la fuent
      />

      <TextInput
        style={styles.input}
        placeholder="Contribuciones Anuales"
        keyboardType="numeric"
        value={contributions}
        onChangeText={(text) => setContributions(text)}
        textAlign="center"  // Centra el texto
        fontSize={20}       // Ajusta el tamaño de la fuent
      />
      <TouchableOpacity style={styles.touchableButton} onPress={calcularCuota}>
        <Text style={styles.buttonText}>Calcular</Text>
      </TouchableOpacity>
            
    </View>
  );
};

export default CalculadoraInversiones;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fffbde',
  },
  input: {
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#888',
    padding: 6,
    width: '80%',
    borderWidth: 2,  // Agregar un borde
    borderColor: "#555ff7",  // Color del borde
    borderRadius: 10,  // Bordes redondeados
    padding: 10,  // Espaciado interno
  },
  resultText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#36c23a',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom:40,
    color:'olive',
  },
  touchableButton: {
    marginVertical: 10,
    backgroundColor:'#555ff7',
    paddingHorizontal:27,
    marginTop:20,  
  },
  buttonText:{
    fontSize:22,
    color:'#f4f8f8'
  },
});
