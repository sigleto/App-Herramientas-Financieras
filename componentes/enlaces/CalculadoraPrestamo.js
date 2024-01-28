// CalculadoraPrestamos.js
import React, { useState } from "react";
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
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Capital</Text>
          <Text style={styles.label}>Tasa de Interés (%)</Text>
          <Text style={styles.label}>Período (meses)</Text>
        </View>
        <View style={styles.inputFieldContainer}>
          <Input
            keyboardType="numeric"
            value={capital}
            onChangeText={(text) => setCapital(text)}
            inputStyle={{ fontSize: 20, color: "olive" }}
            style={styles.input}
            placeholder="Cantidad a solicitar"
            autoFocus={true}
          />
          <Input
            keyboardType="numeric"
            value={tasaInteres}
            onChangeText={(text) => setTasaInteres(text)}
            inputStyle={{ fontSize: 20, color: "olive" }}
            style={styles.input}
            placeholder="Tipo de interés"
          />
          <Input
            keyboardType="numeric"
            value={periodo}
            onChangeText={(text) => setPeriodo(text)}
            inputStyle={{ fontSize: 20, color: "olive" }}
            style={styles.input}
            placeholder="Plazo del préstamo"
          />
        </View>
      </View>
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
    paddingHorizontal: 20,
    backgroundColor: "#fffbde",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  labelContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginRight: 20,
  },
  inputFieldContainer: {
    flex: 2,
    justifyContent: "space-between",
  },
  input: {
    marginBottom: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  touchableButton: {
    backgroundColor: "#555ff7",
    paddingHorizontal: 27,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 22,
    color: "#f4f8f8",
    textAlign:'center',
  },
  label: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
