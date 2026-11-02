import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AdsConsent,
  BannerAd,
  mobileAds,
} from "react-native-google-mobile-ads";

const AdsContext = createContext(false);

export function PublicidadProvider({ children }) {
  const [canRequestAds, setCanRequestAds] = useState(false);

  useEffect(() => {
    let active = true;
    const prepareAds = async () => {
      try {
        let consent = await AdsConsent.requestInfoUpdate();
        if (consent.isConsentFormAvailable) {
          consent = await AdsConsent.loadAndShowConsentFormIfRequired();
        }
        if (consent.canRequestAds) {
          await mobileAds().initialize();
          if (active) setCanRequestAds(true);
        }
      } catch (error) {
        console.error("No se pudo completar el proceso de consentimiento de anuncios:", error);
      }
    };
    prepareAds();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdsContext.Provider value={canRequestAds}>
      {children}
    </AdsContext.Provider>
  );
}

export function BannerPublicidad(props) {
  const canRequestAds = useContext(AdsContext);
  if (!canRequestAds) return null;
  return (
    <BannerAd
      {...props}
      requestOptions={{
        ...props.requestOptions,
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
}

export function usePuedeSolicitarAnuncios() {
  return useContext(AdsContext);
}
