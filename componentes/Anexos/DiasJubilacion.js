import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
  const [birthDate, setBirthDate] = useState('');
  const [retirementAge, setRetirementAge] = useState('');
  const [timeRemaining, setTimeRemaining] = useState({
    years: null,
    months: null,
    days: null,
  });

  const calculateTimeRemaining = () => {
    // Validar que se hayan ingresado ambas fechas
    if (!birthDate || !retirementAge) {
      alert('Por favor, ingresa la fecha de nacimiento y la edad de jubilación.');
      return;
    }

    // Obtener la fecha actual
    const currentDate = new Date();

    // Parsear la fecha de nacimiento y la edad de jubilación
    const [day, month, year] = birthDate.split('-').map((part) => parseInt(part, 10));
    const birthDateObj = new Date(year, month - 1, day); // Restamos 1 al mes porque en JavaScript los meses van de 0 a 11
    const retirementAgeNumber = parseInt(retirementAge, 10);

    // Calcular la fecha de jubilación
    const retirementDate = new Date(
      birthDateObj.getFullYear() + retirementAgeNumber,
      birthDateObj.getMonth(),
      birthDateObj.getDate()
    );

    // Calcular la diferencia en milisegundos
    const differenceInMillis = retirementDate - currentDate;

    // Calcular años, meses y días
    const years = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((differenceInMillis % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((differenceInMillis % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));

    setTimeRemaining({
      years,
      months,
      days,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fecha de Nacimiento (DD-MM-YYYY):</Text>
      <TextInput
        style={styles.input}
        placeholder="DD-MM-YYYY"
        value={birthDate}
        onChangeText={(text) => {
            // Formatear el texto a DD-MM-YYYY
            if (text.length === 2 || text.length === 5) {
              // Agregar las barras automáticamente al ingresar el día y el mes
              text += '-';
            }
            setBirthDate(text);
          }}
        textAlign="center"  // Centra el texto
        fontSize={20}       // Ajusta el tamaño de la fuent
        height= {50}
        fontWeight='bold'
      />

      <Text style={styles.label}>Edad de Jubilación:</Text>
      <TextInput
        style={styles.input}
        placeholder="Edad"
        keyboardType="numeric"
        value={retirementAge}
        onChangeText={(text) => setRetirementAge(text)}
        textAlign="center"  // Centra el texto
        fontSize={20}       // Ajusta el tamaño de la fuent
        height={50}
        fontWeight='bold'
      />

      <TouchableOpacity style={styles.touchableButton} onPress={calculateTimeRemaining}>
        <Text style={styles.buttonText}>Calcular</Text>
      </TouchableOpacity>

      {timeRemaining.years !== null && (
        <Text style={styles.resultText}>
          Tiempo restante hasta la jubilación:{' '}
          {timeRemaining.years > 0 && `${timeRemaining.years} años`}
          {timeRemaining.years > 0 && (timeRemaining.months > 0 || timeRemaining.days > 0) && ', '}
          {timeRemaining.months > 0 && `${timeRemaining.months} meses`}
          {timeRemaining.months > 0 && timeRemaining.days > 0 && ' y '}
          {timeRemaining.days > 0 && `${timeRemaining.days} días`}
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
    backgroundColor: '#fffbde',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#36c23a",
  },
});

