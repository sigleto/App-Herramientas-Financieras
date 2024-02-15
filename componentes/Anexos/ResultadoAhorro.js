import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";

export default function ResultadoAhorro({ route }) {
  const navigation = useNavigation();
  const { meta, tasaInteres, periodo, tipoInteres, unidadPeriodo } = route.params;
  const [ahorroNecesario, setAhorroNecesario] = useState('');

  const calcularAhorroNecesario = () => {
    const metaFloat = parseFloat(meta);
    const tasaInteresFloat = parseFloat(tasaInteres) / 100; // Tasa de interés anual
    const periodoFloat = parseFloat(periodo) * (unidadPeriodo === 'años' ? 12 : 1); // Ajustar según la unidad de período
  
    console.log('Meta:', metaFloat);
    console.log('Tasa de Interés:', tasaInteresFloat);
    console.log('Período:', periodoFloat);
  
    const tasaInteresMensual = tipoInteres === 'anual' ? Math.pow(1 + tasaInteresFloat, 1 / 12) - 1 : tasaInteresFloat;
  
    console.log('Tasa de Interés Mensual:', tasaInteresMensual);
  
    const ahorroNecesarioCalculado =
      metaFloat /
      ((Math.pow(1 + tasaInteresMensual, periodoFloat) - 1) / tasaInteresMensual);
  
    console.log('Ahorro Necesario Calculado:', ahorroNecesarioCalculado);
    setAhorroNecesario(isNaN(ahorroNecesarioCalculado) ? '0' : ahorroNecesarioCalculado.toFixed(2).toString());

  };
  

  useEffect(() => {
    calcularAhorroNecesario();
  }, [navigation]);

  const volver = () => {
    navigation.navigate('Home');
  };

  // Datos para el gráfico
  const intervaloEtiquetas = 5; // Mostrar una etiqueta para cada cinco períodos

  const labels = Array.from({ length: parseFloat(periodo) }, (_, i) => {
    if ((i + 1) % intervaloEtiquetas === 0 || i === parseFloat(periodo) - 1) {
      return (i + 1).toString();
    } else {
      return '';
    }
  });
  
  const data = {
    labels: labels,
    datasets: [
      {
        data: Array.from({ length: parseFloat(periodo) }, (_, i) => {
          const ahorroCalculado = parseFloat(ahorroNecesario*12) * (i + 1);
          return parseFloat(ahorroCalculado.toFixed(2));
        }),
      },
    ],
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.enunciado}>Datos introducidos</Text>
      <Text style={styles.labelText}>Meta de ahorro: <Text style={styles.resultText}>{meta}</Text></Text>
      <Text style={styles.labelText}>Tasa de Interés: <Text style={styles.resultText}>{tasaInteres} %</Text></Text>
      <Text style={styles.labelText}>Período: <Text style={styles.resultText}>{periodo} {unidadPeriodo}</Text></Text>
      <Text style={styles.enunciado}>Resultado</Text>
      <Text style={styles.labelText}>Ahorro necesario mensual: <Text style={styles.resultText}>{parseFloat(ahorroNecesario).toFixed(2)}</Text></Text>
      {ahorroNecesario ? (
        <View>
          <LineChart
            data={data}
            width={350}
            height={220}
            yAxisLabel="Ahorro acumulado"
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <Text style={styles.labelXAxis}>Años</Text>
        </View>
      ) : (
        <Text>No hay datos disponibles para mostrar el gráfico.</Text>
      )}
      <TouchableOpacity
        onPress={volver}
        style={styles.touchableButtonV}
      >
        <Text style={styles.buttonText}>VOLVER</Text>
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
  resultText: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    fontWeight: 'bold',
    textAlign:'center'
  },
  enunciado: {
    marginTop: 40,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom:40,
  },
  labelText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign:'center'
  },
  labelXAxis: {
    alignSelf: 'center',
    marginTop: 10,
  },
  touchableButtonV: {
    marginVertical: 10,
    backgroundColor: '#555ff7',
    paddingHorizontal:5,
    marginTop: 100,
    borderRadius: 10,
    alignSelf: 'center',
  },
});
