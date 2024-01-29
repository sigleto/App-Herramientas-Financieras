import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Anuncio from '../Anexos/Anuncio';

const CalculadoraInversiones = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [contributions, setContributions] = useState('');
  const navigation = useNavigation();

  const calcularCuota = () => {
    if (!principal || !rate || !time || !contributions) {
      // Si algún campo está vacío, muestra un aviso y no navega a la pantalla de resultados
      alert('Por favor, completa todos los campos.');
    } else {
      navigation.navigate("ResultadoInversiones", {
        principal: principal,
        rate: rate,
        time: time,
        contributions: contributions
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Calculadora de Inversiones</Text>
      <Anuncio />

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
          <Text style={styles.labelA}>Tasa de Interés (%)</Text>
          <TextInput
            style={styles.input}
            
            keyboardType="numeric"
            value={rate}
            onChangeText={(text) => setRate(text)}
            textAlign="center"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tiempo (años)</Text>
          <TextInput
            style={styles.input}
            
            keyboardType="numeric"
            value={time}
            onChangeText={(text) => setTime(text)}
            textAlign="center"
          />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fffbde',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 15,
    color: 'olive',
  },
  labelA: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 15,
    color: '#b0950f',
  },
  inputContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: '#555ff7',
    borderRadius: 10,
    padding: 12,
    fontSize: 20,
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
});

export default CalculadoraInversiones;
