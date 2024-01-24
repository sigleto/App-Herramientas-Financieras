// CalculadoraPrestamos.js
import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Anuncio from "../Anexos/Anuncio";


export default function CalculadoraPrestamos() {
  const [capital, setCapital] = useState("");
  const [tasaInteres, setTasaInteres] = useState("");
  const [periodo, setPeriodo] = useState("");
  

  const navigation = useNavigation();



  const calcularCuota = () => {
   
    navigation.navigate("ResultadosPrestamo", {
      capital: capital,
      tasaInteres: tasaInteres,
      periodo: periodo,
      
    });
  };

  return (
    <View style={styles.container}>
      <Anuncio />
      <Text style={styles.label}>Capital</Text>
      <Input
        keyboardType="numeric"
        value={capital}
        onChangeText={(text) => setCapital(text)}
        inputStyle={{ fontSize: 20, color: "olive" }}
        style={styles.input}
        placeholder="Introduce la cantidad a solicitar"
        autoFocus={true}
      />
      <Text style={styles.label}>Tasa de Interés (%)</Text>
      <Input
        keyboardType="numeric"
        value={tasaInteres}
        onChangeText={(text) => setTasaInteres(text)}
        inputStyle={{ fontSize: 20, color: "olive" }}
        style={styles.input}
        placeholder="Tipo de interés a aplicar"
      />
      <Text style={styles.label}>Período (meses)</Text>
      <Input
        keyboardType="numeric"
        value={periodo}
        onChangeText={(text) => setPeriodo(text)}
        inputStyle={{ fontSize: 20, color: "olive" }}
        style={styles.input}
        placeholder="Meses de duración del préstamo"
      />
      <TouchableOpacity onPress={calcularCuota} style={styles.touchableButton}>
        <Text style={styles.buttonText}>Calcular Cuota</Text>
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