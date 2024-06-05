import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import Anuncio from '../Anexos/Anuncio';
import { useNavigation } from '@react-navigation/native';

const API_KEY = '979f1efb1d7447ae80c6eacd42c684e6'; // Clave de la API de openexhangerate
const monedas = [
  { codigo: 'USD', nombre: 'Dólar estadounidense' },
  { codigo: 'EUR', nombre: 'Euro' },
  { codigo: 'AUD', nombre: 'Dólar australiano' },
  { codigo: 'ARS', nombre: 'Peso argentino' },
  { codigo: 'UYU', nombre: 'Peso uruguayo' },
  { codigo: 'CLP', nombre: 'Peso chileno' },
  { codigo: 'COP', nombre: 'Peso colombiano' },
  { codigo: 'PEN', nombre: 'Sol peruano' },
  { codigo: 'PYG', nombre: 'Guaraní paraguayo' },
  { codigo: 'CRC', nombre: 'Colón costarricense' },
  { codigo: 'MXN', nombre: 'Peso mexicano' },
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
  const [monedaOrigen, setMonedaOrigen] = useState('USD');
  const [monedaDestino, setMonedaDestino] = useState('EUR');
  const [tipoCambio, setTipoCambio] = useState('');
  const [resultado, setResultado] = useState('');
  const [mostrarPantallaNumeros, setMostrarPantallaNumeros] = useState(true);
  const [cantidadIntroducida, setCantidadIntroducida] = useState('');
  const [mensajeEstado, setMensajeEstado] = useState('');

  const API_KEY = 'd93ad7934d4b03cf5de6577a';

  const obtenerTipoCambio = async () => {
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${monedaOrigen}`
      );
      const data = await response.json();

      if (response.ok) {
        if (data && data.conversion_rates && data.conversion_rates[monedaDestino]) {
          const tasaCambio = data.conversion_rates[monedaDestino];
          setTipoCambio(tasaCambio.toString());
          setMensajeEstado(`Cantidad introducida: ${cantidadIntroducida} ${monedaOrigen}`);
        } else {
          console.error('Error: La moneda de origen o destino no está disponible.');
        }
      } else {
        console.error('Error al obtener el tipo de cambio');
      }
    } catch (error) {
      console.error('Error en la solicitud de tipo de cambio:', error);
    }
  };

  const convertirDivisas = () => {
    const cantidadFloat = parseFloat(cantidadIntroducida);
    const resultadoCalculado = cantidadFloat * parseFloat(tipoCambio);
    setResultado(resultadoCalculado.toFixed(2).toString());
  };

  const ocultarPantallaNumeros = () => {
    setMostrarPantallaNumeros(false);
  };

  const navigation = useNavigation();
  const volver = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
       <Anuncio />
      {/* Cantidad a convertir */}
      {mostrarPantallaNumeros && (
        <>
          <Text style={styles.label}>Cantidad a convertir</Text>
          <Input
            keyboardType="numeric"
            value={cantidadIntroducida}
            onChangeText={(text) => setCantidadIntroducida(text)}
            inputStyle={{ fontSize: 20, color: 'olive' }}
            style={styles.input}
            autoFocus={true}
          />
        </>
      )}
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
      <TouchableOpacity onPress={() => { obtenerTipoCambio(); ocultarPantallaNumeros(); }} style={styles.touchableButton}>
        <Text style={styles.buttonText}>Obtener Tipo de Cambio</Text>
      </TouchableOpacity>
      {tipoCambio !== '' && (
      <View>
        <Text style={styles.resultText}>{mensajeEstado}</Text>
        <Text style={styles.resultText}>
        
          Tipo de Cambio: 1 {monedaOrigen} = {tipoCambio} {monedaDestino}
        </Text>
        </View>
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
    backgroundColor: '#fffbde',
  },
  input: {
    marginBottom: 18,
    textAlign: 'center',
    fontSize: 26,
  },
  touchableButton: {
    marginVertical: 10,
    backgroundColor: '#555ff7',
    paddingHorizontal: 27,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 22,
    color: '#f4f8f8',
  },
  buttonTextV: {
    fontSize: 15,
    color: 'white',
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
  },
   touchableButtonV: {
    marginVertical: 10,
    backgroundColor: 'olive',
    paddingHorizontal:5,
    marginTop: 25,
    borderRadius: 10,
    alignSelf: 'center',

  },
});
