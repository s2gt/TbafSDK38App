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
import MoreScreen from '../More/MoreScreen';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
var appTransaction;

export default class Currency extends Component {
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
    appTransaction = Global.data.translations;

  }

  renderCurrency() {

    return this.state.currency.map((currency) => {

      return (
        <TouchableOpacity onPress={() => this.onSelectLanguage(currency)}
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

  onSelectLanguage = (currency) => {
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
      this.props.navigation.navigate('MoreScreen');
    } else {
      alert("Please select a currency");
    }
  }

  handleBackNavigation() {
    this.props.navigation.navigate('MoreScreen');
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
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  getTranslationText(translationID, defaultText) {
    if (entities.decode(appTransaction[translationID]) != '') {
      return entities.decode(appTransaction[translationID]);
    } else {
      return defaultText;
    }
  }

  render() {
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.footerColor = Theme.setHeaderAndFooterColor('footer-color');
    this.state.footerTitleColor = Theme.setHeaderAndFooterColor('footer-titleColor');
    this.state.backIconColor = Theme.setColorTheme('BackIconColor');
    this.state.networkInfo = Global.NetworkInfo;
    this.state.sourcePage = this.props.navigation.getParam('sourcePage');

    return (
      <View style={styles.mainView}>

        <View style={[styles.HeaderSubView, { backgroundColor: this.state.backgroundColor }]}>
          <Text style={[styles.headerTitleStyles, { color: this.state.titleColor }]}>
            {Global.data.company.name}
          </Text>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}>
          <View style={{ marginTop: 22 }}>
            <View>
              <ActivityIndicator size="large" color={'#1594A1'} />
            </View>
          </View>
        </Modal>
        {
          this.state.networkInfo == false ? <OnlineCheckerToast /> :
            <View style={styles.subView}>
              <View style={styles.outerlangStyles}>

                <ScrollView>
                  <View>
                    {this.renderCurrency()}
                  </View>
                </ScrollView>

              </View>
              <View style={styles.btnStyles}>
                <View style={styles.submitStyle}>
                  <Button title='Submit' color={Config.ButtonColor} onPress={() => { this.handleNavigation() }} />
                </View>
              </View>
            </View>
        }

        <View style={[styles.viewStyles, { backgroundColor: this.state.footerColor }]}>
          <TouchableOpacity style={styles.iconBackStyle} onPress={() => this.handleBackNavigation()}>
            <Icon name='chevron-left' size={25} color={this.state.backIconColor} />
            <Text style={[styles.TextStyles, { fontSize: Global.TxtFontSize, color: this.state.footerTitleColor }]}>{this.getTranslationText('mbl-SelectCurrency', 'Currency')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  HeaderSubView: {
    alignSelf: 'baseline',
    justifyContent: 'center',
    width: '100%',
  },
  headerTitleStyles: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '12%',
    marginBottom: '5%',
    flexWrap: 'wrap'
  },
  subView: {
    height: '65%',
    marginTop: '4%',
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
  submitStyle: {
    marginRight: '5%'
  },
  iconBackStyle: {
    justifyContent: 'flex-start',
    marginLeft: '8%',
    marginTop: '3%',
    width: '100%',
    flexDirection: 'row'
  },
  TitleStyles: {
    justifyContent: 'center',
    width: '80%'
  },
  viewStyles: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    height: hp('7%'),
    flexDirection: 'row',
  },
  TextStyles: {
    fontWeight: 'bold',
    marginLeft: '4%',
  },
});