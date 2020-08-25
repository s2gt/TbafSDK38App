import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import { Badge } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import Theme from '../screens/Theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import Checkout from '../screens/More/Checkout';

const ShoppingCartIcon = (props) => (
    <View>
        <Button transparent onPress={() => props.navigation.navigate('Checkout')}>
            <Icon name="shopping-cart" size={22} color={props.color} />
        </Button>
        <Badge
            value={props.countReducer}
            containerStyle={{ position: 'absolute', top: 0, right: 0 }}
        />
    </View>
)

const mapStateToProps = (state) => {
    AsyncStorage.setItem('bcount', JSON.stringify(state.count.count));
    return {
        countReducer: state.count.count
    }
}

export default connect(mapStateToProps)(withNavigation(ShoppingCartIcon));