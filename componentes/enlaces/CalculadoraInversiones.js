import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Anuncio from '../Anexos/Anuncio';

const CalculadoraInversiones = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [contributions, setContributions] = useState('');
  const [result, setResult] = useState(null);

  const calculateInvestment = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100; // Convertir la tasa a decimal
    const t = parseFloat(time);
    const c = parseFloat(contributions);

    if (!p || isNaN(p) || !r || isNaN(r) || !t || isNaN(t)) {
      setResult('Ingrese valores válidos');
      return;
    }

    let futureValue = 0;

    if (!c || isNaN(c)) {
      // Si no se proporcionan contribuciones o no son un número válido, calcular sin contribuciones.
      futureValue = p * Math.pow(1 + r, t);
    } else {
      futureValue = p * Math.pow(1 + r, t) + c * ((Math.pow(1 + r, t) - 1) / r);
    }

    setResult(futureValue.toFixed(2));
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Calculadora de Inversiones</Text>
      <Anuncio/>
      <TextInput
        style={styles.input}
        placeholder="Principal"
        keyboardType="numeric"
        value={principal}
        onChangeText={(text) => setPrincipal(text)}
        textAlign="center"  // Centra el texto
        fontSize={20}       // Ajusta el tamaño de la fuent
      />

      <TextInput
        style={styles.input}
        placeholder="Tasa de Interés (%)"
        keyboardType="numeric"
        value={rate}
        onChangeText={(text) => setRate(text)}
        textAlign="center"  // Centra el texto
        fontSize={20}       // Ajusta el tamaño de la fuent
      />

      <TextInput
        style={styles.input}
        placeholder="Tiempo (años)"
        keyboardType="numeric"
        value={time}
        onChangeText={(text) => setTime(text)}
        textAlign="center"  // Centra el texto
        fontSize={20}       // Ajusta el tamaño de la fuent
      />

      <TextInput
        style={styles.input}
        placeholder="Contribuciones Anuales"
        keyboardType="numeric"
        value={contributions}
        onChangeText={(text) => setContributions(text)}
        textAlign="center"  // Centra el texto
        fontSize={20}       // Ajusta el tamaño de la fuent
      />
      <TouchableOpacity style={styles.touchableButton} onPress={calculateInvestment}>
        <Text style={styles.buttonText}>Calcular</Text>
      </TouchableOpacity>
      

      <View>
        <Text style={styles.resultText}>
          Valor Futuro: {result !== null ? result : ''}
        </Text>
      </View>
    </View>
  );
};

export default CalculadoraInversiones;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fffbde',
  },
  input: {
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#888',
    padding: 6,
    width: '80%',
  },
  resultText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#36c23a',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom:40,
    color:'olive',
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
