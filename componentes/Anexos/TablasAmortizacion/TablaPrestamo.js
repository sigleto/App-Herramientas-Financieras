import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Anuncio from "../Anuncio";
import { useNavigation } from "@react-navigation/native";

export default function TablaAmortizacion({ route }) {
  console.log("Llegó a TablaPrestamo"); // Verifica si llegó a esta pantalla

  const navigation = useNavigation();
  const data = route.params.data || [];

  const volver = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Anuncio />
      <TouchableOpacity onPress={volver} style={styles.touchableButtonV}>
        <Text style={styles.buttonText}>VOLVER</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.columnHeader}>Periodo</Text>
        <Text style={styles.columnHeader}>Cuota</Text>
        <Text style={styles.columnHeader}>Interés</Text>
        <Text style={styles.columnHeader}>Amortiz.</Text>
        <Text style={styles.columnHeader}>Sdo. Pdte</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.periodo.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.column}>{item.periodo}</Text>
            <Text style={styles.column}>{item.cuota} </Text>
            <Text style={styles.column}>{item.interes} </Text>
            <Text style={styles.column}>{item.amortizacion} </Text>
            <Text style={styles.column}>{item.saldoPendiente} </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fffbde",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  columnHeader: {
    fontWeight: "bold",
    flex: 1,
    marginTop: 40,
    backgroundColor: "#4df25c",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  column: {
    flex: 1,
  },
  touchableButtonV: {
    marginVertical: 10,
    backgroundColor: "#61d8eb",
    paddingHorizontal: 5,
    marginTop: 36,
    borderRadius: 10,
    alignSelf: "center",
  },
});
