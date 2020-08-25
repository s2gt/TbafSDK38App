import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, ScrollView, AsyncStorage,
  Modal, ActivityIndicator, Button, Image, BackHandler
} from 'react-native';
import Config from '../../Config/Config';
import Global from '../Global';
import OnlineCheckerToast from '../OflineSection/OnlineCheckerToast';
import SecureFetch from '../SecureFetch';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Theme from '../Theme';
import AppNavigator from '../../navigation/AppNavigator';

var appTitle;
var appTransaction;
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

export default class Language extends Component {
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
      backgroundColor: '',
      titleColor: '',
      footerColor: '',
      appData: '',
      footerTitleColor: '',
      sourcePage: '',
      parentPage: '',
      backIconColor: '',
      childBasepath: '',
      childID: ''
    };
    this.state.language = Global.data.languages;
    appTitle = Global.data.company.name;
    appTransaction = Global.data.translations;
    this.state.parentPage = this.props.navigation.getParam('parentPage');
    this.getAsyncValues()
  }

  async getAsyncValues() {
    this.state.childBasepath = await AsyncStorage.getItem('childBasepath');
    this.state.childID = await AsyncStorage.getItem('childID');
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
            , fontFamily: Config.Font
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

  handleNavigation = () => {
    this.setModalVisible(true);
    if (this.state.languageName != '') {
      this.setConfigJsonData(this.state.childID, this.state.childBasepath);
      AsyncStorage.setItem('selectLanguage', 'True');
      if (this.state.languageLabel != '') {
        AsyncStorage.setItem('Language', this.state.languageName + "/" + this.state.languageLabel);
      } else {
        AsyncStorage.setItem('Language', this.state.languageName);
      }
      AsyncStorage.setItem('LanguageCode', this.state.languageCode);
      Global.LanguageCode = this.state.languageCode;
      SecureFetch.SetFondSize(this.state.languageCode);
    } else {
      this.setModalVisible(false);
      alert("Please select a language");
    }
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleBackNavigation();
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackNavigation() {
    if (this.state.sourcePage == 'Search') {
      this.props.navigation.navigate(this.state.sourcePage, { data: '', sourcePage: this.state.parentPage });
    } else {
      this.props.navigation.navigate(this.state.sourcePage);
    }
  }

  async setConfigJsonData(childID, childBasepath) {
    var childID = childID.replace("+", "");
    var bPath = childBasepath.includes('https://') ? childBasepath : 'https://' + childBasepath + '/';
    const response = await SecureFetch.getJSON('GetAppInfo?', childID, bPath)
    var result;
    this.state.responseStatus = response.status;
    Global.ResponseStatus = this.state.responseStatus;
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
    if (response.status == 200) {
      result = await response.json()
      this.setState({ appData: result }, () => {
        AsyncStorage.setItem('offlineAppData', JSON.stringify(this.state.appData));
        Global.data = this.state.appData;
        Global.TabIconColor = Theme.setColorTheme('TabIconColor');
        this.setModalVisible(false);
        this.handleBackNavigation();
      })
    } else {
      SecureFetch.getItem('offlineAppData')
        .then(appData => this.setState({ appData }, () => {
          if (this.state.appData != null) {
            Global.data = this.state.appData;
            Global.TabIconColor = Theme.setColorTheme('TabIconColor');
            this.setModalVisible(false);
            this.props.navigation.navigate(this.state.sourcePage);
          } else {
            this.fetchOfflineData();
          }
        }))
    }
  }

  async fetchOfflineData() {
    AsyncStorage.setItem('IfNoneMatch', '');
    const response = await SecureFetch.getJSON('GetAppInfo?')
    var result = await response.json();
    Global.data = result;
    Global.TabIconColor = Theme.setColorTheme('TabIconColor');
    this.setModalVisible(false);
    this.props.navigation.navigate(this.state.sourcePage);
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
            {entities.decode(appTitle)}
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
                    {this.renderLanguage()}
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
            <Text style={[styles.TextStyles, { fontSize: Global.TxtFontSize, color: this.state.footerTitleColor }]}>{this.getTranslationText('mbl-Back', 'Back')}</Text>
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