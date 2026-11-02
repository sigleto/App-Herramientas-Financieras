import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { BannerPublicidad as BannerAd } from '../Anexos/Publicidad';
import { parseFinancialNumber } from "../finanzas";

export default function App() {
  const [edadActual, setEdadActual] = useState('35');
  const [edadJubilacion, setEdadJubilacion] = useState('67');
  const [montoActual, setMontoActual] = useState('10000');
  const [tasaInteres, setTasaInteres] = useState('4');

  const navigation = useNavigation();
  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-6921150380725872/2360831572';
  const calcularJubilacion = () => {
    // Validar si algún campo está vacío
    if (!edadActual || !edadJubilacion || !montoActual || !tasaInteres) {
      Alert.alert("Aviso", "Por favor, completa todos los campos.");
      return;
    }

    const currentAge = parseFinancialNumber(edadActual);
    const retirementAge = parseFinancialNumber(edadJubilacion);
    const savings = parseFinancialNumber(montoActual);
    const rate = parseFinancialNumber(tasaInteres);
    if (
      !Number.isInteger(currentAge) ||
      !Number.isInteger(retirementAge) ||
      !Number.isFinite(savings) ||
      !Number.isFinite(rate) ||
      currentAge < 16 ||
      retirementAge <= currentAge ||
      retirementAge > 100 ||
      savings < 0 ||
      rate < 0 ||
      rate > 100
    ) {
      Alert.alert("Datos no válidos", "Introduce edades enteras (16-100), una edad de jubilación posterior, ahorros no negativos e interés entre 0 % y 100 %.");
      return;
    }

    // Realizar el cálculo y navegar a la pantalla de resultados
    navigation.navigate("ResultadoJubilacion", {
      edadActual: currentAge,
      edadJubilacion: retirementAge,
      montoActual: savings,
      tasaInteres: rate,
    });
  };
 
  const navigateToHerramientas = (ruta) => {
    navigation.navigate(ruta);
  };
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
       
      <View style={styles.container}>
      <Text style={styles.labelA}>Simulador para la jubilación</Text>
        <Text style={styles.label}>Edad actual</Text>
        <TextInput
          style={styles.input}
          placeholder="Edad actual"
          keyboardType="numeric"
          value={edadActual}
          onChangeText={(text) => setEdadActual(text)}
          textAlign="center"  // Centra el texto
          fontSize={20}       // Ajusta el tamaño de la fuente
        />

        <Text style={styles.label}>Edad de jubilación</Text>
        <TextInput
          style={styles.input}
          placeholder="Edad de jubilación"
          keyboardType="numeric"
          value={edadJubilacion}
          onChangeText={(text) => setEdadJubilacion(text)}
          textAlign="center"  // Centra el texto
          fontSize={20}       // Ajusta el tamaño de la fuente
        />

        <Text style={styles.label}>Ahorros actuales</Text>
        <TextInput
          style={styles.input}
          placeholder="Monto actual del depósito"
          keyboardType="numeric"
          value={montoActual}
          onChangeText={(text) => setMontoActual(text)}
          textAlign="center"  // Centra el texto
          fontSize={20}       // Ajusta el tamaño de la fuente
        />

        <Text style={styles.label}>Tasa de interés anual (%)</Text>
        <TextInput
          style={styles.input}
          placeholder="Tasa de interés anual (%)"
          keyboardType="numeric"
          value={tasaInteres}
          onChangeText={(text) => setTasaInteres(text)}
          textAlign="center"  // Centra el texto
          fontSize={20}       // Ajusta el tamaño de la fuente
        />

        <TouchableOpacity style={styles.touchableButton} onPress={calcularJubilacion}>
          <Text style={styles.buttonText}>Calcular</Text>
        </TouchableOpacity>
      </View>
      <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: '#F4F7FB',
    
    
  },
  input: {
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#888',
    padding: 6,
    width: '80%',
    borderWidth: 2,  // Agregar un borde
    borderColor: "#246BFD",  // Color del borde
    borderRadius: 10,  // Bordes redondeados
    padding: 10,  // Espaciado interno
  },
  resultText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#36c23a",
  },
  label: {
    fontWeight: "bold",
    fontSize: 20,
   
  },
  
  touchableButton: {
    marginVertical: 10,
    backgroundColor:'#246BFD',
    paddingHorizontal:27,
    marginTop:20,  
  },
  buttonText:{
    fontSize:22,
    color:'#FFFFFF'
  },
  labelA: {
    marginTop:120,
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 35,
    color: '#246BFD',
    textAlign:'center'
  },
});
