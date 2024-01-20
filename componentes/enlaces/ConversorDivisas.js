import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity,StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';

const API_KEY = 'd93ad7934d4b03cf5de6577a'; // Reemplaza con tu clave de API de Free Currency API
const monedas = [
  { codigo: 'USD', nombre: 'Dólar estadounidense' },
  { codigo: 'EUR', nombre: 'Euro' },
  { codigo: 'AUD', nombre: 'Dólar australiano' },
  { codigo: 'ARS', nombre: 'Peso argentino' },
  { codigo: 'UYU', nombre: 'Peso uruguayo' },
  { codigo: 'CLP', nombre: 'Peso chileno' },
  { codigo: 'BGN', nombre: 'Lev búlgaro' },
  { codigo: 'BRL', nombre: 'Real brasileño' },
  { codigo: 'CAD', nombre: 'Dólar canadiense' },
  { codigo: 'CHF', nombre: 'Franco suizo' },
  { codigo: 'CNY', nombre: 'Yuan chino' },
  { codigo: 'CZK', nombre: 'Corona checa' },
  { codigo: 'DKK', nombre: 'Corona danesa' },
  { codigo: 'GBP', nombre: 'Libra esterlina' },
  { codigo: 'HKD', nombre: 'Dólar de Hong Kong' },
  { codigo: 'HRK', nombre: 'Kuna croata' },
  { codigo: 'HUF', nombre: 'Florín húngaro' },
  { codigo: 'IDR', nombre: 'Rupia indonesia' },
  { codigo: 'ILS', nombre: 'Nuevo séquel israelí' },
  { codigo: 'INR', nombre: 'Rupia india' },
  { codigo: 'ISK', nombre: 'Corona islandesa' },
  { codigo: 'JPY', nombre: 'Yen japonés' },
  { codigo: 'KRW', nombre: 'Won surcoreano' },
  { codigo: 'MXN', nombre: 'Peso mexicano' },
  { codigo: 'MYR', nombre: 'Ringgit malasio' },
  { codigo: 'NOK', nombre: 'Corona noruega' },
  { codigo: 'NZD', nombre: 'Dólar neozelandés' },
  { codigo: 'PHP', nombre: 'Peso filipino' },
  { codigo: 'PLN', nombre: 'Złoty polaco' },
  { codigo: 'RON', nombre: 'Leu rumano' },
  { codigo: 'RUB', nombre: 'Rublo ruso' },
  { codigo: 'SEK', nombre: 'Corona sueca' },
  { codigo: 'SGD', nombre: 'Dólar singapurense' },
  { codigo: 'THB', nombre: 'Baht tailandés' },
  { codigo: 'TRY', nombre: 'Lira turca' },
  { codigo: 'ZAR', nombre: 'Rand sudafricano' },
];
export default function ConversorDivisas() {
  const [cantidad, setCantidad] = useState('');
  const [monedaOrigen, setMonedaOrigen] = useState('USD');
  const [monedaDestino, setMonedaDestino] = useState('EUR')
  const [tipoCambio, setTipoCambio] = useState('');
  const [resultado, setResultado] = useState('');

 
  const obtenerTipoCambio = async () => {
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${monedaOrigen}`
      );
      const data = await response.json();
      console.log('Código de Estado:', response.status);
      console.log('Respuesta de la API:', data);
        
      if (response.ok) {
        console.log (data)
        const tasaCambio = data.conversion_rates[monedaDestino]
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
      {/* Cantidad a convertir */}
      <Text style={styles.label}>Cantidad a convertir</Text>
      <Input
        keyboardType="numeric"
        value={cantidad}
        onChangeText={(text) => setCantidad(text)}
        inputStyle={{ fontSize: 20, color: 'olive' }}
        style={styles.input}
        autoFocus={true}
      />

      {/* Moneda de origen */}
      <Text style={styles.label}>Moneda de origen</Text>
      <Picker
      style={{ height: 50, width: 200 }}
        selectedValue={monedaOrigen}
        onValueChange={(itemValue) => setMonedaOrigen(itemValue)}
      >
        {monedas.map((moneda) => (
          <Picker.Item key={moneda.codigo} label={moneda.nombre} value={moneda.codigo} />
        ))}
      </Picker>

      {/* Moneda de destino */}
      <Text style={styles.label}>Moneda de destino</Text>
      <Picker
        style={{ height: 50, width: 200 }}
        selectedValue={monedaDestino}
        onValueChange={(itemValue) => setMonedaDestino(itemValue)}
      >
        {monedas.map((moneda) => (
          <Picker.Item key={moneda.codigo} label={moneda.nombre} value={moneda.codigo} />
        ))}
      </Picker>

      {/* Obtener Tipo de Cambio */}
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
    textAlign:'center',
    fontSize:26
    
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