import React from 'react';
import { Platform, StyleSheet, View, AsyncStorage } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import StartingPage from './navigation/StartingPage';
import AppNavigator from './navigation/AppNavigator';
import Config from './Config/Config';
import Global from './screens/Global';
import Theme from './screens/Theme';
import SecureFetch from './screens/SecureFetch';
import setEnvironment from './Config/SetEnvironment';
import AnimatedLoading from './components/AnimatedLoading';
import SplashScreen from './components/SplashScreen';
import * as Linking from 'expo-linking';

console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      device_token: '',
      appData: '',
      isLoading: true,
      offlineData: '',
      langKey: '',
      languageCode: '',
      ModifiedStatus: '',
      responseStatus: '',
      langData: '',
      NoneMatch: '',
      languageCode: '',
      childBasepath: '',
      childID: ''
    };
    AsyncStorage.getItem('LanguageCode').then(languageCode => this.setState({ languageCode }), () => { });
    AsyncStorage.getItem('selectLanguage').then(langKey => this.setState({ langKey }), () => { });
  }

  async componentDidMount() {
    this.handleConnectivityChange();
    this.timerID = setTimeout(() => { this.splashInterval() }, 5000);
    NetInfo.addEventListener(state => { this.handleConnectivityChange(state.isConnected) });
    AsyncStorage.getItem('Device_token').then(device_token => this.setState({ device_token }), () => { });
    AsyncStorage.getItem('IfNoneMatch').then(NoneMatch => this.setState({ NoneMatch }), () => { });
    AsyncStorage.getItem('childBasepath').then(childBasepath => this.setState({ childBasepath }), () => { });
    AsyncStorage.getItem('childID').then(childID => this.setState({ childID }), () => { });
  }

  handleConnectivityChange = isConnected => {
    Global.NetworkInfo = isConnected;
    if (Global.NetworkInfo === true) {
      Global.NetworkInfo = isConnected;
      this.checkAppStaringKey();
    } else if (Global.NetworkInfo === false) {
      Global.NetworkInfo = isConnected;
      SecureFetch.getItem('offlineAppData')
        .then(appData => this.setState({ appData }, () => {
          Global.data = this.state.appData;
          SecureFetch.SetFondSize(this.state.languageCode);
          Global.TabIconColor = Config.TabIconColor;
          this.setState({ isLoadingComplete: true });
        }))
    }
  };

  async checkAppStaringKey() {
    var AppStaringKey = await AsyncStorage.getItem('AppStaringKey');
    if (AppStaringKey == null) {
      if (Config.TestMode == false) {
        this.getLangJsonData();
      } else {
        this.setState({ isLoadingComplete: true });
      }
    } else {
      this.getJSONData('GetAppInfo?', this.state.childID, this.state.childBasepath);
      SecureFetch.SetFondSize(this.state.languageCode);
    }
  }

  async getLangJsonData() {
    const response = await SecureFetch.getLanguageJSON('GetAppInfo?');
    var result;
    this.state.responseStatus = response.status;
    if (response.status == 200) {
      result = await response.json()
      this.setState({ langData: result }, () => {
        Global.Language = this.state.langData;
        this.setState({ isLoadingComplete: true });
      })
    } else {
      alert('Something went wrong, please try again later');
    }
  }

  async getJSONData(apiMethod, cid, basepath) {
    console.log('app.js..' + cid, basepath);
    const response = await SecureFetch.getJSON('GetAppInfo?', this.state.childID = Config.Cid, this.state.childBasepath = Config.Basepath)
    console.log('app.js..' + response.status);
    var result;
    this.state.responseStatus = response.status;
    Global.ResponseStatus = this.state.responseStatus;
    if (response.status == 200) {
      result = await response.json()
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
        this.setState({ isLoadingComplete: true });
      })
    } else {
      console.log('else block app.js')
      SecureFetch.getItem('offlineAppData')
        .then(appData => this.setState({ appData }, () => {
          if (this.state.appData != null) {
            Global.data = this.state.appData;
            Global.TabIconColor = Theme.setColorTheme('TabIconColor');
            this.setState({ isLoadingComplete: true });
          } else {
            this.fetchIfAsyncNull();
          }
        }))
    }
  }

  async fetchIfAsyncNull() {
    var AppLoadingKey = await AsyncStorage.getItem('AppLoadingKey');
    if (AppLoadingKey == null) {
      await AsyncStorage.setItem('AppLoadingKey', 'true');
      this.setState({ isLoadingComplete: true });
    } else {
      await AsyncStorage.setItem('IfNoneMatch', '');
      const response = await SecureFetch.getJSON('GetAppInfo?', this.state.childID, this.state.childBasepath)
      var result = await response.json();
      Global.data = result;
      Global.TabIconColor = Theme.setColorTheme('TabIconColor');
      this.setState({ isLoadingComplete: true });
    }
  }

  splashInterval() {
    this.setState({ isLoading: false })
  }

  render() {
    AsyncStorage.getItem('LanguageCode').then(languageCode => this.setState({ languageCode }), () => { });
    Global.LanguageCode = this.state.languageCode;
    Global.IfNoneMatch = this.state.NoneMatch;
    Global.PlatformInfo = Platform.OS;
    Global.DeviceId = this.state.device_token;
    let companyLogo = Config.Basepath.includes('agri');

    return (
      <View style={styles.container}>
        {
          this.state.isLoadingComplete === true ?
            Config.TestMode != true ?
              this.state.langKey == "True" ?
                <AppNavigator />
                : <StartingPage />
              : <StartingPage />
            : this.state.isLoading ?
              <SplashScreen />
              : <View style={styles.containerStyles}>
                <AnimatedLoading />
              </View>
        }
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch'
  },
  containerStyles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});