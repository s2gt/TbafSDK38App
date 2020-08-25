import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

export default class HomeScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Screen One</Text>
        <Button title="Go to two"
          onPress={() => this.props.navigation.navigate('SecondScreen')}
        />
      </View>
    );
  }
}
