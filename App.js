import React from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { HerramientasStack } from './componentes/Navigation';

export default function App() {
  return (
    <NavigationContainer><HerramientasStack/></NavigationContainer>

  );
}


