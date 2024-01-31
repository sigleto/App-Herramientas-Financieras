import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Anuncio from "./Anuncio";
import { useNavigation } from "@react-navigation/native";

export default function TablaInversion({ route }) {
  const navigation = useNavigation();
  const data = route.params.data || [];
 


  const volver = () => {
    navigation.navigate('Home')}

  return (
    <View style={styles.container}>
      <Anuncio />
      <TouchableOpacity
        onPress={volver}
        style={styles.touchableButtonV}
      >
        <Text style={styles.buttonText}>VOLVER</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.columnHeader}>Periodo(Años) </Text>
        <Text style={styles.columnHeader}>Saldo</Text>
        <Text style={styles.columnHeader}>Rendimiento Periodo</Text>
        <Text style={styles.columnHeader}>Rendimiento Acumulado</Text>
      </View>
      <FlatList
  data={data}
  keyExtractor={(item) => item.periodo.toString()}
  renderItem={({ item }) => (
    <View style={styles.row}>
      <Text style={styles.column}>{item.periodo}</Text>
      <Text style={styles.column}>{item.saldo}</Text>
      <Text style={styles.column}>{item.rendimientoPeriodo}</Text>
      <Text style={styles.column}>{item.rendimientoAcumulado}</Text>
    </View>
  )}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  columnHeader: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  column: {
    flex: 1,
    textAlign: "center",
  },
  touchableButtonV: {
    backgroundColor: "#3498db",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});
