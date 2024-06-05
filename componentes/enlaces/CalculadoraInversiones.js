import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Picker } from '@react-native-picker/picker';


const CalculadoraInversiones = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [contributions, setContributions] = useState('0');
  const [tipoInteres, setTipoInteres] = useState('anual');
  const [unidadPeriodo, setUnidadPeriodo] = useState('años');
  const navigation = useNavigation();

  const calcularCuota = () => {
    if (!principal || !rate || !time || !contributions) {
      alert('Por favor, completa todos los campos.');
    } else {
      const rateNumber = parseFloat(rate);
      navigation.navigate("ResultadoInversiones", {
        principal: principal,
        rate:rateNumber,
        time:time,
        contributions: contributions,
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
         <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
     
      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.container}>
        <Text style={styles.labelA}>Calculadora de Inversiones</Text>
        

        <View style={styles.inputContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Principal</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={principal}
              onChangeText={(text) => setPrincipal(text)}
              textAlign="center"
            />
          </View>

          <View style={styles.row}>
        <Text style={styles.label}>Interés (%)</Text>
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
            <Text style={styles.label}>Contribuciones Anuales</Text>
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
      </ScrollView>
      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: '#fffbde',
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
    borderColor: '#555ff7',
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
    backgroundColor: '#555ff7',
    paddingHorizontal: 27,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 22,
    color: '#f4f8f8',
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 15,
    color: 'olive',
  },
  labelA: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 15,
    color: 'black',
    marginTop:20,
    textAlign:'center'
  },
  pickerSelectedItem: {
    borderBottomWidth: 2, // Agrega un subrayado
  borderBottomColor: '#555ff7', // Color del subrayado
  },
  
  
});

export default CalculadoraInversiones;
