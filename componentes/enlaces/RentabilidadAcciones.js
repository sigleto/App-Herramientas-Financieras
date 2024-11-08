import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Anuncio from '../Anexos/Anuncio';
import { useNavigation } from '@react-navigation/native';


const MARKETSTACK_API_ACCESS_KEY = process.env.MARKETSTACK_API_ACCESS_KEY;

export default function RentabilidadAcciones() {
  const [symbol, setSymbol] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cotizacionActual, setCotizacionActual] = useState(null);
  const [error, setError] = useState(null);

  const calcularRentabilidad = async () => {
    try {
      const response = await axios.get(
        `http://api.marketstack.com/v1/tickers/${symbol}/eod/latest?access_key=${MARKETSTACK_API_ACCESS_KEY}&exchange=XNYS`
      );

      if (response.data) {
        const stockData = response.data;
        const precioActual = stockData.close;
        setCotizacionActual(precioActual);
        const cantidadAccion = parseInt(cantidad);
        const inversionTotal = cantidadAccion * parseFloat(precioCompra);
        const valorActual = cantidadAccion * precioActual;
        const rentabilidad = valorActual - inversionTotal;
        setResultado(rentabilidad.toFixed(2).toString());
        setError(null);
      } else {
        setError('El símbolo de la acción no existe.');
      }
    } catch (error) {
      console.error('Error en la solicitud de datos de la acción:', error);
      setError('Error al obtener datos de la acción');
    }
  };
  const navigation = useNavigation();
  const volver = () => {
    navigation.navigate('Home');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulador de Rentabilidad de Acciones</Text>
      <Anuncio />

      <TextInput
        style={styles.input}
        placeholder="Símbolo de la Acción (por ejemplo, AAPL)"
        value={symbol}
        onChangeText={(text) => setSymbol(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Cantidad de Acciones"
        keyboardType="numeric"
        value={cantidad}
        onChangeText={(text) => setCantidad(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Precio de Compra por Acción"
        keyboardType="numeric"
        value={precioCompra}
        onChangeText={(text) => setPrecioCompra(text)}
      />

      <TouchableOpacity style={styles.button} onPress={calcularRentabilidad}>
        <Text style={styles.buttonText}>Calcular Rentabilidad</Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      {resultado !== null && (
        <Text style={styles.result}>La rentabilidad estimada es: {resultado}</Text>
      )}

      {cotizacionActual !== null && (
        <Text style={styles.result}>Cotización actual: {cotizacionActual}</Text>
      )}

    
        <TouchableOpacity
        onPress={volver}
        style={styles.touchableButtonV}
      >
        <Text style={styles.buttonTextV}>VOLVER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f4f4f8', // Fondo claro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: '100%',
    fontSize:24,
    textAlign:"center",
    backgroundColor:'#f1d84a'
  },
  button: {
    backgroundColor: '#4a90e2', // Azul personalizado
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: '#4a90e2',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  touchableButtonV: {
    marginVertical: 10,
    backgroundColor: '#555ff7',
    paddingHorizontal: 27,
    marginTop: 20,
  },
  buttonTextV: {
    fontSize: 22,
    color: '#f4f8f8',
  },
});
