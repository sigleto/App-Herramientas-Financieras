import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

export default function App() {
  const [edadActual, setEdadActual] = useState('');
  const [edadJubilacion, setEdadJubilacion] = useState('');
  const [montoActual, setMontoActual] = useState('');
  const [tasaInteres, setTasaInteres] = useState('');

  const navigation = useNavigation();
  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-6921150380725872/2360831572';
  const calcularJubilacion = () => {
    // Validar si algún campo está vacío
    if (!edadActual || !edadJubilacion || !montoActual || !tasaInteres) {
      Alert.alert("Aviso", "Por favor, completa todos los campos.");
      return;
    }

    // Realizar el cálculo y navegar a la pantalla de resultados
    navigation.navigate("ResultadoJubilacion", {
      edadActual: edadActual,
      edadJubilacion: edadJubilacion,
      montoActual: montoActual,
      tasaInteres: tasaInteres,
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
    fontWeight: "bold",
    color: "#36c23a",
  },
  label: {
    fontWeight: "bold",
    fontSize: 20,
   
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

