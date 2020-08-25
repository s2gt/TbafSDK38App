import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import HTMLView from 'react-native-htmlview';
import Global from '../Global';
import SecureFetch from '../SecureFetch';
import Theme from '../Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';
import Config from '../../Config/Config';

let apimethod;

export default class StaticPageDescription extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      params: '',
      txtColor: '',
      font: '',
      footerTitleColor: '',
      backgroundColor: '',
      footerColor: '',
      backIconColor: '',
      buyerId: '',
      url: '',
      utag: '',
      childBasepath: '',
      CurrencyCode: '',
      languageCode: '',
    }
    this.handleRefresh();
  }

  async handleRefresh() {
    this.setState({ languageCode: await AsyncStorage.getItem('LanguageCode') });
    this.setState({ CurrencyCode: await AsyncStorage.getItem('CurrencyCode') });
    this.setState({ buyerId: await AsyncStorage.getItem('Bid') });
    this.setState({ childBasepath: await AsyncStorage.getItem('childBasepath') });
    apimethod = this.props.navigation.getParam('apimethod');
    this.getWebViewURL();
  }

  async getWebViewURL() {
    let utag;
    if (await AsyncStorage.getItem('utag')) {
      utag = await AsyncStorage.getItem('utag');
    }
    this.setState({
      url: SecureFetch.getWebViewURL(apimethod
        , this.state.buyerId
        , this.state.languageCode
        , this.state.CurrencyCode
        , this.state.childBasepath
        , utag)
    })
  }

  handleBackNavigation() {
    this.props.navigation.goBack();
  }

  render() {
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.footerColor = Theme.setHeaderAndFooterColor('footer-color');
    this.state.footerTitleColor = Theme.setHeaderAndFooterColor('footer-titleColor');
    this.state.font = Theme.setFont();
    this.state.txtColor = Theme.setColorTheme('TxtColor');
    this.state.backIconColor = Theme.setColorTheme('BackIconColor');
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    // const apimethod = this.props.navigation.getParam('apimethod');
    // const CurrencyCode = this.props.navigation.getParam('CurrencyCode');
    // const languageCode = this.props.navigation.getParam('languageCode');
    // const buyerId = this.props.navigation.getParam('buyerId');

    return (
      <View style={styles.MainView}>

        <View style={[styles.SubView, { backgroundColor: this.state.backgroundColor }]}>
          <Text style={[styles.headerTitleStyles, { color: this.state.titleColor }]}>
            {entities.decode(Global.data.company.name)}
          </Text>
        </View>

        <WebView
          style={{ marginBottom: '10%' }}
          source={{ uri: this.state.url }}
          ref={ref => (this.WEBVIEW_REF = ref)}
          javaScriptEnabledAndroid={true}
          cacheMode={"LOAD_NO_CACHE"}
        />

        <View style={[styles.viewStyles, { backgroundColor: this.state.footerColor }]}>
          <TouchableOpacity style={styles.iconBackStyle} onPress={() => this.handleBackNavigation()}>
            <Icon name='chevron-left' size={25} color={this.state.backIconColor} />
            <Text style={[styles.TextStyles, { fontSize: Global.TxtFontSize, color: this.state.footerTitleColor }]}>{SecureFetch.getTranslationText('mbl-Back', 'Back')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainView: {
    flex: 1,
    flexDirection: 'column',
  },
  subView: {
    flex: 1,
    marginBottom: '8%',
    marginLeft: '2%'
  },
  iconBackStyle: {
    justifyContent: 'flex-start',
    marginLeft: '8%',
    marginTop: '3%',
    width: '100%',
    flexDirection: 'row'
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
  headerTitleStyles: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '12%',
    marginBottom: '5%',
    flexWrap: 'wrap'
  },
  SubView: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 6,
  }
});