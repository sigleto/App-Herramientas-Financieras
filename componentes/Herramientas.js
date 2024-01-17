import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Herramientas = () => {
  const navigation = useNavigation();

  const navigateToHerramientas = (ruta) => {
    navigation.navigate(ruta);
  };

  const opciones = [
    { nombre: 'CALCULADORA DE PRÉSTAMOS', ruta: 'Prestamo' },
    { nombre: 'CALCULADORA DE AHORROS', ruta: 'Ahorros' },
    { nombre: 'CONVERSOR DE DIVISAS', ruta: 'Divisa' },
    { nombre: 'SIMULADOR DE JUBILACIÓN', ruta: 'Jubilacion' },
    { nombre: 'RENTABILIDAD DE ACCIONES', ruta: 'Acciones' },
    
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.tituloOrg}>Elige la herramienta a utilizar</Text>
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

