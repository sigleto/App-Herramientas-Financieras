// CalculadoraAhorros.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';


export default function CalculadoraAhorros() {
  const [meta, setMeta] = useState('');
  const [tasaInteres, setTasaInteres] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [ahorroNecesario, setAhorroNecesario] = useState('');

  const [focusedInput, setFocusedInput] = useState(null);

  const calcularAhorroNecesario = () => {
    const metaFloat = parseFloat(meta);
    const tasaInteresFloat = parseFloat(tasaInteres) / 100 / 12; // Tasa de interés mensual
    const periodoFloat = parseFloat(periodo);

    const ahorroNecesarioCalculado =
      metaFloat /
      ((Math.pow(1 + tasaInteresFloat, periodoFloat) - 1) / tasaInteresFloat);

    setAhorroNecesario(ahorroNecesarioCalculado.toFixed(2).toString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Meta de ahorro</Text>
      <Input
        
        keyboardType="numeric"
        inputStyle={{ fontSize: 20,color:'olive' }}
        style={styles.input}
        
        onChangeText={(text) => setMeta(text)}
        autoFocus={true}
      />
      <Text style={styles.label}>Tasa de interés (%)</Text>
      <Input
        keyboardType="numeric"
        style={styles.input}
        inputStyle={{ fontSize: 20,color:'olive' }}
        value={tasaInteres}
        onChangeText={(text) => setTasaInteres(text)}
      />
      <Text style={styles.label}>Período (en meses)</Text>
      <Input
        keyboardType="numeric"
        style={styles.input}
        inputStyle={{ fontSize: 20,color:'olive' }}
        value={periodo}
        onChangeText={(text) => setPeriodo(text)}
      />
      <TouchableOpacity onPress={calcularAhorroNecesario} style={styles.touchableButton}
      >
        <Text style={styles.buttonText}>Calcular Ahorro Necesario</Text>
      </TouchableOpacity>
      {ahorroNecesario !== '' && (
        <Text style={styles.resultText}>
          Ahorro Necesario Mensual: {ahorroNecesario} {ahorroNecesario !== '' && 'EUR'}
        </Text>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor:'#fffbde'
  },
  input: {
    marginBottom: 18,
    textAlign:'center',
    fontWeight:'bold',
    
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
  resultText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  label:{
    fontWeight: "bold",
    fontSize: 20,
  }
});