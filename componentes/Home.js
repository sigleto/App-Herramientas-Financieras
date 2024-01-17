import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const navigation = useNavigation();

const AccesoHerramientas=()=>{navigation.navigate('Herramientas')}

  return (
    <View style={styles.container}>
      <View style={styles.imagenes}>
        <Image style={styles.logo} source={require("../assets/LogoJuan.png")} />
        </View>
      <View style={styles.tituloContainer}>
        <Text style={styles.titulo}>¡Accede a herramientas y todo eso!</Text>
    </View>
    <TouchableOpacity onPress={AccesoHerramientas}>
    <Text style={styles.buttonText}>HERRAMIENTAS</Text>
    </TouchableOpacity>
    </View>
  );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f6f6e2",
  },
  logo: {
    width: 300,
    height: 220,
  },
  
  tituloContainer: {
    marginTop: 20,
  },
  titulo: {
    fontSize: 31,
    color: "#050444",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  imagenes: {
    marginTop: 10,
  },
 buttonText:{
  fontSize:19,
  backgroundColor:'#1c06f7',
  color:'white',
  paddingHorizontal:30,
  paddingVertical:10,
 }
});

export default Home;