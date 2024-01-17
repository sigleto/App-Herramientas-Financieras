import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const [edadActual, setEdadActual] = useState('');
  const [edadJubilacion, setEdadJubilacion] = useState('');
  const [montoActual, setMontoActual] = useState('');
  const [tasaInteres, setTasaInteres] = useState('');
  const [resultado, setResultado] = useState(null);

  const calcularJubilacion = () => {
    const tiempoRestante = edadJubilacion - edadActual;
    const montoFinal = montoActual * Math.pow((1 + tasaInteres / 100), tiempoRestante);

    setResultado(`El monto estimado para la jubilación es: ${montoFinal.toFixed(2)}`);
  };

  const navigation=useNavigation()
const DiasJubilacion=()=>{navigation.navigate('DiasJubilacion')}

  return (
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

      <Text style={styles.label}>Monto actual</Text>
      <TextInput
        style={styles.input}
        placeholder="Monto actual"
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
      {resultado && <Text style={styles.resultText}>{resultado}</Text>}
<TouchableOpacity onPress={DiasJubilacion} style={styles.touchableButton}>
   <Text style={styles.buttonText}>Tiempo hasta la jubilación</Text>
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
    backgroundColor: '#fffbde',
  },
  input: {
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#888',
    padding: 8,
    width: '80%',
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
    marginTop: 10,
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

