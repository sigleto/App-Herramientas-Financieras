import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CalculadoraAhorros from './enlaces/CalculadoraAhorros';
import RentabilidadAcciones from './enlaces/RentabilidadAcciones';
import SimuladorJubilacion from './enlaces/SimuladorJubilacion';
import CalculadoraPrestamos from './enlaces/CalculadoraPrestamo';
import ConversorDivisas from './enlaces/ConversorDivisas';
import Herramientas from './Herramientas';
import TablaAmortizacion from './Anexos/TablaPrestamo';
import Home from './Home';
import DiasJubilacion from './Anexos/DiasJubilacion';
import PoliticaPrivacidad from './Anexos/PoliticaPrivacidad';
import DescargoResponsabilidad from './Anexos/DescargoResponsabilidad';

const Stack = createStackNavigator();

export function HerramientasStack(){
  return (
    
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home}options={{ headerShown: false }} />
        <Stack.Screen name="Herramientas" component={Herramientas}options={{ headerShown: false }} />
        <Stack.Screen name="Prestamo" component={CalculadoraPrestamos}options={{ headerShown: false }} />
        <Stack.Screen name="Ahorros" component={CalculadoraAhorros}options={{ headerShown: false }} />
        <Stack.Screen name="Divisa" component={ConversorDivisas}options={{ headerShown: false }} />
        <Stack.Screen name="Jubilacion" component={SimuladorJubilacion}options={{ headerShown: false }} />
        <Stack.Screen name="Acciones" component={RentabilidadAcciones}options={{ headerShown: false }} />
        <Stack.Screen name="Tabla" component={TablaAmortizacion}options={{ headerShown: false }} />
        <Stack.Screen name="DiasJubilacion" component={DiasJubilacion}options={{ headerShown: false }} />
        <Stack.Screen name="DescargoResponsabilidad" component={DescargoResponsabilidad}options={{ headerShown: false }} />
        <Stack.Screen name="PoliticaPrivacidad" component={PoliticaPrivacidad}options={{ headerShown: false }} />
        
        
      </Stack.Navigator>
    
  );
};
