import React, { Component } from 'react';
import { Image } from 'react-native';

export default class HelloWorldApp extends Component {
  render() {
    return (
      <Image style={{ height: 45, resizeMode: 'contain' }}
        source={require('../assets/images/NamLogo.png')} />
    );
  }
};