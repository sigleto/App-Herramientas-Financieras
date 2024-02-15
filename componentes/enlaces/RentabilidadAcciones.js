import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const MARKETSTACK_API_ACCESS_KEY = 'c555cb6dffff4419dc2ecd0c24770476'; // Reemplaza con tu clave de API de Marketstack

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
        `http://api.marketstack.com/v1/tickers/${symbol}/eod/latest?access_key=${MARKETSTACK_API_ACCESS_KEY}&exchange=MADRID`
      );

      if (response.data) {
        const stockData = response.data;
        const precioActual = stockData.close; // Cambiar a la propiedad correcta según la respuesta de Marketstack
        setCotizacionActual(precioActual);
        const cantidadAccion = parseInt(cantidad);
        const inversionTotal = cantidadAccion * parseFloat(precioCompra);
        const valorActual = cantidadAccion * precioActual;
        const rentabilidad = valorActual - inversionTotal;
        console.log(precioActual);
        setResultado(rentabilidad.toFixed(2).toString());
        setError(null); // Limpiar mensaje de error si existía previamente
      } else {
        setError('El símbolo de la acción no existe.');
      }
    } catch (error) {
      console.error('Error en la solicitud de datos de la acción:', error);
      setError('Error al obtener datos de la acción');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulador de Rentabilidad de Acciones</Text>

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

      <Button title="Calcular Rentabilidad" onPress={calcularRentabilidad} />

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      {resultado !== null && (
        <Text style={styles.result}>
          La rentabilidad estimada es: {resultado}
        </Text>
      )}

      {cotizacionActual !== null && (
        <Text style={styles.result}>
          Cotización actual: {cotizacionActual}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  result: {
    marginTop: 20,
    fontSize: 18,
  },
  error: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});
