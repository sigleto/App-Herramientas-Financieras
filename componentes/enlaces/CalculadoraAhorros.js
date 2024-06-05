import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Picker} from '@react-native-picker/picker';

export default function CalculadoraAhorros() {
  const [meta, setMeta] = useState('');
  const [tasaInteres, setTasaInteres] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [tipoInteres, setTipoInteres] = useState('anual');
  const navigation = useNavigation();

  const calcularCuota = () => {
    if (!meta || !tasaInteres || !periodo) {
      alert('Por favor, completa todos los campos.');
    } else {
      navigation.navigate("ResultadoAhorro", {
        meta: meta,
        tasaInteres: tasaInteres,
        periodo: periodo,
        tipoInteres: tipoInteres,
      });
    }
  };

  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-6921150380725872/2360831572';
  const navigateToHerramientas = (ruta) => {
    navigation.navigate(ruta);
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Meta de ahorro</Text>
          <Input
            keyboardType="numeric"
            inputStyle={{ fontSize: 20, color: 'olive' }}
            style={styles.input}
            onChangeText={(text) => setMeta(text)}
            autoFocus={true}
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.halfContainer}>
            <Text style={styles.label}>Tasa de interés (%)</Text>
            <Input
              keyboardType="numeric"
              style={styles.input}
              inputStyle={{ fontSize: 20, color: 'olive' }}
              value={tasaInteres}
              onChangeText={(text) => setTasaInteres(text)}
            />
          </View>

          <View style={styles.halfContainer}>
            <Text style={styles.label}>Tipo de interés</Text>
            <Picker
              selectedValue={tipoInteres}
              style={styles.picker}
              onValueChange={(itemValue) => setTipoInteres(itemValue)}
            >
              <Picker.Item label="Anual" value="anual" />
              <Picker.Item label="Mensual" value="mensual" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Período (años)</Text>
          <Input
            keyboardType="numeric"
            style={styles.input}
            inputStyle={{ fontSize: 20, color: 'olive' }}
            value={periodo}
            onChangeText={(text) => setPeriodo(text)}
          />
        </View>

        <TouchableOpacity onPress={calcularCuota} style={styles.touchableButton}>
          <Text style={styles.buttonText}>Calcular Ahorro Necesario</Text>
        </TouchableOpacity>
      </ScrollView>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: '#fffbde',
   
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  halfContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 10,
    marginTop:30
  },
  input: {
    textAlign: 'center',
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: "#555ff7",
    borderRadius: 10,
    padding: 10,
  },
  touchableButton: {
    marginVertical: 10,
    backgroundColor: '#555ff7',
    paddingHorizontal: 27,
    marginTop: 5,
  },
  buttonText: {
    fontSize: 22,
    color: '#f4f8f8',
  },
  label: {
    fontWeight: "bold",
    fontSize: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'olive',
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: "#555ff7",
    borderRadius: 10,
    padding: 10,
  },
});
