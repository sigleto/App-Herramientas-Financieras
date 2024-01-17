import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function TablaAmortizacion({ route }) {
  const data = route.params.data || [];

  return (
    <View style={styles.container}>
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
    backgroundColor:'#fffbde'
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  columnHeader: {
    fontWeight: "bold",
    flex: 1,
    marginTop:40,
    backgroundColor:'#4df25c'
    
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  column: {
    flex: 1,
  },
});
