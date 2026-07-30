import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const SPLASH_FALLBACK_MS = 2500;

type AnimatedSplashOverlayProps = {
  onFinish?: () => void;
};

export function AnimatedSplashOverlay({ onFinish }: AnimatedSplashOverlayProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});

    const timer = setTimeout(() => {
      setVisible(false);
    }, SPLASH_FALLBACK_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      onFinish?.();
    }
  }, [visible, onFinish]);

  if (!visible) return null;

  return (
    <View style={styles.splashOverlay} pointerEvents="none">
      <Image style={styles.image} source={require('@assets/images/expo-logo.png')} />
    </View>
  );
}

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Image style={styles.image} source={require('@assets/images/expo-logo.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
    zIndex: 100,
  },
  image: {
    width: 76,
    height: 71,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
