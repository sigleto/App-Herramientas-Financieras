import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { SharedElement } from "react-navigation-shared-element";

const PoliticaPrivacidad = () => {
  const navegacion = useNavigation();

  const salto = () => { navegacion.navigate("Home") }

  return (
    <ScrollView style={styles.container}>
      <SharedElement id="elementId">
        <Text style={styles.titulo}>Política de privacidad de Herramientas Financieras:</Text>
        <Text style={styles.parrafo}>
          {"Se ha construido la aplicación Herramientas Financieras como una aplicación gratuita. Este SERVICIO es proporcionado sin costo alguno y está destinado a ser utilizado tal cual. Esta página se utiliza para informar a los visitantes sobre nuestras políticas con respecto a la recopilación, el uso y la divulgación de Información personal si alguien decide utilizar mi Servicio. Si elige usar nuestro Servicio, entonces acepta la recopilación y el uso de información en relación con esta política. La información personal que se recopila se utiliza para proporcionar y mejorar el Servicio. No se usará ni compartirá su información con nadie, excepto como se describe en esta Política de privacidad. Los términos utilizados en esta Política de privacidad tienen los mismos significados que en nuestros Términos y condiciones, a los que se puede acceder en Todo-Trámite a menos que se defina lo contrario en esta Política de privacidad.\n\n" +
          "Recopilación y uso de información\n\nEsta aplicación no recopila ningún tipo de información personal.\n\n" +
          "Enlace a la política de privacidad de los proveedores de servicios de terceros utilizados por la aplicación\n\n" +
          "Servicios de Google Play\nExpo\n\n" +
          "Cookies\n\nLas cookies son archivos con una pequeña cantidad de datos que se utilizan comúnmente como identificadores únicos anónimos. Estos se envían a su navegador desde los sitios web que visita y se almacenan en la memoria interna de su dispositivo. Este Servicio no utiliza estas 'cookies' de forma explícita. Sin embargo, la aplicación puede usar código y bibliotecas de terceros que usan 'cookies' para recopilar información y mejorar sus servicios. Tiene la opción de aceptar o rechazar estas cookies y saber cuándo se envía una cookie a su dispositivo. Si elige rechazar nuestras cookies, es posible que no pueda utilizar algunas partes de este Servicio.\n\n" +
          "Proveedores de servicio\n\nPodemos emplear empresas e individuos de terceros debido a las siguientes razones:\n\n" +
          "    Para facilitar nuestro Servicio;\n" +
          "    Para proporcionar el Servicio en nuestro nombre;\n" +
          "    Para realizar servicios relacionados con el Servicio; o\n" +
          "    Para ayudarnos a analizar cómo se utiliza nuestro Servicio.\n\n" +
          "Seguridad\n\nValoramos tu confianza al proporcionarnos su información personal, por lo que nos esforzamos por utilizar medios comercialmente aceptables para protegerla. Pero recuerda que ningún método de transmisión por Internet, o método de almacenamiento electrónico es 100% seguro y confiable, y no podemos garantizar tu seguridad absoluta.\n\n" +
          "Enlaces a otros sitios\n\nEste Servicio no contiene enlaces a otros sitios.\n\n" +
          "Privacidad de los niños\n\nEstos Servicios no están dirigidos a personas menores de 13 años. No recopilamos a sabiendas información de identificación personal de niños menores de 13 años. En caso de que descubra que un niño menor de 13 años nos ha proporcionado información personal, la eliminaremos inmediatamente de nuestros servidores. Si usted es padre o tutor y sabe que su hijo nos ha proporcionado información personal, comuníquese con nosotros para que podamos tomar las medidas necesarias.\n\n" +
          "Cambios a esta Política de privacidad\n\nPodemos actualizar nuestra Política de privacidad de vez en cuando. Por lo tanto, se le recomienda revisar esta página periódicamente para ver si hay cambios. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página. Esta política es efectiva a partir del 2023-10-10\n\n" +
          "Contáctanos\n\nSi tienes alguna pregunta o sugerencia sobre nuestra Política de Privacidad, no dudes en ponerte en contacto con nosotros en trianabaresapp@gmail.com."}
        </Text>
      </SharedElement>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={salto}>
          <Text style={styles.buttonText}>SALTAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff', // Color de fondo
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 40,
    color: '#007BFF', // Color del título
  },
  parrafo: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 16,
    color: '#333', // Color del texto
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 60,
  },
  skipButton: {
    backgroundColor: '#007BFF', // Color del botón
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff', // Color del texto del botón
    fontSize: 16,
  },
});

export default PoliticaPrivacidad;
