import React, { useState } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Input } from "../Entrada";
import { useNavigation } from '@react-navigation/native';
import { BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { BannerPublicidad as BannerAd } from '../Anexos/Publicidad';
import { Picker} from '@react-native-picker/picker';
import { parseFinancialNumber } from "../finanzas";

export default function CalculadoraAhorros() {
  const [meta, setMeta] = useState('20000');
  const [tasaInteres, setTasaInteres] = useState('3');
  const [periodo, setPeriodo] = useState('5');
  const [tipoInteres, setTipoInteres] = useState('anual');
  const navigation = useNavigation();

  const calcularCuota = () => {
    if (!meta || !tasaInteres || !periodo) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const target = parseFinancialNumber(meta);
    const rate = parseFinancialNumber(tasaInteres);
    const years = parseFinancialNumber(periodo);
    const maxRate = tipoInteres === "anual" ? 100 : 20;
    if (
      !Number.isFinite(target) ||
      !Number.isFinite(rate) ||
      !Number.isFinite(years) ||
      target <= 0 ||
      rate < 0 ||
      rate > maxRate ||
      years <= 0 ||
      years > 100
    ) {
      alert(`La meta y el plazo deben ser positivos, el plazo máximo es 100 años y el interés debe estar entre 0 % y ${maxRate} %.`);
      return;
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
          <Text style={styles.label}>Meta de ahorro (€)</Text>
          <Input
            keyboardType="numeric"
            inputStyle={{ fontSize: 20, color: '#102A43' }}
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
              inputStyle={{ fontSize: 20, color: '#102A43' }}
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
            inputStyle={{ fontSize: 20, color: '#102A43' }}
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
    backgroundColor: '#F4F7FB',
   
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
    borderColor: "#246BFD",
    borderRadius: 10,
    padding: 10,
  },
  touchableButton: {
    marginVertical: 10,
    backgroundColor: '#246BFD',
    paddingHorizontal: 110,
    marginTop: 5,
    width:'95%',
    borderRadius:10,
  },
  buttonText: {
    fontSize: 23,
    color: '#FFFFFF',
    textAlign:'center'
  },
  label: {
    fontWeight: "bold",
    fontSize: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#102A43',
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: "#246BFD",
    borderRadius: 10,
    padding: 10,
  },
});
