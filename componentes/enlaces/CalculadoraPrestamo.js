import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity,ScrollView } from "react-native";
import { Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

export default function CalculadoraPrestamos() {
  const [capital, setCapital] = useState("");
  const [tasaInteres, setTasaInteres] = useState("");
  const [periodo, setPeriodo] = useState("");
  
  const navigation = useNavigation();

  const calcularCuota = () => {
    if (!capital || !tasaInteres || !periodo) {
      // Si algún campo está vacío, muestra un aviso y no navega a la pantalla de resultados
      alert('Por favor, completa todos los campos.');
    } else {
      navigation.navigate("ResultadosPrestamo", {
        capital: capital,
        tasaInteres: tasaInteres,
        periodo: periodo,
      });
    }
  };
 
  const navigateToHerramientas = (ruta) => {
    navigation.navigate(ruta);
  };

  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-6921150380725872/2360831572';
  return (
    <ScrollView style={{ backgroundColor: '#fffbde' }}>
    <View style={styles.container}>
   
      <Text style={styles.labelA}>Calculadora de Préstamos</Text>
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Capital</Text>
          <Text style={styles.label}>Tasa de Interés (%)</Text>
          <View style={styles.cerca}>
          <Text style={styles.label}>Período (meses)</Text>
          </View>
      </View>
        <View style={styles.inputFieldContainer}>
          <Input
            keyboardType="numeric"
            value={capital}
            onChangeText={(text) => setCapital(text)}
            inputStyle={{ fontSize: 20, color: "olive" }}
            style={styles.input}
            autoFocus={true}
          />
          <Input
            keyboardType="numeric"
            value={tasaInteres}
            onChangeText={(text) => setTasaInteres(text)}
            inputStyle={{ fontSize: 20, color: "olive" }}
            style={styles.input}
            
          />
          <Input
            keyboardType="numeric"
            value={periodo}
            onChangeText={(text) => setPeriodo(text)}
            inputStyle={{ fontSize: 20, color: "olive" }}
            style={styles.input}
            
          />
        </View>
      </View>
      <TouchableOpacity onPress={calcularCuota} style={styles.touchableButton}>
        <Text style={styles.buttonText}>Calcular Cuota</Text>
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
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: '#fffbde',
    
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginRight: 20, // Retain the right margin
  },
  inputFieldContainer: {
    flex: 2, // Expand input field container to fill the available space
    justifyContent: 'space-between',
  },
  input: {
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    borderWidth: 2, // Add a border
    borderColor: '#555ff7', // Border color
    borderRadius: 10, // Rounded corners
    padding: 12, // Internal spacing
  },
  touchableButton: {
    backgroundColor: '#555ff7',
    paddingHorizontal: 130, // Aumenta el valor para hacer el botón más ancho
    marginTop: 30,
    borderRadius: 10,
    width: '95%', // Añade un ancho específico para reducir la estrechez
    alignSelf: 'center', // Alinea el botón en el centro
    marginBottom:60,
},

  buttonText: {
    
    fontSize: 25,
    color: '#f4f8f8',
    textAlign: 'center',
    
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  labelA: {
    marginTop:120,
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 35,
    color: '#b0950f',
    textAlign:'center'
  },
  cerca:{
    marginBottom:40,
  }
  
});
