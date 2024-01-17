import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function CalculadoraPrestamos() {
  const [capital, setCapital] = useState("");
  const [tasaInteres, setTasaInteres] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [cuota, setCuota] = useState("");
  const [totalIntereses, setTotalIntereses] = useState("");
  const [totalPagado, setTotalPagado] = useState("");

  const navigation = useNavigation();

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

  const calcularCuota = () => {
    const capitalFloat = parseFloat(capital);
    const tasaInteresFloat = parseFloat(tasaInteres) / 100 / 12;
    const periodoFloat = parseFloat(periodo);
  
    const cuotaCalculada =
      (capitalFloat * tasaInteresFloat) /
      (1 - Math.pow(1 + tasaInteresFloat, -periodoFloat));
  
    setCuota(cuotaCalculada.toFixed(2).toString());
  
    // Corregir el cálculo del total pagado
    const totalInteresesPagados = cuotaCalculada * periodoFloat - capitalFloat;
    const totalPagado = (cuotaCalculada * periodoFloat - capitalFloat)+ parseFloat(capital);
  
    setTotalIntereses(totalInteresesPagados.toFixed(2));
    setTotalPagado(totalPagado.toFixed(2));
  };
  return (
    <View style={styles.container}>
    <Text style={styles.label}>Capital</Text>
    <Input
      keyboardType="numeric"
      value={capital}
      onChangeText={(text) => setCapital(text)}
      inputStyle={{ fontSize: 20,color:'olive'}}
      style={styles.input}
      placeholder="Introduce la cantidad a solicitar"
      autoFocus={true}
      
    />
    <Text style={styles.label}>Tasa de Interés (%)</Text>
    <Input
      keyboardType="numeric"
      value={tasaInteres}
      onChangeText={(text) => setTasaInteres(text)}
      inputStyle={{ fontSize: 20,color:'olive' }}
      style={styles.input}
      placeholder="Tipo de interés a aplicar"
    />
    <Text style={styles.label}>Período (meses)</Text>
    <Input
      keyboardType="numeric"
      value={periodo}
      onChangeText={(text) => setPeriodo(text)}
      inputStyle={{ fontSize: 20,color:'olive' }}
      style={styles.input}
      placeholder="Meses de duración del préstamo"
    />
      <TouchableOpacity onPress={calcularCuota} style={styles.touchableButton}>
        <Text style={styles.buttonText}>Calcular Cuota</Text>
      </TouchableOpacity>
      {cuota !== "" && (
        <View>
          <Text style={styles.resultText}>Cuota Mensual: {cuota}</Text>
          <Text style={styles.resultText}>Total Pagado de intereses: {totalIntereses}</Text>
          <Text style={styles.resultText}>Total Pagado al final: {totalPagado}</Text>
        </View>
      )}
      <TouchableOpacity onPress={AccesoTabla} style={styles.touchableButton}>
        <Text style={styles.buttonText}>Consultar Tabla</Text>
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