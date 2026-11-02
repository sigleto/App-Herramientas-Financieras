// Anuncio.js
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";
import { usePuedeSolicitarAnuncios } from "./Publicidad";

const Anuncio = () => {
  const canRequestAds = usePuedeSolicitarAnuncios();
  const adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : "ca-app-pub-6921150380725872/1047749902";
  const interstitial = useMemo(
    () => InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    }),
    [adUnitId]
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!canRequestAds) return undefined;
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => setLoaded(true)
    );
    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        interstitial.load();
      }
    );
    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        setLoaded(false);
        console.error("Error cargando el anuncio intersticial:", error);
      }
    );
    interstitial.load();
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, [canRequestAds, interstitial]);

  if (!canRequestAds || !loaded) return null;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={async () => {
        try {
          setLoaded(false);
          await interstitial.show();
        } catch (error) {
          console.error("No se pudo mostrar el anuncio intersticial:", error);
        }
      }}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.text}>Ver anuncio opcional</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pressed: { opacity: 0.6 },
  text: { color: "#6B7C93", fontSize: 10, fontWeight: "600" },
});

export default Anuncio;
