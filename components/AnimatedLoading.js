import React from 'react';
import { StyleSheet, View, Animated, Image, Easing } from 'react-native';

export default class App extends React.Component {
  constructor() {
    super();
    this.RotateValueHolder = new Animated.Value(0);
  }

  componentDidMount() {
    this.StartImageRotateFunction();
  }

  StartImageRotateFunction() {
    this.RotateValueHolder.setValue(0);
    Animated.timing(this.RotateValueHolder, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
    }).start(() => this.StartImageRotateFunction());
  }

  render() {
    const RotateData = this.RotateValueHolder.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const RotateData1 = this.RotateValueHolder.interpolate({
      inputRange: [0, 1],
      outputRange: ['360deg', '0deg'],
    });

    return (
      <View style={styles.container}>
        <Animated.Image
          style={{
            width: 50,
            height: 50,
            transform: [{ rotate: RotateData }],
            marginRight: 40,
          }}
          source={require('../assets/images/gearIcon.png')}
        />
        <Animated.Image
          style={{
            width: 30,
            height: 30,
            transform: [{ rotate: RotateData1 }],
            marginLeft: 5,
            marginTop: -4,
          }}
          source={require('../assets/images/gearIcon.png')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
});
