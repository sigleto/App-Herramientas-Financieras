import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { PrincipalStack } from './componentes/Navigation';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import PoliticaPrivacidad from './componentes/Anexos/PoliticaPrivacidad';
import DescargoResponsabilidad from './componentes/Anexos/DescargoResponsabilidad';

enableScreens();
const Drawer = createDrawerNavigator();
const App = ({navigation}) => {
  return (
    
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}
        >
          <Drawer.Screen
            name="Inicio"
            component={PrincipalStack}
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" size={size} color={color} />
              ), drawerLabelStyle: {
                fontSize: 20,
              }
            }}
          />
          <Drawer.Screen
            name="Politica"
            component={PoliticaPrivacidad}
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" size={size} color={color} />
              ), drawerLabelStyle: {
                fontSize: 20,
              }
            }}
          />
          <Drawer.Screen
            name="Descargo"
            component={DescargoResponsabilidad}
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" size={size} color={color} />
              ), drawerLabelStyle: {
                fontSize: 20,
              }
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  datos:{
    backgroundColor:"red",
  },
});

export default App;
