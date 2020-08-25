import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, ScrollView,
  AsyncStorage, Modal, ActivityIndicator, Button, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Config from '../../Config/Config';
import Global from '../Global';
import Theme from '../Theme';
import AppNavigator from '../../navigation/AppNavigator';
import OnlineCheckerToast from '../OflineSection/OnlineCheckerToast';
import SecureFetch from '../SecureFetch';
import AnimatedLoading from '../../components/AnimatedLoading';
import AllProduct from '../Vehicle/AllProduct';
import ProductCategories from '../Vehicle/ProductCategories';
import HomeScreen from '../Home/HomeScreen';
import PoweredByLogo from '../../components/PoweredByLogo';

export default class CurrencyScreen extends Component {
  static navigationOptions = { header: null, };
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      data: '',
      currencyCode: '',
      currencyRate: '',
      currencyPrefix: '',
      currencySuffix: '',
      currencyDelimeter: '',
      currencyName: '',
      networkInfo: '',
      currency: ''
    };
    this.fetchCurrency();
  }

  renderLanguage() {
    return this.state.currency.map((currency) => {
      return (
        <TouchableOpacity onPress={() => this.onSelectCurrency(currency)}
          key={currency.code}>
          <Text style={{
            fontSize: 20
            , textAlign: 'left'
            , marginBottom: '1%'
            , marginRight: '1%'
            , justifyContent: 'center'
            , marginLeft: '1%'
            , flexWrap: 'wrap'
            , color: Config.TxtColor
            , backgroundColor: (this.state.currencyCode === currency.code) ? this.state.color : 'white'
          }}>
            {
              currency.name + "/" + currency.code
            }
          </Text>
        </TouchableOpacity>
      );
    });
  }

  onSelectCurrency = (currency) => {
    this.state.currencyCode = currency.code;
    this.state.currencyName = currency.name;
    this.state.currencyRate = currency.rate;
    this.state.currencyPrefix = currency.prefix;
    this.state.currencySuffix = currency.suffix;
    this.state.currencyDelimeter = currency.delimeter;
    this.setState({ color: '#b2dfdb' });
  }

  handleNavigation() {
    if (this.state.currencyCode != '') {
      AsyncStorage.setItem('CurrencyRate', (this.state.currencyRate).toString());
      AsyncStorage.setItem('CurrencyPrefix', this.state.currencyPrefix);
      AsyncStorage.setItem('CurrencySuffix', this.state.currencySuffix);
      AsyncStorage.setItem('CurrencyDelimeter', this.state.currencyDelimeter);
      AsyncStorage.setItem('CurrencyCode', this.state.currencyCode);
      this.onNavigate();
    } else {
      alert("Please select a currency");
    }
  }

  onNavigate() {
    if (Global.ChangeLocation) {
      console.log('change Location' + Global.ChangeLocation);
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
      console.log('change Location' + Global.ChangeLocation);
      this.props.navigation.navigate('AppNavigator');
    }
  }

  fetchCurrency() {
    let result = [];
    for (var prop in Global.data.currencies) {
      if (Object.prototype.hasOwnProperty.call(Global.data.currencies, prop)) {
        var currencyItem = prop;
        result.push(Global.data.currencies[currencyItem]);
        this.state.currency = result;
      }
    }
    if (result.length == 1) {
      AsyncStorage.setItem('CurrencyRate', (result[0].rate).toString());
      AsyncStorage.setItem('CurrencyPrefix', result[0].prefix);
      AsyncStorage.setItem('CurrencySuffix', result[0].suffix);
      AsyncStorage.setItem('CurrencyDelimeter', result[0].delimeter);
      AsyncStorage.setItem('CurrencyCode', result[0].code);
      this.onNavigate();
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    this.state.networkInfo = Global.NetworkInfo;
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    let companyLogo = Config.Basepath.includes('agri');
    return (
      <View style={styles.mainView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}>
          <View style={{ marginTop: 22 }}>
            <View>
              <AnimatedLoading />
            </View>
          </View>
        </Modal>
        {
          this.state.networkInfo == false ? <OnlineCheckerToast /> :
            <View style={styles.subView}>
              <View style={styles.languageStyles}>
                <PoweredByLogo />
              </View>
              <View>
                <View style={styles.outerlangStyles}>
                  <ScrollView>
                    <View>
                      {this.renderLanguage()}
                    </View>
                  </ScrollView>
                </View>
                <View style={styles.btnStyles}>
                  <Button title='Start' color={Config.ButtonColor} onPress={() => { this.handleNavigation() }} />
                </View>
              </View>
            </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: '8%',
    marginBottom: '30%',
  },
  subView: {
    height: '80%',
    marginTop: '15%',
  },
  languageStyles: {
    alignItems: 'center'
  },
  outerlangStyles: {
    marginRight: '10%',
    marginLeft: '10%',
    marginTop: '5%',
    marginBottom: '1%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#9B9B9B',
  },
  btnStyles: {
    justifyContent: 'center',
    marginTop: '5%',
    marginLeft: '10%',
    marginRight: '10%',
  },
  linkAlign: {
    width: '100%',
    marginLeft: '7%',
    marginRight: '7%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: '8%',
    flex: 1,
    color: '#3498DB'
  },
});