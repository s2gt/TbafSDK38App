import React, { Component } from 'react'
import { StyleSheet, View, AsyncStorage, Text } from 'react-native'
import HomeScreen from '../screens/Home/HomeScreen';
import AllProduct from '../screens/Vehicle/AllProduct';
import ProductCategories from '../screens/Vehicle/ProductCategories';
import Global from '../screens/Global';
import { DotIndicator } from 'react-native-indicators';
import ChildCategory from '../screens/More/ChildCategory';

var childID = '';

class InitialLoading extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
    }
    console.log('Global.ChildCategories ' + Global.ChildCategories)
  }

  componentDidMount() {
    this.fetchChildCategories();
  }

  fetchChildCategories() {
    if (Global.ChildCategories === true || Global.data.stores.length === 0) {
      if (Global.data.company.apptheme === 'ECOMMERCE') {
        if (Global.data.company.display_cats === 'No') {
          this.props.navigation.navigate('AllProduct');
        } else {
          this.props.navigation.navigate('ProductCategories');
        }
      } else {
        this.props.navigation.navigate('HomeScreen');
      }
    } else {
      this.props.navigation.navigate('ChildCategory');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.companyText}>Loading</Text>
        <DotIndicator color="black" size={10} count={3} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: '70%'
  },
  companyText: {
    fontSize: 20,
    color: '#3f51b5'
  }
})

export default InitialLoading;
