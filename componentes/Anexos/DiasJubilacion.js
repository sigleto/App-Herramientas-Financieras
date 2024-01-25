import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Anuncio from './Anuncio';

export default function App() {
  const [birthDate, setBirthDate] = useState('');
  const [retirementAge, setRetirementAge] = useState({
    years: '',
    months: '',
  });
  const [timeRemaining, setTimeRemaining] = useState({
    years: null,
    months: null,
    days: null,
  });

  const calculateTimeRemaining = () => {
    // Validar que se hayan ingresado ambas fechas
    if (!birthDate || (!retirementAge.years && !retirementAge.months)) {
      alert('Por favor, ingresa la fecha de nacimiento y la edad de jubilación.');
      return;
    }

    // Obtener la fecha actual
    const currentDate = new Date();

    // Parsear la fecha de nacimiento y la edad de jubilación
    const [day, month, year] = birthDate.split('-').map((part) => parseInt(part, 10));
    const birthDateObj = new Date(year, month - 1, day); // Restamos 1 al mes porque en JavaScript los meses van de 0 a 11

    const retirementYears = parseInt(retirementAge.years, 10) || 0;
    const retirementMonths = parseInt(retirementAge.months, 10) || 0;

    // Calcular la fecha de jubilación
    const retirementDate = new Date(
      birthDateObj.getFullYear() + retirementYears,
      birthDateObj.getMonth() + retirementMonths,
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
      <Anuncio />
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
        textAlign="center"
        fontSize={20}
        height={50}
        fontWeight='bold'
      />

      <Text style={styles.label}>Edad de Jubilación:</Text>
      <View style={styles.ageInputContainer}>
        <TextInput
          style={styles.ageInput}
          placeholder="Años"
          keyboardType="numeric"
          value={retirementAge.years}
          onChangeText={(text) => setRetirementAge({ ...retirementAge, years: text })}
          textAlign="center"
          fontSize={20}
          height={50}
          fontWeight='bold'
        />
        <TextInput
          style={styles.ageInput}
          placeholder="Meses"
          keyboardType="numeric"
          value={retirementAge.months}
          onChangeText={(text) => setRetirementAge({ ...retirementAge, months: text })}
          textAlign="center"
          fontSize={20}
          height={50}
          fontWeight='bold'
        />
      </View>

      <TouchableOpacity style={styles.touchableButton} onPress={calculateTimeRemaining}>
        <Text style={styles.buttonText}>Calcular</Text>
      </TouchableOpacity>

      {timeRemaining.years !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Tiempo hasta la jubilación:</Text>
          <Text style={styles.resultText}>
            {timeRemaining.years > 0 && `${timeRemaining.years} años`}
            {timeRemaining.years > 0 && (timeRemaining.months > 0 || timeRemaining.days > 0) && ', '}
            {timeRemaining.months > 0 && `${timeRemaining.months} meses`}
            {timeRemaining.months > 0 && timeRemaining.days > 0 && ' y '}
            {timeRemaining.days > 0 && `${timeRemaining.days} días`}
          </Text>
        </View>
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
  ageInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 15,
  },
  ageInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 5,
    padding: 10,
  },
  touchableButton: {
    marginVertical: 10,
    backgroundColor: '#555ff7',
    paddingHorizontal: 27,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 22,
    color: '#f4f8f8'
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 23,
    fontWeight: "bold",
    color: '#bca037',
    textAlign: 'center',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#36c23a",
  },
});
