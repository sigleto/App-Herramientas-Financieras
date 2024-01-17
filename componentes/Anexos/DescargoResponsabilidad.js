import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { SharedElement } from "react-navigation-shared-element";

const DescargoResponsabilidad = () => {
  const navegacion = useNavigation();

  const salto = () => { navegacion.navigate("Home") }

  return (
    <ScrollView style={styles.container}>
      <SharedElement id="elementId">
        <Text style={styles.titulo}>Hoja de Descargo de Responsabilidad:</Text>
        <Text style={styles.parrafo}>
          {"Esta aplicación es una herramienta de simulación financiera y no debe utilizarse como un servicio financiero. No es un sustituto de la asesoría financiera profesional.\n\n" +
          "Esta aplicación no ofrece préstamos personales ni se vincula con ninguna compañía externa que ofrezca préstamos. Tampoco ofrece la tasa de porcentaje anual (APR) ni cargos u otros costos. El usuario debe ingresar la tasa de interés y otra información relevante. Los cálculos son solo estimaciones y pueden no ser precisos.\n\n" +
          "Las recomendaciones de esta aplicación no pueden ser adecuadas para su situación financiera y preferencias de riesgo y rendimiento. Siempre debe consultar con un asesor financiero profesional antes de tomar cualquier decisión financiera importante.\n\n" +
          "Adiciones específicas para su aplicación\n\n" +
          "    Cálculo de préstamos:\n" +
          "        Esta aplicación no tiene en cuenta sus circunstancias individuales, como su historial crediticio, ingresos o gastos.\n" +
          "        Los cálculos de esta aplicación se basan en supuestos y pueden no ser exactos.\n" +
          "    Planificación de jubilación:\n" +
          "        Esta aplicación no tiene en cuenta sus objetivos de jubilación individuales, como el monto de dinero que desea ahorrar o cuándo desea jubilarse.\n" +
          "        Los cálculos de esta aplicación se basan en supuestos y pueden no ser exactos.\n" +
          "    Cálculo de posibles ganancias de acciones:\n" +
          "        Esta aplicación no tiene en cuenta el riesgo asociado con la inversión en acciones.\n" +
          "        Los cálculos de esta aplicación se basan en supuestos y pueden no ser exactos.\n" +
          "    Conversor de monedas:\n" +
          "        Las tasas de cambio utilizadas en esta aplicación son solo estimaciones y pueden no ser precisas.\n" +
          "    Cálculo de rendimientos de productos:\n" +
          "        Esta aplicación no tiene en cuenta el riesgo asociado con la inversión en productos financieros.\n" +
          "        Los cálculos de esta aplicación se basan en supuestos y pueden no ser exactos."}
        </Text>
      </SharedElement>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={salto}>
          <Text style={styles.buttonText}>SALTAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff', // Color de fondo
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 40,
    color: '#007BFF', // Color del título
  },
  parrafo: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 16,
    color: '#333', // Color del texto
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 60,
  },
  skipButton: {
    backgroundColor: '#007BFF', // Color del botón
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff', // Color del texto del botón
    fontSize: 16,
  },
});

export default DescargoResponsabilidad;
