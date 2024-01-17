import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity,StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';

const API_KEY = 'fca_live_4oa9jAhENdCzrJc1zKOdx5IbSuX6n7EGCS7vfw9z'; // Reemplaza con tu clave de API de Free Currency API

export default function ConversorDivisas() {
  const [cantidad, setCantidad] = useState('');
  const [monedaOrigen, setMonedaOrigen] = useState('USD');
  const [monedaDestino, setMonedaDestino] = useState('EUR')
  const [tipoCambio, setTipoCambio] = useState('');
  const [resultado, setResultado] = useState('');

 
  const obtenerTipoCambio = async () => {
    try {
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&base_currency=${monedaOrigen}`
      );
      const data = await response.json();
      console.log('Código de Estado:', response.status);
      console.log('Respuesta de la API:', data);
        
      if (response.ok) {
        console.log (data)
        const tasaCambio = data.data[monedaDestino]
        console.log (tasaCambio)
        setTipoCambio(tasaCambio.toFixed(4).toString());
      } else {
        console.error('Error al obtener el tipo de cambio');
      }
    } catch (error) {
      console.error('Error en la solicitud de tipo de cambio:', error);
    }
  };
  
  const convertirDivisas = () => {
    const cantidadFloat = parseFloat(cantidad);
    const resultadoCalculado = cantidadFloat * parseFloat(tipoCambio);
    setResultado(resultadoCalculado.toFixed(2).toString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cantidad a convertir</Text>
      <Input
       
        keyboardType="numeric"
        value={cantidad}
        onChangeText={(text) => setCantidad(text)}
        inputStyle={{ fontSize: 20,color:'olive' }}
        style={styles.input}
        autoFocus={true}
      />
      <Text style={styles.label}>Moneda de origen</Text>
      <Input
        inputStyle={{ fontSize: 20,color:'olive' }}
        style={styles.input}
        value={monedaOrigen}
        onChangeText={(text) => setMonedaOrigen(text.toUpperCase())}
      />
      <Text style={styles.label}>Moneda de destino</Text>
      <Input
        inputStyle={{ fontSize: 20,color:'olive' }}
        style={styles.input}
        value={monedaDestino}
        onChangeText={(text) => setMonedaDestino(text.toUpperCase())}
      />
         <TouchableOpacity onPress={obtenerTipoCambio} style={styles.touchableButton}>
        <Text style={styles.buttonText}>Obtener Tipo de Cambio</Text>
      </TouchableOpacity>

      {tipoCambio !== '' && (
        <Text style={styles.resultText}>
          Tipo de Cambio: 1 {monedaOrigen} = {tipoCambio} {monedaDestino}
        </Text>
      )}

      {/* Convertir */}
      <TouchableOpacity onPress={convertirDivisas} style={styles.touchableButton}>
        <Text style={styles.buttonText}>Convertir</Text>
      </TouchableOpacity>
      {resultado !== '' && (
        <Text style={styles.resultText}>
          Resultado: {resultado} {monedaDestino}
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor:'#fffbde'
  },
  input: {
    marginBottom: 18,
    
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
  resultText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  label:{
    fontWeight: "bold",
    fontSize: 20,
  }
});