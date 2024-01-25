// CalculadoraAhorros.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Anuncio from '../Anexos/Anuncio';


export default function CalculadoraAhorros() {
  const [meta, setMeta] = useState('');
  const [tasaInteres, setTasaInteres] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [ahorroNecesario, setAhorroNecesario] = useState('');

    const navigation = useNavigation();

  const calcularCuota = () => {   
    navigation.navigate("ResultadoAhorro", {
      meta:meta,
      tasaInteres:tasaInteres,
      periodo:periodo,
            
    });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Meta de ahorro</Text>
      <Anuncio/>
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
      <TouchableOpacity onPress={calcularCuota} style={styles.touchableButton}
      >
        <Text style={styles.buttonText}>Calcular Ahorro Necesario</Text>
      </TouchableOpacity>
      
      
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