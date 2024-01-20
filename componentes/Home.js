import React from "react";
import {View,Text, Image,TouchableOpacity,StyleSheet} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const Home = () => {
  const navigation = useNavigation();

  const openMenu = () => {
    navigation.openDrawer(); // Step 3
  }
const AccesoHerramientas=()=>{navigation.navigate('Herramientas')}

  return (
    <View style={styles.container}>
       <MaterialCommunityIcons 
        name="menu"
        size={30}
        style={styles.menuIcon}
        onPress={openMenu} // Step 2
      />
      <View style={styles.imagenes}>
        <Image style={styles.logo} source={require("../assets/LogoJuan.png")} />
      </View>
      <View style={styles.imagenes}>
        <Image style={styles.imagen} source={require("../assets/calculadora.jpg")} />
      </View>
      <View style={styles.tituloContainer}>
        <Text style={styles.titulo}>¡Optimiza tus finanzas!</Text>
    </View>
    <TouchableOpacity onPress={AccesoHerramientas}>
    <Text style={styles.buttonText}>RECURSOS</Text>
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
    width: 280,
    height: 195,
  },
  imagen: {
    width: 280,
    height: 200,
    marginTop:-10
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
 }, menuIcon: {
  position: 'absolute',
  top: 40,
  left: 20,
  fontSize:40,
  zIndex: 1,
},
});

export default Home;