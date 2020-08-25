import React, { Component } from 'react'
import { StyleSheet, View, AsyncStorage, Text, Image } from 'react-native'
import HomeScreen from '../screens/Home/HomeScreen';
import AllProduct from '../screens/Vehicle/AllProduct';
import ProductCategories from '../screens/Vehicle/ProductCategories';
import Global from '../screens/Global';
import SecureFetch from '../screens/SecureFetch';
import Theme from '../screens/Theme';
import { DotIndicator } from 'react-native-indicators';
import { connect } from 'react-redux';
import * as countActions from '../actions/counts';
import { bindActionCreators } from 'redux';
import { withNavigation } from 'react-navigation';
import { BlurView } from 'expo-blur';

var childID = '';

class Loading extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      bpath: '',
      cid: '',
      buyerId: '',
      name: '',
      categoryName: '',
      categoryImage: ''
    }
    this.getParamsData();
    this.getCategoryImage();
  }

  async getParamsData() {
    this.setState({ buyerId: await AsyncStorage.getItem('Bid') });
    this.state.cid = this.props.navigation.getParam('cid');
    this.state.bpath = this.props.navigation.getParam('bpath');
    this.setConfigJsonData(this.state.cid, this.state.bpath);
  }

  async setConfigJsonData(Cid, Basepath) {
    childID = Cid.replace("+", "");
    var childBasepath = 'https://' + Basepath + '/';
    AsyncStorage.setItem('childBasepath', childBasepath);
    AsyncStorage.setItem('childID', childID);
    const response = await SecureFetch.getJSON('GetAppInfo?', childID, childBasepath)
    var result;
    this.state.responseStatus = response.status;
    Global.ResponseStatus = this.state.responseStatus;
    if (response.status == 200) {
      result = await response.json();
      var setCookie = require('set-cookie-parser');
      var combinedCookieHeader = response.headers.get('Set-Cookie');
      var splitCookieHeaders = setCookie.splitCookiesString(combinedCookieHeader)
      var cookies = setCookie.parse(splitCookieHeaders);
      for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].name == 'ETag') {
          Global.IfNoneMatch = cookies[i].value;
          AsyncStorage.setItem('IfNoneMatch', Global.IfNoneMatch);
        }
      }
      this.setState({ appData: result }, () => {
        AsyncStorage.setItem('offlineAppData', JSON.stringify(this.state.appData));
        Global.EnabledEvents = [];
        Global.data = this.state.appData;
        Global.TabIconColor = Theme.setColorTheme('TabIconColor');
        this.onNavigate()
      })
    } else if (response.status == 304) {
      SecureFetch.getItem('offlineAppData')
        .then(appData => this.setState({ appData }, () => {
          if (this.state.appData != null) {
            Global.data = this.state.appData;
            Global.TabIconColor = Theme.setColorTheme('TabIconColor');
            this.onNavigate()
          } else {
            this.fetchIfAsyncNull();
          }
        }))
    } else {
      alert(SecureFetch.getTranslationText('mbl-InternetConnection', 'Your intenet is unstable, please connect and try again later.'));
    }
  }

  onNavigate() {
    let { count, actions } = this.props;
    let objIndex = Global.CartCount.findIndex((obj => obj.id === childID));
    if (objIndex >= 0) {
      console.log('Loading page countIndex..' + objIndex);
      count = Global.CartCount[objIndex].value;
      actions.changeCount(count);
    } else {
      count = 0;
      actions.changeCount(count);
    }

    if (Global.data.company.apptheme === 'ECOMMERCE') {
      if (Global.data.company.display_cats === 'No') {
        this.props.navigation.navigate('AllProduct');
      } else {
        this.props.navigation.navigate('ProductCategories');
      }
    } else {
      this.props.navigation.navigate('HomeScreen');
    }
  }

  async fetchIfAsyncNull() {
    AsyncStorage.setItem('IfNoneMatch', '');
    const response = await SecureFetch.getJSON('GetAppInfo?')
    var result = await response.json();
    Global.data = result;
    Global.TabIconColor = Theme.setColorTheme('TabIconColor');
    this.setModalVisible(false);
    this.onNavigate()
  }

  async getCategoryImage() {
    this.state.categoryName = await this.props.navigation.getParam('category');
    let categoryArr = this.state.categoryName.split(',');
    let str = categoryArr[0].replace(/\s/g, '');
    if (str.includes('Bakeries')) {
      this.state.categoryImage = require('../assets/images/Bakeries.jpg');
    } else if (str.includes('BeautyAndCosmetics')) {
      this.state.categoryImage = require('../assets/images/BeautyAndCosmetics.jpg');
    } else if (str.includes('Dairy')) {
      this.state.categoryImage = require('../assets/images/Dairy.jpg');
    } else if (str.includes('FarmerProducerCompany')) {
      this.state.categoryImage = require('../assets/images/FarmerProducerCompany.jpg');
    } else if (str.includes('Fish')) {
      this.state.categoryImage = require('../assets/images/Fish.jpg');
    } else if (str.includes('FlowerShops')) {
      this.state.categoryImage = require('../assets/images/FlowerShops.jpg');
    } else if (str.includes('FoodAndRestaurant')) {
      this.state.categoryImage = require('../assets/images/FoodAndRestaurant.jpg');
    } else if (str.includes('FruitShops')) {
      this.state.categoryImage = require('../assets/images/FruitShops.jpg');
    } else if (str.includes('GroceryStores')) {
      this.state.categoryImage = require('../assets/images/GroceryStores.jpg');
    } else if (str.includes('HardwareAndElectricals')) {
      this.state.categoryImage = require('../assets/images/HardwareAndElectricals.jpg');
    } else if (str.includes('HomeImprovements')) {
      this.state.categoryImage = require('../assets/images/HomeImprovements.jpg');
    } else if (str.includes('Laundry')) {
      this.state.categoryImage = require('../assets/images/Laundry.jpg');
    } else if (str.includes('OilMarts')) {
      this.state.categoryImage = require('../assets/images/OilMarts.jpg');
    } else if (str.includes('OrganicShops')) {
      this.state.categoryImage = require('../assets/images/OrganicShops.jpg');
    } else if (str.includes('PetShops')) {
      this.state.categoryImage = require('../assets/images/PetShops.jpg');
    } else if (str.includes('Pharmacies')) {
      this.state.categoryImage = require('../assets/images/Pharmacies.jpg');
    } else if (str.includes('RiceMandis')) {
      this.state.categoryImage = require('../assets/images/RiceMandis.jpg');
    } else if (str.includes('Supermarkets')) {
      this.state.categoryImage = require('../assets/images/Supermarkets.jpg');
    } else if (str.includes('VegetableShops')) {
      this.state.categoryImage = require('../assets/images/VegetableShops.jpg');
    } else if (str.includes('Water')) {
      this.state.categoryImage = require('../assets/images/Water.jpg');
    } else {
      this.state.categoryImage = require('../assets/images/Default.jpg');
    }
  }

  render() {
    this.state.name = this.props.navigation.getParam('cName');

    return (
      <View>
        <Image style={styles.blurredImage}
          source={this.state.categoryImage}
        />
        <BlurView
          intensity={150}
          style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}>
          <Text style={styles.text}>
            {SecureFetch.getTranslationText('mbl-Entering', 'Entering')}
          </Text>
          <Text style={styles.companyText}>{this.state.name}</Text>
          <DotIndicator color="black" size={10} count={3} />
        </BlurView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  blurredImage: {
    width: '100%',
    height: '100%',
  },
  nonBlurredContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    width: '80%',
    marginTop: '75%',
    marginLeft: '10%',
    marginRight: '10%'
  },
  text: {
    fontSize: 30,
  },
  companyText: {
    fontSize: 20,
    color: '#3f51b5'
  }
});

const mapStateToProps = state => ({
  count: state.count.count
});

const ActionCreators = Object.assign({}, countActions);

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Loading));
