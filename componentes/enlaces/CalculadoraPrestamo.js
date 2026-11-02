import React, { useState } from "react";
import { Alert, View, Text, StyleSheet, TouchableOpacity,ScrollView } from "react-native";
import { Input } from "../Entrada";
import { useNavigation } from "@react-navigation/native";
import { BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { BannerPublicidad as BannerAd } from '../Anexos/Publicidad';
import { parseFinancialNumber } from "../finanzas";

export default function CalculadoraPrestamos() {
  const [capital, setCapital] = useState("10000");
  const [tasaInteres, setTasaInteres] = useState("6");
  const [periodo, setPeriodo] = useState("60");
  
  const navigation = useNavigation();

  const calcularCuota = () => {
    if (!capital || !tasaInteres || !periodo) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const principal = parseFinancialNumber(capital);
    const rate = parseFinancialNumber(tasaInteres);
    const months = parseFinancialNumber(periodo);
    if (
      !Number.isFinite(principal) ||
      !Number.isFinite(rate) ||
      !Number.isInteger(months) ||
      principal <= 0 ||
      rate < 0 ||
      rate > 100 ||
      months <= 0 ||
      months > 1200
    ) {
      Alert.alert("Datos no válidos", "El capital debe ser positivo, el plazo entre 1 y 1200 meses y el interés entre 0 % y 100 %.");
      return;
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
    <ScrollView style={{ backgroundColor: '#F4F7FB' }}>
    <View style={styles.container}>
   
      <Text style={styles.labelA}>Calculadora de Préstamos</Text>
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Capital (€)</Text>
          <Text style={styles.label}>Interés anual (%)</Text>
          <View style={styles.cerca}>
          <Text style={styles.label}>Período (meses)</Text>
          </View>
      </View>
        <View style={styles.inputFieldContainer}>
          <Input
            keyboardType="numeric"
            value={capital}
            onChangeText={(text) => setCapital(text)}
            inputStyle={{ fontSize: 20, color: "#102A43" }}
            style={styles.input}
            autoFocus={true}
          />
          <Input
            keyboardType="numeric"
            value={tasaInteres}
            onChangeText={(text) => setTasaInteres(text)}
            inputStyle={{ fontSize: 20, color: "#102A43" }}
            style={styles.input}
            
          />
          <Input
            keyboardType="numeric"
            value={periodo}
            onChangeText={(text) => setPeriodo(text)}
            inputStyle={{ fontSize: 20, color: "#102A43" }}
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
    backgroundColor: '#F4F7FB',
    
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
    borderColor: '#246BFD', // Border color
    borderRadius: 10, // Rounded corners
    padding: 12, // Internal spacing
  },
  touchableButton: {
    backgroundColor: '#246BFD',
    paddingHorizontal: 130, // Aumenta el valor para hacer el botón más ancho
    marginTop: 30,
    borderRadius: 10,
    width: '95%', // Añade un ancho específico para reducir la estrechez
    alignSelf: 'center', // Alinea el botón en el centro
    marginBottom:60,
},

  buttonText: {
    
    fontSize: 25,
    color: '#FFFFFF',
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
    color: '#246BFD',
    textAlign:'center'
  },
  cerca:{
    marginBottom:40,
  }
  
});
