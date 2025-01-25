import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Home = () => {
  const navigation = useNavigation();

  const openMenu = () => {
    navigation.openDrawer();
  }

  const AccesoHerramientas = () => {
    navigation.navigate('Herramientas');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4c669f" />
      <View style={styles.container}>
        <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
          <MaterialCommunityIcons 
            name="menu"
            size={30}
            color="white"
          />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <Image style={styles.logo} source={require("../assets/LogoJuan.png")} resizeMode="contain" />
          
          <View style={styles.imageContainer}>
            <Image style={styles.imagen} source={require("../assets/calculadora.jpg")} />
          </View>
          
          <Text style={styles.titulo}>¡Optimiza tus finanzas!</Text>
          
          <TouchableOpacity style={styles.button} onPress={AccesoHerramientas}>
            <Text style={styles.buttonText}>ACCEDE A LOS SIMULADORES</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4c669f",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#4c669f",
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 140,
    marginBottom: 20,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imagen: {
    width: 280,
    height: 200,
  },
  titulo: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  button: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Home;
