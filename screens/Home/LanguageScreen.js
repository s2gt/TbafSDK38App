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
import CurrencyScreen from './CurrencyScreen';
import ChildCategoriesScreen from '../Stores/ChildCategoriesScreen';
import AnimatedLoading from '../../components/AnimatedLoading';
import { DotIndicator } from 'react-native-indicators';
import PoweredByLogo from '../../components/PoweredByLogo';

export default class LanguageScreen extends Component {
  static navigationOptions = { header: null, };
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      data: '',
      languageCode: '',
      languageLabel: '',
      languageName: '',
      networkInfo: '',
      language: '',
      appData: ''
    };

    if (Global.Language.languages) {
      this.state.language = Global.Language.languages;
    } else {
      this.state.language = Global.data.languages;
    }

    if (Global.ChangeLocation === true) {
      this.setConfigJsonData();
    } else {
      this.checkLanguage();
    }
  }

  checkLanguage() {
    if (this.state.language.length == 1) {
      AsyncStorage.setItem('selectLanguage', 'True');
      AsyncStorage.setItem('AppStaringKey', 'true');
      if (this.state.language[0].label != '') {
        AsyncStorage.setItem('Language', this.state.language[0].name + "/" + this.state.language[0].label);
      } else {
        AsyncStorage.setItem('Language', this.state.language[0].name);
      }
      AsyncStorage.setItem('LanguageCode', this.state.language[0].code);
      SecureFetch.SetFondSize(this.state.language[0].code);
      this.setConfigJsonData();
    }
  }

  renderLanguage() {

    return this.state.language.map((language) => {

      return (
        <TouchableOpacity onPress={() => this.onSelectLanguage(language)}
          key={language.name}>
          <Text style={{
            fontSize: 20
            , textAlign: 'left'
            , marginBottom: '1%'
            , marginRight: '1%'
            , justifyContent: 'center'
            , marginLeft: '1%'
            , flexWrap: 'wrap'
            , color: Config.TxtColor
            , backgroundColor: (this.state.languageCode === language.code) ? this.state.color : 'white'
          }}>
            {
              language.label != '' ? language.name + "/" + language.label : language.name
            }
          </Text>
        </TouchableOpacity>
      );
    });
  }

  onSelectLanguage = (language) => {
    this.state.languageCode = language.code;
    this.state.languageLabel = language.label;
    this.state.languageName = language.name;
    this.setState({ color: '#b2dfdb' });
  }

  handleNavigation() {
    this.setModalVisible(true);
    if (this.state.languageCode != '') {
      AsyncStorage.setItem('selectLanguage', 'True');
      AsyncStorage.setItem('AppStaringKey', 'true');
      if (this.state.languageLabel != '') {
        AsyncStorage.setItem('Language', this.state.languageName + "/" + this.state.languageLabel);
      } else {
        AsyncStorage.setItem('Language', this.state.languageName);
      }
      AsyncStorage.setItem('LanguageCode', this.state.languageCode);
      SecureFetch.SetFondSize(this.state.languageCode);
      this.setConfigJsonData();
    } else {
      this.setModalVisible(false);
      alert('Please select a language');
    }
  }

  async setConfigJsonData() {
    console.log('lang page');
    let basePath = Config.Basepath.includes('https://') ? Config.Basepath : 'https://' + Config.Basepath + '/';
    const response = await SecureFetch.getJSON('GetAppInfo?', Config.Cid, basePath);
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
        Global.data = this.state.appData;
        Global.TabIconColor = Theme.setColorTheme('TabIconColor');
        this.state.modalVisible = false;
        this.setModalVisible(false);
        this.onNavigate()
      })
    } else if (response.status == 304) {
      SecureFetch.getItem('offlineAppData')
        .then(appData => this.setState({ appData }, () => {
          if (this.state.appData != null) {
            Global.data = this.state.appData;
            Global.TabIconColor = Theme.setColorTheme('TabIconColor');
            this.state.modalVisible = false;
            this.setModalVisible(false);
            this.onNavigate()
          } else {
            this.fetchIfAsyncNull();
          }
        }))
    } else {
      alert(SecureFetch.getTranslationText('mbl-InternetConnection', 'Your intenet is unstable, please connect and try again later.'));
    }
  }

  async fetchIfAsyncNull() {
    AsyncStorage.setItem('IfNoneMatch', '');
    const response = await SecureFetch.getJSON('GetAppInfo?')
    var result = await response.json();
    Global.data = result;
    Global.TabIconColor = Theme.setColorTheme('TabIconColor');
    this.state.modalVisible = false;
    this.setModalVisible(false);
    this.onNavigate()
  }

  onNavigate() {
    if (Global.Latitude && Global.data.stores.length == 0) {
      this.props.navigation.navigate('ChildCategoriesScreen');
    } else {
      if (Global.data.stores.length >= 1) {
        AsyncStorage.setItem('StoreChildData', JSON.stringify(Global.data.stores));
        this.props.navigation.navigate('ChildCategoriesScreen');
      } else {
        console.log('else Lang Page storesLength..' + Global.data.stores.length)
        AsyncStorage.setItem('childBasepath', '');
        this.props.navigation.navigate('CurrencyScreen');
      }
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
          <View style={{
            justifyContent: "center",
            alignItems: "center"
          }}>
            <View>
              <ActivityIndicator size="large" color={'#1594A1'} />
            </View>
          </View>
        </Modal>
        {
          this.state.networkInfo == false ? <OnlineCheckerToast /> :
            <View style={styles.subView}>
              <View style={styles.languageStyles}>
                <PoweredByLogo />
              </View>
              {
                this.state.language.length == 1 || Global.ChangeLocation === true ?
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: '50%' }}>
                    <Text style={styles.companyText}>Loading</Text>
                    <DotIndicator style={{ marginTop: '-55%' }} color="black" size={10} count={3} />
                  </View> :
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
              }
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
  companyText: {
    fontSize: 20,
    color: '#3f51b5',
  }
});