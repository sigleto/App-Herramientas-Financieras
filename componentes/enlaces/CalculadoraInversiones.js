import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { BannerPublicidad as BannerAd } from '../Anexos/Publicidad';
import { Picker } from '@react-native-picker/picker';
import { Alert } from 'react-native';
import { parseFinancialNumber } from "../finanzas";


const CalculadoraInversiones = () => {
  const [principal, setPrincipal] = useState('5000');
  const [rate, setRate] = useState('5');
  const [time, setTime] = useState('10');
  const [contributions, setContributions] = useState('1200');
  const [tipoInteres, setTipoInteres] = useState('anual');
  const [unidadPeriodo, setUnidadPeriodo] = useState('años');
  const navigation = useNavigation();

  const calcularCuota = () => {
    if (!principal || !rate || !time || !contributions) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const principalNumber = parseFinancialNumber(principal);
    const rateNumber = parseFinancialNumber(rate);
    const timeNumber = parseFinancialNumber(time);
    const contributionNumber = parseFinancialNumber(contributions);
    const maxTime = unidadPeriodo === "años" ? 100 : 1200;
    if (
      !Number.isFinite(principalNumber) ||
      !Number.isFinite(rateNumber) ||
      !Number.isInteger(timeNumber) ||
      !Number.isFinite(contributionNumber) ||
      principalNumber < 0 ||
      contributionNumber < 0 ||
      (principalNumber === 0 && contributionNumber === 0) ||
      rateNumber < 0 ||
      rateNumber > 100 ||
      timeNumber <= 0 ||
      timeNumber > maxTime
    ) {
      Alert.alert("Datos no válidos", "El capital y las aportaciones no pueden ser negativos, el plazo debe ser entero y estar entre 1 y " + maxTime + (unidadPeriodo === "años" ? " años." : " meses."));
      return;
    } else {
      navigation.navigate("ResultadoInversiones", {
        principal: principalNumber,
        rate: rateNumber,
        time: timeNumber,
        contributions: contributionNumber,
        tipoInteres: tipoInteres,
        unidadPeriodo: unidadPeriodo,
      });
    }
  };
  
  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-6921150380725872/2360831572';
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
        
     
      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.container}>
      
        <Text style={styles.labelA}>Calculadora de Inversiones</Text>
        

        <View style={styles.inputContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Capital inicial (€)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={principal}
              onChangeText={(text) => setPrincipal(text)}
              textAlign="center"
            />
          </View>

          <View style={styles.row}>
        <Text style={styles.label}>Interés anual (%)</Text>
         <View style={styles.pickerContainer}>
           <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={rate}
          onChangeText={(text) => setRate(text)}
          textAlign="center"
    />
    <Picker
      selectedValue={tipoInteres}
      style={[styles.picker, (tipoInteres === 'anual') && styles.pickerSelectedItem]}
      onValueChange={(itemValue) => setTipoInteres(itemValue)}
      mode='dropdown'
    >
      <Picker.Item label="Anual" value="anual" />
      <Picker.Item label="Mensual" value="mensual" />
    </Picker>
  </View>
</View>

          <View style={styles.row}>
            <Text style={styles.label}>Duración</Text>
            <View style={styles.pickerContainer}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={time}
                onChangeText={(text) => setTime(text)}
                textAlign="center"
              />

              <Picker
                selectedValue={unidadPeriodo}
                style={styles.picker}
                onValueChange={(itemValue) => setUnidadPeriodo(itemValue)}
                mode='dropdown'
              >
                <Picker.Item label="Años" value="años" />
                <Picker.Item label="Meses" value="meses" />
              </Picker>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Aportación anual (€)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={contributions}
              onChangeText={(text) => setContributions(text)}
              textAlign="center"
              
            />
          </View>
        </View>

        <TouchableOpacity style={styles.touchableButton} onPress={calcularCuota}>
          <Text style={styles.buttonText}>Calcular</Text>
        </TouchableOpacity>
        <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
      </ScrollView>
      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: '#F4F7FB',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginTop: 30,
  },
  input: {
    flex: 1,
    marginLeft: 6,
    borderWidth: 2,
    borderColor: '#246BFD',
    borderRadius: 10,
    padding: 8,
    fontSize: 18,
    width:'45%',
  },
  picker: {
    height: 50,
    width: '45%',
    color: '#02009c',
    fontWeight: '200',
    borderRadius: 10,
    paddingVertical: 5, // Espaciado vertical para mejorar la apariencia
  },
  touchableButton: {
    marginVertical: 10,
    backgroundColor: '#246BFD',
    paddingHorizontal: 110,
    marginTop: 5,
    width:'95%',
    borderRadius:10,
  },
  buttonText: {
    fontSize: 25,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 15,
    color: '#102A43',
  },
  labelA: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 35,
    color: '#246BFD',
    textAlign:'center',
    marginTop:-200,
  },
  pickerSelectedItem: {
    borderBottomWidth: 2, // Agrega un subrayado
  borderBottomColor: '#246BFD', // Color del subrayado
  },
  
  
});

export default CalculadoraInversiones;
