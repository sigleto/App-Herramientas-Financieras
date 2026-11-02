import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Input } from "../Entrada";
import { useNavigation } from '@react-navigation/native';
import { BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { BannerPublicidad as BannerAd } from '../Anexos/Publicidad';
import { parseFinancialNumber } from "../finanzas";

const CalculadoraRentaInmediata = () => {
  const [capital, setCapital] = useState('50000');
  const [tasaInteres, setTasaInteres] = useState('3');
  const [periodo, setPeriodo] = useState('240');
  const navigation = useNavigation();

  const calcularRentaInmediata = () => {
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
      alert("El capital debe ser positivo, el plazo entre 1 y 1200 meses y el interés anual entre 0 % y 100 %.");
      return;
    } else {
      navigation.navigate('ResultadoInmediatas', {
        capital,
        tasaInteres,
        periodo,
      });
    }
  };

  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-6921150380725872/2360831572';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Calculadora de Renta Inmediata</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Capital Inicial</Text>
            <Input
              keyboardType="numeric"
              value={capital}
              onChangeText={setCapital}
              containerStyle={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo de interés anual (%)</Text>
            <Input
              keyboardType="numeric"
              value={tasaInteres}
              onChangeText={setTasaInteres}
              containerStyle={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Período de Pago (meses)</Text>
            <Input
              keyboardType="numeric"
              value={periodo}
              onChangeText={setPeriodo}
              containerStyle={styles.input}
            />
          </View>

          <TouchableOpacity onPress={calcularRentaInmediata} style={styles.touchableButton}>
            <Text style={styles.buttonText}>Calcular Renta</Text>
          </TouchableOpacity>

          <View style={styles.bannerContainer}>
            <BannerAd
              unitId={adUnitId}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F4F7FB',
    paddingBottom: 100, // Espacio adicional para que el banner no tape el botón
  },
  inputContainer: {
    marginBottom: 10,
    marginTop: 30,
  },
  input: {
    textAlign: 'center',
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: '#246BFD',
    borderRadius: 10,
    padding: 10,
  },
  touchableButton: {
    marginVertical: 10,
    backgroundColor: '#246BFD',
    paddingHorizontal: 110,
    marginTop: 5,
    width: '95%',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 23,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  bannerContainer: {
    marginTop: 20, // Espacio entre el botón y el banner
  },
});

export default CalculadoraRentaInmediata;
