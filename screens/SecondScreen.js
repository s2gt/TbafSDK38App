import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

export default class SecondScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Screen One</Text>
        <Button title="Go to one"
          onPress={() => this.props.navigation.navigate('HomeScreen')}
        />
      </View>
    );
  }
}
