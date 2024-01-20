import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';


const Herramientas = () => {
  const navigation = useNavigation();
  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-9777143216104753/8889863321';
  const navigateToHerramientas = (ruta) => {
    navigation.navigate(ruta);
  };

  const opciones = [
    { nombre: 'CALCULADORA DE PRÉSTAMOS', ruta: 'Prestamo' },
    { nombre: 'CALCULADORA DE AHORROS', ruta: 'Ahorros' },
    { nombre: 'CALCULADORA DE INVERSIONES', ruta: 'CalculadoraInversiones' },
    { nombre: 'CONVERSOR DE DIVISAS', ruta: 'Divisa' },
    { nombre: 'RENDIMIENTO PARA LA JUBILACIÓN', ruta: 'Jubilacion' },
    
    
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.tituloOrg}>Elige la herramienta a utilizar</Text>
      <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
      <View style={styles.organismos}>
        {opciones.map((opcion) => (
          <TouchableOpacity
            key={opcion.ruta}
            style={styles.opcion}
            onPress={() => navigateToHerramientas(opcion.ruta)}
          >
            <Text style={styles.opcionTexto}>{opcion.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  tituloOrg: {
    fontSize: 24,
    marginBottom: 20,
    marginTop:70,
    textAlign:'center',
    color:'#54722e',
    textDecorationLine:'underline'
  },
  organismos: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  opcion: {
    display:'flex',
    backgroundColor: 'lightblue',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width:250,
    alignItems:'center'
  },
  opcionTexto: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default Herramientas;

