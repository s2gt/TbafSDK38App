import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Image
          source={require('../assets/images/NamLogoGif.gif')}
          style={{ width: 200, height: 200 }}
        />
      </View>
      <View style={styles.footer}>
        <Image
          source={require('../assets/images/NamLogo.png')}
          style={{ width: 200, height: 50, resizeMode: 'contain' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    height: 100
  },
});