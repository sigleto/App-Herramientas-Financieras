import "react-native-gesture-handler";
import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Share,
  Alert,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { enableScreens } from "react-native-screens";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { PrincipalStack } from "./componentes/Navigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PoliticaPrivacidad from "./componentes/Anexos/PoliticaPrivacidad";
import DescargoResponsabilidad from "./componentes/Anexos/DescargoResponsabilidad";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PublicidadProvider } from "./componentes/Anexos/Publicidad";

enableScreens();
const Drawer = createDrawerNavigator();

const shareApp = async () => {
  try {
    const result = await Share.share({
      message:
        "Descarga la app Finanzas Fácil: Simulador y optimiza tus cálculos financieros. ¡Haz clic aquí para descargarla! https://play.google.com/store/apps/details?id=com.sigleto.Herramientas_financieras",
    });
    if (result.action === Share.dismissedAction) {
      Alert.alert("Compartir cancelado");
    }
  } catch (error) {
    Alert.alert("Error", "Hubo un problema al intentar compartir la app.");
  }
};

const ShareScreen = () => {
  const handleShare = useCallback(() => {
    shareApp();
  }, []);

  return (
    <View style={styles.shareContainer}>
      <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
        <Text style={styles.shareText}>📤 Compartir la aplicación</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <PublicidadProvider>
          <SafeAreaView
            style={styles.safeArea}
            edges={Platform.OS === "android" ? ["top", "bottom"] : []}
          >
            <StatusBar barStyle="dark-content" backgroundColor="#F4F7FB" />
            <NavigationContainer>
              <Drawer.Navigator
                initialRouteName="Inicio"
                screenOptions={{
                  headerShown: false,
                  drawerStyle: styles.drawer,
                  drawerLabelStyle: styles.drawerLabel,
                  drawerActiveTintColor: "#246BFD",
                  drawerInactiveTintColor: "#6B7C93",
                }}
              >
                <Drawer.Screen
                  name="Inicio"
                  component={PrincipalStack}
                  options={{
                    drawerIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="home" size={size} color={color} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="Política"
                  component={PoliticaPrivacidad}
                  options={{
                    drawerIcon: ({ color, size }) => (
                      <MaterialCommunityIcons
                        name="shield-account"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="Descargo"
                  component={DescargoResponsabilidad}
                  options={{
                    drawerIcon: ({ color, size }) => (
                      <MaterialCommunityIcons
                        name="alert-circle-outline"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="Compartir"
                  component={ShareScreen}
                  options={{
                    drawerIcon: ({ color, size }) => (
                      <MaterialCommunityIcons
                        name="share-variant"
                        size={size}
                        color={color}
                      />
                    ),
                    drawerLabel: "Compartir la App",
                  }}
                />
              </Drawer.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </PublicidadProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  drawer: {
    backgroundColor: "#fff",
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  drawerLabel: {
    fontSize: 18,
    marginLeft: -5,
    fontWeight: "500",
  },
  shareContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  shareButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  shareText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

export default App;
